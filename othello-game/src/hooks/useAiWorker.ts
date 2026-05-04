import { useCallback, useEffect, useRef } from 'react';
import type {
  AiWorkerResponse,
  PickMoveRequest,
} from '../workers/ai.worker';
import type { Board, Color, ValidMove } from '../engine/types';

interface PendingResolver {
  resolve: (move: ValidMove | null) => void;
  reject: (err: Error) => void;
  timeoutId: number;
}

/**
 * Hard cap on a single move-request. Mobile browsers occasionally kill
 * Web Workers under memory pressure without firing the 'error' event,
 * which leaves the Promise pending forever and the UI stuck in
 * `aiThinking=true`. If a request hasn't returned within this window we
 * assume the worker is dead, terminate it, respin a fresh one, and reject
 * the pending caller so the React layer can recover instead of freezing
 * the board on the human's next turn.
 */
const REQUEST_TIMEOUT_MS = 15000;

export interface UseAiWorker {
  /**
   * Ask the worker to pick a move. Returns a Promise that resolves with the
   * chosen `ValidMove`, or `null` when there are no legal moves. If a newer
   * request comes in before the previous one resolves, the older one is
   * cancelled (rejected).
   */
  requestMove: (board: Board, color: Color, level: number) => Promise<ValidMove | null>;
  /** Cancel any in-flight request without sending a new one. */
  cancel: () => void;
}

export function useAiWorker(): UseAiWorker {
  const workerRef = useRef<Worker | null>(null);
  const pendingRef = useRef<Map<number, PendingResolver>>(new Map());
  const counterRef = useRef(0);

  const spawnWorker = useCallback((): Worker => {
    const worker = new Worker(
      new URL('../workers/ai.worker.ts', import.meta.url),
      { type: 'module' },
    );
    worker.addEventListener('message', (event: MessageEvent<AiWorkerResponse>) => {
      const { requestId, move } = event.data;
      const pending = pendingRef.current.get(requestId);
      if (!pending) return;
      pendingRef.current.delete(requestId);
      window.clearTimeout(pending.timeoutId);
      pending.resolve(move);
    });
    worker.addEventListener('error', (event) => {
      for (const pending of pendingRef.current.values()) {
        window.clearTimeout(pending.timeoutId);
        pending.reject(new Error(event.message || 'AI worker error'));
      }
      pendingRef.current.clear();
    });
    return worker;
  }, []);

  useEffect(() => {
    workerRef.current = spawnWorker();
    return () => {
      for (const pending of pendingRef.current.values()) {
        window.clearTimeout(pending.timeoutId);
        pending.reject(new Error('AI worker terminated'));
      }
      pendingRef.current.clear();
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, [spawnWorker]);

  const cancel = useCallback(() => {
    for (const pending of pendingRef.current.values()) {
      window.clearTimeout(pending.timeoutId);
      pending.reject(new Error('Cancelled by newer request'));
    }
    pendingRef.current.clear();
  }, []);

  const requestMove = useCallback<UseAiWorker['requestMove']>(
    (board, color, level) =>
      new Promise<ValidMove | null>((resolve, reject) => {
        const worker = workerRef.current;
        if (!worker) {
          reject(new Error('AI worker not ready'));
          return;
        }
        cancel();
        const requestId = ++counterRef.current;
        const timeoutId = window.setTimeout(() => {
          // Worker hasn't responded — assume it died silently (mobile
          // memory pressure is the usual culprit). Tear it down, respin
          // a fresh one for the next request, and reject this caller so
          // the AI effect's `.finally` clears `aiThinking`.
          if (!pendingRef.current.has(requestId)) return;
          pendingRef.current.delete(requestId);
          workerRef.current?.terminate();
          workerRef.current = spawnWorker();
          reject(new Error('AI worker timeout'));
        }, REQUEST_TIMEOUT_MS);
        pendingRef.current.set(requestId, { resolve, reject, timeoutId });
        const request: PickMoveRequest = {
          type: 'pickMove',
          requestId,
          board,
          color,
          level,
        };
        worker.postMessage(request);
      }),
    [cancel, spawnWorker],
  );

  return { requestMove, cancel };
}

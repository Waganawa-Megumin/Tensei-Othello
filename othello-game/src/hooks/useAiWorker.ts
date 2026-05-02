import { useCallback, useEffect, useRef } from 'react';
import type {
  AiWorkerResponse,
  PickMoveRequest,
} from '../workers/ai.worker';
import type { Board, Color, ValidMove } from '../engine/types';

interface PendingResolver {
  resolve: (move: ValidMove | null) => void;
  reject: (err: Error) => void;
}

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

  useEffect(() => {
    const worker = new Worker(
      new URL('../workers/ai.worker.ts', import.meta.url),
      { type: 'module' },
    );
    worker.addEventListener('message', (event: MessageEvent<AiWorkerResponse>) => {
      const { requestId, move } = event.data;
      const pending = pendingRef.current.get(requestId);
      if (!pending) return;
      pendingRef.current.delete(requestId);
      pending.resolve(move);
    });
    worker.addEventListener('error', (event) => {
      for (const pending of pendingRef.current.values()) {
        pending.reject(new Error(event.message || 'AI worker error'));
      }
      pendingRef.current.clear();
    });
    workerRef.current = worker;
    return () => {
      for (const pending of pendingRef.current.values()) {
        pending.reject(new Error('AI worker terminated'));
      }
      pendingRef.current.clear();
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  const cancel = useCallback(() => {
    for (const pending of pendingRef.current.values()) {
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
        pendingRef.current.set(requestId, { resolve, reject });
        const request: PickMoveRequest = {
          type: 'pickMove',
          requestId,
          board,
          color,
          level,
        };
        worker.postMessage(request);
      }),
    [cancel],
  );

  return { requestMove, cancel };
}

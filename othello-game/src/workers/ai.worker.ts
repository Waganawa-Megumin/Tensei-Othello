/// <reference lib="webworker" />
import { getValidMoves } from '../engine/board';
import { pickAIMove } from '../engine/ai';
import type { EngineId } from '../engine/engines/types';
import type { Board, Color, ValidMove } from '../engine/types';
import { edaxPickMove } from './engines/edaxAdapter';

export interface PickMoveRequest {
  type: 'pickMove';
  requestId: number;
  /** Which back-end to use. Older callers that omit this default to
   *  Tensei Classic for backward compatibility (e.g. dev tooling). */
  engine?: EngineId;
  board: Board;
  color: Color;
  level: number;
}

export interface PickMoveResponse {
  type: 'pickMove';
  requestId: number;
  move: ValidMove | null;
}

export type AiWorkerRequest = PickMoveRequest;
export type AiWorkerResponse = PickMoveResponse;

const ctx = self as DedicatedWorkerGlobalScope;

ctx.addEventListener('message', (event: MessageEvent<AiWorkerRequest>) => {
  const msg = event.data;
  if (msg.type !== 'pickMove') return;
  const moves = getValidMoves(msg.board, msg.color);
  const engine: EngineId = msg.engine ?? 'tensei-classic';

  const send = (move: ValidMove | null) => {
    const response: PickMoveResponse = {
      type: 'pickMove',
      requestId: msg.requestId,
      move,
    };
    ctx.postMessage(response);
  };

  if (engine === 'edax') {
    // Async path: Edax may need to lazy-load WASM on first call. The
    // adapter handles its own fallback to Tensei Classic if the
    // artifact isn't present, so we don't need to do it here.
    void edaxPickMove(msg.board, moves, msg.level, msg.color).then(send);
    return;
  }

  send(pickAIMove(msg.board, moves, msg.level, msg.color));
});

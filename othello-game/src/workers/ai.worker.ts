/// <reference lib="webworker" />
import { getValidMoves } from '../engine/board';
import { pickAIMove } from '../engine/ai';
import type { Board, Color, ValidMove } from '../engine/types';

export interface PickMoveRequest {
  type: 'pickMove';
  requestId: number;
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
  const move = pickAIMove(msg.board, moves, msg.level, msg.color);
  const response: PickMoveResponse = {
    type: 'pickMove',
    requestId: msg.requestId,
    move,
  };
  ctx.postMessage(response);
});

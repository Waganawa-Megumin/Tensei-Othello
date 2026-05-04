/**
 * Edax WASM shim.
 *
 * Bridges Edax 4.x's C API to a small JS-friendly surface. The browser
 * worker calls `edax_init()` once, then `edax_pick_move(p_high, p_low,
 * o_high, o_low, color, level)` per move. Inputs are 64-bit player /
 * opponent bitboards, split into hi/lo 32-bit halves so they round-trip
 * cleanly through Emscripten's value-passing without a typed array.
 *
 * Returned move is encoded as `row * 8 + col`, with -1 meaning no
 * legal move (the caller falls back to "pass" in that case). Edax
 * returns moves in its own square index — we decode that to row/col.
 *
 * NOTE: This shim is a starting point. The real Edax public functions
 * we want are something like `Search_run` / `engine_play` from
 * `play.h`; the build script's job is to wire them up. Adjust the
 * include + function call below if the upstream API has shifted.
 */
#include <stdint.h>
#include <emscripten.h>

#include "options.h"
#include "play.h"
#include "board.h"
#include "search.h"

static Play g_play;
static int  g_initialised = 0;

EMSCRIPTEN_KEEPALIVE
void edax_init(void) {
  if (g_initialised) return;
  options_parse("level 6");
  play_new(&g_play);
  g_initialised = 1;
}

/**
 * Pick a move at `level` for the side to move = `color` (0=Black, 1=White).
 * `p_*`/`o_*` carry the bitboards (player / opponent) split into high/low
 * 32-bit halves for clean JS marshalling.
 *
 * Returns row*8+col, or -1 if no legal move exists.
 */
EMSCRIPTEN_KEEPALIVE
int edax_pick_move(
  uint32_t p_high, uint32_t p_low,
  uint32_t o_high, uint32_t o_low,
  int color, int level
) {
  if (!g_initialised) edax_init();

  Board b;
  b.player   = ((uint64_t)p_high << 32) | (uint64_t)p_low;
  b.opponent = ((uint64_t)o_high << 32) | (uint64_t)o_low;

  if (level < 1)  level = 1;
  if (level > 60) level = 60;

  /* Configure the per-call search depth. Edax interprets `level` as
     the search depth in plies plus an endgame perfect-search horizon
     auto-derived from `level`. */
  options.level = level;

  /* Drop into the play engine. `play_go` runs the search and stamps
     the chosen move into `g_play.search.result.move`. */
  play_set_board_from_position(&g_play, &b, color);
  play_go(&g_play, true);

  int sq = g_play.search.result->move;
  if (sq < 0 || sq >= 64) return -1;
  return sq;
}

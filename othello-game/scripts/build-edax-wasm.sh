#!/usr/bin/env bash
#
# Build a WebAssembly version of Edax 4.x and drop the artifact into
# `othello-game/public/edax/`. Until you run this, the in-app Edax
# selector is wired up but falls back to Tensei Classic at runtime.
#
# Prereqs (install once on your machine):
#   - git, curl, python3, make, clang
#   - Disk: ~1.5 GB for the Emscripten SDK + intermediate objects
#
# Usage:
#   bash othello-game/scripts/build-edax-wasm.sh
#
# What it does:
#   1. Installs Emscripten under `<repo>/.emsdk/` (skipped if present).
#   2. Clones `abulmo/edax-reversi` under `<repo>/.tmp/edax/`.
#   3. Patches the build to use the portable C source set (no SSE/AVX/NEON),
#      disables threading, and skips the CLI / book / GGS / Cassio glue.
#   4. Links a tiny C shim (`edax_shim.c`) that exposes
#      `edax_init` / `edax_pick_move` to JS through `EXPORTED_FUNCTIONS`.
#   5. Emits `edax.js` + `edax.wasm` into `othello-game/public/edax/`.
#
# Notes:
#   - The portable build is single-threaded, no SIMD. Strength stays in
#     the ~2400 ELO range — the Othello search benefits less from SIMD
#     than chess, and the kindergarten/plain fallbacks Edax already
#     ships are competent.
#   - This script is best-effort. Edax's Makefile mixes architecture
#     paths across many .c files; if abulmo/edax-reversi changes its
#     source layout you may need to refresh the patch list below.

set -euo pipefail

cd "$(dirname "$0")/../.."   # project root (Tensei-Othello/)

ROOT="$(pwd)"
EMSDK_DIR="$ROOT/.emsdk"
EDAX_DIR="$ROOT/.tmp/edax"
OUT_DIR="$ROOT/othello-game/public/edax"
SHIM_SRC="$ROOT/othello-game/scripts/edax_shim.c"

echo "==> Tensei-Othello : build Edax WASM"
echo "    project root : $ROOT"
echo "    emsdk        : $EMSDK_DIR"
echo "    edax src     : $EDAX_DIR"
echo "    output dir   : $OUT_DIR"
echo

# -----------------------------------------------------------------------------
# 1. Emscripten SDK
# -----------------------------------------------------------------------------
if [[ ! -x "$EMSDK_DIR/emsdk" ]]; then
  echo "==> Installing Emscripten SDK (one-time, ~700MB download)"
  git clone --depth 1 https://github.com/emscripten-core/emsdk.git "$EMSDK_DIR"
  (cd "$EMSDK_DIR" && ./emsdk install latest && ./emsdk activate latest)
fi
# shellcheck disable=SC1091
source "$EMSDK_DIR/emsdk_env.sh" >/dev/null
echo "    emcc: $(emcc --version | head -1)"

# -----------------------------------------------------------------------------
# 2. Edax source
# -----------------------------------------------------------------------------
mkdir -p "$ROOT/.tmp"
if [[ ! -d "$EDAX_DIR" ]]; then
  echo "==> Cloning abulmo/edax-reversi"
  git clone --depth 1 https://github.com/abulmo/edax-reversi.git "$EDAX_DIR"
fi

# -----------------------------------------------------------------------------
# 3. Source set — portable C only (no SSE/AVX/BMI/NEON/SVE)
# -----------------------------------------------------------------------------
SRC=(
  "$EDAX_DIR/src/bit.c"
  "$EDAX_DIR/src/board.c"
  "$EDAX_DIR/src/count_last_flip_plain.c"
  "$EDAX_DIR/src/empty.c"
  "$EDAX_DIR/src/endgame.c"
  "$EDAX_DIR/src/eval.c"
  "$EDAX_DIR/src/event.c"
  "$EDAX_DIR/src/flip_kindergarten.c"
  "$EDAX_DIR/src/game.c"
  "$EDAX_DIR/src/hash.c"
  "$EDAX_DIR/src/midgame.c"
  "$EDAX_DIR/src/move.c"
  "$EDAX_DIR/src/opening.c"
  "$EDAX_DIR/src/options.c"
  "$EDAX_DIR/src/perft.c"
  "$EDAX_DIR/src/play.c"
  "$EDAX_DIR/src/root.c"
  "$EDAX_DIR/src/search.c"
  "$EDAX_DIR/src/stats.c"
  "$EDAX_DIR/src/ybwc.c"
  "$EDAX_DIR/src/util.c"
)

# Emscripten flags:
#   -DMOVE_GENERATOR=2 (kindergarten) and COUNT_LAST_FLIP=3 (plain) so
#     Edax's settings.h picks the no-SIMD code paths.
#   -DNDEBUG strips asserts; -O3 -flto pushes the search engine fast.
#   -sMODULARIZE=1 + ES6 default export so the worker can `import()` it.
#   -sALLOW_MEMORY_GROWTH=1 so the hash table can scale at runtime.
#   -sEXPORTED_FUNCTIONS lists the shim's entry points for JS.
EMCC_FLAGS=(
  -O3 -flto -DNDEBUG
  -DMOVE_GENERATOR=2
  -DCOUNT_LAST_FLIP=3
  -DEDAX_VERSION=\"4.6-wasm-portable\"
  -I "$EDAX_DIR/src"
  -sMODULARIZE=1
  -sEXPORT_ES6=1
  -sENVIRONMENT=worker,web
  -sALLOW_MEMORY_GROWTH=1
  -sINITIAL_MEMORY=33554432
  -sEXPORTED_FUNCTIONS=_edax_init,_edax_pick_move,_malloc,_free
  -sEXPORTED_RUNTIME_METHODS=ccall,cwrap,HEAP8,HEAPU8,HEAP32
  -sFILESYSTEM=0
)

mkdir -p "$OUT_DIR"

echo "==> Compiling (this can take a few minutes)"
emcc \
  "${EMCC_FLAGS[@]}" \
  "${SRC[@]}" \
  "$SHIM_SRC" \
  -o "$OUT_DIR/edax.js"

echo
echo "==> Built: $OUT_DIR/{edax.js,edax.wasm}"
ls -la "$OUT_DIR"
echo
echo "Next: pick \"Edax\" in the free-mode AI engine selector and start a"
echo "match. The first move will load edax.wasm, subsequent moves are instant."

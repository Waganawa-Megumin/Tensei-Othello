# Edax (WASM) — opt-in second engine

The free-mode AI engine selector lists two engines:

| Engine            | Bundled? | Strength       | Notes                                        |
|-------------------|----------|----------------|----------------------------------------------|
| Tensei Classic    | ✓        | depth-4 minimax | Always available. Web Worker, no network.   |
| Edax              | (build)  | ~2400 ELO      | WASM port of Edax 4.x. Built once, then cached. |

Tensei Classic is shipped as part of the app. **Edax is not** — it
needs a separate WASM build because (a) Edax is GPL-3.0 and we want to
keep it as a clearly-marked optional component, and (b) the build needs
Emscripten, which is too heavy to put in CI for the default flow.

When Edax is selected but the artifact is missing, the runtime adapter
logs a one-line warning and falls back to Tensei Classic. The selector
itself still works — you just don't get Edax-strength play.

## Building Edax locally

```bash
bash othello-game/scripts/build-edax-wasm.sh
```

What happens:

1. Installs the Emscripten SDK under `<repo-root>/.emsdk/` (one-time, ~700 MB).
2. Clones [`abulmo/edax-reversi`](https://github.com/abulmo/edax-reversi) under `<repo-root>/.tmp/edax/`.
3. Compiles a portable (no SIMD, no threading) build via `emcc`.
4. Drops `edax.js` + `edax.wasm` into `othello-game/public/edax/`.

After it finishes, run `npm run dev`, switch free-mode to "Edax" in
the AI engine selector, and start a match. The first move triggers
the WASM load (about 100–300 ms on a typical laptop); subsequent
moves are instant.

## Why not bundle the artifact?

- **Licensing**: Edax is GPL-3.0. Shipping it as a separate, clearly
  attributed artifact keeps the boundary obvious for both code and
  binary distribution.
- **Reproducibility**: Building from `abulmo/edax-reversi` source means
  there's no opaque blob in the repo. Anyone can audit the build.
- **PWA cache size**: We don't want the default install to grow by
  ~1 MB for a feature most users won't use.

## When the shim breaks

`scripts/edax_shim.c` uses Edax's `Play` / `Search` types. If upstream
renames or restructures those (Edax has done so between major versions),
the shim won't compile. Symptoms:

- `error: unknown type name 'Play'` → grep the new header for the
  equivalent type and update the include + struct usage.
- `undefined reference to 'play_go'` → the entry-point name changed;
  check `play.h` for `engine_play`, `play_search`, etc.

The runtime contract from the JS side is small (`edax_init`,
`edax_pick_move`) so most upstream churn lands in the shim, not the
worker adapter.

## File map

```
othello-game/
├── public/edax/                 # ← built artifact lives here
│   ├── edax.js                  #   ES module loader (Emscripten output)
│   └── edax.wasm                #   compiled engine
├── scripts/
│   ├── build-edax-wasm.sh       # one-shot installer + builder
│   └── edax_shim.c              # tiny C bridge to the JS world
└── src/workers/engines/
    └── edaxAdapter.ts           # async loader + fallback to Tensei Classic
```

## Verifying the engine actually ran

Open DevTools → Network when starting a free-mode match with Edax
selected. On the first AI move you should see `edax.js` and `edax.wasm`
fetched from `/<base>/edax/`. If you don't, the adapter is on its
fallback path — check the console for the `[edax] WASM artifact not
found` warning and confirm `public/edax/edax.js` exists in your build.

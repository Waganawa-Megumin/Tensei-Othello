/**
 * Lightweight diagnostic ring buffer kept in localStorage so users
 * who hit a freeze can hand back the recent event trace without
 * needing devtools open.
 *
 * Why not console-only: mobile users can't inspect their console,
 * and the freeze case (most reports come from phones) needs after-
 * the-fact reproduction. Why not IndexedDB: synchronous writes from
 * the React render path are simpler to reason about, and the cap of
 * ~200 events × ~250 bytes ≈ 50 KB stays comfortably inside the
 * 5 MB origin quota.
 *
 * Schema is versioned (`v` field on the wrapper) so a future migration
 * to IndexedDB can detect and import the legacy buffer.
 */

const STORAGE_KEY = 'othello:diag_log';
const MAX_EVENTS = 200;
const SCHEMA_VERSION = 1;

export interface DiagEvent {
  /** Wall-clock timestamp at log time (`Date.now()`). */
  ts: number;
  /** Short event type, eg. `'click'`, `'ai.dispatch'`, `'ai.resolve'`. */
  type: string;
  /** Optional structured payload — keep small (no full board state). */
  data?: Record<string, unknown>;
}

interface Wrapper {
  v: number;
  events: DiagEvent[];
}

function readWrapper(): Wrapper {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { v: SCHEMA_VERSION, events: [] };
    const parsed = JSON.parse(raw) as Wrapper;
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.events)) {
      return { v: SCHEMA_VERSION, events: [] };
    }
    return parsed;
  } catch {
    return { v: SCHEMA_VERSION, events: [] };
  }
}

function writeWrapper(w: Wrapper): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(w));
  } catch {
    /* Quota exceeded or private mode — silently drop. The next call
       to `clearDiagLog` will recover even from a stuck quota. */
  }
}

/**
 * Append an event. Truncates to the most recent `MAX_EVENTS` entries.
 * Safe to call from React render paths — exceptions are swallowed.
 */
export function logDiag(type: string, data?: Record<string, unknown>): void {
  try {
    const w = readWrapper();
    w.events.push({ ts: Date.now(), type, data });
    if (w.events.length > MAX_EVENTS) {
      w.events.splice(0, w.events.length - MAX_EVENTS);
    }
    writeWrapper(w);
  } catch {
    /* never throw from logging */
  }
}

export function getDiagLog(): DiagEvent[] {
  return readWrapper().events.slice();
}

export function clearDiagLog(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Format the buffer as a single human-pasteable string. Used by the
 * settings export button so users can paste into bug reports without
 * needing to know what JSON is.
 */
export function exportDiagLog(): string {
  const events = getDiagLog();
  const meta = {
    exportedAt: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'n/a',
    eventCount: events.length,
    schemaVersion: SCHEMA_VERSION,
  };
  const header = `# Othello diag log\n${JSON.stringify(meta, null, 2)}\n\n# events\n`;
  const body = events
    .map((e) => {
      const t = new Date(e.ts).toISOString();
      const payload = e.data ? ' ' + JSON.stringify(e.data) : '';
      return `${t} ${e.type}${payload}`;
    })
    .join('\n');
  return header + body;
}

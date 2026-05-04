/**
 * Persisted opt-in flag for the LLM character commentary feature.
 * Defaults to OFF because every match makes a few dozen Anthropic
 * API calls — we want the user to make an explicit choice.
 */
const COMMENTARY_KEY = 'othello:commentary_enabled';

export function loadCommentaryEnabled(): boolean {
  try {
    return window.localStorage.getItem(COMMENTARY_KEY) === '1';
  } catch {
    return false;
  }
}

export function saveCommentaryEnabled(enabled: boolean): void {
  try {
    window.localStorage.setItem(COMMENTARY_KEY, enabled ? '1' : '0');
  } catch {
    /* localStorage unavailable; choice survives only in memory */
  }
}

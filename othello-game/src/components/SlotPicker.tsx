import { useEffect, useState, type ChangeEvent } from 'react';
import { Heart, Pencil, RotateCcw } from 'lucide-react';
import {
  defaultSlot,
  resetSlot,
  saveSlots,
  type SaveSlot,
  MAX_SLOTS,
} from '../storage/saveSlots';
import type { Messages } from '../i18n/messages';

interface SlotPickerProps {
  open: boolean;
  slots: SaveSlot[];
  activeSlotId: number | null;
  /** Called when the user picks a slot. Closes the picker as a side effect. */
  onSelect: (slotId: number) => void;
  onClose: () => void;
  /** Called whenever the slots array changes (rename / reset). */
  onSlotsChanged: (slots: SaveSlot[]) => void;
  t: Messages;
}

function fmtDate(ts: number): string {
  if (!ts) return '—';
  const d = new Date(ts);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}/${mm}/${dd} ${hh}:${mi}`;
}

function Lives({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-200/85">
      <Heart size={12} strokeWidth={1.6} className="fill-red-400/80 stroke-red-300/90" />
      <span className="latin-display tabular-nums text-xs">{n}</span>
    </span>
  );
}

export function SlotPicker({
  open,
  slots,
  activeSlotId,
  onSelect,
  onClose,
  onSlotsChanged,
  t,
}: SlotPickerProps) {
  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [draftName, setDraftName] = useState('');

  useEffect(() => {
    if (!open) setRenamingId(null);
  }, [open]);

  if (!open) return null;

  function startRename(slot: SaveSlot) {
    setRenamingId(slot.id);
    setDraftName(slot.name);
  }

  async function commitRename(id: number) {
    const trimmed = draftName.trim().slice(0, 30) || defaultSlot(id).name;
    const next = slots.map((s) => (s.id === id ? { ...s, name: trimmed } : s));
    await saveSlots(next);
    onSlotsChanged(next);
    setRenamingId(null);
  }

  async function handleReset(id: number) {
    if (!window.confirm(t.slotResetConfirm)) return;
    const next = await resetSlot(id);
    onSlotsChanged(next);
  }

  return (
    <div className="modal-bg fixed inset-0 z-50 flex items-stretch md:items-center justify-center p-2 md:p-6">
      <div className="modal-card scroll-y w-full max-w-xl max-h-[95vh] rounded-sm p-5 md:p-7 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="latin-display italic ornament text-[10px] uppercase mb-1">
              — {t.slotPickerSubtitle} —
            </div>
            <h2 className="jp-display text-amber-100 text-xl md:text-2xl font-bold tracking-[0.15em]">
              {t.slotPickerTitle}
            </h2>
          </div>
          <button onClick={onClose} className="btn">
            {t.close}
          </button>
        </div>

        <p className="jp-display text-amber-200/65 text-xs leading-relaxed mb-4">
          {t.slotPickerHint}
        </p>

        <div className="space-y-2 scroll-y overflow-y-auto pr-1">
          {Array.from({ length: MAX_SLOTS }, (_, i) => {
            const id = i + 1;
            const slot = slots.find((s) => s.id === id) ?? defaultSlot(id);
            const isActive = activeSlotId === id;
            const isUnused = slot.lastPlayedAt === 0 && slot.totalGames === 0;
            const isRenaming = renamingId === id;

            return (
              <div
                key={id}
                className={`px-3 py-2.5 rounded-sm border transition-colors ${
                  isActive
                    ? 'border-amber-200/65 bg-amber-200/[0.08]'
                    : 'border-amber-200/15 bg-amber-200/[0.02]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="latin-display italic text-amber-200/55 text-[10px] tracking-[0.25em] uppercase w-9 shrink-0">
                    #{String(id).padStart(2, '0')}
                  </div>

                  <div className="flex-1 min-w-0">
                    {isRenaming ? (
                      <input
                        autoFocus
                        type="text"
                        value={draftName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setDraftName(e.target.value)
                        }
                        onBlur={() => void commitRename(id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') void commitRename(id);
                          if (e.key === 'Escape') setRenamingId(null);
                        }}
                        maxLength={30}
                        className="jp-display w-full px-2 py-1 bg-zinc-950/70 border border-amber-200/30 rounded-sm text-amber-100 text-sm focus:border-amber-200/70 focus:outline-none"
                      />
                    ) : (
                      <div className="jp-display text-amber-100/95 text-sm md:text-base truncate">
                        {slot.name}
                        {isUnused && (
                          <span className="latin-display italic text-amber-200/45 text-[10px] ml-2 tracking-wider">
                            ({t.slotEmpty})
                          </span>
                        )}
                      </div>
                    )}
                    {!isUnused && (
                      <div className="flex items-center gap-3 mt-1 latin-display italic text-amber-200/55 text-[10px] tracking-wider">
                        <span className="jp-display">
                          {t.slotProgress(slot.storyProgress)}
                        </span>
                        <Lives n={slot.lives} />
                      </div>
                    )}
                    {!isUnused && slot.lastPlayedAt > 0 && (
                      <div className="latin-display italic text-amber-200/40 text-[10px] mt-0.5 tracking-wider">
                        {t.slotLastPlayed}: {fmtDate(slot.lastPlayedAt)}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {!isRenaming && (
                      <>
                        <button
                          onClick={() => startRename(slot)}
                          className="btn text-xs px-2 py-1.5"
                          title={t.slotRename}
                          aria-label={t.slotRename}
                        >
                          <Pencil size={14} strokeWidth={1.5} />
                        </button>
                        {!isUnused && (
                          <button
                            onClick={() => void handleReset(id)}
                            className="btn text-xs px-2 py-1.5"
                            title={t.slotReset}
                            aria-label={t.slotReset}
                          >
                            <RotateCcw size={14} strokeWidth={1.5} />
                          </button>
                        )}
                        <button
                          onClick={() => onSelect(id)}
                          className={`btn text-xs px-3 py-1.5 ${isActive ? 'btn-active' : ''}`}
                        >
                          {t.slotSelect}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

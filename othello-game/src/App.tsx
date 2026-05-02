import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from 'react';
import {
  Flag,
  FolderOpen,
  Home,
  Info,
  Lightbulb,
  Lock,
  Menu,
  RotateCcw,
  Trash2,
  Undo2,
  type LucideIcon,
} from 'lucide-react';
import {
  applyMove,
  countPieces,
  createInitialBoard,
  getValidMoves,
} from './engine/board';
import { pickAIMove } from './engine/ai';
import {
  BLACK,
  EMPTY,
  WHITE,
  opponent,
  type Board,
  type Color,
  type Disc,
  type Move,
  type ValidMove,
} from './engine/types';
import { useAiWorker } from './hooks/useAiWorker';
import {
  deleteSlot as storageDeleteSlot,
  listSlots,
  saveSlot as storageSaveSlot,
  type AiMode,
  type GameMode,
  type MoveRecord,
  type SavedSlot,
} from './storage/saveGame';
import { useLocale } from './i18n/useLocale';
import type { Messages } from './i18n/messages';
import { TitleScreen, type TitleStartMode } from './components/TitleScreen';
import { SlotPicker } from './components/SlotPicker';
import { streamReview, type StreamMessageHandle } from './services/claude';
import {
  defaultSlot,
  getSlots,
  getActiveSlotId,
  setActiveSlotId,
  resetSlot as resetStoredSlot,
  recordSlotResult,
  recordFreeResult,
  type SaveSlot,
} from './storage/saveSlots';

type Screen = 'title' | 'game';

/* ============================================================
   Static data
   ============================================================ */

interface AvatarEntry {
  kanji: string;
  name: string;
  setting: string;
  quote: string;
  image: string;
  name_en: string;
  setting_en: string;
  quote_en: string;
}

interface ComputerEntry {
  kanji: string;
  name: string;
  level: number;
  quote: string;
  image: string;
  name_en: string;
  quote_en: string;
  /**
   * Optional path to a wide chapter illustration (per manifest.json).
   * Files are dropped at the path declared here; if the PNG doesn't
   * exist yet, the chapter card falls back to the avatar-only layout.
   */
  chapterArt?: string;
}

// Default protagonist — always available, used as the player's starting
// avatar. The 20 entries in AVATARS_DATA are bonus characters that unlock
// only after the story is fully cleared (storyProgress >= 20).
const DEFAULT_AVATAR_DATA: AvatarEntry = {
  kanji: '君',
  name: 'あなた',
  name_en: 'You',
  setting: '盤上世界の旅人',
  setting_en: 'Traveler of Bansho Sekai',
  quote: 'いざ、参る',
  quote_en: 'Here I go.',
  image: 'avatars/players/PLR00_default.png',
};

const AVATARS_DATA: ReadonlyArray<AvatarEntry> = [
  { kanji: '春', name: 'ハルキ',   name_en: 'Haruki',    setting: '異世界転生の勇者',      setting_en: 'Isekai Hero',                quote: '冒険、はじまったな',     quote_en: 'The adventure begins.',              image: 'avatars/players/PLR01_haruki.png' },
  { kanji: '琴', name: '美琴',     name_en: 'Mikoto',    setting: '魔法学園の天才',        setting_en: 'Magic Academy Prodigy',      quote: '論理と魔法は同じ',       quote_en: 'Logic and magic are one.',           image: 'avatars/players/PLR02_mikoto.png' },
  { kanji: '凛', name: 'リン',     name_en: 'Rin',       setting: 'VRMMOの最強プレイヤー', setting_en: 'VRMMO Top Player',           quote: '現実より、得意なんだ',   quote_en: "I'm better here than in reality.",   image: 'avatars/players/PLR03_rin.png' },
  { kanji: '蓮', name: '蓮',       name_en: 'Ren',       setting: '剣道部主将',            setting_en: 'Kendo Captain',              quote: '正々堂々、参る',         quote_en: 'Fair and square, here I come.',      image: 'avatars/players/PLR04_ren.png' },
  { kanji: '千', name: '千歳',     name_en: 'Chitose',   setting: 'タイムリープ少女',      setting_en: 'Time-Loop Girl',             quote: 'これで何度目だっけ',     quote_en: 'How many times has it been now?',    image: 'avatars/players/PLR05_chitose.png' },
  { kanji: '晴', name: '晴',       name_en: 'Haru',      setting: '現代の陰陽師',          setting_en: 'Modern Onmyoji',             quote: '妖、見えてるんだ',       quote_en: 'I can see the spirits.',             image: 'avatars/players/PLR06_haru.png' },
  { kanji: '海', name: 'カイ',     name_en: 'Kai',       setting: '空の冒険者',            setting_en: 'Sky Adventurer',             quote: '風が呼んでる',           quote_en: 'The wind is calling.',               image: 'avatars/players/PLR07_kai.png' },
  { kanji: '夏', name: '千夏',     name_en: 'Chinatsu',  setting: '聖剣の村娘',            setting_en: 'Holy Sword Village Girl',    quote: '故郷を、必ず守る',       quote_en: "I'll protect my home, no matter what.", image: 'avatars/players/PLR08_chinatsu.png' },
  { kanji: '透', name: '透',       name_en: 'Toru',      setting: '学園名探偵',            setting_en: 'School Detective',           quote: '謎には必ず答えがある',   quote_en: 'Every mystery has an answer.',       image: 'avatars/players/PLR09_toru.png' },
  { kanji: 'ノ', name: 'ノア',     name_en: 'Noa',       setting: '未来から来た少女',      setting_en: 'Girl from the Future',       quote: '2099年から、よろしく',   quote_en: 'From 2099 — pleased to meet you.',   image: 'avatars/players/PLR10_noa.png' },
  { kanji: '凪', name: '凪',       name_en: 'Nagi',      setting: '異世界料理人',          setting_en: 'Isekai Chef',                quote: 'お腹空いてる？',         quote_en: 'Hungry?',                            image: 'avatars/players/PLR11_nagi.png' },
  { kanji: 'エ', name: 'エル',     name_en: 'El',        setting: '元魔王、今は転校生',    setting_en: 'Ex-Demon King Transfer',     quote: 'ふふ、内緒だよ',         quote_en: "Hee hee, it's a secret.",            image: 'avatars/players/PLR12_el.png' },
  { kanji: '菫', name: 'スミレ',   name_en: 'Sumire',    setting: '記憶喪失の冒険者',      setting_en: 'Amnesiac Adventurer',        quote: '私は…誰なの？',          quote_en: 'Who… am I?',                         image: 'avatars/players/PLR13_sumire.png' },
  { kanji: '葉', name: '葉月',     name_en: 'Hazuki',    setting: '機械工学の天才',        setting_en: 'Steampunk Genius',           quote: 'これ、私が作ったの！',   quote_en: 'I built this myself!',               image: 'avatars/players/PLR14_hazuki.png' },
  { kanji: '隼', name: '隼人',     name_en: 'Hayato',    setting: '凄腕ガンナー',          setting_en: 'Master Gunner',              quote: '撃つときは迷わない',     quote_en: "When I shoot, I don't hesitate.",    image: 'avatars/players/PLR15_hayato.png' },
  { kanji: '光', name: 'ひかり',   name_en: 'Hikari',    setting: '光の精霊使い',          setting_en: 'Light Spirit User',          quote: 'みんな、笑ってほしい',   quote_en: 'I want everyone to smile.',          image: 'avatars/players/PLR16_hikari.png' },
  { kanji: '夜', name: 'ヨル',     name_en: 'Yoru',      setting: '半吸血鬼',              setting_en: 'Half-Vampire',               quote: '血は、欲しくない',       quote_en: "I don't want blood.",                image: 'avatars/players/PLR17_yoru.png' },
  { kanji: '湊', name: '湊',       name_en: 'Minato',    setting: '海の冒険者',            setting_en: 'Sea Adventurer',             quote: '世界の果てへ',           quote_en: 'To the ends of the earth.',          image: 'avatars/players/PLR18_minato.png' },
  { kanji: '奏', name: '奏太',     name_en: 'Souta',     setting: '天才ピアニスト',        setting_en: 'Prodigy Pianist',            quote: 'この旋律、聴いてくれ',   quote_en: 'Listen to this melody.',             image: 'avatars/players/PLR19_souta.png' },
  { kanji: '悠', name: '悠',       name_en: 'Yu',        setting: '神話の英雄',            setting_en: 'Mythic Hero',                quote: '神々よ、いざ尋常に',     quote_en: 'Gods, let us duel honorably.',       image: 'avatars/players/PLR20_yu.png' },
];

const COMPUTERS_DATA: ReadonlyArray<ComputerEntry> = [
  { kanji: '苺', name: 'いちか',   name_en: 'Ichika',    level: 1,  quote: 'ふぁいとぉ♪ 楽しんで！',       quote_en: 'Fight-o ♪ Have fun!',                       image: 'avatars/opponents/OPP01_ichika.png', chapterArt: 'avatars/opponents/chapters/OPP01_ichika_chapter.png' },
  { kanji: '葵', name: '葵',       name_en: 'Aoi',       level: 2,  quote: '狙いはバッチリだよっ！',         quote_en: "Aim's locked in!",                           image: 'avatars/opponents/OPP02_aoi.png', chapterArt: 'avatars/opponents/chapters/OPP02_aoi_chapter.png' },
  { kanji: '朝', name: '朝日',     name_en: 'Asahi',     level: 3,  quote: 'いざ尋常に！',                   quote_en: 'Let us duel!',                              image: 'avatars/opponents/OPP03_asahi.png', chapterArt: 'avatars/opponents/chapters/OPP03_asahi_chapter.png' },
  { kanji: '撫', name: 'なでしこ', name_en: 'Nadeshiko', level: 4,  quote: '無理せずいきましょう',           quote_en: "Let's not push too hard.",                  image: 'avatars/opponents/OPP04_nadeshiko.png', chapterArt: 'avatars/opponents/chapters/OPP04_nadeshiko_chapter.png' },
  { kanji: '響', name: '響',       name_en: 'Hibiki',    level: 5,  quote: '楽しい一局を奏でよう♪',         quote_en: "Let's compose a fun match ♪",                image: 'avatars/opponents/OPP05_hibiki.png', chapterArt: 'avatars/opponents/chapters/OPP05_hibiki_chapter.png' },
  { kanji: '紬', name: 'つむぎ',   name_en: 'Tsumugi',   level: 6,  quote: '相棒もわくわくしてる',           quote_en: "My partner's excited too.",                 image: 'avatars/opponents/OPP06_tsumugi.png', chapterArt: 'avatars/opponents/chapters/OPP06_tsumugi_chapter.png' },
  { kanji: '茜', name: '茜',       name_en: 'Akane',     level: 7,  quote: '歯車みたいにかっちりね！',       quote_en: 'Tight as gears!',                           image: 'avatars/opponents/OPP07_akane.png', chapterArt: 'avatars/opponents/chapters/OPP07_akane_chapter.png' },
  { kanji: '薬', name: 'メル',     name_en: 'Mel',       level: 8,  quote: 'ふふ、ちょっと混ぜてみよっか？', quote_en: 'Heh, shall we mix things up?',              image: 'avatars/opponents/OPP08_mel.png', chapterArt: 'avatars/opponents/chapters/OPP08_mel_chapter.png' },
  { kanji: '悟', name: '悟',       name_en: 'Satoru',    level: 9,  quote: '無心に石を置く、ただそれだけ',   quote_en: 'Place the stone without thought. That alone.', image: 'avatars/opponents/OPP09_satoru.png', chapterArt: 'avatars/opponents/chapters/OPP09_satoru_chapter.png' },
  { kanji: '黒', name: 'シキ',     name_en: 'Shiki',     level: 10, quote: '気付いた時には遅いよ',           quote_en: "By the time you notice, it's too late.",    image: 'avatars/opponents/OPP10_shiki.png', chapterArt: 'avatars/opponents/chapters/OPP10_shiki_chapter.png' },
  { kanji: '詩', name: 'シオン',   name_en: 'Shion',     level: 11, quote: 'すべては予測の内だ',             quote_en: 'All is within my predictions.',             image: 'avatars/opponents/OPP11_shion.png', chapterArt: 'avatars/opponents/chapters/OPP11_shion_chapter.png' },
  { kanji: '夢', name: 'ルナ',     name_en: 'Luna',      level: 12, quote: '夢の中でもう勝ってるよ♡',       quote_en: "I've already won in my dream ♡",            image: 'avatars/opponents/OPP12_luna.png', chapterArt: 'avatars/opponents/chapters/OPP12_luna_chapter.png' },
  { kanji: '雪', name: '雪乃',     name_en: 'Yukino',    level: 13, quote: 'この程度、解析するまでもない',   quote_en: 'Not even worth analyzing.',                 image: 'avatars/opponents/OPP13_yukino.png', chapterArt: 'avatars/opponents/chapters/OPP13_yukino_chapter.png' },
  { kanji: '暁', name: 'アキラ',   name_en: 'Akira',     level: 14, quote: '君の手筋、見えているよ',         quote_en: 'I can see your moves.',                     image: 'avatars/opponents/OPP14_akira.png', chapterArt: 'avatars/opponents/chapters/OPP14_akira_chapter.png' },
  { kanji: '銀', name: 'シエル',   name_en: 'Ciel',      level: 15, quote: '全データ把握、戦況優位',         quote_en: 'All data acquired. Position favorable.',    image: 'avatars/opponents/OPP15_ciel.png', chapterArt: 'avatars/opponents/chapters/OPP15_ciel_chapter.png' },
  { kanji: '姫', name: 'アリア',   name_en: 'Aria',      level: 16, quote: 'お手柔らかに、ですわ',           quote_en: 'Be gentle with me.',                        image: 'avatars/opponents/OPP16_aria.png', chapterArt: 'avatars/opponents/chapters/OPP16_aria_chapter.png' },
  { kanji: '獅', name: 'レオン',   name_en: 'Leon',      level: 17, quote: '正々堂々、参る！',               quote_en: 'Fair and square, here I come!',             image: 'avatars/opponents/OPP17_leon.png', chapterArt: 'avatars/opponents/chapters/OPP17_leon_chapter.png' },
  { kanji: '宗', name: '宗次郎',   name_en: 'Sojiro',    level: 18, quote: '我が一刀、避けられはせぬ',       quote_en: 'My blade cannot be evaded.',                image: 'avatars/opponents/OPP18_sojiro.png', chapterArt: 'avatars/opponents/chapters/OPP18_sojiro_chapter.png' },
  { kanji: '嵐', name: '嵐',       name_en: 'Arashi',    level: 19, quote: '我が竜の前に膝を折れ！',         quote_en: 'Kneel before my dragon!',                   image: 'avatars/opponents/OPP19_arashi.png', chapterArt: 'avatars/opponents/chapters/OPP19_arashi_chapter.png' },
  { kanji: '零', name: 'ゼロ',     name_en: 'Zero',      level: 20, quote: '全ての変分は計算済み。詰みだ',   quote_en: 'All variations computed. Checkmate.',       image: 'avatars/opponents/OPP20_zero.png', chapterArt: 'avatars/opponents/chapters/OPP20_zero_chapter.png' },
];

/* ============================================================
   Helpers
   ============================================================ */

function getLevelLabel(level: number, t: Messages): string {
  if (level <= 4) return t.levelEntry;
  if (level <= 8) return t.levelBeginner;
  if (level <= 12) return t.levelMid;
  if (level <= 16) return t.levelHigh;
  if (level <= 18) return t.levelExpert;
  return t.levelMaster;
}

function levelColor(level: number): string {
  if (level <= 4) return 'bg-emerald-400/85';
  if (level <= 8) return 'bg-lime-400/85';
  if (level <= 12) return 'bg-amber-400/85';
  if (level <= 16) return 'bg-orange-400/85';
  return 'bg-red-400/85';
}

function colorChar(c: Color): 'B' | 'W' {
  return c === BLACK ? 'B' : 'W';
}

function moveToNotation(m: Move): string {
  return `${String.fromCharCode(97 + m.col)}${m.row + 1}`;
}

function moveKey(row: number, col: number): string {
  return `${row},${col}`;
}

interface HistorySnapshot {
  board: Board;
  currentColor: Color;
  lastMove: LastMove | null;
}

interface LastMove extends Move {
  color: Color;
}

/* ============================================================
   Subcomponents
   ============================================================ */

interface AvatarBadgeProps {
  kanji: string;
  idx: number;
  image?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  selected?: boolean;
  dim?: boolean;
  onClick?: () => void;
}

function AvatarBadge({
  kanji,
  idx,
  image,
  size = 'md',
  selected = false,
  dim = false,
  onClick,
}: AvatarBadgeProps) {
  const sizeClass = {
    xs: 'w-8 h-8 text-sm',
    sm: 'w-10 h-10 text-base',
    md: 'w-12 h-12 md:w-14 md:h-14 text-xl md:text-2xl',
    lg: 'w-16 h-16 text-2xl md:text-3xl',
  }[size];

  const hue = (idx * 47 + 30) % 360;

  return (
    <div
      onClick={onClick}
      className={`${sizeClass} rounded-full overflow-hidden flex items-center justify-center jp-display font-medium relative transition-all flex-shrink-0 ${
        onClick ? 'cursor-pointer' : ''
      }`}
      style={{
        background: image
          ? '#0a0805'
          : dim
            ? `linear-gradient(135deg, hsl(${hue}, 15%, 16%), hsl(${hue}, 20%, 8%))`
            : `linear-gradient(135deg, hsl(${hue}, 38%, 24%), hsl(${hue}, 50%, 11%))`,
        color: '#f5e8c8',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), 0 4px 10px rgba(0,0,0,0.45)',
        border: selected ? '2px solid #c9a961' : '1px solid rgba(201, 169, 97, 0.25)',
        opacity: dim ? 0.45 : 1,
      }}
    >
      {image ? (
        <img src={image} alt={kanji} className="w-full h-full object-cover" draggable={false} />
      ) : (
        <span style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.7))' }}>{kanji}</span>
      )}
    </div>
  );
}

interface ToolbarBtnProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}

function ToolbarBtn({ icon: Icon, label, onClick, active, disabled }: ToolbarBtnProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center justify-center gap-1 py-3 transition-colors ${
        active ? 'bg-amber-200/15 text-amber-100' : 'bg-zinc-950/80 text-amber-100/85'
      } ${disabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-zinc-900 hover:text-amber-100'}`}
    >
      <Icon size={20} strokeWidth={1.4} />
      <span className="jp-display text-[10px] tracking-wider">{label}</span>
    </button>
  );
}

interface PlayerPanelProps {
  color: Color;
  count: number;
  isActive: boolean;
  kanji: string;
  idx: number;
  image?: string;
  name: string;
  quote?: string;
  level?: number;
  thinking?: boolean;
  /** Remaining lives (story mode, Black side only). Hidden when undefined. */
  lives?: number;
}

function PlayerPanel({
  color,
  count,
  isActive,
  kanji,
  idx,
  image,
  name,
  quote,
  level,
  thinking,
  lives,
}: PlayerPanelProps) {
  return (
    <div
      className={`relative px-4 md:px-5 py-3 md:py-3.5 border rounded-sm transition-all ${
        isActive ? 'border-amber-200/60 bg-amber-200/[0.04]' : 'border-amber-200/15'
      }`}
    >
      <div className="flex items-center gap-3 md:gap-4">
        <AvatarBadge kanji={kanji} idx={idx} image={image} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="jp-display text-amber-100/95 text-base md:text-lg truncate">
              {name}
              {thinking ? '…' : ''}
            </span>
            {level !== undefined && (
              <span className="latin-display italic text-amber-200/50 text-[11px] md:text-xs tracking-wider flex-shrink-0">
                Lv.{level}
              </span>
            )}
            {lives !== undefined && (
              <span
                className={`latin-display tabular-nums text-[11px] md:text-xs tracking-wider flex-shrink-0 ${
                  lives === 0 ? 'text-red-300/95' : 'text-amber-200/85'
                }`}
                title={`Lives: ${lives}`}
                aria-label={`Lives: ${lives}`}
              >
                ♥ {lives}
              </span>
            )}
          </div>
          {quote && (
            <div className="jp-display text-amber-200/70 text-[11px] md:text-xs italic truncate mt-0.5">
              「{quote}」
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
          <div
            className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full"
            style={{
              background:
                color === BLACK
                  ? 'radial-gradient(circle at 30% 30%, #5a5a5a, #1a1a1a 55%, #000)'
                  : 'radial-gradient(circle at 30% 30%, #ffffff, #ebe2cc 55%, #c5b89c)',
              boxShadow:
                color === BLACK
                  ? 'inset -1px -1px 2px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.4)'
                  : 'inset 1px 1px 2px rgba(255,255,255,0.6), 0 1px 2px rgba(0,0,0,0.4)',
            }}
          />
          <div className="latin-display text-3xl md:text-4xl text-amber-100 tabular-nums font-medium leading-none">
            {count}
          </div>
        </div>
      </div>
      {isActive && (
        <div className="absolute -bottom-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-amber-200/70 to-transparent" />
      )}
    </div>
  );
}

/**
 * Renders a wide chapter illustration if the file at `src` exists,
 * otherwise stays out of the layout. Used to graceful-fallback while
 * the docs/illustrations briefs are being turned into actual PNGs —
 * dropping a file at the configured path makes the art appear without
 * any code change.
 */
function ChapterArt({ src, alt }: { src?: string; alt: string }) {
  const [ok, setOk] = useState(true);
  if (!src || !ok) return null;
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setOk(false)}
      className="w-full aspect-[16/9] object-cover rounded-sm border border-amber-200/15 mb-3"
    />
  );
}

interface LevelSelectorProps {
  level: number;
  setLevel: (n: number) => void;
  t: Messages;
}

function LevelSelector({ level, setLevel, t }: LevelSelectorProps) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <div className="latin-display italic text-amber-200/50 tracking-[0.25em] text-xs uppercase">
          Level
        </div>
        <div className="flex items-baseline gap-3">
          <div className="latin-display text-amber-100 text-3xl tabular-nums leading-none">
            {level}
          </div>
          <div className="jp-display text-amber-100/85 text-sm tracking-wider">
            {getLevelLabel(level, t)}
          </div>
        </div>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: 20 }, (_, i) => {
          const n = i + 1;
          const filled = n <= level;
          return (
            <button
              key={i}
              onClick={() => setLevel(n)}
              className={`flex-1 h-7 rounded-sm transition-all ${
                filled ? levelColor(n) : 'bg-zinc-800/60 hover:bg-zinc-700/70'
              }`}
              title={`Lv. ${n}`}
            />
          );
        })}
      </div>
      <div className="flex justify-between latin-display italic text-amber-200/55 text-[10px] mt-1.5 px-1">
        <span>{t.levelLow}</span>
        <span>{t.levelMidLabel}</span>
        <span>{t.levelMaxLabel}</span>
      </div>
    </div>
  );
}

/* ============================================================
   Main App
   ============================================================ */

export default function App() {
  // Game state
  const [board, setBoard] = useState<Board>(createInitialBoard);
  const [currentColor, setCurrentColor] = useState<Color>(BLACK);
  const [lastMove, setLastMove] = useState<LastMove | null>(null);
  const [aiThinking, setAiThinking] = useState(false);
  const [passInfo, setPassInfo] = useState<Color | null>(null);
  const [flipping, setFlipping] = useState<Record<string, Color>>({});
  const [history, setHistory] = useState<HistorySnapshot[]>([]);
  /** Color of the side that resigned, or null if no resignation. */
  const [resigned, setResigned] = useState<Color | null>(null);

  // Settings state
  const [gameMode, setGameMode] = useState<GameMode>('ai');
  // Both default to index 0 (the always-available default avatar). The
  // 20 bonus characters at indices 1..20 are gated on story completion.
  const [p1Avatar, setP1Avatar] = useState(0);
  const [p2Avatar, setP2Avatar] = useState(0);
  const [computerChar, setComputerChar] = useState(0);
  const [level, setLevel] = useState(1);
  const [aiMode, setAiMode] = useState<AiMode>('story');
  // Save-slot state (story mode). Slots[] is the canonical store; the
  // legacy `storyProgress` and `lives` values are derived from the
  // active slot below.
  const [slots, setSlots] = useState<SaveSlot[]>(() =>
    Array.from({ length: 10 }, (_, i) => defaultSlot(i + 1)),
  );
  const [activeSlotId, setActiveSlotIdState] = useState<number | null>(null);
  const [slotPickerOpen, setSlotPickerOpen] = useState(false);
  /** Set once per gameOver to prevent double-recording stats. */
  // Set true when a saved kifu is loaded for review. Suppresses the
  // gameOver-driven result recording and the gameOver modal so the
  // loaded board can be inspected without re-firing the win/loss flow.
  // Cleared by reset() and by the first user click on the board.
  const [loadedKifuView, setLoadedKifuView] = useState(false);
  const [resultRecorded, setResultRecorded] = useState(false);
  /** Last recorded result, used by the gameOver modal to know whether
   *  to show "Next chapter" vs "Try again". Set synchronously when
   *  gameOver fires; persists until the next reset. */
  const [lastResult, setLastResult] = useState<
    'win' | 'loss' | 'draw' | 'resign' | null
  >(null);
  /** Snapshot of the opponent at the start of the current game. Used by
   *  the gameOver modal so the avatars/score area shows who was just
   *  played, not who's queued up next. (When storyProgress advances on
   *  a win, computerChar follows immediately, so we can't read it
   *  directly any more.) */
  const [opponentSnapshot, setOpponentSnapshot] = useState<{
    kanji: string;
    name: string;
    image: string;
    level: number;
    quote: string;
  } | null>(null);

  // Kifu and modals
  const [kifu, setKifu] = useState<MoveRecord[]>([]);
  const [infoOpen, setInfoOpen] = useState(false);
  const [kifuOpen, setKifuOpen] = useState(false);
  const [savedSlots, setSavedSlots] = useState<SavedSlot[]>([]);
  const [kifuName, setKifuName] = useState('');

  // UI state
  const [hintMove, setHintMove] = useState<Move | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [screen, setScreen] = useState<Screen>('title');

  // Post-game review state
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  /** True when the review modal is showing a previously saved review
   *  (read-only). Hides Cancel/Regenerate/Save buttons. */
  const [reviewReadOnly, setReviewReadOnly] = useState(false);
  /** Saved-at timestamp shown in the read-only review view. */
  const [reviewSavedAt, setReviewSavedAtState] = useState<number | null>(null);
  const [reviewSavedFlash, setReviewSavedFlash] = useState(false);
  const reviewHandleRef = useRef<StreamMessageHandle | null>(null);

  const ai = useAiWorker();
  const { locale, setLocale, t } = useLocale();

  // Locale-aware character data. Shadows the top-level *_DATA arrays so
  // every existing `AVATARS[i].name`, `COMPUTERS[i].quote`, etc. site
  // automatically returns the right language.
  const AVATARS = useMemo(
    () =>
      [DEFAULT_AVATAR_DATA, ...AVATARS_DATA].map((a) => ({
        ...a,
        name: locale === 'en' ? a.name_en : a.name,
        setting: locale === 'en' ? a.setting_en : a.setting,
        quote: locale === 'en' ? a.quote_en : a.quote,
      })),
    [locale],
  );
  const COMPUTERS = useMemo(
    () =>
      COMPUTERS_DATA.map((c) => ({
        ...c,
        name: locale === 'en' ? c.name_en : c.name,
        quote: locale === 'en' ? c.quote_en : c.quote,
      })),
    [locale],
  );

  const activeSlot = useMemo(
    () => (activeSlotId ? slots.find((s) => s.id === activeSlotId) ?? null : null),
    [slots, activeSlotId],
  );
  const storyProgress = activeSlot?.storyProgress ?? 0;
  const lives = activeSlot?.lives ?? 0;

  const validMoves = useMemo(() => getValidMoves(board, currentColor), [board, currentColor]);
  const validMoveMap = useMemo(() => {
    const m = new Map<string, ValidMove>();
    for (const v of validMoves) m.set(moveKey(v.row, v.col), v);
    return m;
  }, [validMoves]);
  const counts = useMemo(() => countPieces(board), [board]);
  const oppMoves = useMemo(
    () => getValidMoves(board, opponent(currentColor)),
    [board, currentColor],
  );
  const noCurrent = validMoves.length === 0;
  const noOpp = oppMoves.length === 0;
  const gameOver = (noCurrent && noOpp) || resigned !== null;
  const isHumanTurn = gameMode === 'human' || currentColor === BLACK;

  /* ----- Effects ----- */

  // Load persisted save slots + active slot id on mount.
  useEffect(() => {
    let cancelled = false;
    Promise.all([getSlots(), getActiveSlotId()]).then(([loaded, id]) => {
      if (cancelled) return;
      setSlots(loaded);
      setActiveSlotIdState(id);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Sync opponent character/level to story progress when in story mode.
  // Skip while a saved kifu is being viewed — otherwise the opponent we
  // restored from the slot gets immediately overwritten with the user's
  // current chapter's opponent.
  useEffect(() => {
    if (loadedKifuView) return;
    if (aiMode === 'story' && gameMode === 'ai') {
      const targetLevel = Math.min(Math.max(storyProgress + 1, 1), 20);
      const idx = COMPUTERS.findIndex((c) => c.level === targetLevel);
      if (idx >= 0) {
        setComputerChar(idx);
        setLevel(targetLevel);
      }
    }
  }, [aiMode, storyProgress, gameMode, loadedKifuView]);

  // Auto-pass — passInfo intentionally NOT in deps: including it would
  // trigger the cleanup function on every state change and clear our own
  // pending timeout, leaving the game stuck on the pass message.
  useEffect(() => {
    if (gameOver || passInfo !== null) return;
    if (noCurrent && !noOpp) {
      setPassInfo(currentColor);
      const t = window.setTimeout(() => {
        setCurrentColor((c) => opponent(c));
        setPassInfo(null);
      }, 1600);
      return () => window.clearTimeout(t);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board, currentColor, noCurrent, noOpp, gameOver]);

  // doMove must be referenced from the AI effect. Use a ref to avoid
  // making the entire effect dependent on the function identity.
  const doMoveRef = useRef<(row: number, col: number) => void>(() => {});

  // AI move via Web Worker
  useEffect(() => {
    if (gameMode !== 'ai' || currentColor !== WHITE || gameOver || noCurrent || passInfo !== null) {
      setAiThinking(false);
      return;
    }
    setAiThinking(true);
    const delay = 450 + Math.min(level * 35, 700);
    let cancelled = false;
    const timer = window.setTimeout(() => {
      ai
        .requestMove(board, WHITE, level)
        .then((move) => {
          if (cancelled || !move) return;
          doMoveRef.current(move.row, move.col);
        })
        .catch(() => {
          /* cancelled by a newer request */
        })
        .finally(() => {
          if (!cancelled) setAiThinking(false);
        });
    }, delay);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      ai.cancel();
      setAiThinking(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentColor, gameMode, board, level, gameOver, noCurrent, passInfo]);

  // Record the result once gameOver fires. Story matches update the
  // active slot (advancing progress on a win, deducting a life on a
  // loss). Free matches feed the global free-stats bucket. Two-player
  // matches are not recorded.
  useEffect(() => {
    if (!gameOver || resultRecorded || loadedKifuView) return;
    if (gameMode !== 'ai') {
      // Two-player: nothing to record, but mark as handled to keep the
      // gate logic simple.
      setResultRecorded(true);
      return;
    }
    // Determine the result from the human's (Black's) perspective.
    let result: 'win' | 'loss' | 'draw' | 'resign';
    if (resigned !== null) {
      // Always counted as resign (the resigner is always Black in AI mode).
      result = 'resign';
    } else if (counts.black > counts.white) {
      result = 'win';
    } else if (counts.black < counts.white) {
      result = 'loss';
    } else {
      result = 'draw';
    }
    setLastResult(result);
    const opponentLevel = COMPUTERS[computerChar].level;
    const isStory = aiMode === 'story';
    if (isStory && activeSlotId !== null) {
      void recordSlotResult({
        slotId: activeSlotId,
        result,
        opponentLevel,
        isStory: true,
      }).then(setSlots);
    } else if (!isStory) {
      void recordFreeResult({ result, opponentLevel });
    }
    setResultRecorded(true);
  }, [
    gameOver,
    resultRecorded,
    loadedKifuView,
    aiMode,
    gameMode,
    counts.black,
    counts.white,
    resigned,
    activeSlotId,
    computerChar,
  ]);

  // Whenever a fresh game starts (kifu cleared, board reset) clear the
  // recorded-result gate so the next gameOver records again.
  useEffect(() => {
    if (kifu.length === 0 && !gameOver) setResultRecorded(false);
  }, [kifu.length, gameOver]);

  // Cancel hint when turn changes
  useEffect(() => {
    setHintMove(null);
  }, [currentColor]);

  // Android / browser back button: close the topmost layer instead of
  // exiting the PWA. Each "layer" pushes a history entry so popstate
  // brings us back one step. Order of priority: review -> modal ->
  // game -> title.
  useEffect(() => {
    const onPopState = () => {
      if (reviewOpen) {
        reviewHandleRef.current?.abort();
        setReviewOpen(false);
      } else if (slotPickerOpen) {
        setSlotPickerOpen(false);
      } else if (settingsOpen) {
        setSettingsOpen(false);
      } else if (kifuOpen) {
        setKifuOpen(false);
      } else if (infoOpen) {
        setInfoOpen(false);
      } else if (screen === 'game') {
        setScreen('title');
      }
      // Otherwise: let the browser handle (exits the PWA on title screen).
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [settingsOpen, kifuOpen, infoOpen, screen, reviewOpen, slotPickerOpen]);

  // Push a history entry whenever a new layer opens, so the back button
  // has something to pop. We compare against the previous depth to avoid
  // pushing on close.
  const layerDepthRef = useRef(0);
  useEffect(() => {
    const depth =
      (screen === 'game' ? 1 : 0) +
      (settingsOpen ? 1 : 0) +
      (kifuOpen ? 1 : 0) +
      (infoOpen ? 1 : 0) +
      (reviewOpen ? 1 : 0) +
      (slotPickerOpen ? 1 : 0);
    if (depth > layerDepthRef.current) {
      window.history.pushState({ depth }, '');
    }
    layerDepthRef.current = depth;
  }, [screen, settingsOpen, kifuOpen, infoOpen, reviewOpen, slotPickerOpen]);

  /* ----- Actions ----- */

  const doMove = useCallback(
    (row: number, col: number) => {
      const move = validMoveMap.get(moveKey(row, col));
      if (!move) return;

      setHistory((h) => [...h, { board, currentColor, lastMove }]);
      setHintMove(null);

      const next = applyMove(board, row, col, currentColor);
      if (!next) return;
      setBoard(next);
      setLastMove({ row, col, color: currentColor });
      setKifu((k) => [...k, { color: currentColor, row, col }]);

      const flipMap: Record<string, Color> = {};
      for (const f of move.flips) flipMap[moveKey(f.row, f.col)] = currentColor;
      setFlipping(flipMap);
      window.setTimeout(() => setFlipping({}), 700);

      setCurrentColor(opponent(currentColor));
    },
    [board, currentColor, lastMove, validMoveMap],
  );

  // Keep ref pointed at the latest doMove
  useEffect(() => {
    doMoveRef.current = doMove;
  }, [doMove]);

  function handleClick(row: number, col: number) {
    if (!isHumanTurn || aiThinking || gameOver || passInfo !== null) return;
    if (!validMoveMap.has(moveKey(row, col))) return;
    // First user click after loading a kifu means they want to resume
    // play, not just review — exit the loaded-view gate so subsequent
    // gameOver flow records normally.
    if (loadedKifuView) setLoadedKifuView(false);
    doMove(row, col);
  }

  function reset() {
    setBoard(createInitialBoard());
    setCurrentColor(BLACK);
    setLastMove(null);
    setPassInfo(null);
    setFlipping({});
    setAiThinking(false);
    setHistory([]);
    setHintMove(null);
    setLastResult(null);
    setKifu([]);
    setResigned(null);
    setLoadedKifuView(false);
    ai.cancel();
  }

  // Snapshot the current opponent while the game is in progress; once
  // gameOver fires we stop following computerChar so the gameOver modal
  // keeps showing the just-defeated opponent (storyProgress advancing
  // re-points computerChar to the *next* chapter, otherwise).
  useEffect(() => {
    if (gameOver) return;
    if (gameMode !== 'ai') {
      setOpponentSnapshot(null);
      return;
    }
    const c = COMPUTERS[computerChar];
    setOpponentSnapshot({
      kanji: c.kanji,
      name: c.name,
      image: c.image,
      level: c.level,
      quote: c.quote,
    });
  }, [gameOver, gameMode, computerChar, COMPUTERS]);

  /**
   * Resignation. The current side forfeits; the opponent is recorded as
   * the winner. Disabled during AI thinking, on pass, before any move,
   * or once the game is already over.
   */
  function resign() {
    if (gameOver || aiThinking || passInfo !== null || kifu.length === 0) return;
    if (!window.confirm(t.resignConfirm)) return;
    // The losing color is the side currently to move (in two-player) or
    // always Black in AI mode (the human is Black). Both reduce to
    // "currentColor" because the AI auto-plays so resign during AI's
    // turn shouldn't be reachable anyway.
    const loser: Color = gameMode === 'ai' ? BLACK : currentColor;
    setResigned(loser);
    ai.cancel();
    setAiThinking(false);
    setHintMove(null);
  }

  function startGame(selection: TitleStartMode) {
    if (selection.mode === 'human') {
      setGameMode('human');
    } else {
      // Story mode requires an active slot; otherwise open the picker
      // and let the user pick before entering the game.
      if (selection.sub === 'story' && activeSlotId === null) {
        setSlotPickerOpen(true);
        return;
      }
      setGameMode('ai');
      setAiMode(selection.sub);
    }
    reset();
    setScreen('game');
  }

  /** Pick (or switch) the active save slot, then jump straight into
   *  story mode with that slot. */
  function selectSlot(id: number) {
    setActiveSlotIdState(id);
    void setActiveSlotId(id);
    setSlotPickerOpen(false);
    setGameMode('ai');
    setAiMode('story');
    reset();
    setScreen('game');
  }

  /** Wipes the active slot back to defaults (keeps name + avatar). */
  async function resetStoryProgress() {
    if (activeSlotId === null) return;
    const next = await resetStoredSlot(activeSlotId);
    setSlots(next);
    reset();
  }

  function undo() {
    if (aiThinking) return;
    if (history.length === 0) return;
    setHintMove(null);
    setFlipping({});
    setPassInfo(null);
    ai.cancel();

    if (gameMode === 'ai') {
      let i = history.length - 1;
      while (i >= 0 && history[i].currentColor !== BLACK) i--;
      if (i < 0) return;
      const target = history[i];
      setBoard(target.board);
      setCurrentColor(BLACK);
      setLastMove(target.lastMove);
      setHistory(history.slice(0, i));
      setKifu(kifu.slice(0, i));
    } else {
      const target = history[history.length - 1];
      setBoard(target.board);
      setCurrentColor(target.currentColor);
      setLastMove(target.lastMove);
      setHistory(history.slice(0, -1));
      setKifu(kifu.slice(0, -1));
    }
  }

  /* ----- Kifu helpers ----- */

  function loadSavedSlots() {
    void listSlots().then(setSavedSlots);
  }

  function saveCurrentKifu(name: string) {
    if (!name) return;
    const trimmed = name.trim().slice(0, 40);
    if (!trimmed) return;
    const result: Color | typeof EMPTY | null = gameOver
      ? counts.black > counts.white
        ? BLACK
        : counts.black < counts.white
          ? WHITE
          : EMPTY
      : null;
    void storageSaveSlot({
      name: trimmed,
      gameMode,
      aiMode,
      computerChar,
      level,
      kifu,
      storyProgress,
      counts: { black: counts.black, white: counts.white },
      result,
    }).then(() => {
      loadSavedSlots();
      setKifuName('');
    });
  }

  function deleteSlot(key: string) {
    void storageDeleteSlot(key).then(loadSavedSlots);
  }

  function loadKifuMoves(slot: SavedSlot) {
    const savedKifu = slot.kifu ?? [];
    let b = createInitialBoard();
    for (const m of savedKifu) {
      const next = applyMove(b, m.row, m.col, m.color);
      if (!next) break;
      b = next;
    }
    const lastM = savedKifu.length > 0 ? savedKifu[savedKifu.length - 1] : null;
    setBoard(b);
    setKifu([...savedKifu]);
    setHistory([]);
    setLastMove(lastM ? { row: lastM.row, col: lastM.col, color: lastM.color } : null);
    setCurrentColor(savedKifu.length % 2 === 0 ? BLACK : WHITE);
    setHintMove(null);
    setPassInfo(null);
    setFlipping({});
    setLastResult(null);
    setResigned(null);
    setKifuOpen(false);
    ai.cancel();
    // Restore the match context the kifu was saved in so the player
    // panels show the actual opponent (and level badge) rather than
    // whatever chapter the user is currently up to.
    if (
      typeof slot.computerChar === 'number' &&
      slot.computerChar >= 0 &&
      slot.computerChar < COMPUTERS.length
    ) {
      setComputerChar(slot.computerChar);
    }
    if (typeof slot.level === 'number' && slot.level >= 1 && slot.level <= 20) {
      setLevel(slot.level);
    }
    setLoadedKifuView(true);
    setResultRecorded(true);
  }

  /* ----- Hint ----- */

  function toggleHint() {
    if (hintMove) {
      setHintMove(null);
      return;
    }
    if (!isHumanTurn || aiThinking || gameOver || noCurrent || passInfo !== null) return;
    const strongLevel = Math.min(20, Math.max(level + 4, 16));
    const move = pickAIMove(board, validMoves, strongLevel, currentColor);
    if (move) setHintMove({ row: move.row, col: move.col });
  }

  function selectCharacter(idx: number) {
    setComputerChar(idx);
    setLevel(COMPUTERS[idx].level);
  }

  /* ----- Post-game review ----- */

  function startReview() {
    if (kifu.length === 0) return;
    // Cancel any in-flight stream first.
    reviewHandleRef.current?.abort();
    setReviewError(null);
    setReviewText('');
    setReviewLoading(true);
    setReviewOpen(true);
    setReviewReadOnly(false);
    setReviewSavedAtState(null);
    setReviewSavedFlash(false);

    // Reviewing the *played* opponent: pull from the snapshot (not the
    // possibly-already-bumped computerChar). Falls back to current for
    // free / two-player matches.
    const oppLevel =
      gameMode === 'ai'
        ? (opponentSnapshot?.level ?? COMPUTERS[computerChar].level)
        : undefined;
    const oppName =
      gameMode === 'ai'
        ? (opponentSnapshot?.name ?? COMPUTERS[computerChar].name)
        : AVATARS[p2Avatar].name;
    const args = {
      kifu,
      blackCount: counts.black,
      whiteCount: counts.white,
      blackName: AVATARS[p1Avatar].name,
      whiteName: oppName,
      level: oppLevel,
      levelLabel: oppLevel !== undefined ? getLevelLabel(oppLevel, t) : undefined,
      chapter:
        aiMode === 'story' && gameMode === 'ai' && oppLevel !== undefined
          ? oppLevel
          : undefined,
    };

    reviewHandleRef.current = streamReview(args, locale, {
      onText: (delta) => setReviewText((prev) => prev + delta),
      onError: (err) => {
        setReviewError(err.message);
        setReviewLoading(false);
      },
      onDone: () => setReviewLoading(false),
    });
  }

  function closeReview() {
    reviewHandleRef.current?.abort();
    reviewHandleRef.current = null;
    setReviewOpen(false);
    setReviewLoading(false);
    setReviewReadOnly(false);
    setReviewSavedAtState(null);
    setReviewSavedFlash(false);
  }

  function cancelReview() {
    reviewHandleRef.current?.abort();
    reviewHandleRef.current = null;
    setReviewLoading(false);
  }

  /** Persist the streamed review together with the current kifu so the
   *  user can revisit it from the Kifu Library later. Auto-generates a
   *  short name (e.g. "Ch.5 vs 響") so the user doesn't have to type. */
  function saveReviewWithKifu() {
    if (!reviewText.trim() || kifu.length === 0) return;
    const ts = new Date();
    const stamp = `${ts.getMonth() + 1}/${ts.getDate()} ${String(ts.getHours()).padStart(2, '0')}:${String(ts.getMinutes()).padStart(2, '0')}`;
    // Use the just-defeated opponent (snapshot), not the auto-bumped
    // current opponent. Falls back to COMPUTERS[computerChar] for
    // free / two-player matches where the snapshot was never set.
    const oppName = opponentSnapshot?.name ?? COMPUTERS[computerChar].name;
    const oppLevel = opponentSnapshot?.level ?? COMPUTERS[computerChar].level;
    const oppIdx = COMPUTERS.findIndex((c) => c.level === oppLevel);
    const isStory = aiMode === 'story' && gameMode === 'ai';
    const baseName = isStory
      ? `第${oppLevel}章 vs ${oppName}`
      : gameMode === 'ai'
        ? `vs ${oppName} Lv.${oppLevel}`
        : `${AVATARS[p1Avatar].name} vs ${AVATARS[p2Avatar].name}`;
    const name = `${baseName} (${stamp})`;
    const result: Color | typeof EMPTY | null = gameOver
      ? counts.black > counts.white
        ? BLACK
        : counts.black < counts.white
          ? WHITE
          : EMPTY
      : null;
    void storageSaveSlot({
      name,
      gameMode,
      aiMode,
      computerChar: oppIdx >= 0 ? oppIdx : computerChar,
      level: oppLevel,
      kifu,
      storyProgress,
      counts: { black: counts.black, white: counts.white },
      result,
      review: reviewText,
    }).then(() => {
      setReviewSavedFlash(true);
      window.setTimeout(() => setReviewSavedFlash(false), 2000);
    });
  }

  /** Open the review modal in read-only mode showing a previously saved
   *  review string. */
  function viewSavedReview(text: string, savedAt: number) {
    reviewHandleRef.current?.abort();
    reviewHandleRef.current = null;
    setReviewError(null);
    setReviewLoading(false);
    setReviewText(text);
    setReviewReadOnly(true);
    setReviewSavedAtState(savedAt);
    setReviewSavedFlash(false);
    setKifuOpen(false);
    setReviewOpen(true);
  }

  // Abort any pending review stream when the component unmounts.
  useEffect(
    () => () => {
      reviewHandleRef.current?.abort();
    },
    [],
  );

  /* ----- Derived display info ----- */

  const blackInfo = {
    kanji: AVATARS[p1Avatar].kanji,
    idx: p1Avatar,
    image: AVATARS[p1Avatar].image,
    name: AVATARS[p1Avatar].name,
    quote: AVATARS[p1Avatar].quote,
  };
  const whiteInfo =
    gameMode === 'ai'
      ? {
          kanji: COMPUTERS[computerChar].kanji,
          idx: computerChar + 100,
          image: COMPUTERS[computerChar].image,
          name: COMPUTERS[computerChar].name,
          quote: COMPUTERS[computerChar].quote,
          level: COMPUTERS[computerChar].level,
        }
      : {
          kanji: AVATARS[p2Avatar].kanji,
          idx: p2Avatar + 50,
          image: AVATARS[p2Avatar].image,
          name: AVATARS[p2Avatar].name,
          quote: AVATARS[p2Avatar].quote,
          level: undefined,
        };

  const winner: Color | typeof EMPTY | null = gameOver
    ? resigned !== null
      ? // The side that resigned forfeits; opponent wins.
        opponent(resigned)
      : counts.black > counts.white
        ? BLACK
        : counts.white > counts.black
          ? WHITE
          : EMPTY
    : null;
  const total = counts.black + counts.white;
  const blackPercent = total > 0 ? (counts.black / total) * 100 : 50;

  const canUndo =
    !aiThinking &&
    history.length > 0 &&
    (gameMode === 'human' || history.some((h) => h.currentColor === BLACK));
  const canHint = isHumanTurn && !aiThinking && !gameOver && !noCurrent && passInfo === null;

  /* ============================================================
     Render
     ============================================================ */

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap');

        .jp-display { font-family: 'Shippori Mincho', 'Noto Serif JP', serif; font-feature-settings: "palt"; }
        .latin-display { font-family: 'Cormorant Garamond', 'Shippori Mincho', serif; }

        .stage-bg {
          background:
            radial-gradient(ellipse 80% 50% at 50% -10%, rgba(201, 169, 97, 0.18), transparent 60%),
            radial-gradient(ellipse 60% 40% at 50% 100%, rgba(31, 88, 71, 0.28), transparent 60%),
            linear-gradient(180deg, #2a2412 0%, #1c1810 100%);
        }
        .stage-bg::before {
          content: ''; position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.7 0 0 0 0 0.6 0 0 0 0 0.4 0 0 0 0.5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.07; mix-blend-mode: overlay; pointer-events: none;
        }

        .board-felt {
          background: #267a5e;
          box-shadow:
            0 14px 28px -10px rgba(0,0,0,0.55),
            0 0 0 6px #2a1f14,
            0 0 0 7px #c9a961,
            0 0 0 13px #1a130c;
        }

        .cell {
          background: rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.4);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
          position: relative;
          transition: background 0.2s ease;
        }
        .cell.valid { cursor: pointer; }
        .cell.valid:hover { background: rgba(201, 169, 97, 0.18); }

        .star-dot::after {
          content: ''; position: absolute;
          width: 5px; height: 5px;
          background: rgba(245, 230, 200, 0.28);
          border-radius: 50%; top: -2.5px; left: -2.5px;
          pointer-events: none;
        }

        .piece {
          width: 78%; height: 78%;
          border-radius: 50%; position: relative;
          animation: place-in 0.32s cubic-bezier(.34,1.56,.64,1);
        }
        @keyframes place-in {
          0% { transform: scale(0.2); opacity: 0; }
          70% { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }

        .piece-B {
          background: radial-gradient(circle at 30% 30%, #5a5a5a, #1a1a1a 55%, #000);
          box-shadow: inset -2px -2px 4px rgba(0,0,0,0.6), inset 2px 2px 6px rgba(255,255,255,0.12), 0 4px 8px rgba(0,0,0,0.55);
        }
        .piece-W {
          background: radial-gradient(circle at 30% 30%, #ffffff, #ebe2cc 55%, #c5b89c);
          box-shadow: inset -2px -2px 4px rgba(0,0,0,0.2), inset 2px 2px 6px rgba(255,255,255,0.6), 0 4px 8px rgba(0,0,0,0.55);
        }

        .piece.flip-to-B { animation: flip-to-B 0.7s ease-in-out forwards; }
        .piece.flip-to-W { animation: flip-to-W 0.7s ease-in-out forwards; }
        @keyframes flip-to-B {
          0%   { transform: rotateY(0deg);   background: radial-gradient(circle at 30% 30%, #ffffff, #ebe2cc 55%, #c5b89c); }
          49%  { background: radial-gradient(circle at 30% 30%, #ffffff, #ebe2cc 55%, #c5b89c); }
          50%  { transform: rotateY(90deg); }
          51%  { background: radial-gradient(circle at 30% 30%, #5a5a5a, #1a1a1a 55%, #000); }
          100% { transform: rotateY(180deg); background: radial-gradient(circle at 30% 30%, #5a5a5a, #1a1a1a 55%, #000); }
        }
        @keyframes flip-to-W {
          0%   { transform: rotateY(0deg);   background: radial-gradient(circle at 30% 30%, #5a5a5a, #1a1a1a 55%, #000); }
          49%  { background: radial-gradient(circle at 30% 30%, #5a5a5a, #1a1a1a 55%, #000); }
          50%  { transform: rotateY(90deg); }
          51%  { background: radial-gradient(circle at 30% 30%, #ffffff, #ebe2cc 55%, #c5b89c); }
          100% { transform: rotateY(180deg); background: radial-gradient(circle at 30% 30%, #ffffff, #ebe2cc 55%, #c5b89c); }
        }

        .last-move-ring {
          position: absolute; inset: 9%;
          border-radius: 50%;
          border: 2px solid #c9a961;
          opacity: 0.7;
          animation: pulse 2s infinite ease-in-out;
          pointer-events: none;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.04); }
        }

        .move-hint {
          width: 46%; height: 46%;
          border-radius: 50%;
          background: radial-gradient(circle at 50% 45%,
            rgba(220, 240, 255, 0.9) 0%,
            rgba(150, 200, 240, 0.55) 50%,
            rgba(100, 160, 220, 0.2) 100%);
          box-shadow:
            0 0 12px rgba(160, 210, 255, 0.55),
            inset 0 0 6px rgba(255, 255, 255, 0.4);
          animation: hint-glow 2.6s infinite ease-in-out;
          pointer-events: none;
        }
        .cell.valid:hover .move-hint { opacity: 1; }
        @keyframes hint-glow {
          0%, 100% { opacity: 0.55; }
          50%      { opacity: 0.95; }
        }

        .hint-marker {
          position: absolute;
          inset: 12%;
          border-radius: 50%;
          background:
            radial-gradient(circle, rgba(255,225,140,0.85) 0%, rgba(255,180,80,0.4) 45%, transparent 70%);
          box-shadow: 0 0 18px rgba(255,210,120,0.65);
          animation: hint-pulse 1.1s infinite ease-in-out;
          pointer-events: none;
          z-index: 4;
        }
        .hint-marker::after {
          content: '★';
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          color: #fffaeb;
          font-size: 1.4em;
          text-shadow: 0 0 10px rgba(255,225,140,0.9);
        }
        @keyframes hint-pulse {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.18); opacity: 1; }
        }

        .ornament {
          letter-spacing: 0.5em;
          color: rgba(201, 169, 97, 0.45);
        }

        .btn {
          font-family: 'Shippori Mincho', serif;
          padding: 0.55rem 1.2rem;
          border: 1px solid rgba(201, 169, 97, 0.35);
          color: rgba(245, 232, 200, 0.92);
          letter-spacing: 0.12em;
          font-size: 0.875rem;
          background: transparent;
          transition: all 0.25s ease;
          border-radius: 2px;
          cursor: pointer;
        }
        .btn:hover:not(:disabled) {
          border-color: rgba(201, 169, 97, 0.75);
          background: rgba(201, 169, 97, 0.08);
          color: #f5e8c8;
        }
        .btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .btn-active {
          background: rgba(201, 169, 97, 0.15);
          border-color: rgba(201, 169, 97, 0.7);
          color: #fff5d4;
        }

        .modal-bg {
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .modal-card {
          background: linear-gradient(180deg, rgba(20, 17, 10, 0.97), rgba(10, 8, 5, 0.97));
          border: 1px solid rgba(201, 169, 97, 0.35);
          box-shadow: 0 0 0 1px rgba(201,169,97,0.12), 0 30px 80px rgba(0,0,0,0.7);
        }

        .scroll-y { overflow-y: auto; }
        .scroll-y::-webkit-scrollbar { width: 6px; }
        .scroll-y::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
        .scroll-y::-webkit-scrollbar-thumb { background: rgba(201, 169, 97, 0.3); border-radius: 3px; }
      `}</style>

      {screen === 'title' && (
        <TitleScreen
          storyProgress={storyProgress}
          firstChapterName={COMPUTERS[0].name}
          onStart={startGame}
          t={t}
          locale={locale}
          onLocaleChange={setLocale}
          activeSlot={
            activeSlot
              ? {
                  name: activeSlot.name,
                  lives: activeSlot.lives,
                  storyProgress: activeSlot.storyProgress,
                }
              : null
          }
          onSwitchSlot={() => setSlotPickerOpen(true)}
        />
      )}

      {screen === 'game' && (
      <div className="stage-bg min-h-screen w-full relative">
        <div className="relative max-w-5xl mx-auto px-4 py-6 md:py-10">
          {/* Top icon toolbar */}
          <div className="grid grid-cols-8 gap-px bg-zinc-900/80 border-y border-amber-200/15 mb-5 md:rounded-sm overflow-hidden">
            <ToolbarBtn icon={Home} label={t.toolbarTitle} onClick={() => setScreen('title')} />
            <ToolbarBtn icon={Menu} label={t.toolbarMenu} onClick={() => setSettingsOpen(true)} />
            <ToolbarBtn
              icon={Lightbulb}
              label={t.toolbarHint}
              onClick={toggleHint}
              active={hintMove !== null}
              disabled={!canHint && hintMove === null}
            />
            <ToolbarBtn icon={Undo2} label={t.toolbarUndo} onClick={undo} disabled={!canUndo} />
            <ToolbarBtn icon={Info} label={t.toolbarInfo} onClick={() => setInfoOpen(true)} />
            <ToolbarBtn
              icon={Flag}
              label={t.toolbarResign}
              onClick={resign}
              disabled={gameOver || aiThinking || passInfo !== null || kifu.length === 0}
            />
            <ToolbarBtn icon={RotateCcw} label={t.toolbarReset} onClick={reset} />
            <ToolbarBtn
              icon={FolderOpen}
              label={t.toolbarKifu}
              onClick={() => {
                loadSavedSlots();
                setKifuOpen(true);
              }}
            />
          </div>

          {/* Score panels + board */}
          <div className="grid md:grid-cols-[1fr_auto_1fr] landscape:grid-cols-[1fr_auto_1fr] gap-3 md:gap-6 landscape:gap-4 items-center">
            <div className="md:order-1">
              <PlayerPanel
                color={BLACK}
                count={counts.black}
                isActive={currentColor === BLACK && !gameOver && passInfo === null}
                kanji={blackInfo.kanji}
                idx={blackInfo.idx}
                image={blackInfo.image}
                name={blackInfo.name}
                quote={blackInfo.quote}
                lives={
                  gameMode === 'ai' && aiMode === 'story' && activeSlot
                    ? lives
                    : undefined
                }
              />
            </div>

            <div className="md:order-2">
              <div className="board-felt p-3 md:p-4 rounded-sm relative">
                <div style={{ width: 'min(86vmin, 520px)' }}>
                  <div className="flex mb-1">
                    <div style={{ width: 18 }} />
                    <div className="flex-1 grid grid-cols-8">
                      {Array.from({ length: 8 }, (_, c) => (
                        <div
                          key={c}
                          className="text-center latin-display italic text-amber-200/70 text-[10px] md:text-xs"
                        >
                          {String.fromCharCode(65 + c)}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex">
                    <div style={{ width: 18 }} className="flex flex-col">
                      {Array.from({ length: 8 }, (_, r) => (
                        <div
                          key={r}
                          className="flex-1 flex items-center justify-center latin-display italic text-amber-200/70 text-[10px] md:text-xs"
                        >
                          {r + 1}
                        </div>
                      ))}
                    </div>
                    <div
                      className="flex-1 grid grid-cols-8 grid-rows-8 gap-0"
                      style={{ aspectRatio: '1 / 1' }}
                    >
                      {board.map((row, r) =>
                        row.map((cell: Disc, c) => {
                          const isValid =
                            validMoveMap.has(moveKey(r, c)) &&
                            isHumanTurn &&
                            !aiThinking &&
                            !gameOver &&
                            passInfo === null;
                          const isStar = (r === 2 || r === 6) && (c === 2 || c === 6);
                          const isLast =
                            lastMove !== null && lastMove.row === r && lastMove.col === c;
                          const flipTo = flipping[moveKey(r, c)];
                          const isHint = hintMove !== null && hintMove.row === r && hintMove.col === c;
                          return (
                            <div
                              key={`${r}-${c}`}
                              onClick={() => isValid && handleClick(r, c)}
                              className={`cell flex items-center justify-center ${
                                isValid ? 'valid' : ''
                              } ${isStar ? 'star-dot' : ''}`}
                            >
                              {cell !== EMPTY && (
                                <div
                                  key={`${r}-${c}-${flipTo ?? cell}`}
                                  className={`piece ${
                                    flipTo
                                      ? `flip-to-${colorChar(flipTo)}`
                                      : `piece-${colorChar(cell as Color)}`
                                  }`}
                                />
                              )}
                              {cell === EMPTY && isValid && <div className="move-hint" />}
                              {isLast && <div className="last-move-ring" />}
                              {isHint && <div className="hint-marker" />}
                            </div>
                          );
                        }),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:order-3">
              <PlayerPanel
                color={WHITE}
                count={counts.white}
                isActive={currentColor === WHITE && !gameOver && passInfo === null}
                kanji={whiteInfo.kanji}
                idx={whiteInfo.idx}
                image={whiteInfo.image}
                name={whiteInfo.name}
                quote={whiteInfo.quote}
                level={whiteInfo.level}
                thinking={aiThinking}
              />
            </div>
          </div>

          {/* Progress bar */}
          <div className="max-w-xl mx-auto mt-7">
            <div className="h-1.5 rounded-full overflow-hidden flex bg-amber-100/10 border border-amber-200/10">
              <div
                className="transition-all duration-500 ease-out"
                style={{
                  width: `${blackPercent}%`,
                  background: 'linear-gradient(90deg, #1a1a1a, #3a3a3a)',
                }}
              />
              <div
                className="transition-all duration-500 ease-out"
                style={{
                  width: `${100 - blackPercent}%`,
                  background: 'linear-gradient(90deg, #ebe2cc, #ffffff)',
                }}
              />
            </div>
            <div className="flex justify-between mt-1.5 latin-display italic text-amber-200/65 text-xs tracking-wider">
              <span>{counts.black} {t.black}</span>
              <span>{t.white} {counts.white}</span>
            </div>
          </div>

          <div className="text-center mt-6 latin-display italic text-amber-200/55 text-xs tracking-[0.3em] uppercase">
            {gameMode === 'human'
              ? t.footerHuman
              : aiMode === 'story'
                ? storyProgress >= 20
                  ? t.footerStoryComplete(COMPUTERS[computerChar].name)
                  : t.footerChapter(storyProgress + 1, COMPUTERS[computerChar].name)
                : t.footerFree(COMPUTERS[computerChar].name, level, getLevelLabel(level, t))}
          </div>

          {/* Pass message */}
          {passInfo !== null && (
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-30 px-4">
              <div className="bg-black/75 backdrop-blur-sm border border-amber-200/30 px-7 py-4 rounded-sm">
                <p className="jp-display text-amber-100 text-lg md:text-xl tracking-wider text-center">
                  {t.passMessage(passInfo === BLACK ? t.black : t.white)}
                </p>
              </div>
            </div>
          )}

          {/* Game over modal */}
          {gameOver && !settingsOpen && !loadedKifuView && (() => {
            const isStoryMode = aiMode === 'story' && gameMode === 'ai';
            const justAdvanced = isStoryMode && lastResult === 'win';
            const justCompletedStory = justAdvanced && storyProgress >= 20;
            const showNextChapter = justAdvanced && storyProgress < 20;
            const nextOpp = showNextChapter
              ? COMPUTERS.find((c) => c.level === storyProgress + 1)
              : null;
            const playedChapter = justAdvanced ? storyProgress : storyProgress + 1;
            const isGameOverScreen =
              isStoryMode &&
              activeSlot !== null &&
              lives === 0 &&
              (lastResult === 'loss' || lastResult === 'resign');

            if (isGameOverScreen) {
              return (
                <div className="modal-bg fixed inset-0 flex items-center justify-center z-40 p-4">
                  <div className="modal-card px-8 md:px-10 py-10 md:py-12 max-w-md w-full text-center rounded-sm">
                    <div className="latin-display italic ornament text-[10px] md:text-xs uppercase mb-3 text-red-300/80">
                      — {t.gameOverScreenLabel} —
                    </div>
                    <h2
                      className="jp-display text-4xl md:text-5xl font-bold mb-6 tracking-[0.18em] text-red-200/95"
                      style={{ textShadow: '0 0 18px rgba(220, 80, 80, 0.35)' }}
                    >
                      {t.gameOverScreenTitle}
                    </h2>

                    <p className="jp-display text-amber-100/85 text-sm md:text-base leading-relaxed mb-5 whitespace-pre-line">
                      {t.gameOverScreenProse}
                    </p>

                    <div className="flex items-center justify-center gap-2 mb-5 latin-display italic text-red-300/85 text-xs tracking-wider">
                      <span>{t.livesLabel}:</span>
                      <span className="text-red-200/95 tabular-nums text-lg">♥ 0</span>
                    </div>

                    {gameMode === 'ai' && kifu.length > 0 && (
                      <div className="flex justify-center mt-3 mb-3">
                        <button onClick={startReview} className="btn">
                          {t.reviewMatchButton}
                        </button>
                      </div>
                    )}

                    <div className="flex flex-col gap-2 mt-4">
                      <button
                        onClick={() => void resetStoryProgress()}
                        className="btn btn-active"
                      >
                        {t.gameOverResetSave}
                      </button>
                      <button
                        onClick={() => {
                          setSlotPickerOpen(true);
                        }}
                        className="btn"
                      >
                        {t.slotSwitch}
                      </button>
                      <button onClick={reset} className="btn">
                        {t.gameOverTryAgainNoLives}
                      </button>
                      <button
                        onClick={() => setScreen('title')}
                        className="btn"
                      >
                        {t.gameOverBackToTitle}
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div className="modal-bg fixed inset-0 flex items-center justify-center z-40 p-4">
                <div className="modal-card px-8 md:px-10 py-10 md:py-12 max-w-md w-full text-center rounded-sm">
                  <div className="latin-display italic ornament text-[10px] md:text-xs uppercase mb-3">
                    {justCompletedStory
                      ? t.storyComplete
                      : isStoryMode
                        ? t.chapterN(playedChapter)
                        : t.finalResult}
                  </div>
                  <h2 className="jp-display text-4xl md:text-5xl text-amber-100 font-bold mb-6 tracking-[0.15em]">
                    {justCompletedStory
                      ? t.storyEnding
                      : isStoryMode
                        ? winner === BLACK
                          ? t.storyVictory
                          : winner === EMPTY
                            ? t.storyDraw
                            : t.storyDefeat
                        : winner === EMPTY
                          ? t.resultDraw
                          : winner === BLACK
                            ? t.resultBlackWin
                            : t.resultWhiteWin}
                  </h2>

                  {justCompletedStory && (
                    <p className="jp-display text-amber-100/85 text-sm md:text-base leading-relaxed mb-5 whitespace-pre-line">
                      {t.storyEndingProse}
                    </p>
                  )}
                  {isStoryMode && winner !== BLACK && (
                    <p className="jp-display text-amber-200/60 text-sm italic mb-3">
                      {t.storyEncouragement}
                    </p>
                  )}

                  {/* You vs the opponent that was just played + final score. */}
                  <div className="flex justify-center items-center gap-6 md:gap-8 my-5">
                    <div className="flex flex-col items-center gap-2">
                      <AvatarBadge
                        kanji={blackInfo.kanji}
                        idx={blackInfo.idx}
                        image={blackInfo.image}
                        size="md"
                      />
                      <div
                        className="w-10 h-10 rounded-full"
                        style={{
                          background:
                            'radial-gradient(circle at 30% 30%, #5a5a5a, #1a1a1a 55%, #000)',
                          boxShadow:
                            'inset -2px -2px 4px rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.5)',
                        }}
                      />
                      <div className="jp-display text-amber-100/85 text-[11px] truncate max-w-[6rem] text-center">
                        {blackInfo.name}
                      </div>
                      <div className="latin-display text-3xl md:text-4xl text-amber-100 leading-none">
                        {counts.black}
                      </div>
                    </div>
                    <div className="latin-display italic text-amber-200/65 text-xl">vs</div>
                    <div className="flex flex-col items-center gap-2">
                      {(() => {
                        // For AI matches use the opponent snapshot (the
                        // character that was actually just played); for
                        // human matches stick with whiteInfo (P2 avatar).
                        const opp =
                          gameMode === 'ai' && opponentSnapshot
                            ? {
                                kanji: opponentSnapshot.kanji,
                                idx: 100 + opponentSnapshot.level,
                                image: opponentSnapshot.image,
                                name: opponentSnapshot.name,
                              }
                            : {
                                kanji: whiteInfo.kanji,
                                idx: whiteInfo.idx,
                                image: whiteInfo.image,
                                name: whiteInfo.name,
                              };
                        return (
                          <>
                            <AvatarBadge
                              kanji={opp.kanji}
                              idx={opp.idx}
                              image={opp.image}
                              size="md"
                            />
                            <div
                              className="w-10 h-10 rounded-full"
                              style={{
                                background:
                                  'radial-gradient(circle at 30% 30%, #ffffff, #ebe2cc 55%, #c5b89c)',
                                boxShadow:
                                  'inset 2px 2px 6px rgba(255,255,255,0.6), 0 4px 8px rgba(0,0,0,0.5)',
                              }}
                            />
                            <div className="jp-display text-amber-100/85 text-[11px] truncate max-w-[6rem] text-center">
                              {opp.name}
                            </div>
                            <div className="latin-display text-3xl md:text-4xl text-amber-100 leading-none">
                              {counts.white}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {isStoryMode && activeSlot && (
                    <div className="flex items-center justify-center gap-2 mb-3 latin-display italic text-amber-200/65 text-xs tracking-wider">
                      <span>{t.livesLabel}:</span>
                      <span className="text-amber-100/95 tabular-nums text-base">
                        ♥ {lives}
                      </span>
                      {lives === 0 && (
                        <span className="jp-display text-amber-200/55 text-[10px] ml-2">
                          {t.livesGameOverWarning}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Next-chapter preview block — shown after the score so the
                       just-defeated opponent isn't visually replaced. */}
                  {showNextChapter && nextOpp && (
                    <div className="mt-3 mb-3 px-3 py-3 bg-amber-200/[0.06] border border-amber-200/25 rounded-sm">
                      <div className="latin-display italic text-amber-200/55 text-[10px] tracking-[0.25em] uppercase mb-2">
                        Next Chapter ▸
                      </div>
                      <div className="flex items-center gap-3">
                        <AvatarBadge
                          kanji={nextOpp.kanji}
                          idx={100 + nextOpp.level}
                          image={nextOpp.image}
                          size="sm"
                        />
                        <div className="flex-1 min-w-0 text-left">
                          <div className="jp-display text-amber-100/95 text-sm truncate">
                            {t.nextOpponentIs(nextOpp.name)}
                          </div>
                          <div className="latin-display italic text-amber-200/55 text-[10px] tracking-wider">
                            Lv.{nextOpp.level} {getLevelLabel(nextOpp.level, t)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {!isStoryMode && gameMode === 'ai' && (
                    <p className="jp-display text-amber-200/60 text-sm italic mb-2">
                      「
                      {winner === BLACK
                        ? t.gameOverAiQuoteWin
                        : winner === WHITE
                          ? t.gameOverAiQuoteLose
                          : t.gameOverAiQuoteDraw}
                      」
                    </p>
                  )}

                  {gameMode === 'ai' && kifu.length > 0 && (
                    <div className="flex justify-center mt-3 mb-1">
                      <button onClick={startReview} className="btn">
                        {t.reviewMatchButton}
                      </button>
                    </div>
                  )}

                  <div className="flex justify-center gap-2 mt-4">
                    {justCompletedStory ? (
                      <button onClick={resetStoryProgress} className="btn">
                        {t.retryStory}
                      </button>
                    ) : showNextChapter ? (
                      <button onClick={reset} className="btn btn-active">
                        {t.nextChapter}
                      </button>
                    ) : (
                      <button onClick={reset} className="btn">
                        {t.oneMore}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Loaded-kifu review banner. Replaces the gameOver modal
              while a saved kifu is being inspected so the user can:
              - read the kifu log via Info
              - generate / view a Claude review
              - close the view to start a fresh game */}
          {loadedKifuView && !infoOpen && !kifuOpen && !reviewOpen && !settingsOpen && (
            <div className="fixed left-1/2 -translate-x-1/2 bottom-4 z-30 flex items-center gap-2 px-4 py-2.5 rounded-sm border border-amber-200/30 bg-zinc-950/85 backdrop-blur-sm shadow-lg">
              <span className="latin-display italic text-amber-200/70 text-[11px] tracking-[0.25em] uppercase pr-1">
                {t.kifuViewingLabel}
              </span>
              {gameMode === 'ai' && kifu.length > 0 && (
                <button onClick={startReview} className="btn text-xs px-3 py-1.5">
                  {t.reviewMatchButton}
                </button>
              )}
              <button onClick={reset} className="btn text-xs px-3 py-1.5">
                {t.kifuViewingClose}
              </button>
            </div>
          )}

          {/* Match info modal */}
          {infoOpen && (
            <div className="modal-bg fixed inset-0 z-50 flex items-stretch md:items-center justify-center p-2 md:p-6">
              <div className="modal-card scroll-y w-full max-w-lg max-h-[95vh] rounded-sm p-5 md:p-7">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="latin-display italic ornament text-[10px] uppercase mb-1">
                      — {t.matchInfo} —
                    </div>
                    <h2 className="jp-display text-amber-100 text-xl md:text-2xl font-bold tracking-[0.15em]">
                      {t.matchInfo}
                    </h2>
                  </div>
                  <button onClick={() => setInfoOpen(false)} className="btn">
                    {t.close}
                  </button>
                </div>

                <div className="mb-4 px-3 py-2.5 bg-amber-200/[0.03] border border-amber-200/15 rounded-sm">
                  <div className="latin-display italic text-amber-200/70 text-[10px] tracking-[0.25em] uppercase mb-1">
                    {t.mode}
                  </div>
                  <div className="jp-display text-amber-100/90 text-sm">
                    {gameMode === 'human'
                      ? t.modeHuman
                      : aiMode === 'story'
                        ? storyProgress >= 20
                          ? t.modeStoryComplete
                          : t.modeStoryProgress(storyProgress + 1)
                        : t.modeFreeLevel(level, getLevelLabel(level, t))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="px-3 py-2.5 bg-amber-200/[0.03] border border-amber-200/15 rounded-sm">
                    <div className="latin-display italic text-amber-200/70 text-[10px] tracking-[0.25em] uppercase mb-1">
                      {t.black}
                    </div>
                    <div className="flex items-center gap-2">
                      <AvatarBadge
                        kanji={blackInfo.kanji}
                        idx={blackInfo.idx}
                        image={blackInfo.image}
                        size="sm"
                      />
                      <div className="min-w-0">
                        <div className="jp-display text-amber-100/90 text-sm truncate">
                          {blackInfo.name}
                        </div>
                        <div className="latin-display tabular-nums text-amber-100 text-lg leading-none">
                          {counts.black}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-3 py-2.5 bg-amber-200/[0.03] border border-amber-200/15 rounded-sm">
                    <div className="latin-display italic text-amber-200/70 text-[10px] tracking-[0.25em] uppercase mb-1">
                      {t.white}
                    </div>
                    <div className="flex items-center gap-2">
                      <AvatarBadge
                        kanji={whiteInfo.kanji}
                        idx={whiteInfo.idx}
                        image={whiteInfo.image}
                        size="sm"
                      />
                      <div className="min-w-0">
                        <div className="jp-display text-amber-100/90 text-sm truncate">
                          {whiteInfo.name}
                        </div>
                        <div className="latin-display tabular-nums text-amber-100 text-lg leading-none">
                          {counts.white}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                  <div className="px-2 py-2 bg-amber-200/[0.03] border border-amber-200/15 rounded-sm">
                    <div className="latin-display italic text-amber-200/70 text-[10px] tracking-wider uppercase">
                      {t.statMove}
                    </div>
                    <div className="latin-display tabular-nums text-amber-100 text-xl">
                      {kifu.length}
                    </div>
                  </div>
                  <div className="px-2 py-2 bg-amber-200/[0.03] border border-amber-200/15 rounded-sm">
                    <div className="latin-display italic text-amber-200/70 text-[10px] tracking-wider uppercase">
                      {t.statEmpty}
                    </div>
                    <div className="latin-display tabular-nums text-amber-100 text-xl">
                      {64 - counts.black - counts.white}
                    </div>
                  </div>
                  <div className="px-2 py-2 bg-amber-200/[0.03] border border-amber-200/15 rounded-sm">
                    <div className="latin-display italic text-amber-200/70 text-[10px] tracking-wider uppercase">
                      {t.statTurn}
                    </div>
                    <div className="jp-display text-amber-100 text-base mt-1">
                      {currentColor === BLACK ? t.black : t.white}
                    </div>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="latin-display italic text-amber-200/70 text-[10px] tracking-[0.25em] uppercase mb-2">
                    {t.kifuHeading}
                  </div>
                  {kifu.length === 0 ? (
                    <p className="jp-display italic text-amber-200/65 text-xs">
                      {t.noMovesYet}
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 max-h-48 scroll-y overflow-y-auto pr-1 border border-amber-200/10 rounded-sm p-2 bg-zinc-950/50">
                      {Array.from({ length: Math.ceil(kifu.length / 2) }, (_, i) => {
                        const black = kifu[i * 2];
                        const white = kifu[i * 2 + 1];
                        return (
                          <Fragment key={i}>
                            <div className="latin-display tabular-nums text-amber-100/90 text-xs flex gap-2">
                              <span className="text-amber-200/65 w-5 text-right">{i + 1}.</span>
                              <span className="text-zinc-300">●</span>
                              <span>{black ? moveToNotation(black).toUpperCase() : ''}</span>
                            </div>
                            <div className="latin-display tabular-nums text-amber-100/90 text-xs flex gap-2">
                              <span className="text-amber-200/65">○</span>
                              <span>{white ? moveToNotation(white).toUpperCase() : ''}</span>
                            </div>
                          </Fragment>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Kifu library modal */}
          {kifuOpen && (
            <div className="modal-bg fixed inset-0 z-50 flex items-stretch md:items-center justify-center p-2 md:p-6">
              <div className="modal-card scroll-y w-full max-w-xl max-h-[95vh] rounded-sm p-5 md:p-7">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="latin-display italic ornament text-[10px] uppercase mb-1">
                      — {t.kifuLibrary} —
                    </div>
                    <h2 className="jp-display text-amber-100 text-xl md:text-2xl font-bold tracking-[0.15em]">
                      {t.kifuLibrary}
                    </h2>
                  </div>
                  <button onClick={() => setKifuOpen(false)} className="btn">
                    {t.close}
                  </button>
                </div>

                <section className="mb-6">
                  <h3 className="jp-display text-amber-100/90 text-sm tracking-[0.25em] mb-3 pb-2 border-b border-amber-200/15">
                    {t.saveCurrent}
                  </h3>
                  <div className="px-3 py-2.5 bg-amber-200/[0.03] border border-amber-200/15 rounded-sm mb-3 text-xs jp-display text-amber-100/80 leading-relaxed">
                    {kifu.length === 0
                      ? t.saveHintEmpty
                      : t.saveHintInfo(
                          kifu.length,
                          gameMode === 'human'
                            ? t.modeHuman
                            : aiMode === 'story'
                              ? t.modeStoryProgress(Math.min(storyProgress + 1, 20)) +
                                ` vs ${COMPUTERS[computerChar].name}`
                              : `vs ${COMPUTERS[computerChar].name} Lv.${level}`,
                        )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={kifuName}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setKifuName(e.target.value)}
                      placeholder={t.inputPlaceholder}
                      maxLength={40}
                      className="jp-display flex-1 px-3 py-2 bg-zinc-950/70 border border-amber-200/20 rounded-sm text-amber-100 text-sm placeholder:text-amber-200/55 focus:border-amber-200/60 focus:outline-none"
                    />
                    <button
                      onClick={() => saveCurrentKifu(kifuName)}
                      disabled={!kifuName.trim() || kifu.length === 0}
                      className="btn"
                    >
                      {t.saveButton}
                    </button>
                  </div>
                </section>

                <section>
                  <h3 className="jp-display text-amber-100/90 text-sm tracking-[0.25em] mb-3 pb-2 border-b border-amber-200/15">
                    {t.savedGames}
                  </h3>
                  {savedSlots.length === 0 ? (
                    <p className="jp-display italic text-amber-200/65 text-sm py-3">
                      {t.noSavedGames}
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-72 scroll-y overflow-y-auto pr-1">
                      {savedSlots.map((slot) => {
                        const date = new Date(slot.timestamp ?? 0);
                        const dateStr = `${date.getFullYear()}/${(date.getMonth() + 1)
                          .toString()
                          .padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date
                          .getHours()
                          .toString()
                          .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
                        const opp =
                          slot.computerChar !== undefined && COMPUTERS[slot.computerChar]
                            ? COMPUTERS[slot.computerChar]
                            : null;
                        return (
                          <div
                            key={slot.key}
                            className="px-3 py-2.5 bg-amber-200/[0.03] border border-amber-200/15 rounded-sm flex items-center gap-3"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="jp-display text-amber-100/95 text-sm truncate">
                                {slot.name ?? '(無題)'}
                              </div>
                              <div className="latin-display italic text-amber-200/65 text-[10px] tracking-wider mt-0.5">
                                {dateStr} · {slot.kifu ? slot.kifu.length : 0}手
                                {slot.gameMode === 'ai' && opp && (
                                  <>
                                    {' '}
                                    · vs {opp.name} Lv.{slot.level}
                                  </>
                                )}
                                {slot.result === BLACK && <> · {t.blackWinShort}</>}
                                {slot.result === WHITE && <> · {t.whiteWinShort}</>}
                                {slot.result === EMPTY && <> · {t.drawShort}</>}
                                {slot.review && (
                                  <span className="ml-1 text-amber-200/85">
                                    · 📝 {t.reviewSavedIndicator}
                                  </span>
                                )}
                              </div>
                            </div>
                            {slot.review && (
                              <button
                                onClick={() =>
                                  viewSavedReview(slot.review ?? '', slot.timestamp ?? 0)
                                }
                                className="btn text-xs px-2 py-1.5"
                                title={t.reviewViewSaved}
                                aria-label={t.reviewViewSaved}
                              >
                                📝
                              </button>
                            )}
                            <button
                              onClick={() => loadKifuMoves(slot)}
                              className="btn text-xs px-3 py-1.5"
                              title={t.loadButton}
                            >
                              {t.loadButton}
                            </button>
                            <button
                              onClick={() => deleteSlot(slot.key)}
                              className="btn text-xs px-2 py-1.5"
                              title={t.delete}
                            >
                              <Trash2 size={14} strokeWidth={1.5} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              </div>
            </div>
          )}

          {/* Post-game review modal */}
          {reviewOpen && (
            <div className="modal-bg fixed inset-0 z-[60] flex items-stretch md:items-center justify-center p-2 md:p-6">
              <div className="modal-card scroll-y w-full max-w-2xl max-h-[95vh] rounded-sm p-5 md:p-7 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="latin-display italic ornament text-[10px] uppercase mb-1">
                      — {t.reviewSubtitle} —
                    </div>
                    <h2 className="jp-display text-amber-100 text-xl md:text-2xl font-bold tracking-[0.15em]">
                      {t.reviewTitle}
                    </h2>
                  </div>
                  <button onClick={closeReview} className="btn">
                    {t.close}
                  </button>
                </div>

                <div className="flex-1 scroll-y overflow-y-auto pr-1 mb-3">
                  {reviewError ? (
                    <p className="jp-display text-red-300/90 text-sm leading-relaxed mb-3">
                      {t.reviewError(reviewError)}
                    </p>
                  ) : reviewText.length === 0 && reviewLoading ? (
                    <p className="jp-display italic text-amber-200/65 text-sm">
                      {t.reviewLoading}
                    </p>
                  ) : (
                    <div className="jp-display text-amber-100/90 text-sm leading-relaxed">
                      {reviewText.split('\n').map((line, i) => {
                        if (line.startsWith('## ')) {
                          return (
                            <h3
                              key={i}
                              className="jp-display text-amber-100 text-base md:text-lg font-bold tracking-wider mt-4 mb-2 pb-1 border-b border-amber-200/15"
                            >
                              {line.slice(3)}
                            </h3>
                          );
                        }
                        if (line.startsWith('- ') || line.startsWith('* ')) {
                          return (
                            <li key={i} className="ml-5 list-disc text-amber-100/90 text-sm mb-1">
                              {line.slice(2)}
                            </li>
                          );
                        }
                        if (line.trim() === '') {
                          return <div key={i} className="h-2" />;
                        }
                        return (
                          <p key={i} className="text-amber-100/90 text-sm mb-2 leading-relaxed">
                            {line}
                          </p>
                        );
                      })}
                      {reviewLoading && reviewText.length > 0 && (
                        <span className="inline-block w-2 h-4 bg-amber-200/60 ml-1 animate-pulse align-middle" />
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-amber-200/15">
                  <span className="latin-display italic text-amber-200/55 text-[10px] tracking-wider truncate">
                    {reviewReadOnly && reviewSavedAt !== null
                      ? t.reviewSavedAt(
                          new Date(reviewSavedAt).toLocaleString(
                            locale === 'ja' ? 'ja-JP' : 'en-US',
                          ),
                        )
                      : t.reviewByClaude}
                  </span>
                  <div className="flex gap-2 items-center">
                    {reviewSavedFlash && (
                      <span className="jp-display text-amber-200/85 text-[11px] tracking-wider">
                        ✓ {t.reviewSaved}
                      </span>
                    )}
                    {reviewLoading && (
                      <button onClick={cancelReview} className="btn text-xs px-3 py-1.5">
                        {t.reviewCancel}
                      </button>
                    )}
                    {!reviewReadOnly &&
                      !reviewLoading &&
                      reviewText.trim().length > 0 &&
                      !reviewError && (
                        <button
                          onClick={saveReviewWithKifu}
                          className="btn btn-active text-xs px-3 py-1.5"
                        >
                          {t.reviewSave}
                        </button>
                      )}
                    {!reviewReadOnly &&
                      !reviewLoading &&
                      (reviewError || reviewText.length > 0) && (
                        <button onClick={startReview} className="btn text-xs px-3 py-1.5">
                          {t.reviewRegenerate}
                        </button>
                      )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings modal */}
          {settingsOpen && (
            <div className="modal-bg fixed inset-0 z-50 flex items-stretch md:items-center justify-center p-2 md:p-6">
              <div className="modal-card scroll-y w-full max-w-3xl max-h-[95vh] rounded-sm p-5 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="latin-display italic ornament text-[10px] uppercase mb-1">
                      — {t.setup} —
                    </div>
                    <h2 className="jp-display text-amber-100 text-2xl md:text-3xl font-bold tracking-[0.15em]">
                      {t.setup}
                    </h2>
                  </div>
                  <button onClick={() => setSettingsOpen(false)} className="btn">
                    {t.close}
                  </button>
                </div>

                {/* Language toggle */}
                <section className="mb-6">
                  <h3 className="jp-display text-amber-100/90 text-sm md:text-base tracking-[0.25em] mb-3 pb-2 border-b border-amber-200/15">
                    {t.language}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setLocale('ja')}
                      className={`btn flex-1 ${locale === 'ja' ? 'btn-active' : ''}`}
                    >
                      日本語
                    </button>
                    <button
                      onClick={() => setLocale('en')}
                      className={`btn flex-1 ${locale === 'en' ? 'btn-active' : ''}`}
                    >
                      English
                    </button>
                  </div>
                </section>

                {/* Save slot — story mode only */}
                {gameMode === 'ai' && aiMode === 'story' && (
                  <section className="mb-6">
                    <h3 className="jp-display text-amber-100/90 text-sm md:text-base tracking-[0.25em] mb-3 pb-2 border-b border-amber-200/15">
                      {t.slotPickerTitle}
                      <span className="latin-display italic text-amber-200/65 text-xs ml-2 normal-case tracking-wider">
                        — {t.slotPickerSubtitle}
                      </span>
                    </h3>
                    {activeSlot ? (
                      <div className="px-3 py-2.5 bg-amber-200/[0.04] border border-amber-200/20 rounded-sm flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="jp-display text-amber-100/95 text-sm truncate">
                            {activeSlot.name}
                          </div>
                          <div className="jp-display text-amber-200/65 text-[11px] mt-0.5">
                            {t.slotProgress(activeSlot.storyProgress)} ・ ♥ {activeSlot.lives}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSettingsOpen(false);
                            setSlotPickerOpen(true);
                          }}
                          className="btn text-xs px-3 py-1.5"
                        >
                          {t.slotSwitch}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setSettingsOpen(false);
                          setSlotPickerOpen(true);
                        }}
                        className="btn w-full"
                      >
                        {t.slotChooseFirst}
                      </button>
                    )}
                  </section>
                )}

                <section className="mb-7">
                  <h3 className="jp-display text-amber-100/90 text-sm md:text-base tracking-[0.25em] mb-3 pb-2 border-b border-amber-200/15">
                    {t.protagonist}
                    <span className="latin-display italic text-amber-200/65 text-xs ml-2 normal-case tracking-wider">
                      — {t.protagonistSubtitle}
                    </span>
                  </h3>
                  <div className="grid grid-cols-4 md:grid-cols-5 gap-2.5 md:gap-3">
                    {AVATARS.map((a, i) => {
                      const isLocked = i > 0 && storyProgress < 20;
                      return (
                        <button
                          key={i}
                          onClick={() => !isLocked && setP1Avatar(i)}
                          disabled={isLocked}
                          className={`relative p-2.5 md:p-3 rounded-sm border transition-all flex flex-col items-center gap-1.5 ${
                            p1Avatar === i
                              ? 'border-amber-200/70 bg-amber-200/[0.06]'
                              : 'border-amber-200/15 hover:border-amber-200/40 hover:bg-amber-200/[0.02]'
                          } ${isLocked ? 'opacity-40 cursor-not-allowed' : ''}`}
                        >
                          <AvatarBadge
                            kanji={a.kanji}
                            idx={i}
                            image={a.image}
                            size="sm"
                            dim={isLocked}
                          />
                          <div className="jp-display text-amber-100/90 text-[11px] md:text-xs leading-tight text-center">
                            {a.name}
                          </div>
                          <div
                            className={`jp-display text-[9px] md:text-[10px] leading-tight tracking-wide text-center ${
                              p1Avatar === i ? 'text-amber-200/70' : 'text-amber-200/65'
                            }`}
                          >
                            {a.setting}
                          </div>
                          {isLocked && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <Lock size={20} strokeWidth={1.4} className="text-amber-200/85" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {storyProgress < 20 && (
                    <p className="jp-display italic text-amber-200/55 text-[11px] mt-2">
                      {t.protagonistLockHint}
                    </p>
                  )}
                  <div className="mt-3 px-3 py-2.5 bg-amber-200/[0.03] border border-amber-200/15 rounded-sm">
                    <div className="jp-display text-amber-100/85 text-sm">
                      {AVATARS[p1Avatar].name}
                      <span className="latin-display italic text-amber-200/65 text-xs ml-2">
                        — {AVATARS[p1Avatar].setting}
                      </span>
                    </div>
                    <div className="jp-display italic text-amber-200/55 text-xs mt-0.5">
                      「{AVATARS[p1Avatar].quote}」
                    </div>
                  </div>
                </section>

                <section className="mb-7">
                  <h3 className="jp-display text-amber-100/90 text-sm md:text-base tracking-[0.25em] mb-3 pb-2 border-b border-amber-200/15">
                    {t.opponent}
                    <span className="latin-display italic text-amber-200/65 text-xs ml-2 normal-case tracking-wider">
                      — {t.opponentSubtitle}
                    </span>
                  </h3>

                  <div className="flex gap-2 mb-5">
                    <button
                      onClick={() => setGameMode('ai')}
                      className={`btn flex-1 ${gameMode === 'ai' ? 'btn-active' : ''}`}
                    >
                      {t.vsAi}
                    </button>
                    <button
                      onClick={() => setGameMode('human')}
                      className={`btn flex-1 ${gameMode === 'human' ? 'btn-active' : ''}`}
                    >
                      {t.vsHuman}
                    </button>
                  </div>

                  {gameMode === 'ai' && (
                    <>
                      <div className="flex gap-2 mb-5">
                        <button
                          onClick={() => setAiMode('story')}
                          className={`btn flex-1 ${aiMode === 'story' ? 'btn-active' : ''}`}
                        >
                          {t.storyMode}
                        </button>
                        <button
                          onClick={() => setAiMode('free')}
                          className={`btn flex-1 ${aiMode === 'free' ? 'btn-active' : ''}`}
                        >
                          {t.freeMode}
                        </button>
                      </div>

                      {aiMode === 'story' && (() => {
                        const isComplete = storyProgress >= 20;
                        const targetLevel = isComplete ? 20 : storyProgress + 1;
                        const oppIdx = COMPUTERS.findIndex((c) => c.level === targetLevel);
                        const opp = COMPUTERS[oppIdx];
                        return (
                          <div className="space-y-4 mb-2">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="latin-display italic text-amber-200/50 text-xs tracking-[0.25em] uppercase">
                                  {t.progress}
                                </span>
                                <span className="latin-display text-amber-100 text-base tabular-nums">
                                  {storyProgress} / 20
                                </span>
                              </div>
                              <div className="flex gap-0.5">
                                {Array.from({ length: 20 }, (_, i) => (
                                  <div
                                    key={i}
                                    className={`flex-1 h-1.5 rounded-full transition-colors ${
                                      i < storyProgress ? 'bg-amber-400/90' : 'bg-zinc-800/60'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>

                            {storyProgress === 0 && (
                              <p className="jp-display italic text-amber-200/55 text-xs md:text-sm leading-relaxed whitespace-pre-line">
                                {t.storyIntro}
                              </p>
                            )}

                            {!isComplete ? (
                              <div className="border border-amber-200/30 bg-amber-200/[0.04] rounded-sm p-4">
                                <div className="latin-display italic ornament text-[10px] uppercase mb-2">
                                  — Chapter {targetLevel} —
                                </div>
                                <ChapterArt src={opp.chapterArt} alt={opp.name} />
                                <div className="flex items-center gap-3 mb-3">
                                  <AvatarBadge
                                    kanji={opp.kanji}
                                    idx={oppIdx + 100}
                                    image={opp.image}
                                    size="md"
                                  />
                                  <div className="min-w-0">
                                    <div className="jp-display text-amber-100 text-base md:text-lg truncate">
                                      {t.footerChapter(targetLevel, opp.name)}
                                    </div>
                                    <div className="latin-display italic text-amber-200/50 text-xs tracking-wider">
                                      Lv.{opp.level} {getLevelLabel(opp.level, t)}
                                    </div>
                                  </div>
                                </div>
                                <p className="jp-display text-amber-100/80 text-sm leading-relaxed">
                                  {t.storyChapters[storyProgress]}
                                </p>
                                <p className="jp-display italic text-amber-200/55 text-xs mt-2">
                                  「{opp.quote}」
                                </p>
                              </div>
                            ) : (
                              <div className="border border-amber-400/50 bg-amber-300/[0.06] rounded-sm p-4 text-center">
                                <div className="latin-display italic ornament text-[10px] uppercase mb-3">
                                  — {t.storyComplete.replace(/—/g, '').trim()} —
                                </div>
                                <div className="jp-display text-amber-100 text-xl md:text-2xl mb-3 tracking-wider">
                                  {t.storyEnding}
                                </div>
                                <p className="jp-display text-amber-100/80 text-sm leading-relaxed whitespace-pre-line">
                                  {t.storyEndingProse}
                                </p>
                              </div>
                            )}

                            {storyProgress > 0 && (
                              <button onClick={resetStoryProgress} className="btn text-xs">
                                {t.retryStoryFromStart}
                              </button>
                            )}
                          </div>
                        );
                      })()}

                      {aiMode === 'free' && (
                        <>
                          <div className="mb-5">
                            <div className="latin-display italic text-amber-200/70 text-xs tracking-[0.25em] uppercase mb-2">
                              {t.characterGridLabel}
                            </div>
                            <div className="grid grid-cols-4 md:grid-cols-5 gap-2.5 md:gap-3">
                              {COMPUTERS.map((c, i) => (
                                <button
                                  key={i}
                                  onClick={() => selectCharacter(i)}
                                  className={`p-2.5 md:p-3 rounded-sm border transition-all flex flex-col items-center gap-1.5 ${
                                    computerChar === i
                                      ? 'border-amber-200/70 bg-amber-200/[0.06]'
                                      : 'border-amber-200/15 hover:border-amber-200/40 hover:bg-amber-200/[0.02]'
                                  }`}
                                >
                                  <AvatarBadge
                                    kanji={c.kanji}
                                    idx={i + 100}
                                    image={c.image}
                                    size="sm"
                                  />
                                  <div className="jp-display text-amber-100/90 text-[11px] md:text-xs leading-tight text-center">
                                    {c.name}
                                  </div>
                                  <div
                                    className={`latin-display italic text-[10px] tracking-wider ${
                                      computerChar === i
                                        ? 'text-amber-200/80'
                                        : 'text-amber-200/65'
                                    }`}
                                  >
                                    Lv.{c.level}
                                  </div>
                                </button>
                              ))}
                            </div>
                            <div className="mt-3 px-3 py-2.5 bg-amber-200/[0.03] border border-amber-200/15 rounded-sm">
                              <div className="jp-display text-amber-100/80 text-sm">
                                {COMPUTERS[computerChar].name}
                              </div>
                              <div className="jp-display italic text-amber-200/55 text-xs mt-0.5">
                                「{COMPUTERS[computerChar].quote}」
                              </div>
                            </div>
                          </div>

                          <div>
                            <LevelSelector level={level} setLevel={setLevel} t={t} />
                            <p className="latin-display italic text-amber-200/55 text-[11px] mt-3 leading-relaxed">
                              {t.aiLevelExplain}
                            </p>
                          </div>
                        </>
                      )}
                    </>
                  )}

                  {gameMode === 'human' && (
                    <div>
                      <div className="latin-display italic text-amber-200/70 text-xs tracking-[0.25em] uppercase mb-2">
                        {t.player2Protagonist}
                      </div>
                      <div className="grid grid-cols-4 md:grid-cols-5 gap-2.5 md:gap-3">
                        {AVATARS.map((a, i) => {
                          const isLocked = i > 0 && storyProgress < 20;
                          // Allow both players to share the default avatar
                          // when no bonus characters are unlocked yet —
                          // otherwise 2P mode would have no valid p2 pick.
                          const collidesWithP1 =
                            p1Avatar === i && storyProgress >= 20;
                          const isDisabled = isLocked || collidesWithP1;
                          return (
                            <button
                              key={i}
                              onClick={() => !isDisabled && setP2Avatar(i)}
                              disabled={isDisabled}
                              className={`relative p-2.5 md:p-3 rounded-sm border transition-all flex flex-col items-center gap-1.5 ${
                                p2Avatar === i
                                  ? 'border-amber-200/70 bg-amber-200/[0.06]'
                                  : 'border-amber-200/15 hover:border-amber-200/40 hover:bg-amber-200/[0.02]'
                              } ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                            >
                              <AvatarBadge
                                kanji={a.kanji}
                                idx={i + 50}
                                image={a.image}
                                size="sm"
                                dim={isDisabled}
                              />
                              <div className="jp-display text-amber-100/90 text-[11px] md:text-xs leading-tight text-center">
                                {a.name}
                              </div>
                              <div
                                className={`jp-display text-[9px] md:text-[10px] leading-tight tracking-wide text-center ${
                                  p2Avatar === i ? 'text-amber-200/70' : 'text-amber-200/65'
                                }`}
                              >
                                {a.setting}
                              </div>
                              {isLocked && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <Lock
                                    size={20}
                                    strokeWidth={1.4}
                                    className="text-amber-200/85"
                                  />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      {storyProgress < 20 && (
                        <p className="jp-display italic text-amber-200/55 text-[11px] mt-2">
                          {t.protagonistLockHint}
                        </p>
                      )}
                      {p1Avatar === p2Avatar && storyProgress >= 20 && (
                        <p className="jp-display text-amber-200/65 text-xs mt-2 italic">
                          {t.cannotChooseSelf}
                        </p>
                      )}
                    </div>
                  )}
                </section>

                <div className="flex justify-end gap-2 pt-2 border-t border-amber-200/15">
                  <button
                    onClick={() => {
                      reset();
                      setSettingsOpen(false);
                    }}
                    className="btn"
                  >
                    {t.startNewGame}
                  </button>
                  <button onClick={() => setSettingsOpen(false)} className="btn btn-active">
                    {t.keepSettings}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      )}

      <SlotPicker
        open={slotPickerOpen}
        slots={slots}
        activeSlotId={activeSlotId}
        onSelect={selectSlot}
        onClose={() => setSlotPickerOpen(false)}
        onSlotsChanged={setSlots}
        t={t}
      />
    </>
  );
}

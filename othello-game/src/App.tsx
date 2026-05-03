import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Flag,
  FolderOpen,
  HelpCircle,
  Home,
  Info,
  Lightbulb,
  Lock,
  Menu,
  Pause,
  Play,
  RotateCcw,
  ScrollText,
  Sparkles,
  ThumbsUp,
  Trash2,
  Undo2,
  X,
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
  updateSlot as storageUpdateSlot,
  type AiMode,
  type GameMode,
  type MoveRecord,
  type SavedSlot,
} from './storage/saveGame';
import { useLocale } from './i18n/useLocale';
import type { Messages } from './i18n/messages';
import { TitleScreen, type TitleStartMode } from './components/TitleScreen';
import { SlotPicker } from './components/SlotPicker';
import {
  fetchStructuredReview,
  type StructuredReviewHandle,
} from './services/claude';
import type { MoveAnnotation, MoveQuality, ReviewAnnotations } from './prompts/review';
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

/**
 * Animate a number toward a target with an ease-out cubic over
 * `durationMs`. Returns the in-flight integer so `<span>{value}</span>`
 * counts up/down smoothly when the source changes (score flips,
 * progress, etc.). Cleans up its rAF on unmount or when the target
 * shifts mid-flight.
 */
function useAnimatedNumber(target: number, durationMs = 380): number {
  const [display, setDisplay] = useState(target);
  const fromRef = useRef(target);
  const toRef = useRef(target);
  const startRef = useRef<number>(0);

  useEffect(() => {
    if (target === toRef.current) return;
    fromRef.current = display;
    toRef.current = target;
    startRef.current = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - startRef.current) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      const v = Math.round(
        fromRef.current + (toRef.current - fromRef.current) * eased,
      );
      setDisplay(v);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, durationMs]);

  return display;
}

/* ---------------- Move-quality presentation ---------------- */

interface QualityStyle {
  /** Tailwind classes for the inline badge (background + text + border). */
  badge: string;
  /** Tailwind classes for the cell ring shown on the annotated square. */
  ring: string;
  /** Multi-layer box-shadow applied to the annotated cell. Combines an
   *  inner colored rim with a wide outer halo so the highlight is
   *  obvious against the green felt and dark pieces alike. */
  glow: string;
  /** Solid color used as the `currentColor` for the `.quality-ring`
   *  overlay (also drives the badge dot). */
  ringColor: string;
}

const QUALITY_STYLES: Record<MoveQuality, QualityStyle> = {
  brilliant: {
    badge: 'bg-amber-300/25 text-amber-100 border-amber-300/70',
    ring: 'ring-2 ring-amber-300/85',
    glow:
      'inset 0 0 0 3px rgba(252, 211, 77, 0.7), 0 0 26px 7px rgba(252, 211, 77, 0.75)',
    ringColor: '#fcd34d',
  },
  good: {
    badge: 'bg-emerald-400/20 text-emerald-100 border-emerald-400/60',
    ring: 'ring-2 ring-emerald-400/85',
    glow:
      'inset 0 0 0 3px rgba(74, 222, 128, 0.65), 0 0 24px 6px rgba(74, 222, 128, 0.65)',
    ringColor: '#4ade80',
  },
  neutral: {
    badge: 'bg-zinc-500/20 text-zinc-200 border-zinc-500/45',
    ring: 'ring-2 ring-zinc-300/60',
    glow:
      'inset 0 0 0 2px rgba(212, 212, 216, 0.55), 0 0 18px 4px rgba(212, 212, 216, 0.5)',
    ringColor: '#d4d4d8',
  },
  inaccuracy: {
    badge: 'bg-yellow-500/20 text-yellow-100 border-yellow-500/55',
    ring: 'ring-2 ring-yellow-400/85',
    glow:
      'inset 0 0 0 3px rgba(234, 179, 8, 0.65), 0 0 24px 6px rgba(234, 179, 8, 0.65)',
    ringColor: '#facc15',
  },
  mistake: {
    badge: 'bg-orange-500/25 text-orange-100 border-orange-500/65',
    ring: 'ring-2 ring-orange-500/90',
    glow:
      'inset 0 0 0 3px rgba(249, 115, 22, 0.7), 0 0 26px 7px rgba(249, 115, 22, 0.7)',
    ringColor: '#f97316',
  },
  blunder: {
    badge: 'bg-red-500/30 text-red-100 border-red-500/75',
    ring: 'ring-2 ring-red-500/90',
    glow:
      'inset 0 0 0 3px rgba(239, 68, 68, 0.75), 0 0 30px 8px rgba(239, 68, 68, 0.8)',
    ringColor: '#ef4444',
  },
};

function qualityLabel(q: MoveQuality, t: Messages): string {
  switch (q) {
    case 'brilliant':
      return t.qualityBrilliant;
    case 'good':
      return t.qualityGood;
    case 'neutral':
      return t.qualityNeutral;
    case 'inaccuracy':
      return t.qualityInaccuracy;
    case 'mistake':
      return t.qualityMistake;
    case 'blunder':
      return t.qualityBlunder;
  }
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

/**
 * Icon-only button for the kifu replay strip with a long-press help
 * popover. Mobile users can't use the native `title` tooltip, so a
 * 500ms press shows the help text in a small bubble above the button
 * (auto-dismissed after 2s or on outside click). Short taps fire
 * `onClick` as usual.
 */
interface ReplayIconButtonProps {
  icon: LucideIcon;
  helpText: string;
  onClick: () => void;
  disabled?: boolean;
  /**
   * Tailwind classes applied to the lucide SVG itself (not the button)
   * so color tints actually stick. The shared `.btn` rule sets `color`
   * via an inline `<style>` block that wins over a Tailwind utility on
   * the button — but the SVG's own color rule wins for its own stroke,
   * since the icon uses `currentColor`.
   */
  iconClassName?: string;
  /** Aria-label override (defaults to helpText). */
  ariaLabel?: string;
}

function ReplayIconButton({
  icon: Icon,
  helpText,
  onClick,
  disabled,
  iconClassName,
  ariaLabel,
}: ReplayIconButtonProps) {
  const [showHelp, setShowHelp] = useState(false);
  const timerRef = useRef<number | null>(null);
  // True once the long-press timer has fired. Consumed by the next
  // click event so the press doesn't double as a tap.
  const longPressedRef = useRef(false);

  const cancelTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handlePointerDown = () => {
    if (disabled) return;
    longPressedRef.current = false;
    cancelTimer();
    timerRef.current = window.setTimeout(() => {
      longPressedRef.current = true;
      setShowHelp(true);
    }, 500);
  };

  const handlePointerUp = () => {
    cancelTimer();
  };

  const handlePointerCancel = () => {
    cancelTimer();
    // Mid-drag finger lifted off — don't count as long-press, otherwise
    // a stray drag would suppress the next click.
    longPressedRef.current = false;
  };

  // Native click fires on mouse short tap, touch tap, AND keyboard
  // activation (Enter / Space) — exactly the cases we want to treat
  // as "execute". The long-press path sets a flag that we consume here
  // to suppress the trailing click that follows a long-press release.
  const handleClick = () => {
    if (longPressedRef.current) {
      longPressedRef.current = false;
      return;
    }
    if (disabled) return;
    onClick();
  };

  // Auto-dismiss the help bubble after 2s and on outside click.
  useEffect(() => {
    if (!showHelp) return;
    const dismiss = () => setShowHelp(false);
    const t = window.setTimeout(dismiss, 2000);
    // Defer the listener attach by a tick so the long-press release
    // doesn't immediately dismiss the bubble.
    const attach = window.setTimeout(() => {
      window.addEventListener('pointerdown', dismiss, { once: true });
    }, 0);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(attach);
      window.removeEventListener('pointerdown', dismiss);
    };
  }, [showHelp]);

  // Cleanup timer on unmount.
  useEffect(() => () => cancelTimer(), []);

  const baseBtn = 'btn p-2 disabled:opacity-30 disabled:cursor-not-allowed';

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerCancel}
        onPointerCancel={handlePointerCancel}
        onClick={handleClick}
        disabled={disabled}
        title={helpText}
        aria-label={ariaLabel ?? helpText}
        className={baseBtn}
      >
        <Icon size={16} strokeWidth={1.5} className={iconClassName} />
      </button>
      {showHelp && (
        <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-900/95 border border-amber-200/30 rounded-sm jp-display text-amber-100 text-[11px] leading-tight whitespace-nowrap z-50 pointer-events-none shadow-lg">
          {helpText}
        </span>
      )}
    </span>
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
  /** Compact layout: hides the quote line and tightens vertical
   *  padding. Used while reviewing a loaded kifu so the replay strip
   *  + annotation comment fit on one screen without scrolling. */
  compact?: boolean;
}

/**
 * Sakura-petal celebration overlay. Mounted while a chapter clear is
 * being shown so ~48 petals drift down past the GameOver modal in
 * staggered, randomized arcs. The petal silhouette is rendered as
 * inline SVG (with `fill="currentColor"`) so the inline `color`
 * style fully drives the tint without depending on CSS `mask-image`
 * — the latter has known rendering quirks on older Safari versions
 * and can silently fail to load through the build's asset pipeline.
 */
const PETAL_PATHS: Record<1 | 2 | 3, string> = {
  1: 'M50 91C31 75 18 57 22 39c3-14 15-25 29-29l7 16 11-13c13 8 19 24 13 39-6 16-19 28-32 39z',
  2: 'M63 88C43 79 25 63 22 43c-2-15 7-29 22-36l6 17 13-13c13 6 20 19 18 33-2 21-14 35-18 44z',
  3: 'M35 89C24 70 24 49 36 32c8-12 19-18 32-20l-2 18 15-8c7 14 4 31-7 43-14 15-35 15-39 24z',
};

function ChapterClearConfetti({ active }: { active: boolean }) {
  const petals = useMemo(() => {
    if (!active) return [] as ReadonlyArray<{
      id: number;
      left: number;
      delay: number;
      duration: number;
      rotation: number;
      drift: number;
      tone: string;
      size: number;
      variant: 1 | 2 | 3;
    }>;
    const tones = ['#fbbcd0', '#fde9f3', '#f9c8d8', '#f5b9cc', '#f5e8c8'];
    const variants: Array<1 | 2 | 3> = [1, 2, 3];
    return Array.from({ length: 48 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 1.2,
      duration: 2.6 + Math.random() * 2.6,
      rotation: Math.random() * 360,
      drift: 22 + Math.random() * 30,
      tone: tones[Math.floor(Math.random() * tones.length)],
      size: 18 + Math.random() * 12,
      variant: variants[Math.floor(Math.random() * variants.length)],
    }));
  }, [active]);
  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-[45] overflow-hidden" aria-hidden="true">
      {petals.map((p) => (
        <svg
          key={p.id}
          className="petal-svg"
          viewBox="0 0 100 100"
          width={p.size}
          height={p.size}
          style={
            {
              left: `${p.left}%`,
              color: p.tone,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s, ${p.duration * 0.55}s`,
              transform: `rotate(${p.rotation}deg)`,
              '--petal-drift': `${p.drift}px`,
            } as CSSProperties
          }
        >
          <path d={PETAL_PATHS[p.variant]} fill="currentColor" />
        </svg>
      ))}
    </div>
  );
}

/**
 * Decorative brush-stroke ornament from the motion-pass-1 asset pack.
 * Renders the divider as an **inline SVG** (path data inlined below)
 * rather than reaching into /ornaments/divider-N.svg via CSS
 * `mask-image` — that approach silently fails on older Mobile Safari
 * and during the first paint of a fresh PWA install. Inline keeps the
 * ornament functional on every device and frame.
 */
const DIVIDER_PATHS: Record<
  'thin' | 'bold' | 'flourish' | 'end' | 'double',
  ReactNode
> = {
  thin: (
    <>
      <path d="M12 12.1C48 11 78 12.8 119 12c38-.8 73-1.2 109 .6" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" opacity="0.82" />
      <path d="M13 12.2C58 10.4 101 13.4 159 12.1c29-.7 51-.4 67 .4" stroke="currentColor" strokeWidth="4.8" strokeLinecap="round" opacity="0.14" />
      <path d="M13 12.1h12M216 12.5h11" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.55" />
    </>
  ),
  bold: (
    <>
      <path d="M11 12C48 9 76 13.3 103 12.5c18-.5 30-3.8 51-2.5 25 1.5 54 4 77 2" stroke="currentColor" strokeWidth="5.8" strokeLinecap="round" opacity="0.78" />
      <path d="M16 12.4C60 11.8 91 12.2 120 12s61 .6 105-.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.65" />
      <path d="M33 10.3c4 1.8 10 1.9 15 .4M184 14.4c8-.7 16-1.2 25-.1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.28" />
    </>
  ),
  flourish: (
    <>
      <path d="M13 12c37-1.5 67 .9 92-.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.68" />
      <path d="M135 11.7c24 1.2 58-1 92 .4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.68" />
      <path d="M120 5.6l6.4 6.4-6.4 6.4-6.4-6.4z" fill="currentColor" opacity="0.74" />
      <path d="M120 8.8l3.2 3.2-3.2 3.2-3.2-3.2z" fill="currentColor" opacity="0.28" />
      <path d="M101 12h7M132 12h7" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.42" />
    </>
  ),
  end: (
    <>
      <path d="M12 12.3C46 10.5 83 12.9 123 11.8" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" opacity="0.78" />
      <path d="M122 11.8c24-.6 41 .8 58 1" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" opacity="0.44" />
      <path d="M181 12.8c12 .2 21-.2 29-.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.24" />
      <path d="M213 12.2h9M226 11.9h3" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.15" />
      <path d="M38 10.8c10 2.3 24 1.1 36 1.6" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.28" />
    </>
  ),
  double: (
    <>
      <path d="M15 8.7C54 7.6 89 9.4 121 8.9c37-.5 72-.8 106 .4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" opacity="0.72" />
      <path d="M27 15.3c36-1.2 72 .8 109-.1 28-.7 53-.6 77 .2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" opacity="0.58" />
      <path d="M15 8.8h6M221 9.3h6M27 15.3h8M207 15.4h6" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" opacity="0.42" />
    </>
  ),
};

function BrushDivider({
  variant = 'thin',
  className = '',
}: {
  variant?: 'thin' | 'bold' | 'flourish' | 'end' | 'double';
  className?: string;
}) {
  return (
    <svg
      className={`brush-divider ${className}`}
      viewBox="0 0 240 24"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      aria-hidden="true"
    >
      {DIVIDER_PATHS[variant]}
    </svg>
  );
}

/**
 * "Grip the stone" overlay shown at the start of a match whose
 * first/second assignment was randomized (story mode every chapter,
 * free mode when the player chose "ランダム"). Cycles through 4 inline
 * SVG frames (closed fist → fist opening → open palm with stone) over
 * ~2s, then auto-dismisses. Frame paths are inlined so the animation
 * never depends on /ornaments/grip-*.svg loading at runtime.
 */
interface FirstPlayerRollProps {
  active: boolean;
  result: Color | null;
  playerName: string;
  onComplete: () => void;
  t: Messages;
}

type GripFrame = 'closed' | 'opening' | 'open';

function GripIcon({ frame, stone }: { frame: GripFrame; stone: Color }) {
  // Inline SVG copies of public/ornaments/grip-*.svg. Stone fills are
  // hardcoded to the canonical disc colors so the resolved side reads
  // unambiguously regardless of CSS color inheritance.
  const stoneFill = stone === BLACK ? '#0a0805' : '#ebe2cc';
  if (frame === 'closed') {
    return (
      <svg viewBox="0 0 120 120" className="grip-svg">
        <path
          fill="currentColor"
          d="M23 72c2-17 12-31 27-38 10-5 22-5 33 0 8 4 14 11 16 19 2 8 1 16-3 22-4 6-10 10-19 12-6 2-10 6-13 11l-4 8H42l2-10c1-6-1-10-5-13-6-4-11-9-14-16-1-4-2-8-2-12zm26-19c-4 2-8 6-10 10 6 0 11 1 16 4 5 3 10 4 16 4 5 0 10-1 15-4-3-4-6-7-11-9-9-4-18-5-26-1z"
        />
        <path
          fill="currentColor"
          d="M37 66c4-5 10-8 17-7 5 0 9 2 13 4 4 3 9 4 15 4 5 0 9-1 14-3-1 4-4 7-8 10-6 4-13 6-20 6-10 0-20-5-31-14z"
        />
      </svg>
    );
  }
  if (frame === 'opening') {
    return (
      <svg viewBox="0 0 120 120" className="grip-svg">
        <ellipse cx="64" cy="64" rx="13" ry="11" fill={stoneFill} />
        <path
          fill="currentColor"
          d="M21 76c2-18 11-31 25-38 11-6 24-7 36-2 8 3 14 9 17 17 3 7 3 15 0 22-3 7-9 12-17 15-6 2-11 5-15 10l-5 6H45l3-9c2-5 0-9-4-12-7-4-13-9-18-17-3-5-5-9-5-14zm24-21c0 3 2 6 5 8 4 2 8 3 13 3 8 1 14 0 20-4 4-3 8-7 9-12-7 2-13 5-18 8-5 2-11 3-17 2-4 0-8-2-12-5z"
        />
        <path
          fill="currentColor"
          d="M38 55c3-1 7-1 11 0 5 1 9 3 14 4 6 1 11 0 16-2 5-2 9-5 14-9-1 6-4 11-8 15-6 5-14 8-22 8-11 0-19-5-25-16z"
        />
      </svg>
    );
  }
  // open
  return (
    <svg viewBox="0 0 120 120" className="grip-svg">
      <path
        fill="currentColor"
        d="M20 84c0-6 2-10 5-14 4-4 8-6 14-7l8-2-6-20c-1-4 1-8 5-9 4-1 7 1 8 5l7 21h4V29c0-4 3-7 7-7s7 3 7 7v28h4V34c0-4 3-7 7-7 3 0 6 3 6 7v25h4V41c0-4 3-7 7-7s6 3 6 7v22h3V50c0-4 3-7 7-7s6 3 6 7v21c0 8-2 15-7 22-5 8-13 12-24 12H44c-8 0-14-2-18-6-4-4-6-9-6-15z"
      />
      <ellipse cx="60" cy="77" rx="16" ry="13" fill={stoneFill} />
    </svg>
  );
}

function FirstPlayerRoll({ active, result, playerName, onComplete, t }: FirstPlayerRollProps) {
  // Frame schedule: closed (0–500ms) → opening (500–1000ms)
  //              → open (1000–2000ms, with reveal text faded in)
  const [frame, setFrame] = useState<GripFrame>('closed');
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    if (!active) return;
    setFrame('closed');
    setRevealed(false);
    const t1 = window.setTimeout(() => setFrame('opening'), 500);
    const t2 = window.setTimeout(() => {
      setFrame('open');
      setRevealed(true);
    }, 1000);
    const finish = window.setTimeout(onComplete, 2000);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(finish);
    };
  }, [active, onComplete]);
  if (!active || result === null) return null;
  const isFirst = result === BLACK;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-sm first-player-roll">
      <div className="text-center px-6">
        <div className="latin-display italic ornament text-[10px] md:text-xs uppercase mb-3 text-amber-200/70">
          — {t.firstPlayerRollLabel} —
        </div>
        <div
          key={frame}
          className="grip-stage mx-auto mb-5 text-amber-200/85"
        >
          <GripIcon frame={frame} stone={result} />
        </div>
        <div
          className={`jp-display tracking-[0.18em] text-2xl md:text-3xl font-bold transition-opacity duration-500 ${
            revealed ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ color: isFirst ? '#f5e8c8' : '#ebe2cc' }}
        >
          {isFirst
            ? t.firstPlayerRollFirst(playerName)
            : t.firstPlayerRollSecond(playerName)}
        </div>
        <p
          className={`jp-display italic text-amber-200/65 text-xs md:text-sm mt-3 transition-opacity duration-500 ${
            revealed ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {isFirst ? t.firstPlayerRollFirstHint : t.firstPlayerRollSecondHint}
        </p>
      </div>
    </div>
  );
}

/**
 * Sumi-e brushstroke "thinking" indicator. Cycles through 4 inline
 * SVG frames at 350 ms each so the brush appears to land, lift,
 * sweep, and re-land. The frames are inlined (rather than loaded
 * from /ornaments/sumi-thinking-N.svg via CSS `mask-image`) so they
 * render reliably on every browser and at first paint.
 */
const SUMI_FRAMES: Record<1 | 2 | 3 | 4, ReactNode> = {
  1: (
    <>
      <circle cx="16" cy="18" r="4.2" fill="currentColor" opacity="0.9" />
      <ellipse cx="16" cy="18.5" rx="6.2" ry="4.8" fill="currentColor" opacity="0.18" />
    </>
  ),
  2: (
    <>
      <ellipse cx="16" cy="16" rx="4.1" ry="8.3" fill="currentColor" opacity="0.88" />
      <ellipse cx="16" cy="20.5" rx="5.8" ry="2.6" fill="currentColor" opacity="0.16" />
    </>
  ),
  3: (
    <>
      <path fill="currentColor" opacity="0.88" d="M9 22c2-7 9-13 15-15-1 5-7 13-15 15z" />
      <path fill="currentColor" opacity="0.18" d="M8 23c5-2 12-5 18-10-4 6-10 10-18 10z" />
    </>
  ),
  4: (
    <>
      <circle cx="16" cy="18" r="4.4" fill="currentColor" opacity="0.82" />
      <circle cx="19.2" cy="16.8" r="1.3" fill="currentColor" opacity="0.3" />
      <ellipse cx="16" cy="18.6" rx="7" ry="5.2" fill="currentColor" opacity="0.2" />
    </>
  ),
};

function SumiThinking() {
  const [frame, setFrame] = useState<1 | 2 | 3 | 4>(1);
  useEffect(() => {
    const id = window.setInterval(() => {
      setFrame((f) => (((f % 4) + 1) as 1 | 2 | 3 | 4));
    }, 350);
    return () => window.clearInterval(id);
  }, []);
  return (
    <svg
      className="sumi-thinking-icon"
      viewBox="0 0 32 32"
      aria-hidden="true"
    >
      {SUMI_FRAMES[frame]}
    </svg>
  );
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
  compact = false,
}: PlayerPanelProps) {
  return (
    <div
      className={`relative px-4 md:px-5 border rounded-sm transition-all ${
        compact ? 'py-1.5 md:py-2' : 'py-3 md:py-3.5'
      } ${
        isActive
          ? 'border-amber-200/60 bg-amber-200/[0.04] player-panel-active'
          : 'border-amber-200/15'
      }`}
    >
      <div className="flex items-center gap-3 md:gap-4">
        <AvatarBadge kanji={kanji} idx={idx} image={image} size={compact ? 'sm' : 'md'} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="jp-display text-amber-100/95 text-base md:text-lg truncate">
              {name}
            </span>
            {thinking && <SumiThinking />}
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
          {quote && !compact && (
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
  /**
   * The color the *human* is playing in this match. BLACK = the player
   * goes first, WHITE = AI plays first and the player responds. Drives
   * the AI-trigger, undo target, resign side, lives display, and which
   * side of the score panel shows the human avatar. In two-player mode
   * this is ignored (both panels are humans).
   */
  const [playerColor, setPlayerColor] = useState<Color>(BLACK);
  /**
   * Free-mode preference for which side the human takes when starting a
   * fresh game. Story mode ignores this — the side is randomized every
   * chapter via the coin-flip animation. 'first'/'second' map to
   * Black/White respectively.
   */
  const [firstPlayerPref, setFirstPlayerPref] = useState<'random' | 'first' | 'second'>('first');
  /**
   * Roll-animation state. When non-null we mount <FirstPlayerRoll> over
   * the board for ~1.5s before the game becomes interactive. `result`
   * is fixed up-front so the animation visibly resolves to whichever
   * side `playerColor` was just set to.
   */
  const [firstPlayerRoll, setFirstPlayerRoll] = useState<{ result: Color } | null>(null);

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
  // Step-replay cursor for the loaded kifu. null = not in replay mode
  // (use `board` directly). 0 = initial empty-center board, 1..N =
  // board after replaying the first N moves of `kifu`.
  const [replayCursor, setReplayCursor] = useState<number | null>(null);
  /** Auto-advance replay cursor at a fixed cadence. Stops automatically
   *  on the final move and on `loadedKifuView` exit. */
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  /** Cadence (ms per move). Cycled through 0.5x / 1x / 2x / 4x by the
   *  speed button next to ▶. */
  const [autoPlayMs, setAutoPlayMs] = useState(1000);
  /** Help-overlay modal listing every replay-strip control + the
   *  desktop keyboard shortcuts. */
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  // Saved Claude review attached to the currently-loaded kifu, if any.
  // `annotations` is the new structured per-move payload; `text` is the
  // legacy plain-text payload from older saves. Either or both may be
  // populated. Surfaces a "view saved review" button in the loaded-kifu
  // banner.
  const [loadedSlotReview, setLoadedSlotReview] = useState<{
    annotations?: ReviewAnnotations;
    text?: string;
    savedAt: number;
  } | null>(null);
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
  /**
   * Slot key associated with the current game (or the loaded kifu being
   * reviewed). Set when:
   *  - the gameOver auto-save effect creates a fresh slot,
   *  - or `loadKifuMoves` parks the user on a previously-saved slot.
   * Cleared by `reset()` and when the user starts playing on top of a
   * loaded position (so the original slot isn't overwritten). When a
   * Claude review completes, it is patched into this slot rather than
   * creating a duplicate.
   */
  const currentSlotKeyRef = useRef<string | null>(null);

  /**
   * Chapter being viewed inside the Settings → Story panel. Lets the
   * user browse past chapters they've already cleared without disturbing
   * `storyProgress`. Reset to the current frontier whenever the
   * settings modal opens so they always start "where they are".
   */
  const [chapterCursor, setChapterCursor] = useState(1);

  // UI state
  const [hintMove, setHintMove] = useState<Move | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [screen, setScreen] = useState<Screen>('title');

  // Post-game review state
  const [reviewOpen, setReviewOpen] = useState(false);
  // Structured review payload shown in the review modal & annotated
  // on the board. Set by startReview (live generation) or by
  // viewSavedReview (loading a saved structured review).
  const [reviewAnnotations, setReviewAnnotations] = useState<ReviewAnnotations | null>(null);
  // Legacy plain-text review, only used when viewing a saved review
  // that predates the structured-tool format. New reviews leave this
  // empty.
  const [reviewText, setReviewText] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  /** True when the review modal is showing a previously saved review
   *  (read-only). Hides Cancel/Regenerate/Save buttons. */
  const [reviewReadOnly, setReviewReadOnly] = useState(false);
  /** Saved-at timestamp shown in the read-only review view. */
  const [reviewSavedAt, setReviewSavedAtState] = useState<number | null>(null);
  const [reviewSavedFlash, setReviewSavedFlash] = useState(false);
  // Either a streaming legacy review, a structured fetch handle, or
  // null. Both expose .abort().
  const reviewHandleRef = useRef<{ abort: () => void } | null>(null);

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

  // Step-replay derived view of the board. When the loaded-kifu cursor
  // is parked on an intermediate move, replay from the initial position
  // up to that move and use the result for everything the user sees:
  // cells, last-move ring, score, status bar. Game-state effects
  // (recording, AI move, saving, etc.) keep using `board`/`counts`
  // because they're already gated by loadedKifuView.
  const displayBoard = useMemo(() => {
    if (!loadedKifuView || replayCursor === null) return board;
    let b = createInitialBoard();
    const stop = Math.min(replayCursor, kifu.length);
    for (let i = 0; i < stop; i++) {
      const m = kifu[i];
      const next = applyMove(b, m.row, m.col, m.color);
      if (!next) break;
      b = next;
    }
    return b;
  }, [loadedKifuView, replayCursor, kifu, board]);

  const displayCounts = useMemo(
    () => (displayBoard === board ? counts : countPieces(displayBoard)),
    [displayBoard, board, counts],
  );

  // Score tickers — interpolate to the new disc counts so the panel and
  // progress-bar labels visibly count up/down on every move (the
  // captured stones flip into the score over the same ~0.4s window the
  // CSS flip animation runs in, so they line up).
  const animatedBlack = useAnimatedNumber(displayCounts.black);
  const animatedWhite = useAnimatedNumber(displayCounts.white);

  const displayLastMove = useMemo<LastMove | null>(() => {
    if (!loadedKifuView || replayCursor === null) return lastMove;
    if (replayCursor === 0) return null;
    const m = kifu[replayCursor - 1];
    if (!m) return null;
    return { row: m.row, col: m.col, color: m.color };
  }, [loadedKifuView, replayCursor, kifu, lastMove]);

  // Combined source of structured review annotations for the current
  // view: prefer the just-generated review, fall back to whatever was
  // saved with the loaded kifu. null when neither is available.
  const activeAnnotations = useMemo<ReviewAnnotations | null>(
    () => reviewAnnotations ?? loadedSlotReview?.annotations ?? null,
    [reviewAnnotations, loadedSlotReview],
  );

  // Map<moveIndex, MoveAnnotation> for O(1) lookup from the cell map
  // and the replay strip.
  const annotationByMove = useMemo<Map<number, MoveAnnotation>>(() => {
    const m = new Map<number, MoveAnnotation>();
    if (activeAnnotations) {
      for (const a of activeAnnotations.annotations) m.set(a.moveIndex, a);
    }
    return m;
  }, [activeAnnotations]);

  // Annotation for the move currently parked at, if any. Used by the
  // replay strip's inline comment block.
  const currentAnnotation = useMemo<MoveAnnotation | null>(() => {
    if (!loadedKifuView || replayCursor === null || replayCursor === 0) return null;
    return annotationByMove.get(replayCursor - 1) ?? null;
  }, [loadedKifuView, replayCursor, annotationByMove]);

  // Quality buckets for the "next bad move" / "next good move" jump
  // buttons in the replay strip. Inaccuracy is counted as bad so the
  // user can scan all problem moves quickly; neutral never qualifies
  // either way (we don't even annotate those).
  const sortedBadAnnotationIndices = useMemo(() => {
    if (!activeAnnotations) return [] as number[];
    return activeAnnotations.annotations
      .filter((a) => a.quality === 'inaccuracy' || a.quality === 'mistake' || a.quality === 'blunder')
      .map((a) => a.moveIndex)
      .sort((x, y) => x - y);
  }, [activeAnnotations]);

  const sortedGoodAnnotationIndices = useMemo(() => {
    if (!activeAnnotations) return [] as number[];
    return activeAnnotations.annotations
      .filter((a) => a.quality === 'good' || a.quality === 'brilliant')
      .map((a) => a.moveIndex)
      .sort((x, y) => x - y);
  }, [activeAnnotations]);

  const jumpToNextAnnotated = useCallback(
    (sortedIndices: number[]) => {
      if (sortedIndices.length === 0) return;
      const cursorMove = (replayCursor ?? kifu.length) - 1;
      const next = sortedIndices.find((m) => m > cursorMove) ?? sortedIndices[0];
      setReplayCursor(next + 1);
    },
    [replayCursor, kifu.length],
  );
  const oppMoves = useMemo(
    () => getValidMoves(board, opponent(currentColor)),
    [board, currentColor],
  );
  const noCurrent = validMoves.length === 0;
  const noOpp = oppMoves.length === 0;
  const gameOver = (noCurrent && noOpp) || resigned !== null;
  const isHumanTurn = gameMode === 'human' || currentColor === playerColor;

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

  // AI move via Web Worker. Triggers whenever the side to move is the
  // AI's color (i.e. the opposite of the human's). When the human plays
  // White (chose 'second'), the very first move of the game is the AI's
  // — this effect kicks in straight from the initial board state.
  useEffect(() => {
    if (
      gameMode !== 'ai' ||
      currentColor === playerColor ||
      gameOver ||
      noCurrent ||
      passInfo !== null ||
      firstPlayerRoll !== null
    ) {
      setAiThinking(false);
      return;
    }
    setAiThinking(true);
    const delay = 450 + Math.min(level * 35, 700);
    let cancelled = false;
    const aiColor = opponent(playerColor);
    const timer = window.setTimeout(() => {
      ai
        .requestMove(board, aiColor, level)
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
  }, [currentColor, gameMode, board, level, gameOver, noCurrent, passInfo, playerColor, firstPlayerRoll]);

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
    // Determine the result from the human's perspective. The human's
    // color is `playerColor`; AI plays the opposite. The resigner is
    // always the human (the AI doesn't resign), so a resignation always
    // counts as a player loss regardless of which side they took.
    const humanCount = playerColor === BLACK ? counts.black : counts.white;
    const aiCount = playerColor === BLACK ? counts.white : counts.black;
    let result: 'win' | 'loss' | 'draw' | 'resign';
    if (resigned !== null) {
      result = 'resign';
    } else if (humanCount > aiCount) {
      result = 'win';
    } else if (humanCount < aiCount) {
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
    playerColor,
  ]);

  // Whenever a fresh game starts (kifu cleared, board reset) clear the
  // recorded-result gate so the next gameOver records again.
  useEffect(() => {
    if (kifu.length === 0 && !gameOver) setResultRecorded(false);
  }, [kifu.length, gameOver]);

  // Auto-save the kifu when the game ends. Skipped while reviewing a
  // loaded kifu (already on disk) and while no slot is parked. Once the
  // saved key is recorded into `currentSlotKeyRef`, the post-game review
  // flow patches the same slot in place instead of creating a duplicate.
  useEffect(() => {
    if (!gameOver || loadedKifuView || kifu.length === 0) return;
    if (currentSlotKeyRef.current) return;
    const ts = new Date();
    const stamp = `${ts.getMonth() + 1}/${ts.getDate()} ${String(ts.getHours()).padStart(2, '0')}:${String(ts.getMinutes()).padStart(2, '0')}`;
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
    const result: Color | typeof EMPTY | null =
      resigned !== null
        ? opponent(resigned)
        : counts.black > counts.white
          ? BLACK
          : counts.black < counts.white
            ? WHITE
            : EMPTY;
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
      playerColor,
    }).then((key) => {
      if (key) {
        currentSlotKeyRef.current = key;
        loadSavedSlots();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver, loadedKifuView, kifu.length]);

  // Cancel hint when turn changes
  useEffect(() => {
    setHintMove(null);
  }, [currentColor]);

  // Park the chapter cursor on the player's current frontier whenever
  // the settings modal opens so they always land on "where they are"
  // before deciding to browse backward.
  useEffect(() => {
    if (!settingsOpen) return;
    const max = Math.min(Math.max(storyProgress + 1, 1), 20);
    setChapterCursor(max);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingsOpen]);

  // Auto-play the replay cursor while `isAutoPlaying` is true. Stops on
  // the final move and whenever the loaded-kifu view exits. Uses the
  // functional updater for `replayCursor` so the interval doesn't have
  // to re-bind on every step.
  useEffect(() => {
    if (!loadedKifuView || !isAutoPlaying) return;
    const id = window.setInterval(() => {
      setReplayCursor((c) => {
        const next = (c ?? 0) + 1;
        if (next >= kifu.length) {
          setIsAutoPlaying(false);
          return kifu.length;
        }
        return next;
      });
    }, autoPlayMs);
    return () => window.clearInterval(id);
  }, [loadedKifuView, isAutoPlaying, autoPlayMs, kifu.length]);

  // Pause auto-play when the user leaves the loaded-kifu view by any
  // other means (e.g. clicking the board to start a new game).
  useEffect(() => {
    if (!loadedKifuView && isAutoPlaying) setIsAutoPlaying(false);
  }, [loadedKifuView, isAutoPlaying]);

  // Android / browser back button: close the topmost layer instead of
  // exiting the PWA. Each "layer" pushes a history entry so popstate
  // brings us back one step. Order of priority: review -> modal ->
  // game -> title.
  useEffect(() => {
    const onPopState = () => {
      if (helpModalOpen) {
        setHelpModalOpen(false);
      } else if (reviewOpen) {
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
  }, [settingsOpen, kifuOpen, infoOpen, screen, reviewOpen, slotPickerOpen, helpModalOpen]);

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
      (slotPickerOpen ? 1 : 0) +
      (helpModalOpen ? 1 : 0);
    if (depth > layerDepthRef.current) {
      window.history.pushState({ depth }, '');
    }
    layerDepthRef.current = depth;
  }, [screen, settingsOpen, kifuOpen, infoOpen, reviewOpen, slotPickerOpen, helpModalOpen]);

  // Keyboard shortcuts for the kifu replay viewer (desktop only — input
  // focus is bypassed). Mobile users get the long-press/help modal
  // instead. Mirrors the buttons in the replay strip 1:1.
  useEffect(() => {
    if (!loadedKifuView) return;
    const onKey = (e: KeyboardEvent) => {
      // Skip when the user is typing in any input or any modal that
      // owns the layer is open.
      if (
        settingsOpen ||
        reviewOpen ||
        kifuOpen ||
        infoOpen ||
        slotPickerOpen ||
        helpModalOpen
      ) {
        return;
      }
      const tag = (document.activeElement as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          setIsAutoPlaying(false);
          setReplayCursor((c) => Math.max(0, (c ?? kifu.length) - 1));
          return;
        case 'ArrowRight':
          e.preventDefault();
          setIsAutoPlaying(false);
          setReplayCursor((c) => Math.min(kifu.length, (c ?? 0) + 1));
          return;
        case 'Home':
          e.preventDefault();
          setIsAutoPlaying(false);
          setReplayCursor(0);
          return;
        case 'End':
          e.preventDefault();
          setIsAutoPlaying(false);
          setReplayCursor(kifu.length);
          return;
        case ' ':
        case 'Spacebar':
          e.preventDefault();
          toggleAutoPlay();
          return;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    loadedKifuView,
    settingsOpen,
    reviewOpen,
    kifuOpen,
    infoOpen,
    slotPickerOpen,
    helpModalOpen,
    kifu.length,
    isAutoPlaying,
    replayCursor,
  ]);

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
    if (loadedKifuView) {
      setLoadedKifuView(false);
      // Playing on top of a loaded kifu starts a fresh game; detach
      // from the original slot so its auto-save record isn't overwritten
      // when the new game ends.
      currentSlotKeyRef.current = null;
    }
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
    setReplayCursor(null);
    setLoadedSlotReview(null);
    // Drop the on-board annotation overlay too — a fresh game shouldn't
    // inherit the previous match's review markers.
    setReviewAnnotations(null);
    setReviewText('');
    currentSlotKeyRef.current = null;
    ai.cancel();
    // Decide who plays which color for the new match. Story = always
    // a coin-flip with animation; free with 'random' = same; free with
    // 'first'/'second' = deterministic, no animation; two-player =
    // doesn't apply (both panels are humans, leave at BLACK).
    const isStory = aiMode === 'story' && gameMode === 'ai';
    const isFree = aiMode === 'free' && gameMode === 'ai';
    if (isStory || (isFree && firstPlayerPref === 'random')) {
      const next: Color = Math.random() < 0.5 ? BLACK : WHITE;
      setPlayerColor(next);
      setFirstPlayerRoll({ result: next });
    } else if (isFree) {
      setPlayerColor(firstPlayerPref === 'second' ? WHITE : BLACK);
      setFirstPlayerRoll(null);
    } else {
      setPlayerColor(BLACK);
      setFirstPlayerRoll(null);
    }
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
    // AI mode: the human (playerColor) is the side that resigns. In
    // two-player both panels are humans, so the side currently to move
    // is the resigner.
    const loser: Color = gameMode === 'ai' ? playerColor : currentColor;
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
      // Walk back to the last snapshot where it was the human's turn
      // so undo lands on a state the player can act from. Works for
      // both first (player = Black) and second (player = White).
      let i = history.length - 1;
      while (i >= 0 && history[i].currentColor !== playerColor) i--;
      if (i < 0) return;
      const target = history[i];
      setBoard(target.board);
      setCurrentColor(playerColor);
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
    // Restore the perspective. Older slots predate playerColor and
    // assumed Black; falling back to BLACK keeps their replay layout
    // unchanged.
    setPlayerColor(slot.playerColor === WHITE ? WHITE : BLACK);
    setFirstPlayerRoll(null);
    setLoadedKifuView(true);
    setResultRecorded(true);
    // Track the slot we're parked on so a freshly-generated review
    // patches into the same record instead of duplicating it.
    currentSlotKeyRef.current = slot.key;
    // Park the replay cursor at the final move so the loaded board
    // shows the position the user actually saved. Stepping backward
    // happens via the banner controls.
    setReplayCursor(savedKifu.length);
    if (slot.reviewAnnotations || slot.review) {
      setLoadedSlotReview({
        annotations: slot.reviewAnnotations,
        text: slot.review,
        savedAt: slot.timestamp ?? 0,
      });
    } else {
      setLoadedSlotReview(null);
    }
  }

  /** GameOver "対戦棋譜を読み込む" shortcut: jump straight into the
   *  loaded-kifu replay view for the match that just ended (i.e. the
   *  slot the auto-save effect recorded), skipping the library modal.
   *  Falls back to opening the library if the auto-save key isn't set
   *  yet or the slot has gone missing. */
  async function loadCurrentMatchKifu() {
    const key = currentSlotKeyRef.current;
    const slots = await listSlots();
    setSavedSlots(slots);
    const slot = key ? slots.find((s) => s.key === key) ?? null : null;
    if (slot) {
      loadKifuMoves(slot);
    } else {
      setKifuOpen(true);
    }
  }

  /* ----- Auto-play replay ----- */

  /** Speed presets in cadence-ms. Cycled by the speed button next to
   *  Play. Order: 1x → 2x → 4x → 0.5x → 1x… so a single tap usually
   *  speeds things up rather than slowing them down. */
  const AUTOPLAY_SPEEDS: ReadonlyArray<{ ms: number; label: string }> = [
    { ms: 1000, label: '1x' },
    { ms: 500, label: '2x' },
    { ms: 250, label: '4x' },
    { ms: 2000, label: '0.5x' },
  ];

  function currentSpeedLabel(): string {
    const found = AUTOPLAY_SPEEDS.find((s) => s.ms === autoPlayMs);
    return found?.label ?? '1x';
  }

  function cycleAutoPlaySpeed() {
    const idx = AUTOPLAY_SPEEDS.findIndex((s) => s.ms === autoPlayMs);
    const next = AUTOPLAY_SPEEDS[(idx + 1) % AUTOPLAY_SPEEDS.length];
    setAutoPlayMs(next.ms);
  }

  function toggleAutoPlay() {
    if (isAutoPlaying) {
      setIsAutoPlaying(false);
      return;
    }
    if ((replayCursor ?? kifu.length) >= kifu.length) {
      // At the final move — rewind so play visibly does something.
      setReplayCursor(0);
    }
    setIsAutoPlaying(true);
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

  /**
   * Launch a match for a specific story chapter from the Settings
   * panel's chapter browser. When the chapter is the current frontier
   * the match runs as story mode (a win advances `storyProgress`);
   * for already-cleared chapters it runs as a free match against the
   * same opponent so the player's progress stays put.
   */
  function startStoryChapter(level: number, isFrontier: boolean) {
    const idx = COMPUTERS.findIndex((c) => c.level === level);
    if (idx < 0) return;
    setComputerChar(idx);
    setLevel(level);
    setGameMode('ai');
    setAiMode(isFrontier ? 'story' : 'free');
    setSettingsOpen(false);
    reset();
    setScreen('game');
  }

  /* ----- Post-game review ----- */

  function startReview() {
    if (kifu.length === 0) return;
    // Cancel any in-flight stream first.
    reviewHandleRef.current?.abort();
    setReviewError(null);
    setReviewText('');
    setReviewAnnotations(null);
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

    const handle: StructuredReviewHandle = fetchStructuredReview(args, locale);
    reviewHandleRef.current = { abort: handle.abort };
    handle.result
      .then((annotations) => {
        // Only apply if this request wasn't superseded.
        if (reviewHandleRef.current?.abort === handle.abort) {
          setReviewAnnotations(annotations);
          setReviewLoading(false);
          // Auto-attach the review to the slot the kifu lives in (the
          // gameOver auto-save record, or the slot the user loaded for
          // review). The user no longer has to press "save" — same
          // ergonomic principle as the kifu auto-save.
          const slotKey = currentSlotKeyRef.current;
          if (slotKey) {
            void storageUpdateSlot(slotKey, {
              reviewAnnotations: annotations,
              review: undefined,
            }).then(() => {
              loadSavedSlots();
              setReviewSavedFlash(true);
              window.setTimeout(() => setReviewSavedFlash(false), 2000);
            });
          }
        }
      })
      .catch((err: unknown) => {
        if (reviewHandleRef.current?.abort === handle.abort) {
          setReviewError(err instanceof Error ? err.message : String(err));
          setReviewLoading(false);
        }
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
    // Note: we keep `reviewAnnotations` so closing the modal doesn't
    // discard the on-board annotation overlay (the user may want to
    // step through the kifu while reading the comment per move).
  }

  function cancelReview() {
    reviewHandleRef.current?.abort();
    reviewHandleRef.current = null;
    setReviewLoading(false);
  }

  /** Open the review modal in read-only mode for a previously saved
   *  review (either the structured annotations payload or the legacy
   *  text string — passing both is allowed). */
  function viewSavedReview(payload: {
    annotations?: ReviewAnnotations;
    text?: string;
    savedAt: number;
  }) {
    reviewHandleRef.current?.abort();
    reviewHandleRef.current = null;
    setReviewError(null);
    setReviewLoading(false);
    setReviewAnnotations(payload.annotations ?? null);
    setReviewText(payload.text ?? '');
    setReviewReadOnly(true);
    setReviewSavedAtState(payload.savedAt);
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

  // Avatar bundles for whichever side the human is on. In two-player
  // mode there's no AI so both sides come from AVATARS. In AI mode the
  // computer takes the side opposite playerColor.
  const humanInfo = {
    kanji: AVATARS[p1Avatar].kanji,
    idx: p1Avatar,
    image: AVATARS[p1Avatar].image,
    name: AVATARS[p1Avatar].name,
    quote: AVATARS[p1Avatar].quote,
    level: undefined as number | undefined,
  };
  const aiInfo =
    gameMode === 'ai'
      ? {
          kanji: COMPUTERS[computerChar].kanji,
          idx: computerChar + 100,
          image: COMPUTERS[computerChar].image,
          name: COMPUTERS[computerChar].name,
          quote: COMPUTERS[computerChar].quote,
          level: COMPUTERS[computerChar].level as number | undefined,
        }
      : {
          kanji: AVATARS[p2Avatar].kanji,
          idx: p2Avatar + 50,
          image: AVATARS[p2Avatar].image,
          name: AVATARS[p2Avatar].name,
          quote: AVATARS[p2Avatar].quote,
          level: undefined as number | undefined,
        };
  // Map each board color to its current avatar bundle. In two-player
  // mode the conventions stays p1=Black, p2=White (playerColor isn't
  // meaningful there). In AI mode swap depending on which side the
  // human took.
  const blackInfo = gameMode === 'human'
    ? humanInfo
    : playerColor === BLACK
      ? humanInfo
      : aiInfo;
  const whiteInfo = gameMode === 'human'
    ? aiInfo
    : playerColor === WHITE
      ? humanInfo
      : aiInfo;

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
    !loadedKifuView &&
    history.length > 0 &&
    (gameMode === 'human' || history.some((h) => h.currentColor === BLACK));
  const canHint =
    isHumanTurn &&
    !aiThinking &&
    !gameOver &&
    !noCurrent &&
    passInfo === null &&
    !loadedKifuView;

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
        /* Wagara watermark layered above the noise but well below
           interactive content. The asanoha tile already has a low
           alpha baked in; we knock it down further with opacity so
           it reads as a faint lattice rather than competing pattern.
           Kept conservative (0.35) so semi-transparent UI cards on
           top — like the replay strip — don't pick up the pattern
           through their backgrounds. */
        .stage-bg::after {
          content: ''; position: absolute; inset: 0;
          background-image: url('/textures/wagara-tile.png');
          background-repeat: repeat;
          opacity: 0.35;
          pointer-events: none;
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
        .last-move-ring-loaded {
          inset: 5%;
          border-width: 3px;
          border-color: #f5e8c8;
          opacity: 1;
          box-shadow: 0 0 14px 4px rgba(245, 232, 200, 0.45);
          animation: pulse-bold 1.5s infinite ease-in-out;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.04); }
        }
        @keyframes pulse-bold {
          0%, 100% { opacity: 0.7; transform: scale(1); box-shadow: 0 0 12px 3px rgba(245, 232, 200, 0.35); }
          50% { opacity: 1; transform: scale(1.08); box-shadow: 0 0 20px 6px rgba(245, 232, 200, 0.6); }
        }

        .quality-ring {
          position: absolute; inset: 4%;
          border-radius: 50%;
          border: 3px solid currentColor;
          opacity: 0.95;
          animation: quality-pulse 1.4s infinite ease-in-out;
          pointer-events: none;
          z-index: 3;
        }
        .quality-ring::after {
          content: ''; position: absolute; inset: -10%;
          border-radius: 50%;
          border: 1.5px solid currentColor;
          opacity: 0.4;
          animation: quality-pulse-out 1.4s infinite ease-in-out;
          pointer-events: none;
        }
        @keyframes quality-pulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.07); }
        }
        @keyframes quality-pulse-out {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.18); }
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

        /* Outward ripple drawn on the just-placed cell. Goes through
           one cycle then sticks at opacity 0 — the React re-mount via
           key={kifu.length} replays it on the next move. */
        .cell-ripple {
          position: absolute; inset: 25%;
          border: 2px solid rgba(201, 169, 97, 0.7);
          border-radius: 50%;
          animation: ripple-out 0.5s ease-out forwards;
          pointer-events: none;
        }
        @keyframes ripple-out {
          0%   { transform: scale(0.2); opacity: 0.85; }
          100% { transform: scale(2.4); opacity: 0; }
        }

        /* Soft breathing glow around the active player's panel so the
           current turn is unmistakable from across the board. The
           color matches our amber accent so it reads as "lit by the
           same lamp" as the felt highlight rather than warning red. */
        .player-panel-active {
          animation: panel-breathing 2.4s ease-in-out infinite;
        }
        @keyframes panel-breathing {
          0%, 100% { box-shadow: 0 0 0 0 rgba(252, 211, 77, 0); }
          50%      { box-shadow: 0 0 12px 0 rgba(252, 211, 77, 0.32); }
        }

        /* "Grip the stone" overlay used by <FirstPlayerRoll>. The
           inline SVG hand cycles through closed → opening → open via
           React state; this CSS just sizes the stage and gives each
           frame a soft pop-in via key={frame} re-mount. */
        .grip-stage {
          width: 132px;
          height: 132px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: grip-frame-in 0.32s cubic-bezier(0.2, 0.8, 0.3, 1);
        }
        .grip-svg {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.55));
        }
        @keyframes grip-frame-in {
          from { transform: scale(0.86); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
        .first-player-roll {
          animation: roll-fade-in 0.25s ease-out;
        }
        @keyframes roll-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* Brush-stroke decorative divider. Inline-SVG <BrushDivider>
           strokes inherit color from this rule via currentColor, so
           a per-instance className like text-red-300/55 recolors
           every stroke at once. */
        .brush-divider {
          display: block;
          width: min(18rem, 60%);
          height: 18px;
          margin: 0 auto;
          color: rgba(201, 169, 97, 0.55);
        }

        /* Sumi-e flavored "thinking" indicator. <SumiThinking> renders
           inline SVG (4 frames swapped on a 350 ms timer); the SVG
           fills inherit currentColor from this rule. */
        .sumi-thinking-icon {
          display: inline-block;
          width: 1.4em;
          height: 1.4em;
          color: rgba(245, 232, 200, 0.92);
          vertical-align: middle;
          margin-left: 4px;
        }

        /* Sakura petal celebration. Two animations run together:
           petal-fall drops the SVG from above the viewport to
           below it, while petal-sway rocks the horizontal position to
           imitate wind drift. Petal shapes are inline SVG with
           fill="currentColor" so the JS-assigned color drives the
           tint directly — no mask-image, no asset-pipeline reliance,
           consistent across browsers. */
        .petal-svg {
          --petal-drift: 22px;
          position: absolute;
          top: -32px;
          opacity: 0.95;
          will-change: transform, top;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.18));
          animation:
            petal-fall linear forwards,
            petal-sway ease-in-out infinite alternate;
        }
        @keyframes petal-fall {
          0%   { top: -40px; }
          100% { top: 110vh; }
        }
        @keyframes petal-sway {
          from { margin-left: calc(var(--petal-drift) * -1); }
          to   { margin-left: var(--petal-drift); }
        }

        /* Rising-card entrance for any modal that uses .modal-card.
           Subtle 12px lift + 0.3s ease-out so opening modals doesn't
           feel like a hard cut. */
        .modal-card {
          animation: card-rise 0.3s ease-out;
        }
        @keyframes card-rise {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Screen-level fade applied via key={screen} on the wrapper so
           it remounts and replays. Kept short to not slow navigation. */
        .screen-fade {
          animation: screen-fade-in 0.35s ease-out;
        }
        @keyframes screen-fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Brief halo on the score progress bar when the kifu length
           changes. Uses key={kifu.length} on the bar to remount and
           replay this animation; pure cosmetic feedback for "your move
           registered". */
        .progress-flash {
          animation: progress-flash 0.6s ease-out;
        }
        @keyframes progress-flash {
          0%   { box-shadow: 0 0 0 0 rgba(245, 232, 200, 0); }
          30%  { box-shadow: 0 0 12px 2px rgba(245, 232, 200, 0.5); }
          100% { box-shadow: 0 0 0 0 rgba(245, 232, 200, 0); }
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
        <div key="title" className="screen-fade">
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
        </div>
      )}

      {screen === 'game' && (
      <div key="game" className="screen-fade stage-bg min-h-screen w-full relative">
        {/* First/second coin-flip overlay. Mounted while
            `firstPlayerRoll` is set; auto-dismisses itself after 2s. */}
        <FirstPlayerRoll
          active={firstPlayerRoll !== null}
          result={firstPlayerRoll?.result ?? null}
          playerName={AVATARS[p1Avatar].name}
          onComplete={() => setFirstPlayerRoll(null)}
          t={t}
        />
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
          <div className="grid md:grid-cols-[1fr_auto_1fr] landscape:grid-cols-[1fr_auto_1fr] gap-5 md:gap-6 landscape:gap-4 items-center">
            <div className="md:order-1">
              <PlayerPanel
                color={BLACK}
                count={animatedBlack}
                isActive={currentColor === BLACK && !gameOver && passInfo === null}
                kanji={blackInfo.kanji}
                idx={blackInfo.idx}
                image={blackInfo.image}
                name={blackInfo.name}
                quote={blackInfo.quote}
                level={
                  gameMode === 'ai' && playerColor === WHITE
                    ? blackInfo.level
                    : undefined
                }
                thinking={aiThinking && playerColor === WHITE}
                lives={
                  gameMode === 'ai' && aiMode === 'story' && activeSlot && playerColor === BLACK
                    ? lives
                    : undefined
                }
                compact={loadedKifuView}
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
                      {displayBoard.map((row, r) =>
                        row.map((cell: Disc, c) => {
                          const isValid =
                            validMoveMap.has(moveKey(r, c)) &&
                            isHumanTurn &&
                            !aiThinking &&
                            !gameOver &&
                            passInfo === null &&
                            !loadedKifuView;
                          const isStar = (r === 2 || r === 6) && (c === 2 || c === 6);
                          const isLast =
                            displayLastMove !== null &&
                            displayLastMove.row === r &&
                            displayLastMove.col === c;
                          const flipTo = flipping[moveKey(r, c)];
                          const isHint = hintMove !== null && hintMove.row === r && hintMove.col === c;
                          // If the current cursor's move has a Claude
                          // annotation, replace the default red last-move
                          // ring with a quality-colored glow so the user
                          // sees at a glance whether this move was good or
                          // a mistake.
                          const cellAnnotation =
                            isLast && currentAnnotation ? currentAnnotation : null;
                          const qStyle = cellAnnotation
                            ? QUALITY_STYLES[cellAnnotation.quality]
                            : null;
                          return (
                            <div
                              key={`${r}-${c}`}
                              onClick={() => isValid && handleClick(r, c)}
                              className={`cell flex items-center justify-center ${
                                isValid ? 'valid' : ''
                              } ${isStar ? 'star-dot' : ''}`}
                              style={qStyle ? { boxShadow: qStyle.glow } : undefined}
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
                              {cellAnnotation && qStyle && (
                                <div
                                  className="quality-ring"
                                  style={{ color: qStyle.ringColor }}
                                />
                              )}
                              {/* Brief outward gold ripple on every fresh
                                  placement. `key={kifu.length}` forces a
                                  re-mount so the 0.5s animation replays
                                  on each new move; the loaded-kifu view
                                  skips it (we want quiet stepping). */}
                              {isLast && !loadedKifuView && (
                                <div key={`ripple-${kifu.length}`} className="cell-ripple" />
                              )}
                              {isLast && !cellAnnotation && (
                                <div
                                  className={`last-move-ring${
                                    loadedKifuView ? ' last-move-ring-loaded' : ''
                                  }`}
                                />
                              )}
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
                count={animatedWhite}
                isActive={currentColor === WHITE && !gameOver && passInfo === null}
                kanji={whiteInfo.kanji}
                idx={whiteInfo.idx}
                image={whiteInfo.image}
                name={whiteInfo.name}
                quote={whiteInfo.quote}
                level={
                  gameMode === 'ai' && playerColor === BLACK
                    ? whiteInfo.level
                    : undefined
                }
                thinking={aiThinking && playerColor === BLACK}
                lives={
                  gameMode === 'ai' && aiMode === 'story' && activeSlot && playerColor === WHITE
                    ? lives
                    : undefined
                }
                compact={loadedKifuView}
              />
            </div>
          </div>

          {/* Progress bar */}
          <div className={`max-w-xl mx-auto ${loadedKifuView ? 'mt-3' : 'mt-7'}`}>
            {/* `key={kifu.length}` forces a re-mount on every move so the
                 progress-flash animation replays — the player gets a
                 brief gold halo confirming the bar just moved. */}
            <div
              key={kifu.length}
              className="h-1.5 rounded-full overflow-hidden flex bg-amber-100/10 border border-amber-200/10 progress-flash"
            >
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
              <span>{animatedBlack} {t.black}</span>
              <span>{t.white} {animatedWhite}</span>
            </div>
          </div>

          {/* Inline replay strip — appears in document flow below the
              status bar so it never overlaps the board. Icon-only
              buttons, single row on phones thanks to flex-wrap. */}
          {loadedKifuView && (() => {
            const cursor = replayCursor ?? kifu.length;
            const atStart = cursor <= 0;
            const atEnd = cursor >= kifu.length;
            const currentNotation =
              cursor > 0 && cursor <= kifu.length
                ? moveToNotation(kifu[cursor - 1]).toUpperCase()
                : null;
            // Manual stepping should pause auto-play — surprising
            // otherwise to step then have the cursor keep walking on
            // its own a moment later.
            const stepFirst = () => {
              setIsAutoPlaying(false);
              setReplayCursor(0);
            };
            const stepPrev = () => {
              setIsAutoPlaying(false);
              setReplayCursor((c) => Math.max(0, (c ?? kifu.length) - 1));
            };
            const stepNext = () => {
              setIsAutoPlaying(false);
              setReplayCursor((c) => Math.min(kifu.length, (c ?? 0) + 1));
            };
            const stepLast = () => {
              setIsAutoPlaying(false);
              setReplayCursor(kifu.length);
            };
            return (
              <div className="mt-3 px-2 py-2 rounded-sm border border-amber-200/30 bg-zinc-950/90 flex flex-col gap-2">
                {/* Top row: status + meta-actions. Counter sits left so
                    the player reads where they are first; review / help
                    / close anchor right so they don't shift across rows
                    when annotations toggle. */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="latin-display text-amber-100/85 text-[11px] tabular-nums tracking-wider px-1">
                    {t.kifuMoveCounter(cursor, kifu.length, currentNotation)}
                  </div>
                  <div className="flex items-center gap-1 flex-wrap justify-end">
                    {loadedSlotReview && (
                      <ReplayIconButton
                        icon={ScrollText}
                        helpText={t.reviewViewSaved}
                        onClick={() =>
                          viewSavedReview({
                            annotations: loadedSlotReview.annotations,
                            text: loadedSlotReview.text,
                            savedAt: loadedSlotReview.savedAt,
                          })
                        }
                      />
                    )}
                    {gameMode === 'ai' && kifu.length > 0 && (
                      <ReplayIconButton
                        icon={Sparkles}
                        helpText={
                          loadedSlotReview ? t.reviewGenerateNew : t.reviewMatchButton
                        }
                        onClick={startReview}
                      />
                    )}
                    <ReplayIconButton
                      icon={HelpCircle}
                      helpText={t.replayHelpTitle}
                      onClick={() => setHelpModalOpen(true)}
                    />
                    <ReplayIconButton
                      icon={X}
                      helpText={t.kifuViewingClose}
                      onClick={reset}
                    />
                  </div>
                </div>

                {/* Bottom row: playback controls. Centered so it reads
                    like a media player; flex-wrap ensures the
                    annotation-jump pair drops to its own line on very
                    narrow phones instead of clipping out of the card. */}
                <div className="flex items-center justify-center gap-1 flex-wrap">
                  <ReplayIconButton
                    icon={ChevronsLeft}
                    helpText={t.replayFirst}
                    onClick={stepFirst}
                    disabled={atStart}
                  />
                  <ReplayIconButton
                    icon={ChevronLeft}
                    helpText={t.replayPrev}
                    onClick={stepPrev}
                    disabled={atStart}
                  />
                  <ReplayIconButton
                    icon={isAutoPlaying ? Pause : Play}
                    helpText={isAutoPlaying ? t.replayPause : t.replayPlay}
                    onClick={toggleAutoPlay}
                    disabled={kifu.length === 0}
                    iconClassName="text-amber-100"
                  />
                  <button
                    type="button"
                    onClick={cycleAutoPlaySpeed}
                    className="btn px-2 py-1 latin-display tabular-nums text-[11px] tracking-wider"
                    title={t.replaySpeedFormat(currentSpeedLabel())}
                    aria-label={t.replaySpeedFormat(currentSpeedLabel())}
                  >
                    {currentSpeedLabel()}
                  </button>
                  <ReplayIconButton
                    icon={ChevronRight}
                    helpText={t.replayNext}
                    onClick={stepNext}
                    disabled={atEnd}
                  />
                  <ReplayIconButton
                    icon={ChevronsRight}
                    helpText={t.replayLast}
                    onClick={stepLast}
                    disabled={atEnd}
                  />
                  {/* Jump to next bad / good annotated move (cycles
                      back to first if past the last one). Disabled
                      when no annotation of that quality exists, or
                      when the kifu has no annotations at all. */}
                  {activeAnnotations && (
                    <>
                      <span className="w-px h-5 bg-amber-200/20 mx-1" />
                      <ReplayIconButton
                        icon={AlertTriangle}
                        helpText={t.jumpNextBad}
                        onClick={() => {
                          setIsAutoPlaying(false);
                          jumpToNextAnnotated(sortedBadAnnotationIndices);
                        }}
                        disabled={sortedBadAnnotationIndices.length === 0}
                        iconClassName="text-orange-300/85"
                      />
                      <ReplayIconButton
                        icon={ThumbsUp}
                        helpText={t.jumpNextGood}
                        onClick={() => {
                          setIsAutoPlaying(false);
                          jumpToNextAnnotated(sortedGoodAnnotationIndices);
                        }}
                        disabled={sortedGoodAnnotationIndices.length === 0}
                        iconClassName="text-emerald-300/85"
                      />
                    </>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Per-move annotation comment. Shown directly under the replay
              strip when the cursor is parked on an annotated move. The
              quality badge reuses the same colors as the on-board ring
              so the user can correlate at a glance. */}
          {loadedKifuView && currentAnnotation && (() => {
            const q = currentAnnotation.quality;
            const style = QUALITY_STYLES[q];
            return (
              <div className="mt-2 px-3 py-2.5 rounded-sm border border-amber-200/25 bg-zinc-950/90 flex items-start gap-2">
                <span
                  className={`shrink-0 latin-display text-[10px] tracking-[0.2em] uppercase border px-2 py-0.5 rounded-sm ${style.badge}`}
                >
                  {qualityLabel(q, t)}
                </span>
                <p className="jp-display text-amber-100/90 text-xs md:text-sm leading-relaxed">
                  {currentAnnotation.comment}
                </p>
              </div>
            );
          })()}

          {/* Footer caption is redundant during a loaded-kifu review
              (the score bar + replay strip already show all the
              relevant context) — hide it to free vertical space. */}
          {!loadedKifuView && (
            <div className="text-center mt-6 latin-display italic text-amber-200/55 text-xs tracking-[0.3em] uppercase">
              {gameMode === 'human'
                ? t.footerHuman
                : aiMode === 'story'
                  ? storyProgress >= 20
                    ? t.footerStoryComplete(COMPUTERS[computerChar].name)
                    : t.footerChapter(storyProgress + 1, COMPUTERS[computerChar].name)
                  : t.footerFree(COMPUTERS[computerChar].name, level, getLevelLabel(level, t))}
            </div>
          )}

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
                    <BrushDivider
                      variant="end"
                      className="text-red-300/55 mb-3"
                    />
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
                      <div className="flex justify-center gap-2 mt-3 mb-3 flex-wrap">
                        <button onClick={startReview} className="btn">
                          {t.reviewMatchButton}
                        </button>
                        <button
                          onClick={() => void loadCurrentMatchKifu()}
                          className="btn"
                        >
                          {t.gameOverViewKifu}
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
                {/* Sakura confetti for any story-mode win (chapter clear
                    OR full ending). Sits behind the modal card so the
                    petals visibly drift past the score panel. */}
                <ChapterClearConfetti active={justAdvanced} />
                <div className="modal-card px-8 md:px-10 py-10 md:py-12 max-w-md w-full text-center rounded-sm">
                  <div className="latin-display italic ornament text-[10px] md:text-xs uppercase mb-3">
                    {justCompletedStory
                      ? t.storyComplete
                      : isStoryMode
                        ? t.chapterN(playedChapter)
                        : t.finalResult}
                  </div>
                  <BrushDivider
                    variant={justCompletedStory ? 'flourish' : 'bold'}
                    className="mb-3"
                  />
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

                  {/* You vs the opponent that was just played + final score.
                      Layout always shows Black on the left, White on
                      the right (the standard board convention). The
                      avatar on each side depends on which color the
                      human took: when playerColor === WHITE the human
                      avatar appears on the right, AI on the left. */}
                  {(() => {
                    const humanSideIsBlack = gameMode !== 'ai' || playerColor === BLACK;
                    const aiAvatar =
                      gameMode === 'ai' && opponentSnapshot
                        ? {
                            kanji: opponentSnapshot.kanji,
                            idx: 100 + opponentSnapshot.level,
                            image: opponentSnapshot.image,
                            name: opponentSnapshot.name,
                          }
                        : {
                            kanji: aiInfo.kanji,
                            idx: aiInfo.idx,
                            image: aiInfo.image,
                            name: aiInfo.name,
                          };
                    const blackDisplay = humanSideIsBlack ? humanInfo : aiAvatar;
                    const whiteDisplay = humanSideIsBlack ? aiAvatar : humanInfo;
                    return (
                      <div className="flex justify-center items-center gap-6 md:gap-8 my-5">
                        <div className="flex flex-col items-center gap-2">
                          <AvatarBadge
                            kanji={blackDisplay.kanji}
                            idx={blackDisplay.idx}
                            image={blackDisplay.image}
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
                            {blackDisplay.name}
                          </div>
                          <div className="latin-display text-3xl md:text-4xl text-amber-100 leading-none">
                            {counts.black}
                          </div>
                        </div>
                        <div className="latin-display italic text-amber-200/65 text-xl">vs</div>
                        <div className="flex flex-col items-center gap-2">
                          <AvatarBadge
                            kanji={whiteDisplay.kanji}
                            idx={whiteDisplay.idx}
                            image={whiteDisplay.image}
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
                            {whiteDisplay.name}
                          </div>
                          <div className="latin-display text-3xl md:text-4xl text-amber-100 leading-none">
                            {counts.white}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

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
                    <div className="flex justify-center gap-2 mt-3 mb-1 flex-wrap">
                      <button onClick={startReview} className="btn">
                        {t.reviewMatchButton}
                      </button>
                      <button
                        onClick={() => void loadCurrentMatchKifu()}
                        className="btn"
                      >
                        {t.gameOverViewKifu}
                      </button>
                    </div>
                  )}

                  <div className="flex justify-center gap-2 mt-4 flex-wrap">
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
          })()}

          {/* (Replay strip is now embedded inline below the score bar so
              it never overlaps the board. See the loadedKifuView block
              earlier in this file.) */}

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

                <div className="px-3 py-2.5 bg-amber-200/[0.04] border border-amber-200/15 rounded-sm mb-5 text-xs jp-display text-amber-100/80 leading-relaxed">
                  {t.kifuLibraryHint}
                </div>

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
                                {(slot.review || slot.reviewAnnotations) && (
                                  <span className="ml-1 text-amber-200/85">
                                    · 📝 {t.reviewSavedIndicator}
                                  </span>
                                )}
                              </div>
                            </div>
                            {(slot.review || slot.reviewAnnotations) && (
                              <button
                                onClick={() =>
                                  viewSavedReview({
                                    annotations: slot.reviewAnnotations,
                                    text: slot.review,
                                    savedAt: slot.timestamp ?? 0,
                                  })
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

          {/* Replay-controls help modal — opened by the `?` button on
              the replay strip. Just a static reference list so users
              can confirm what each icon does without long-pressing. */}
          {helpModalOpen && (
            <div className="modal-bg fixed inset-0 z-[55] flex items-stretch md:items-center justify-center p-2 md:p-6">
              <div className="modal-card scroll-y w-full max-w-md max-h-[95vh] rounded-sm p-5 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="latin-display italic ornament text-[10px] uppercase mb-1">
                      — {t.replayHelpSubtitle} —
                    </div>
                    <BrushDivider variant="thin" className="mb-2 max-w-[12rem]" />
                    <h2 className="jp-display text-amber-100 text-xl md:text-2xl font-bold tracking-[0.15em]">
                      {t.replayHelpTitle}
                    </h2>
                  </div>
                  <button onClick={() => setHelpModalOpen(false)} className="btn">
                    {t.close}
                  </button>
                </div>

                <ul className="space-y-2 text-sm">
                  {(
                    [
                      { icon: ChevronsLeft, label: t.replayFirst, desc: t.replayHelpDescFirst },
                      { icon: ChevronLeft, label: t.replayPrev, desc: t.replayHelpDescPrev },
                      { icon: Play, label: t.replayPlay, desc: t.replayHelpDescPlay },
                      { icon: ChevronRight, label: t.replayNext, desc: t.replayHelpDescNext },
                      { icon: ChevronsRight, label: t.replayLast, desc: t.replayHelpDescLast },
                      {
                        icon: AlertTriangle,
                        label: t.jumpNextBad,
                        desc: t.replayHelpDescJumpBad,
                        color: 'text-orange-300/85',
                      },
                      {
                        icon: ThumbsUp,
                        label: t.jumpNextGood,
                        desc: t.replayHelpDescJumpGood,
                        color: 'text-emerald-300/85',
                      },
                      {
                        icon: ScrollText,
                        label: t.reviewViewSaved,
                        desc: t.replayHelpDescViewSavedReview,
                      },
                      {
                        icon: Sparkles,
                        label: t.reviewMatchButton,
                        desc: t.replayHelpDescGenerateReview,
                      },
                      { icon: X, label: t.kifuViewingClose, desc: t.replayHelpDescClose },
                    ] as ReadonlyArray<{
                      icon: LucideIcon;
                      label: string;
                      desc: string;
                      color?: string;
                    }>
                  ).map((row, i) => {
                    const I = row.icon;
                    return (
                      <li
                        key={i}
                        className="flex items-start gap-3 px-2 py-2 rounded-sm border border-amber-200/15 bg-amber-200/[0.02]"
                      >
                        <span
                          className={`shrink-0 mt-0.5 ${row.color ?? 'text-amber-100/90'}`}
                        >
                          <I size={16} strokeWidth={1.5} />
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="jp-display text-amber-100 text-sm font-bold tracking-wider">
                            {row.label}
                          </div>
                          <p className="jp-display text-amber-100/80 text-xs leading-relaxed mt-0.5">
                            {row.desc}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                  <li className="flex items-start gap-3 px-2 py-2 rounded-sm border border-amber-200/15 bg-amber-200/[0.02]">
                    <span className="shrink-0 mt-0.5 latin-display tabular-nums text-amber-100/85 text-[11px] font-bold">
                      1x
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="jp-display text-amber-100 text-sm font-bold tracking-wider">
                        {t.replaySpeedFormat(currentSpeedLabel())}
                      </div>
                      <p className="jp-display text-amber-100/80 text-xs leading-relaxed mt-0.5">
                        {t.replayHelpDescSpeed}
                      </p>
                    </div>
                  </li>
                </ul>

                <div className="mt-5 pt-4 border-t border-amber-200/15">
                  <h3 className="jp-display text-amber-100/90 text-xs tracking-[0.25em] uppercase mb-2">
                    {t.replayHelpKeyboardHeading}
                  </h3>
                  <ul className="space-y-1 jp-display text-amber-100/80 text-xs leading-relaxed">
                    <li>{t.replayHelpKeyboardArrows}</li>
                    <li>{t.replayHelpKeyboardSpace}</li>
                    <li>{t.replayHelpKeyboardHomeEnd}</li>
                  </ul>
                </div>
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
                  ) : reviewLoading && !reviewAnnotations ? (
                    <p className="jp-display italic text-amber-200/65 text-sm">
                      {t.reviewLoading}
                    </p>
                  ) : reviewAnnotations ? (
                    /* Structured (new) review view */
                    <div className="space-y-4">
                      <section>
                        <h3 className="jp-display text-amber-100 text-base font-bold tracking-wider mb-1.5 pb-1 border-b border-amber-200/15">
                          {t.reviewSummaryHeading}
                        </h3>
                        <p className="jp-display text-amber-100/90 text-sm leading-relaxed">
                          {reviewAnnotations.summary}
                        </p>
                      </section>
                      <section>
                        <h3 className="jp-display text-amber-100 text-base font-bold tracking-wider mb-1.5 pb-1 border-b border-amber-200/15">
                          {t.reviewImprovementsHeading}
                        </h3>
                        <p className="jp-display text-amber-100/90 text-sm leading-relaxed">
                          {reviewAnnotations.improvements}
                        </p>
                      </section>
                      <section>
                        <h3 className="jp-display text-amber-100 text-base font-bold tracking-wider mb-2 pb-1 border-b border-amber-200/15">
                          {t.reviewMovesHeading}
                        </h3>
                        {reviewAnnotations.annotations.length === 0 ? (
                          <p className="jp-display italic text-amber-200/65 text-sm">
                            {t.reviewNoAnnotations}
                          </p>
                        ) : (
                          <ul className="space-y-1.5">
                            {[...reviewAnnotations.annotations]
                              .sort((a, b) => a.moveIndex - b.moveIndex)
                              .map((a) => {
                                const move = kifu[a.moveIndex];
                                if (!move) return null;
                                const notation = moveToNotation(move).toUpperCase();
                                const side: 'B' | 'W' = move.color === BLACK ? 'B' : 'W';
                                const qStyle = QUALITY_STYLES[a.quality];
                                const canJump = loadedKifuView;
                                return (
                                  <li
                                    key={a.moveIndex}
                                    className={`flex items-start gap-2 px-2 py-2 rounded-sm border border-amber-200/15 bg-amber-200/[0.02] ${
                                      canJump
                                        ? 'cursor-pointer hover:bg-amber-200/[0.06] hover:border-amber-200/35'
                                        : ''
                                    }`}
                                    onClick={() => {
                                      if (!canJump) return;
                                      setReplayCursor(a.moveIndex + 1);
                                      setReviewOpen(false);
                                    }}
                                  >
                                    <span
                                      className={`shrink-0 latin-display text-[10px] tracking-[0.2em] uppercase border px-2 py-0.5 rounded-sm ${qStyle.badge}`}
                                    >
                                      {qualityLabel(a.quality, t)}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                      <div className="latin-display text-amber-100/85 text-[11px] tabular-nums tracking-wider mb-0.5">
                                        {t.reviewMoveLabel(a.moveIndex + 1, notation, side)}
                                      </div>
                                      <p className="jp-display text-amber-100/90 text-xs leading-relaxed">
                                        {a.comment}
                                      </p>
                                    </div>
                                  </li>
                                );
                              })}
                          </ul>
                        )}
                      </section>
                    </div>
                  ) : reviewText.length > 0 ? (
                    /* Legacy plain-text review view (saved before
                       structured tool-use, kept for backward compat) */
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
                    </div>
                  ) : null}
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
                      (reviewError || reviewAnnotations !== null || reviewText.length > 0) && (
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
                        const maxCursor = Math.min(
                          Math.max(storyProgress + 1, 1),
                          20,
                        );
                        const cursor = Math.min(
                          Math.max(chapterCursor, 1),
                          maxCursor,
                        );
                        const targetLevel = cursor;
                        const oppIdx = COMPUTERS.findIndex(
                          (c) => c.level === targetLevel,
                        );
                        const opp = COMPUTERS[oppIdx];
                        const isFrontier = !isComplete && cursor === storyProgress + 1;
                        const isPast = cursor <= storyProgress;
                        const showEnding = isComplete && cursor === 20;
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
                                    } ${i + 1 === cursor ? 'ring-1 ring-amber-200/80' : ''}`}
                                  />
                                ))}
                              </div>
                            </div>

                            {/* Chapter navigation row. Lets the player step
                                through cleared chapters without disturbing
                                the saved progress. */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  setChapterCursor((c) => Math.max(1, c - 1))
                                }
                                disabled={cursor <= 1}
                                className="btn text-xs px-3 py-1.5"
                                title={t.chapterNavPrev}
                              >
                                ◀ {t.chapterNavPrev}
                              </button>
                              <div className="flex-1 text-center latin-display italic text-amber-200/70 text-xs tracking-wider">
                                {t.chapterCounter(cursor, maxCursor)}
                                {isFrontier && (
                                  <span className="text-amber-200/55 ml-1">
                                    {t.chapterCurrentBadge}
                                  </span>
                                )}
                                {isPast && (
                                  <span className="text-emerald-300/70 ml-1">
                                    {t.chapterClearedBadge}
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() =>
                                  setChapterCursor((c) =>
                                    Math.min(maxCursor, c + 1),
                                  )
                                }
                                disabled={cursor >= maxCursor}
                                className="btn text-xs px-3 py-1.5"
                                title={t.chapterNavNext}
                              >
                                {t.chapterNavNext} ▶
                              </button>
                            </div>

                            {cursor !== maxCursor && (
                              <div className="flex justify-center">
                                <button
                                  onClick={() => setChapterCursor(maxCursor)}
                                  className="btn text-xs"
                                >
                                  {t.chapterNavLatest}
                                </button>
                              </div>
                            )}

                            {storyProgress === 0 && cursor === 1 && (
                              <p className="jp-display italic text-amber-200/55 text-xs md:text-sm leading-relaxed whitespace-pre-line">
                                {t.storyIntro}
                              </p>
                            )}

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
                                {t.storyChapters[cursor - 1]}
                              </p>
                              <p className="jp-display italic text-amber-200/55 text-xs mt-2">
                                「{opp.quote}」
                              </p>
                            </div>

                            {showEnding && (
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

                            <button
                              onClick={() =>
                                startStoryChapter(cursor, isFrontier)
                              }
                              className={`btn w-full ${isFrontier ? 'btn-active' : ''}`}
                            >
                              {isFrontier
                                ? t.chapterPlayCurrent
                                : t.chapterPlayReplay}
                            </button>

                            <p className="jp-display italic text-amber-200/55 text-[11px] text-center">
                              {t.firstPlayerStoryHint}
                            </p>

                            {storyProgress > 0 && (
                              <div className="flex justify-end">
                                <button
                                  onClick={resetStoryProgress}
                                  className="btn text-xs opacity-70"
                                >
                                  {t.retryStoryFromStart}
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      {aiMode === 'free' && (
                        <>
                          <div className="mb-5">
                            <div className="latin-display italic text-amber-200/70 text-xs tracking-[0.25em] uppercase mb-2">
                              {t.firstPlayerHeading}
                              <span className="ml-2 normal-case tracking-wider text-amber-200/50">
                                — {t.firstPlayerSubtitle}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <button
                                onClick={() => setFirstPlayerPref('random')}
                                className={`btn ${firstPlayerPref === 'random' ? 'btn-active' : ''}`}
                              >
                                {t.firstPlayerRandom}
                              </button>
                              <button
                                onClick={() => setFirstPlayerPref('first')}
                                className={`btn ${firstPlayerPref === 'first' ? 'btn-active' : ''}`}
                              >
                                {t.firstPlayerFirst}
                              </button>
                              <button
                                onClick={() => setFirstPlayerPref('second')}
                                className={`btn ${firstPlayerPref === 'second' ? 'btn-active' : ''}`}
                              >
                                {t.firstPlayerSecond}
                              </button>
                            </div>
                          </div>

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

                {/* Bottom action row — only meaningful for free / two-
                    player setups. In story mode the chapter card already
                    has its own "この章で対局を始める" button (frontier or
                    replay), and a top-right close button covers "just
                    look around". A duplicate "新しい対局" button here was
                    confusing because the chapter cursor isn't a real
                    setting — it's a viewer — so users couldn't tell what
                    cursor + bottom button would do. */}
                {!(gameMode === 'ai' && aiMode === 'story') && (
                  <div className="flex justify-end gap-2 pt-2 border-t border-amber-200/15">
                    <button
                      onClick={() => {
                        reset();
                        setSettingsOpen(false);
                        setScreen('game');
                      }}
                      className="btn btn-active"
                    >
                      {t.startNewGame}
                    </button>
                  </div>
                )}
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

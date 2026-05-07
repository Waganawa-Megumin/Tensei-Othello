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
import { useMediaQuery } from './hooks/useMediaQuery';
import { PrologueOverlay } from './components/PrologueOverlay';
import { NarrativeOverlay } from './components/NarrativeOverlay';
import { ChapterStoryOverlay } from './components/ChapterStoryOverlay';
import { PrologueScreen } from './components/intro/PrologueScreen';
import { FallingScreen } from './components/intro/FallingScreen';
import { ArrivalScreen } from './components/intro/ArrivalScreen';
import { GatewayClosedScreen } from './components/intro/GatewayClosedScreen';
import { GatewayOpenScreen } from './components/intro/GatewayOpenScreen';
import {
  hasSeenOverlay,
  markOverlaySeen,
  getArchiveScenes,
  getOrderedArchiveScenes,
  OVERLAY_ORDER,
  type ArchiveScene,
  resetOverlaysSeen,
  type OverlayKey,
} from './storage/storyOverlays';
import { renderEmphasized } from './i18n/story/render';
import { loadCommentaryEnabled, saveCommentaryEnabled } from './storage/commentary';
import { fetchCharacterCommentary } from './services/commentary';
import type { CommentaryResult } from './prompts/commentary';
import { getPersona } from './data/personas';
import { CommentaryBubble } from './components/CommentaryBubble';
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
import { PaginatedProse } from './components/PaginatedProse';
import { SlotPicker } from './components/SlotPicker';
import { IntroSequence } from './components/intro/IntroSequence';
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
  updateSlot as storageUpdateSaveSlot,
  TOTAL_BONUS_AVATARS,
  type SaveSlot,
} from './storage/saveSlots';
import { logDiag, exportDiagLog, clearDiagLog } from './lib/diagLog';

type Screen = 'title' | 'intro' | 'game';

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
   * Optional base path for the chapter illustration (no extension, no
   * orientation suffix). The `<ChapterArt>` component appends
   * `-landscape.png` or `-portrait.png` based on viewport orientation
   * and falls back silently to no image when the artifact is missing.
   * Pack 3-6 ships these under `public/avatars/chapters/`.
   */
  chapterArtBase?: string;
  /**
   * Hidden / locked-by-default characters. Today this only flags
   * Lv.21 OPP21 (zero-unmasked, the bonus "現世帰還" character that
   * appears post-true-ending). Free-mode level pickers should still
   * render the entry, but with the `???` placeholder treatment until
   * `trueEndingAchieved` flips to true. Story mode never hits these
   * because story progress caps at 20.
   */
  hidden?: boolean;
}

// Default protagonist — always available, used as the player's starting
// avatar. The 20 entries in AVATARS_DATA are bonus characters that
// unlock one at a time, each time the player completes a full
// 20-chapter story run. The order of the array is the unlock order.
// PLR01_haruki ("初代英雄の記憶を持つハルキ") is positioned LAST as a
// special 20th-clear reward — flipping back to the original hero only
// after the player has lived through every other archetype.
const DEFAULT_AVATAR_DATA: AvatarEntry = {
  kanji: '君',
  name: 'あなた',
  name_en: 'You',
  setting: '盤上世界の旅人',
  setting_en: 'Traveler of Bansho Sekai',
  quote: 'いざ、参る',
  quote_en: 'Here I go.',
  image: 'avatars/players/PLR00_default/icon.png',
};

// Wave 3 (2026-05-06): all 20 bonus avatars migrated from a single
// flat 512×512 PNG to the 4/4 folder format mirroring OPP layout —
// `PLRxx_slug/{character.png,background.png,icon.png,spec.md}`. The
// canonical UI image is `icon.png` (1024×1024 RGBA composite).
// Author-approved metadata changes alongside the asset swap:
//   PLR10 ノア:    archetype 未来から来た少女 → アイドル
//   PLR12 エル:    archetype 元魔王、転校生 → 森の精霊
//   PLR13 (rename) PLR13_sumire (スミレ) → PLR13_yreuyu (イレウユ);
//                  archetype 記憶喪失の冒険者 → 記憶喪失の浮遊霊
//   PLR15 (rename) PLR15_hayato (隼人) → PLR15_theend (ジエンド);
//                  archetype 凄腕ガンナー → 凄腕ガンナーカウボーイ
//   PLR16 ひかり:  archetype 光の精霊使い → ジムにいたお姉さん♡
//   PLR17 ヨル:    archetype 半吸血鬼 → 吸血鬼 (純化)
//   PLR20 悠:      archetype 神話の英雄 → 神話の姫
// Quotes refreshed where the old line tied to the old archetype.
// Old 512×512 PNGs preserved at `avatars-old/players/PLRxx_<oldslug>.png`.
const AVATARS_DATA: ReadonlyArray<AvatarEntry> = [
  { kanji: '琴', name: '美琴',     name_en: 'Mikoto',    setting: '魔法学園の天才',        setting_en: 'Magic Academy Prodigy',      quote: '論理と魔法は同じ',       quote_en: 'Logic and magic are one.',           image: 'avatars/players/PLR02_mikoto/icon.png' },
  { kanji: '凛', name: 'リン',     name_en: 'Rin',       setting: 'VRMMOの最強プレイヤー', setting_en: 'VRMMO Top Player',           quote: '現実より、得意なんだ',   quote_en: "I'm better here than in reality.",   image: 'avatars/players/PLR03_rin/icon.png' },
  { kanji: '蓮', name: '蓮',       name_en: 'Ren',       setting: '剣道部主将',            setting_en: 'Kendo Captain',              quote: '正々堂々、参る',         quote_en: 'Fair and square, here I come.',      image: 'avatars/players/PLR04_ren/icon.png' },
  { kanji: '千', name: '千歳',     name_en: 'Chitose',   setting: 'タイムリープ少女',      setting_en: 'Time-Loop Girl',             quote: 'これで何度目だっけ',     quote_en: 'How many times has it been now?',    image: 'avatars/players/PLR05_chitose/icon.png' },
  { kanji: '晴', name: '晴',       name_en: 'Haru',      setting: '現代の陰陽師',          setting_en: 'Modern Onmyoji',             quote: '妖、見えてるんだ',       quote_en: 'I can see the spirits.',             image: 'avatars/players/PLR06_haru/icon.png' },
  { kanji: '海', name: 'カイ',     name_en: 'Kai',       setting: '空の冒険者',            setting_en: 'Sky Adventurer',             quote: '風が呼んでる',           quote_en: 'The wind is calling.',               image: 'avatars/players/PLR07_kai/icon.png' },
  { kanji: '夏', name: '千夏',     name_en: 'Chinatsu',  setting: '聖剣の村娘',            setting_en: 'Holy Sword Village Girl',    quote: '故郷を、必ず守る',       quote_en: "I'll protect my home, no matter what.", image: 'avatars/players/PLR08_chinatsu/icon.png' },
  { kanji: '透', name: '透',       name_en: 'Toru',      setting: '学園名探偵',            setting_en: 'School Detective',           quote: '謎には必ず答えがある',   quote_en: 'Every mystery has an answer.',       image: 'avatars/players/PLR09_toru/icon.png' },
  { kanji: 'ノ', name: 'ノア',     name_en: 'Noa',       setting: 'アイドル',              setting_en: 'Idol Singer',                quote: 'みんな、聴いて♪',        quote_en: 'Listen to me, everyone ♪',           image: 'avatars/players/PLR10_noa/icon.png' },
  { kanji: '凪', name: '凪',       name_en: 'Nagi',      setting: '異世界料理人',          setting_en: 'Otherworld Chef',            quote: '腕の見せどころだ！',     quote_en: 'Time to show off my skills!',        image: 'avatars/players/PLR11_nagi/icon.png' },
  { kanji: 'エ', name: 'エル',     name_en: 'El',        setting: '森の精霊',              setting_en: 'Forest Spirit',              quote: '森が、教えてくれるの',   quote_en: 'The forest will guide me.',          image: 'avatars/players/PLR12_el/icon.png' },
  { kanji: 'イ', name: 'イレウユ', name_en: 'Yre Uyu',   setting: '記憶喪失の浮遊霊',      setting_en: 'Wandering Amnesiac Spirit',  quote: 'ぼくの名前、わすれちゃった……でもオセロは、なぜか覚えてる', quote_en: 'I forgot my name… but I still remember Othello.', image: 'avatars/players/PLR13_yreuyu/icon.png' },
  { kanji: '葉', name: '葉月',     name_en: 'Hazuki',    setting: '機械工学の天才',        setting_en: 'Steampunk Prodigy',          quote: 'これは……まだ未完成。でも、もうすぐ動くわ♡', quote_en: "It's not finished yet. But it'll move soon ♡", image: 'avatars/players/PLR14_hazuki/icon.png' },
  { kanji: 'ジ', name: 'ジエンド', name_en: 'The End',   setting: '凄腕ガンナーカウボーイ', setting_en: 'Master Gunslinger Cowboy',  quote: '最後の弾は、必ず仕留める', quote_en: 'The last bullet always finds its mark.', image: 'avatars/players/PLR15_theend/icon.png' },
  { kanji: '光', name: 'ひかり',   name_en: 'Hikari',    setting: 'ジムにいたお姉さん',    setting_en: 'Gym Onee-san',               quote: 'お疲れさまっ♡',         quote_en: 'Good workout ♡',                     image: 'avatars/players/PLR16_hikari/icon.png' },
  { kanji: '夜', name: 'ヨル',     name_en: 'Yoru',      setting: '吸血鬼',                setting_en: 'Vampire',                    quote: '夜は、永遠に続く',       quote_en: 'The night is eternal.',              image: 'avatars/players/PLR17_yoru/icon.png' },
  { kanji: '湊', name: '湊',       name_en: 'Minato',    setting: '海の冒険者',            setting_en: 'Ocean Wanderer',             quote: '次は、どこに行こうか',   quote_en: 'Where shall we sail next?',          image: 'avatars/players/PLR18_minato/icon.png' },
  { kanji: '奏', name: '奏太',     name_en: 'Souta',     setting: '天才ピアニスト',        setting_en: 'Virtuoso Pianist',           quote: '鍵盤が、ぼくの言葉だ',   quote_en: 'The keys are my words.',             image: 'avatars/players/PLR19_souta/icon.png' },
  { kanji: '悠', name: '悠',       name_en: 'Yu',        setting: '神話の姫',              setting_en: 'Mythical Princess',          quote: '天運は、確かに在る',     quote_en: "Heaven's fortune is real, indeed.",  image: 'avatars/players/PLR20_yu/icon.png' },
  // Special 20th-clear reward — PLR01 Heroic Spirit Haruki
  // (英霊ハルキ). Phase 3 swapped the asset from the legacy
  // single PNG `PLR01_haruki.png` to the v3 folder
  // `PLR01_haruki_heroic/icon.png` (1024×1024 RGBA composite of
  // character + transition-space background). The legacy PNG is
  // preserved at `avatars-old/players/PLR01_haruki.png`. The
  // setting line is updated to reflect the heroic-spirit framing
  // (the future, ascended form of Haruki returning to guide
  // PLR00). This avatar's selection by the player is what gates
  // the bonus Lv.21 OPP21 / Lv.22 OPP22 unlock — see the
  // `trueEndingAchieved` derivation in App body.
  { kanji: '春', name: '英霊ハルキ',   name_en: 'Heroic Spirit Haruki',    setting: '英霊化された旅人', setting_en: 'Ascended Heroic Spirit', quote: '変分は、お前自身が紡ぐもの',     quote_en: 'The variations — you weave them yourself.',                 image: 'avatars/players/PLR01_haruki_heroic/icon.png' },
];

const COMPUTERS_DATA: ReadonlyArray<ComputerEntry> = [
  { kanji: '苺', name: 'いちか',   name_en: 'Ichika',    level: 1,  quote: 'ふぁいとぉ♪ 楽しんで！',       quote_en: 'Fight-o ♪ Have fun!',                       image: 'avatars/opponents/OPP01_ichika/icon.png', chapterArtBase: 'avatars/chapters/chapter_01_ichika' },
  { kanji: '葵', name: '葵',       name_en: 'Aoi',       level: 2,  quote: '狙いはバッチリだよっ！',         quote_en: "Aim's locked in!",                           image: 'avatars/opponents/OPP02_aoi/icon.png', chapterArtBase: 'avatars/chapters/chapter_02_aoi' },
  { kanji: '朝', name: '朝日',     name_en: 'Asahi',     level: 3,  quote: 'いざ尋常に！',                   quote_en: 'Let us duel!',                              image: 'avatars/opponents/OPP03_asahi/icon.png', chapterArtBase: 'avatars/chapters/chapter_03_asahi' },
  { kanji: '撫', name: 'なでしこ', name_en: 'Nadeshiko', level: 4,  quote: '無理せずいきましょう',           quote_en: "Let's not push too hard.",                  image: 'avatars/opponents/OPP04_nadeshiko/icon.png', chapterArtBase: 'avatars/chapters/chapter_04_nadeshiko' },
  { kanji: '響', name: '響',       name_en: 'Hibiki',    level: 5,  quote: '楽しい一局を奏でよう♪',         quote_en: "Let's compose a fun match ♪",                image: 'avatars/opponents/OPP05_hibiki/icon.png', chapterArtBase: 'avatars/chapters/chapter_05_hibiki' },
  { kanji: '紬', name: 'つむぎ',   name_en: 'Tsumugi',   level: 6,  quote: '相棒もわくわくしてる',           quote_en: "My partner's excited too.",                 image: 'avatars/opponents/OPP06_tsumugi/icon.png', chapterArtBase: 'avatars/chapters/chapter_06_tsumugi' },
  { kanji: '茜', name: '茜',       name_en: 'Akane',     level: 7,  quote: '歯車みたいにかっちりね！',       quote_en: 'Tight as gears!',                           image: 'avatars/opponents/OPP07_akane/icon.png', chapterArtBase: 'avatars/chapters/chapter_07_akane' },
  { kanji: '薬', name: 'メル',     name_en: 'Mel',       level: 8,  quote: 'ふふ、ちょっと混ぜてみよっか？', quote_en: 'Heh, shall we mix things up?',              image: 'avatars/opponents/OPP08_mel/icon.png', chapterArtBase: 'avatars/chapters/chapter_08_mel' },
  { kanji: '悟', name: '悟',       name_en: 'Satoru',    level: 9,  quote: '無心に石を置く、ただそれだけ',   quote_en: 'Place the stone without thought. That alone.', image: 'avatars/opponents/OPP09_satoru/icon.png', chapterArtBase: 'avatars/chapters/chapter_09_satoru' },
  { kanji: '黒', name: 'シキ',     name_en: 'Shiki',     level: 10, quote: '気付いた時には遅いよ',           quote_en: "By the time you notice, it's too late.",    image: 'avatars/opponents/OPP10_shiki/icon.png', chapterArtBase: 'avatars/chapters/chapter_10_shiki' },
  { kanji: '詩', name: 'シオン',   name_en: 'Shion',     level: 11, quote: 'すべては予測の内だ',             quote_en: 'All is within my predictions.',             image: 'avatars/opponents/OPP11_shion/icon.png', chapterArtBase: 'avatars/chapters/chapter_11_shion' },
  { kanji: '夢', name: 'ルナ',     name_en: 'Luna',      level: 12, quote: '夢の中でもう勝ってるよ♡',       quote_en: "I've already won in my dream ♡",            image: 'avatars/opponents/OPP12_luna/icon.png', chapterArtBase: 'avatars/chapters/chapter_12_luna' },
  { kanji: '雪', name: '雪乃',     name_en: 'Yukino',    level: 13, quote: 'この程度、解析するまでもない',   quote_en: 'Not even worth analyzing.',                 image: 'avatars/opponents/OPP13_yukino/icon.png', chapterArtBase: 'avatars/chapters/chapter_13_yukino' },
  { kanji: '暁', name: 'アキラ',   name_en: 'Akira',     level: 14, quote: '君の手筋、見えているよ',         quote_en: 'I can see your moves.',                     image: 'avatars/opponents/OPP14_akira/icon.png', chapterArtBase: 'avatars/chapters/chapter_14_akira' },
  { kanji: '銀', name: 'シエル',   name_en: 'Ciel',      level: 15, quote: '全データ把握、戦況優位',         quote_en: 'All data acquired. Position favorable.',    image: 'avatars/opponents/OPP15_ciel/icon.png', chapterArtBase: 'avatars/chapters/chapter_15_ciel' },
  { kanji: '姫', name: 'アリア',   name_en: 'Aria',      level: 16, quote: 'お手柔らかに、ですわ',           quote_en: 'Be gentle with me.',                        image: 'avatars/opponents/OPP16_aria/icon.png', chapterArtBase: 'avatars/chapters/chapter_16_aria' },
  { kanji: '獅', name: 'レオン',   name_en: 'Leon',      level: 17, quote: '正々堂々、参る！',               quote_en: 'Fair and square, here I come!',             image: 'avatars/opponents/OPP17_leon/icon.png', chapterArtBase: 'avatars/chapters/chapter_17_leon' },
  { kanji: '宗', name: '宗次郎',   name_en: 'Sojiro',    level: 18, quote: '我が一刀、避けられはせぬ',       quote_en: 'My blade cannot be evaded.',                image: 'avatars/opponents/OPP18_sojiro/icon.png', chapterArtBase: 'avatars/chapters/chapter_18_sojiro' },
  { kanji: '嵐', name: '嵐',       name_en: 'Arashi',    level: 19, quote: '我が竜の前に膝を折れ！',         quote_en: 'Kneel before my dragon!',                   image: 'avatars/opponents/OPP19_arashi/icon.png', chapterArtBase: 'avatars/chapters/chapter_19_arashi' },
  // Lv.20 ゼロ (フード姿) — the canonical final-boss avatar. `image`
  // points at the hooded variant ship-shipped by Phase 2 final;
  // `aiAvatarImage` derivation below temporarily swaps in OPP21
  // (unmasked) for the post-victory dialogue moment so the hood falls
  // off as a reveal beat.
  { kanji: '零', name: 'ゼロ',     name_en: 'Zero',      level: 20, quote: '全ての変分は計算済み。詰みだ',   quote_en: 'All variations computed. Checkmate.',       image: 'avatars/opponents/OPP20_zero/icon.png', chapterArtBase: 'avatars/chapters/chapter_20_zero' },
  // Lv.21 ゼロ (現世帰還・隠しキャラ) — bonus character unlocked
  // when PLR01 英霊ハルキ clears chapter 20 (the "true ending" path).
  // Until then, free-mode pickers render the row with a `???`
  // overlay (CSS .avatar-locked) and selection is disabled. Story
  // mode caps storyProgress at 20 so this entry never auto-fires.
  // `chapterArtBase` is intentionally omitted — there's no chapter-21
  // illustration; this character only appears in free-mode picks +
  // the post-true-ending reveal.
  { kanji: '零', name: 'ゼロ (現世帰還)', name_en: 'Zero (Returned)', level: 21, quote: '変分は閉じない。それが、面白い。予想の外へ飛び出したくなった。', quote_en: "Variations don't close. That's the beauty of it. I want to step beyond the forecast.", image: 'avatars/opponents/OPP21_zero_unmasked/icon.png', hidden: true },
  // Lv.22 ヴォイドφ (Void-φ) — 神格化されし秩序. Sister "hidden
  // hidden" boss unlocked alongside OPP21 the moment PLR01 英霊
  // ハルキ clears chapter 20 (true ending). Phase 4 Step 1 shipped
  // dedicated assets at `OPP22_voidphi/{character,background,icon}.png`
  // + `spec.md` v3 (silver-haired divine figure with golden Fibonacci
  // spiral, deep-cosmic backdrop), so the image path now points at the
  // proper folder. Earlier the entry borrowed OPP21's icon as a UI
  // stand-in; the matching `kanji === 'φ'` CSS tint stopgap in
  // AvatarBadge has been removed in lockstep.
  { kanji: 'φ', name: 'ヴォイドφ', name_en: 'Void-φ', level: 22, quote: 'すべては φ の波動の狭間にある', quote_en: 'All exists between the waves of φ.', image: 'avatars/opponents/OPP22_voidphi/icon.png', hidden: true },
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
      className={`flex flex-col items-center justify-center gap-1 py-3 max-lg:landscape:py-1.5 transition-colors ${
        active ? 'bg-amber-200/15 text-amber-100' : 'bg-zinc-950/80 text-amber-100/85'
      } ${disabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-zinc-900 hover:text-amber-100'}`}
      aria-label={label}
      title={label}
    >
      <Icon size={20} strokeWidth={1.4} />
      <span className="jp-display text-[10px] tracking-wider max-lg:landscape:hidden">{label}</span>
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
 * Coin-toss overlay shown at the start of a match whose first/second
 * assignment was randomized (story mode every chapter, free mode when
 * the player chose "ランダム"). Spins a black/white disc on the Y-axis
 * for ~1s, then settles on the chosen color and reveals
 * "あなた：先攻 (黒)" / "あなた：後攻 (白)" before auto-dismissing.
 *
 * The 3D-CSS coin is intentionally simple — we keep it functional and
 * readable even on devices where richer SVG ornamentation might fall
 * back oddly. A nicer hand-painted coin asset is queued in
 * docs/ui_motion_assets.md (依頼 #7) and will swap into the .coin-face
 * background-image when delivered.
 *
 * Two visual styles are available, switched by the `style` prop and
 * surfaced as a setting:
 *   - '2d':      the original 2-tone CSS disc (default)
 *   - 'fantasy': image-driven flip using the user-supplied PNGs in
 *                /assets/othello/turn-coin/ — silver-rimmed engraved
 *                coins with a soft magic ring under them
 */
export type CoinStyle = '2d' | 'fantasy';

const COIN_STYLE_KEY = 'othello:coin_style';

function loadCoinStyle(): CoinStyle {
  try {
    const v = window.localStorage.getItem(COIN_STYLE_KEY);
    if (v === '2d' || v === 'fantasy') return v;
  } catch {
    /* ignore */
  }
  return '2d';
}

function saveCoinStyle(style: CoinStyle): void {
  try {
    window.localStorage.setItem(COIN_STYLE_KEY, style);
  } catch {
    /* ignore */
  }
}

interface FirstPlayerRollProps {
  active: boolean;
  result: Color | null;
  playerName: string;
  onComplete: () => void;
  t: Messages;
  /** Visual style. Default is the existing 2D disc. */
  style?: CoinStyle;
}

function FirstPlayerRoll(props: FirstPlayerRollProps) {
  if (props.style === 'fantasy') return <FantasyCoinRoll {...props} />;
  return <TwoDCoinRoll {...props} />;
}

function TwoDCoinRoll({ active, result, playerName, onComplete, t }: FirstPlayerRollProps) {
  // Two state machines: which face is currently visible (B/W flips
  // back-and-forth during the toss), and whether the reveal text is
  // shown. Both are driven by setTimeouts because every prior
  // attempt at CSS-only 3D coin flips suffered from browser-side
  // var() / backface-visibility quirks. Pure JS state + simple flat
  // background colour swapping is the only approach that reliably
  // shows the right colour at the end on every device.
  //
  // Timing schedule (total 3.5s):
  //   0–1800ms : ~10 face flips, accelerating-then-decelerating
  //   1800ms   : lock onto the result face
  //   2000ms   : reveal text fades in
  //   3500ms   : dismiss
  type Face = 'B' | 'W';
  const [phase, setPhase] = useState<'spin' | 'reveal'>('spin');
  const [face, setFace] = useState<Face>('B');
  useEffect(() => {
    if (!active || result === null) return;
    let cancelled = false;
    setPhase('spin');
    setFace('B');
    const timers: number[] = [];
    // Cumulative timestamps for each flip. Fewer than the previous
    // pass (7 instead of 11) and spread further apart so the
    // 280ms cross-fade transition has time to dominate — the eye
    // perceives a continuous warm oscillation instead of high-
    // contrast strobing. Final flip at 2000ms locks onto the
    // actual result.
    const flipMoments = [240, 480, 740, 1020, 1320, 1640, 2000];
    flipMoments.forEach((ms, i) => {
      // First flip lands on white (result === BLACK or not), then
      // toggles every step. The penultimate one is the opposite of
      // the result so the final lock-in feels like a settle.
      const isLast = i === flipMoments.length - 1;
      const targetFace: Face = isLast
        ? (result === BLACK ? 'B' : 'W')
        : (i % 2 === 0 ? 'W' : 'B');
      timers.push(
        window.setTimeout(() => {
          if (!cancelled) setFace(targetFace);
        }, ms),
      );
    });
    timers.push(
      window.setTimeout(() => {
        if (!cancelled) setPhase('reveal');
      }, 2200),
    );
    timers.push(window.setTimeout(onComplete, 3700));
    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [active, result, onComplete]);
  if (!active || result === null) return null;
  const isFirst = result === BLACK;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-sm first-player-roll">
      <div className="text-center px-6">
        <div className="latin-display italic ornament text-sm md:text-base uppercase mb-3 text-amber-100/90 tracking-[0.2em]">
          — {t.firstPlayerRollLabel} —
        </div>
        <div className={`coin-2d coin-2d-${face === 'B' ? 'b' : 'w'} mx-auto mb-5`}>
          <span className="coin-2d-pip" />
        </div>
        <div
          className={`jp-display tracking-[0.18em] text-2xl md:text-3xl font-bold transition-opacity duration-500 ${
            phase === 'reveal' ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ color: isFirst ? '#fff5d6' : '#f5ebd0' }}
        >
          {isFirst
            ? t.firstPlayerRollFirst(playerName)
            : t.firstPlayerRollSecond(playerName)}
        </div>
        <p
          className={`jp-display italic text-amber-100/90 text-sm md:text-base mt-3 transition-opacity duration-500 ${
            phase === 'reveal' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {isFirst ? t.firstPlayerRollFirstHint : t.firstPlayerRollSecondHint}
        </p>
      </div>
    </div>
  );
}

/**
 * Fantasy variant of the coin toss: silver-rimmed engraved coins
 * image-swapped through a black-→edge-→white tumble. The earlier draft
 * placed a violet magic-ring under the coin; user feedback was that
 * the under-glow was distracting, so we now show only the coin —
 * floating on the dimmed page-blur backdrop.
 *
 * Schedule (total 3.7s, matches the 2D variant so callers don't need
 * to special-case timing): 9 frames over 1.8s with light easing, then
 * lock onto the chosen front face, then 1.5s reveal hold.
 *
 * Frames are taken from the v2 turn-coin pack
 * (public/assets/othello/turn-coin/{black,white,common}/...). The
 * sequence walks through one direction of the manifest's recommended
 * loop — front-→tilt-→edge-→tilt-→front — so the eye reads it as a
 * single coin rotating, not a flicker between two coins.
 */
const FANTASY_ASSET_BASE = `${import.meta.env.BASE_URL}assets/othello/turn-coin/`;

// Spinning sequence: black face fading through the edge to white.
// We branch by result for the *last* slot so the toss is always
// settling toward the announced side rather than reversing direction.
const FANTASY_SPIN_TO_WHITE = [
  'black/black_00_front.png',
  'black/black_01_tilt_soft.png',
  'black/black_02_tilt_mid.png',
  'black/black_04_edge_vertical.png',
  'common/coin_edge_horizontal.png',
  'white/white_00_edge_vertical.png',
  'white/white_06_tilt_mid_b.png',
  'white/white_05_tilt_soft_b.png',
  'white/white_02_front_a.png',
];

const FANTASY_SPIN_TO_BLACK = [
  'white/white_02_front_a.png',
  'white/white_05_tilt_soft_b.png',
  'white/white_06_tilt_mid_b.png',
  'white/white_00_edge_vertical.png',
  'common/coin_edge_horizontal.png',
  'black/black_04_edge_vertical.png',
  'black/black_02_tilt_mid.png',
  'black/black_01_tilt_soft.png',
  'black/black_00_front.png',
];

function FantasyCoinRoll({ active, result, playerName, onComplete, t }: FirstPlayerRollProps) {
  const [phase, setPhase] = useState<'spin' | 'reveal'>('spin');
  const [frameIdx, setFrameIdx] = useState(0);

  useEffect(() => {
    if (!active || result === null) return;
    let cancelled = false;
    setPhase('spin');
    setFrameIdx(0);
    const timers: number[] = [];
    // Frame swap moments — accelerate then decelerate to mimic an
    // actual flipping coin. Total spin time is ~1.8s.
    const swapMoments = [120, 280, 460, 660, 880, 1140, 1440, 1800];
    swapMoments.forEach((ms, i) => {
      timers.push(
        window.setTimeout(() => {
          if (!cancelled) setFrameIdx(i + 1);
        }, ms),
      );
    });
    timers.push(
      window.setTimeout(() => {
        if (!cancelled) setPhase('reveal');
      }, 2000),
    );
    timers.push(window.setTimeout(onComplete, 3700));
    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [active, result, onComplete]);

  if (!active || result === null) return null;
  const isFirst = result === BLACK;
  const sequence = isFirst ? FANTASY_SPIN_TO_BLACK : FANTASY_SPIN_TO_WHITE;
  const spinningFrame = sequence[Math.min(frameIdx, sequence.length - 1)];
  const settledFrame = isFirst ? 'black/black_00_front.png' : 'white/white_02_front_a.png';
  const frame = phase === 'reveal' ? settledFrame : spinningFrame;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-sm first-player-roll">
      <div className="text-center px-6">
        <div className="latin-display italic ornament text-sm md:text-base uppercase mb-3 text-amber-100/90 tracking-[0.2em]">
          — {t.firstPlayerRollLabel} —
        </div>
        <div className="fantasy-coin-stage mx-auto mb-5">
          <img
            src={`${FANTASY_ASSET_BASE}${frame}`}
            alt=""
            className={`fantasy-coin-face ${phase}`}
            draggable={false}
          />
        </div>
        <div
          className={`jp-display tracking-[0.18em] text-2xl md:text-3xl font-bold transition-opacity duration-500 ${
            phase === 'reveal' ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ color: isFirst ? '#fff5d6' : '#f5ebd0' }}
        >
          {isFirst
            ? t.firstPlayerRollFirst(playerName)
            : t.firstPlayerRollSecond(playerName)}
        </div>
        <p
          className={`jp-display italic text-amber-100/90 text-sm md:text-base mt-3 transition-opacity duration-500 ${
            phase === 'reveal' ? 'opacity-100' : 'opacity-0'
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
  const stoneStyle =
    color === BLACK
      ? {
          background:
            'radial-gradient(circle at 30% 30%, #5a5a5a, #1a1a1a 55%, #000)',
          boxShadow:
            'inset -1px -1px 2px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.4)',
        }
      : {
          background:
            'radial-gradient(circle at 30% 30%, #ffffff, #ebe2cc 55%, #c5b89c)',
          boxShadow:
            'inset 1px 1px 2px rgba(255,255,255,0.6), 0 1px 2px rgba(0,0,0,0.4)',
        };
  return (
    <div
      className={`relative border rounded-sm transition-all max-lg:landscape:border-0 max-lg:landscape:rounded-none ${
        isActive
          ? 'border-amber-200/60 bg-amber-200/[0.04] player-panel-active max-lg:landscape:bg-transparent max-lg:landscape:[animation:none]'
          : 'border-amber-200/15'
      } ${
        compact
          ? 'px-4 md:px-5 py-1.5 md:py-2'
          : 'px-4 md:px-5 py-3 md:py-3.5 max-lg:landscape:px-1 max-lg:landscape:py-2'
      }`}
    >
      {/* ──────────────────────────────────────────────────────────
          Landscape-phone vertical layout. Each panel is a tall,
          narrow strip that matches the board's height (the parent
          grid uses items-stretch in landscape). Content is spread
          top → middle → bottom so the strip *uses* its height
          rather than centering and leaving space empty.
          ────────────────────────────────────────────────────────── */}
      <div className="hidden max-lg:landscape:flex flex-col items-center text-center gap-2 h-full justify-between py-2">
        {/* Avatar is the focal point — go large in landscape phones,
            and when this side has the turn we ring the circle in gold
            (the panel itself has no border in landscape, so the ring
            is the active indicator). The wrapper is inline-flex so it
            shrinks to the avatar's circle — otherwise box-shadow would
            paint a wide rectangle around the column. */}
        <div className={`inline-flex ${isActive ? 'avatar-active-ring' : ''}`}>
          <AvatarBadge kanji={kanji} idx={idx} image={image} size="lg" selected={isActive} />
        </div>
        <div className="flex flex-col items-center gap-1.5 min-w-0 max-w-full">
          <span className="jp-display text-amber-100 text-lg font-medium truncate max-w-full inline-flex items-center gap-1.5">
            {name}
            {thinking && <SumiThinking />}
          </span>
          {(level !== undefined || lives !== undefined) && (
            <div className="flex items-baseline gap-2">
              {level !== undefined && (
                <span className="latin-display italic text-amber-200/85 text-xs tracking-wider">
                  Lv.{level}
                </span>
              )}
              {lives !== undefined && (
                <span
                  className={`latin-display tabular-nums text-xs tracking-wider ${
                    lives === 0 ? 'text-red-300' : 'text-amber-100/95'
                  }`}
                  title={`Lives: ${lives}`}
                  aria-label={`Lives: ${lives}`}
                >
                  ♥ {lives}
                </span>
              )}
            </div>
          )}
          {quote && !compact && (
            <span className="jp-display text-amber-100/85 text-xs italic truncate max-w-full block">
              「{quote}」
            </span>
          )}
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-5 h-5 rounded-full" style={stoneStyle} />
          <div className="latin-display text-4xl text-amber-100 tabular-nums font-medium leading-none">
            {count}
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          Default horizontal layout (portrait phone + desktop).
          ────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 md:gap-4 max-lg:landscape:hidden">
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
          <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full" style={stoneStyle} />
          <div className="latin-display text-3xl md:text-4xl text-amber-100 tabular-nums font-medium leading-none">
            {count}
          </div>
        </div>
      </div>
      {isActive && (
        <div className="absolute -bottom-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-amber-200/70 to-transparent max-lg:landscape:hidden" />
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
/** Small ending-finale illustration shown inside the GameOver modal
 *  when the player clears chapter 20. Mirrors ChapterArt's LS/PT
 *  picking + onError fallback. */
function EndingArt() {
  const [ok, setOk] = useState(true);
  const isLandscape = useMediaQuery('(orientation: landscape)');
  if (!ok) return null;
  const src = `${import.meta.env.BASE_URL}illustrations/ending-${
    isLandscape ? 'landscape' : 'portrait'
  }.png`;
  const aspect = isLandscape ? 'aspect-[16/9]' : 'aspect-[9/16]';
  return (
    <img
      src={src}
      alt=""
      aria-hidden
      loading="lazy"
      onError={() => setOk(false)}
      className={`w-full ${aspect} object-cover rounded-sm border border-amber-300/40 mb-4`}
    />
  );
}

function ChapterArt({ srcBase, alt }: { srcBase?: string; alt: string }) {
  const [ok, setOk] = useState(true);
  const isLandscape = useMediaQuery('(orientation: landscape)');
  if (!srcBase || !ok) return null;
  // Pack 3-6 ships chapter images as `<base>-landscape.png` and
  // `<base>-portrait.png`. Pick whichever matches the viewport so the
  // composition reads correctly on phones held either way.
  const src = `${srcBase}-${isLandscape ? 'landscape' : 'portrait'}.png`;
  const aspect = isLandscape ? 'aspect-[16/9]' : 'aspect-[9/16]';
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setOk(false)}
      className={`w-full ${aspect} object-cover rounded-sm border border-amber-200/15 mb-3`}
    />
  );
}

interface LevelSelectorProps {
  level: number;
  setLevel: (n: number) => void;
  t: Messages;
  /** When provided, renders a "↺ 標準に戻す" mini-button next to the
   *  level read-out whenever `level !== defaultLevel`. This is how the
   *  free-mode setup signals "you've moved off the character's natural
   *  difficulty — tap to snap back". */
  defaultLevel?: number;
}

function LevelSelector({ level, setLevel, t, defaultLevel }: LevelSelectorProps) {
  const isOverridden = defaultLevel !== undefined && level !== defaultLevel;
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2 gap-2 flex-wrap">
        <div className="latin-display italic text-amber-200/70 tracking-[0.25em] text-xs uppercase">
          {t.matchLevelLabel}
        </div>
        <div className="flex items-baseline gap-3">
          {isOverridden && (
            <button
              onClick={() => setLevel(defaultLevel!)}
              className="latin-display italic text-[10px] tracking-wider text-amber-200/75 hover:text-amber-100 border border-amber-200/30 hover:border-amber-200/60 rounded-sm px-2 py-1 transition-colors"
              title={`${t.matchLevelResetToDefault} (Lv.${defaultLevel})`}
            >
              ↺ {t.matchLevelResetToDefault}
            </button>
          )}
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
  /** Bumped after an AI worker timeout so the AI useEffect re-fires
   *  with a fresh worker and retries the request. */
  const [aiRetryNonce, setAiRetryNonce] = useState(0);
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

  // Coin-toss visual style. Default is the simple 2D disc; users can
  // opt into the image-based fantasy variant from Settings. Persisted
  // to localStorage so the choice survives reloads.
  const [coinStyle, setCoinStyleState] = useState<CoinStyle>(loadCoinStyle);
  const setCoinStyle = useCallback((style: CoinStyle) => {
    setCoinStyleState(style);
    saveCoinStyle(style);
  }, []);

  // Opt-in LLM character commentary. Each match makes a few dozen
  // Anthropic API calls when ON, so this defaults OFF and is only
  // changed via the Settings panel.
  const [commentaryEnabled, setCommentaryEnabledState] = useState<boolean>(
    loadCommentaryEnabled,
  );
  const setCommentaryEnabled = useCallback((enabled: boolean) => {
    setCommentaryEnabledState(enabled);
    saveCommentaryEnabled(enabled);
  }, []);
  // The currently-displayed bubble. `key` increments on every new
  // commentary so the CSS animation restarts even when the same string
  // would be assigned twice in a row.
  const [commentary, setCommentary] = useState<
    (CommentaryResult & { key: number }) | null
  >(null);
  const commentaryKeyRef = useRef(0);
  // Tracks the last move index we've already commentary-fetched, so a
  // re-render of the AI effect doesn't double-fire on the same move.
  const lastCommentaryMoveRef = useRef(-1);

  // Settings state
  const [gameMode, setGameMode] = useState<GameMode>('ai');
  // Both default to index 0 (the always-available default avatar).
  // AVATARS[1..unlockedCount] are bonus characters unlocked one at a
  // time as the player completes 20-chapter story runs. AVATARS[20]
  // (Haruki, "the bearer of the first hero's memory") is the special
  // 20th-clear reward.
  const [p1Avatar, setP1Avatar] = useState(0);
  const [p2Avatar, setP2Avatar] = useState(0);
  /**
   * How many bonus avatars are currently unlocked (0..20). Persisted
   * via getCharacterUnlocks/setCharacterUnlocks. The default avatar is
   * always available regardless of this value.
   */
  const [unlockedCount, setUnlockedCount] = useState(0);
  /**
   * Sticky flag: `true` once the player has cleared chapter 20 while
   * playing as PLR01 英霊ハルキ (= the "true ending" path). Drives
   * the bonus Lv.21 OPP21 unlock — until this is true, the OPP21 row
   * in free-mode pickers shows the `???` placeholder. Persisted via
   * `getTrueEndingAchieved` / `setTrueEndingAchieved`.
   */
  const [trueEndingAchieved, setTrueEndingAchievedState] = useState(false);
  /**
   * Phase 4 Step 3 — Void-φ awakening flag. Flips `true` after the
   * player dismisses the chapter 20-D cinematic (the chain that
   * follows 20-C the first time the true ending plays). The OPP22
   * selection gate uses this *instead of* `trueEndingAchieved` so
   * 20-D acts as the true unlock event for Lv.22, while OPP21
   * keeps its original `trueEndingAchieved` gate. Persisted via
   * `getVoidphiAwakened` / `setVoidphiAwakened`.
   */
  const [voidphiAwakened, setVoidphiAwakenedState] = useState(false);
  /**
   * When non-null, the GameOver modal renders a "新キャラクター解放"
   * banner with the avatar's name. Set the moment storyProgress
   * transitions from 19 → 20 in the result-recording effect; cleared
   * by reset() and on title-screen entry.
   */
  const [unlockedThisRun, setUnlockedThisRun] = useState<number | null>(null);
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
  /** Set when the player entered loaded-kifu replay via the
   *  GameOver modal's "対戦棋譜を読み込む" button. The replay strip's
   *  × close branches on this so it returns to the GameOver modal
   *  (preserving the result + score panel) instead of starting a
   *  fresh match like every other exit path. Cleared on reset(). */
  const [cameFromGameOver, setCameFromGameOver] = useState(false);
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
  /** Toggle to hide the GameOver / Game Over Screen modal so the player
   *  can re-read the final board position without dismissing the
   *  match. Cleared on every fresh game (kifu emptied + gameOver=false).
   *  Without this, the only way out of the modal was a destructive
   *  button (reset / title / retry) — losing the "let me look at the
   *  board for a moment" exit. */
  const [gameOverDismissed, setGameOverDismissed] = useState(false);
  /** Synchronous mirror of `resultRecorded`. The state-only gate had
   *  a runtime failure mode where the gameOver effect re-fired
   *  hundreds of times in a single second (diag log v0.33.7 captured
   *  200 consecutive `gameOver` events at ~5ms cadence) — the
   *  setResultRecorded(true) update wasn't blocking the next effect
   *  re-entry quickly enough, presumably because
   *  `recordSlotResult().then(setSlots)` keeps churning `activeSlot`
   *  (an effect dep) and some batching/closure edge case meant the
   *  state read came back stale. The ref write commits synchronously
   *  inside the effect body, so the gate is bulletproof regardless
   *  of how React schedules the surrounding state updates. */
  const resultRecordedRef = useRef(false);
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
  /** Chapter (1-indexed = opponent level) the IntroSequence is
   *  currently building toward. Set just before flipping to the
   *  'intro' screen and consumed by the on-start callback to hand
   *  the right chapter to `reset()` + the storyProgress sync. */
  const [introChapter, setIntroChapter] = useState(1);
  // Story overlay (prologue / narrative inserts / ending). Active key is
  // the OverlayKey we're currently displaying; null when none.
  const [storyOverlay, setStoryOverlay] = useState<OverlayKey | null>(null);
  /** Re-watch a previously-seen story scene from the title-screen
   *  archive. Holds an ORDERED list of scenes (chapters + overlays)
   *  so the player can chain "次のシーンへ →" through them
   *  seamlessly. Distinct from `storyOverlay` because dismiss must
   *  NOT call `reset()` — there's no chapter advance to chain into.
   *  Tap any single entry → opens with `{scenes: [that one], index:0}`.
   *  Tap "▶ 連続再生" → opens with `{scenes: full chronological list,
   *  index: 0}`. The dismiss handler advances index, or sets review
   *  to null at the final scene. */
  const [review, setReview] = useState<{
    scenes: ArchiveScene[];
    index: number;
  } | null>(null);
  /** Title-screen "scene archive" modal toggle. */
  const [archiveOpen, setArchiveOpen] = useState(false);
  /** Spell-cast modal — types-the-magic-words → unlock-all path.
   *  v0.36.11: spell can carry a 2-digit suffix (01..21) so the
   *  developer can warp a save slot to that chapter; bare spell
   *  caps the slot to all-cleared + true-ending + every overlay
   *  marked seen so the archive is fully populated. */
  const [spellOpen, setSpellOpen] = useState(false);
  const [spellInput, setSpellInput] = useState('');
  const [spellResult, setSpellResult] = useState<'success' | 'failure' | null>(
    null,
  );
  /** Transient "log copied" toast shown next to the diagnostic export
   *  button so the user knows clipboard write succeeded. Auto-clears
   *  after 2.5s. */
  const [diagLogToast, setDiagLogToast] = useState<string | null>(null);

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
  // v0.36.13: NO global → per-slot migration. The user's stated
  // philosophy is "全アンロックはカンストしてできること" — full
  // unlocks must be EARNED on each slot independently. Migrating
  // legacy globals into the previously-active slot (v0.36.12)
  // violated that: a slot the user perceived as fresh was silently
  // showing every avatar unlocked. We just wipe the legacy global
  // keys on first run so they don't haunt later sessions, and
  // every slot starts from `defaultSlot()` defaults
  // (unlockedCount=0 / trueEnding=false / voidphi=false). Testers
  // who need a maxed state can warp via the spell modal.
  useEffect(() => {
    let cancelled = false;
    const LEGACY_WIPE_KEY = 'othello:legacy_unlocks_wiped';
    Promise.all([getSlots(), getActiveSlotId()]).then(([loaded, id]) => {
      if (cancelled) return;
      setSlots(loaded);
      setActiveSlotIdState(id);
      try {
        if (window.localStorage.getItem(LEGACY_WIPE_KEY) !== '1') {
          window.localStorage.removeItem('othello:character_unlocks');
          window.localStorage.removeItem('othello:true_ending_achieved');
          window.localStorage.removeItem('othello:voidphi_awakened');
          window.localStorage.removeItem('othello:voidphi_intro_seen');
          window.localStorage.setItem(LEGACY_WIPE_KEY, '1');
          logDiag('legacy_global_unlocks.wiped');
        }
      } catch {
        /* private mode */
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Active-slot → in-memory state sync. Whenever the active slot
  // changes (either selectSlot or a per-slot patch via
  // storageUpdateSaveSlot+setSlots) refresh the unlock / story-flag
  // state from that slot. This is what makes save slots truly
  // independent: `unlockedCount` etc. are derived from the active
  // slot only, not from any global localStorage key. The player
  // avatar (p1Avatar) is *clamped* to the slot's unlock range
  // rather than forced to the latest unlock — so an explicit
  // selection (settings panel, magic-spell PPCC) survives the
  // sync, while a stale PLR01 carried over from a previous slot
  // gets pulled back to a valid index.
  useEffect(() => {
    if (!activeSlot) {
      setUnlockedCount(0);
      setTrueEndingAchievedState(false);
      setVoidphiAwakenedState(false);
      setP1Avatar(0);
      return;
    }
    const u = activeSlot.unlockedCount ?? 0;
    setUnlockedCount(u);
    setTrueEndingAchievedState(activeSlot.trueEndingAchieved ?? false);
    setVoidphiAwakenedState(activeSlot.voidphiAwakened ?? false);
    setP1Avatar((current) => {
      // PLR01 lives at index 20 (last slot in AVATARS); other
      // bonus avatars at indices 1..19 require unlocks ≥ index.
      if (current > u) return Math.min(u, AVATARS.length - 1);
      return current;
    });
  }, [
    activeSlot?.id,
    activeSlot?.unlockedCount,
    activeSlot?.trueEndingAchieved,
    activeSlot?.voidphiAwakened,
  ]);

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

  // (The legacy in-game `<PrologueOverlay>` auto-trigger was removed
  //  in v0.32: the new multi-step `<IntroSequence>` runs BEFORE the
  //  game screen and includes the prologue as Step 1. The overlay
  //  component itself still ships for the title-screen scene archive
  //  ("re-watch any scene I've already passed"), but it no longer
  //  fires automatically inside the match flow.)

  // (Browser back / edge-flick navigation is wired further down in
  //  this file — the older `layerDepthRef` + popstate listener at
  //  ~line 2094 handles modal close + screen back as a single
  //  coherent stack. v0.32.5 introduced a parallel `appScreen`-
  //  state-based listener here; in v0.32.9 it was removed because
  //  it was double-popping the history entry the layer-depth
  //  effect already pushed and double-firing on every back press,
  //  which left the React tree in an inconsistent state at
  //  endgame and produced the "all toolbar buttons unresponsive"
  //  freeze. The single-source-of-truth handler below now also
  //  treats `intro` as a poppable layer so the original use case
  //  (flick-back from intro → title) keeps working.)


  // Auto-pass — passInfo intentionally NOT in deps: including it would
  // trigger the cleanup function on every state change and clear our own
  // pending timeout, leaving the game stuck on the pass message.
  useEffect(() => {
    if (gameOver || passInfo !== null) return;
    if (noCurrent && !noOpp) {
      logDiag('pass.start', { color: currentColor });
      setPassInfo(currentColor);
      const t = window.setTimeout(() => {
        logDiag('pass.end', { color: currentColor });
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
    logDiag('ai.dispatch', { level, color: opponent(playerColor), aiRetryNonce });
    const delay = 450 + Math.min(level * 35, 700);
    let cancelled = false;
    let timedOut = false;
    const aiColor = opponent(playerColor);
    const timer = window.setTimeout(() => {
      ai
        .requestMove(board, aiColor, level)
        .then((move) => {
          if (cancelled || !move) return;
          logDiag('ai.resolve', { row: move.row, col: move.col });
          doMoveRef.current(move.row, move.col);
        })
        .catch((err: unknown) => {
          // Distinguish hook-level worker timeouts (silent worker death)
          // from a normal cancellation. On timeout we bump the retry
          // nonce so this effect re-fires against the fresh worker the
          // hook just respawned, instead of leaving the human stuck on
          // their next turn waiting for a move that will never come.
          const message = err instanceof Error ? err.message : '';
          logDiag('ai.reject', { message });
          if (message === 'AI worker timeout') {
            timedOut = true;
          }
        })
        .finally(() => {
          if (!cancelled) setAiThinking(false);
          if (!cancelled && timedOut) {
            setAiRetryNonce((n) => n + 1);
          }
        });
    }, delay);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      ai.cancel();
      setAiThinking(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentColor, gameMode, board, level, gameOver, noCurrent, passInfo, playerColor, firstPlayerRoll, aiRetryNonce]);

  // Fire-and-forget LLM character commentary after the AI side's
  // moves. Strictly opt-in (commentaryEnabled), AI-mode only, and
  // gated by some skip rules to keep cost predictable:
  //  - skip the first 6 moves (opening is generic, nothing to react to)
  //  - skip pass-driven side switches (no actual move was placed)
  //  - skip on game-over (post-game review handles the close-out)
  //  - skip while reviewing a saved kifu (no live opponent thinking)
  // Failures are silent (`null` from the service) so commentary outage
  // never affects the actual match.
  useEffect(() => {
    if (!commentaryEnabled) return;
    if (gameMode !== 'ai') return;
    if (gameOver || loadedKifuView) return;
    if (kifu.length <= 6) return;
    const last = kifu[kifu.length - 1];
    const aiColor = opponent(playerColor);
    if (last.color !== aiColor) return;
    const moveIndex = kifu.length - 1;
    if (lastCommentaryMoveRef.current === moveIndex) return;
    lastCommentaryMoveRef.current = moveIndex;

    const character = COMPUTERS[computerChar];
    const persona = getPersona(character.kanji);
    const isCorner =
      (last.row === 0 || last.row === 7) && (last.col === 0 || last.col === 7);
    const aiCount = aiColor === BLACK ? counts.black : counts.white;
    const playerCount = playerColor === BLACK ? counts.black : counts.white;
    const standing: 'leading' | 'trailing' | 'even' =
      aiCount > playerCount ? 'leading' : aiCount < playerCount ? 'trailing' : 'even';
    const notation = `${String.fromCharCode(97 + last.col)}${last.row + 1}`;

    const handle = fetchCharacterCommentary(
      {
        characterName: locale === 'ja' ? character.name : character.name_en,
        persona,
        movePlayed: {
          by: 'ai',
          notation,
          // We don't track per-move flip count, but the model can
          // reason about the move from coordinate + corner flag alone.
          // Passing 0 here is honest and unobtrusive.
          flipsCount: 0,
          isCornerCapture: isCorner,
        },
        context: {
          moveNumber: kifu.length,
          blackCount: counts.black,
          whiteCount: counts.white,
          standing,
        },
      },
      locale === 'ja' ? 'ja' : 'en',
    );
    let cancelled = false;
    handle.result.then((res) => {
      if (cancelled || !res) return;
      commentaryKeyRef.current += 1;
      setCommentary({ ...res, key: commentaryKeyRef.current });
    });
    return () => {
      cancelled = true;
      handle.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kifu.length, commentaryEnabled, gameMode, loadedKifuView, gameOver]);

  // Reset commentary state on kifu reset / new game so a stale bubble
  // doesn't bleed into the next match.
  useEffect(() => {
    if (kifu.length === 0) {
      lastCommentaryMoveRef.current = -1;
      setCommentary(null);
    }
  }, [kifu.length]);

  // Record the result once gameOver fires. Story matches update the
  // active slot (advancing progress on a win, deducting a life on a
  // loss). Free matches feed the global free-stats bucket. Two-player
  // matches are not recorded.
  useEffect(() => {
    // Sync ref check FIRST: if a previous fire of this effect
    // already entered the body, never re-enter — even if React
    // hasn't yet committed the matching `setResultRecorded(true)`
    // state update.
    if (!gameOver || resultRecordedRef.current || loadedKifuView) return;
    resultRecordedRef.current = true;
    logDiag('gameOver', {
      black: counts.black,
      white: counts.white,
      resigned,
      noCurrent,
      noOpp,
    });
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
      // Detect "story just cleared" before recordSlotResult mutates
      // storyProgress (it caps at 20). Old slot tells us where we
      // were; if old=19 and we just won the chapter-20 fight, this
      // run earned the next bonus character.
      const slotBefore = activeSlot;
      const justClearedStory =
        result === 'win' &&
        slotBefore !== null &&
        slotBefore.storyProgress === 19;
      void recordSlotResult({
        slotId: activeSlotId,
        result,
        opponentLevel,
        isStory: true,
      }).then(setSlots);
      if (justClearedStory && unlockedCount < TOTAL_BONUS_AVATARS) {
        const nextUnlocks = unlockedCount + 1;
        setUnlockedCount(nextUnlocks);
        // v0.36.12: per-slot unlocks. Persist to the active slot
        // and let the activeSlot-sync effect keep the UI in line.
        // Pre-v0.36.12 we also wrote to the legacy global key —
        // that path is dropped now to keep slots independent.
        void storageUpdateSaveSlot(activeSlotId, {
          unlockedCount: nextUnlocks,
        }).then(setSlots);
        // The newly unlocked avatar lives at AVATARS[nextUnlocks]
        // (index 0 = default, 1..20 = bonus). Surface it on the
        // GameOver modal and auto-select it as the player's next
        // protagonist — they can flip back via Settings.
        setUnlockedThisRun(nextUnlocks);
        setP1Avatar(nextUnlocks);
      }
    } else if (!isStory) {
      void recordFreeResult({ result, opponentLevel });
    }
    // True-ending detection — intentionally OUTSIDE the
    // `isStory && activeSlotId !== null` gate above. It used to fire
    // only when the slot just rolled storyProgress 19→20 (=
    // `justClearedStory`), which broke the canonical path: PLR00
    // clears ch.20 first → progress is already 20 → PLR01 unlocks →
    // user replays ch.20 with PLR01 → progress was 20 (not 19) so
    // the old gate fails → trueEndingAchieved never set → 20-B/20-C
    // cinematic skipped → archive shows no true-ending entries even
    // though the player canonically completed the route. Fix: any
    // ch.20 win in AI mode with PLR01 active flips the global flag
    // (and fires the cinematic), regardless of slot/progress state.
    // The `!trueEndingAchieved` clause keeps it idempotent.
    const p1Image = AVATARS[p1Avatar]?.image ?? '';
    const ranAsPLR01 = p1Image.includes('PLR01_haruki_heroic');
    const wonChapter20 = result === 'win' && opponentLevel === 20;
    // Diagnostic snapshot — captures every gate term so a "the
    // cinematic didn't fire even though I just beat ゼロ with PLR01"
    // report is decidable from the diag log alone. v0.36.2 dropped
    // the `!trueEndingAchieved` / `!voidphiAwakened` idempotency
    // clauses so the chain plays on every qualifying win (user
    // request), not just the first time. The flag setters below are
    // still no-ops on subsequent wins, which keeps OPP21/22 unlock
    // semantics stable.
    logDiag('trueending.gate', {
      gameMode,
      ranAsPLR01,
      wonChapter20,
      result,
      opponentLevel,
      trueEndingAlreadyAchieved: trueEndingAchieved,
      voidphiAwakened,
      willFire: gameMode === 'ai' && wonChapter20 && ranAsPLR01,
    });
    if (gameMode === 'ai' && wonChapter20 && ranAsPLR01) {
      // Per-slot trueEnding flip. Idempotent on subsequent wins.
      if (!trueEndingAchieved) {
        setTrueEndingAchievedState(true);
      }
      // Chain: 20-B → 20-C → 20-D. Re-fires on every qualifying
      // win so the player can re-experience the finale by simply
      // beating ゼロ as PLR01 again.
      setStoryOverlay('narrative:trueEnding20B');
      // Persist per-slot: trueEnding + the "Void-φ encounter is
      // queued" flag (so home re-entry resumes the cinematic from
      // 20-B → 20-C → 20-D → opp22.intro → battle). Cleared after
      // the OPP22 battle ends (see the level===22 branch below).
      if (activeSlotId !== null) {
        void storageUpdateSaveSlot(activeSlotId, {
          trueEndingAchieved: true,
          voidphiEncounterPending: true,
        }).then(setSlots);
      }
    }
    // OPP22 ヴォイドφ post-victory narrative. Fires after the
    // player wins any free-mode match against OPP22 (auto-launched
    // after 20-D's intro chain on first encounter, or any rematch
    // initiated from the picker). Defeat path is left to the
    // standard GameOver modal — the OPP22 defeat narrative is in
    // i18n (`opp22.bossPost.defeat`) but in-battle integration of
    // both bossPre and bossPost is a follow-up patch.
    if (gameMode === 'ai' && opponentLevel === 22) {
      if (result === 'win') {
        setStoryOverlay('narrative:opp22.victoryNarration');
      }
      // Clear the per-slot Void-φ pending flag. The encounter has
      // resolved (win or lose), so the resume cinematic shouldn't
      // auto-fire on the next slot entry. A future PLR01 ch.20 win
      // will re-arm it.
      if (activeSlotId !== null) {
        void storageUpdateSaveSlot(activeSlotId, {
          voidphiEncounterPending: false,
        }).then(setSlots);
      }
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
    activeSlot,
    unlockedCount,
    trueEndingAchieved,
    p1Avatar,
    AVATARS,
  ]);

  // Whenever a fresh game starts (kifu cleared, board reset) clear the
  // recorded-result gate so the next gameOver records again. The ref
  // mirror has to be cleared in lockstep — otherwise a fresh match
  // would be locked out from recording its result.
  useEffect(() => {
    if (kifu.length === 0 && !gameOver) {
      resultRecordedRef.current = false;
      setResultRecorded(false);
      setGameOverDismissed(false);
    }
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

  // Park the chapter cursor on the chapter the player is currently
  // engaged with whenever the settings modal opens.
  // - For in-progress runs (progress < 20): the next chapter to play
  //   (= `storyProgress + 1`).
  // - For completed runs (progress >= 20): the current `level`, which
  //   tracks the most recent chapter played including replays of
  //   already-cleared ones. This means a player who's currently
  //   replaying ch.5 sees ch.5's card by default, not ch.1 or ch.20.
  useEffect(() => {
    if (!settingsOpen) return;
    const current =
      storyProgress < 20
        ? Math.min(Math.max(storyProgress + 1, 1), 20)
        : Math.min(Math.max(level, 1), 20);
    setChapterCursor(current);
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
      } else if (screen === 'game' || screen === 'intro') {
        // Both 'game' and 'intro' are forward layers from the title.
        // Mobile edge-flick / browser back on either should fall back
        // to the title screen (this also restores the v0.32.5 fix the
        // user asked for, but routed through the single popstate
        // listener instead of a parallel one).
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
      (screen === 'game' || screen === 'intro' ? 1 : 0) +
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

      logDiag('move', { row, col, color: currentColor, flips: move.flips.length });

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
    // `aiThinking` was previously part of this gate, but a recurring
    // freeze at endgame ("can't play the last move, board doesn't
    // respond") was traced to `aiThinking` getting stuck `true` in
    // edge cases where the AI worker silently dies / never replies
    // and the watchdog hasn't yet kicked in. Drop it here:
    // `isHumanTurn` (= currentColor === playerColor) already proves
    // the AI shouldn't be thinking. If the flag is somehow still
    // true on the human's turn that's the stale state — let the
    // human play through it instead of locking the board. We also
    // proactively reset the flag below so the AI useEffect's next
    // re-run starts from a clean state.
    logDiag('click', {
      row,
      col,
      isHumanTurn,
      gameOver,
      passInfo: passInfo !== null,
      aiThinking,
      validMoveCount: validMoveMap.size,
      isLegal: validMoveMap.has(moveKey(row, col)),
    });
    if (!isHumanTurn || gameOver || passInfo !== null) return;
    if (!validMoveMap.has(moveKey(row, col))) return;
    if (aiThinking) {
      // Defensive: surfaced state was aiThinking-true on the human's
      // turn, which is impossible by design. Clear it + cancel any
      // in-flight worker request so the next AI cycle starts clean.
      ai.cancel();
      setAiThinking(false);
    }
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

  /**
   * Reset the board and roll first-player.
   *
   * `modeHint` lets the caller declare the mode the *next* match will
   * run as. Critical for callers who set `gameMode` / `aiMode` and
   * synchronously invoke `reset()` in the same tick — those state
   * updates haven't been applied yet, so reading `gameMode` / `aiMode`
   * from closure inside reset would see the PREVIOUS match's mode and
   * dispatch the coin-flip down the wrong branch (e.g. previous free
   * mode with `firstPlayerPref='second'` → permanently white in the
   * brand-new story match). When omitted (in-game "新規" button),
   * we trust the live React state because no transition is in flight.
   */
  function reset(modeHint?: { gameMode: GameMode; aiMode: AiMode }) {
    const effectiveGameMode = modeHint?.gameMode ?? gameMode;
    const effectiveAiMode = modeHint?.aiMode ?? aiMode;
    logDiag('reset', { gameMode: effectiveGameMode, aiMode: effectiveAiMode });
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
    setGameOverDismissed(false);
    setCameFromGameOver(false);
    setUnlockedThisRun(null);
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
    const isStory = effectiveAiMode === 'story' && effectiveGameMode === 'ai';
    const isFree = effectiveAiMode === 'free' && effectiveGameMode === 'ai';
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
      reset({ gameMode: 'human', aiMode });
      setScreen('game');
      return;
    }
    if (selection.sub === 'story') {
      // Story mode requires an active slot; otherwise open the picker
      // and let the user pick before entering the game.
      if (activeSlotId === null) {
        setSlotPickerOpen(true);
        return;
      }
      // Resume the Void-φ encounter cinematic if the active slot
      // has it queued (set by the PLR01 ch.20 win in the gameOver
      // effect, cleared after OPP22 battle ends). Skips the
      // chapter-20 IntroSequence and replays
      // 20-B → 20-C → 20-D → opp22.intro → battle.
      if (activeSlot?.voidphiEncounterPending) {
        logDiag('voidphi.resume_from_title', { slotId: activeSlotId });
        setGameMode('ai');
        setAiMode('free');
        reset({ gameMode: 'ai', aiMode: 'free' });
        setStoryOverlay('narrative:trueEnding20B');
        setScreen('game');
        return;
      }
      // Route through the multi-step intro instead of dropping the
      // player onto the board. `reset()` and the screen flip to 'game'
      // happen in `onIntroComplete` once the player taps "begin the
      // match →" at the end of the chapter card.
      const targetChapter = Math.min(
        Math.max((activeSlot?.storyProgress ?? 0) + 1, 1),
        20,
      );
      setIntroChapter(targetChapter);
      setScreen('intro');
      return;
    }
    // Free mode: don't drop the player straight into the coin toss.
    // Open the setup panel pre-configured for free match so they can
    // pick opponent / level / first-player preference, then confirm
    // with "この設定で対局を始める" — the toss runs only after that
    // explicit start.
    setGameMode('ai');
    setAiMode('free');
    setSettingsOpen(true);
  }

  /** Pick (or switch) the active save slot, then jump straight into
   *  story mode with that slot. */
  function selectSlot(id: number) {
    setActiveSlotIdState(id);
    void setActiveSlotId(id);
    setSlotPickerOpen(false);
    // Default the player avatar to the latest unlocked character.
    // Without this, a player with PLR01 英霊ハルキ unlocked
    // (= unlockedCount === 20) would still drop into chapter
    // selection as PLR00 default, and they'd have to dig into the
    // settings modal to switch — surprising for a "the canon
    // protagonist for this save" expectation. unlockedCount=0
    // (= no bonus avatars yet) leaves p1Avatar=0 (PLR00) untouched.
    if (unlockedCount > 0 && unlockedCount < AVATARS.length) {
      setP1Avatar(unlockedCount);
    }
    // Route through the intro flow. `slots` already contains the
    // freshly-selected slot, so we look up its storyProgress directly
    // (avoid relying on the in-flight `activeSlot` derivation, which
    // is keyed off the stale `activeSlotId` until React re-renders).
    const picked = slots.find((s) => s.id === id);
    // Resume the post-PLR01-victory cinematic if the chain was
    // interrupted (player tapped Home before reaching/finishing
    // the OPP22 battle). The flag is set in the gameOver effect
    // when PLR01 wins ch.20 and cleared after the OPP22 battle
    // resolves. Skip IntroSequence and drop the player straight
    // onto the game screen with `narrative:trueEnding20B` queued —
    // its dismiss chain carries through 20-C → 20-D → opp22.intro
    // → auto-launched OPP22 battle, exactly mirroring the
    // in-session post-victory flow the user expects.
    if (picked?.voidphiEncounterPending) {
      logDiag('voidphi.resume_from_slot', { slotId: id });
      setGameMode('ai');
      setAiMode('free');
      reset({ gameMode: 'ai', aiMode: 'free' });
      setStoryOverlay('narrative:trueEnding20B');
      setScreen('game');
      return;
    }
    const targetChapter = Math.min(
      Math.max((picked?.storyProgress ?? 0) + 1, 1),
      20,
    );
    setIntroChapter(targetChapter);
    setScreen('intro');
  }

  /** Wipes the active slot back to defaults (keeps name + avatar).
   *  Also clears the per-slot overlay-seen flags so the prologue +
   *  narrative inserts re-fire on the fresh playthrough; otherwise
   *  the slot would be rewound to chapter 1 but the archive would
   *  still report the prologue as already viewed.
   *
   *  Confirmation guard: this is the most destructive non-delete
   *  action available — wipes progress, lives, vsOpponent stats, and
   *  the overlay-seen flags for the slot. A misclick (e.g. tapping
   *  「セーブをリセット」 on the GameOver screen instead of "retry")
   *  used to vapourize the run. The browser-native `confirm` keeps
   *  the wording locale-aware via i18n. */
  async function resetStoryProgress() {
    if (activeSlotId === null) return;
    if (!window.confirm(t.resetStoryProgressConfirm)) return;
    const next = await resetStoredSlot(activeSlotId);
    setSlots(next);
    resetOverlaysSeen(String(activeSlotId));
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
    resultRecordedRef.current = true;
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
      // Stash the GameOver-relevant state before loadKifuMoves wipes
      // it (the loader clears `lastResult`/`resigned` because for the
      // generic kifu library path the loaded match is unrelated to
      // the current run). Re-set them after so the GameOver modal
      // renders identically when the player closes the replay strip.
      const stashedResult = lastResult;
      const stashedResigned = resigned;
      setCameFromGameOver(true);
      loadKifuMoves(slot);
      setLastResult(stashedResult);
      setResigned(stashedResigned);
    } else {
      setKifuOpen(true);
    }
  }

  /** Magic-spell handler — called from the spell modal (Enter key
   *  or 🪄 button). All mutations target the **active slot only**
   *  (per-slot flags introduced in v0.36.12). v0.36.14 redesigned
   *  the suffix syntax per the author's request:
   *
   *  - bare cipher (e.g. 「ばんじょうぜんてんかいほう」) → shorthand
   *    for PPCC = `0121`: PLR01 英霊ハルキ at chapter 21 (= the
   *    post-true-ending state with the Void-φ encounter queued).
   *  - cipher + 4 digits **PPCC** → set the active slot to play as
   *    PLR PP at chapter CC's save point. PP ∈ {00, 01, 02..20}
   *    where the PLR id matches the asset folder
   *    (`PLR03_rin` ⇢ `03`); CC ∈ {01..21} where 01..20 is "ready
   *    to play chapter CC" (storyProgress=CC-1) and 21 is the
   *    post-true-ending overlay state. Chapter 21 with PLR01
   *    flips trueEnding + voidphi + voidphiEncounterPending so the
   *    cinematic chain auto-fires on slot re-entry; with any other
   *    PLR it just stamps storyProgress=20 / unlocks=20 (= "all 20
   *    chapters cleared, but no true ending was earned").
   *
   *  Returns `true` when the input matched either form. */
  function castSpell(): boolean {
    const norm = (s: string) =>
      s
        .normalize('NFKC')
        .toLowerCase()
        .replace(/[\s、。！!？?「」・]/g, '');
    const cipher = norm(t.spellCipher);
    const inputN = norm(spellInput);
    if (cipher.length === 0) return false;

    let plr: number;
    let chapter: number;
    if (inputN === cipher) {
      plr = 1;
      chapter = 21;
    } else if (inputN.startsWith(cipher)) {
      const suffix = inputN.slice(cipher.length);
      if (!/^\d{4}$/.test(suffix)) return false;
      const pp = Number(suffix.slice(0, 2));
      const cc = Number(suffix.slice(2));
      if (pp < 0 || pp > 20) return false;
      if (cc < 1 || cc > 21) return false;
      plr = pp;
      chapter = cc;
    } else {
      return false;
    }

    if (activeSlotId === null) {
      logDiag('spell.no_active_slot');
      return false;
    }

    // PLR PP → AVATARS array index. AVATARS layout is
    //   [PLR00 default, PLR02..PLR20 (19 entries), PLR01 special last].
    // So PLR00 → 0, PLR01 → 20, PLR02..PLR20 → 1..19.
    const avatarIdx = plr === 0 ? 0 : plr === 1 ? 20 : plr - 1;
    // unlockedCount = "exactly up to PLR PP".
    //   spell …0306 ⇢ PP=03 ⇢ unlocks=2 ⇢ only PLR02 + PLR03 selectable
    //   (= "PLR03 までアンロック" の意味).
    // The per-chapter natural-progress max from v0.36.14 was wrong —
    // testers want spell `0306` to put them at ch.6 with the PLR03
    // roster, not ch.6 with everyone unlocked through PLR06. Drop
    // the chapter-derived max.
    const unlocks = plr === 0 ? 0 : plr === 1 ? 20 : plr - 1;
    const slotProgress = chapter <= 20 ? chapter - 1 : 20;
    const isPostTrueEnding = chapter === 21 && plr === 1;

    const now = Date.now();
    const currentSlot = slots.find((s) => s.id === activeSlotId);
    const patch: Partial<SaveSlot> = {
      storyProgress: slotProgress,
      unlockedCount: unlocks,
      trueEndingAchieved: isPostTrueEnding,
      voidphiAwakened: isPostTrueEnding,
      voidphiIntroSeen: false,
      voidphiEncounterPending: isPostTrueEnding,
      lives: 3,
      // Make the spell-cast moment a real save point — the slot
      // should look "in use" in the picker (no "(empty)" badge),
      // and re-entering the slot should resume from this state.
      // Without lastPlayedAt > 0 the SlotPicker's `isUnused` gate
      // falsely flagged spell-warped slots as fresh ("カンスト
      // しているのにセーブデータ無しの初期の状態" report).
      lastPlayedAt: now,
      createdAt:
        currentSlot && currentSlot.createdAt > 0
          ? currentSlot.createdAt
          : now,
    };
    void storageUpdateSaveSlot(activeSlotId, patch).then(setSlots);
    // Set p1Avatar directly — the activeSlot-sync effect's clamp
    // would otherwise pull p1Avatar to `unlocks` and override the
    // explicit PLR choice (e.g. spell `0001` wants PLR00 even
    // though PLR02 is unlocked = unlocks ≥ 1).
    setP1Avatar(avatarIdx);
    // Mark every story overlay as seen so the scene archive shows
    // every beat — testers casting the spell are exploring state,
    // not playing through, so a fully-populated archive is what
    // they want.
    const slotKey = String(activeSlotId);
    for (const key of OVERLAY_ORDER) {
      markOverlaySeen(slotKey, key);
    }
    logDiag('spell.cast', {
      plr,
      chapter,
      avatarIdx,
      unlocks,
      slotProgress,
      isPostTrueEnding,
      slotId: activeSlotId,
    });
    return true;
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
    const nextAiMode: AiMode = isFrontier ? 'story' : 'free';
    setAiMode(nextAiMode);
    setSettingsOpen(false);
    reset({ gameMode: 'ai', aiMode: nextAiMode });
    setScreen('game');
    // 章 20-A 対峙シーン: when PLR01 英霊ハルキ enters chapter 20
    // (frontier OR replay), drop the full-screen confrontation
    // overlay over the freshly-reset board so the player reads the
    // pre-battle dialogue ("君は人間なんだろ?") before making the
    // first move. Mirrors the trueEnding cinematic philosophy of
    // firing every time, not gated on overlay-seen flags — the
    // beat is short and the user explicitly asked for the bridge.
    const playerIsPLR01 =
      p1Avatar >= 0 &&
      p1Avatar < AVATARS.length &&
      AVATARS[p1Avatar].image.includes('PLR01_haruki_heroic');
    if (level === 20 && playerIsPLR01) {
      setStoryOverlay('narrative:chapter20A');
    }
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

  // Chapter-20 Zero scene branching. Zero ships two avatars:
  //   - OPP20_zero/icon.png        (unmasked, default in COMPUTERS_DATA)
  //   - OPP20_zero_battle/icon.png (hooded, used in pre-/in-battle)
  // Selection rules:
  //   - PLR01 英霊ハルキ vs Zero  →  unmasked (本来の姿で対峙する特例演出)
  //   - 章 20 戦闘前/中            →  hooded
  //   - 章 20 勝利後の対話         →  unmasked (フードが落ちて素顔露呈)
  // Other characters always render `c.image` unchanged.
  // PLR01 detection is via the avatar's image filename — AVATARS_DATA's
  // last entry is the PLR01 special, but `playerId === 'PLR01'`
  // semantically resolves through the file path which is stable.
  // After v4-final the asset folders flipped: `OPP20_zero/` now houses
  // the hooded final-boss aesthetic (was `OPP20_zero_battle/` in
  // Phase 1) and the unmasked variant moved to `OPP21_zero_unmasked/`
  // which doubles as the bonus Lv.21 character. The render-time
  // branching logic stays identical — only the constants point at the
  // new paths.
  const ZERO_HOODED = 'avatars/opponents/OPP20_zero/icon.png';
  const ZERO_UNMASKED = 'avatars/opponents/OPP21_zero_unmasked/icon.png';
  function zeroAvatarFor(args: {
    isPostVictory: boolean;
    playerIsPLR01: boolean;
  }): string {
    if (args.playerIsPLR01) return ZERO_UNMASKED;
    if (args.isPostVictory) return ZERO_UNMASKED;
    return ZERO_HOODED;
  }
  const isPLR01Player =
    p1Avatar >= 0 &&
    p1Avatar < AVATARS.length &&
    AVATARS[p1Avatar].image.includes('PLR01_haruki_heroic');
  const isZeroPostVictory =
    gameOver && lastResult === 'win' && COMPUTERS[computerChar]?.level === 20;
  const aiAvatarImage =
    gameMode === 'ai' && COMPUTERS[computerChar]?.level === 20
      ? zeroAvatarFor({
          isPostVictory: isZeroPostVictory,
          playerIsPLR01: isPLR01Player,
        })
      : COMPUTERS[computerChar]?.image;

  const aiInfo =
    gameMode === 'ai'
      ? {
          kanji: COMPUTERS[computerChar].kanji,
          idx: computerChar + 100,
          image: aiAvatarImage,
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

        /* Commentary bubble — fades in, holds, fades out. A new line
           restarts the animation via a remount on the React side. */
        .commentary-bubble {
          animation: commentary-fade 4.6s ease-in-out forwards;
          opacity: 0;
          max-width: 22rem;
        }
        @keyframes commentary-fade {
          0%   { opacity: 0; transform: translateY(4px); }
          12%  { opacity: 1; transform: translateY(0); }
          82%  { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-2px); }
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

        /* Landscape uses a circular halo around the avatar instead of
           a rectangular border around the whole panel — the user asked
           us to drop "rectangle thinking" in landscape. The shape is a
           circle so the breathing glow doesn't read as a frame. */
        .avatar-active-ring {
          animation: avatar-breathing 2.4s ease-in-out infinite;
          border-radius: 9999px;
        }
        @keyframes avatar-breathing {
          0%, 100% { box-shadow: 0 0 0 0 rgba(252, 211, 77, 0); }
          50%      { box-shadow: 0 0 18px 4px rgba(252, 211, 77, 0.55); }
        }

        /* Force-suppress the rectangular panel breathing glow in
           landscape phone — Tailwind's [animation:none] arbitrary
           class ties on specificity with .player-panel-active, and
           since this <style> block is injected by React after
           Tailwind's stylesheet, .player-panel-active was winning
           the cascade and the rectangle kept pulsing through the
           "removed" border. Media query gives us a clean override. */
        @media (max-width: 1023.98px) and (orientation: landscape) {
          .player-panel-active {
            animation: none !important;
            box-shadow: none !important;
          }
        }

        /* Coin toss used by <FirstPlayerRoll> to decide first/second.
           A single 2D disc whose class swaps between coin-2d-b /
           coin-2d-w via React state on a setTimeout schedule. The
           class-driven background-color change is the most reliable
           CSS update there is, so what JS thinks the face is == what
           the browser actually paints (no preserve-3d / backface-
           visibility quirks).
           The 280ms cross-fade transition is intentionally longer
           than the 240ms minimum gap between flips, so the disc
           never reaches a fully-saturated black or white during the
           toss — the eye sees a smooth warm oscillation instead of
           high-contrast strobing. The endpoint colours themselves
           are also softened (charcoal, not pure black; warm cream,
           not pure white) to keep luminance change gentle. */
        .coin-2d {
          width: 132px;
          height: 132px;
          border-radius: 50%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 4px solid #c9a961;
          /* Matte finish: just a soft offset drop shadow for depth,
             no amber rim glow. Keeps the disc reading flat. */
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.45);
          transition: background-color 280ms cubic-bezier(0.4, 0, 0.6, 1);
          animation: coin-2d-pop-in 0.3s ease-out;
        }
        /* Matte black face — neutral charcoal, not glossy ink. */
        .coin-2d-b {
          background: #1f1d18;
        }
        /* Off-white face — ivory in the same family as the white
           pieces on the board (#ebe2cc → #c5b89c gradient). Earlier
           passes pulled this toward antique gold (#b8a36a) to soften
           the flip strobe, but at that luminance/hue it merged with
           the gold rim and pip and stopped reading as "white" at all.
           Sit at the white-piece's lightest tone so the coin's two
           sides remain unambiguously dark vs. light. */
        .coin-2d-w {
          background: #ebe2cc;
        }
        /* Pip is gold on both faces (matches the rim) so the rim and
           centre form a single visual family. The contrast that
           identifies the side comes from the disc background, not
           the pip colour. */
        .coin-2d-pip {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #c9a961;
          transition: opacity 280ms cubic-bezier(0.4, 0, 0.6, 1);
        }
        .coin-2d-b .coin-2d-pip {
          /* Slightly brighter pip on the dark face so it reads
             without resorting to a glow. */
          background: #d8b96d;
          opacity: 1;
        }
        .coin-2d-w .coin-2d-pip {
          /* On the cream face the rim-tone pip would visually
             merge — drop it a half-step to a deeper gold so it
             still reads as a centre point, while staying in the
             same gold family as the rim. */
          background: #b08a3f;
          opacity: 1;
        }
        @keyframes coin-2d-pop-in {
          from { transform: scale(0.55); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
        .first-player-roll {
          animation: roll-fade-in 0.25s ease-out;
        }
        @keyframes roll-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* Fantasy coin variant. Just the coin — the earlier magic-ring
           underglow was removed at user request ("コイン下の光が邪魔").
           Sized to fit comfortably on a phone in either orientation:
           caps at 280px on tall viewports, 56vmin on the narrow side. */
        .fantasy-coin-stage {
          position: relative;
          width: min(56vmin, 280px);
          aspect-ratio: 1 / 1;
          display: grid;
          place-items: center;
        }
        .fantasy-coin-face {
          position: relative;
          z-index: 2;
          width: 86%;
          height: 86%;
          object-fit: contain;
          user-select: none;
          pointer-events: none;
          filter: drop-shadow(0 12px 22px rgba(20, 18, 32, 0.55));
          animation: fantasy-coin-pop 0.32s ease-out;
        }
        .fantasy-coin-face.spin {
          animation: fantasy-coin-pop 0.32s ease-out, fantasy-coin-tumble 1.9s ease-in-out;
        }
        .fantasy-coin-face.reveal {
          animation: fantasy-coin-settle 0.55s cubic-bezier(0.2, 1.2, 0.3, 1);
        }
        @keyframes fantasy-coin-pop {
          0%   { transform: scale(0.82); opacity: 0; }
          100% { transform: scale(1);    opacity: 1; }
        }
        @keyframes fantasy-coin-tumble {
          0%   { transform: translateY(0)   rotateZ(-3deg); }
          50%  { transform: translateY(-6px) rotateZ(4deg); }
          100% { transform: translateY(0)   rotateZ(0); }
        }
        @keyframes fantasy-coin-settle {
          0%   { transform: translateY(-6px) scale(1.04); }
          60%  { transform: translateY(2px)  scale(0.98); }
          100% { transform: translateY(0)    scale(1); }
        }
        @media (orientation: landscape) and (max-height: 480px) {
          /* On short landscape phones, shrink the stage so the result
             text below it stays on screen. */
          .fantasy-coin-stage {
            width: min(36vh, 200px);
          }
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
                  // Opponent at the slot's next chapter, surfaced
                  // in the title-screen slot footer so the player
                  // sees "Ch.6 vs つむぎ・♥4" rather than just
                  // "Ch.6・♥4". Story progress 20 means the slot
                  // is fully cleared — pass empty string and let
                  // i18n switch to the "全章クリア済" wording.
                  opponentName:
                    activeSlot.storyProgress >= 20
                      ? ''
                      : (COMPUTERS.find(
                          (c) =>
                            c.level === activeSlot.storyProgress + 1,
                        )?.name ?? ''),
                  // Currently-selected player avatar's localized
                  // name. p1Avatar drives the in-game player avatar
                  // and is auto-set to the latest unlocked PLR on
                  // slot entry, so it's the right source for "which
                  // PLR is on this slot". Locale switch picks the
                  // ja/en variant.
                  playerName:
                    locale === 'ja'
                      ? AVATARS[p1Avatar]?.name ?? ''
                      : AVATARS[p1Avatar]?.name_en ?? '',
                }
              : null
          }
          onSwitchSlot={() => setSlotPickerOpen(true)}
          archiveAvailable={
            activeSlotId !== null &&
            getArchiveScenes(
              String(activeSlotId),
              storyProgress,
              trueEndingAchieved,
            ).length > 0
          }
          onOpenArchive={() => setArchiveOpen(true)}
        />
        </div>
      )}

      {/* Story-mode multi-step intro flow. Walks through prologue →
          falling → arrival → chapter card on first run, or just the
          chapter card on every subsequent chapter. `onStart` performs
          the actual mode switch + board reset and flips to 'game'. */}
      {screen === 'intro' && (
        <IntroSequence
          t={t}
          locale={locale}
          firstTime={(activeSlot?.storyProgress ?? 0) === 0}
          chapter={introChapter}
          opponent={
            COMPUTERS.find((c) => c.level === introChapter) ?? COMPUTERS[0]
          }
          onPrologueSeen={() => {
            if (activeSlotId !== null) {
              markOverlaySeen(String(activeSlotId), 'prologue');
            }
          }}
          onStart={() => {
            setGameMode('ai');
            setAiMode('story');
            reset({ gameMode: 'ai', aiMode: 'story' });
            setScreen('game');
            // 章 20-A 対峙シーン: same trigger as the chapter-browser
            // path in startStoryChapter — the IntroSequence is the
            // canonical entry from a slot's "continue from chapter
            // X" button, which is how PLR01 normally re-enters
            // ch.20. Without this hook the confrontation overlay
            // only fires from the rarer chapter-browser path.
            const playerIsPLR01 =
              p1Avatar >= 0 &&
              p1Avatar < AVATARS.length &&
              AVATARS[p1Avatar].image.includes('PLR01_haruki_heroic');
            if (introChapter === 20 && playerIsPLR01) {
              setStoryOverlay('narrative:chapter20A');
            }
          }}
        />
      )}

      {screen === 'game' && (
      <div key="game" className="screen-fade stage-bg min-h-screen w-full relative">
        {/* Story prologue overlay — fires once per save slot when
            entering story mode at chapter 1. Wraps the finished
            scenario prologue prose + illustration. */}
        {storyOverlay === 'prologue' && (
          <PrologueOverlay
            prologue={t.story.prologue}
            dismissLabel={t.story.prologue.startButton}
            onDismiss={() => {
              if (activeSlotId !== null) {
                markOverlaySeen(String(activeSlotId), 'prologue');
              }
              setStoryOverlay(null);
            }}
          />
        )}
        {/* Mid-route narrative inserts. Triggered from the GameOver
            "next chapter" button when storyProgress just hit 10 / 15 /
            19. On dismiss, mark seen and run the deferred reset() so
            the user proceeds to the next chapter setup. */}
        {storyOverlay === 'narrative:solitude' && (
          <NarrativeOverlay
            scene={t.story.narrative.solitude}
            imageBaseName="solitude"
            tone={locale === 'ja' ? '幕間' : 'Interlude'}
            dismissLabel={t.nextChapter}
            onDismiss={() => {
              if (activeSlotId !== null) {
                markOverlaySeen(String(activeSlotId), 'narrative:solitude');
              }
              setStoryOverlay(null);
              setIntroChapter(Math.min(Math.max(storyProgress + 1, 1), 20));
              setScreen('intro');
            }}
          />
        )}
        {storyOverlay === 'narrative:allies' && (
          <NarrativeOverlay
            scene={t.story.narrative.allies}
            imageBaseName="allies"
            tone={locale === 'ja' ? '幕間' : 'Interlude'}
            dismissLabel={t.nextChapter}
            onDismiss={() => {
              if (activeSlotId !== null) {
                markOverlaySeen(String(activeSlotId), 'narrative:allies');
              }
              setStoryOverlay(null);
              setIntroChapter(Math.min(Math.max(storyProgress + 1, 1), 20));
              setScreen('intro');
            }}
          />
        )}
        {storyOverlay === 'narrative:final' && (
          <NarrativeOverlay
            scene={t.story.narrative.final}
            imageBaseName="final"
            tone={locale === 'ja' ? '幕間' : 'Interlude'}
            dismissLabel={t.nextChapter}
            onDismiss={() => {
              if (activeSlotId !== null) {
                markOverlaySeen(String(activeSlotId), 'narrative:final');
              }
              setStoryOverlay(null);
              setIntroChapter(Math.min(Math.max(storyProgress + 1, 1), 20));
              setScreen('intro');
            }}
          />
        )}
        {/* 章 20-A 対峙シーン (page 1 of 2) — fires the moment PLR01
            英霊ハルキ starts a chapter 20 match (see startStoryChapter).
            The board has already reset to the initial position
            behind this overlay; on dismiss page 2 (transition art)
            chains in. Bridges the visual leap between "hooded
            final boss" and the post-victory unmasked Zero by
            giving the two travelers their face-to-face dialogue
            beat. */}
        {storyOverlay === 'narrative:chapter20A' && (
          <NarrativeOverlay
            scene={t.story.narrative.chapter20A}
            imageBaseName="chapter_20a_confrontation"
            tone={locale === 'ja' ? '章 20-A' : 'Chapter 20-A'}
            dismissLabel={t.nextChapter}
            onDismiss={() => {
              if (activeSlotId !== null) {
                markOverlaySeen(
                  String(activeSlotId),
                  'narrative:chapter20A',
                );
              }
              setStoryOverlay('narrative:chapter20Atransition');
            }}
          />
        )}
        {/* 章 20-A 対峙シーン (page 2 of 2) — chains automatically
            from chapter20A. The transition illustration shows the
            闇粒子崩壊 + フード半壊 + 銀髪出現 moment that syncs with
            the dialogue beat where ハルキの「君は人間なんだろ?」
            cracks Zero's facade. On dismiss the overlay closes and
            the player drops onto the live board for the first
            move. */}
        {storyOverlay === 'narrative:chapter20Atransition' && (
          <NarrativeOverlay
            scene={t.story.narrative.chapter20Atransition}
            imageBaseName="chapter_20a_transition"
            tone={locale === 'ja' ? '章 20-A' : 'Chapter 20-A'}
            dismissLabel={t.close}
            onDismiss={() => {
              if (activeSlotId !== null) {
                markOverlaySeen(
                  String(activeSlotId),
                  'narrative:chapter20Atransition',
                );
              }
              setStoryOverlay(null);
            }}
          />
        )}
        {/* True-ending cinematic — fired automatically when PLR01
            英霊ハルキ has just cleared chapter 20 (see the gameOver
            effect that flips `trueEndingAchieved` and sets this
            overlay). 20-B is the moment of release (code rain →
            orange light), 20-C is the modern-Tokyo epilogue. The
            chained dismiss carries the player through both scenes
            in order, then drops them back into the GameOver modal
            with OPP21 + OPP22 already unlocked. */}
        {storyOverlay === 'narrative:trueEnding20B' && (
          <NarrativeOverlay
            scene={t.story.narrative.trueEnding20B}
            imageBaseName="trueEnding20B"
            tone={locale === 'ja' ? '真エンディング' : 'True Ending'}
            dismissLabel={t.nextChapter}
            onDismiss={() => {
              if (activeSlotId !== null) {
                markOverlaySeen(
                  String(activeSlotId),
                  'narrative:trueEnding20B',
                );
              }
              setStoryOverlay('narrative:trueEnding20C');
            }}
          />
        )}
        {storyOverlay === 'narrative:trueEnding20C' && (
          <NarrativeOverlay
            scene={t.story.narrative.trueEnding20C}
            imageBaseName="trueEnding20C"
            tone={locale === 'ja' ? '真エンディング' : 'True Ending'}
            dismissLabel={t.close}
            onDismiss={() => {
              if (activeSlotId !== null) {
                markOverlaySeen(
                  String(activeSlotId),
                  'narrative:trueEnding20C',
                );
              }
              // Phase 4 Step 3 — chain straight into the Void-φ
              // awakening cinematic. v0.36.2 dropped the
              // `!voidphiAwakened` gate so the chain re-plays on
              // every PLR01 ch.20 win, not just the first. Archive-
              // mode replay (no gameOver context) doesn't reach
              // here, so the chain only auto-fires from the
              // gameOver effect's `setStoryOverlay('narrative:
              // trueEnding20B')`.
              setStoryOverlay('narrative:trueEnding20D');
            }}
          />
        )}
        {/* Phase 4 Step 3 — Void-φ awakening cinematic. Plays once
            after the standard true ending (20-C). The dismiss handler
            sets `voidphiAwakened` (state + localStorage) which flips
            the OPP22 selection-grid gate from `trueEndingAchieved` to
            `voidphiAwakened` — i.e. OPP22 only unlocks once the
            player has actually seen the awakening, not just the
            standard true ending. */}
        {storyOverlay === 'narrative:trueEnding20D' && (
          <NarrativeOverlay
            scene={t.story.narrative.trueEnding20D}
            imageBaseName="chapter_20d_voidphi"
            tone={locale === 'ja' ? '真エンディング' : 'True Ending'}
            dismissLabel={t.nextChapter}
            onDismiss={() => {
              if (activeSlotId !== null) {
                markOverlaySeen(
                  String(activeSlotId),
                  'narrative:trueEnding20D',
                );
              }
              setVoidphiAwakenedState(true);
              if (activeSlotId !== null) {
                void storageUpdateSaveSlot(activeSlotId, {
                  voidphiAwakened: true,
                }).then(setSlots);
              }
              logDiag('voidphi.awakened');
              // Chain into the OPP22 intro narrative — the
              // "transition from PLR01 to Void-φ" the player
              // explicitly requested. After intro dismiss, the
              // OPP22 battle auto-launches (free-mode, Lv.22,
              // PLR01 stays as p1Avatar). On returning entries
              // (`voidphi_intro_seen=true`) the user can rematch
              // OPP22 from the standard free-mode picker.
              setStoryOverlay('narrative:opp22.intro');
            }}
          />
        )}
        {/* OPP22 ヴォイドφ first-encounter intro. Auto-fires once
            after 20-D dismisses (Phase 4 follow-up wiring), and
            on its own dismiss launches the OPP22 battle directly:
            sets COMPUTERS index + level 22 + free-mode + reset()
            so the coin-flip → board fires next, with PLR01 still
            on the player side. Marks `voidphi_intro_seen` so a
            future rematch from the free-mode picker skips the
            intro. */}
        {storyOverlay === 'narrative:opp22.intro' && (
          <NarrativeOverlay
            scene={t.story.opp22.intro}
            imageBaseName="chapter_20d_voidphi"
            tone={locale === 'ja' ? 'OPP22 章' : 'OPP22 Chapter'}
            dismissLabel={t.opp22IntroStartLabel}
            onDismiss={() => {
              if (activeSlotId !== null) {
                markOverlaySeen(
                  String(activeSlotId),
                  'narrative:opp22.intro',
                );
              }
              if (activeSlotId !== null) {
                void storageUpdateSaveSlot(activeSlotId, {
                  voidphiIntroSeen: true,
                }).then(setSlots);
              }
              logDiag('voidphi.intro_seen');
              setStoryOverlay(null);
              // Auto-launch the OPP22 battle. Free-mode keeps the
              // story state (storyProgress=20) intact, while
              // routing the gameOver effect through the regular
              // free-mode result path.
              const oppIdx = COMPUTERS.findIndex((c) => c.level === 22);
              if (oppIdx >= 0) {
                setComputerChar(oppIdx);
                setLevel(22);
                setGameMode('ai');
                setAiMode('free');
                reset({ gameMode: 'ai', aiMode: 'free' });
              }
            }}
          />
        )}
        {/* OPP22 victory narration — fires after the player beats
            Void-φ in any free-mode match (gameOver effect sets
            this overlay when result==='win' && opponentLevel===22).
            Closes the run loop with PLR01's quote in the player's
            own voice. */}
        {storyOverlay === 'narrative:opp22.victoryNarration' && (
          <NarrativeOverlay
            scene={t.story.opp22.victoryNarration}
            imageBaseName="chapter_20d_voidphi"
            tone={locale === 'ja' ? 'OPP22 章' : 'OPP22 Chapter'}
            dismissLabel={t.close}
            onDismiss={() => {
              if (activeSlotId !== null) {
                markOverlaySeen(
                  String(activeSlotId),
                  'narrative:opp22.victoryNarration',
                );
              }
              logDiag('voidphi.victory_narration');
              setStoryOverlay(null);
            }}
          />
        )}
        {/* First/second coin-flip overlay. Mounted while
            `firstPlayerRoll` is set; auto-dismisses itself after 2s. */}
        <FirstPlayerRoll
          active={firstPlayerRoll !== null}
          result={firstPlayerRoll?.result ?? null}
          playerName={AVATARS[p1Avatar].name}
          onComplete={() => setFirstPlayerRoll(null)}
          t={t}
          style={coinStyle}
        />
        <div className="relative max-w-5xl mx-auto px-4 py-6 max-lg:landscape:py-1 md:py-10">
          {/* Top icon toolbar */}
          <div className="grid grid-cols-8 gap-px bg-zinc-900/80 border-y border-amber-200/15 mb-5 max-lg:landscape:mb-2 md:rounded-sm overflow-hidden">
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
          <div className="grid md:grid-cols-[1fr_auto_1fr] landscape:grid-cols-[1fr_auto_1fr] gap-5 md:gap-6 landscape:gap-4 max-lg:landscape:gap-6 items-center max-lg:landscape:items-stretch">
            <div className="md:order-1 relative">
              {/* Commentary bubble lives on whichever side is the AI.
                  Anchored above the panel; the keyed remount restarts
                  the fade-in animation for each new line. */}
              {commentary && gameMode === 'ai' && playerColor === WHITE && (
                <div
                  key={commentary.key}
                  className="absolute -top-2 left-2 right-2 z-10 -translate-y-full"
                >
                  <CommentaryBubble text={commentary.text} tone={commentary.tone} />
                </div>
              )}
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
              <div className="board-felt p-3 max-lg:landscape:p-1.5 md:p-4 rounded-sm relative">
                {/* Board width: capped by the smaller viewport
                    dimension. In landscape phone the height includes
                    browser chrome (URL bar) at first paint, so 95vmin
                    overshoots and the bottom of the board scrolls
                    off. Use 70vh to leave room for the toolbar +
                    progress bar + page padding within the *visible*
                    viewport, plus a hard cap. */}
                <div className="w-[min(86vmin,520px)] max-lg:landscape:w-[min(70vh,420px)]">
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
                          // `aiThinking` was previously part of this
                          // gate, which made it AND the move-hint dot
                          // disappear if the flag ever stuck `true`
                          // on the human's turn — the same endgame
                          // freeze v0.33.4 tried to address inside
                          // handleClick. The cell-level short-circuit
                          // (`onClick={() => isValid && ...}`) ran
                          // *before* handleClick could hit, so that
                          // fix was incomplete. `isHumanTurn` already
                          // proves it's the human's turn, so drop the
                          // aiThinking term here too — handleClick's
                          // own defensive `ai.cancel()` clears the
                          // stale flag on the way through.
                          const isValid =
                            validMoveMap.has(moveKey(r, c)) &&
                            isHumanTurn &&
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

            <div className="md:order-3 relative">
              {commentary && gameMode === 'ai' && playerColor === BLACK && (
                <div
                  key={commentary.key}
                  className="absolute -top-2 left-2 right-2 z-10 -translate-y-full"
                >
                  <CommentaryBubble text={commentary.text} tone={commentary.tone} />
                </div>
              )}
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
          <div className={`max-w-xl mx-auto ${loadedKifuView ? 'mt-3' : 'mt-7 max-lg:landscape:mt-4'}`}>
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
                      onClick={() => {
                        // Re-entry from the GameOver modal: the
                        // player tapped 「対戦棋譜を読み込む」 to
                        // study the just-finished match and now wants
                        // back. Just exit the loaded-kifu view —
                        // gameOver is still true (board is at the
                        // final position) and the modal re-appears
                        // through the existing
                        // `gameOver && !loadedKifuView` gate. Skip
                        // the reset()/intro branches below; those
                        // start a fresh match, which the player
                        // explicitly didn't ask for.
                        if (cameFromGameOver) {
                          setLoadedKifuView(false);
                          setCameFromGameOver(false);
                          return;
                        }
                        // Story mode wants the chapter card +
                        // boss-pre dialogue to come back on screen
                        // before the next match starts; calling
                        // reset() directly here used to drop the
                        // player straight onto the coin-toss + board
                        // because reset() runs in-place on the same
                        // 'game' screen. Route through the intro
                        // flow for the upcoming chapter instead — on
                        // its "対局を始める →" tap, IntroSequence
                        // calls reset({ gameMode:'ai', aiMode:'story' })
                        // and flips back to screen='game', so the
                        // coin toss still fires, just *after* the
                        // chapter card. Free / 2P / non-slot kifu
                        // review fall back to reset() like before.
                        if (
                          gameMode === 'ai' &&
                          aiMode === 'story' &&
                          activeSlotId !== null
                        ) {
                          const chapter = Math.min(
                            Math.max(
                              (activeSlot?.storyProgress ?? 0) + 1,
                              1,
                            ),
                            20,
                          );
                          setIntroChapter(chapter);
                          setScreen('intro');
                        } else {
                          reset();
                        }
                      }}
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
            <div className="text-center mt-6 max-lg:landscape:hidden latin-display italic text-amber-200/55 text-xs tracking-[0.3em] uppercase">
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
          {gameOver && !gameOverDismissed && !settingsOpen && !loadedKifuView && (() => {
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
                <div className="modal-bg fixed inset-0 flex items-stretch md:items-center justify-center z-40 p-2 md:p-4">
                  <div className="modal-card relative px-8 md:px-10 py-10 md:py-12 max-w-md w-full max-h-[95vh] overflow-y-auto text-center rounded-sm">
                    {/* X close — hides the modal so the player can re-
                        read the final position without a destructive
                        action. A re-open banner shows at the bottom of
                        the screen so they can summon it back. */}
                    <button
                      type="button"
                      onClick={() => setGameOverDismissed(true)}
                      className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-amber-200/55 hover:text-amber-100 hover:bg-amber-200/[0.06] rounded-sm jp-display text-lg leading-none"
                      aria-label={t.gameOverViewBoard}
                      title={t.gameOverViewBoard}
                    >
                      ×
                    </button>
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

                    {/* Stats summary — frame the GameOver screen as
                        a "respite & take stock" beat rather than pure
                        punishment. Shows progress / W-L-D / unlocked
                        avatar count so the player sees what their run
                        has accumulated, even while looking at the
                        save-reset button. Only renders when there's
                        an active slot, which is already required for
                        `isGameOverScreen` to be true. */}
                    {activeSlot && (
                      <div className="grid grid-cols-3 gap-2 mb-5 px-2 py-3 border-y border-amber-200/15">
                        <div>
                          <div className="latin-display italic text-amber-200/55 text-[9px] tracking-[0.25em] uppercase mb-0.5">
                            {t.gameOverStatsProgress}
                          </div>
                          <div className="jp-display text-amber-100/95 tabular-nums text-base">
                            {activeSlot.storyProgress} / 20
                          </div>
                        </div>
                        <div>
                          <div className="latin-display italic text-amber-200/55 text-[9px] tracking-[0.25em] uppercase mb-0.5">
                            {t.gameOverStatsRecord}
                          </div>
                          <div className="jp-display text-amber-100/95 tabular-nums text-[11px] leading-tight">
                            {activeSlot.wins}-{activeSlot.losses}-{activeSlot.draws}
                          </div>
                        </div>
                        <div>
                          <div className="latin-display italic text-amber-200/55 text-[9px] tracking-[0.25em] uppercase mb-0.5">
                            {t.gameOverStatsUnlocks}
                          </div>
                          <div className="jp-display text-amber-100/95 tabular-nums text-base">
                            {unlockedCount} / {TOTAL_BONUS_AVATARS}
                          </div>
                        </div>
                      </div>
                    )}

                    {gameMode === 'ai' && kifu.length > 0 && (
                      <div className="mt-2 mb-4 pb-4 border-b border-amber-200/15">
                        <div className="latin-display italic text-amber-200/65 text-[10px] tracking-[0.25em] uppercase mb-2 text-center">
                          — {t.gameOverReviewSection} —
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={startReview}
                            className="px-3 py-3 border border-amber-200/55 bg-amber-200/[0.04] hover:bg-amber-200/[0.10] hover:border-amber-200/85 rounded-sm jp-display text-amber-100 text-sm tracking-wider leading-snug"
                          >
                            {t.reviewMatchButton}
                          </button>
                          <button
                            onClick={() => void loadCurrentMatchKifu()}
                            className="px-3 py-3 border border-amber-200/55 bg-amber-200/[0.04] hover:bg-amber-200/[0.10] hover:border-amber-200/85 rounded-sm jp-display text-amber-100 text-sm tracking-wider leading-snug"
                          >
                            {t.gameOverViewKifu}
                          </button>
                        </div>
                        <p className="jp-display italic text-amber-200/55 text-[10px] mt-2 text-center leading-relaxed">
                          {t.gameOverReviewHint}
                        </p>
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
                      <button onClick={() => reset()} className="btn">
                        {t.gameOverTryAgainNoLives}
                      </button>
                      <button
                        onClick={() => {
                          // Reset in-memory match state on the way out
                          // so re-entering story mode doesn't inherit
                          // a leftover gameOver=true / full board /
                          // stale kifu. Slot data lives in localStorage
                          // and is untouched.
                          reset();
                          setScreen('title');
                        }}
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
              <div className="modal-bg fixed inset-0 flex items-stretch md:items-center justify-center z-40 p-2 md:p-4">
                {/* Sakura confetti for any story-mode win (chapter clear
                    OR full ending). Sits behind the modal card so the
                    petals visibly drift past the score panel. */}
                <ChapterClearConfetti active={justAdvanced} />
                {/* `max-h-[95vh] scroll-y` so long story-mode endings
                    (ch.20 endingFull = ~30 lines) don't get clipped
                    off-screen on mobile. The endingFull text itself
                    uses PaginatedProse below to break the wall of
                    text into readable pages. */}
                <div className="modal-card relative px-8 md:px-10 py-10 md:py-12 max-w-md w-full max-h-[95vh] overflow-y-auto text-center rounded-sm">
                  {/* X close — same role as the GameOver Screen modal:
                      let the player look at the board for one more
                      breath before committing to a button. */}
                  <button
                    type="button"
                    onClick={() => setGameOverDismissed(true)}
                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-amber-200/55 hover:text-amber-100 hover:bg-amber-200/[0.06] rounded-sm jp-display text-lg leading-none"
                    aria-label={t.gameOverViewBoard}
                    title={t.gameOverViewBoard}
                  >
                    ×
                  </button>
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
                        ? // Story-mode verdict is from the human's
                          // perspective. Coin-toss can put the human
                          // on either color, so checking
                          // winner === BLACK was wrong whenever the
                          // toss landed the player on White — they'd
                          // win the match (winner=WHITE, storyProgress
                          // advances, "next chapter" button appears)
                          // but this header would still show 敗北.
                          winner === playerColor
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
                    <>
                      {/* Ending illustration — pairs with the finale
                          prose. Falls back silently if the asset isn't
                          present (image variant decided by viewport
                          orientation, like ChapterArt). */}
                      <EndingArt />
                      {/* Paginated reader — endingFull is ~30 lines
                          so even with the modal scrolling enabled it
                          reads better one paragraph-page at a time
                          with explicit prev/next, matching the slow
                          cinematic pace of the finale. */}
                      <div className="mb-5">
                        <PaginatedProse
                          text={t.story.endingFull.text}
                          prevLabel={t.proseTurnPrev}
                          nextLabel={t.proseTurnNext}
                          pageCounter={t.proseTurnCounter}
                        />
                      </div>
                    </>
                  )}
                  {/* Chapter-clear scenario beats (master's victory line +
                      Haruki's inner thought + brief narration bridging
                      to the next chapter). Only shown for non-final
                      chapter wins; the final chapter uses endingFull
                      above which already covers everything. */}
                  {justAdvanced && !justCompletedStory && (() => {
                    const story = t.story.chapterStories[playedChapter - 1];
                    if (!story) return null;
                    return (
                      <div className="space-y-3 mb-5 text-left">
                        <p className="jp-display italic text-amber-200/85 text-sm leading-relaxed">
                          「{renderEmphasized(story.victoryDialogue)}」
                        </p>
                        <p className="jp-display italic text-amber-100/70 text-xs leading-relaxed">
                          {renderEmphasized(story.bossPost)}
                        </p>
                        <p className="jp-display text-amber-100/80 text-xs leading-relaxed whitespace-pre-line pt-2 border-t border-amber-200/15">
                          {renderEmphasized(story.victoryNarration)}
                        </p>
                      </div>
                    );
                  })()}
                  {/* New protagonist unlocked! Surface the avatar that
                       just joined the roster. AVATARS[unlockedThisRun]
                       was already auto-selected as p1Avatar — the
                       player can switch back via Settings. */}
                  {unlockedThisRun !== null && AVATARS[unlockedThisRun] && (
                    <div className="mt-3 mb-4 px-4 py-3 bg-amber-200/[0.08] border border-amber-300/40 rounded-sm flex items-center gap-3">
                      <AvatarBadge
                        kanji={AVATARS[unlockedThisRun].kanji}
                        idx={unlockedThisRun}
                        image={AVATARS[unlockedThisRun].image}
                        size="md"
                      />
                      <div className="flex-1 min-w-0 text-left">
                        <div className="latin-display italic text-amber-200/65 text-[10px] tracking-[0.25em] uppercase mb-0.5">
                          {t.unlockBannerLabel}
                        </div>
                        <div className="jp-display text-amber-100 text-base md:text-lg truncate">
                          {AVATARS[unlockedThisRun].name}
                        </div>
                        <div className="jp-display italic text-amber-200/65 text-[11px] truncate">
                          — {AVATARS[unlockedThisRun].setting}
                        </div>
                      </div>
                    </div>
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
                            // Zero's snapshot was taken during play
                            // (i.e. hooded variant). Once we're in
                            // the gameOver-modal phase it should
                            // switch to the unmasked variant — that's
                            // the "hood falls off" reveal moment. Use
                            // the live aiAvatarImage which reflects
                            // the current scene/player branching.
                            image:
                              opponentSnapshot.level === 20
                                ? aiAvatarImage
                                : opponentSnapshot.image,
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
                      {winner === EMPTY
                        ? t.gameOverAiQuoteDraw
                        : winner === playerColor
                          ? t.gameOverAiQuoteWin
                          : t.gameOverAiQuoteLose}
                      」
                    </p>
                  )}

                  {gameMode === 'ai' && kifu.length > 0 && (
                    <div className="mt-3 mb-3 pb-3 border-b border-amber-200/15">
                      <div className="latin-display italic text-amber-200/65 text-[10px] tracking-[0.25em] uppercase mb-2 text-center">
                        — {t.gameOverReviewSection} —
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={startReview}
                          className="px-3 py-3 border border-amber-200/55 bg-amber-200/[0.04] hover:bg-amber-200/[0.10] hover:border-amber-200/85 rounded-sm jp-display text-amber-100 text-sm tracking-wider leading-snug"
                        >
                          {t.reviewMatchButton}
                        </button>
                        <button
                          onClick={() => void loadCurrentMatchKifu()}
                          className="px-3 py-3 border border-amber-200/55 bg-amber-200/[0.04] hover:bg-amber-200/[0.10] hover:border-amber-200/85 rounded-sm jp-display text-amber-100 text-sm tracking-wider leading-snug"
                        >
                          {t.gameOverViewKifu}
                        </button>
                      </div>
                      <p className="jp-display italic text-amber-200/55 text-[10px] mt-2 text-center leading-relaxed">
                        {t.gameOverReviewHint}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-center gap-2 mt-4 flex-wrap">
                    {justCompletedStory ? (
                      <button onClick={resetStoryProgress} className="btn">
                        {t.retryStory}
                      </button>
                    ) : showNextChapter ? (
                      <button
                        onClick={() => {
                          // Decide whether a mid-route narrative
                          // insert should appear before the next
                          // chapter. After clearing Ch.10 / 15 / 19
                          // we fire solitude / allies / final as a
                          // full-screen overlay; on its dismiss the
                          // intro flow takes over for the next
                          // chapter card. Without an interlude we
                          // jump straight to the intro flow.
                          let pending: OverlayKey | null = null;
                          if (storyProgress === 10) pending = 'narrative:solitude';
                          else if (storyProgress === 15) pending = 'narrative:allies';
                          else if (storyProgress === 19) pending = 'narrative:final';
                          const slotKey =
                            activeSlotId !== null ? String(activeSlotId) : null;
                          if (
                            pending &&
                            slotKey &&
                            !hasSeenOverlay(slotKey, pending)
                          ) {
                            setStoryOverlay(pending);
                          } else {
                            setIntroChapter(
                              Math.min(Math.max(storyProgress + 1, 1), 20),
                            );
                            setScreen('intro');
                          }
                        }}
                        className="btn btn-active"
                      >
                        {t.nextChapter}
                      </button>
                    ) : (
                      <button onClick={() => reset()} className="btn">
                        {t.oneMore}
                      </button>
                    )}
                    <button
                      onClick={() => {
                        // See the GameOver Screen's title button: clear
                        // in-memory state on exit so re-entry from
                        // title is clean.
                        reset();
                        setScreen('title');
                      }}
                      className="btn"
                    >
                      {t.gameOverBackToTitle}
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Re-open banner — shows when the player tapped × on the
              GameOver modal to look at the board. One tap brings the
              result modal back. Sits above the toolbar so it never
              overlaps the score panel or board content. */}
          {gameOver && gameOverDismissed && !settingsOpen && !loadedKifuView && (
            <button
              type="button"
              onClick={() => setGameOverDismissed(false)}
              className="fixed bottom-3 left-1/2 -translate-x-1/2 z-30 px-4 py-2 bg-zinc-950/90 border border-amber-200/40 hover:border-amber-200/80 hover:bg-amber-200/[0.06] rounded-sm jp-display text-amber-100/90 text-xs tracking-wider shadow-lg backdrop-blur-sm"
            >
              ▲ {t.gameOverReopenBanner}
            </button>
          )}

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

        </div>
      </div>
      )}

      {/* Settings modal */}
      {settingsOpen && (
        <div className="modal-bg fixed inset-0 z-50 flex items-stretch md:items-center justify-center p-2 md:p-6">
          <div className="modal-card scroll-y w-full max-w-3xl max-h-[95vh] rounded-sm p-5 md:p-8">
            {(() => {
              const fromTitle = screen !== 'game';
              const heading = fromTitle ? t.matchSetup : t.setup;
              return (
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="latin-display italic ornament text-[10px] uppercase mb-1">
                      — {heading} —
                    </div>
                    <h2 className="jp-display text-amber-100 text-2xl md:text-3xl font-bold tracking-[0.15em]">
                      {heading}
                    </h2>
                  </div>
                  <button onClick={() => setSettingsOpen(false)} className="btn">
                    {t.close}
                  </button>
                </div>
              );
            })()}

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

            {/* Coin animation style — purely cosmetic, applies to
                the first/second toss overlay shown at game start. */}
            <section className="mb-6">
              <h3 className="jp-display text-amber-100/90 text-sm md:text-base tracking-[0.25em] mb-3 pb-2 border-b border-amber-200/15">
                {t.coinStyleLabel}
                <span className="latin-display italic text-amber-200/65 text-xs ml-2 normal-case tracking-wider">
                  — {t.coinStyleSubtitle}
                </span>
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {(['2d', 'fantasy'] as const).map((style) => {
                  const active = coinStyle === style;
                  const label = style === '2d' ? t.coinStyle2D : t.coinStyleFantasy;
                  const desc = style === '2d' ? t.coinStyle2DDesc : t.coinStyleFantasyDesc;
                  return (
                    <button
                      key={style}
                      onClick={() => setCoinStyle(style)}
                      className={`text-left rounded-sm border py-2.5 px-3 transition-all ${
                        active
                          ? 'border-amber-200/70 bg-amber-200/[0.06] text-amber-100'
                          : 'border-amber-200/15 hover:border-amber-200/40 hover:bg-amber-200/[0.02] text-amber-100/85'
                      }`}
                      aria-pressed={active}
                    >
                      <div className="jp-display text-sm tracking-wider">{label}</div>
                      <div className="jp-display italic text-amber-200/70 text-[11px] mt-0.5 leading-snug">
                        {desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* LLM character commentary — opt-in. Each match triggers
                a few dozen Anthropic API calls when ON, so the default
                is OFF and we surface the cost note inline. */}
            <section className="mb-6">
              <h3 className="jp-display text-amber-100/90 text-sm md:text-base tracking-[0.25em] mb-3 pb-2 border-b border-amber-200/15">
                {t.commentaryLabel}
                <span className="latin-display italic text-amber-200/65 text-xs ml-2 normal-case tracking-wider">
                  — {t.commentarySubtitle}
                </span>
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setCommentaryEnabled(false)}
                  className={`btn flex-1 ${!commentaryEnabled ? 'btn-active' : ''}`}
                  aria-pressed={!commentaryEnabled}
                >
                  {t.commentaryOff}
                </button>
                <button
                  onClick={() => setCommentaryEnabled(true)}
                  className={`btn flex-1 ${commentaryEnabled ? 'btn-active' : ''}`}
                  aria-pressed={commentaryEnabled}
                >
                  {t.commentaryOn}
                </button>
              </div>
              <p className="jp-display italic text-amber-200/55 text-[11px] mt-2 leading-relaxed">
                {t.commentaryHint}
              </p>
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
                  // i === 0: default protagonist, always available.
                  // i in 1..unlockedCount: a bonus avatar earned via
                  // a 20-chapter story clear. i > unlockedCount: not
                  // yet earned.
                  const isLocked = i > unlockedCount;
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
              {unlockedCount < TOTAL_BONUS_AVATARS && (
                <p className="jp-display italic text-amber-200/55 text-[11px] mt-2">
                  {t.protagonistLockHint(unlockedCount, TOTAL_BONUS_AVATARS)}
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
                    // ch.21 = the post-true-ending Void-φ encounter
                    // chain (20-B → 20-C → 20-D → opp22.intro →
                    // OPP22 battle), surfaced in the chapter
                    // browser once the slot has reached the true
                    // ending. Acts as a replay entry-point for the
                    // cinematic — same effect as the resume-from-
                    // home path triggered by `voidphiEncounterPending`,
                    // but available indefinitely after first clear.
                    const ch21Available = trueEndingAchieved;
                    const cursorCap = ch21Available ? 21 : 20;
                    const isComplete = storyProgress >= 20;
                    const maxCursor = Math.min(
                      Math.max(storyProgress + 1, 1),
                      cursorCap,
                    );
                    const cursor = Math.min(
                      Math.max(chapterCursor, 1),
                      maxCursor,
                    );
                    const isCh21 = cursor === 21;
                    const targetLevel = isCh21 ? 22 : cursor;
                    const oppIdx = COMPUTERS.findIndex(
                      (c) => c.level === targetLevel,
                    );
                    const opp = COMPUTERS[oppIdx];
                    const isFrontier = !isComplete && cursor === storyProgress + 1;
                    const isPast = !isCh21 && cursor <= storyProgress;
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

                        {/* Direct-jump chapter chip row. Renders as a
                            grid of 1..maxCursor numbered buttons so
                            players don't have to step ◀/▶ N times to
                            revisit a specific past chapter. Locked
                            chapters (cursor > storyProgress + 1) are
                            disabled. The current cursor is highlighted.
                            Hidden when only ch.1 is available (no
                            navigation needed). */}
                        {maxCursor > 1 && (
                          <div>
                            <div className="latin-display italic text-amber-200/55 text-[10px] tracking-[0.25em] uppercase mb-1.5">
                              {t.chapterListLabel}
                            </div>
                            <div className="grid grid-cols-10 gap-1">
                              {Array.from({ length: cursorCap }, (_, i) => {
                                const n = i + 1;
                                const isAvailable = n <= maxCursor;
                                const isCleared = n <= storyProgress;
                                const isHere = n === cursor;
                                const isVoidphi = n === 21;
                                return (
                                  <button
                                    key={n}
                                    type="button"
                                    onClick={() => setChapterCursor(n)}
                                    disabled={!isAvailable}
                                    aria-current={isHere ? 'true' : undefined}
                                    className={`latin-display tabular-nums text-xs py-1 rounded-sm border transition-colors ${
                                      isHere
                                        ? isVoidphi
                                          ? 'bg-violet-300/15 border-violet-200/80 text-violet-50'
                                          : 'bg-amber-200/20 border-amber-200/80 text-amber-50'
                                        : isVoidphi && isAvailable
                                          ? 'bg-violet-300/[0.05] border-violet-300/40 text-violet-200/85 hover:border-violet-300/70'
                                          : isCleared
                                            ? 'bg-emerald-300/[0.04] border-emerald-200/30 text-emerald-200/85 hover:border-emerald-200/60'
                                            : isAvailable
                                              ? 'border-amber-200/30 text-amber-100/75 hover:border-amber-200/60'
                                              : 'border-zinc-800/60 text-zinc-600 cursor-not-allowed'
                                    }`}
                                  >
                                    {n}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

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
                            {renderEmphasized(t.story.prologue.text)}
                          </p>
                        )}

                        <div
                          className={`border rounded-sm p-4 ${
                            isCh21
                              ? 'border-violet-300/40 bg-violet-300/[0.04]'
                              : 'border-amber-200/30 bg-amber-200/[0.04]'
                          }`}
                        >
                          <div className="latin-display italic ornament text-[10px] uppercase mb-2">
                            — {isCh21 ? 'Chapter 21' : `Chapter ${targetLevel}`} —
                          </div>
                          {!isCh21 && opp.chapterArtBase && (
                            <ChapterArt
                              srcBase={opp.chapterArtBase}
                              alt={opp.name}
                            />
                          )}
                          <div className="flex items-center gap-3 mb-3">
                            <AvatarBadge
                              kanji={opp.kanji}
                              idx={oppIdx + 100}
                              image={opp.image}
                              size="md"
                            />
                            <div className="min-w-0">
                              <div className="jp-display text-amber-100 text-base md:text-lg truncate">
                                {t.footerChapter(cursor, opp.name)}
                              </div>
                              <div className="latin-display italic text-amber-200/50 text-xs tracking-wider">
                                Lv.{opp.level} {getLevelLabel(opp.level, t)}
                              </div>
                            </div>
                          </div>
                          {/* New 4-block scenario content. `intro` is
                              the chapter setup narration, `bossPre` is
                              the master's pre-match line. `victoryNarration`
                              is appended only after the chapter is
                              cleared (cursor <= storyProgress) so it
                              doesn't spoil the bridge to the next master
                              for unexplored chapters. */}
                          {isCh21 ? (
                            <div className="space-y-3">
                              <p className="jp-display text-violet-100/85 text-sm leading-relaxed whitespace-pre-line">
                                {renderEmphasized(t.story.opp22.intro.text)}
                              </p>
                            </div>
                          ) : (
                            (() => {
                              const story = t.story.chapterStories[cursor - 1];
                              const cleared = cursor <= storyProgress;
                              return (
                                <div className="space-y-3">
                                  <p className="jp-display text-amber-100/80 text-sm leading-relaxed whitespace-pre-line">
                                    {renderEmphasized(story.intro)}
                                  </p>
                                  <p className="jp-display italic text-amber-200/85 text-sm leading-relaxed">
                                    「{renderEmphasized(story.bossPre)}」
                                  </p>
                                  {cleared && (
                                    <p className="jp-display italic text-amber-200/60 text-xs leading-relaxed whitespace-pre-line pt-2 border-t border-amber-200/15">
                                      {renderEmphasized(story.victoryNarration)}
                                    </p>
                                  )}
                                </div>
                              );
                            })()
                          )}
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
                          onClick={() => {
                            if (isCh21) {
                              // Ch.21 = post-true-ending Void-φ
                              // encounter chain. Same setup as the
                              // resume-from-home path: skip the
                              // regular story-mode startStoryChapter
                              // (which expects an OPP at level 1..20)
                              // and trigger the cinematic chain
                              // 20-B → 20-C → 20-D → opp22.intro →
                              // OPP22 battle directly.
                              setSettingsOpen(false);
                              setGameMode('ai');
                              setAiMode('free');
                              reset({ gameMode: 'ai', aiMode: 'free' });
                              setStoryOverlay('narrative:trueEnding20B');
                              setScreen('game');
                              return;
                            }
                            startStoryChapter(cursor, isFrontier);
                          }}
                          className={`btn w-full ${
                            isCh21
                              ? 'btn-active'
                              : isFrontier
                                ? 'btn-active'
                                : ''
                          }`}
                        >
                          {isCh21
                            ? '🌌 ' + t.opp22IntroStartLabel
                            : isFrontier
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
                          {COMPUTERS.map((c, i) => {
                            // Hidden = OPP21 (Lv.21 ゼロ・現世帰還).
                            // Renders with the `.avatar-locked` filter
                            // (black-out + ??? overlay) and rejects
                            // selection until the matching unlock
                            // flag flips. Phase 4 Step 3 split the
                            // gate by level so OPP22 needs its own
                            // 20-D awakening before becoming
                            // selectable, while OPP21 keeps the
                            // canonical `trueEndingAchieved` gate.
                            //   OPP21 (Lv.21) → trueEndingAchieved
                            //   OPP22 (Lv.22) → voidphiAwakened
                            // Other hidden entries (none today) stay
                            // on the more permissive trueEnding gate.
                            const isLocked =
                              !!c.hidden &&
                              (c.level === 22
                                ? !voidphiAwakened
                                : !trueEndingAchieved);
                            return (
                              <button
                                key={i}
                                onClick={() => {
                                  if (isLocked) return;
                                  selectCharacter(i);
                                }}
                                disabled={isLocked}
                                aria-disabled={isLocked}
                                aria-label={isLocked ? '???' : c.name}
                                className={`p-2.5 md:p-3 rounded-sm border transition-all flex flex-col items-center gap-1.5 ${
                                  isLocked
                                    ? 'border-amber-200/15 cursor-not-allowed'
                                    : computerChar === i
                                      ? 'border-amber-200/70 bg-amber-200/[0.06]'
                                      : 'border-amber-200/15 hover:border-amber-200/40 hover:bg-amber-200/[0.02]'
                                }`}
                              >
                                <div className={isLocked ? 'avatar-locked' : ''}>
                                  <AvatarBadge
                                    kanji={isLocked ? '？' : c.kanji}
                                    idx={i + 100}
                                    image={c.image}
                                    size="sm"
                                  />
                                </div>
                                <div className="jp-display text-amber-100/90 text-[11px] md:text-xs leading-tight text-center">
                                  {isLocked ? '???' : c.name}
                                </div>
                                <div
                                  className={`latin-display italic text-[10px] tracking-wider ${
                                    isLocked
                                      ? 'text-amber-200/40'
                                      : computerChar === i
                                        ? 'text-amber-200/80'
                                        : 'text-amber-200/65'
                                  }`}
                                >
                                  {isLocked
                                    ? `Lv.${c.level} · ???`
                                    : t.defaultLevelLabel(c.level)}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        <div className="mt-3 px-3 py-2.5 bg-amber-200/[0.03] border border-amber-200/15 rounded-sm">
                          <div className="jp-display text-amber-100/80 text-sm">
                            {COMPUTERS[computerChar].name}
                            <span className="latin-display italic text-amber-200/55 text-xs ml-2 tracking-wider">
                              · {t.defaultLevelLabel(COMPUTERS[computerChar].level)}
                            </span>
                          </div>
                          <div className="jp-display italic text-amber-200/55 text-xs mt-0.5">
                            「{COMPUTERS[computerChar].quote}」
                          </div>
                        </div>
                      </div>

                      {/* Bridge between the character grid and the level
                          slider — explicitly tells the user that the
                          number under each face is just a default and
                          the slider sets the actual match difficulty. */}
                      <p className="jp-display italic text-amber-200/70 text-xs leading-relaxed mb-3">
                        {t.matchLevelHint}
                      </p>

                      <div>
                        <LevelSelector
                          level={level}
                          setLevel={setLevel}
                          t={t}
                          defaultLevel={COMPUTERS[computerChar].level}
                        />
                        <p className="latin-display italic text-amber-200/55 text-[11px] mt-3 leading-relaxed">
                          {t.aiLevelExplain}
                        </p>
                        <p className="jp-display italic text-amber-200/55 text-[11px] mt-1.5 leading-relaxed">
                          {t.aiComputeNote}
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
                      const isLocked = i > unlockedCount;
                      // Allow both players to share the default avatar
                      // when no bonus characters are unlocked yet —
                      // otherwise 2P mode would have no valid p2 pick.
                      // Once at least one bonus is unlocked there's
                      // always a different option available.
                      const collidesWithP1 =
                        p1Avatar === i && unlockedCount > 0;
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
                  {unlockedCount < TOTAL_BONUS_AVATARS && (
                    <p className="jp-display italic text-amber-200/55 text-[11px] mt-2">
                      {t.protagonistLockHint(unlockedCount, TOTAL_BONUS_AVATARS)}
                    </p>
                  )}
                  {p1Avatar === p2Avatar && unlockedCount > 0 && (
                    <p className="jp-display text-amber-200/65 text-xs mt-2 italic">
                      {t.cannotChooseSelf}
                    </p>
                  )}
                </div>
              )}
            </section>

            {/* Story-data actions. Lives between "what character do I
                play as" (above) and "let's start the match" (below)
                because both buttons here change *persistent* story
                state rather than the upcoming match config. */}
            <section className="mb-6">
              <h3 className="jp-display text-amber-100/90 text-sm md:text-base tracking-[0.25em] mb-3 pb-2 border-b border-amber-200/15">
                {t.storyDataLabel}
              </h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setSettingsOpen(false);
                    setArchiveOpen(true);
                  }}
                  className="btn jp-display text-left text-sm px-4 py-2.5"
                >
                  📖 {t.archiveModalTitle}
                </button>
                <p className="jp-display italic text-amber-200/55 text-[11px] leading-relaxed">
                  {t.archiveSettingsDesc}
                </p>
                {unlockedCount > 0 && (
                  <>
                    <button
                      onClick={() => {
                        if (!window.confirm(t.unlockResetConfirm)) return;
                        setUnlockedCount(0);
                        // v0.36.12: per-slot unlocks. Reset only
                        // the active slot — other slots keep their
                        // independent progress.
                        if (activeSlotId !== null) {
                          void storageUpdateSaveSlot(activeSlotId, {
                            unlockedCount: 0,
                            trueEndingAchieved: false,
                            voidphiAwakened: false,
                            voidphiIntroSeen: false,
                            voidphiEncounterPending: false,
                          }).then(setSlots);
                        }
                        setP1Avatar(0);
                        setP2Avatar(0);
                      }}
                      className="btn jp-display text-left text-sm px-4 py-2.5 mt-2"
                    >
                      🔒 {t.unlockResetLabel}
                    </button>
                    <p className="jp-display italic text-amber-200/55 text-[11px] leading-relaxed">
                      {t.unlockResetDesc(unlockedCount)}
                    </p>
                  </>
                )}
                {/* Magic-spell — counterpart to the 🔒 reset above.
                    Opens a small modal that takes a phrase; matching
                    the locale's `spellCipher` (with optional
                    01..21 suffix) mutates the active slot per the
                    castSpell() spec. v0.36.12 dropped the
                    `unlockedCount < TOTAL_BONUS_AVATARS` gate that
                    previously hid the button on a fully-unlocked
                    slot — the spell is meant to operate on ANY
                    slot's state (warp / reset to a chapter), so
                    making it disappear at the master state was a
                    bug ("カンストしてしまうと呪文書けなくなる"). */}
                <button
                  onClick={() => {
                    setSpellInput('');
                    setSpellResult(null);
                    setSpellOpen(true);
                  }}
                  className="btn jp-display text-left text-sm px-4 py-2.5 mt-2"
                >
                  🪄 {t.spellButtonLabel}
                </button>
                <p className="jp-display italic text-amber-200/55 text-[11px] leading-relaxed">
                  {t.spellButtonDesc}
                </p>
                {/* Manual AI worker respawn — softer recovery than the
                    emergency reload. Cancels any in-flight AI request,
                    clears the `aiThinking` flag, and bumps the retry
                    nonce so the AI useEffect re-runs and asks the
                    (auto-respawned) worker for a fresh move. Keeps the
                    board state intact — useful when the AI is silent
                    but the rest of the UI still works. */}
                <button
                  onClick={() => {
                    logDiag('manual.aiRespawn');
                    ai.cancel();
                    setAiThinking(false);
                    setAiRetryNonce((n) => n + 1);
                  }}
                  className="btn jp-display text-left text-sm px-4 py-2.5 mt-2"
                >
                  {t.aiRespawnLabel}
                </button>
                <p className="jp-display italic text-amber-200/55 text-[11px] leading-relaxed">
                  {t.aiRespawnDesc}
                </p>
                {/* Diagnostic log export — copies the recent event ring
                    buffer to clipboard so users can paste it into a bug
                    report. Local-only; nothing is transmitted. */}
                <button
                  onClick={async () => {
                    const text = exportDiagLog();
                    try {
                      await navigator.clipboard.writeText(text);
                      setDiagLogToast(t.diagLogCopiedToast);
                    } catch {
                      // Older mobile browsers may not allow programmatic
                      // clipboard writes. Fall back to a hidden textarea
                      // + execCommand so the user still gets a copy.
                      const ta = document.createElement('textarea');
                      ta.value = text;
                      ta.style.position = 'fixed';
                      ta.style.opacity = '0';
                      document.body.appendChild(ta);
                      ta.select();
                      try {
                        document.execCommand('copy');
                        setDiagLogToast(t.diagLogCopiedToast);
                      } catch {
                        setDiagLogToast(text.slice(0, 80) + '…');
                      }
                      document.body.removeChild(ta);
                    }
                    window.setTimeout(() => setDiagLogToast(null), 2500);
                  }}
                  className="btn jp-display text-left text-sm px-4 py-2.5 mt-2"
                >
                  {t.diagLogExportLabel}
                </button>
                <p className="jp-display italic text-amber-200/55 text-[11px] leading-relaxed">
                  {t.diagLogExportDesc}
                </p>
                {diagLogToast && (
                  <p
                    className="jp-display text-amber-100/95 text-[11px] mt-1 px-2 py-1 rounded-sm bg-amber-200/[0.08] border border-amber-200/30"
                    role="status"
                  >
                    {diagLogToast}
                  </p>
                )}
                <button
                  onClick={() => {
                    clearDiagLog();
                    setDiagLogToast(t.diagLogClearLabel);
                    window.setTimeout(() => setDiagLogToast(null), 1500);
                  }}
                  className="jp-display italic text-amber-200/55 text-[11px] underline mt-1 self-start"
                >
                  {t.diagLogClearLabel}
                </button>
                {/* Emergency reload — last-resort escape hatch for
                    stuck states (UI freeze, stale PWA cache, etc.).
                    Unregisters every Service Worker, wipes their
                    Caches, and reloads. Slot data lives in
                    localStorage so it survives. */}
                <button
                  onClick={async () => {
                    try {
                      if (
                        'serviceWorker' in navigator
                      ) {
                        const regs = await navigator.serviceWorker.getRegistrations();
                        await Promise.all(regs.map((r) => r.unregister()));
                      }
                      if ('caches' in window) {
                        const keys = await caches.keys();
                        await Promise.all(keys.map((k) => caches.delete(k)));
                      }
                    } catch {
                      /* even if cache wipe fails, fall through to reload */
                    }
                    window.location.reload();
                  }}
                  className="btn jp-display text-left text-sm px-4 py-2.5 mt-2"
                >
                  ♻️ {t.emergencyReloadLabel}
                </button>
                <p className="jp-display italic text-amber-200/55 text-[11px] leading-relaxed">
                  {t.emergencyReloadDesc}
                </p>
              </div>
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

      <SlotPicker
        open={slotPickerOpen}
        slots={slots}
        activeSlotId={activeSlotId}
        onSelect={selectSlot}
        onClose={() => setSlotPickerOpen(false)}
        onSlotsChanged={setSlots}
        onCastSpell={() => {
          setSlotPickerOpen(false);
          setSpellInput('');
          setSpellResult(null);
          setSpellOpen(true);
        }}
        t={t}
      />

      {/* Magic-spell modal — unlocks every bonus character on a
          locale-specific cipher match. Input is normalized (trim +
          lowercase + strip ASCII / JP punctuation) so common typing
          variants of the spell still resolve. */}
      {spellOpen && (
        <div
          className="modal-bg fixed inset-0 z-[55] flex items-stretch md:items-center justify-center p-2 md:p-6"
          onClick={() => setSpellOpen(false)}
        >
          <div
            className="bg-zinc-950/95 border border-amber-200/30 rounded-sm w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={t.spellModalTitle}
          >
            <div className="px-5 py-4 border-b border-amber-200/15">
              <div className="latin-display italic text-amber-200/55 text-[10px] tracking-[0.4em] uppercase mb-1">
                Spell
              </div>
              <h2 className="jp-display text-amber-100 text-lg tracking-wider">
                {t.spellModalTitle}
              </h2>
              <p className="jp-display italic text-amber-200/65 text-xs mt-1">
                {t.spellModalSubtitle}
              </p>
            </div>
            <div className="px-5 py-5 space-y-3">
              <p className="jp-display italic text-amber-200/75 text-[12px] leading-relaxed whitespace-pre-line">
                {renderEmphasized(t.spellModalHint)}
              </p>
              <input
                type="text"
                value={spellInput}
                onChange={(e) => {
                  setSpellInput(e.target.value);
                  if (spellResult !== null) setSpellResult(null);
                }}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter') return;
                  e.preventDefault();
                  setSpellResult(castSpell() ? 'success' : 'failure');
                }}
                placeholder={t.spellPlaceholder}
                autoFocus
                className="w-full px-3 py-2 bg-zinc-900/80 border border-amber-200/25 focus:border-amber-200/70 outline-none rounded-sm jp-display text-amber-100 text-sm tracking-wider"
              />
              {spellResult === 'success' && (
                <p className="jp-display text-amber-200 text-sm leading-relaxed">
                  {t.spellSuccess}
                </p>
              )}
              {spellResult === 'failure' && (
                <p className="jp-display italic text-amber-200/70 text-xs leading-relaxed">
                  {t.spellFailure}
                </p>
              )}
            </div>
            <div className="px-5 py-3 border-t border-amber-200/15 flex justify-end gap-2">
              <button
                onClick={() => setSpellOpen(false)}
                className="px-4 py-1.5 border border-amber-200/40 hover:border-amber-200 text-amber-100 hover:bg-amber-200/[0.06] rounded-sm jp-display text-xs tracking-wider"
              >
                {t.spellCancelLabel}
              </button>
              <button
                onClick={() => {
                  setSpellResult(castSpell() ? 'success' : 'failure');
                }}
                className="px-4 py-1.5 border border-amber-200/70 text-amber-100 bg-amber-200/[0.06] hover:bg-amber-200/[0.12] rounded-sm jp-display text-xs tracking-wider"
              >
                🪄 {t.spellSubmitLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scene archive modal — lists every story beat the slot has
          cleared past (per-chapter narrative + interludes + ending +
          true-ending epilogue). Tap any entry → starts sequential
          playback FROM that scene; each overlay's "次のシーンへ →"
          button chains to the next, until the final scene shows
          「閉じる」 and exits.

          Renders OUTSIDE the screen gate because the entry-point
          sits on the title screen. */}
      {archiveOpen && (() => {
        const ordered =
          activeSlotId !== null
            ? getOrderedArchiveScenes(
                String(activeSlotId),
                storyProgress,
                trueEndingAchieved,
                voidphiAwakened,
              )
            : [];
        const sceneLabel = (s: ArchiveScene): string => {
          if (s.kind === 'overlay') return t.archiveSceneLabels[s.key];
          const opp = COMPUTERS.find((c) => c.level === s.chapter);
          return t.archiveChapterLabel(s.chapter, opp?.name ?? '');
        };
        const startFrom = (index: number) => {
          if (ordered.length === 0) return;
          setArchiveOpen(false);
          setReview({ scenes: ordered, index });
        };
        return (
          <div
            className="modal-bg fixed inset-0 z-[55] flex items-stretch md:items-center justify-center p-2 md:p-6"
            onClick={() => setArchiveOpen(false)}
          >
            <div
              className="bg-zinc-950/95 border border-amber-200/30 rounded-sm w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={t.archiveModalTitle}
            >
              <div className="px-5 py-4 border-b border-amber-200/15">
                <div className="latin-display italic text-amber-200/55 text-[10px] tracking-[0.4em] uppercase mb-1">
                  Archive
                </div>
                <h2 className="jp-display text-amber-100 text-lg tracking-wider">
                  {t.archiveModalTitle}
                </h2>
                <p className="jp-display italic text-amber-200/65 text-xs mt-1">
                  {t.archiveModalSubtitle}
                </p>
              </div>
              {ordered.length === 0 ? (
                <p className="jp-display italic text-amber-200/65 text-sm leading-relaxed text-center px-5 py-10">
                  {t.archiveEmpty}
                </p>
              ) : (
                <>
                  {/* "Play all" button — chronological cinematic from
                      the prologue through the ending. Same chain
                      mechanism as tapping the first entry, exposed
                      explicitly so the affordance is obvious. */}
                  <div className="px-3 pt-3">
                    <button
                      onClick={() => startFrom(0)}
                      className="w-full px-3 py-2.5 border border-amber-200/45 bg-amber-200/[0.05] hover:bg-amber-200/[0.10] hover:border-amber-200/70 text-amber-100 rounded-sm jp-display text-sm tracking-wider"
                    >
                      ▶ {t.archivePlayAllLabel}
                    </button>
                  </div>
                  <ul className="px-3 py-3 space-y-1.5">
                    {ordered.map((scene, i) => {
                      const key =
                        scene.kind === 'overlay'
                          ? `o:${scene.key}`
                          : `c:${scene.chapter}`;
                      return (
                        <li key={key}>
                          <button
                            onClick={() => startFrom(i)}
                            className="w-full text-left px-3 py-2.5 border border-amber-200/15 rounded-sm hover:border-amber-200/45 hover:bg-amber-200/[0.04] flex items-center justify-between gap-3"
                          >
                            <span className="jp-display text-amber-100/90 text-sm">
                              {sceneLabel(scene)}
                            </span>
                            <span className="latin-display italic text-amber-200/65 text-[11px] tracking-wider whitespace-nowrap">
                              {t.archiveReplayLabel} ▸
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
              <div className="px-5 py-3 border-t border-amber-200/15 flex justify-end">
                <button
                  onClick={() => setArchiveOpen(false)}
                  className="px-4 py-1.5 border border-amber-200/40 hover:border-amber-200 text-amber-100 hover:bg-amber-200/[0.06] rounded-sm jp-display text-xs tracking-wider"
                >
                  {t.archiveCloseLabel}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Review-mode story overlays. Mounted OUTSIDE the screen gate so
          the player can re-watch a scene from the title screen without
          first entering a match. Sequential dismiss advances through
          `review.scenes` until the final scene exits with 「閉じる」.
          We don't re-mark seen (already seen) and don't run reset()
          (no chapter to chain).

          Each rendered overlay carries `key={review.index}` so React
          unmounts/remounts on advance — that resets internal scroll
          position, useTapToReveal phase, and the inner `<img>`
          loading state on every page turn. Without the key the user
          would land mid-text on the next scene. */}
      {review !== null && (() => {
        const scene = review.scenes[review.index];
        if (!scene) {
          return null;
        }
        const isLast = review.index >= review.scenes.length - 1;
        const dismissLabel = isLast ? t.archiveCloseLabel : t.archiveNextLabel;
        const tapHintLabel = t.archiveTapHint;
        const advance = () => {
          if (isLast) {
            setReview(null);
          } else {
            setReview({ scenes: review.scenes, index: review.index + 1 });
          }
        };
        const renderScene = (): React.ReactNode => {
          if (scene.kind === 'overlay') {
            switch (scene.key) {
              case 'prologue':
                // Use the in-game PrologueScreen (art-first
                // tap-to-reveal) instead of the legacy single-overlay
                // PrologueOverlay so the archive feels identical to
                // the first-time experience.
                return (
                  <PrologueScreen
                    key={review.index}
                    t={t}
                    onNext={advance}
                    nextLabel={dismissLabel}
                  />
                );
              case 'intro:falling':
                return (
                  <FallingScreen key={review.index} t={t} onNext={advance} />
                );
              case 'intro:arrival':
                return (
                  <ArrivalScreen
                    key={review.index}
                    t={t}
                    onNext={advance}
                    nextLabel={dismissLabel}
                  />
                );
              case 'intro:gatewayClosed':
                return (
                  <GatewayClosedScreen
                    key={review.index}
                    t={t}
                    onNext={advance}
                    nextLabel={dismissLabel}
                  />
                );
              case 'intro:gatewayOpen':
                return (
                  <GatewayOpenScreen
                    key={review.index}
                    t={t}
                    onNext={advance}
                    nextLabel={dismissLabel}
                  />
                );
              case 'narrative:solitude':
                return (
                  <NarrativeOverlay
                    key={review.index}
                    scene={t.story.narrative.solitude}
                    imageBaseName="solitude"
                    tone={locale === 'ja' ? '幕間' : 'Interlude'}
                    dismissLabel={dismissLabel}
                    tapHintLabel={tapHintLabel}
                    onDismiss={advance}
                  />
                );
              case 'narrative:allies':
                return (
                  <NarrativeOverlay
                    key={review.index}
                    scene={t.story.narrative.allies}
                    imageBaseName="allies"
                    tone={locale === 'ja' ? '幕間' : 'Interlude'}
                    dismissLabel={dismissLabel}
                    tapHintLabel={tapHintLabel}
                    onDismiss={advance}
                  />
                );
              case 'narrative:final':
                return (
                  <NarrativeOverlay
                    key={review.index}
                    scene={t.story.narrative.final}
                    imageBaseName="final"
                    tone={locale === 'ja' ? '幕間' : 'Interlude'}
                    dismissLabel={dismissLabel}
                    tapHintLabel={tapHintLabel}
                    onDismiss={advance}
                  />
                );
              case 'narrative:trueEnding20B':
                return (
                  <NarrativeOverlay
                    key={review.index}
                    scene={t.story.narrative.trueEnding20B}
                    imageBaseName="trueEnding20B"
                    tone={locale === 'ja' ? '真エンディング' : 'True Ending'}
                    dismissLabel={dismissLabel}
                    tapHintLabel={tapHintLabel}
                    onDismiss={advance}
                  />
                );
              case 'narrative:trueEnding20C':
                return (
                  <NarrativeOverlay
                    key={review.index}
                    scene={t.story.narrative.trueEnding20C}
                    imageBaseName="trueEnding20C"
                    tone={locale === 'ja' ? '真エンディング' : 'True Ending'}
                    dismissLabel={dismissLabel}
                    tapHintLabel={tapHintLabel}
                    onDismiss={advance}
                  />
                );
              case 'narrative:trueEnding20D':
                return (
                  <NarrativeOverlay
                    key={review.index}
                    scene={t.story.narrative.trueEnding20D}
                    imageBaseName="chapter_20d_voidphi"
                    tone={locale === 'ja' ? '真エンディング' : 'True Ending'}
                    dismissLabel={dismissLabel}
                    tapHintLabel={tapHintLabel}
                    onDismiss={advance}
                  />
                );
              case 'narrative:opp22.intro':
                return (
                  <NarrativeOverlay
                    key={review.index}
                    scene={t.story.opp22.intro}
                    imageBaseName="chapter_20d_voidphi"
                    tone={locale === 'ja' ? 'OPP22 章' : 'OPP22 Chapter'}
                    dismissLabel={dismissLabel}
                    tapHintLabel={tapHintLabel}
                    onDismiss={advance}
                  />
                );
              case 'narrative:opp22.victoryNarration':
                return (
                  <NarrativeOverlay
                    key={review.index}
                    scene={t.story.opp22.victoryNarration}
                    imageBaseName="chapter_20d_voidphi"
                    tone={locale === 'ja' ? 'OPP22 章' : 'OPP22 Chapter'}
                    dismissLabel={dismissLabel}
                    tapHintLabel={tapHintLabel}
                    onDismiss={advance}
                  />
                );
              case 'ending':
                return (
                  <NarrativeOverlay
                    key={review.index}
                    scene={t.story.endingFull}
                    imageBaseName="ending"
                    tone={locale === 'ja' ? '終章' : 'Finale'}
                    dismissLabel={dismissLabel}
                    tapHintLabel={tapHintLabel}
                    onDismiss={advance}
                  />
                );
              default:
                return null;
            }
          }
          // Per-chapter narrative scene. Pull the chapter's localized
          // story content + opponent metadata for header + art.
          const story = t.story.chapterStories[scene.chapter - 1];
          const opp = COMPUTERS.find((c) => c.level === scene.chapter);
          if (!story || !opp) return null;
          return (
            <ChapterStoryOverlay
              key={review.index}
              chapter={scene.chapter}
              opponentName={opp.name}
              chapterArtBase={opp.chapterArtBase}
              story={story}
              heading={t.archiveChapterHeading(scene.chapter, opp.name)}
              proseHeadingIntro={t.archiveBlockIntro}
              proseHeadingBossPre={t.archiveBlockBossPre}
              proseHeadingBossPost={t.archiveBlockBossPost}
              proseHeadingVictoryDialogue={t.archiveBlockVictoryDialogue}
              proseHeadingVictoryNarration={t.archiveBlockVictoryNarration}
              dismissLabel={dismissLabel}
              tapHintLabel={tapHintLabel}
              onDismiss={advance}
            />
          );
        };
        return (
          <>
            {renderScene()}
            {/* × close button — soft exit at any point of the chain.
                z-[90] sits above every overlay (overlays use z-[70-80]).
                Position fixed so it stays put even if the inner scene
                scrolls. */}
            <button
              type="button"
              onClick={() => setReview(null)}
              aria-label={t.archiveCloseLabel}
              title={t.archiveCloseLabel}
              className="fixed top-3 right-3 z-[90] w-10 h-10 flex items-center justify-center rounded-full bg-zinc-950/75 border border-amber-200/40 hover:border-amber-200/80 text-amber-100 hover:bg-zinc-950/90 jp-display text-xl leading-none backdrop-blur-sm"
            >
              ×
            </button>
            {/* Page indicator — small floating chip at top-left so the
                player knows where they are in the chronicle without
                cluttering the scene itself. */}
            <div className="fixed top-3 left-3 z-[90] px-3 py-1.5 rounded-sm bg-zinc-950/65 border border-amber-200/25 latin-display italic text-amber-200/75 text-[11px] tracking-wider tabular-nums backdrop-blur-sm pointer-events-none">
              {t.archivePageCounter(review.index + 1, review.scenes.length)}
            </div>
          </>
        );
      })()}
    </>
  );
}

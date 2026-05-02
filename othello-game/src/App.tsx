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
  FolderOpen,
  Home,
  Info,
  Lightbulb,
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
  getStoryProgress,
  listSlots,
  saveSlot as storageSaveSlot,
  setStoryProgress as storageSetStoryProgress,
  type AiMode,
  type GameMode,
  type MoveRecord,
  type SavedSlot,
} from './storage/saveGame';
import { useLocale } from './i18n/useLocale';
import type { Messages } from './i18n/messages';
import { TitleScreen, type TitleStartMode } from './components/TitleScreen';

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
}

interface ComputerEntry {
  kanji: string;
  name: string;
  level: number;
  quote: string;
  image: string;
}

const AVATARS: ReadonlyArray<AvatarEntry> = [
  { kanji: '春', name: 'ハルキ',   setting: '異世界転生の勇者',      quote: '冒険、はじまったな',   image: '/avatars/players/PLR01_haruki.png' },
  { kanji: '琴', name: '美琴',     setting: '魔法学園の天才',        quote: '論理と魔法は同じ',     image: '/avatars/players/PLR02_mikoto.png' },
  { kanji: '凛', name: 'リン',     setting: 'VRMMOの最強プレイヤー', quote: '現実より、得意なんだ', image: '/avatars/players/PLR03_rin.png' },
  { kanji: '蓮', name: '蓮',       setting: '剣道部主将',            quote: '正々堂々、参る',       image: '/avatars/players/PLR04_ren.png' },
  { kanji: '千', name: '千歳',     setting: 'タイムリープ少女',      quote: 'これで何度目だっけ',   image: '/avatars/players/PLR05_chitose.png' },
  { kanji: '晴', name: '晴',       setting: '現代の陰陽師',          quote: '妖、見えてるんだ',     image: '/avatars/players/PLR06_haru.png' },
  { kanji: '海', name: 'カイ',     setting: '空の冒険者',            quote: '風が呼んでる',         image: '/avatars/players/PLR07_kai.png' },
  { kanji: '夏', name: '千夏',     setting: '聖剣の村娘',            quote: '故郷を、必ず守る',     image: '/avatars/players/PLR08_chinatsu.png' },
  { kanji: '透', name: '透',       setting: '学園名探偵',            quote: '謎には必ず答えがある', image: '/avatars/players/PLR09_toru.png' },
  { kanji: 'ノ', name: 'ノア',     setting: '未来から来た少女',      quote: '2099年から、よろしく', image: '/avatars/players/PLR10_noa.png' },
  { kanji: '凪', name: '凪',       setting: '異世界料理人',          quote: 'お腹空いてる？',       image: '/avatars/players/PLR11_nagi.png' },
  { kanji: 'エ', name: 'エル',     setting: '元魔王、今は転校生',    quote: 'ふふ、内緒だよ',       image: '/avatars/players/PLR12_el.png' },
  { kanji: '菫', name: 'スミレ',   setting: '記憶喪失の冒険者',      quote: '私は…誰なの？',        image: '/avatars/players/PLR13_sumire.png' },
  { kanji: '葉', name: '葉月',     setting: '機械工学の天才',        quote: 'これ、私が作ったの！', image: '/avatars/players/PLR14_hazuki.png' },
  { kanji: '隼', name: '隼人',     setting: '凄腕ガンナー',          quote: '撃つときは迷わない',   image: '/avatars/players/PLR15_hayato.png' },
  { kanji: '光', name: 'ひかり',   setting: '光の精霊使い',          quote: 'みんな、笑ってほしい', image: '/avatars/players/PLR16_hikari.png' },
  { kanji: '夜', name: 'ヨル',     setting: '半吸血鬼',              quote: '血は、欲しくない',     image: '/avatars/players/PLR17_yoru.png' },
  { kanji: '湊', name: '湊',       setting: '海の冒険者',            quote: '世界の果てへ',         image: '/avatars/players/PLR18_minato.png' },
  { kanji: '奏', name: '奏太',     setting: '天才ピアニスト',        quote: 'この旋律、聴いてくれ', image: '/avatars/players/PLR19_souta.png' },
  { kanji: '悠', name: '悠',       setting: '神話の英雄',            quote: '神々よ、いざ尋常に',   image: '/avatars/players/PLR20_yu.png' },
];

const COMPUTERS: ReadonlyArray<ComputerEntry> = [
  { kanji: '苺', name: 'いちか',   level: 1,  quote: 'ふぁいとぉ♪ 楽しんで！',       image: '/avatars/opponents/OPP01_ichika.png' },
  { kanji: '葵', name: '葵',       level: 2,  quote: '狙いはバッチリだよっ！',         image: '/avatars/opponents/OPP02_aoi.png' },
  { kanji: '朝', name: '朝日',     level: 3,  quote: 'いざ尋常に！',                   image: '/avatars/opponents/OPP03_asahi.png' },
  { kanji: '撫', name: 'なでしこ', level: 4,  quote: '無理せずいきましょう',           image: '/avatars/opponents/OPP04_nadeshiko.png' },
  { kanji: '響', name: '響',       level: 5,  quote: '楽しい一局を奏でよう♪',         image: '/avatars/opponents/OPP05_hibiki.png' },
  { kanji: '紬', name: 'つむぎ',   level: 6,  quote: '相棒もわくわくしてる',           image: '/avatars/opponents/OPP06_tsumugi.png' },
  { kanji: '茜', name: '茜',       level: 7,  quote: '歯車みたいにかっちりね！',       image: '/avatars/opponents/OPP07_akane.png' },
  { kanji: '薬', name: 'メル',     level: 8,  quote: 'ふふ、ちょっと混ぜてみよっか？', image: '/avatars/opponents/OPP08_mel.png' },
  { kanji: '悟', name: '悟',       level: 9,  quote: '無心に石を置く、ただそれだけ',   image: '/avatars/opponents/OPP09_satoru.png' },
  { kanji: '黒', name: 'シキ',     level: 10, quote: '気付いた時には遅いよ',           image: '/avatars/opponents/OPP10_shiki.png' },
  { kanji: '詩', name: 'シオン',   level: 11, quote: 'すべては予測の内だ',             image: '/avatars/opponents/OPP11_shion.png' },
  { kanji: '夢', name: 'ルナ',     level: 12, quote: '夢の中でもう勝ってるよ♡',       image: '/avatars/opponents/OPP12_luna.png' },
  { kanji: '雪', name: '雪乃',     level: 13, quote: 'この程度、解析するまでもない',   image: '/avatars/opponents/OPP13_yukino.png' },
  { kanji: '暁', name: 'アキラ',   level: 14, quote: '君の手筋、見えているよ',         image: '/avatars/opponents/OPP14_akira.png' },
  { kanji: '銀', name: 'シエル',   level: 15, quote: '全データ把握、戦況優位',         image: '/avatars/opponents/OPP15_ciel.png' },
  { kanji: '姫', name: 'アリア',   level: 16, quote: 'お手柔らかに、ですわ',           image: '/avatars/opponents/OPP16_aria.png' },
  { kanji: '獅', name: 'レオン',   level: 17, quote: '正々堂々、参る！',               image: '/avatars/opponents/OPP17_leon.png' },
  { kanji: '宗', name: '宗次郎',   level: 18, quote: '我が一刀、避けられはせぬ',       image: '/avatars/opponents/OPP18_sojiro.png' },
  { kanji: '嵐', name: '嵐',       level: 19, quote: '我が竜の前に膝を折れ！',         image: '/avatars/opponents/OPP19_arashi.png' },
  { kanji: '零', name: 'ゼロ',     level: 20, quote: '全ての変分は計算済み。詰みだ',   image: '/avatars/opponents/OPP20_zero.png' },
];

const STORY_INTRO = `君は気づくと不思議な世界にいた。
そこは『盤上世界』—— 黒と白の石が舞い、20人の達人が住む異界。
すべてを打ち破った者だけが、現実への扉を開けるという。`;

const STORY_ENDING = `君は20人すべての達人を打ち破った。
盤上世界の扉が開き、現実への光が差し込む——
君の盤上の旅は、ここに完結する。`;

const STORY_CHAPTERS: ReadonlyArray<string> = [
  '最初の住人はアイドル「苺花」。歌うように軽やかな手筋を打つ。',
  '弓使い「葵」。盤の隅を狙う鋭い射撃のような一手。',
  '若き剣士「朝日」。真っ向勝負、剣術のごとき正道の打ち回し。',
  '治療師「なでしこ」。守り重視、相手のミスを待つ穏やかな戦い方。',
  '吟遊詩人「響」。リズムを刻むように石を置き、盤に旋律を生む。',
  '獣使い「つむぎ」。直感と野生の勘で予測を超えてくる。',
  '技師「茜」。歯車のように噛み合った精密な手筋。',
  '錬金術師「メル」。盤面を実験のように混ぜ合わせ、新たな解を導く。',
  '修行僧「悟」。無心の打ち回し、読まれぬ静の極致。',
  '盗賊「シキ」。盤の死角を突く、影の手筋。',
  '魔術師「シオン」。冷静な計算と先読みで全てを見通す。',
  '夢の魔女「ルナ」。幻のような曲線で君を翻弄する。',
  '軍師「雪乃」。盤を戦場とみなし、論理で詰める。',
  '探偵「アキラ」。君の手筋を読み切り、罠を逆手に取る。',
  'サイバー斥候「シエル」。データ最適化された手筋を高速で繰り出す。',
  '姫「アリア」。優雅にして致命、王者の一手。',
  '騎士「レオン」。正々堂々の正攻法、しかし鉄壁。',
  '侍「宗次郎」。一刀のごとき必殺の一手。',
  '竜騎士「嵐」。圧倒的な勢いで盤を制圧する古典の極北。',
  '最後の門番「ゼロ」。盤上世界を支配する究極のハッカー。すべての変分を計算し終えた。',
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
          </div>
          {quote && (
            <div className="jp-display text-amber-200/45 text-[11px] md:text-xs italic truncate mt-0.5">
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
          <div className="jp-display text-amber-100/70 text-sm tracking-wider">
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
      <div className="flex justify-between latin-display italic text-amber-200/30 text-[10px] mt-1.5 px-1">
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

  // Settings state
  const [gameMode, setGameMode] = useState<GameMode>('ai');
  const [p1Avatar, setP1Avatar] = useState(0);
  const [p2Avatar, setP2Avatar] = useState(1);
  const [computerChar, setComputerChar] = useState(0);
  const [level, setLevel] = useState(1);
  const [aiMode, setAiMode] = useState<AiMode>('story');
  const [storyProgress, setStoryProgress] = useState(0);
  const [storyJustAdvanced, setStoryJustAdvanced] = useState(false);

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

  const ai = useAiWorker();
  const { locale, setLocale, t } = useLocale();

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
  const gameOver = noCurrent && noOpp;
  const isHumanTurn = gameMode === 'human' || currentColor === BLACK;

  /* ----- Effects ----- */

  // Load persisted story progress on mount
  useEffect(() => {
    let cancelled = false;
    getStoryProgress().then((p) => {
      if (!cancelled) setStoryProgress(p);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Sync opponent character/level to story progress when in story mode
  useEffect(() => {
    if (aiMode === 'story' && gameMode === 'ai') {
      const targetLevel = Math.min(Math.max(storyProgress + 1, 1), 20);
      const idx = COMPUTERS.findIndex((c) => c.level === targetLevel);
      if (idx >= 0) {
        setComputerChar(idx);
        setLevel(targetLevel);
      }
    }
  }, [aiMode, storyProgress, gameMode]);

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

  // Advance story progress on player win in story mode
  useEffect(() => {
    if (
      gameOver &&
      !storyJustAdvanced &&
      aiMode === 'story' &&
      gameMode === 'ai' &&
      storyProgress < 20 &&
      counts.black > counts.white
    ) {
      const newP = storyProgress + 1;
      setStoryProgress(newP);
      void storageSetStoryProgress(newP);
      setStoryJustAdvanced(true);
    }
  }, [gameOver, aiMode, gameMode, storyProgress, storyJustAdvanced, counts.black, counts.white]);

  // Cancel hint when turn changes
  useEffect(() => {
    setHintMove(null);
  }, [currentColor]);

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
    setStoryJustAdvanced(false);
    setKifu([]);
    ai.cancel();
  }

  function startGame(selection: TitleStartMode) {
    if (selection.mode === 'human') {
      setGameMode('human');
    } else {
      setGameMode('ai');
      setAiMode(selection.sub);
    }
    reset();
    setScreen('game');
  }

  function resetStoryProgress() {
    setStoryProgress(0);
    setStoryJustAdvanced(false);
    void storageSetStoryProgress(0);
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

  function loadKifuMoves(savedKifu: MoveRecord[]) {
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
    setStoryJustAdvanced(false);
    setKifuOpen(false);
    ai.cancel();
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
    ? counts.black > counts.white
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
            radial-gradient(ellipse 80% 50% at 50% -10%, rgba(201, 169, 97, 0.08), transparent 60%),
            radial-gradient(ellipse 60% 40% at 50% 100%, rgba(31, 88, 71, 0.15), transparent 60%),
            linear-gradient(180deg, #14110a 0%, #0a0805 100%);
        }
        .stage-bg::before {
          content: ''; position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.7 0 0 0 0 0.6 0 0 0 0 0.4 0 0 0 0.5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.07; mix-blend-mode: overlay; pointer-events: none;
        }

        .board-felt {
          background:
            radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.06), transparent 55%),
            radial-gradient(ellipse at 70% 85%, rgba(0,0,0,0.35), transparent 55%),
            linear-gradient(135deg, #1f5847 0%, #143830 100%);
          box-shadow:
            inset 0 0 60px rgba(0,0,0,0.45),
            0 30px 60px -15px rgba(0,0,0,0.7),
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
        />
      )}

      {screen === 'game' && (
      <div className="stage-bg min-h-screen w-full relative">
        <div className="relative max-w-5xl mx-auto px-4 py-6 md:py-10">
          {/* Top icon toolbar */}
          <div className="grid grid-cols-7 gap-px bg-zinc-900/80 border-y border-amber-200/15 mb-5 md:rounded-sm overflow-hidden">
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
          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 items-center">
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
              />
            </div>

            <div className="md:order-2">
              <div className="board-felt p-3 md:p-4 rounded-sm relative">
                <div style={{ width: 'min(86vw, 520px)' }}>
                  <div className="flex mb-1">
                    <div style={{ width: 18 }} />
                    <div className="flex-1 grid grid-cols-8">
                      {Array.from({ length: 8 }, (_, c) => (
                        <div
                          key={c}
                          className="text-center latin-display italic text-amber-200/45 text-[10px] md:text-xs"
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
                          className="flex-1 flex items-center justify-center latin-display italic text-amber-200/45 text-[10px] md:text-xs"
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
            <div className="flex justify-between mt-1.5 latin-display italic text-amber-200/40 text-xs tracking-wider">
              <span>{counts.black} {t.black}</span>
              <span>{t.white} {counts.white}</span>
            </div>
          </div>

          <div className="text-center mt-6 latin-display italic text-amber-200/30 text-xs tracking-[0.3em] uppercase">
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
          {gameOver && !settingsOpen && (() => {
            const isStoryMode = aiMode === 'story' && gameMode === 'ai';
            const justAdvanced = isStoryMode && storyJustAdvanced;
            const justCompletedStory = justAdvanced && storyProgress >= 20;
            const showNextChapter = justAdvanced && storyProgress < 20;
            const nextOpp = showNextChapter
              ? COMPUTERS.find((c) => c.level === storyProgress + 1)
              : null;
            const playedChapter = justAdvanced ? storyProgress : storyProgress + 1;

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
                      {STORY_ENDING}
                    </p>
                  )}
                  {showNextChapter && nextOpp && (
                    <p className="jp-display text-amber-100/80 text-sm leading-relaxed mb-5">
                      {t.nextOpponentIs(nextOpp.name)}
                    </p>
                  )}
                  {isStoryMode && winner !== BLACK && (
                    <p className="jp-display text-amber-200/60 text-sm italic mb-5">
                      {t.storyEncouragement}
                    </p>
                  )}

                  <div className="flex justify-center items-center gap-6 md:gap-8 my-6">
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
                      <div className="latin-display text-3xl md:text-4xl text-amber-100 leading-none">
                        {counts.black}
                      </div>
                    </div>
                    <div className="latin-display italic text-amber-200/40 text-xl">vs</div>
                    <div className="flex flex-col items-center gap-2">
                      <AvatarBadge
                        kanji={whiteInfo.kanji}
                        idx={whiteInfo.idx}
                        image={whiteInfo.image}
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
                      <div className="latin-display text-3xl md:text-4xl text-amber-100 leading-none">
                        {counts.white}
                      </div>
                    </div>
                  </div>

                  {!isStoryMode && gameMode === 'ai' && (
                    <p className="jp-display text-amber-200/60 text-sm italic mb-2">
                      「
                      {winner === BLACK
                        ? 'お見事…次は本気を出す'
                        : winner === WHITE
                          ? 'まだまだじゃな'
                          : '互角の戦い、見事だ'}
                      」
                    </p>
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
                  <div className="latin-display italic text-amber-200/45 text-[10px] tracking-[0.25em] uppercase mb-1">
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
                    <div className="latin-display italic text-amber-200/45 text-[10px] tracking-[0.25em] uppercase mb-1">
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
                    <div className="latin-display italic text-amber-200/45 text-[10px] tracking-[0.25em] uppercase mb-1">
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
                    <div className="latin-display italic text-amber-200/45 text-[10px] tracking-wider uppercase">
                      {t.statMove}
                    </div>
                    <div className="latin-display tabular-nums text-amber-100 text-xl">
                      {kifu.length}
                    </div>
                  </div>
                  <div className="px-2 py-2 bg-amber-200/[0.03] border border-amber-200/15 rounded-sm">
                    <div className="latin-display italic text-amber-200/45 text-[10px] tracking-wider uppercase">
                      {t.statEmpty}
                    </div>
                    <div className="latin-display tabular-nums text-amber-100 text-xl">
                      {64 - counts.black - counts.white}
                    </div>
                  </div>
                  <div className="px-2 py-2 bg-amber-200/[0.03] border border-amber-200/15 rounded-sm">
                    <div className="latin-display italic text-amber-200/45 text-[10px] tracking-wider uppercase">
                      {t.statTurn}
                    </div>
                    <div className="jp-display text-amber-100 text-base mt-1">
                      {currentColor === BLACK ? t.black : t.white}
                    </div>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="latin-display italic text-amber-200/45 text-[10px] tracking-[0.25em] uppercase mb-2">
                    {t.kifuHeading}
                  </div>
                  {kifu.length === 0 ? (
                    <p className="jp-display italic text-amber-200/40 text-xs">
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
                              <span className="text-amber-200/40 w-5 text-right">{i + 1}.</span>
                              <span className="text-zinc-300">●</span>
                              <span>{black ? moveToNotation(black).toUpperCase() : ''}</span>
                            </div>
                            <div className="latin-display tabular-nums text-amber-100/90 text-xs flex gap-2">
                              <span className="text-amber-200/40">○</span>
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
                      className="jp-display flex-1 px-3 py-2 bg-zinc-950/70 border border-amber-200/20 rounded-sm text-amber-100 text-sm placeholder:text-amber-200/30 focus:border-amber-200/60 focus:outline-none"
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
                    <p className="jp-display italic text-amber-200/40 text-sm py-3">
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
                              <div className="latin-display italic text-amber-200/40 text-[10px] tracking-wider mt-0.5">
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
                              </div>
                            </div>
                            <button
                              onClick={() => loadKifuMoves(slot.kifu ?? [])}
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

                <section className="mb-7">
                  <h3 className="jp-display text-amber-100/90 text-sm md:text-base tracking-[0.25em] mb-3 pb-2 border-b border-amber-200/15">
                    {t.protagonist}
                    <span className="latin-display italic text-amber-200/40 text-xs ml-2 normal-case tracking-wider">
                      — {t.protagonistSubtitle}
                    </span>
                  </h3>
                  <div className="grid grid-cols-4 md:grid-cols-5 gap-2.5 md:gap-3">
                    {AVATARS.map((a, i) => (
                      <button
                        key={i}
                        onClick={() => setP1Avatar(i)}
                        className={`p-2.5 md:p-3 rounded-sm border transition-all flex flex-col items-center gap-1.5 ${
                          p1Avatar === i
                            ? 'border-amber-200/70 bg-amber-200/[0.06]'
                            : 'border-amber-200/15 hover:border-amber-200/40 hover:bg-amber-200/[0.02]'
                        }`}
                      >
                        <AvatarBadge kanji={a.kanji} idx={i} image={a.image} size="sm" />
                        <div className="jp-display text-amber-100/90 text-[11px] md:text-xs leading-tight text-center">
                          {a.name}
                        </div>
                        <div
                          className={`jp-display text-[9px] md:text-[10px] leading-tight tracking-wide text-center ${
                            p1Avatar === i ? 'text-amber-200/70' : 'text-amber-200/40'
                          }`}
                        >
                          {a.setting}
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 px-3 py-2.5 bg-amber-200/[0.03] border border-amber-200/15 rounded-sm">
                    <div className="jp-display text-amber-100/85 text-sm">
                      {AVATARS[p1Avatar].name}
                      <span className="latin-display italic text-amber-200/40 text-xs ml-2">
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
                    <span className="latin-display italic text-amber-200/40 text-xs ml-2 normal-case tracking-wider">
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
                                {STORY_INTRO}
                              </p>
                            )}

                            {!isComplete ? (
                              <div className="border border-amber-200/30 bg-amber-200/[0.04] rounded-sm p-4">
                                <div className="latin-display italic ornament text-[10px] uppercase mb-2">
                                  — Chapter {targetLevel} —
                                </div>
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
                                  {STORY_CHAPTERS[storyProgress]}
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
                                  {STORY_ENDING}
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
                            <div className="latin-display italic text-amber-200/45 text-xs tracking-[0.25em] uppercase mb-2">
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
                                        : 'text-amber-200/40'
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
                            <p className="latin-display italic text-amber-200/35 text-[11px] mt-3 leading-relaxed">
                              {t.aiLevelExplain}
                            </p>
                          </div>
                        </>
                      )}
                    </>
                  )}

                  {gameMode === 'human' && (
                    <div>
                      <div className="latin-display italic text-amber-200/45 text-xs tracking-[0.25em] uppercase mb-2">
                        {t.player2Protagonist}
                      </div>
                      <div className="grid grid-cols-4 md:grid-cols-5 gap-2.5 md:gap-3">
                        {AVATARS.map((a, i) => (
                          <button
                            key={i}
                            onClick={() => p1Avatar !== i && setP2Avatar(i)}
                            disabled={p1Avatar === i}
                            className={`p-2.5 md:p-3 rounded-sm border transition-all flex flex-col items-center gap-1.5 ${
                              p2Avatar === i
                                ? 'border-amber-200/70 bg-amber-200/[0.06]'
                                : 'border-amber-200/15 hover:border-amber-200/40 hover:bg-amber-200/[0.02]'
                            } ${p1Avatar === i ? 'opacity-40 cursor-not-allowed' : ''}`}
                          >
                            <AvatarBadge
                              kanji={a.kanji}
                              idx={i + 50}
                              image={a.image}
                              size="sm"
                              dim={p1Avatar === i}
                            />
                            <div className="jp-display text-amber-100/90 text-[11px] md:text-xs leading-tight text-center">
                              {a.name}
                            </div>
                            <div
                              className={`jp-display text-[9px] md:text-[10px] leading-tight tracking-wide text-center ${
                                p2Avatar === i ? 'text-amber-200/70' : 'text-amber-200/40'
                              }`}
                            >
                              {a.setting}
                            </div>
                          </button>
                        ))}
                      </div>
                      {p1Avatar === p2Avatar && (
                        <p className="jp-display text-amber-200/40 text-xs mt-2 italic">
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
    </>
  );
}

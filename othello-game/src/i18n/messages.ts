export type Locale = 'ja' | 'en';

export interface Messages {
  // App identity
  appTitle: string;
  appSubtitle: string;
  worldName: string;

  // Title screen
  titleSubhead: string;
  titleStoryLabel: string;
  titleFreeLabel: string;
  titleTwoPlayersLabel: string;
  titleStoryHeading: string;
  titleFreeHeading: string;
  titleTwoPlayersHeading: string;
  titleStoryDesc: string;
  titleFreeDesc: string;
  titleTwoPlayersDesc: string;
  titleFooterHint: string;
  titleFreeMeta: string;
  titleTwoPlayersMeta: string;
  titleStoryFreshStart: (name: string) => string;
  titleStoryContinue: (n: number) => string;
  titleStoryCompleted: string;
  titleStoryCompletedLabel: string;

  // Toolbar
  toolbarTitle: string;
  toolbarMenu: string;
  toolbarHint: string;
  toolbarUndo: string;
  toolbarInfo: string;
  toolbarReset: string;
  toolbarKifu: string;

  // Score colors
  black: string;
  white: string;

  // Pass / game-over
  passMessage: (color: string) => string;
  resultDraw: string;
  resultBlackWin: string;
  resultWhiteWin: string;
  storyVictory: string;
  storyDefeat: string;
  storyDraw: string;
  storyEnding: string;

  // Game-over modal
  finalResult: string;
  storyComplete: string;
  chapterN: (n: number) => string;
  nextChapter: string;
  retryStory: string;
  oneMore: string;
  retryStoryFromStart: string;
  storyEncouragement: string;
  nextOpponentIs: (name: string) => string;

  // Match info modal
  matchInfo: string;
  mode: string;
  modeHuman: string;
  modeStoryProgress: (n: number) => string;
  modeStoryComplete: string;
  modeFreeLevel: (lv: number, label: string) => string;
  statMove: string;
  statEmpty: string;
  statTurn: string;
  kifuHeading: string;
  noMovesYet: string;

  // Kifu modal
  kifuLibrary: string;
  saveCurrent: string;
  saveButton: string;
  saveHintEmpty: string;
  saveHintInfo: (moves: number, summary: string) => string;
  inputPlaceholder: string;
  savedGames: string;
  noSavedGames: string;
  loadButton: string;
  blackWinShort: string;
  whiteWinShort: string;
  drawShort: string;

  // Settings modal
  setup: string;
  protagonist: string;
  protagonistSubtitle: string;
  opponent: string;
  opponentSubtitle: string;
  vsAi: string;
  vsHuman: string;
  storyMode: string;
  freeMode: string;
  player2Protagonist: string;
  cannotChooseSelf: string;
  startNewGame: string;
  keepSettings: string;
  progress: string;
  characterGridLabel: string;
  aiLevelExplain: string;

  // Common
  close: string;
  delete: string;

  // Level labels
  levelEntry: string;
  levelBeginner: string;
  levelMid: string;
  levelHigh: string;
  levelMaster: string;
  levelExpert: string;
  levelLow: string; // "1 入門"
  levelMidLabel: string; // "10 中級"
  levelMaxLabel: string; // "20 達人"

  // Footer caption
  footerHuman: string;
  footerStoryComplete: (name: string) => string;
  footerChapter: (n: number, name: string) => string;
  footerFree: (name: string, lv: number, label: string) => string;

  // Settings UI bits
  language: string;

  // Story prose
  storyIntro: string;
  storyEndingProse: string;
  storyChapters: ReadonlyArray<string>;

  // Hardcoded opponent quotes shown after a non-story AI match
  gameOverAiQuoteWin: string;
  gameOverAiQuoteLose: string;
  gameOverAiQuoteDraw: string;

  // Post-game Claude review
  reviewMatchButton: string;
  reviewTitle: string;
  reviewSubtitle: string;
  reviewLoading: string;
  reviewByClaude: string;
  reviewCancel: string;
  reviewRegenerate: string;
  reviewError: (message: string) => string;
  reviewEmpty: string;
}

export const ja: Messages = {
  appTitle: '転生したらオセロ世界でした！',
  appSubtitle: 'Reincarnated as an Othello Player',
  worldName: '盤上世界',

  titleSubhead: '異界『盤上世界』で、20人の達人を打ち破れ',
  titleStoryLabel: 'Story',
  titleFreeLabel: 'Free',
  titleTwoPlayersLabel: 'Two Players',
  titleStoryHeading: 'ストーリー',
  titleFreeHeading: 'フリー対戦',
  titleTwoPlayersHeading: '二人対戦',
  titleStoryDesc: '異世界『盤上世界』に転生し、20人の達人を順に打ち破る物語。',
  titleFreeDesc: '20体の対戦相手と1〜20の難易度を自由に組み合わせて。',
  titleTwoPlayersDesc: '一台の端末を共有して、二人で交互に打つ。',
  titleFooterHint: '— Tap a mode to begin —',
  titleFreeMeta: 'キャラクター ・ レベル ・ アバター 自由設定',
  titleTwoPlayersMeta: '黒 ・ 白 それぞれにキャラクター',
  titleStoryFreshStart: (name) => `第1章 ・ ${name} から始まる`,
  titleStoryContinue: (n) => `第${n}章から続きを`,
  titleStoryCompleted: 'エンディング到達済 ・ もう一度挑む',
  titleStoryCompletedLabel: 'Completed',

  toolbarTitle: 'タイトル',
  toolbarMenu: '設定',
  toolbarHint: 'ヒント',
  toolbarUndo: '待った',
  toolbarInfo: '情報',
  toolbarReset: '新規',
  toolbarKifu: '棋譜',

  black: '黒',
  white: '白',

  passMessage: (color) => `${color}は打てる場所がありません — パス`,
  resultDraw: '引き分け',
  resultBlackWin: '黒の勝ち',
  resultWhiteWin: '白の勝ち',
  storyVictory: '勝利',
  storyDefeat: '敗北',
  storyDraw: '引き分け',
  storyEnding: 'エンディング',

  finalResult: '— Final Result —',
  storyComplete: '— Story Complete —',
  chapterN: (n) => `— Chapter ${n} —`,
  nextChapter: '次の章へ →',
  retryStory: 'もう一度ストーリーを',
  oneMore: 'もう一度',
  retryStoryFromStart: 'ストーリーを最初から',
  storyEncouragement: 'まだ届かぬか…もう一度挑むがよい',
  nextOpponentIs: (name) => `次の対戦相手は 『${name}』`,

  matchInfo: '対局情報',
  mode: 'Mode',
  modeHuman: '二人対戦',
  modeStoryProgress: (n) => `ストーリー · 第${n}章`,
  modeStoryComplete: 'ストーリー · 完結',
  modeFreeLevel: (lv, label) => `フリー · Lv.${lv} ${label}`,
  statMove: 'Move',
  statEmpty: 'Empty',
  statTurn: 'Turn',
  kifuHeading: 'Kifu — 棋譜',
  noMovesYet: 'まだ手が指されていません',

  kifuLibrary: '棋譜・保存と読込',
  saveCurrent: '現在の対局を保存',
  saveButton: '保存',
  saveHintEmpty: '※ まだ手が指されていません。1手以上指してから保存できます。',
  saveHintInfo: (moves, summary) => `${moves}手・${summary}`,
  inputPlaceholder: '棋譜の名前（例：vs 朝日 大逆転）',
  savedGames: '保存済みの棋譜',
  noSavedGames: '保存された棋譜はまだありません',
  loadButton: '読込',
  blackWinShort: '黒勝',
  whiteWinShort: '白勝',
  drawShort: '引分',

  setup: '設定',
  protagonist: '主人公',
  protagonistSubtitle: 'Choose your protagonist',
  opponent: '対戦相手',
  opponentSubtitle: 'Opponent',
  vsAi: 'AIと対戦',
  vsHuman: '二人対戦',
  storyMode: 'ストーリー',
  freeMode: 'フリー',
  player2Protagonist: 'Player 2 protagonist',
  cannotChooseSelf: '※あなたと同じ名は選べません',
  startNewGame: '新しい対局を開始',
  keepSettings: 'この設定で続ける',
  progress: 'Progress',
  characterGridLabel: 'Character — 二十人の対戦相手',
  aiLevelExplain:
    'Lv.1–5 random / greedy ・ Lv.6–9 positional ・ Lv.10–14 1–2-ply search ・ Lv.15–17 3-ply ・ Lv.18–20 4-ply minimax with mobility & disc parity.',

  close: '閉じる',
  delete: '削除',

  levelEntry: '入門',
  levelBeginner: '初級',
  levelMid: '中級',
  levelHigh: '上級',
  levelMaster: '達人',
  levelExpert: '高段者',
  levelLow: '1 入門',
  levelMidLabel: '10 中級',
  levelMaxLabel: '20 達人',

  footerHuman: 'Two players · 二人対戦',
  footerStoryComplete: (name) => `ストーリー完結 · vs ${name}`,
  footerChapter: (n, name) => `第${n}章 · vs ${name}`,
  footerFree: (name, lv, label) => `vs ${name} · Lv.${lv} ${label}`,

  language: '言語',

  storyIntro: `——気づくと、君は見知らぬ世界にいた。
そこは異界『盤上世界』。黒と白の石が舞い、20人の達人が住むという。
「すべての達人を打ち破った者だけが、元の世界へ還れる」
そう告げる声が、盤の上から響いた。
転生したらオセロ世界でした——君の物語が、いま始まる。`,

  storyEndingProse: `君は20人すべての達人を打ち破った。
盤上世界の扉が開き、現実への光が差し込む——
君の盤上の旅は、ここに完結する。`,

  storyChapters: [
    '最初の住人はアイドル「いちか」。歌うように軽やかな手筋を打つ。',
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
  ],

  gameOverAiQuoteWin: 'お見事…次は本気を出す',
  gameOverAiQuoteLose: 'まだまだじゃな',
  gameOverAiQuoteDraw: '互角の戦い、見事だ',

  reviewMatchButton: 'この対局をレビュー',
  reviewTitle: '対局レビュー',
  reviewSubtitle: 'Claude による講評',
  reviewLoading: 'Claude が考えています…',
  reviewByClaude: 'Powered by Claude (Sonnet 4.6)',
  reviewCancel: '中止',
  reviewRegenerate: '再生成',
  reviewError: (message) => `レビューを取得できませんでした：${message}`,
  reviewEmpty: '棋譜が空のためレビューできません。',
};

export const en: Messages = {
  appTitle: 'Reincarnated as an Othello Player',
  appSubtitle: '転生したらオセロ世界でした！',
  worldName: 'Bansho Sekai',

  titleSubhead: 'Defeat the 20 masters of the board world.',
  titleStoryLabel: 'Story',
  titleFreeLabel: 'Free',
  titleTwoPlayersLabel: 'Two Players',
  titleStoryHeading: 'Story',
  titleFreeHeading: 'Free Match',
  titleTwoPlayersHeading: 'Two Players',
  titleStoryDesc: 'Reincarnate into Bansho Sekai and defeat 20 masters one chapter at a time.',
  titleFreeDesc: 'Mix any of the 20 opponents with difficulty levels 1 through 20.',
  titleTwoPlayersDesc: 'Share one device and take turns playing each other.',
  titleFooterHint: '— Tap a mode to begin —',
  titleFreeMeta: 'Character · Level · Avatar all configurable',
  titleTwoPlayersMeta: 'Pick a character for Black and White',
  titleStoryFreshStart: (name) => `Chapter 1 · starts with ${name}`,
  titleStoryContinue: (n) => `Resume from Chapter ${n}`,
  titleStoryCompleted: 'Ending reached · take it on again',
  titleStoryCompletedLabel: 'Completed',

  toolbarTitle: 'Title',
  toolbarMenu: 'Settings',
  toolbarHint: 'Hint',
  toolbarUndo: 'Undo',
  toolbarInfo: 'Info',
  toolbarReset: 'New',
  toolbarKifu: 'Kifu',

  black: 'Black',
  white: 'White',

  passMessage: (color) => `${color} has no legal moves — pass`,
  resultDraw: 'Draw',
  resultBlackWin: 'Black wins',
  resultWhiteWin: 'White wins',
  storyVictory: 'Victory',
  storyDefeat: 'Defeat',
  storyDraw: 'Draw',
  storyEnding: 'Ending',

  finalResult: '— Final Result —',
  storyComplete: '— Story Complete —',
  chapterN: (n) => `— Chapter ${n} —`,
  nextChapter: 'Next chapter →',
  retryStory: 'Replay the story',
  oneMore: 'Play again',
  retryStoryFromStart: 'Restart the story',
  storyEncouragement: 'Not yet — try again.',
  nextOpponentIs: (name) => `Next opponent: ${name}`,

  matchInfo: 'Match Info',
  mode: 'Mode',
  modeHuman: 'Two players',
  modeStoryProgress: (n) => `Story · Chapter ${n}`,
  modeStoryComplete: 'Story · Complete',
  modeFreeLevel: (lv, label) => `Free · Lv.${lv} ${label}`,
  statMove: 'Move',
  statEmpty: 'Empty',
  statTurn: 'Turn',
  kifuHeading: 'Kifu',
  noMovesYet: 'No moves played yet',

  kifuLibrary: 'Kifu library',
  saveCurrent: 'Save current match',
  saveButton: 'Save',
  saveHintEmpty: 'Play at least one move before saving.',
  saveHintInfo: (moves, summary) => `${moves} moves · ${summary}`,
  inputPlaceholder: 'Match name (e.g. vs Asahi comeback)',
  savedGames: 'Saved matches',
  noSavedGames: 'No saved matches yet',
  loadButton: 'Load',
  blackWinShort: 'B win',
  whiteWinShort: 'W win',
  drawShort: 'Draw',

  setup: 'Settings',
  protagonist: 'Protagonist',
  protagonistSubtitle: 'Choose your protagonist',
  opponent: 'Opponent',
  opponentSubtitle: 'Opponent',
  vsAi: 'vs AI',
  vsHuman: 'Two players',
  storyMode: 'Story',
  freeMode: 'Free',
  player2Protagonist: 'Player 2 protagonist',
  cannotChooseSelf: 'Cannot pick the same name as yourself',
  startNewGame: 'Start new game',
  keepSettings: 'Keep these settings',
  progress: 'Progress',
  characterGridLabel: 'Character — twenty opponents',
  aiLevelExplain:
    'Lv.1–5 random / greedy · Lv.6–9 positional · Lv.10–14 1–2-ply search · Lv.15–17 3-ply · Lv.18–20 4-ply minimax with mobility & disc parity.',

  close: 'Close',
  delete: 'Delete',

  levelEntry: 'Entry',
  levelBeginner: 'Beginner',
  levelMid: 'Intermediate',
  levelHigh: 'Advanced',
  levelMaster: 'Master',
  levelExpert: 'Expert',
  levelLow: '1 Entry',
  levelMidLabel: '10 Mid',
  levelMaxLabel: '20 Master',

  footerHuman: 'Two players',
  footerStoryComplete: (name) => `Story complete · vs ${name}`,
  footerChapter: (n, name) => `Chapter ${n} · vs ${name}`,
  footerFree: (name, lv, label) => `vs ${name} · Lv.${lv} ${label}`,

  language: 'Language',

  storyIntro: `— When you came to, you were in an unknown world.
This is the otherworld of Bansho Sekai. Black and white stones dance here, and twenty masters dwell within.
"Only one who defeats every master may return to the world they came from."
A voice from above the board declared it.
Reincarnated as an Othello Player — your story begins now.`,

  storyEndingProse: `You have defeated all twenty masters.
The gates of Bansho Sekai open, and light from your own world streams through —
your journey on the board reaches its close.`,

  storyChapters: [
    'The first resident is Ichika the idol. She plays a light, melodic style as if singing.',
    'Aoi the archer. A sharp shot aimed at the corners of the board.',
    'Asahi, the young swordsman. Head-on, righteous play like swordsmanship.',
    'Nadeshiko the healer. Defensive, waiting calmly for opponents to slip.',
    'Hibiki the bard. Places stones to a rhythm, weaving a melody on the board.',
    'Tsumugi the beast tamer. Surprises you with intuition and wild instinct.',
    'Akane the engineer. Precise moves locked together like gears.',
    'Mel the alchemist. Mixes the position like an experiment to find new solutions.',
    'Satoru the monk. No-mind play, the silent extreme that cannot be read.',
    'Shiki the rogue. Strikes the blind spots, moves from the shadows.',
    'Shion the mage. Calm calculation and deep reading see all.',
    'Luna the dream witch. Bewildering, dream-like curves throw you off.',
    'Yukino the strategist. Treats the board as a battlefield, closes the noose with logic.',
    'Akira the detective. Reads your moves and turns your traps against you.',
    'Ciel the cyberpunk scout. Fires off data-optimized moves at high speed.',
    'Aria the princess. Elegant yet fatal, the move of a sovereign.',
    'Leon the knight. Fair, frontal, and utterly impregnable.',
    'Sojiro the samurai. A killing blow like a single sword stroke.',
    'Arashi the dragon rider. Dominates the board with overwhelming momentum — the height of the classics.',
    'The final gatekeeper, Zero. The ultimate hacker who rules Bansho Sekai. Every variation already computed.',
  ],

  gameOverAiQuoteWin: 'Well played… next time I get serious.',
  gameOverAiQuoteLose: 'Not yet, not yet.',
  gameOverAiQuoteDraw: 'An even fight — well done.',

  reviewMatchButton: 'Review this match',
  reviewTitle: 'Match Review',
  reviewSubtitle: 'Commentary by Claude',
  reviewLoading: 'Claude is thinking…',
  reviewByClaude: 'Powered by Claude (Sonnet 4.6)',
  reviewCancel: 'Cancel',
  reviewRegenerate: 'Regenerate',
  reviewError: (message) => `Could not fetch the review: ${message}`,
  reviewEmpty: 'No moves recorded — nothing to review.',
};

export const messages: Record<Locale, Messages> = { ja, en };

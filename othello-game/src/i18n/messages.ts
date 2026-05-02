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
};

export const messages: Record<Locale, Messages> = { ja, en };

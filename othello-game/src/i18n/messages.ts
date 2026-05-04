export type Locale = 'ja' | 'en';

import { getStory, type StoryContent } from './story';

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
  toolbarResign: string;
  toolbarReset: string;
  toolbarKifu: string;

  // Resign confirmation
  resignConfirm: string;

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

  // Settings -> Story chapter browser
  chapterNavPrev: string;
  chapterNavNext: string;
  chapterNavLatest: string;
  chapterPlayCurrent: string;
  chapterPlayReplay: string;
  chapterCurrentBadge: string;
  chapterClearedBadge: string;
  chapterCounter: (n: number, max: number) => string;

  // First/second selector + roll animation
  firstPlayerHeading: string;
  firstPlayerSubtitle: string;
  firstPlayerRandom: string;
  firstPlayerFirst: string;
  firstPlayerSecond: string;
  firstPlayerStoryHint: string;
  firstPlayerRollLabel: string;
  firstPlayerRollFirst: (name: string) => string;
  firstPlayerRollSecond: (name: string) => string;
  firstPlayerRollFirstHint: string;
  firstPlayerRollSecondHint: string;

  // Settings → coin style
  coinStyleLabel: string;
  coinStyleSubtitle: string;
  coinStyle2D: string;
  coinStyle2DDesc: string;
  coinStyleFantasy: string;
  coinStyleFantasyDesc: string;

  // Settings → commentary toggle
  commentaryLabel: string;
  commentarySubtitle: string;
  commentaryOn: string;
  commentaryOff: string;
  commentaryHint: string;

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
  /** Same panel, but reframed as "match setup" when opened from the
   *  title screen (free-mode entry) instead of mid-game. */
  matchSetup: string;
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
  protagonistLockHint: (unlocked: number, total: number) => string;
  unlockBannerLabel: string;
  startNewGame: string;
  keepSettings: string;
  progress: string;
  characterGridLabel: string;
  aiLevelExplain: string;

  /** Suffix shown under each character card to label the character's
   *  canonical/default difficulty (e.g. "標準 Lv.5"). Distinct from the
   *  active match level set via the slider below. */
  defaultLevelLabel: (n: number) => string;
  /** Heading on the level slider — "対決レベル / Match Level" — to make
   *  clear it sets the *active* difficulty, not just a display. */
  matchLevelLabel: string;
  /** Bridge text between the character grid and the level slider:
   *  explains that each character has a default Lv. and the slider
   *  overrides the active difficulty. */
  matchLevelHint: string;
  /** Mini button on the slider; appears when active level !== the
   *  selected character's default level. */
  matchLevelResetToDefault: string;
  /** Footnote under the slider explaining where the AI runs and what
   *  the high-level compute cost is. */
  aiComputeNote: string;

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
  reviewSave: string;
  reviewSaved: string;
  reviewViewSaved: string;
  reviewSavedAt: (timestamp: string) => string;
  reviewSavedIndicator: string;

  // Loaded-kifu review-mode overlay
  kifuViewingLabel: string;
  kifuViewingClose: string;
  kifuMoveCounter: (current: number, total: number, notation: string | null) => string;
  replayFirst: string;
  replayPrev: string;
  replayNext: string;
  replayLast: string;
  reviewGenerateNew: string;
  jumpNextBad: string;
  jumpNextGood: string;
  // Auto-play + speed selector + help modal
  replayPlay: string;
  replayPause: string;
  replaySpeedFormat: (label: string) => string; // e.g. "速度: 1x"
  replayHelpTitle: string;
  replayHelpSubtitle: string;
  replayHelpDescFirst: string;
  replayHelpDescPrev: string;
  replayHelpDescPlay: string;
  replayHelpDescNext: string;
  replayHelpDescLast: string;
  replayHelpDescJumpBad: string;
  replayHelpDescJumpGood: string;
  replayHelpDescViewSavedReview: string;
  replayHelpDescGenerateReview: string;
  replayHelpDescSpeed: string;
  replayHelpDescClose: string;
  replayHelpKeyboardHeading: string;
  replayHelpKeyboardArrows: string;
  replayHelpKeyboardSpace: string;
  replayHelpKeyboardHomeEnd: string;

  // Structured review (per-move annotations)
  reviewSummaryHeading: string;
  reviewImprovementsHeading: string;
  reviewMovesHeading: string;
  reviewMoveLabel: (n: number, notation: string, side: 'B' | 'W') => string;
  reviewNoAnnotations: string;
  qualityBrilliant: string;
  qualityGood: string;
  qualityNeutral: string;
  qualityInaccuracy: string;
  qualityMistake: string;
  qualityBlunder: string;

  // Save slots (story mode)
  slotPickerTitle: string;
  slotPickerSubtitle: string;
  slotPickerHint: string;
  slotEmpty: string;
  slotProgress: (cleared: number) => string;
  slotLives: (n: number) => string;
  slotLastPlayed: string;
  slotDefaultName: (n: number) => string;
  slotRename: string;
  slotReset: string;
  slotResetConfirm: string;
  slotSwitch: string;
  slotInUseFooter: (name: string, lives: number) => string;
  slotSelect: string;
  slotChooseFirst: string;
  livesLabel: string;
  livesGameOverWarning: string;

  // Story-data section in settings (scene archive entry + unlock reset)
  storyDataLabel: string;
  archiveSettingsDesc: string;
  archiveEmpty: string;
  unlockResetLabel: string;
  unlockResetDesc: (current: number) => string;
  unlockResetConfirm: string;

  // Multi-step story intro flow (PrologueScreen / FallingScreen /
  // ArrivalScreen / ChapterIntroScreen). Ja keys mirror the spec in
  // handoff_intro_v2/README_INTRO_FLOW_INSTRUCTIONS.md.
  intro: {
    /** Step 1 ornament label (above prologue title). */
    prologueLabel: string;
    /** Step 2 ornament label. */
    fallingLabel: string;
    /** Step 2 voice line (god-of-this-world speaking in 『 』). */
    fallingVoice: string;
    /** Step 3 ornament label. */
    arrivalLabel: string;
    /** Step 3 narration (rebirth onto the stage). */
    arrivalText: string;
    /** Step 4 ornament label (above chapter heading). */
    chapterLabel: (n: number) => string;
    /** "Tap to continue" hint shown during art-only phase. */
    tapToContinue: string;
    /** "→ next" caption on the bottom-right step button. */
    nextStepLabel: string;
    /** Final step CTA — "start the match". */
    startBattleLabel: string;
  };

  // Scene archive (title-screen "replay past story scenes" UI)
  archiveOpenLabel: string;
  archiveModalTitle: string;
  archiveModalSubtitle: string;
  archiveSceneLabels: {
    prologue: string;
    'narrative:solitude': string;
    'narrative:allies': string;
    'narrative:final': string;
    ending: string;
  };
  archiveReplayLabel: string;
  archiveCloseLabel: string;

  // Game over (lives = 0) screen
  gameOverScreenLabel: string;
  gameOverScreenTitle: string;
  gameOverScreenProse: string;
  gameOverResetSave: string;
  gameOverBackToTitle: string;
  gameOverTryAgainNoLives: string;
  gameOverViewKifu: string;

  // Auto-save / auto-attach indicators
  kifuLibraryHint: string;

  // Default-route story (PLR00 Haruki). Lives in src/i18n/story/{ja,en}.ts
  // to keep this file from growing by ~2000 lines per locale.
  story: StoryContent;
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
  titleFreeMeta: '次に設定 → 対戦相手・レベル・先攻後攻を選んで対局',
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
  toolbarResign: '投了',
  toolbarReset: '新規',
  toolbarKifu: '棋譜',

  resignConfirm: '本当に投了しますか？敗北として記録されます。',

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

  chapterNavPrev: '前章',
  chapterNavNext: '次章',
  chapterNavLatest: '最新の章へ',
  chapterPlayCurrent: 'この章で対局を始める',
  chapterPlayReplay: 'この章を復習対局',
  chapterCurrentBadge: '（現在）',
  chapterClearedBadge: '（クリア済）',
  chapterCounter: (n, max) => `第${n}章 / 第${max}章`,

  firstPlayerHeading: '手番',
  firstPlayerSubtitle: 'First / Second',
  firstPlayerRandom: 'ランダム',
  firstPlayerFirst: '先攻（黒）',
  firstPlayerSecond: '後攻（白）',
  firstPlayerStoryHint: '※ ストーリーモードでは毎章ランダムに決まります',
  firstPlayerRollLabel: '握り石',
  firstPlayerRollFirst: (name) => `${name}：先攻（黒）`,
  firstPlayerRollSecond: (name) => `${name}：後攻（白）`,
  firstPlayerRollFirstHint: '黒石を握った。先に石を打つ',
  firstPlayerRollSecondHint: '白石を握った。相手の手を読んで応える',

  coinStyleLabel: 'コイン演出',
  coinStyleSubtitle: '先攻後攻を決める瞬間の見た目',
  coinStyle2D: '標準（2D）',
  coinStyle2DDesc: 'シンプルな白黒の円盤がくるりと回る',
  coinStyleFantasy: 'ファンタジー',
  coinStyleFantasyDesc: '銀縁に紋様、淡い魔法陣でゆっくり着地',

  commentaryLabel: 'AI キャラ実況',
  commentarySubtitle: 'キャラが LLM で口調をつけて反応',
  commentaryOn: 'ON',
  commentaryOff: 'OFF',
  commentaryHint:
    '対局相手のキャラクターが Anthropic Claude で短い実況を返します。1局あたり数十回の API リクエストが発生するため、デフォルトは OFF。',

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
  matchSetup: '対戦設定',
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
  protagonistLockHint: (unlocked, total) =>
    `※全20章クリアで主人公が1人ずつ解放されます（${unlocked} / ${total} 解放済み）`,
  unlockBannerLabel: '新キャラクター解放',
  startNewGame: 'この設定で対局を始める',
  keepSettings: 'この設定で続ける',
  progress: 'Progress',
  characterGridLabel: 'Character — 二十人の対戦相手',
  aiLevelExplain:
    'Lv.1–5 random / greedy ・ Lv.6–9 positional ・ Lv.10–14 1–2-ply search ・ Lv.15–17 3-ply ・ Lv.18–20 4-ply minimax with mobility & disc parity.',
  defaultLevelLabel: (n) => `標準 Lv.${n}`,
  matchLevelLabel: '対決レベル',
  matchLevelHint:
    'キャラクター直下の数字は「標準 Lv.」（その人物の素の強さ）。下のゲージを動かすと、その対戦相手と任意のレベルで対局できます。',
  matchLevelResetToDefault: '標準に戻す',
  aiComputeNote:
    '思考はあなたの端末内（Web Worker）で計算しています。Lv.18〜20 は深さ 4 の minimax 探索なので、1 手につき少し時間がかかります。',

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
  reviewSave: 'レビューを保存',
  reviewSaved: 'レビューと棋譜を保存しました',
  reviewViewSaved: 'レビューを見る',
  reviewSavedAt: (timestamp) => `保存日時：${timestamp}`,
  reviewSavedIndicator: 'レビューあり',

  kifuViewingLabel: '棋譜を閲覧中',
  kifuViewingClose: '閲覧を終了',
  kifuMoveCounter: (current, total, notation) =>
    notation ? `${current}/${total}手 · ${notation}` : `${current}/${total}手`,
  replayFirst: '初手前まで戻す',
  replayPrev: '1手戻る',
  replayNext: '1手進める',
  replayLast: '最終局面へ',
  reviewGenerateNew: 'レビューを新規生成',
  jumpNextBad: '次の悪手へ',
  jumpNextGood: '次の好手へ',
  replayPlay: '自動再生を始める',
  replayPause: '自動再生を停止',
  replaySpeedFormat: (label) => `速度 ${label}`,
  replayHelpTitle: 'リプレイ操作の説明',
  replayHelpSubtitle: 'Replay Controls',
  replayHelpDescFirst: '初手の前まで一気に戻る',
  replayHelpDescPrev: '1 手戻る',
  replayHelpDescPlay: '自動再生 / 一時停止。終端に来ると自動で停止',
  replayHelpDescNext: '1 手進める',
  replayHelpDescLast: '最終局面まで一気に進める',
  replayHelpDescJumpBad: '次の悪手（緩手・悪手・大悪手）に飛ぶ。末尾まで来ると先頭に巻き戻る',
  replayHelpDescJumpGood: '次の好手（妙手・好手）に飛ぶ。末尾まで来ると先頭に巻き戻る',
  replayHelpDescViewSavedReview: '保存済みのレビュー（総評・注釈）を読む',
  replayHelpDescGenerateReview: 'Claude にこの対局をレビューしてもらう。完了時に同じ棋譜へ自動添付',
  replayHelpDescSpeed: '自動再生の速度を切替（0.5x → 1x → 2x → 4x → 0.5x）',
  replayHelpDescClose: 'リプレイ閲覧を終了して新規対局へ',
  replayHelpKeyboardHeading: 'キーボード（PC）',
  replayHelpKeyboardArrows: '← / → : 1 手戻る / 進める',
  replayHelpKeyboardSpace: 'Space : 自動再生 / 一時停止',
  replayHelpKeyboardHomeEnd: 'Home / End : 先頭 / 末尾',

  reviewSummaryHeading: '総評',
  reviewImprovementsHeading: '次回への助言',
  reviewMovesHeading: '注目の手',
  reviewMoveLabel: (n, notation, side) =>
    `第${n}手 ${side === 'B' ? '黒' : '白'} ${notation}`,
  reviewNoAnnotations: '注釈付きの手はありません。',
  qualityBrilliant: '妙手',
  qualityGood: '好手',
  qualityNeutral: '普通',
  qualityInaccuracy: '緩手',
  qualityMistake: '悪手',
  qualityBlunder: '大悪手',

  slotPickerTitle: 'セーブを選ぶ',
  slotPickerSubtitle: 'Choose a save',
  slotPickerHint: 'ストーリーは 10 個のセーブから選んで進めます。各セーブは独立した進捗・残機・戦績を持ちます。',
  slotEmpty: '未使用',
  slotProgress: (cleared) => `第${Math.min(cleared + 1, 20)}章 まで進行（${cleared}/20 クリア）`,
  slotLives: (n) => `残機 ${n}`,
  slotLastPlayed: '最終プレイ',
  slotDefaultName: (n) => `セーブ ${n}`,
  slotRename: '名前を変更',
  slotReset: 'このセーブをリセット',
  slotResetConfirm: 'このセーブの進捗・戦績・残機を全て初期化します。よろしいですか？',
  slotSwitch: 'セーブを変更',
  slotInUseFooter: (name, lives) => `セーブ：${name}（残機 ${lives}）`,
  slotSelect: '選ぶ',
  slotChooseFirst: 'ストーリーを始めるには、まずセーブを選んでください。',
  livesLabel: '残機',
  livesGameOverWarning: '残機がありません。次に勝つと 1 機回復します。',

  storyDataLabel: 'ストーリーデータ',
  archiveSettingsDesc: '序章・幕間・終章など、これまでに見た場面を画像とテキストで再生します。',
  archiveEmpty: 'まだ視聴済みの場面がありません。序章を読んだり章を進めたりすると、ここに並びます。',
  unlockResetLabel: 'キャラクター解放を初期化',
  unlockResetDesc: (current) =>
    `現在 ${current} 体の追加キャラクターが解放されています。タップでハルキ以外をすべてロックし直します。`,
  unlockResetConfirm:
    '解放済みのキャラクターをすべてロックし、選択中のアバターも初期 (ハルキ) に戻します。よろしいですか？',

  intro: {
    prologueLabel: '序章',
    fallingLabel: '転落',
    fallingVoice: '異邦の打ち手よ。盤上世界は、汝を待っていた。',
    arrivalLabel: '到着',
    arrivalText: `気がつくと、ハルキはステージの真ん中に立っていた。
ピンク色のスポットライト。ハートと星のバルーン。観客席はない。
代わりに、オセロ盤が一台。

——ここが、盤上世界。
20人の達人を打ち破った者だけが、現代へと還れる場所。`,
    chapterLabel: (n) => `第 ${n} 章`,
    tapToContinue: 'タップして読む',
    nextStepLabel: '続きを読む →',
    startBattleLabel: '対局を始める →',
  },

  archiveOpenLabel: '▸ これまでのシーンを再生する',
  archiveModalTitle: 'シーン回想',
  archiveModalSubtitle: 'これまでに通り過ぎたお話を、もう一度。',
  archiveSceneLabels: {
    prologue: '序章 「放課後、世界が転換する」',
    'narrative:solitude': '幕間 「孤独な打ち手」',
    'narrative:allies': '幕間 「同行者たちの影」',
    'narrative:final': '幕間 「決戦の前夜」',
    ending: '終章 「盤上世界、その先へ」',
  },
  archiveReplayLabel: '再生',
  archiveCloseLabel: '閉じる',

  gameOverScreenLabel: 'Game Over',
  gameOverScreenTitle: 'ゲームオーバー',
  gameOverScreenProse: `残機が尽きた。
ここまでの道のりは記録されている——
やり直すか、別の道を歩むか、君の選択だ。`,
  gameOverResetSave: 'セーブをリセット',
  gameOverBackToTitle: 'タイトルへ戻る',
  gameOverTryAgainNoLives: '残機なしで再挑戦',
  gameOverViewKifu: '対戦棋譜を読み込む',

  kifuLibraryHint: '対局終了時に自動保存されます。レビューを生成すると同じ棋譜に紐付きます。',

  story: getStory('ja'),
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
  titleFreeMeta: 'Next: set up — pick opponent, level, and first move',
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
  toolbarResign: 'Resign',
  toolbarReset: 'New',
  toolbarKifu: 'Kifu',

  resignConfirm: 'Resign this match? It will be recorded as a loss.',

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

  chapterNavPrev: 'Prev',
  chapterNavNext: 'Next',
  chapterNavLatest: 'Jump to latest',
  chapterPlayCurrent: 'Start this chapter',
  chapterPlayReplay: 'Replay this chapter',
  chapterCurrentBadge: '(current)',
  chapterClearedBadge: '(cleared)',
  chapterCounter: (n, max) => `Chapter ${n} / ${max}`,

  firstPlayerHeading: 'Turn order',
  firstPlayerSubtitle: 'First / Second',
  firstPlayerRandom: 'Random',
  firstPlayerFirst: 'Go first (Black)',
  firstPlayerSecond: 'Go second (White)',
  firstPlayerStoryHint: 'In story mode the side is rolled at the start of every chapter.',
  firstPlayerRollLabel: 'The toss',
  firstPlayerRollFirst: (name) => `${name}: First (Black)`,
  firstPlayerRollSecond: (name) => `${name}: Second (White)`,
  firstPlayerRollFirstHint: 'You drew Black — you move first.',
  firstPlayerRollSecondHint: 'You drew White — read your opponent and respond.',

  coinStyleLabel: 'Coin animation',
  coinStyleSubtitle: 'How the first/second toss looks',
  coinStyle2D: 'Classic (2D)',
  coinStyle2DDesc: 'A clean black/white disc that spins to a stop.',
  coinStyleFantasy: 'Fantasy',
  coinStyleFantasyDesc: 'Silver-rimmed engraved coin lands on a soft magic ring.',

  commentaryLabel: 'Character commentary',
  commentarySubtitle: 'Let the LLM voice your opponent',
  commentaryOn: 'ON',
  commentaryOff: 'OFF',
  commentaryHint:
    'Your opponent character chips in with one-line reactions, voiced by Anthropic Claude. Each match makes a few dozen API calls, so this is OFF by default.',

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
  matchSetup: 'Match Setup',
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
  protagonistLockHint: (unlocked, total) =>
    `Each new protagonist unlocks after a full 20-chapter clear (${unlocked} / ${total} unlocked).`,
  unlockBannerLabel: 'New protagonist unlocked',
  startNewGame: 'Start match with these settings',
  keepSettings: 'Keep these settings',
  progress: 'Progress',
  characterGridLabel: 'Character — twenty opponents',
  aiLevelExplain:
    'Lv.1–5 random / greedy · Lv.6–9 positional · Lv.10–14 1–2-ply search · Lv.15–17 3-ply · Lv.18–20 4-ply minimax with mobility & disc parity.',
  defaultLevelLabel: (n) => `Default Lv.${n}`,
  matchLevelLabel: 'Match Level',
  matchLevelHint:
    'The number under each character is its Default Lv. — that opponent\'s natural strength. Move the slider below to play that character at any difficulty you like.',
  matchLevelResetToDefault: 'Reset to default',
  aiComputeNote:
    'Thinking happens on your device (Web Worker). Lv.18–20 runs depth-4 minimax, so each move takes a moment.',

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
  reviewSave: 'Save review',
  reviewSaved: 'Review and kifu saved.',
  reviewViewSaved: 'View review',
  reviewSavedAt: (timestamp) => `Saved at: ${timestamp}`,
  reviewSavedIndicator: 'review attached',

  kifuViewingLabel: 'Viewing kifu',
  kifuViewingClose: 'Close',
  kifuMoveCounter: (current, total, notation) =>
    notation ? `${current}/${total} · ${notation}` : `${current}/${total}`,
  replayFirst: 'Jump to start',
  replayPrev: 'Previous move',
  replayNext: 'Next move',
  replayLast: 'Jump to end',
  reviewGenerateNew: 'Generate new review',
  jumpNextBad: 'Next mistake',
  jumpNextGood: 'Next good move',
  replayPlay: 'Start auto-play',
  replayPause: 'Pause auto-play',
  replaySpeedFormat: (label) => `Speed ${label}`,
  replayHelpTitle: 'Replay controls',
  replayHelpSubtitle: 'Replay Controls',
  replayHelpDescFirst: 'Jump to before the first move',
  replayHelpDescPrev: 'Step back one move',
  replayHelpDescPlay: 'Auto-play / pause. Stops automatically at the final move.',
  replayHelpDescNext: 'Step forward one move',
  replayHelpDescLast: 'Jump to the final position',
  replayHelpDescJumpBad: 'Jump to the next inaccuracy / mistake / blunder. Wraps to the first one when past the last.',
  replayHelpDescJumpGood: 'Jump to the next good or brilliant move. Wraps to the first one when past the last.',
  replayHelpDescViewSavedReview: 'Open the saved review (overview + per-move annotations)',
  replayHelpDescGenerateReview: 'Have Claude review this match. The result is auto-attached to the same kifu.',
  replayHelpDescSpeed: 'Cycle the auto-play speed (0.5x → 1x → 2x → 4x → 0.5x)',
  replayHelpDescClose: 'Exit replay and start a new match',
  replayHelpKeyboardHeading: 'Keyboard (desktop)',
  replayHelpKeyboardArrows: '← / → : step back / forward',
  replayHelpKeyboardSpace: 'Space : auto-play / pause',
  replayHelpKeyboardHomeEnd: 'Home / End : first / last move',

  reviewSummaryHeading: 'Overview',
  reviewImprovementsHeading: 'What to improve',
  reviewMovesHeading: 'Annotated moves',
  reviewMoveLabel: (n, notation, side) =>
    `Move ${n} · ${side === 'B' ? 'Black' : 'White'} ${notation}`,
  reviewNoAnnotations: 'No annotated moves.',
  qualityBrilliant: 'Brilliant',
  qualityGood: 'Good',
  qualityNeutral: 'Neutral',
  qualityInaccuracy: 'Inaccuracy',
  qualityMistake: 'Mistake',
  qualityBlunder: 'Blunder',

  slotPickerTitle: 'Choose a Save',
  slotPickerSubtitle: 'Save Slots',
  slotPickerHint: 'Story progress lives in one of 10 saves. Each save has independent progress, lives and stats.',
  slotEmpty: 'Unused',
  slotProgress: (cleared) => `Up to Chapter ${Math.min(cleared + 1, 20)} (${cleared}/20 cleared)`,
  slotLives: (n) => `${n} lives`,
  slotLastPlayed: 'Last played',
  slotDefaultName: (n) => `Save ${n}`,
  slotRename: 'Rename',
  slotReset: 'Reset this save',
  slotResetConfirm:
    'This wipes the save’s progress, stats and lives. Continue?',
  slotSwitch: 'Switch save',
  slotInUseFooter: (name, lives) => `Save: ${name} (${lives} lives)`,
  slotSelect: 'Select',
  slotChooseFirst: 'Pick a save before starting the story.',
  livesLabel: 'Lives',
  livesGameOverWarning: 'No lives left. Win the next match to recover one.',

  storyDataLabel: 'Story Data',
  archiveSettingsDesc:
    'Replay any scene you’ve seen so far — prologue, interludes, ending — with the original art and prose.',
  archiveEmpty:
    'No scenes recorded yet. Read the prologue or clear a chapter to populate this list.',
  unlockResetLabel: 'Reset character unlocks',
  unlockResetDesc: (current) =>
    `${current} bonus characters are currently unlocked. Tap to relock everyone except Haruki.`,
  unlockResetConfirm:
    'This will relock every bonus character and reset your selected avatars to Haruki. Continue?',

  intro: {
    prologueLabel: 'Prologue',
    fallingLabel: 'Falling',
    fallingVoice: 'Outer Hand. The Board World has awaited you.',
    arrivalLabel: 'Arrival',
    arrivalText: `When Haruki regained his senses, he was standing in the centre of a stage.
Pink spotlights. Heart-and-star balloons. No audience seats.
Instead — a single othello board.

— This is the Board World.
A place where only those who defeat all twenty masters may return to the modern world.`,
    chapterLabel: (n) => `Chapter ${n}`,
    tapToContinue: 'tap to continue',
    nextStepLabel: 'continue →',
    startBattleLabel: 'begin the match →',
  },

  archiveOpenLabel: '▸ Replay past scenes',
  archiveModalTitle: 'Scene Archive',
  archiveModalSubtitle: 'Re-watch the beats you’ve already passed.',
  archiveSceneLabels: {
    prologue: 'Prologue · After School, the World Turns',
    'narrative:solitude': 'Interlude · The Solitary Player',
    'narrative:allies': 'Interlude · Shadows of Companions',
    'narrative:final': 'Interlude · The Eve of the Final Match',
    ending: 'Ending · Beyond Bansho Sekai',
  },
  archiveReplayLabel: 'Play',
  archiveCloseLabel: 'Close',

  gameOverScreenLabel: 'Game Over',
  gameOverScreenTitle: 'GAME OVER',
  gameOverScreenProse: `Your lives are spent.
Your road so far is recorded —
will you try again, or walk a different path?`,
  gameOverResetSave: 'Reset save',
  gameOverBackToTitle: 'Back to title',
  gameOverTryAgainNoLives: 'Retry without lives',
  gameOverViewKifu: 'View saved kifu',

  kifuLibraryHint: 'Matches are auto-saved when they end. Generating a review attaches it to the same kifu.',

  story: getStory('en'),
};

export const messages: Record<Locale, Messages> = { ja, en };

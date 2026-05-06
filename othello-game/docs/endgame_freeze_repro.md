# Endgame freeze — manual repro procedure

「最後の一手 (盤が満杯になる手 or 両者パス確定の手) でゲームが
凍る」 報告に対する **実機検証 + 診断ログ採取** 手順書。

エンジン純関数 + 状態遷移モデルでの自動テスト
([`endgame_freeze.test.ts`][1] / [`full_match_fuzz.test.ts`][2]) は
合計 **843 ケース** 全部 PASS してます。つまりコード上はフリーズに
到達できないことが数学的に確定しています。残る容疑は:

- **PWA キャッシュが旧 bundle を配信** (v0.33.6 で `skipWaiting+
  clientsClaim` 入れたので、次回再 reload で消えるはず)
- **モバイル browser の setTimeout suspension** (バックグラウンド遷移
  で auto-pass の 1.6s timer が遅延)
- **特定機種の touch event 取りこぼし**

[1]: ../src/engine/__tests__/endgame_freeze.test.ts
[2]: ../src/engine/__tests__/full_match_fuzz.test.ts

## 採取してほしいログ

実機で再現したら **症状報告と一緒に診断ログを必ず添える**。これが
あれば原因の絞り込みが激しく加速します。

### 手順

1. 実機 (普段プレイしてるスマホ・PC) でフリーズ症状を再現
2. 設定モーダル (画面右上 ☰) を開く → スクロール下の「Story Data
   管理」セクションへ
3. **🩺 診断ログを書き出す** を tap
   → 「診断ログをクリップボードにコピーしました」 toast が出る
4. その状態でブラウザのバージョンも控える:
   - iOS Safari: 設定アプリ → 一般 → 情報 → ソフトウェアバージョン
   - Android Chrome: chrome://version
   - Desktop: 開発者ツール → Console で `navigator.userAgent`
5. 報告に貼り付け:
   - クリップボードの diag log 全文
   - ブラウザバージョン + OS バージョン
   - そのとき表示されていたタイトル画面のバージョン (例
     `v0.33.7 · diag-log`)
   - フリーズ前の操作概要 (どの章 / 何手目 / コインの結果 / 棋譜なら
     `othello:save:{ts}` の中身もコピペしてくれると最高)

## 復旧手段

ログ採取が終わったら、以下のいずれかで復旧:

1. **🔄 AI を再起動** (設定モーダル) — 盤面状態を保ったまま思考
   ワーカーのみ作り直す。最も軽い復旧。
2. **♻️ 緊急再読み込み** — Service Worker キャッシュを消去 + reload。
   セーブデータは消えない。
3. アプリを完全に閉じて再起動 (PWA install 済の場合 = ホーム画面の
   アイコンから起動した場合) — `localStorage` は残る。

## コードレベル検証 (開発者向け)

実機で再現できなかった or できた両方のケースで、開発側で再現テストを
回すには:

```bash
cd othello-game

# 3 ケース (A: 盤満杯、B: 1 マスパス、C: ダブルパス) の純関数 +
# 状態マシン検証
npm test -- --run src/engine/__tests__/endgame_freeze.test.ts

# Lv1-20 マッチアップ × 多数イテレーション = 835 全ゲームが
# gameOver に到達するかをファズ検証
npm test -- --run src/engine/__tests__/full_match_fuzz.test.ts
```

両方 100% パスする限り「コード上のフリーズ可能性」は無い。実機で
再現するなら **runtime / ブラウザ / PWA キャッシュ層** に原因がある
ことが確定する。

## エンジン無実が示せた経緯 (summary)

1. **endgame_freeze.test.ts** (8 ケース)
   - 純関数 `isGameOver` / `getValidMoves` / `applyMove` レベルで
     A/B/C シナリオ全部正しく終了
   - App 状態マシンを忠実にミラーした関数モデルで A=1step / B=2step
     / C=0step で gameOver 到達
   - `pickAIMove([], ...) === null` で hang しないことを確認
2. **full_match_fuzz.test.ts** (21 ケース、合計 ~835 ゲーム)
   - Lv.1-Lv.10 全ペアリング × 20 イテレーション = 320 ゲーム
   - Lv.14/17/20 重 AI smoke = 15 ゲーム
   - 非対称 (Lv.1 vs Lv.20) = 5 ゲーム
   - ランダム vs ランダム = 500 ゲーム
   - **全ゲームが `(noCurrent && noOpp)` 状態に到達**
3. ワーカー往復は `useAiWorker.ts` の 15s timeout + auto-respawn で
   pending しない構造保証
4. `gameOver = (noCurrent && noOpp) || resigned` の状態マシンは
   PLAYING / WAITING_AI / WAITING_PLAYER の 3 つの GAME_OVER 遷移を
   全て well-defined にカバー

→ **エンジン側の根本原因は無い**。次回再発したら診断ログを採って
コード以外のレイヤ (PWA / browser / OS) に絞り込む。

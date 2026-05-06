# PLR01 英霊ハルキ (Heroic Spirit Haruki)

> 「変分は、お前自身が紡ぐもの」 (要協議: 暫定案)

## 基本情報

| 項目 | 値 |
|---|---|
| ID | `PLR01` |
| Slug | `haruki_heroic` |
| 名前 (日本語) | 英霊ハルキ |
| 名前 (英語) | Heroic Spirit Haruki |
| 漢字キー | 春 (春樹の「春」を継承、英霊化形態のため) |
| アーキタイプ (日本語) | 英霊化された旅人 |
| アーキタイプ (英語) | Ascended Heroic Spirit |
| 用途 | プレイヤーアバター (フリーモード選択可、ストーリー隠しモード使用可) |
| 名言 (日本語) | (要決定 — 暫定案あり) |
| 名言 (英語) | (TBD) |
| **アンロック条件** | **PLR00 ハルキで章 20 をクリア = 通常エンディング達成後** |

## このキャラの位置付け

世界観正本 (`master_world.md`) で確定した PLR 階層構造:

> **PLR00 ハルキ** = 現代日本の高校生、デフォルトの主人公アバター。
> **PLR01 ハルキ** = **未来の英霊化形態**。20 章を勝ち抜き、現世に戻り、さらに後の世界線で英霊として再召喚されたハルキ自身。Fate 的時間逆転ロアにより、過去の自分 (PLR00) の物語を見守り、最終決戦で支援する立場。

### PLR01 の特殊な意味

- **「未来の自分が今の自分を救う」** という時間ループ構造の体現
- 章 20 でゼロと対峙する時、PLR01 は「同じ立場の旅人同士」として向き合う
- ゼロを現世に解放できる唯一の存在 (= 真エンディングの鍵)

### PLR01 で章 20 クリアの特殊性

| 状態 | 結果 |
|---|---|
| PLR00 で章 20 クリア | 通常エンディング (ゼロを倒すが、ゼロは世界に同化したまま) |
| **PLR01 で章 20 クリア** | **真エンディング達成 + OPP21 + OPP22 アンロック** |

## キャラクターデザイン (維持ポイント)

新規生成・差し替え時の正の記述。**章 20-B 真エンディング挿絵から逆輸入されたデザインが正**。

> Heroic spirit version of the player character Haruki — the future, ascended form who has returned from beyond.
>
> **Hair**: BROWN spiky tousled windswept hair, with subtle GOLDEN HIGHLIGHTS catching the light at the tips and edges (representing his ascended state). Hair flows slightly upward and to the side as if caught in divine wind.
>
> **Eyes**: WARM AMBER-BROWN EYES, calm, kind, knowing. Carry the weight of victory and wisdom. Faint inner glow.
>
> **Face**: Young Japanese male appearance, late teens (16-18). Clean dignified features with a soft heroic radiance. Faint serene smile.
>
> **Outfit (heroic spirit ceremonial attire)**:
> - BLACK and DARK NAVY base with elaborate GOLD trim and embroidered geometric/lattice patterns
> - Asymmetric DRAPED CAPE/MANTLE on the shoulder with GOLD FILIGREE EDGES
> - WHITE COLLARED INNER SHIRT visible at the neck (echoing modern student uniform)
> - Layered ceremonial robe-like jacket
> - GOLD CHAIN ACCENTS hanging from chest/shoulder, with PURPLE WOVEN CORDS interlaced
> - POLISHED GOLD PAULDRON / shoulder armor with engraved heroic insignia
> - Gold compass-like medallion on chest
> - BELT WITH A LARGE GOLD CIRCULAR EMBLEM (clock/compass motif) at the waist
>
> **Aura/Effects**:
> - Subtle GOLDEN HALO of light particles around head/shoulders
> - Wind-swept hair and cape implying divine motion
> - A small floating BLACK OTHELLO STONE hovering above one open palm
>   (NOTE: 仕様書当初は白石を想定したが、生成結果は黒石。「ゼロから引き継いだ役割」の象徴として黒石採用)
>
> **Energy**: Heroic, calm, kindly. The protagonist who returned from the journey and now guides others. Not intimidating — but unmistakably someone who has transcended. Like a senior version of yourself who has done what you are about to do.

## 背景の世界観

**遷移空間 (緑コードレイン → 桜花びら、中央に金光柱)**

`background.png` (1024×1024 RGB) として同梱。章 20-B 真エンディング挿絵と完全に同じ世界観を継承する**遷移空間**:

- **左上側**: 薄れゆく緑のマトリクス・コードレイン (盤上世界の記憶)
- **右下側**: 暖かいピンクの桜花びらが舞う (現代日本への帰還)
- **中央**: 金光の粒子柱が立ち上る (二つの世界をつなぐ橋)
- 浮遊する黒・白のオセロ石、盤の断片が散らばる
- 「英霊が立つ場所」= 試練と解放の境界

## このキャラ固有の処理ノート

- **2026-05-06 配置完了**: 章 20-B 挿絵から逆輸入してアセット制作。挿絵との視覚整合は完璧。
- **半透明 4.66%**: 神性発光要素 (金光オーラ、髪先の光、エーテル粒子) のため通常範囲を少し超える。仕様通り正常。
- 黒オセロ石 (生成結果):「ゼロが残した黒石を英霊ハルキが引き継ぐ」という解釈で世界観と整合
- **名言は要決定**。暫定案:
  - 「変分は、お前自身が紡ぐもの」 (PLR00 への助言として、ゼロの「変分は閉じない」を継承)
  - 「お前は、戻れる。俺がそうだったように」 (時間ループ構造を象徴)
  - 「未来から来た。ただそれだけだ」 (シンプルで英霊らしい)

## ファイル仕様

| ファイル | 形式 | サイズ | 用途 |
|---|---|---|---|
| `character.png` | PNG (RGBA) | 1024×1024 | 透過済キャラ単体 (英霊ハルキ) |
| `background.png` | PNG (RGB) | 1024×1024 | 遷移空間背景 (章 20-B と同系統) |
| `icon.png` | PNG (RGBA) | 1024×1024 | 円形クロップ済合成アイコン |
| `spec.md` | Markdown | — | このファイル |

### 合成方法 (UI 実装の参考)

```css
.avatar-haruki-heroic {
  background-image: url('./background.png');
  background-size: cover;
  -webkit-mask-image: radial-gradient(circle, black 50%, transparent 50%);
}
.avatar-haruki-heroic > .character {
  background-image: url('./character.png');
  background-size: cover;
}
```

### Claude Code 側の実装ポイント

```ts
// PLR01 のアンロック条件: PLR00 で章 20 をクリア
function isPLR01Unlocked(state: CompletionState): boolean {
  return state.storyFullyCompleted.has('PLR00');
}

// PLR01 で章 20 をクリア = 真エンディング達成
function isTrueEndingAchieved(state: CompletionState): boolean {
  return state.storyFullyCompleted.has('PLR01');
}
```

## 関連ドキュメント

- 世界観正本: `master_world.md` (PLR 階層構造、Fate 的時間逆転ロア)
- シナリオ: `scenario_rewrite_v3.md` (章 20-B 真エンディング、章 20-C エピローグ)
- 章 20-B 挿絵: `public/avatars/chapters/chapter_20B_*` (本キャラのデザインルーツ)
- ゼロ (フード姿) - 対峙相手: `../../opponents/OPP20_zero/spec.md`
- ゼロ (現世帰還) - 解放後: `../../opponents/OPP21_zero_unmasked/spec.md`
- 全 41 体共通スタイル指針: `MASTER_CHAR_INSTRUCTIONS.md` の §1
- 進捗トラッカー: `progress_tracker_chars.md`

---

最終更新: 2026-05-06 (章 20-B 挿絵から逆輸入で配置完了。名言は要決定)

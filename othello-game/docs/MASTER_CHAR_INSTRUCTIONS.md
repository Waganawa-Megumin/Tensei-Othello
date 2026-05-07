# 🎨 アバター リファインメント 統合指示書 (v2 - 新セッション用)

> **これは ChatGPT に新セッションで丸ごと最初に渡す指示書です。**
> 41 キャラのアバターをチャット式で 1 体ずつ生成していきます。
>
> 構成:
> - **§1 STYLE** — 全 41 キャラ共通のスタイル指針 (最初に把握)
> - **§2 PLR ROSTER** — プレイヤー 21 体のキャラ表
> - **§3 OPP ROSTER** — 対戦相手 20 体のキャラ表

---

## 🚨 まず、ChatGPT への重要なお願い (このまま貼り付けて使う)

```
You are about to refine 41 character avatars for the game
"召喚されたらオセロ世界でした！" (Summoned to an Othello World).

This will be a CHAT-STYLE workflow: I will request one character at a time.
For each request, I will tell you the character ID (e.g. PLR00, OPP05),
attach the reference image, and you will generate ONE refined version.

Please first read this entire document (§1 STYLE, §2 PLR ROSTER, §3 OPP ROSTER)
and confirm you understand. Do NOT generate any image until I explicitly request
one with a specific character ID.

CRITICAL — before starting, please confirm whether you can generate images with
TRANSPARENT BACKGROUND (RGBA alpha channel, alpha=0 around the character).

If transparent background is NOT supported in your image generation:
  → Just confirm "transparent background not supported, will deliver white
    background" — that's fine, the user will handle transparency on their side.

If transparent background IS supported:
  → Confirm "I will deliver RGBA PNG with transparent background."

Then wait for my first request (e.g. "Generate PLR00").
```

---

# §1 STYLE — 全 41 キャラ共通のスタイル指針

## 共通仕様 (毎回適用)

```
Resolution:    1024×1024 (square; no other size accepted)
Format:        PNG
Background:    TRANSPARENT if supported, otherwise pure white (#FFFFFF) is OK
               — but ABSOLUTELY NO circular frame, vignette, or border
Composition:   Bust-up portrait
               - Character's face center exactly at image center (vertically + horizontally)
               - Top of head occupies upper 5-10% of canvas (do NOT crop the hair)
               - Character fills 75-85% of vertical space
               - Both shoulders visible, framing ends around chest level
Art style:     Anime / light novel cover art quality
Lineart:       Clear inked lines in dark sepia (#3a2418 ~ #5a3a28). NO pure black.
Saturation:    One notch HIGHER than the reference image (vivid but not muddy)
Details:       Refined hair highlights, eye shine, fabric folds, accessories
Shadows:       Cool violet-tinted (slight #8a7aaa hint)
Highlights:    Warm amber-tinted (slight #ffd9a0 hint)
```

## 絶対に守ること (Hard Constraints)

1. **Identity preservation 100%**
   - The new character must be UNMISTAKABLY the same as the reference
   - Same face shape, hair (color, length, hairstyle), eye (color, shape, expression)
   - Same outfit details (every button, fold, accessory, color)
   - Same props (weapons, mic, books, etc.) at same general position
   - Same pose family (don't switch from frontal to profile)

2. **NO circular frames or borders**
   - The image must be a regular square
   - Circular cropping is done by CSS later — DON'T pre-crop into a circle
   - If you see a circle in your output, the result is WRONG

3. **NO baked background scenery**
   - Just transparent (or solid white if not supported)
   - DO NOT add scenery, gradient, pattern, or color tint
   - The reference images may have backgrounds — IGNORE those backgrounds

4. **NO text, logos, watermarks, signatures, dates**

5. **DO NOT crop the top of the head**
   - Always leave a small margin above the highest point of the hair

## やるべきこと (Quality Uplift Goals)

1. **Sharper lineart** — clean, deliberate inking, no fuzzy edges
2. **Higher saturation** — one notch up, but don't oversaturate
3. **Better hair highlighting** — visible strands, glossy highlights
4. **Eye sparkle** — clear iris detail, catchlight, vibrant color
5. **Fabric & accessory detail** — visible folds, button shine, prop texture

---

# §2 PLR ROSTER — プレイヤー 21 体

各プレイヤーは「召喚されたオセロ世界の旅人 / Summoned Outer Hand」。
PLR00 が固定主人公、PLR01〜20 はストーリー全クリア後にアンロックされるバリエーション主人公。

| ID | Slug | 名前 | EN | アーキタイプ | Archetype | 名言 |
|---|---|---|---|---|---|---|
| **PLR00** | default | あなた | You | 盤上世界の旅人 | Traveler of Bansho Sekai | 「いざ、参る」 |
| **PLR01** | haruki_heroic | 英霊ハルキ | Heroic Spirit Haruki | 英霊化された旅人 | Ascended Heroic Spirit | (要決定) |
| **PLR02** | mikoto | 美琴 | Mikoto | 魔法学園の天才 | Magic Academy Prodigy | 「論理と魔法は同じ」 |
| **PLR03** | rin | リン | Rin | VRMMOの最強プレイヤー | VRMMO Top Player | 「現実より、得意なんだ」 |
| **PLR04** | ren | 蓮 | Ren | 剣道部主将 | Kendo Captain | 「正々堂々、参る」 |
| **PLR05** | chitose | 千歳 | Chitose | タイムリープ少女 | Time-Loop Girl | 「これで何度目だっけ」 |
| **PLR06** | haru | 晴 | Haru | 現代の陰陽師 | Modern Onmyoji | 「妖、見えてるんだ」 |
| **PLR07** | kai | カイ | Kai | 空の冒険者 | Sky Adventurer | 「風が呼んでる」 |
| **PLR08** | chinatsu | 千夏 | Chinatsu | 聖剣の村娘 | Holy Sword Village Girl | 「故郷を、必ず守る」 |
| **PLR09** | toru | 透 | Toru | 学園名探偵 | School Detective | 「謎には必ず答えがある」 |
| **PLR10** | noa | ノア | Noa | 未来から来た少女 | Girl from the Future | 「2099年から、よろしく」 |
| **PLR11** | nagi | 凪 | Nagi | 異世界料理人 | Isekai Chef | 「お腹空いてる？」 |
| **PLR12** | el | エル | El | 元魔王、今は転校生 | Ex-Demon King Transfer | 「ふふ、内緒だよ」 |
| **PLR13** | sumire | スミレ | Sumire | 記憶喪失の冒険者 | Amnesiac Adventurer | 「私は…誰なの？」 |
| **PLR14** | hazuki | 葉月 | Hazuki | 機械工学の天才 | Steampunk Genius | 「これ、私が作ったの！」 |
| **PLR15** | theend | **ジエンド** [改訂] | **The End** | **凄腕ガンナーカウボーイ (イケオジ)** [改訂] | **Master Gunslinger Cowboy** | 「撃つときは迷わない」 |
| **PLR16** | hikari | ひかり | Hikari | **ジムにいたお姉さん♡** | **Onee-san at the Gym** | 「お疲れさまっ♡」 [改訂 2026-05-06] |
| **PLR17** | yoru | ヨル | Yoru | 半吸血鬼 | Half-Vampire | 「血は、欲しくない」 |
| **PLR18** | minato | 湊 | Minato | 海の冒険者 | Sea Adventurer | 「世界の果てへ」 |
| **PLR19** | souta | 奏太 | Souta | 天才ピアニスト | Prodigy Pianist | 「この旋律、聴いてくれ」 |
| **PLR20** | yu | 悠 | Yu | 神話の英雄 | Mythic Hero | 「神々よ、いざ尋常に」 |

## PLR キャラクター固有の維持ポイント

各キャラの「絶対変えてはいけない要素」を押さえてください:

> 📝 **2026-05-06 全 PLR ROSTER 更新完了 (Wave 3 完結)** — PLR00-20 全 21 体の確定アバターが完成、§2 update のタイポロジーを 6 種類に分類確立:
> - 🔴 **矛盾訂正 — 全面書き換え (PLR05・PLR06・PLR10・PLR12・PLR13・PLR15・PLR16・PLR20)**: 旧記述と実画像が乖離していたため全面書き換え (8 件、新ポリシー: 実画像が一次情報源)
> - 🟡 **矛盾訂正 — 部分訂正 (PLR18)**: アーキタイプ維持、装具のみ訂正 (sailor → Victorian explorer-photographer)
> - 🎨 **作者意図的リデザイン — 強化型 (PLR19・PLR14)**: §2 整合方向で旧画像を強化 (オトナのピアニスト / マニアック発明家)
> - 🎭 **作者意図的リデザイン — 整合化型 (PLR17・PLR14)**: §2 明確だが旧画像が外れていた (吸血鬼 / スチームパンク発明家、PLR14 は強化型と mix)
> - 🌟 **作者意図的リデザイン — 完全変更型 (PLR16)**: §2 全面誤り + 旧画像方向で強化 (光の精霊使い→ジムのお姉さん♡)
> - 🌌 **作者意図的リデザイン — 完全リネーム型 (PLR13・PLR15)**: 名前+アーキタイプ+lore/persona 全変更 (PLR13: スミレ→イレウユ・浮遊霊 / PLR15: 隼人→ジエンド・凄腕ガンナーカウボーイ)
> - 🟢 **確定追加要素**: アバター制作時に確定した記号要素 (青リボン・御札・聖剣・赤ボタン等) — 7 件 (PLR00, 02, 03, 04, 07, 08, 11)
> - 🆕 **新規 spec (PLR09)**: Wave 3 で初描画
> - ⚪ **別セッション完成 (PLR01)**: 本セッション対象外
> - 🛠️ **新ポリシー (2026-05-06 確定済)**: §2 と実画像が乖離した場合は**実画像準拠で §2 を即更新**
> - 各キャラの完全仕様: `avatars-package/players/PLRxx_slug/spec.md` を参照

- **PLR00 (あなた / You)**: Black tousled anime hair, warm brown eyes, gentle smile, dark navy school jacket with mandarin/standing collar buttoned at neck (visible brass buttons), white shirt collar peeking out. Approachable everyman.
  > **確定追加 (2026-05-06)**: hair has subtle warm-brown highlights catching the light at the tips. Background = 教室の窓辺・夕焼け (現世起点 / 三部作 [PLR00 教室 → PLR01 遷移空間 → OPP21 街角帰還] の起点)。
- **PLR01 (英霊ハルキ / Heroic Spirit Haruki)**: BROWN spiky tousled windswept hair with subtle GOLDEN HIGHLIGHTS at the tips. WARM AMBER-BROWN EYES, calm and knowing. Black/dark navy ceremonial outfit with elaborate gold trim and embroidered patterns, asymmetric draped cape/mantle on one shoulder with gold filigree edges, white collared inner shirt, gold chain accents with PURPLE WOVEN CORDS, polished gold pauldron, gold compass-like medallion on chest, large gold circular emblem belt. Subtle GOLDEN HALO of light particles around head/shoulders. A small floating BLACK OTHELLO STONE hovering above one open palm (inherited from Zero, symbolizing his role as successor/guide). Heroic spirit aesthetic — the future, ascended form of PLR00 Haruki who returned from the journey and now guides others. Dignified yet kindly.

  > 💡 **アンロック条件**: PLR00 で章 20 をクリア (通常エンディング達成) 後にアンロック。**PLR01 で章 20 を再クリアすると真エンディング達成 (OPP21 + OPP22 アンロック)**。

  > 💬 **デザインルーツ**: 章 20-B 真エンディング挿絵から逆輸入されたデザイン。挿絵とアバターの視覚整合は完璧。背景は遷移空間 (緑コードレイン → 桜花びら、中央に金光柱)。
- **PLR02 (美琴 / Mikoto)**: Glasses, long flowing dark/navy hair, intelligent eyes, school uniform layered with academic robe/cape, possibly holding magical tome. Scholarly aura.
  > **確定追加 (2026-05-06)**: 髪は **pure BLACK** (long, half-up side bun-tail style). **BLUE RIBBON BOW** at the hair tie (signature). 制服は **academic robe ではなく金縁付き学園制服** (gold trim + bright BLUE inner-lining lapel facing) + **white shirt + GOLDEN tie with magical sigil pattern**. **Round/oval thin-framed glasses**. **VIOLET/PURPLE eyes**. 魔導書: 黒革+金箔押し+gold star/magic sigil on cover. 背景 = 大聖堂図書館 (青紫ステンドグラス + 金渾天儀)。
- **PLR03 (リン / Rin)**: Modern stylish gamer aesthetic, possibly VR headset on neck/forehead, confident smirk, sharp eyes, contemporary haircut. Cool gaming vibe.
  > **確定追加 (2026-05-06)**: VR headset を **ゴーグル+ヘッドホン 2 点セット**として確定。**CYAN/turquoise tactical goggles** (with blue-tinted glass) pushed up onto forehead. **CYAN over-ear headphones** (glossy black housing with cyan accent rings, **purple omega-Ω style emblem** on visible earcup = clan/guild logo). **SHORT BROWN tousled bob** hair. **DARK SLATE-BLUE/cool grey eyes**. 服装: black high-collar tactical inner shirt + **purple/violet hooded vest/hoodie** (oversized). 背景 = サイバー HUD 仮想空間。
- **PLR04 (蓮 / Ren)**: Black hair (short or tied back), focused intense eyes, white kendo gi or kendo-themed uniform, disciplined posture. Bamboo sword (shinai) optional.
  > **確定追加 (2026-05-06)**: **SHINAI (竹刀) は確定要素** (optional ではない、肩越しに斜めに掛ける配置 — 組紐・革巻き・先革まで描写)。**SHORT BLACK tousled hair** (windswept top, choppy front bangs). **WARM BROWN eyes** (calm intense focus, 残心 zanshin). 服装: white cotton **KENDOGI** (V-neck overlapping closure) + 黒インナーシャツの襟が首元に見える。背景 = 朝の道場・桜花びら舞う。
- **PLR05 (千歳 / Chitose)** [⚠️ **2026-05-06 全面書き換え** — 旧記述「pastel pink/lavender hair, casual school uniform, hourglass charm optional」は実画像と矛盾していた]: Long flowing **SILVER/PLATINUM hair** with **lavender/pale violet light reflections** in highlights (gentle pastel undertone, slightly wavy, center parted). **Soft VIOLET/LILAC eyes** (wistful, slightly distant — melancholy of repeated time loops). 服装: **DARK NAVY Japanese sailor school uniform** (V-shape navy flap collar with two parallel white lining stripes) + **WHITE buttoned shirt** + **NAVY ribbon-tie** at collar V. **Signature props**: **TWO GOLDEN POCKET WATCHES** floating at right side (different sizes, ornate gold cases with Roman numeral faces — drift untethered by gravity, not just a charm). Time-loop melancholy.
  > **背景 (2026-05-06 確定)**: 砂時計の浮かぶ夕暮れ・時間の海 (黄金の砂時計 ×4 が浮遊、桜花びら、上下反転の鏡水面)。装具呼応: キャラの金懐中時計 ⇔ 背景の金砂時計。
- **PLR06 (晴 / Haru)** [⚠️ **2026-05-06 全面書き換え** — 旧記述「violet eyes, school uniform + traditional haori, magatama charm」は実画像と複数箇所で矛盾]: Tousled **BLACK hair** (medium length) with a **distinctive WHITE/SILVER STREAK** through the right-side bangs (霊媒師の徴 / mediumship sign). Bangs partially fall over brow but eyes remain visible. **GOLDEN AMBER eyes** (luminous yellow-gold, NOT violet — knowing mischievous calm, faint confident smile). 服装: **DARK NAVY school uniform jacket** (gakuran-style, mandarin collar with brass buttons) — **NO haori jacket** (single layered, despite old §2). **GOLDEN CHRYSANTHEMUM EMBLEM** pinned on the right collar (subtle religious motif). White inner shirt visible at neckline. **Signature accessory**: **YELLOW PAPER OFUDA (御札)** dangling from a string near the right ear (red/black exorcism calligraphy visible) — **NOT magatama**.
  > **背景 (2026-05-06 確定)**: 神社境内の夜・セイマン魔法陣 (黄金五芒星 + 鳥居 + 漂う御札 + 石灯篭 + 桜)。呼応: キャラの黄色御札 ⇔ 背景の漂う御札 / キャラの金菊紋 ⇔ 背景の黄金セイマン。
- **PLR07 (カイ / Kai)**: Wind-tousled brown/sandy hair, bright spirited eyes, flight goggles on forehead/neck, light adventurer outfit. Free-spirited grin.
  > **確定追加 (2026-05-06)**: 髪色 = **SANDY/WHEAT BLONDE** (windswept upward, choppy)。**VIVID BLUE eyes** (clear sky blue)。**VINTAGE PILOT GOGGLES** with blue-tinted glass + **BRASS-and-leather frame** + leather strap (WWI/WWII flight aesthetic) on forehead。服装: **BROWN BOMBER JACKET with thick CREAM SHEARLING/SHERPA collar** + white inner shirt + **BLUE SCARF** (signature accessory, **NOT in original §2** — knotted at left shoulder, ends fluttering in wind)。背景 = 雲海と浮島 (黄金太陽光 + 滝のある浮島 + 飛ぶ鳥のシルエット)。
- **PLR08 (千夏 / Chinatsu)**: Long flowing chestnut/honey hair, kind warm eyes, simple village dress with religious accents, holy sword pendant or hilt visible. Pure determination.
  > **確定追加 (2026-05-06)**: **CHESTNUT/HONEY-BROWN hair** (warm wheat-amber tone, slightly wavy, parted middle) — front strands gathered into **TWIN BRAIDS** falling over chest (small black hair ties at ends)。**WARM AMBER/GOLDEN eyes**。服装: **CREAM/OFF-WHITE peasant blouse** (gathered neckline ruffles, balloon sleeves) + **BROWN LEATHER BODICE/CORSET** (cross-laced front lacing with golden eyelets, brown cord)。**Signature props**: 「pendant or hilt visible」を強化して **完全な聖剣** (GOLDEN cross-shaped hilt with intricate filigree pommel + dark navy/black grip with golden runic engravings + silver blade + cross-shaped LIGHT FLARE at crossguard = 神聖性を発光で表現)。背景 = 故郷の村と麦畑 (遠景の教会の尖塔 = 守る場所の象徴)。
- **PLR09 (透 / Toru)**: Sharp neat dark hairstyle, keen analytical eyes (glasses optional), school uniform with detective notebook visible. Sherlock-style intellect.
- **PLR10 (ノア / Noa)** [⚠️ **2026-05-06 全面書き換え** — 旧記述「Silver/platinum hair, futuristic clothing, sci-fi heroine, 未来から来た少女」は実画像と全項目で矛盾していた。GitHub 旧 512 もアイドル像で一致 = 長年放置されたバグ]: **アーキタイプ = アイドル / Idol Singer** [旧「未来から来た少女」を改訂、**作者承認済 2026-05-06**]。Long flowing **PINK hair** with subtle lavender/purple lowlights (pastel gradient), styled in **TWO LOOSE HIGH TWIN-TAILS** secured with **PURPLE/LAVENDER RIBBON BOWS** (×2). **BRIGHT SPARKLING GREEN eyes** (vivid emerald-jade with idol-grade kirakira highlights). Wide joyful smile, mouth open in mid-song. 服装: **idol stage costume** — sleeveless white/pink frilled top with elaborate ruffled high collar, **PINK/PURPLE HEART BOW** at chest center with **HEART PENDANT** on gold chain, frilled sleeve cuffs at upper arms (pastel pink + lavender + white palette)。装飾: **HEART-shaped GOLD earring** dangling from right ear。**Hand prop**: **BLACK PROFESSIONAL MICROPHONE** with gold accent ring (handheld idol style, 確定要素)。
  > **背景 (2026-05-06 確定)**: アイドルライブステージ — ホログラフィック未来都市の夢空間 (スポットライト束 + 浮遊クリスタルシャンデリア + 透明感ある未来都市シルエット + 鏡面ステージ + ピンク・紫の花 + キラキラ粒子)。**旧 §2「futuristic clothing」要素は背景のホログラフィック都市で部分継承** (=「未来都市のステージで歌う伝説のアイドル」解釈で旧設定と新設定が両立可能)。
  > ✅ **アーキタイプ重複の解決**: OPP01 いちか (アイドル) と被るが、PLR 側 = プレイヤーの歌姫 / OPP 側 = 対戦相手のライバルアイドル = ロール違いで物語的に成立。
- **PLR11 (凪 / Nagi)**: Apron over normal clothes, kitchen knife or ladle in hand, warm friendly smile, casual hair (could be tied back). Master chef confidence.
  > **確定追加 (2026-05-06)**: 髪色 = **vivid RED/ORANGE-RED tousled** (energetic, choppy)。**WARM AMBER/ORANGE eyes** (brilliant amber)。**Wide cheeky GRIN with visible teeth** (Yukihira Soma 系の自信)。服装: §2「apron over normal clothes」を **professional white CHEF COAT** に格上げ (double-button front + **TWO RED ACCENT BUTTONS** with pattern/sigil) + **RED NECKERCHIEF/BANDANA** (knotted at center)。**ハンドプロップ無し**: kitchen tool の代わりに **指差しジェスチャー** (left index finger up near temple = "I've got an idea!" pose、表情とポーズで料理人エネルギーを伝える)。背景 = 中世ファンタジー厨房 (銅鍋・煉瓦暖炉に火・吊るしハーブ・蝋燭・木窓の暖光)。呼応: 赤髪 ⇔ 暖炉の炎 / 赤ボタン ⇔ 吊るし赤唐辛子+トマト。
- **PLR12 (エル / El)** [⚠️ **2026-05-06 全面書き換え** — 旧記述「Dark hair with reddish/crimson highlights, slightly intense eyes, school uniform with gothic accents, charming but menacing aura, 元魔王・転校生」は実画像と全項目で矛盾していた。GitHub 旧 512 も森の精霊像で一致 = 長年放置されたバグ、4 例目]: **アーキタイプ = 森の精霊 / Forest Spirit** [旧「元魔王、転校生」を改訂、**作者承認済 2026-05-06**]。Long flowing **PALE GREEN/MINT hair** with subtle **GOLDEN-YELLOW lowlights** (sun-dappled forest light effect)。**BRIGHT AQUA/TEAL eyes** (vivid emerald-blue, gentle serene gaze, soft small smile — **NOT menacing**)。**Hair adornment**: **PINK FLOWER (rose/cosmos) cluster** on left side + smaller white flowers + green leaves + small gold beads + trailing green ribbons/vines。服装: **CREAM/IVORY off-shoulder peasant-style fantasy dress** with puffy short sleeves, **GOLD intricate embroidery** along neckline and waist, **GREEN/SAGE ribbon trim** at waist。装飾: GOLD chain necklace + GOLD vine-pattern bracelet。**Hand prop**: **WOODEN MAGICAL STAFF** (taller than character) — brown wooden shaft wrapped in vines/ivy, **ornate GOLD filigree work** at top forming circular leafy pattern, **GLOWING BLUE GEM/CRYSTAL** at center cabochon, gold leaves and flowers decorating staff body (**確定要素**)。
  > **背景 (2026-05-06 確定)**: 幻想の森・光の花の小道 (緑の樹冠 + 黄金の光柱 + ピンク花群生 + 白い発光小花 + 金の蝶々 + 光の粒子)。呼応: 緑髪 ⇔ 緑の森 / ピンク花の髪飾り ⇔ 背景のピンク花 / 杖の青宝石 ⇔ 発光する白花 — キャラと森が一体化する詩的構図。
  > ✅ **アーキタイプ重複の解決**: OPP04 なでしこ (治療師) や OPP08 メル (錬金術師) と魔法系で部分重複するが、**自然・森・植物の精霊**という方向で十分差別化済。
- **PLR13 (イレウユ / Yre Uyu)** [⚠️ **2026-05-06 全面書き換え + 名前完全変更 + アーキタイプ変更 + lore 拡張** — 旧記述「Light/silver hair, soft uncertain eyes, adventurer outfit (cape, leather), slightly lost expression. Beautiful but melancholic. / 旧名: スミレ / 旧アーキタイプ: 記憶喪失の冒険者 (女性)」を完全に書き換え。第 6 タイポロジー初出 = **完全リネーム+アーキタイプ変更+lore 拡張**]: **新名: イレウユ / Yre Uyu** (旧スミレ)。**アーキタイプ = 記憶喪失の浮遊霊 / Wandering Amnesiac Spirit** (作者承認 2026-05-06)。**性別: 男性または中性的男性寄り** (旧女性から変更)。Short tousled **SILVER/PLATINUM-WHITE hair** (with **stray ahoge** sticking up, slight pastel undertones)。**CALM BLUE eyes** (gentle, slightly uncertain melancholic gaze)。Slightly faint expression。Pale otherworldly skin。**Headgear (signature)**: **WHITE BANDAGE wrapped horizontally around forehead** (slightly soiled, suggests trauma)。**Facial detail**: **WHITE PLASTER (絆創膏) on left cheek**。服装: **DARK BLACK/CHARCOAL jacket** with **high stand-up collar** (zip-front + **gold trim**) + **BLUE inner lining** visible at collar + **BLACK inner shirt** at V-neck + **BUCKLE/STRAP detail** on chest (post-apocalyptic wanderer aesthetic)。
  > **🌫️ 透過/浮遊 lore (作者指定、画像には visible しないが lore canonical)**: **下半身が半透明に透けている** (lower body becomes transparent, fading toward forgotten memory) + **わずかに浮遊している** (feet slightly hover above ground)。フルボディ画像 (LS/PT 挿絵等) ではこの要素を visualize すること。
  > **背景 (2026-05-06 確定)**: 忘れられた古代遺跡 — 浮遊する紫の薄明 (石造の柱・アーチ・崩れ壁 + 苔と蔓 + 中央の石段 + 紫色に発光する小花 + 浮遊する紫色の発光粒子 + 淡い光柱)。呼応: 透ける下半身 (lore) ⇔ 浮遊する紫の粒子 / 浮遊感 (lore) ⇔ 奥に消失する石段。
  > 💡 **第 6 タイポロジー**: 単なるデザイン変更ではなく、**キャラの存在概念そのものが書き換わった**ケース (名前+性別?+アーキタイプ+lore すべて変更)。slug も `sumire` → `yreuyu` にリネーム。
- **PLR14 (葉月 / Hazuki)**: Goggles on forehead, messy creative hair, work apron over clothes, holding tool/gear. Inventor's gleam.
  > **確定追加 + 整合化型+強化型 mix リデザイン (2026-05-06)**: 旧 v1 が §2 と完全乖離 (聖騎士系少女、機械工学要素ゼロ) だったため、作者が **§2 採用方向 + 妖しさ・マニアックさ強化** で完全リデザイン。**Long flowing GOLDEN BLONDE hair** + **signature ORANGE STREAK / HIGHLIGHT** (vivid orange-red strands on front-left side, inventor-eccentric color accent, **不可動の確定要素**)。**BRIGHT BLUE eyes** (intelligent piercing, mischievous knowing smile)。**Eyewear (signature, §2「goggles on forehead」を進化)**: **ELABORATE STEAMPUNK MECHANICAL EYEPIECE / MONOCLE** worn over right eye (NOT on forehead, actively in use) — brass/gold intricate frame + multiple lens layers + telescopic attachment + mechanical arms/struts + adjustment dials。**Hair adornment**: **DARK NAVY BOW with gold clockwork pattern** + **GEAR-SHAPED brass ornaments** (×3) + **hanging chains with clockwork charms**。服装: **DARK NAVY/INDIGO BLOUSE** with **GOLD ornate trim** + **WHITE FRILLED RUFFLED COLLAR/JABOT** + **DARK BLUE BOW with GEAR-SHAPED brass brooch** + **LEATHER CORSET with mechanical attachments** (gauges, dials, brass tubes, blue gem inlays = wearable tech)。**Hand prop**: **METAL TECHNICIAN'S PEN / STYLUS** (slim mechanical pen with brass+black bands、§2「holding tool/gear」を精密筆記具に specification)。**Energy**: 妖しさ + マニアックさ = beauty + mania, mad scientist aristocrat (Victorian-era obsessive inventor)。
  > **背景 (2026-05-06 確定)**: スチームパンク発明家の工房 (真鍮ペンダントランプ + 壁一面の真鍮歯車 + 銅パイプ・蒸気管網 + 発明設計図の壁 + アーチ窓の暖光 + 作業台の精密試作機械 + 青旗+革装本+真鍮急須)。呼応: 髪のオレンジメッシュ ⇔ 暖色ランプ光 / 歯車髪飾り ⇔ 壁一面の真鍮歯車 (拡大鏡像) / メカニカル眼鏡 ⇔ 作業台の精密機械試作品 / クロックワーク chains ⇔ 天井の鎖。PLR ROSTER 中で最も視覚情報量が多く、最もキャラと背景が同質に溶け合うペア。
  > 💡 **知性系 4 重対立完成**: PLR03 リン (サイバー) + PLR09 透 (推理) + PLR19 奏太 (芸術) + **PLR14 葉月 (機械工学)** で 4 重対立軸完成。
- **PLR15 (ジエンド / The End)** [⚠️ **2026-05-06 全面書き換え + 完全リネーム + アーキタイプ specification + イケオジ化** — 旧記述「Sharp confident look, tactical jacket or sniper outfit, holding pistol/rifle, focused cool eyes / 旧名: 隼人 / 旧アーキタイプ: 凄腕ガンナー」を完全に書き換え。第 6 タイポロジー 2 例目 = **完全リネーム型** (PLR13 イレウユと同型)]: **新名: ジエンド / The End** (旧 隼人/Hayato)。**アーキタイプ = 凄腕ガンナーカウボーイ (イケオジ) / Master Gunslinger Cowboy** (作者承認 2026-05-06)。**年齢 persona: 30 代後半〜40 代前半のイケオジ** (旧若年から成熟へ変更)。Long messy/wild **DARK PURPLE-BLACK hair** (with subtle purple undertones, slightly choppy and unruly, falls past shoulders — wind-swept gunslinger style)。**STEELY PURPLE/VIOLET eyes** (narrowed, calm intensity, gunslinger gaze with weariness)。**WELL-GROOMED BLACK STUBBLE/BEARD** (整えられたカウボーイビアード、口周りと顎、確定要素)。Tan sun-weathered skin (outdoorsman complexion)。**Headgear (signature)**: **DARK BROWN WIDE-BRIM COWBOY HAT** (weathered leather, Stetson-style) + **FEATHER decoration** on left + **METAL BUCKLE/STRAP details** on band + **GOLD/BRASS CIRCULAR EMBLEM with STAR motif** on right side (sheriff/marshal-like insignia)。服装: **DARK BROWN LEATHER COAT/JACKET / DUSTER** (Western-style long coat, high upturned collar) + **GOLD/BRASS GEAR-LIKE EMBLEM** on left shoulder (steampunk-cowboy fusion accent) + **CREAM/OFF-WHITE COLLARED SHIRT** + **DARK RED/BURGUNDY BANDANA/NECKERCHIEF** at neck + **METAL STAR BADGE** (large 5-pointed brass/silver star) on right chest (sheriff/marshal/bounty hunter badge — symbolizes "End"-ing role)。**Implied weaponry**: holster harness underneath duster (revolvers concealed, cowboy gunslinger 確定要素)。
  > **背景 (2026-05-06 確定)**: 西部開拓時代の町・夕陽 (オレンジに燃える地平線 + dusty な土の道 + 木造サルーン+店舗 + サグアロサボテン + 馬車の車輪 + 木の柵柱 + 古い荷馬車 + 遠景の岩山・メサ)。呼応: 暗紫の髪 ⇔ 夕陽の濃紫の影 / 茶のカウボーイハット ⇔ 木の梁+古い荷馬車 / 赤バンダナ ⇔ 燃える夕陽 / 金の歯車肩 emblem ⇔ 馬車の車輪 (steampunk-cowboy fusion)。
  > 💡 **第 6 タイポロジー 2 例目** (PLR13 イレウユに続く完全リネーム型): 名前 (隼人→ジエンド)+アーキタイプ specification (ガンナー→カウボーイ系)+年齢 persona (若者→イケオジ) すべて変更。slug も `hayato` → `theend` にリネーム。男性アクション系の三項対立完成: PLR04 蓮 (剣道) / PLR07 カイ (空) / PLR15 ジエンド (Western 銃)。
- **PLR16 (ひかり / Hikari)** [⚠️ **2026-05-06 全面書き換え + 完全リデザイン** — 旧記述「Bright golden/blonde hair, luminous eyes, ethereal flowing outfit with light effects, Holy/radiant aesthetic, 光の精霊使い」は実画像と全項目で矛盾していた (§2 仕様書バグ + 作者主導完全変更の合成パターン、第 5 タイポロジー初出)]: **アーキタイプ = ジムにいたお姉さん♡ / Gym Onee-san (Athletic Big Sis)** [旧「光の精霊使い」を改訂、本セッション最大級の変更、**作者主導完全リデザイン 2026-05-06**]。**GOLDEN BLONDE hair** (sun-kissed honey blonde, slightly wavy) styled in **HIGH PONYTAIL** with **DARK NAVY/BLACK SCRUNCHIE** (運動向け)。**BRIGHT BLUE eyes** (sparkly, slightly playful gaze, お姉さん的なフレンドリー teasing energy)。**CHEEKY TONGUE-OUT EXPRESSION** (舌ペロ、確定要素)。**Subtle blush** + **visible sweat droplets** (post-workout authenticity)。Healthy athletic toned physique。服装 (現代ジムウェア): **NAVY BLUE TRACK JACKET** (unzipped open) with **WHITE TRIPLE STRIPES** down sleeves + **NAVY BLUE SPORTS BRA / CROP TOP** underneath (toned midriff exposed, post-workout casual)。**Accessories**: **WHITE TOWEL** draped over right shoulder + **DARK NAVY SCRUNCHIE** in ponytail。**Hand prop**: **PROTEIN SHAKER / SPORTS BOTTLE** with **PINK protein shake** liquid + DARK NAVY screw-top lid (確定要素、現代フィットネス文化の象徴)。
  > **背景 (2026-05-06 確定)**: 現代の明るいフィットネスジム — 朝の柔らかい陽光 (ダンベルラック + ケーブルマシン + ケトルベル + トレッドミル + 紺ロッカー + 青エクササイズボール + 観葉植物 + 紺白ストライプ壁装飾 + 木目調フロア)。呼応: 紺トラックジャケット+紺スポブラ ⇔ 紺ロッカー+紺マット+紺ストライプ壁 = 紺カラー多重呼応。
  > 💡 **第 5 タイポロジー初出**: 「§2 全面誤り + 作者が旧画像方向で強化リデザイン」(PLR17 「§2 整合方向リデザイン」とは逆方向)。旧 v1 (GitHub 512) も既に運動系だったが、作者が舞台 (夕方グラウンド→現代ジム) と persona (一般運動少女→お姉さん♡) を格上げ。
  > 💡 **対比軸**: PLR04 蓮 (古典武道・剣道部主将) ⇔ PLR16 ひかり (現代フィットネス・ジムお姉さん) = 「鍛える」テーマの東西文化対比。
- **PLR17 (ヨル / Yoru)**: Black or dark purple hair, red eyes, slightly pale skin, gothic/elegant outfit (frills, dark coat), subtle fangs in smile optional. Nocturnal mystery.
  > **確定追加 + アーキタイプ純化 (2026-05-06 — 作者意図的 §2 整合方向リデザイン)**: アーキタイプを **「半吸血鬼」→「吸血鬼 / Vampire」** に純化 (作者承認、旧 v1 が §2 と完全乖離していた = 緑眼+鳥使い+森系の別キャラだったため、作者が §2 採用方向で完全リデザイン)。**DARK BLACK hair with PURPLE undertones/highlights** (slightly choppy bedhead, gothic-tinged messy refined)。**CRIMSON RED eyes** (vivid blood-red, supernaturally crimson — confirmed)。Slightly pale porcelain skin (intentional vampire pallor)。**VISIBLE FANG** (subtle but clearly defined sharp single fang at corner of mouth — **確定要素**, "optional" を確定化)。Slight composed aristocratic smile。服装: **dark BLACK + DEEP CRIMSON ASYMMETRIC HIGH-COLLAR JACKET** with **gothic paisley/damask embroidery** + **BLACK FRILLED CRAVAT/JABOT** + **CRIMSON RUBY GEM BROOCH** (ornate silver setting at cravat center)。**Accessories (確定追加)**: **SILVER CHAIN with BAT-shaped CHARM** (vampire signature 不可動)+**cross-pattern silver detailing** at lapel。
  > **背景 (2026-05-06 確定)**: 月夜の吸血鬼の館 (ゴシック大聖堂のアーチ窓 + 満月 + 飛ぶコウモリのシルエット + 紫のベルベットドレープ + 赤いバラ群 + 舞い散る赤い花弁 + 赤い蝋燭の炎 + 濡れた石畳の反射)。呼応: **キャラの牙 + コウモリチャーム ⇔ 月のコウモリのシルエット = 三重の bat motif** (装具+モチーフ+月のシルエット)。
  > 💡 **特殊ケース**: 旧 v1 が §2 と乖離 (§2: 半吸血鬼 / 旧画像: 鳥使い・自然系)、作者が **§2 採用方向で完全リデザイン**。第 4 タイポロジーの初出 (PLR19 「§2 整合の旧画像を作者強化」とは異なる、「§2 整合方向で旧画像を再設計」)。
  > **§2 整合化リデザイン (2026-05-06)**: §2 ROSTER は元から完璧な吸血鬼描写だったが、**旧 v1 (GitHub 旧 512) が森の少年・小鳥使いに完全乖離していた** (緑の瞳、黄金の森背景)。新 v2 で作者が「キャラクターデザインを一新させ、吸血鬼にしました」 = §2 を初めて正しく実装した整合化版。**PLR19 (画像強化型) と性質が逆方向**: PLR17 = 整合化型 (§2 明確だが画像が外れていた→直す)。
  > **確定追加 (2026-05-06)**: **BLACK hair with PURPLE/PLUM undertones** (tousled, choppy front bangs, sharp pointed gothic style)。**DEEP CRIMSON eyes** (slim-eyed predator gaze, vampire-coded)。**PALE moon-pale skin**。**FANG visible at corner of mouth (確定要素、§2 旧 "optional" を確定化)**。服装: **BLACK COAT with high mandarin collar** + **DEEP WINE/BURGUNDY interior lining/trim** (gothic filigree pattern) + **BLACK RUFFLED CRAVAT/JABOT** (multiple layers, Victorian formal)。**Accessories (確定要素)**: **SILVER GOTHIC CROSS NECKLACE with RED GEM** (vampire's blood gem cabochon) + **BAT-SHAPED SILVER PENDANT/BROOCH** on right shoulder/lapel (wings spread = direct vampire signature, **NOT in original §2** but unmistakable)。
  > **背景 (2026-05-06 確定)**: ゴシック大聖堂の夜 (高い尖塔型ゴシック窓 + 満月 + 飛ぶ蝙蝠のシルエット + 紫のベルベットカーテン + 赤薔薇 + 舞う赤い花弁 + 深紅の蝋燭 + 霧の漂う石畳)。
  > **呼応**: 蝙蝠ペンダント (キャラ右肩) ⇔ 飛ぶ蝙蝠 (背景満月前) = 二重鏡像構造 / 赤い瞳 ⇔ 赤い薔薇+蝋燭+花弁 = crimson の環境呼応。OPP17 レオン (騎士・正午) や OPP09 悟 (修行僧・朝陽) の対比軸 = **夜と影の住人**。
- **PLR18 (湊 / Minato)** [⚠️ **2026-05-06 部分訂正** — 旧記述「salt-tousled hair (blue/teal accents), nautical outfit (sailor-inspired)」は実画像と矛盾していたが、**アーキタイプ「海の冒険者 / Ocean wanderer」は維持** (背景の tall ship+海と整合)。GitHub 旧 512 も Victorian explorer 像で一貫 = 装具誤記が長年放置されたバグ、6 例目 (部分訂正タイプ)]: **Long flowing GOLDEN BLONDE hair** (warm sun-kissed honey blonde, slightly wavy — §2 の "sun-kissed" 形容を髪色で実現、blue/teal 髪 accent は誤記なので削除)。**BRIGHT BLUE eyes** (vivid sky/sea blue, sparkly)。Soft refined smile (静かな自信、女性的な品格)。Fair complexion with warm undertones。**Headgear (signature)**: **TAN/BROWN PITH HELMET** (探検家帽子, 19世紀 world-traveler aesthetic) + feather + flower decoration on left + **GOLD ornament/badge** on right。**服装 (改訂後 — sailor → Victorian explorer-photographer)**: **TAN/BEIGE EXPLORER COAT/JACKET** (multiple buttons + pockets, structured 19世紀風) + **BLUE HOOD/CAPE** layered underneath + **WHITE LACE/RUFFLED BLOUSE** + **GOLD CRAVAT/BOW** with **BLUE JEWELED BROOCH**。**Accessories**: **BLUE GEM EARRING** dangling from right ear + **GOLD COMPASS-LIKE PENDANT** at chest (cardinal-points design = 確定要素、航海の象徴)。**Hand prop**: **VINTAGE FILM CAMERA** (silver/black metal, brass dials, large lens — 19世紀 explorer's documentation tool, **NOT compass/sextant**)。
  > **背景 (2026-05-06 確定)**: 夕陽の海岸・出航の瞬間 (黄金の太陽 + 青い海 + 波しぶき + tall ship + 飛ぶ鴎 + 緑の崖)。アーキタイプ「海の冒険者」を背景の tall ship で継承、キャラのカメラと組み合わさり「**Victorian explorer-photographer / 海も陸も記録する大航海時代の冒険者**」として再解釈。
  > 💡 **対比軸**: PLR07 カイ (空の冒険者・動的な空) ⇔ PLR18 湊 (海の冒険者・静的な記録)。両方とも冒険系だが性質が異なる。
- **PLR19 (奏太 / Souta)**: Refined black or chestnut hair, artistic sensitive eyes, formal concert attire (tuxedo or recital dress), elegant poise. Music in soul.
  > **確定追加 (2026-05-06 — 作者意図的リデザイン版)**: 旧 v1 が「ピアニスト感に乏しい平凡デザイン」だったため、作者が意図的にオトナの天才ピアニスト像へ強化。**§2 仕様書バグではなく、作者主導アップグレード**。**DARK BROWN/almost-black short tousled hair** (sophisticated bedhead)。**HETEROCHROMIA EYES**: vivid BLUE left eye + warm AMBER/GOLD right eye (虹彩異色、§2 未記述の確定要素 — artist's eyes that see music differently)。**BLACK-FRAMED ROUND/OVAL GLASSES** (確定追加、知性的記号)。**Iconic pose**: adjusting glasses with right hand (指先で眼鏡のブリッジを上げる、演奏前の集中ジェスチャー)。服装: **BLACK formal tuxedo with mandarin/stand-up collar** + **gold trim along lapel edges** + **WHITE pleated formal shirt** (tuxedo bib front) + **BLACK BROCADE/FLORAL PATTERN VEST** + **WHITE pocket square**。**Lapel pin (確定要素)**: **GOLD TREBLE CLEF (𝄞 G音符) PIN** on right lapel (ピアニストの不可動の記号)。背景: コンサートホール (黄金スポットライト + 深紅ベルベットカーテン + 漂う金の音符・ト音記号 + グランドピアノ片側)。呼応: 襟のト音記号ピン ⇔ 漂う金の音符 (二重鏡像構造)。
- **PLR20 (悠 / Yu)** [⚠️ **2026-05-06 全面書き換え** — 旧記述「Heroic stance, divine aura, classical/legendary outfit (laurel, ancient armor accents, cape), confident god-like eyes, Pinnacle hero, 神話の英雄」は実画像と矛盾していた。GitHub 旧 512 も和の姫君像で一致 = 長年放置されたバグ、5 例目]: **アーキタイプ = 神話の姫 / Mythical Princess** [旧「神話の英雄」を改訂、「神話」概念を継承、「英雄 (戦士)」を「姫 (神格化乙女)」に変更、**作者承認済 2026-05-06 新ポリシー**]。Long flowing **SILVER/PLATINUM hair** (slightly wavy, blue-grey/lavender undertones — moonlit silver effect, parted middle, draping past shoulders)。**BRIGHT VIVID BLUE eyes** (calm, dignified, ethereal sparkle — NOT god-like aggression, but transcendent serenity)。Soft faint knowing smile (refined, mysterious, not heroic but transcendent)。**Hair ornament**: elaborate **BLUE FLORAL HAIR PIECE** on left side (blue hydrangea-like flowers + **GOLD BUTTERFLIES** ×2 + trailing tassels with **BLUE BEADS** = kanzashi-style + white accent flowers + gold leaves)。服装: **LIGHT BLUE/WHITE JAPANESE KIMONO** (delicate floral pattern in gold and blue — hydrangea, cherry blossom motifs) + **DARK NAVY/BLUE collar trim** (V-neck overlap, traditional kimono style) + white underlayer。**Hand prop**: **JAPANESE FOLDING FAN (扇子 / sensu)** held in right hand partially open — gold-rimmed bamboo ribs + ornate blue/gold floral painting on paper face (確定要素、wisdom + noble grace symbol)。
  > **背景 (2026-05-06 確定)**: 神域のプラザ — 雲上の白大理石神殿 (新古典主義風コリント式柱 + 黄金の蔓装飾 + 雲海 + 遠景の黄金ドーム神殿 + 太陽光柱 + 金のマンダラ床面 + 金の儀式壷 + 青葉と白い花の前景)。**和風キャラ × 西洋風神域プラザ = 多文化融合の神話頂点**。旧 §2 「classical/legendary」要素は背景で吸収継承。
  > 💡 **解釈**: PLR20 は PLR の最終枠 (隠しキャラ予想)。PLR12 エル (森の精霊・動的な森の生命) との対比軸: PLR20 = 神話の神域 (静的な天界の品格)。両者とも「神性」だが性質が異なる。

---

# §3 OPP ROSTER — 対戦相手 20 体

各 OPP は「盤上世界の達人 / Master of the Board World」。ストーリーの第N章 (Lv.N) のラスボス。

| ID | Slug | 名前 | EN | アーキタイプ | Archetype | 名言 |
|---|---|---|---|---|---|---|
| **OPP01** | ichika | いちか | Ichika | アイドル | Idol Singer | 「ふぁいとぉ♪ 楽しんで！」 |
| **OPP02** | aoi | 葵 | Aoi | 弓使い | Archer | 「狙いはバッチリだよっ！」 |
| **OPP03** | asahi | 朝日 | Asahi | 剣士 | Swordsman | 「いざ尋常に！」 |
| **OPP04** | nadeshiko | なでしこ | Nadeshiko | 治療師 | Healer | 「無理せずいきましょう」 |
| **OPP05** | hibiki | 響 | Hibiki | 吟遊詩人 | Bard | 「楽しい一局を奏でよう♪」 |
| **OPP06** | tsumugi | つむぎ | Tsumugi | 獣使い | Beast Tamer | 「相棒もわくわくしてる」 |
| **OPP07** | akane | 茜 | Akane | 技師 | Engineer | 「歯車みたいにかっちりね！」 |
| **OPP08** | mel | メル | Mel | 錬金術師 | Alchemist | 「ふふ、ちょっと混ぜてみよっか？」 |
| **OPP09** | satoru | 悟 | Satoru | 修行僧 | Monk | 「無心に石を置く、ただそれだけ」 |
| **OPP10** | shiki | シキ | Shiki | 盗賊 | Rogue | 「気付いた時には遅いよ」 |
| **OPP11** | shion | シオン | Shion | 魔術師 | Mage | 「すべては予測の内だ」 |
| **OPP12** | luna | ルナ | Luna | 夢の魔女 | Dream Witch | 「夢の中でもう勝ってるよ♡」 |
| **OPP13** | yukino | 雪乃 | Yukino | 学園軍師 | School Strategist | 「この程度、解析するまでもない」 |
| **OPP14** | akira | アキラ | Akira | 探偵 | Detective | 「君の手筋、見えているよ」 |
| **OPP15** | ciel | シエル | Ciel | サイバー斥候 | Cyberpunk Scout | 「全データ把握、戦況優位」 |
| **OPP16** | aria | アリア | Aria | 姫君 | Princess | 「お手柔らかに、ですわ」 |
| **OPP17** | leon | レオン | Leon | 騎士 | Knight | 「正々堂々、参る！」 |
| **OPP18** | sojiro | 宗次郎 | Sojiro | 侍 | Samurai | 「我が一刀、避けられはせぬ」 |
| **OPP19** | arashi | 嵐 | Arashi | 竜騎士 | Dragon Rider | 「我が竜の前に膝を折れ！」 |
| **OPP20** | zero | ゼロ | Zero | ハッカー (最終ボス) | Hacker (Final Boss) | 「全ての変分は計算済み。詰みだ」 |

## OPP キャラクター固有の維持ポイント

> **📌 v2 NOTE (2026-05-06 更新)**: 以下の記述は **実際に生成・承認された完成版キャラクター画像 (`completed_so_far/characters/`) に準拠** しています。これがキャラクターの正となります。再生成依頼や差分修正の際は、これらの記述と参照画像 (`reference_originals/`) を併せて参照してください。

- **OPP01 (いちか / Ichika)**: Long flowing pink hair with two large dark-pink/magenta floral bows holding side sections, pink eyes, frilly pink-and-white idol costume with magenta chest ribbon and central jewel, frilly cuff bracelets, holding microphone, winking with one hand outstretched. Sparkling cheer.
- **OPP02 (葵 / Aoi)**: Spiky shoulder-length green hair with side braid and white feather hair-ornament, bright green eyes, big open-mouthed grin, green cloak/cape over leather chest harness with gold star buckle, brown wooden bow visible behind shoulder, quiver of arrows. Forest hunter.
- **OPP03 (朝日 / Asahi)**: Young swordsman embodying **East-West Fusion Bushido**. Black shoulder-length hair tied back at the nape with a red cord, warm brown eyes, bright open-mouthed cheerful grin. White juban (under-kimono) with visible collar + indigo hakama trousers (Japanese inner layer). Black breastplate and shoulder pauldrons (Western plate armor style) with gold edge trim and engraved Eastern motifs (cherry blossom, family crest). Red haori-style scarf draped over one shoulder, red obi sash at waist. Single katana at waist with gold-filigree metal scabbard. NOT pure kendo gi, NOT pure Western plate — clear visual fusion of both. (NOTE: 既存挿絵 `chapter_03_*` は旧 §3 で描かれているため、本融合デザインに合わせて再生成必要)
- **OPP04 (なでしこ / Nadeshiko)**: Long pink hair beneath a white veil/headcovering trimmed with green and gold, white lily flower hair-ornament, gentle green eyes, white and green healer's robe with gold filigree and crystal pendant, holding ornate gold staff topped with leaves and a green crystal. Maternal peace.
- **OPP05 (響 / Hibiki)**: Bright golden-blonde wavy hair, green beret with gold trim adorned with a blue gem and white feather, warm brown eyes, big cheerful smile, white frilly cravat, dark coat with green cloak (gold trim and blue gem at the closure), holding wooden lute/mandolin. Warm troubadour.
- **OPP06 (つむぎ / Tsumugi)**: Beastfolk girl with short messy silver-white hair and prominent brown-and-white CAT EARS, bright green eyes, playful open-mouthed grin showing a small fang, green-and-brown tribal outfit with white fur trim and gold/leather accents, jewelled choker; with a SMALL BROWN FURRY BEAST COMPANION (raccoon-cat hybrid) perched on her shoulder. Wild beastfolk vibe (NOT a human braided traveler).
- **OPP07 (茜 / Akane)**: Bright orange hair tied in a HIGH PONYTAIL with leather cord, brass-and-leather aviator goggles pushed up on forehead, warm amber/orange eyes, big bright grin, sleeveless dark-brown leather VEST over red shirt (NOT an apron), brown fingerless gloves, holding large iron spanner/wrench in one hand, brass steam-pipe contraption visible over shoulder. Eccentric inventor.
- **OPP08 (メル / Mel)**: Long sage-green wavy hair with side braid, large GOLD METAL HEADBAND ornament (NOT a witch hat), gold round-rimmed glasses, golden-yellow eyes, soft smile, white high-collared shirt under green corset/bodice with elaborate gold filigree, brown leather alchemy backpack with multiple flask-tubes (green liquid) on her back, holding a bubbling green Erlenmeyer flask. Bookish alchemist (NOT a witch).
- **OPP09 (悟 / Satoru)**: Shaved head, gold geometric/diamond seal mark on forehead, calm green eyes (OPEN, slight gentle smile — not closed in meditation), BLACK outer robe over WHITE inner robe with gold trim (NOT orange Buddhist robes), very large brown wooden prayer beads (juzu/mala) draped diagonally across chest. Quietly serene zen monk.
- **OPP10 (シキ / Shiki)**: Black tousled hair with a prominent WHITE STREAK at the front, violet eyes, dark navy hooded outfit with PURPLE inner lining (hood down), black turtleneck under armored shoulder pieces with diamond/hexagonal crest, leather straps and buckle, fingerless gloves, holding a curved silver dagger; "shh" finger-to-lips pose with confident smirk. Roguish charm.
- **OPP11 (シオン / Shion)**: Long **lavender / light purple hair** (CRITICAL: NOT dark navy, NOT silver — clearly lavender purple), violet eyes with **round-rimmed glasses** (thin gold frames). Large purple/navy WITCH HAT with elaborate gold crescent-moon and star ornaments, red diamond gems both on hat band and dangling from thin gold chain at hat brim. Dark navy/purple cloak with gold trim, gold star pendant emblem on chest with inset purple gem. Refined celestial mystic / astrologer-mage. NOT holding a tome in portrait. (NOTE: 章別挿絵 `chapter_11_*` と完全整合 — 髪色・眼鏡・帽子・ローブすべて一致)
- **OPP12 (ルナ / Luna)**: Long lavender wavy hair, dreamy violet eyes with shiny highlights, LARGE dark-purple witch hat with gold trim and ornate amethyst gem decorations, gold and crystal star-shaped earrings dangling from hat brim, dark purple/black robe with gold cross/star embroidery, small smile with hand near face. Dreamy ethereal (NOTE: the transparent cubes / floating othello stones described in the lore are placed on the BACKGROUND LAYER, not on the character).
- **OPP13 (雪乃 / Yukino)**: Long **silver / light gray hair** (NOT dark navy, NOT black) flowing past shoulders, side braid tied with blue ribbon and gold star hairpin. **Round-rimmed glasses** (visible, framed). Blue eyes, calm intellectual gaze. Navy school blazer with gold trim and gold star embroidery on lapels, large red bow tie with central blue jewel ornament, beige sweater vest, white shirt collar. Cool data-strategist composure with hand-near-chin analyzing pose. (NOTE: holographic analysis screens described in lore are placed on the BACKGROUND LAYER, not on the character. 章別挿絵 `chapter_13_*` と整合)
- **OPP14 (アキラ / Akira)**: Brown checkered/plaid deerstalker hat, dark brown short tousled hair, sharp keen blue eyes, white shirt with brown checkered tie, dark checkered waistcoat, beige trench coat with high collar, BLACK leather gloves holding ornate gold-rimmed magnifying glass. Sherlockian sleuth.
- **OPP15 (シエル / Ciel)**: Silver/white tousled hair with single bright CYAN streak in front, large purple-and-cyan tinted goggles pushed up on forehead, HETEROCHROMIA (one violet eye + one blue eye), gentle confident smile, sleek black/cyan/purple cyberpunk hooded jacket with high collar, side-mounted headphones with mic, technical gadget on shoulder. Gender-ambiguous androgynous look.
- **OPP16 (アリア / Aria)**: Long flowing golden-blonde hair with elaborate braided crown/bun on top, sapphire blue eyes, gold tiara set with a large blue diamond gem, blue diamond gem dangling earrings, soft princess smile, royal elegance. **アバター用衣装**: White frilly off-shoulder ballgown with gold trim and blue diamond gem accents. **章別挿絵用衣装 (バリエーション)**: Sapphire blue ballgown with white gloves and lace fan.

  > 💡 **2026-05-06 確定**: マルチ衣装設定 — アリアは姫君として場面で衣装を変える設定。アバター (白ドレス) と章別挿絵 (青ドレス) の両方が canonical。共通の identifying features (髪・瞳・ティアラ・サファイアジュエル) は全衣装で一貫。
- **OPP17 (レオン / Leon)**: Tousled blonde hair, noble blue eyes, gentle confident smile, polished silver platemail with gold filigree trim, blue undertunic visible at neck, large gold star/sun-burst chest crest set with a central blue diamond gem (this is the "Othello Crest" emblem — also appears in the background banner). Chivalric knight (sword not visible in this bust portrait).
- **OPP18 (宗次郎 / Sojiro)**: Long indigo (deep blue-purple) hair flowing down past shoulders, scar across one cheek, wise weathered eyes with the gravity of many battles, calm and composed face of a battle-hardened veteran samurai. Beard/goatee adds to the seasoned appearance. Black warring-states armor (Sengoku-era ōyoroi style) with crimson cord lacing (緋縅), gold laurel-wreath family crest on the chest plate, traditional kabuto motifs. Two katanas at waist (大小二本差し / daishō). Aged but not frail — a master swordsman in his prime years of veteran experience. Stoic, dignified.
- **OPP19 (嵐 / Arashi)**: Spiky messy red hair, golden/amber eyes, big confident wild grin, gold-and-black ornate plate armor with white fur mantle on right shoulder, blue diamond gem set in a gold star/cross emblem on chest, with a SMALL RED DRAGON COMPANION perched directly on his left shoulder (gold horns, fierce golden eyes — small enough to sit on shoulder, NOT a giant blue dragon silhouette). Heroic dragon-rider energy.
- **OPP20 (ゼロ / Zero — FINAL BOSS、フード姿が標準アバター)**: Deep dark hood pulled up, ONE visible cyan-glowing eye (left), other eye and most of face hidden in shadow. Silver/white hair partially visible at front under the hood. Dark cyber-mask covering lower face. Black hooded cyberpunk cloak with elaborate cyan neon line patterns. Floating black othello stone with cyan halo near extended hand. Mysterious omnipotent presence — the supreme calculator who has transcended humanity. 背景はグリーンマトリクスコードレイン。

  > 💡 **2026-05-06 確定**: 世界観正本 §5.3 に従い、フード姿が OPP20 の標準アバター。あらゆるシーン (キャラ選択画面・ストーリー戦闘・フリー戦闘) でこのフード姿が表示される。フード無し版 (現世帰還後) は **OPP21** として独立した隠しキャラに分離。

- **OPP21 (ゼロ / Zero (現世帰還) — 隠しキャラ)**: Silver/white tousled hair (NO HOOD UP — face fully visible), violet eyes (BOTH visible — NOT a single cyan-glowing eye), playful confident smirk with hand near hair, TWO PAIRS of large headphones (one set worn on head, second set worn around neck) with cyan circular displays, black cyberpunk jacket with bright purple and cyan neon accents, hood-down on a high-collar hoodie. Cool playful hacker aesthetic — the human Zero who has been redeemed and returned to the modern world. 背景は現代日本の街中・夕暮れ。

  > 💬 **名言**: 「変分は閉じない。それが、面白い。予想の外へ飛び出したくなった。」 旧名言 (フード姿時代の「全ての変分は計算済み。詰みだ」) との対比により、ゼロの予測支配からの解放と能動的な人間性回復を一文で表現。シナリオ章 20 真エンディングのクライマックスで使用。

  > 💡 **アンロック条件**: PLR01 英霊ハルキで章 20 をクリア (= 真エンディング達成) 後にアンロック。それまではキャラ選択画面で `???` 表示 (CSS フィルタで黒塗り化、アセット側の対応不要)。

- **OPP22 (ヴォイドφ / Void-φ — 隠しの隠しボス)**: Half-divine post-human entity, the world's successor to Zero generated after the true ending. White-tinted silver hair with golden light gradient at the tips (representing φ golden ratio's mystical aura), cold violet-blue eyes fading to pure white light at iris center (crystalline, glowing, NOT warm violet like Zero's), expressionless or faintly serene smile (transcendent beauty). NO HOOD (in contrast to Zero's hooded form — the void here is open). Refined sleek cyberpunk attire (black base + cyan-violet neon, deeper and colder than Zero's). Flowing white/gold light veils replacing the hood. φ symbol decoration: golden spiral patterns on chest plate, pentagram-like geometry, golden ratio rectangles in armor, earrings with crystal pendants. A small floating GOLDEN SPIRAL of light hovering in the open palm (replacing Zero's black othello stone). 背景は黄金螺旋+幾何学+銀河の神性宇宙空間 (ゼロのグリーンマトリクスとは対極の冷たい青紫+純白+淡金)。

  > 💬 **名言**: 「すべては φ の波動の狭間にある」 (英: "All exists between the waves of φ.") OPP21 ゼロの「変分は閉じない、外へ飛び出したくなった」との対比 — ゼロが「外」を志向するのに対し、ヴォイドφ は「すべては既に内側にある」と語る。「外へ出ようとした者」と「すべてを内に含む者」の対比構造で世界観の循環テーマを体現。

  > 💡 **アンロック条件**: 真エンディング達成後 (= OPP21 アンロック後) にフリーモードまたは隠しモードで挑戦可能な特別ボスとして独立。ストーリーモードには登場しない。

---

# 🎬 チャット式運用ルール (User → ChatGPT)

ChatGPT が指示書全文を把握したら、ユーザーは以下の形式で1体ずつ依頼:

```
Generate avatar refinement for: PLR00

[reference image attached: PLR00_default.png]
```

ChatGPT は以下を実施:
1. §2 PLR ROSTER から PLR00 のキャラデータを引く
2. §1 STYLE の共通仕様に従う
3. PLR00 固有の維持ポイント (黒髪・濃紺学生ジャケット等) を維持
4. 1024×1024 PNG で出力 (透明背景が出せるなら透明、出せないなら白)

ユーザーが OK を出したら次のキャラへ。NG なら具体的な修正点を伝えて再生成。

## 41体の生成順 (推奨)

```
PLR00 → PLR01 → PLR02 → ... → PLR20  (21体)
OPP01 → OPP02 → OPP03 → ... → OPP20  (20体)
```

ただし**順序は厳密でなくてもOK**。気になるキャラから着手しても問題ない。

---

# ⚠️ 過去の失敗から学んだ重要事項

前回の試行で以下の問題が発生 — 今回は明示的に対策:

| 問題 | 原因 | 対策 |
|---|---|---|
| 解像度が 1254×1254 になった | サイズ指定が曖昧 | §1 で「1024×1024 (square; no other size accepted)」と明記 |
| 背景が白塗りで RGB 出力 (アルファ無し) | DALL-E 系が透明出力非対応 | §1 で「透明出せないなら白でOK」と明示。ユーザー側で透過処理 |
| 円形フレームが画像に焼き込まれた | リファレンスの円が引き継がれた | §1 で「NO circular frames」を強調 |

---

# 📋 受領後のユーザー側処理 (参考)

ユーザー側 (Claude) で以下を自動実施:

1. ✅ 解像度を 1024×1024 にリサイズ (必要なら)
2. ✅ 背景が白なら自動で透明化処理 (背景透過アルゴリズム)
3. ✅ ファイル名を正しく保存 (例: `PLR00_default.png`)
4. ✅ 検証 (透明背景・キャラ維持・サイズ)
5. ✅ 進捗トラッカー更新

これで ChatGPT は**画像生成のクオリティに集中**でき、後処理はユーザー側で確実に保証される分業になる。

---

# ✅ さあ始めよう

ChatGPT が `§1 §2 §3` を読んで「準備完了」と返答したら、ユーザーは:

```
Generate avatar refinement for: PLR00

[PLR00_default.png attached]
```

から開始。1体ずつチャット形式で進めていく。

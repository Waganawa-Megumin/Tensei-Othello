#!/usr/bin/env bash
# Rebuild the per-PLR narrative handoff ZIP.
#
# Output lives under `othello-game/public/handoff/` so GitHub Pages
# serves it at:
#   https://waganawa-megumin.github.io/Tensei-Othello/handoff/<PLR>_<slug>_handoff.zip
# The ZIP is committed to the repo (small enough at ~4.6MB and the
# user explicitly opted for GitHub-Pages download over local file
# transfer; the workspace file pane does not surface workspace-root
# downloads cleanly in Claude Code on the web).
#
# Usage:
#   tools/build_handoff_zip.sh           # default: PLR02 mikoto
#   tools/build_handoff_zip.sh PLR03 rin # future: per-PLR build (when more PLRs are authored)
#
# Output:
#   public/handoff/<PLR>_<slug>_handoff.zip
set -euo pipefail

PLR="${1:-PLR02}"
SLUG="${2:-mikoto}"
HANDOFF_ID="${PLR}_${SLUG}"

# Resolve repo paths regardless of cwd.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GAME_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"           # othello-game/

AVATAR_DIR="${GAME_DIR}/public/avatars/players/${HANDOFF_ID}"
SCENE_SPEC="${GAME_DIR}/public/illustrations/${HANDOFF_ID}/spec.md"
HANDOFF_DOC="${GAME_DIR}/docs/handoff/per_plr_narrative_concept.md"
INSTRUCTIONS="${GAME_DIR}/docs/handoff/claude_chat_instructions.md"

OUT_DIR="${GAME_DIR}/public/handoff"
OUT_ZIP="${OUT_DIR}/${HANDOFF_ID}_handoff.zip"
mkdir -p "${OUT_DIR}"

STAGE_PARENT="$(mktemp -d)"
STAGE="${STAGE_PARENT}/${HANDOFF_ID}_handoff"
mkdir -p "${STAGE}/character_reference"

# Required source files (fail loudly if any are missing).
for f in "${AVATAR_DIR}/character.png" \
         "${AVATAR_DIR}/background.png" \
         "${AVATAR_DIR}/icon.png" \
         "${AVATAR_DIR}/spec.md" \
         "${SCENE_SPEC}" \
         "${HANDOFF_DOC}" \
         "${INSTRUCTIONS}"; do
    if [[ ! -f "$f" ]]; then
        echo "ERROR: missing required file: $f" >&2
        exit 1
    fi
done

cp "${AVATAR_DIR}/character.png"  "${STAGE}/character_reference/${HANDOFF_ID}_character_transparent.png"
cp "${AVATAR_DIR}/background.png" "${STAGE}/character_reference/${HANDOFF_ID}_background.png"
cp "${AVATAR_DIR}/icon.png"       "${STAGE}/character_reference/${HANDOFF_ID}_icon.png"
cp "${AVATAR_DIR}/spec.md"        "${STAGE}/character_reference/${HANDOFF_ID}_canonical_spec.md"

cp "${HANDOFF_DOC}"  "${STAGE}/01_HANDOFF_per_plr_narrative_concept.md"
cp "${SCENE_SPEC}"   "${STAGE}/02_SCENE_spec_4_scenes.md"
cp "${INSTRUCTIONS}" "${STAGE}/00_CLAUDE_CHAT_INSTRUCTIONS.md"

# README is generated in-place so each ZIP carries a top-level guide
# tailored to its target PLR.
cat > "${STAGE}/README.md" <<EOF
# ${HANDOFF_ID} ナラティブ挿絵 ハンドオフ パッケージ

> ZIP 内容物のカタログ + 使い方 (ユーザー向け、最初に読む)

## ファイル一覧

\`\`\`
${HANDOFF_ID}_handoff/
├── README.md                                  ← このファイル
├── 00_CLAUDE_CHAT_INSTRUCTIONS.md             ← 別セッションの Claude chat に最初に渡す
├── 01_HANDOFF_per_plr_narrative_concept.md    ← 全体ハンドオフ (背景・トーン・納品要件)
├── 02_SCENE_spec_4_scenes.md                  ← 4 シーンの ChatGPT プロンプト詳細
└── character_reference/
    ├── ${HANDOFF_ID}_character_transparent.png      (1024×1024 RGBA, 背景透過)
    ├── ${HANDOFF_ID}_background.png                (1024×1024 RGB)
    ├── ${HANDOFF_ID}_icon.png                       (1024×1024 RGBA)
    └── ${HANDOFF_ID}_canonical_spec.md              (キャラ正規定書)
\`\`\`

## ワークフロー

1. claude.ai で新規 Claude chat セッションを開き、ZIP 内全ファイルを添付
2. \`00_CLAUDE_CHAT_INSTRUCTIONS.md\` の手順に沿って進めるよう Claude chat に指示
3. Claude chat が ChatGPT 用プロンプトを 1 シーンずつ提示
4. 別ウィンドウの ChatGPT で参照画像 (\`character_reference/${HANDOFF_ID}_character_transparent.png\`) と一緒に渡して画像生成
5. 生成された画像を Claude chat に貼って品質レビュー → 不適合なら修正プロンプト
6. 全 8 枚 (4 シーン × landscape/portrait) 合格したら ZIP 形式で納品
7. Tensei-Othello の Claude Code セッションに渡して \`public/illustrations/${HANDOFF_ID}/\` に展開・live deploy

最終更新: $(date -I)
EOF

# Build the ZIP from the staging directory parent so the top-level
# folder inside the archive is `${HANDOFF_ID}_handoff/`.
cd "${STAGE_PARENT}"
rm -f "${OUT_ZIP}"
zip -rq "${OUT_ZIP}" "${HANDOFF_ID}_handoff"

# Cleanup staging.
rm -rf "${STAGE_PARENT}"

echo "OK: ${OUT_ZIP}"
echo "    size: $(du -h "${OUT_ZIP}" | cut -f1)"
echo "    files: $(unzip -l "${OUT_ZIP}" | tail -1 | awk '{print $2}')"

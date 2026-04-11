#!/bin/bash
# Compression Draco d'un modèle GLTF/GLB
# Usage: ./scripts/compress-model.sh <nom_du_fichier>
# Exemple: ./scripts/compress-model.sh room_v15

if [ -z "$1" ]; then
  echo "❌ Usage: ./scripts/compress-model.sh <nom_du_fichier_sans_extension>"
  echo "   Exemple: ./scripts/compress-model.sh room_v15"
  exit 1
fi

INPUT="public/models/$1.glb"
OUTPUT="public/models/${1}_draco.glb"

if [ ! -f "$INPUT" ]; then
  echo "❌ Fichier introuvable: $INPUT"
  exit 1
fi

SIZE_BEFORE=$(ls -lh "$INPUT" | awk '{print $5}')
echo "🔧 Compression de $INPUT ($SIZE_BEFORE)..."

npx gltf-pipeline -i "$INPUT" -o "$OUTPUT" --draco.compressionLevel 10

SIZE_AFTER=$(ls -lh "$OUTPUT" | awk '{print $5}')
echo "✅ $OUTPUT créé ($SIZE_BEFORE → $SIZE_AFTER)"

#!/bin/bash
# Usage: ./fix-dashes.sh [directory]
# Default: current directory

DIR="${1:-.}"

find "$DIR" -type f \( -name "*.jsx" -o -name "*.js" -o -name "*.ts" -o -name "*.tsx" -o -name "*.md" \) | while read -r file; do
  sed -i '' 's/—/-/g' "$file"
  sed -i '' 's/  -  / - /g' "$file"
done

echo "Done."

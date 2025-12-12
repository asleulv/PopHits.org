#!/bin/bash
set -e

echo "=== Safe Next.js build starting ==="
date
echo

echo "Memory before build:"
free -h
echo

echo "Running: NODE_OPTIONS=\"--max-old-space-size=3072\" npm run build"
NODE_OPTIONS="--max-old-space-size=3072" npm run build
BUILD_EXIT=$?

echo
echo "Memory after build:"
free -h
echo

if [ $BUILD_EXIT -eq 0 ]; then
  echo "✅ Build succeeded"
else
  echo "❌ Build failed with exit code $BUILD_EXIT"
fi

exit $BUILD_EXIT

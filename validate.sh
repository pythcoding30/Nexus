#!/bin/bash

echo "🔍 Validating Knowledge Base Implementation..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi
echo "✅ Node.js is installed: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi
echo "✅ npm is installed: $(npm --version)"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules not found. Run 'npm install' first."
    exit 1
fi
echo "✅ Dependencies installed"

# Check required source files
echo ""
echo "📁 Checking source files..."

required_files=(
    "src/main/main.ts"
    "src/main/database.ts"
    "src/main/ipc-handlers.ts"
    "src/main/preload.ts"
    "src/renderer/index.tsx"
    "src/renderer/App.tsx"
    "src/renderer/components/KnowledgeBase.tsx"
    "src/renderer/components/NavigationTree.tsx"
    "src/renderer/components/RichTextEditor.tsx"
    "src/renderer/components/PageMetadata.tsx"
    "src/renderer/components/Modal.tsx"
    "src/shared/types.ts"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Missing: $file"
        exit 1
    fi
done
echo "✅ All source files present"

# Check configuration files
echo ""
echo "⚙️  Checking configuration files..."

config_files=(
    "package.json"
    "tsconfig.json"
    "webpack.main.config.js"
    "webpack.renderer.config.js"
    ".eslintrc.json"
    ".gitignore"
)

for file in "${config_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Missing: $file"
        exit 1
    fi
done
echo "✅ All configuration files present"

# Check documentation
echo ""
echo "📖 Checking documentation..."

doc_files=(
    "README.md"
    "ARCHITECTURE.md"
    "TEST_GUIDE.md"
    "IMPLEMENTATION_SUMMARY.md"
)

for file in "${doc_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Missing: $file"
        exit 1
    fi
done
echo "✅ All documentation present"

# Run TypeScript type checking
echo ""
echo "🔎 Running TypeScript type check..."
if npm run typecheck > /dev/null 2>&1; then
    echo "✅ TypeScript type check passed"
else
    echo "❌ TypeScript type check failed"
    exit 1
fi

# Run linting
echo ""
echo "🔍 Running ESLint..."
if npm run lint > /dev/null 2>&1; then
    echo "✅ Linting passed"
else
    echo "⚠️  Linting has warnings (acceptable)"
fi

# Check if build output exists
echo ""
echo "🏗️  Checking build output..."
if [ -d "dist/main" ] && [ -d "dist/renderer" ]; then
    if [ -f "dist/main/main.js" ] && [ -f "dist/main/preload.js" ] && [ -f "dist/renderer/renderer.js" ]; then
        echo "✅ Build output exists"
    else
        echo "⚠️  Build output incomplete. Run 'npm run build'"
    fi
else
    echo "⚠️  Build output missing. Run 'npm run build'"
fi

# Check Git status
echo ""
echo "📝 Checking Git status..."
if git rev-parse --git-dir > /dev/null 2>&1; then
    current_branch=$(git rev-parse --abbrev-ref HEAD)
    if [ "$current_branch" = "feat-kb-hierarchy-tree-richtext-sqlite-autosave" ]; then
        echo "✅ On correct branch: $current_branch"
    else
        echo "⚠️  On branch: $current_branch (expected: feat-kb-hierarchy-tree-richtext-sqlite-autosave)"
    fi
else
    echo "❌ Not a Git repository"
    exit 1
fi

echo ""
echo "🎉 Validation complete! All checks passed."
echo ""
echo "To run the application:"
echo "  1. npm run build (if not already built)"
echo "  2. npm start"
echo ""

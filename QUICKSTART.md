# Quick Start Guide

Get up and running with the Knowledge Base application in minutes!

## Prerequisites

- Node.js 18+ (recommended: 20+)
- npm 9+

## Installation

```bash
# Install dependencies
npm install
```

## Build

```bash
# Build both main and renderer processes
npm run build
```

## Run

```bash
# Start the application
npm start
```

The Electron application will launch with a dark-themed interface.

## First Steps

### 1. Create Your First Page

1. You'll see four sections in the left navigation panel:
   - Getting Started
   - Documentation
   - Guides
   - References

2. Click the **"Add page"** button under "Getting Started"

3. Enter a title (e.g., "Welcome") and click **"Create"**

4. The page opens in the editor automatically

### 2. Write Content

1. Click in the editor area below the title

2. Start typing your content

3. Try these formatting options:
   - Type `# Heading 1` and press Enter for a heading
   - Type `## Heading 2` and press Enter for a subheading
   - Type `- Item` and press Enter for a bullet list
   - Type `1. Item` and press Enter for a numbered list
   - Use `**bold**` or `*italic*` for text formatting

4. Notice the autosave indicator showing "Saving..." then "Saved at HH:MM"

### 3. Create a Sub-Page

1. Hover over your "Welcome" page in the navigation tree

2. Click the **+** button that appears

3. Enter a title for the sub-page (e.g., "Getting Started Guide")

4. Click **"Create"**

5. The sub-page appears indented under "Welcome"

### 4. Navigate Between Pages

1. Click on any page in the navigation tree

2. The editor switches to that page

3. Your changes to the previous page are automatically saved

### 5. Rename a Page

1. Hover over a page in the navigation tree

2. Click the **✏️** (pencil) icon

3. Enter the new title

4. Click **"Rename"**

### 6. Delete a Page

1. Hover over a page in the navigation tree

2. Click the **🗑️** (trash) icon

3. Confirm the deletion

4. The page and all its sub-pages are deleted

## Tips

### Keyboard Shortcuts in Editor

- **Ctrl/Cmd + B**: Bold
- **Ctrl/Cmd + I**: Italic
- **Ctrl/Cmd + Z**: Undo
- **Ctrl/Cmd + Shift + Z**: Redo

### Organizing Your Knowledge Base

1. **Use sections wisely**: The four predefined sections help organize your content by category

2. **Create hierarchies**: Use sub-pages to break down complex topics into smaller, manageable pieces

3. **Consistent naming**: Use clear, descriptive titles for easy navigation

4. **Don't over-nest**: Try to keep hierarchies 2-3 levels deep for better usability

### Autosave Behavior

- Changes are saved **automatically after 1 second** of no typing
- No need to manually save - just type and wait
- The indicator shows when saving is in progress
- If you switch pages, current changes are saved first

## Development Mode

For active development with hot reload:

```bash
# Terminal 1: Build main process (watch mode)
npm run dev:main

# Terminal 2: Build renderer process (dev server)
npm run dev:renderer

# Terminal 3: Start Electron
npm start
```

Changes to renderer code will hot-reload automatically.
Changes to main process code require restarting the app.

## Data Location

Your knowledge base data is stored in:

- **Windows**: `%APPDATA%/knowledge-base/knowledge-base.db`
- **macOS**: `~/Library/Application Support/knowledge-base/knowledge-base.db`
- **Linux**: `~/.config/knowledge-base/knowledge-base.db`

## Troubleshooting

### Application won't start

1. Ensure you've run `npm install`
2. Ensure you've run `npm run build`
3. Check console for error messages

### Build errors

```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

### Type errors

```bash
# Check for type errors
npm run typecheck
```

### Linting issues

```bash
# Check for linting issues
npm run lint
```

### Database issues

If you experience data corruption:

1. Close the application
2. Back up the database file (see "Data Location" above)
3. Delete the database file
4. Restart the application (a fresh database will be created)

## Next Steps

- Read [ARCHITECTURE.md](ARCHITECTURE.md) to understand how the application works
- Follow [TEST_GUIDE.md](TEST_GUIDE.md) to test all features
- See [README.md](README.md) for detailed documentation

## Getting Help

- Check the documentation files in this repository
- Review the code comments for implementation details
- Examine the test guide for feature walkthroughs

## Summary of Commands

```bash
npm install          # Install dependencies
npm run build        # Build the application
npm start            # Run the application
npm run typecheck    # Check TypeScript types
npm run lint         # Run ESLint
./validate.sh        # Validate entire setup
```

---

**Enjoy using your Knowledge Base!** 📚✨

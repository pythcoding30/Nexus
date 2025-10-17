# Knowledge Base Architecture

This document describes the architecture and implementation details of the Knowledge Base application.

## Overview

The Knowledge Base is an Electron application that combines a React-based frontend with a SQLite backend for local data persistence. It provides a hierarchical knowledge management system with rich text editing capabilities.

## Technology Stack

### Core Technologies
- **Electron**: Desktop application framework
- **React**: UI library for the renderer process
- **TypeScript**: Type-safe JavaScript
- **SQLite (better-sqlite3)**: Local database for data persistence
- **TipTap**: Rich text editor built on ProseMirror
- **Webpack**: Module bundler

### Key Dependencies
- `@tiptap/react`: React wrapper for TipTap
- `@tiptap/starter-kit`: Pre-configured TipTap extensions
- `better-sqlite3`: Synchronous SQLite3 bindings for Node.js

## Architecture

### Process Model

The application follows Electron's multi-process architecture:

```
┌─────────────────────────────────────┐
│       Main Process (Node.js)        │
│  ┌──────────────────────────────┐   │
│  │      Electron Main           │   │
│  │  - Window Management         │   │
│  │  - IPC Handlers              │   │
│  └──────────────────────────────┘   │
│  ┌──────────────────────────────┐   │
│  │   Database Layer (SQLite)    │   │
│  │  - Schema Management         │   │
│  │  - CRUD Operations           │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
                 │
                 │ IPC Communication
                 │
┌─────────────────────────────────────┐
│    Renderer Process (Chromium)      │
│  ┌──────────────────────────────┐   │
│  │      React Application       │   │
│  │  - UI Components             │   │
│  │  - State Management          │   │
│  │  - Rich Text Editor          │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

## Main Process

### 1. Entry Point (`src/main/main.ts`)

Responsibilities:
- Initialize Electron application
- Create and manage browser windows
- Initialize database
- Set up IPC handlers
- Handle application lifecycle

Key features:
- Development mode detection (loads from webpack-dev-server)
- Production mode (loads from built files)
- Proper cleanup on app quit

### 2. Database Layer (`src/main/database.ts`)

The `KnowledgeBaseDB` class encapsulates all database operations:

#### Schema

**Sections Table:**
```sql
CREATE TABLE sections (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  "order" INTEGER NOT NULL
)
```

**Pages Table:**
```sql
CREATE TABLE pages (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  parent_id TEXT,
  "order" INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'User',
  FOREIGN KEY (parent_id) REFERENCES pages(id) ON DELETE CASCADE
)
```

#### Key Methods

- `getSections()`: Retrieve all predefined sections
- `getAllPages()`: Retrieve all pages
- `getPage(id)`: Get a specific page by ID
- `getChildPages(parentId)`: Get all child pages of a parent
- `createPage(params)`: Create a new page
- `updatePage(params)`: Update page title and/or content
- `deletePage(id)`: Delete a page (cascades to children)
- `reorderPage(params)`: Move a page to a new position/parent

#### Data Integrity

- Foreign key constraints ensure parent-child relationships
- Cascade deletes remove all descendants when a page is deleted
- Automatic order management maintains correct display order
- ISO 8601 timestamps for all temporal data

### 3. IPC Handlers (`src/main/ipc-handlers.ts`)

Maps IPC channels to database operations:

| Channel | Method | Description |
|---------|--------|-------------|
| `kb:getSections` | GET | Retrieve all sections |
| `kb:getAllPages` | GET | Retrieve all pages |
| `kb:getPage` | GET | Retrieve single page |
| `kb:getChildPages` | GET | Retrieve child pages |
| `kb:createPage` | POST | Create new page |
| `kb:updatePage` | PUT | Update page |
| `kb:deletePage` | DELETE | Delete page |
| `kb:reorderPage` | PUT | Reorder/move page |

### 4. Preload Script (`src/main/preload.ts`)

Securely exposes IPC methods to the renderer process using `contextBridge`:

```typescript
window.api.kb.createPage({ title, parentId, content })
window.api.kb.updatePage({ id, title, content })
// ... etc
```

Benefits:
- Type-safe API access in renderer
- Sandboxed renderer process
- No direct Node.js access in renderer
- Clear contract between main and renderer

## Renderer Process

### Component Hierarchy

```
App
└── KnowledgeBase (Main Container)
    ├── NavigationPanel
    │   └── NavigationTree
    │       └── TreeNode (recursive)
    │           ├── TreeNodeHeader
    │           └── TreeNodeChildren
    └── ContentPanel
        ├── ContentHeader
        │   ├── TitleInput
        │   └── PageMetadata
        │       └── AutosaveStatus
        └── EditorContainer
            └── RichTextEditor (TipTap)
```

### Key Components

#### 1. KnowledgeBase (`src/renderer/components/KnowledgeBase.tsx`)

Main application container that manages:

**State:**
- `sections`: Array of predefined sections
- `pages`: Array of all pages
- `selectedPageId`: Currently selected page
- `currentPage`: Full page object being edited
- `treeData`: Hierarchical tree structure for display
- `autosaveStatus`: Current save status
- `modalState`: Modal dialog state

**Key Features:**
- Tree building from flat page structure
- Autosave with debouncing (1 second delay)
- Modal management for CRUD operations
- State synchronization between tree and editor

**Autosave Flow:**
1. User types in title or content
2. Change is immediately reflected in local state
3. Change is stored in `pendingChangesRef`
4. Timer is set/reset for 1 second
5. After 1 second, changes are sent to main process
6. Status indicator shows progress
7. On success, state updates with server response
8. Status indicator shows "saved" for 2 seconds

#### 2. NavigationTree (`src/renderer/components/NavigationTree.tsx`)

Renders the hierarchical tree structure:

**Features:**
- Recursive rendering of tree nodes
- Expand/collapse functionality
- Section headers (non-interactive)
- Page nodes (interactive)
- Action buttons (add, rename, delete) on hover
- Visual indication of selected page

**Node Types:**
- **Section nodes**: Bold, uppercase, non-clickable
- **Page nodes**: Regular text, clickable, with actions

#### 3. RichTextEditor (`src/renderer/components/RichTextEditor.tsx`)

TipTap editor integration:

**Extensions:**
- StarterKit: Basic formatting (headings, lists, bold, italic, etc.)
- Placeholder: Shows hint text when empty

**Features:**
- Dark mode styling via CSS
- HTML content storage
- Real-time updates to parent component
- Controlled component (content synced from props)

**Supported Formats:**
- Headings (H1, H2, H3)
- Bold and italic text
- Bullet and numbered lists
- Code blocks and inline code
- Blockquotes
- Horizontal rules
- Links

#### 4. PageMetadata (`src/renderer/components/PageMetadata.tsx`)

Displays page information:
- Author (placeholder)
- Creation timestamp
- Last modified timestamp
- Autosave status with animated indicator

#### 5. Modal (`src/renderer/components/Modal.tsx`)

Reusable modal dialog for:
- Creating pages (input for title)
- Renaming pages (pre-filled input)
- Confirming deletion (displays page name)

**Features:**
- Auto-focus and text selection
- Keyboard shortcuts (ESC to close, Enter to submit)
- Input validation (disable submit if empty)
- Danger mode for destructive actions

## Data Flow

### Page Creation Flow

```
User clicks "Add page"
    │
    ↓
Modal opens with input
    │
    ↓
User enters title and confirms
    │
    ↓
IPC call: kb:createPage
    │
    ↓
Main process creates page in SQLite
    │
    ↓
Returns new page object
    │
    ↓
Renderer updates state
    │
    ↓
Tree rebuilds
    │
    ↓
New page selected and editor loads
```

### Autosave Flow

```
User types in editor
    │
    ↓
onChange handler fires
    │
    ↓
Local state updates immediately
    │
    ↓
Pending changes stored in ref
    │
    ↓
Autosave timer set (1000ms)
    │
    ↓
Status shows "Saving..."
    │
    ↓
Timer expires
    │
    ↓
IPC call: kb:updatePage
    │
    ↓
Main process updates SQLite
    │
    ↓
Returns updated page object
    │
    ↓
Renderer updates state
    │
    ↓
Status shows "Saved at HH:MM"
    │
    ↓
After 2 seconds, status clears
```

### Tree Building Algorithm

```typescript
1. Create a Map of page IDs to TreeNode objects
2. For each section:
   a. Create section node
   b. Find all pages where parent_id = section.id
   c. For each page:
      - Recursively build children
      - Add to section's children array
   d. Add section to tree
3. Sort tree by order
```

This approach efficiently builds a tree structure from a flat array with O(n) complexity.

## Styling

### CSS Architecture

All styles in `src/renderer/styles.css` follow a component-based approach:

**Naming Convention:**
- BEM-inspired: `.component-element-modifier`
- Examples: `.tree-node-header`, `.modal-button-primary`

**Dark Mode Theme:**
- Background: `#1a1a1a` (darkest)
- Panels: `#252525` (dark)
- Elements: `#2a2a2a` (medium)
- Borders: `#3a3a3a` (light)
- Text: `#e0e0e0` (primary), `#888` (secondary)
- Accent: `#6a9aca` (blue)

**TipTap Editor Styling:**
Custom dark mode styles for:
- Prose elements (headings, paragraphs, lists)
- Code blocks (syntax highlighting)
- Links (blue accent color)
- Blockquotes (gray, italic)

## Error Handling

### Database Errors
- SQLite errors are caught in the main process
- Failed operations return `null` or `false`
- Renderer handles null responses gracefully

### Autosave Errors
- Network/IPC errors caught in try-catch
- Status indicator shows error state
- User can retry by making another edit

### Validation
- Modal input validation (empty strings rejected)
- Type checking via TypeScript
- Foreign key constraints in database

## Performance Considerations

### Optimizations
1. **Debounced Autosave**: Prevents excessive database writes
2. **Synchronous SQLite**: better-sqlite3 is faster than async alternatives
3. **Memoized Components**: React.memo could be added for large trees
4. **Indexed Queries**: Database indexes on parent_id and order columns

### Potential Improvements
1. Virtual scrolling for large trees
2. Lazy loading of page content
3. Incremental tree updates instead of full rebuilds
4. Web Workers for heavy computations

## Security

### Implemented Security Measures
1. **Context Isolation**: Renderer runs in isolated context
2. **No Node Integration**: Renderer has no direct Node.js access
3. **Preload Script**: Controlled API surface via contextBridge
4. **SQL Injection Prevention**: Parameterized queries only

### Future Enhancements
1. Content Security Policy (CSP)
2. Encrypted database storage
3. User authentication
4. Input sanitization for HTML content

## Testing Strategy

### Unit Tests (Not Yet Implemented)
- Database operations
- Tree building algorithm
- Autosave debouncing logic

### Integration Tests (Not Yet Implemented)
- IPC communication
- Full CRUD flows
- State synchronization

### Manual Testing
See `TEST_GUIDE.md` for comprehensive testing checklist

## Future Enhancements

### Short-term
1. Drag-and-drop reordering in tree
2. Search functionality
3. Export to Markdown/PDF
4. Keyboard shortcuts

### Medium-term
1. Tags and categories
2. Rich media support (images, videos)
3. Version history
4. Templates

### Long-term
1. Multi-user collaboration
2. Cloud sync
3. Mobile companion app
4. Plugin system

## Build and Deployment

### Development Build
```bash
npm run dev:main    # Watches main process
npm run dev:renderer # Dev server with HMR
npm start           # Launches app
```

### Production Build
```bash
npm run build       # Builds both processes
npm start           # Launches from dist/
```

### Distribution (Future)
- Package with electron-builder
- Create installers for Windows, macOS, Linux
- Auto-update mechanism
- Code signing

## Maintenance

### Adding a New Page Field

To add a new field to pages (e.g., "tags"):

1. Update database schema in `src/main/database.ts`
2. Add field to `Page` interface in `src/shared/types.ts`
3. Update IPC handlers if needed
4. Modify UI components to display/edit field
5. Run migration on existing databases

### Adding a New IPC Method

1. Define method in `src/main/ipc-handlers.ts`
2. Add to preload script in `src/main/preload.ts`
3. Use in renderer components

### Modifying the Tree Structure

The tree building logic is in `KnowledgeBase.buildTree()`. Modifications there affect how the hierarchy is displayed and navigated.

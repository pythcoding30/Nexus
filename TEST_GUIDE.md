# Knowledge Base Testing Guide

This guide provides steps to test all features of the Knowledge Base application.

## Prerequisites

1. Install dependencies: `npm install`
2. Build the application: `npm run build`
3. Start the application: `npm start`

## Test Checklist

### 1. Initial Application Load
- [ ] Application window opens successfully
- [ ] Default sections are visible in the navigation panel:
  - Getting Started
  - Documentation
  - Guides
  - References
- [ ] Empty state message is displayed in the content panel
- [ ] UI is in dark mode

### 2. Page Creation

#### Test creating a page under a section:
1. Click "Add page" button under "Getting Started" section
2. Verify modal opens with title "Create New Page"
3. Enter page title: "Welcome"
4. Click "Create" button
5. Expected results:
   - [ ] Modal closes
   - [ ] New page appears under "Getting Started" section
   - [ ] Page is automatically selected and opens in editor
   - [ ] Page title appears in the header
   - [ ] Empty editor with placeholder text is shown

#### Test creating a sub-page:
1. Hover over the "Welcome" page
2. Click the "+" button in the action menu
3. Enter page title: "Getting Started Guide"
4. Click "Create"
5. Expected results:
   - [ ] New sub-page is created under "Welcome"
   - [ ] Sub-page is indented in the tree
   - [ ] Sub-page opens in editor

### 3. Rich Text Editing

#### Test basic text formatting:
1. Select a page
2. Type some text in the editor
3. Expected results:
   - [ ] Text appears immediately
   - [ ] Autosave indicator shows "Saving..." after 1 second
   - [ ] After save completes, indicator shows "Saved at [time]"
   - [ ] Indicator disappears after 2 seconds

#### Test markdown-style formatting:
1. Type `# Heading 1` and press Enter
   - [ ] Text converts to a large heading
2. Type `## Heading 2` and press Enter
   - [ ] Text converts to a medium heading
3. Type `- List item` and press Enter
   - [ ] Creates a bullet list
4. Type `1. Numbered item` and press Enter
   - [ ] Creates a numbered list
5. Type text with `**bold**` or `*italic*`
   - [ ] Text appears bold/italic

### 4. Page Metadata

1. Select any page with content
2. Check the metadata area below the title
3. Expected results:
   - [ ] Author is displayed (should show "User")
   - [ ] Created timestamp is shown
   - [ ] Modified timestamp is shown and updates after edits
   - [ ] Autosave status is displayed when saving

### 5. Page Renaming

1. Hover over any page in the navigation tree
2. Click the pencil (✏️) icon
3. Enter new title: "Updated Page Name"
4. Click "Rename"
5. Expected results:
   - [ ] Page title updates in the tree
   - [ ] If page is currently open, title updates in the editor header
   - [ ] Changes are persisted (verify by restarting app)

### 6. Page Navigation

1. Create multiple pages under different sections
2. Click on different pages in the tree
3. Expected results:
   - [ ] Selected page is highlighted in the tree
   - [ ] Content panel updates to show selected page
   - [ ] Previous page's unsaved changes are saved before switching
   - [ ] Page title and content load correctly

### 7. Tree Expansion/Collapse

1. Create a page with sub-pages
2. Click the arrow (▶) next to the parent page
3. Expected results:
   - [ ] Arrow rotates to point down (▼)
   - [ ] Sub-pages are revealed
4. Click the arrow again
   - [ ] Arrow rotates back to point right (▶)
   - [ ] Sub-pages are hidden

### 8. Page Deletion

1. Hover over a page without sub-pages
2. Click the trash (🗑️) icon
3. Verify modal shows "Delete [page name]?"
4. Click "Delete"
5. Expected results:
   - [ ] Page is removed from the tree
   - [ ] If page was selected, editor shows empty state
   - [ ] Page is permanently deleted (verify by restarting app)

#### Test deleting page with sub-pages:
1. Delete a page that has sub-pages
2. Expected results:
   - [ ] Parent page is deleted
   - [ ] All sub-pages are also deleted (cascade delete)

### 9. Autosave Functionality

1. Open a page
2. Type content slowly
3. Wait and observe autosave indicator
4. Expected results:
   - [ ] Indicator shows "Saving..." while typing
   - [ ] After 1 second of no changes, save completes
   - [ ] Indicator shows "Saved at [time]"
   - [ ] After 2 seconds, indicator disappears

#### Test autosave on title change:
1. Click in the title input field
2. Modify the title
3. Expected results:
   - [ ] Autosave triggers after 1 second
   - [ ] Title is saved
   - [ ] Tree updates with new title

### 10. Data Persistence

1. Create several pages with content
2. Edit different pages
3. Close the application
4. Restart the application
5. Expected results:
   - [ ] All sections are present
   - [ ] All pages are present in correct order
   - [ ] Page hierarchy is maintained
   - [ ] Page content is preserved
   - [ ] Page metadata (timestamps) is correct

### 11. Multiple Pages Under Sections

1. Create 5+ pages under "Documentation" section
2. Expected results:
   - [ ] All pages are visible in the tree
   - [ ] Pages maintain correct order
   - [ ] Each page can be selected and edited independently

### 12. Deep Nesting

1. Create a page under a section
2. Create a sub-page under that page
3. Create another sub-page under the previous sub-page
4. Continue to create 4-5 levels deep
5. Expected results:
   - [ ] All levels display correctly with proper indentation
   - [ ] Expand/collapse works at all levels
   - [ ] Navigation works for deeply nested pages

### 13. Modal Interactions

#### Test cancel action:
1. Click "Add page" button
2. Click "Cancel" or press ESC key
3. Expected results:
   - [ ] Modal closes
   - [ ] No page is created

#### Test empty input validation:
1. Click "Add page" button
2. Clear the input field
3. Expected results:
   - [ ] "Create" button is disabled
   - [ ] Cannot submit the form

### 14. Editor Features

Test the following content types in the editor:

1. **Headings**: Create H1, H2, H3 headings
   - [ ] Display with appropriate sizes and styling
   
2. **Lists**: Create bullet and numbered lists
   - [ ] Lists indent properly
   - [ ] Nested lists work
   
3. **Code**: Type inline code with backticks
   - [ ] Code has distinct styling (background, color)
   
4. **Bold/Italic**: Use **bold** and *italic*
   - [ ] Formatting applies correctly
   
5. **Mixed content**: Create a page with all elements
   - [ ] All elements render correctly together
   - [ ] Spacing between elements is appropriate

### 15. UI/UX Polish

1. Check dark mode consistency:
   - [ ] All panels have appropriate dark backgrounds
   - [ ] Text is readable with good contrast
   - [ ] Hover states are visible
   
2. Check hover effects:
   - [ ] Tree nodes highlight on hover
   - [ ] Action buttons appear on hover
   - [ ] Buttons change appearance on hover
   
3. Check scrolling:
   - [ ] Navigation panel scrolls when many pages exist
   - [ ] Editor content scrolls when content is long
   - [ ] Scrollbars have dark mode styling

## Known Limitations

1. **Reordering**: The current implementation doesn't include drag-and-drop reordering
2. **Search**: No search functionality implemented yet
3. **Export**: No export functionality implemented yet
4. **Multi-user**: Author field is a placeholder, no real user management

## Reporting Issues

If you find any bugs or unexpected behavior during testing, please note:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable

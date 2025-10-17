# Nexus - Electron + React UI Framework

A modern desktop application framework built with Electron, React, TypeScript, Tailwind CSS, and shadcn/ui components, designed with a dark theme.

## Features

- ⚡ **Vite** for fast development and building
- ⚛️ **React 18** with TypeScript
- 🎨 **Tailwind CSS** for utility-first styling
- 🧩 **shadcn/ui** component library (Radix UI primitives)
- 🌙 **Dark theme** optimized design system
- 🖥️ **Electron** for cross-platform desktop apps
- 📦 **Reusable layout primitives** for rapid UI development

## Project Structure

```
project/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui base components
│   │   ├── primitives/      # Reusable UI patterns (Panel, FormControl, Modal)
│   │   └── layouts/         # Layout components (AppLayout, SplitLayout)
│   ├── lib/
│   │   └── utils.ts         # Utility functions (cn helper)
│   ├── styles/
│   │   └── globals.css      # Global styles and theme tokens
│   ├── App.tsx              # Main application component
│   └── main.tsx             # React entry point
├── electron/
│   ├── main.ts              # Electron main process
│   └── preload.ts           # Electron preload script
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
├── components.json          # shadcn/ui configuration
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
└── UI_DOCUMENTATION.md      # Comprehensive UI documentation
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

#### Web Development Mode
```bash
npm run dev
```
Opens the app in a browser at `http://localhost:5173` for rapid UI development.

#### Electron Development Mode
```bash
npm run electron:dev
```
Builds and runs the Electron application.

### Building

#### Web Build
```bash
npm run build
```

#### Electron Build
```bash
npm run electron:build
```
Creates platform-specific installers in the `release/` directory.

### Type Checking

```bash
npm run type-check
```

## UI Component Library

### Core Components
- **Button** - Multiple variants (default, outline, ghost, destructive, etc.)
- **Input & Textarea** - Form inputs with consistent styling
- **Label** - Accessible form labels
- **Card** - Content containers with header/footer
- **Dialog** - Modal dialogs
- **Dropdown Menu** - Context menus and dropdowns
- **Tabs** - Tabbed interfaces

### Primitive Components
- **Panel** - Flexible container with variants (default, elevated, bordered, ghost)
- **FormControl** - Form fields with labels, hints, and validation
- **FormField** - Complete input fields with label and error handling
- **FormTextarea** - Complete textarea fields with label and error handling
- **Modal** - Preconfigured modal dialogs
- **ConfirmModal** - Confirmation dialogs with actions

### Layout Components
- **AppLayout** - Main app layout with sidebar, header, and footer
- **SplitLayout** - Two-panel layout (horizontal or vertical)

## Styling System

### Theme Tokens
All colors use CSS custom properties defined in `src/styles/globals.css`:
- `--background`, `--foreground`
- `--primary`, `--secondary`, `--accent`
- `--muted`, `--destructive`
- `--border`, `--input`, `--ring`

### Utility Classes
- `scrollbar-thin` - Styled scrollbars for dark theme
- `drag-none` / `drag-cancel` - Electron window dragging
- Animation classes: `animate-fade-in`, `animate-slide-in-from-*`

### Color Usage
Always use semantic color classes:
```tsx
// Good ✅
<div className="bg-background text-foreground border-border">

// Bad ❌
<div className="bg-slate-900 text-white border-slate-700">
```

## Adding Components

### From shadcn/ui
```bash
npx shadcn-ui@latest add [component-name]
```

Example:
```bash
npx shadcn-ui@latest add select
npx shadcn-ui@latest add checkbox
```

### Custom Components
1. Create in appropriate directory (`ui/`, `primitives/`, or `layouts/`)
2. Use TypeScript with proper types
3. Support `className` prop for customization
4. Export from index file

## Documentation

See [UI_DOCUMENTATION.md](./UI_DOCUMENTATION.md) for comprehensive documentation including:
- Complete component API reference
- Styling conventions and best practices
- Animation and transition patterns
- Electron-specific styling
- Common UI patterns and examples
- Troubleshooting guide

## Configuration Files

- **tailwind.config.js** - Tailwind theme extensions (colors, animations, keyframes)
- **postcss.config.js** - PostCSS with Tailwind and Autoprefixer
- **components.json** - shadcn/ui configuration
- **vite.config.ts** - Vite bundler configuration with React plugin
- **tsconfig.json** - TypeScript with path aliases (`@/*`)

## Path Aliases

Import using the `@/` prefix:
```tsx
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Panel } from "@/components/primitives"
```

## Tech Stack

- **Electron** - Desktop application framework
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Component library
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **class-variance-authority** - Component variant management
- **tailwind-merge** - Tailwind class merging utility

## Best Practices

1. **Component Composition** - Build complex UIs from simple, reusable components
2. **Type Safety** - Always use TypeScript interfaces for props
3. **Semantic Colors** - Use theme tokens, not hardcoded colors
4. **Accessibility** - Include proper labels and ARIA attributes
5. **Dark Theme First** - Design for dark mode by default
6. **Consistent Spacing** - Use Tailwind's spacing scale
7. **Subtle Animations** - Use transitions for better UX (0.2-0.3s)

## License

ISC

## Contributing

Contributions are welcome! Please read the UI_DOCUMENTATION.md for styling guidelines and component patterns.

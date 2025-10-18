# UI Framework Documentation

## Overview

This project uses a modern UI stack built on:
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality, accessible component library built on Radix UI
- **Vite**: Fast build tool and development server
- **Electron**: Desktop application framework
- **React 18**: UI library with hooks

## Dark Theme Configuration

The application is configured with a dark-first theme approach using CSS custom properties.

### Theme Tokens

All colors are defined in `src/styles/globals.css` using HSL values:

```css
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  --secondary: 217.2 32.6% 17.5%;
  --muted: 217.2 32.6% 17.5%;
  --accent: 217.2 32.6% 17.5%;
  --destructive: 0 62.8% 30.6%;
  --border: 217.2 32.6% 17.5%;
  /* ... more tokens */
}
```

### Customizing Colors

To customize the theme:
1. Modify the CSS variables in `src/styles/globals.css`
2. Update the `tailwind.config.js` if adding new color scales
3. Use semantic color names (e.g., `bg-primary`, `text-foreground`) instead of hardcoded colors

## Component Library

### Core UI Components (`src/components/ui`)

These are shadcn/ui components configured for this project:

#### Button
```tsx
import { Button } from "@/components/ui/button"

<Button variant="default">Click me</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outlined</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
```

#### Input & Textarea
```tsx
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

<Input type="text" placeholder="Enter text" />
<Textarea placeholder="Enter long text" rows={4} />
```

#### Label
```tsx
import { Label } from "@/components/ui/label"

<Label htmlFor="email">Email</Label>
<Input id="email" type="email" />
```

#### Card
```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

#### Dialog
```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description</DialogDescription>
    </DialogHeader>
    <p>Dialog content</p>
  </DialogContent>
</Dialog>
```

#### Dropdown Menu
```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Item 1</DropdownMenuItem>
    <DropdownMenuItem>Item 2</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

#### Tabs
```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

### Primitive Components (`src/components/primitives`)

Higher-level components built on top of the core UI components:

#### Panel
A flexible container component with different visual styles:

```tsx
import { Panel } from "@/components/primitives/Panel"

<Panel variant="default" padding="md">
  Content here
</Panel>

<Panel variant="elevated" padding="lg">
  Elevated with shadow
</Panel>

<Panel variant="bordered" padding="sm">
  Bordered panel
</Panel>

<Panel variant="ghost" padding="none">
  Transparent panel
</Panel>
```

**Props:**
- `variant`: "default" | "elevated" | "bordered" | "ghost"
- `padding`: "none" | "sm" | "md" | "lg"

#### FormControl, FormField, FormTextarea
Form components with integrated labels, hints, and error messages:

```tsx
import { FormField, FormTextarea } from "@/components/primitives/FormControl"

<FormField
  label="Username"
  placeholder="Enter username"
  required
  hint="Choose a unique username"
  error={errors.username}
/>

<FormTextarea
  label="Bio"
  placeholder="Tell us about yourself"
  rows={4}
  hint="Maximum 500 characters"
/>
```

**Props:**
- `label`: Field label text
- `error`: Error message to display
- `hint`: Helper text
- `required`: Shows asterisk indicator
- All standard input/textarea props

#### Modal & ConfirmModal
Pre-configured modal dialogs:

```tsx
import { Modal, ConfirmModal } from "@/components/primitives/Modal"

// Standard Modal
<Modal
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Edit Profile"
  description="Update your profile information"
  size="lg"
  footer={
    <>
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button onClick={handleSave}>Save</Button>
    </>
  }
>
  <FormField label="Name" />
</Modal>

// Confirmation Modal
<ConfirmModal
  open={confirmOpen}
  onOpenChange={setConfirmOpen}
  title="Delete Account"
  description="This action cannot be undone."
  variant="destructive"
  confirmText="Delete"
  cancelText="Cancel"
  onConfirm={handleDelete}
  onCancel={() => console.log('Cancelled')}
/>
```

**Modal Props:**
- `size`: "sm" | "md" | "lg" | "xl"
- `title`, `description`: Header content
- `footer`: Custom footer content
- `open`, `onOpenChange`: Control visibility

**ConfirmModal Props:**
- `variant`: "default" | "destructive"
- `confirmText`, `cancelText`: Button labels
- `onConfirm`, `onCancel`: Action callbacks
- `loading`: Show loading state

### Layout Components (`src/components/layouts`)

#### AppLayout
Main application layout with sidebar, header, and footer:

```tsx
import { AppLayout } from "@/components/layouts/AppLayout"

<AppLayout
  header={<Header />}
  sidebar={<Sidebar />}
  footer={<Footer />}
>
  <MainContent />
</AppLayout>
```

**Features:**
- Fixed header and footer
- Collapsible sidebar
- Scrollable main content area
- Electron window drag regions (header is draggable, content is not)

#### SplitLayout
Two-panel layout with adjustable split:

```tsx
import { SplitLayout } from "@/components/layouts/SplitLayout"

<SplitLayout
  direction="horizontal"
  left={<LeftPanel />}
  right={<RightPanel />}
  leftWidth="40%"
  rightWidth="60%"
  gap={0}
/>
```

**Props:**
- `direction`: "horizontal" | "vertical"
- `left`, `right`: Panel content
- `leftWidth`, `rightWidth`: Panel sizes (CSS units)
- `gap`: Space between panels (pixels)

## Styling Conventions

### 1. Use Semantic Colors

Always use theme color tokens instead of hardcoded colors:

✅ **Good:**
```tsx
<div className="bg-background text-foreground border-border">
```

❌ **Bad:**
```tsx
<div className="bg-slate-900 text-white border-slate-700">
```

### 2. Utility Classes

Common utility classes are defined in `globals.css`:

```tsx
// Scrollbars
<div className="scrollbar-thin overflow-auto">

// Electron window dragging
<div className="drag-none">           // Draggable area
  <button className="drag-cancel">   // Non-draggable element
    Click me
  </button>
</div>

// Text utilities
<p className="text-balance">Balanced text wrapping</p>
```

### 3. Component Composition

Build complex UIs by composing primitives:

```tsx
<Panel variant="elevated" padding="lg">
  <Card>
    <CardHeader>
      <CardTitle>User Profile</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <FormField label="Name" />
      <FormField label="Email" type="email" />
    </CardContent>
  </Card>
</Panel>
```

### 4. Animation Classes

Pre-defined animations in `tailwind.config.js`:

```tsx
// Fade animations
<div className="animate-fade-in">
<div className="animate-fade-out">

// Slide animations
<div className="animate-slide-in-from-top">
<div className="animate-slide-in-from-bottom">
<div className="animate-slide-in-from-left">
<div className="animate-slide-in-from-right">

// Accordion (used by Radix components)
<div className="animate-accordion-down">
<div className="animate-accordion-up">
```

### 5. Responsive Design

Use Tailwind's responsive prefixes:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

## Utility Functions

### cn() - Class Name Merger

Located in `src/lib/utils.ts`, combines and deduplicates class names:

```tsx
import { cn } from "@/lib/utils"

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  className  // Allow prop overrides
)} />
```

## Adding New Components

### From shadcn/ui

To add more shadcn/ui components:

```bash
npx shadcn-ui@latest add [component-name]
```

Example:
```bash
npx shadcn-ui@latest add select
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add toast
```

### Custom Components

1. Create component in appropriate directory:
   - `src/components/ui/` for low-level UI components
   - `src/components/primitives/` for reusable patterns
   - `src/components/layouts/` for layout components

2. Use TypeScript and React.forwardRef for proper ref handling

3. Accept `className` prop for customization:
```tsx
export interface MyComponentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  // Custom props
}

const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("base-classes", className)}
        {...props}
      />
    )
  }
)
```

4. Export from index file for clean imports

## Electron-Specific Styling

### Window Dragging

The header area is draggable by default:

```tsx
<header className="drag-none">
  <div className="drag-cancel">
    {/* Interactive elements here */}
  </div>
</header>
```

### Custom Scrollbars

Use `scrollbar-thin` for styled scrollbars that match the dark theme:

```tsx
<div className="h-full overflow-auto scrollbar-thin">
  {content}
</div>
```

## Best Practices

1. **Consistent Spacing**: Use Tailwind's spacing scale (p-4, mt-2, gap-6)
2. **Semantic HTML**: Use appropriate HTML elements (button, nav, main)
3. **Accessibility**: Always include labels, ARIA attributes where needed
4. **Type Safety**: Use TypeScript interfaces for all component props
5. **Composition**: Build complex UIs from simple components
6. **Dark Theme First**: Design for dark mode, light mode is secondary
7. **Animation**: Use subtle transitions (0.2-0.3s) for better UX
8. **Testing**: Test components in isolation before integration

## File Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui base components
│   ├── primitives/      # Reusable patterns
│   └── layouts/         # Layout components
├── lib/
│   └── utils.ts         # Utility functions
└── styles/
    └── globals.css      # Global styles & theme tokens
```

## Configuration Files

- `tailwind.config.js`: Tailwind configuration with theme extensions
- `postcss.config.js`: PostCSS plugins (Tailwind + Autoprefixer)
- `components.json`: shadcn/ui configuration
- `tsconfig.json`: TypeScript configuration with path aliases
- `vite.config.ts`: Vite build configuration

## Development Workflow

1. **Component Development**: Create/modify components in `src/components/`
2. **Styling**: Use Tailwind classes, extend theme if needed
3. **Testing**: Test in the demo app (`src/App.tsx`)
4. **Documentation**: Update this file with new patterns
5. **Integration**: Use components in feature modules

## Common Patterns

### Form with Validation
```tsx
const [errors, setErrors] = useState({})

<form onSubmit={handleSubmit}>
  <FormField
    label="Email"
    type="email"
    error={errors.email}
    required
  />
  <FormTextarea
    label="Message"
    error={errors.message}
    required
  />
  <Button type="submit">Submit</Button>
</form>
```

### Loading States
```tsx
<Button disabled={loading}>
  {loading ? "Loading..." : "Submit"}
</Button>
```

### Conditional Rendering with Animations
```tsx
{isVisible && (
  <div className="animate-fade-in">
    Content
  </div>
)}
```

### Master-Detail Layout
```tsx
<SplitLayout
  left={<ItemList />}
  right={<ItemDetail />}
  leftWidth="300px"
/>
```

## Troubleshooting

### Styles Not Applying
- Check Tailwind content paths in `tailwind.config.js`
- Verify CSS import in `main.tsx`
- Clear Vite cache: `rm -rf node_modules/.vite`

### TypeScript Errors
- Check path aliases in `tsconfig.json`
- Verify imports use `@/` prefix
- Run `npm run build` to check for type errors

### Dark Theme Issues
- Verify `.dark` class is on root element
- Check CSS variables are defined in `globals.css`
- Use theme colors, not hardcoded values

## Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Radix UI Docs](https://www.radix-ui.com)
- [Lucide Icons](https://lucide.dev)

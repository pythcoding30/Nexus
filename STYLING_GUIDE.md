# Styling Guide

## Theme System

### Dark Theme Tokens

The application uses a dark-first approach with CSS custom properties for theming. All color tokens are defined as HSL values for easy manipulation.

#### Core Colors
```css
--background: 222.2 84% 4.9%     /* Main background - very dark blue */
--foreground: 210 40% 98%        /* Text color - near white */
--primary: 217.2 91.2% 59.8%     /* Primary brand color - blue */
--secondary: 217.2 32.6% 17.5%   /* Secondary surfaces - dark blue-gray */
--muted: 217.2 32.6% 17.5%       /* Muted elements */
--accent: 217.2 32.6% 17.5%      /* Accent color */
--destructive: 0 62.8% 30.6%     /* Error/delete color - red */
```

#### UI Element Colors
```css
--card: 217.2 32.6% 17.5%        /* Card backgrounds */
--popover: 222.2 84% 4.9%        /* Popover backgrounds */
--border: 217.2 32.6% 17.5%      /* Border color */
--input: 217.2 32.6% 17.5%       /* Input border */
--ring: 224.3 76.3% 48%          /* Focus ring */
```

### Customizing the Theme

#### Changing Primary Color
1. Open `src/styles/globals.css`
2. Update the `--primary` value in the `.dark` class
3. Adjust `--primary-foreground` for text on primary color

```css
.dark {
  --primary: 142 76% 36%;           /* Green example */
  --primary-foreground: 210 40% 98%; /* White text */
}
```

#### Adding New Colors
1. Add CSS variable in `globals.css`:
```css
.dark {
  --custom: 280 80% 50%;
  --custom-foreground: 0 0% 100%;
}
```

2. Add to Tailwind config:
```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      custom: {
        DEFAULT: "hsl(var(--custom))",
        foreground: "hsl(var(--custom-foreground))",
      },
    },
  },
}
```

3. Use in components:
```tsx
<div className="bg-custom text-custom-foreground">
```

## Typography

### Font Families
The default system font stack is used for optimal performance and native feel:
- `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, ...`

### Text Sizes
```tsx
<p className="text-xs">Extra small (0.75rem)</p>
<p className="text-sm">Small (0.875rem)</p>
<p className="text-base">Base (1rem)</p>
<p className="text-lg">Large (1.125rem)</p>
<p className="text-xl">Extra large (1.25rem)</p>
<p className="text-2xl">2XL (1.5rem)</p>
<p className="text-3xl">3XL (1.875rem)</p>
```

### Font Weights
```tsx
<p className="font-normal">Normal (400)</p>
<p className="font-medium">Medium (500)</p>
<p className="font-semibold">Semibold (600)</p>
<p className="font-bold">Bold (700)</p>
```

### Text Colors
```tsx
<p className="text-foreground">Primary text</p>
<p className="text-muted-foreground">Secondary text</p>
<p className="text-primary">Brand color</p>
<p className="text-destructive">Error text</p>
```

## Spacing

### Padding & Margin
Use Tailwind's spacing scale (1 unit = 0.25rem = 4px):

```tsx
<div className="p-2">  {/* 8px padding */}
<div className="p-4">  {/* 16px padding */}
<div className="p-6">  {/* 24px padding */}
<div className="p-8">  {/* 32px padding */}

<div className="px-4 py-2">  {/* Horizontal & vertical */}
<div className="pt-4 pb-2">  {/* Top & bottom specific */}
```

### Gap (for flex/grid)
```tsx
<div className="flex gap-2">      {/* 8px gap */}
<div className="grid gap-4">      {/* 16px gap */}
<div className="flex gap-x-4 gap-y-2">  {/* Different x/y gaps */}
```

## Borders & Radius

### Border Radius
```tsx
<div className="rounded-sm">    {/* 2px - small radius */}
<div className="rounded-md">    {/* 6px - medium (most common) */}
<div className="rounded-lg">    {/* 8px - large */}
<div className="rounded-full">  {/* Fully rounded (circles) */}
```

### Borders
```tsx
<div className="border">           {/* 1px border */}
<div className="border-2">         {/* 2px border */}
<div className="border-t">         {/* Top border only */}
<div className="border-border">    {/* Theme border color */}
```

## Shadows

```tsx
<div className="shadow-sm">    {/* Small shadow */}
<div className="shadow">       {/* Default shadow */}
<div className="shadow-md">    {/* Medium shadow */}
<div className="shadow-lg">    {/* Large shadow */}
<div className="shadow-xl">    {/* Extra large */}
```

## Animations & Transitions

### Built-in Animations

#### Fade
```tsx
<div className="animate-fade-in">    {/* 0.2s fade in */}
<div className="animate-fade-out">   {/* 0.2s fade out */}
```

#### Slide
```tsx
<div className="animate-slide-in-from-top">
<div className="animate-slide-in-from-bottom">
<div className="animate-slide-in-from-left">
<div className="animate-slide-in-from-right">
```

#### Accordion (Radix)
```tsx
<div className="animate-accordion-down">
<div className="animate-accordion-up">
```

### Custom Transitions
```tsx
<button className="transition-colors duration-200">
  {/* Color transitions on hover */}
</button>

<div className="transition-all duration-300">
  {/* All properties transition */}
</div>
```

### Hover Effects
```tsx
<button className="hover:bg-primary hover:text-primary-foreground">
<div className="hover:scale-105 transition-transform">
<a className="hover:underline">
```

## Layout Utilities

### Flexbox
```tsx
<div className="flex">                    {/* Display flex */}
<div className="flex items-center">      {/* Vertically centered */}
<div className="flex justify-between">   {/* Space between */}
<div className="flex flex-col">          {/* Column direction */}
<div className="flex gap-4">             {/* Gap between items */}
```

### Grid
```tsx
<div className="grid grid-cols-2">           {/* 2 columns */}
<div className="grid grid-cols-3 gap-4">    {/* 3 columns with gap */}
<div className="grid md:grid-cols-2 lg:grid-cols-3">  {/* Responsive */}
```

### Sizing
```tsx
<div className="w-full">      {/* 100% width */}
<div className="h-full">      {/* 100% height */}
<div className="w-64">        {/* Fixed width (256px) */}
<div className="min-h-screen"> {/* Minimum viewport height */}
```

### Overflow
```tsx
<div className="overflow-hidden">         {/* Hide overflow */}
<div className="overflow-auto">           {/* Auto scrollbars */}
<div className="overflow-auto scrollbar-thin">  {/* Custom styled scrollbar */}
```

## Responsive Design

### Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Usage
```tsx
<div className="text-sm md:text-base lg:text-lg">
  {/* Small on mobile, base on tablet, large on desktop */}
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* 1 column mobile, 2 tablet, 3 desktop */}
</div>

<div className="hidden md:block">
  {/* Hidden on mobile, visible on tablet+ */}
</div>
```

## Component States

### Focus
```tsx
<input className="focus:ring-2 focus:ring-primary focus:outline-none" />
<button className="focus-visible:ring-2 focus-visible:ring-ring" />
```

### Disabled
```tsx
<button className="disabled:opacity-50 disabled:pointer-events-none">
<input className="disabled:cursor-not-allowed disabled:opacity-50" />
```

### Data States (Radix)
```tsx
<div className="data-[state=open]:animate-in data-[state=closed]:animate-out">
<div className="data-[disabled]:opacity-50">
```

## Electron-Specific Styles

### Window Dragging
```tsx
{/* Header that can drag the window */}
<header className="drag-none">
  {/* Interactive elements inside */}
  <button className="drag-cancel">
    Click me
  </button>
</header>
```

### Custom Scrollbars
```tsx
<div className="overflow-auto scrollbar-thin">
  {/* Styled scrollbar that matches dark theme */}
</div>
```

### Window Controls
```css
.electron-window {
  user-select: none; /* Prevent text selection on drag regions */
}
```

## Common Patterns

### Card Container
```tsx
<div className="rounded-lg border bg-card p-6 shadow-sm">
  <h3 className="text-lg font-semibold">Title</h3>
  <p className="text-muted-foreground">Content</p>
</div>
```

### Form Group
```tsx
<div className="space-y-2">
  <label className="text-sm font-medium">Label</label>
  <input className="w-full rounded-md border border-input bg-background px-3 py-2" />
  <p className="text-xs text-muted-foreground">Helper text</p>
</div>
```

### List Item
```tsx
<div className="flex items-center gap-3 rounded-md p-3 hover:bg-accent transition-colors">
  <Icon className="h-4 w-4" />
  <span>Item text</span>
</div>
```

### Loading Skeleton
```tsx
<div className="animate-pulse space-y-2">
  <div className="h-4 bg-muted rounded" />
  <div className="h-4 bg-muted rounded w-3/4" />
</div>
```

## Accessibility

### Focus Rings
Always ensure interactive elements have visible focus states:
```tsx
<button className="focus-visible:ring-2 focus-visible:ring-ring">
```

### Color Contrast
Use theme colors which are designed for sufficient contrast:
- `text-foreground` on `bg-background` ✅
- `text-primary-foreground` on `bg-primary` ✅
- `text-muted-foreground` for secondary text ✅

### Screen Reader Only
```tsx
<span className="sr-only">Hidden text for screen readers</span>
```

## Performance Tips

1. **Use Transitions Sparingly**: Only animate properties that won't trigger layout (opacity, transform)
2. **Avoid Inline Styles**: Use Tailwind classes for better caching
3. **Lazy Load Images**: Use loading="lazy" on images
4. **Minimize Repaints**: Use `will-change` sparingly for animated elements

## Tools & Utilities

### cn() Helper
Merge class names safely:
```tsx
import { cn } from "@/lib/utils"

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  className  // Allow overrides
)} />
```

### Conditional Classes
```tsx
<div className={cn(
  "base",
  variant === "primary" && "bg-primary",
  variant === "secondary" && "bg-secondary"
)} />
```

## Quick Reference

### Most Used Classes
```css
/* Layout */
flex items-center justify-between gap-4
grid grid-cols-3 gap-4

/* Spacing */
p-4 px-6 py-2 m-4 mx-auto

/* Typography */
text-sm font-medium text-foreground

/* Colors */
bg-background text-foreground
bg-primary text-primary-foreground
bg-card border-border

/* Interactive */
hover:bg-accent transition-colors
focus-visible:ring-2 focus-visible:ring-ring
disabled:opacity-50

/* Sizing */
w-full h-full min-h-screen

/* Borders */
rounded-md border border-border shadow-sm
```

## Browser DevTools Tips

1. **Inspect Computed Styles**: Check which Tailwind classes are applied
2. **Use the Elements Panel**: See CSS custom property values
3. **Test Dark Mode**: Toggle `.dark` class on root element
4. **Check Contrast**: Use browser accessibility tools

## Migration Notes

When updating from light to dark theme or vice versa:
1. Update CSS custom properties in `globals.css`
2. Test all components for contrast
3. Check focus states are visible
4. Verify hover states work well
5. Test in both macOS and Windows for native feel

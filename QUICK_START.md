# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open http://localhost:5173 to see the component showcase.

### 3. Start Building!
Import components and start building your UI:

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { FormField } from "@/components/primitives/FormControl"

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Card</CardTitle>
      </CardHeader>
      <CardContent>
        <FormField label="Name" placeholder="Enter name" />
        <Button className="mt-4">Submit</Button>
      </CardContent>
    </Card>
  )
}
```

## 📚 Documentation

- **README.md** - Project overview and setup
- **UI_DOCUMENTATION.md** - Complete component reference
- **STYLING_GUIDE.md** - Styling patterns and conventions
- **COMPONENT_EXAMPLES.md** - Copy-paste code examples
- **PROJECT_SUMMARY.md** - What was built and why

## 🎨 Key Concepts

### Import Components
```tsx
// UI Components
import { Button, Input, Card } from "@/components/ui"

// Primitive Components
import { Panel, FormField, Modal } from "@/components/primitives"

// Layout Components
import { AppLayout, SplitLayout } from "@/components/layouts"
```

### Use Semantic Colors
```tsx
// ✅ Good - uses theme tokens
<div className="bg-background text-foreground border-border">

// ❌ Bad - hardcoded colors
<div className="bg-slate-900 text-white border-gray-700">
```

### Compose Components
```tsx
<Panel variant="elevated" padding="lg">
  <Card>
    <CardHeader>
      <CardTitle>Form</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <FormField label="Email" type="email" />
      <FormField label="Password" type="password" />
      <Button>Submit</Button>
    </CardContent>
  </Card>
</Panel>
```

## 🛠️ Common Tasks

### Add a New shadcn/ui Component
```bash
npx shadcn-ui@latest add select
npx shadcn-ui@latest add checkbox
```

### Customize Theme Colors
Edit `src/styles/globals.css`:
```css
@theme {
  --color-primary: hsl(142 76% 36%);  /* Change primary color */
  --color-background: hsl(222 84% 5%); /* Change background */
}
```

### Create a Form
```tsx
import { FormField, FormTextarea } from "@/components/primitives/FormControl"
import { Button } from "@/components/ui/button"

function ContactForm() {
  return (
    <form className="space-y-4">
      <FormField 
        label="Name" 
        required 
        placeholder="Your name"
      />
      <FormField 
        label="Email" 
        type="email" 
        required
        hint="We'll never share your email"
      />
      <FormTextarea 
        label="Message" 
        rows={4} 
        placeholder="Your message"
      />
      <Button type="submit">Send Message</Button>
    </form>
  )
}
```

### Use Modals
```tsx
import { useState } from "react"
import { Modal, ConfirmModal } from "@/components/primitives/Modal"
import { Button } from "@/components/ui/button"

function MyComponent() {
  const [modalOpen, setModalOpen] = useState(false)
  
  return (
    <>
      <Button onClick={() => setModalOpen(true)}>
        Open Modal
      </Button>
      
      <Modal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Edit Item"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </>
        }
      >
        {/* Modal content */}
      </Modal>
    </>
  )
}
```

## 🎯 Next Steps

1. **Explore the Showcase**: Run `npm run dev` to see all components
2. **Read the Docs**: Check UI_DOCUMENTATION.md for detailed API
3. **Copy Examples**: Use COMPONENT_EXAMPLES.md for quick code snippets
4. **Build Your UI**: Start creating your application!

## 💡 Tips

- All components support `className` prop for customization
- Use `cn()` utility to merge class names: `cn("base", conditional && "extra")`
- Components are fully typed with TypeScript
- Dark theme is applied by default
- All animations are pre-configured

## 🐛 Troubleshooting

**Imports not working?**
- Make sure you're using `@/` prefix: `import { Button } from "@/components/ui/button"`

**Styles not applying?**
- Check that `src/styles/globals.css` is imported in `main.tsx`
- Verify Tailwind content paths in `tailwind.config.js`

**Type errors?**
- Run `npm run type-check` to see all errors
- Ensure all imports are correct

## 📦 Available Scripts

```bash
npm run dev              # Start dev server (Vite)
npm run build            # Build for production
npm run preview          # Preview production build
npm run type-check       # Check TypeScript types
npm run electron:dev     # Run Electron app
npm run electron:build   # Build Electron installer
```

## 🎨 Component Quick Reference

| Component | Import | Use Case |
|-----------|--------|----------|
| Button | `@/components/ui/button` | Actions, forms |
| Input | `@/components/ui/input` | Text input |
| Card | `@/components/ui/card` | Content containers |
| Dialog | `@/components/ui/dialog` | Modals, overlays |
| Tabs | `@/components/ui/tabs` | Tabbed interfaces |
| Panel | `@/components/primitives/Panel` | Flexible containers |
| FormField | `@/components/primitives/FormControl` | Complete form inputs |
| Modal | `@/components/primitives/Modal` | Quick modals |
| AppLayout | `@/components/layouts/AppLayout` | Main app structure |

## 🌟 Features

✅ TypeScript support  
✅ Dark theme by default  
✅ Fully accessible (Radix UI)  
✅ Responsive design  
✅ Smooth animations  
✅ Electron optimized  
✅ Hot reload  
✅ Production ready  

---

**Ready to build?** Run `npm run dev` and start creating! 🚀

# Component Examples

This document provides copy-paste examples for all available components.

## Table of Contents
- [UI Components](#ui-components)
- [Primitive Components](#primitive-components)
- [Layout Components](#layout-components)
- [Real-World Examples](#real-world-examples)

## UI Components

### Button

```tsx
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

// Variants
<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="destructive">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Download /></Button>

// With icons
<Button>
  <Download className="mr-2 h-4 w-4" />
  Download
</Button>

// States
<Button disabled>Disabled</Button>
<Button disabled={loading}>
  {loading ? "Loading..." : "Submit"}
</Button>
```

### Input

```tsx
import { Input } from "@/components/ui/input"

<Input type="text" placeholder="Enter text" />
<Input type="email" placeholder="Email address" />
<Input type="password" placeholder="Password" />
<Input type="number" min={0} max={100} />
<Input type="search" placeholder="Search..." />
<Input disabled placeholder="Disabled input" />
```

### Textarea

```tsx
import { Textarea } from "@/components/ui/textarea"

<Textarea placeholder="Enter your message" />
<Textarea rows={6} placeholder="Long message" />
<Textarea disabled placeholder="Disabled" />
```

### Label

```tsx
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" />
</div>
```

### Card

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>
      This is a card description
    </CardDescription>
  </CardHeader>
  <CardContent>
    <p>Your card content goes here</p>
  </CardContent>
  <CardFooter className="flex justify-between">
    <Button variant="outline">Cancel</Button>
    <Button>Save</Button>
  </CardFooter>
</Card>
```

### Dialog

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
    <div className="py-4">
      Dialog content here
    </div>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Continue</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Dropdown Menu

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

// Basic dropdown
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Options</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuItem>Logout</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

// With checkbox items
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">View</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuCheckboxItem checked={showPanel}>
      Show Panel
    </DropdownMenuCheckboxItem>
    <DropdownMenuCheckboxItem checked={showSidebar}>
      Show Sidebar
    </DropdownMenuCheckboxItem>
  </DropdownMenuContent>
</DropdownMenu>

// With radio items
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Sort By</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
      <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="date">Date</DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="size">Size</DropdownMenuRadioItem>
    </DropdownMenuRadioGroup>
  </DropdownMenuContent>
</DropdownMenu>
```

### Tabs

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

<Tabs defaultValue="account" className="w-full">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    <p>Account settings content</p>
  </TabsContent>
  <TabsContent value="password">
    <p>Password settings content</p>
  </TabsContent>
  <TabsContent value="settings">
    <p>General settings content</p>
  </TabsContent>
</Tabs>
```

### Separator

```tsx
import { Separator } from "@/components/ui/separator"

// Horizontal (default)
<div>
  <p>Above</p>
  <Separator className="my-4" />
  <p>Below</p>
</div>

// Vertical
<div className="flex h-5 items-center">
  <span>Item 1</span>
  <Separator orientation="vertical" className="mx-2" />
  <span>Item 2</span>
  <Separator orientation="vertical" className="mx-2" />
  <span>Item 3</span>
</div>
```

## Primitive Components

### Panel

```tsx
import { Panel } from "@/components/primitives/Panel"

// Variants
<Panel variant="default" padding="md">
  Default panel with medium padding
</Panel>

<Panel variant="elevated" padding="lg">
  Elevated panel with shadow and large padding
</Panel>

<Panel variant="bordered" padding="sm">
  Bordered panel with small padding
</Panel>

<Panel variant="ghost" padding="none">
  Transparent panel with no padding
</Panel>

// Custom styling
<Panel variant="elevated" className="hover:shadow-xl transition-shadow">
  Interactive panel with hover effect
</Panel>
```

### FormField & FormTextarea

```tsx
import { FormField, FormTextarea } from "@/components/primitives/FormControl"

// Basic form field
<FormField
  label="Username"
  placeholder="Enter your username"
  required
/>

// With hint
<FormField
  label="Email"
  type="email"
  placeholder="your@email.com"
  hint="We'll never share your email with anyone"
/>

// With error
<FormField
  label="Password"
  type="password"
  error="Password must be at least 8 characters"
  required
/>

// Textarea
<FormTextarea
  label="Description"
  placeholder="Enter a description"
  rows={4}
  hint="Maximum 500 characters"
/>

// Full form example
const [formData, setFormData] = useState({ name: '', email: '', bio: '' })
const [errors, setErrors] = useState({})

<form className="space-y-4">
  <FormField
    label="Name"
    value={formData.name}
    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
    error={errors.name}
    required
  />
  <FormField
    label="Email"
    type="email"
    value={formData.email}
    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
    error={errors.email}
    required
  />
  <FormTextarea
    label="Bio"
    value={formData.bio}
    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
    rows={4}
  />
  <Button type="submit">Submit</Button>
</form>
```

### Modal & ConfirmModal

```tsx
import { Modal, ConfirmModal } from "@/components/primitives/Modal"
import { Button } from "@/components/ui/button"

// Standard Modal
const [isOpen, setIsOpen] = useState(false)

<>
  <Button onClick={() => setIsOpen(true)}>
    Open Modal
  </Button>
  
  <Modal
    open={isOpen}
    onOpenChange={setIsOpen}
    title="Edit Profile"
    description="Make changes to your profile"
    size="lg"
    footer={
      <>
        <Button variant="outline" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Changes
        </Button>
      </>
    }
  >
    <div className="space-y-4">
      <FormField label="Name" defaultValue="John Doe" />
      <FormField label="Email" type="email" defaultValue="john@example.com" />
    </div>
  </Modal>
</>

// Confirmation Modal
const [confirmOpen, setConfirmOpen] = useState(false)

<>
  <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
    Delete Account
  </Button>
  
  <ConfirmModal
    open={confirmOpen}
    onOpenChange={setConfirmOpen}
    title="Delete Account"
    description="This will permanently delete your account. This action cannot be undone."
    variant="destructive"
    confirmText="Delete Account"
    cancelText="Cancel"
    onConfirm={async () => {
      await deleteAccount()
      console.log('Account deleted')
    }}
    onCancel={() => console.log('Cancelled')}
  />
</>

// With loading state
const [loading, setLoading] = useState(false)

<ConfirmModal
  open={confirmOpen}
  onOpenChange={setConfirmOpen}
  title="Save Changes"
  description="Do you want to save your changes?"
  confirmText="Save"
  loading={loading}
  onConfirm={async () => {
    setLoading(true)
    await saveData()
    setLoading(false)
  }}
/>
```

## Layout Components

### AppLayout

```tsx
import { AppLayout } from "@/components/layouts/AppLayout"
import { Button } from "@/components/ui/button"
import { Settings, Home, User } from "lucide-react"

<AppLayout
  header={
    <div className="flex items-center justify-between px-4 py-3">
      <h1 className="text-lg font-semibold">My App</h1>
      <Button variant="ghost" size="icon">
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  }
  sidebar={
    <nav className="w-64 p-4 space-y-2">
      <Button variant="ghost" className="w-full justify-start">
        <Home className="mr-2 h-4 w-4" />
        Home
      </Button>
      <Button variant="ghost" className="w-full justify-start">
        <User className="mr-2 h-4 w-4" />
        Profile
      </Button>
      <Button variant="ghost" className="w-full justify-start">
        <Settings className="mr-2 h-4 w-4" />
        Settings
      </Button>
    </nav>
  }
  footer={
    <div className="px-4 py-2 text-sm text-muted-foreground">
      © 2024 My App
    </div>
  }
>
  <div className="container mx-auto p-8">
    <h2 className="text-2xl font-bold mb-4">Main Content</h2>
    <p>Your main content goes here</p>
  </div>
</AppLayout>
```

### SplitLayout

```tsx
import { SplitLayout } from "@/components/layouts/SplitLayout"

// Horizontal split
<SplitLayout
  direction="horizontal"
  left={
    <div className="p-4">
      <h3 className="font-semibold mb-2">Left Panel</h3>
      <p>Content for left side</p>
    </div>
  }
  right={
    <div className="p-4">
      <h3 className="font-semibold mb-2">Right Panel</h3>
      <p>Content for right side</p>
    </div>
  }
  leftWidth="40%"
  rightWidth="60%"
/>

// Vertical split
<SplitLayout
  direction="vertical"
  left={
    <div className="p-4">
      <h3 className="font-semibold mb-2">Top Panel</h3>
    </div>
  }
  right={
    <div className="p-4">
      <h3 className="font-semibold mb-2">Bottom Panel</h3>
    </div>
  }
  leftWidth="200px"
/>
```

## Real-World Examples

### Settings Page

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormField, FormTextarea } from "@/components/primitives/FormControl"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

function SettingsPage() {
  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField label="Name" defaultValue="John Doe" />
              <FormField label="Email" type="email" defaultValue="john@example.com" />
              <FormTextarea label="Bio" rows={4} />
              <Separator />
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Appearance settings coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Manage notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Notification settings coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

### Data Table with Actions

```tsx
import { Panel } from "@/components/primitives/Panel"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash } from "lucide-react"
import { ConfirmModal } from "@/components/primitives/Modal"

function DataTable() {
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const data = [
    { id: '1', name: 'Item 1', status: 'Active' },
    { id: '2', name: 'Item 2', status: 'Inactive' },
  ]

  return (
    <>
      <Panel variant="default" padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "inline-flex items-center rounded-full px-2 py-1 text-xs",
                      item.status === 'Active' 
                        ? "bg-primary/10 text-primary" 
                        : "bg-muted text-muted-foreground"
                    )}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeleteId(item.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <ConfirmModal
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Item"
        description="Are you sure you want to delete this item?"
        variant="destructive"
        onConfirm={() => {
          console.log('Deleting:', deleteId)
          setDeleteId(null)
        }}
      />
    </>
  )
}
```

### Master-Detail View

```tsx
import { SplitLayout } from "@/components/layouts/SplitLayout"
import { Panel } from "@/components/primitives/Panel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function MasterDetailView() {
  const [selectedId, setSelectedId] = useState('1')

  const items = [
    { id: '1', name: 'Item 1', description: 'Details for item 1' },
    { id: '2', name: 'Item 2', description: 'Details for item 2' },
    { id: '3', name: 'Item 3', description: 'Details for item 3' },
  ]

  const selectedItem = items.find(item => item.id === selectedId)

  return (
    <SplitLayout
      direction="horizontal"
      leftWidth="300px"
      left={
        <div className="p-4 space-y-2">
          <h3 className="font-semibold mb-4">Items</h3>
          {items.map((item) => (
            <Button
              key={item.id}
              variant={selectedId === item.id ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setSelectedId(item.id)}
            >
              {item.name}
            </Button>
          ))}
        </div>
      }
      right={
        <div className="p-4">
          {selectedItem && (
            <Card>
              <CardHeader>
                <CardTitle>{selectedItem.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{selectedItem.description}</p>
              </CardContent>
            </Card>
          )}
        </div>
      }
    />
  )
}
```

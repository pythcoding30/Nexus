import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Panel } from "@/components/primitives/Panel"
import { FormField, FormTextarea } from "@/components/primitives/FormControl"
import { Modal, ConfirmModal } from "@/components/primitives/Modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  ChevronDown, 
  Download, 
  Edit, 
  Trash, 
  Save,
  Plus 
} from "lucide-react"

export function Showcase() {
  const [modalOpen, setModalOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Buttons</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-wrap gap-2">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-wrap gap-2">
          <Button>
            <Download className="mr-2 h-4 w-4" />
            With Icon
          </Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      <Separator />

      <section>
        <h2 className="text-2xl font-bold mb-4">Form Controls</h2>
        <div className="max-w-md space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Basic Inputs</h3>
            <div className="space-y-2">
              <Input placeholder="Text input" />
              <Input type="email" placeholder="Email input" />
              <Input type="password" placeholder="Password input" />
              <Textarea placeholder="Textarea" rows={3} />
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="text-sm font-medium mb-2">Form Fields</h3>
            <div className="space-y-4">
              <FormField
                label="Username"
                placeholder="Enter username"
                required
              />
              <FormField
                label="Email"
                type="email"
                placeholder="your@email.com"
                hint="We'll never share your email"
              />
              <FormField
                label="Invalid Field"
                placeholder="This field has an error"
                error="This field is required"
              />
              <FormTextarea
                label="Description"
                placeholder="Enter description"
                rows={3}
              />
            </div>
          </div>
        </div>
      </section>

      <Separator />

      <section>
        <h2 className="text-2xl font-bold mb-4">Panels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Panel variant="default" padding="md">
            <h3 className="font-semibold mb-2">Default Panel</h3>
            <p className="text-sm text-muted-foreground">Standard panel with border</p>
          </Panel>
          <Panel variant="elevated" padding="md">
            <h3 className="font-semibold mb-2">Elevated Panel</h3>
            <p className="text-sm text-muted-foreground">Panel with shadow</p>
          </Panel>
          <Panel variant="bordered" padding="md">
            <h3 className="font-semibold mb-2">Bordered Panel</h3>
            <p className="text-sm text-muted-foreground">Panel with thicker border</p>
          </Panel>
          <Panel variant="ghost" padding="md">
            <h3 className="font-semibold mb-2">Ghost Panel</h3>
            <p className="text-sm text-muted-foreground">Transparent panel</p>
          </Panel>
        </div>
      </section>

      <Separator />

      <section>
        <h2 className="text-2xl font-bold mb-4">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Simple Card</CardTitle>
              <CardDescription>Card with header and content</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">This is the card content area.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Interactive Card</CardTitle>
              <CardDescription>Card with actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">Card content with buttons below.</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button size="sm" variant="destructive">
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      <section>
        <h2 className="text-2xl font-bold mb-4">Dropdowns & Modals</h2>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Options
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Save className="mr-2 h-4 w-4" />
                Save
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
          <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
            Delete Item
          </Button>
        </div>
      </section>

      <Separator />

      <section>
        <h2 className="text-2xl font-bold mb-4">Tabs</h2>
        <Tabs defaultValue="tab1" className="w-full">
          <TabsList>
            <TabsTrigger value="tab1">First Tab</TabsTrigger>
            <TabsTrigger value="tab2">Second Tab</TabsTrigger>
            <TabsTrigger value="tab3">Third Tab</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <Card>
              <CardContent className="pt-6">
                <p>Content for the first tab.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="tab2">
            <Card>
              <CardContent className="pt-6">
                <p>Content for the second tab.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="tab3">
            <Card>
              <CardContent className="pt-6">
                <p>Content for the third tab.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      <Modal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Example Modal"
        description="This is a reusable modal component"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setModalOpen(false)}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Name" placeholder="Enter name" />
          <FormTextarea label="Notes" placeholder="Add notes" rows={3} />
        </div>
      </Modal>

      <ConfirmModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
        variant="destructive"
        confirmText="Delete"
        onConfirm={() => console.log("Item deleted")}
      />
    </div>
  )
}

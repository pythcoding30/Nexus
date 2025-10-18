import { AppLayout } from "@/components/layouts"
import { Button } from "@/components/ui/button"
import { Menu, Settings, Home, Layers } from "lucide-react"
import { Showcase } from "@/components/Showcase"

function App() {

  return (
    <div className="dark h-screen w-screen electron-window">
      <AppLayout
        header={
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-semibold">Nexus UI Framework</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        }
        sidebar={
          <div className="w-64 p-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Menu className="mr-2 h-4 w-4" />
              Components
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        }
      >
        <div className="container mx-auto p-8 space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">UI Component Library</h2>
            <p className="text-muted-foreground">
              Tailwind CSS + shadcn/ui components with dark theme support
            </p>
          </div>

          <Showcase />
        </div>
      </AppLayout>
    </div>
  )
}

export default App

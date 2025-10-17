import * as React from "react"
import { cn } from "@/lib/utils"

export interface AppLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  sidebar?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  children: React.ReactNode
}

const AppLayout = React.forwardRef<HTMLDivElement, AppLayoutProps>(
  ({ className, sidebar, header, footer, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex h-full w-full overflow-hidden", className)}
        {...props}
      >
        {sidebar && (
          <aside className="flex-shrink-0 border-r border-border bg-card">
            {sidebar}
          </aside>
        )}
        <div className="flex flex-1 flex-col overflow-hidden">
          {header && (
            <header className="flex-shrink-0 border-b border-border bg-background drag-none">
              <div className="drag-cancel">{header}</div>
            </header>
          )}
          <main className="flex-1 overflow-auto scrollbar-thin">
            {children}
          </main>
          {footer && (
            <footer className="flex-shrink-0 border-t border-border bg-background">
              {footer}
            </footer>
          )}
        </div>
      </div>
    )
  }
)
AppLayout.displayName = "AppLayout"

export { AppLayout }

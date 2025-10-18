import * as React from "react"
import { cn } from "@/lib/utils"

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "bordered" | "ghost"
  padding?: "none" | "sm" | "md" | "lg"
}

const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  ({ className, variant = "default", padding = "md", children, ...props }, ref) => {
    const variantClasses = {
      default: "bg-card border border-border",
      elevated: "bg-card border border-border shadow-lg",
      bordered: "bg-background border-2 border-border",
      ghost: "bg-transparent",
    }

    const paddingClasses = {
      none: "",
      sm: "p-2",
      md: "p-4",
      lg: "p-6",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg transition-colors",
          variantClasses[variant],
          paddingClasses[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Panel.displayName = "Panel"

export { Panel }

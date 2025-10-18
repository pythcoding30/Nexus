import * as React from "react"
import { cn } from "@/lib/utils"

export interface SplitLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  left: React.ReactNode
  right: React.ReactNode
  leftWidth?: string
  rightWidth?: string
  direction?: "horizontal" | "vertical"
  gap?: number
}

const SplitLayout = React.forwardRef<HTMLDivElement, SplitLayoutProps>(
  (
    {
      className,
      left,
      right,
      leftWidth = "50%",
      rightWidth = "50%",
      direction = "horizontal",
      gap = 0,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex h-full w-full",
          direction === "horizontal" ? "flex-row" : "flex-col",
          className
        )}
        style={{ gap: `${gap}px` }}
        {...props}
      >
        <div
          className={cn(
            "overflow-auto scrollbar-thin",
            direction === "horizontal" ? "border-r border-border" : "border-b border-border"
          )}
          style={{
            [direction === "horizontal" ? "width" : "height"]: leftWidth,
          }}
        >
          {left}
        </div>
        <div
          className="flex-1 overflow-auto scrollbar-thin"
          style={{
            [direction === "horizontal" ? "width" : "height"]: rightWidth,
          }}
        >
          {right}
        </div>
      </div>
    )
  }
)
SplitLayout.displayName = "SplitLayout"

export { SplitLayout }

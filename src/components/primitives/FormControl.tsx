import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export interface FormControlProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  error?: string
  hint?: string
  required?: boolean
}

const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
  ({ className, label, error, hint, required, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {label && (
          <Label>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        {children}
        {hint && !error && (
          <p className="text-xs text-muted-foreground">{hint}</p>
        )}
        {error && (
          <p className="text-xs text-destructive animate-in fade-in-50">
            {error}
          </p>
        )}
      </div>
    )
  }
)
FormControl.displayName = "FormControl"

export interface FormFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string
  error?: string
  hint?: string
  containerClassName?: string
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  (
    { className, label, error, hint, required, containerClassName, ...props },
    ref
  ) => {
    return (
      <FormControl
        label={label}
        error={error}
        hint={hint}
        required={required}
        className={containerClassName}
      >
        <Input
          ref={ref}
          className={cn(error && "border-destructive", className)}
          {...props}
        />
      </FormControl>
    )
  }
)
FormField.displayName = "FormField"

export interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  containerClassName?: string
}

const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  (
    { className, label, error, hint, required, containerClassName, ...props },
    ref
  ) => {
    return (
      <FormControl
        label={label}
        error={error}
        hint={hint}
        required={required}
        className={containerClassName}
      >
        <Textarea
          ref={ref}
          className={cn(error && "border-destructive", className)}
          {...props}
        />
      </FormControl>
    )
  }
)
FormTextarea.displayName = "FormTextarea"

export { FormControl, FormField, FormTextarea }

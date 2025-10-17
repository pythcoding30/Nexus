import '../../styles/components.css'

interface BadgeProps {
  variant: 'status' | 'priority'
  value: string
  children?: React.ReactNode
}

export default function Badge({ variant, value, children }: BadgeProps) {
  const className = `badge badge-${variant}-${value}`
  const displayText = children || value.replace('_', ' ')
  
  return (
    <span className={className}>
      {displayText}
    </span>
  )
}

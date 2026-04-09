import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-black ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 uppercase tracking-widest",
  {
    variants: {
      variant: {
        default: "bg-primary text-white shadow-xl shadow-primary/20 hover:bg-primary/90 hover:translate-y-[-2px]",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline: "border-2 border-primary/20 bg-transparent hover:bg-primary/5 hover:border-primary",
        secondary: "bg-secondary text-white hover:bg-secondary/80",
        ghost: "hover:bg-primary/5 hover:text-primary",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-14 px-8 py-2 rounded-2xl",
        sm: "h-10 rounded-xl px-4 text-xs",
        lg: "h-20 rounded-[2rem] px-12 text-base",
        icon: "h-10 w-10 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

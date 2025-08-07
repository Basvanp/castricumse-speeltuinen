import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { AlertTriangle } from "lucide-react"
import "./problem-report-button.css"

const problemReportButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
          variants: {
        variant: {
          default: "min-w-[100px] px-3 py-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:transform hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]",
          outline: "min-w-[100px] px-4 py-2 border-none bg-transparent text-black hover:bg-gray-100 hover:text-black hover:transform hover:-translate-y-1",
          red: "min-w-[100px] px-3 py-2 bg-red-500 text-white border border-red-500 hover:bg-red-600 hover:border-red-600 hover:transform hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(239,68,68,0.3)]",
        },
      size: {
        default: "px-3 py-2 text-xs font-medium",
        sm: "px-2 py-1.5 text-xs font-medium min-w-[80px]",
        lg: "px-4 py-3 text-sm font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ProblemReportButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof problemReportButtonVariants> {
  children?: React.ReactNode
}

const ProblemReportButton = React.forwardRef<HTMLButtonElement, ProblemReportButtonProps>(
  ({ className, variant, size, children = "Probleem melden", ...props }, ref) => {
    return (
      <button
        className={cn(problemReportButtonVariants({ variant, size, className }), "problem-report-btn")}
        ref={ref}
        {...props}
      >
        <AlertTriangle size={16} />
        <span>{children}</span>
      </button>
    )
  }
)

ProblemReportButton.displayName = "ProblemReportButton"

export { ProblemReportButton, problemReportButtonVariants } 
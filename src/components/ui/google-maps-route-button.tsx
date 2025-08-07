import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import "./google-maps-route-button.css"

const routeButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "min-w-[140px] px-5 py-3 bg-[#4285f4] text-white border-none hover:bg-[#3367d6] hover:transform hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(66,133,244,0.3)]",
        outline: "min-w-[140px] px-5 py-3 border-2 border-[#4285f4] bg-transparent text-[#4285f4] hover:bg-[#4285f4] hover:text-white hover:transform hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(66,133,244,0.3)]",
      },
      size: {
        default: "px-5 py-3 text-sm font-medium",
        sm: "px-3 py-2 text-xs font-medium min-w-[100px]",
        lg: "px-6 py-3 text-base font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface GoogleMapsRouteButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof routeButtonVariants> {
  href?: string
  target?: string
  rel?: string
  children?: React.ReactNode
}

const GoogleMapsRouteButton = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  GoogleMapsRouteButtonProps
>(({ className, variant, size, href, target = "_blank", rel = "noopener noreferrer", children = "Route", ...props }, ref) => {
    const LocationIcon = () => (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="shrink-0"
        aria-hidden="true"
      >
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    )

    const buttonContent = (
      <>
        <LocationIcon />
        <span>{children}</span>
      </>
    )

    if (href) {
      return (
        <a
          href={href}
          target={target}
          rel={rel}
          className={cn(routeButtonVariants({ variant, size, className }), "maps-btn-route")}
          ref={ref as React.Ref<HTMLAnchorElement>}
        >
          {buttonContent}
        </a>
      )
    }

    return (
      <button
        className={cn(routeButtonVariants({ variant, size, className }), "maps-btn-route")}
        ref={ref as React.Ref<HTMLButtonElement>}
        {...props}
      >
        {buttonContent}
      </button>
    )
  }
)

GoogleMapsRouteButton.displayName = "GoogleMapsRouteButton"

export { GoogleMapsRouteButton, routeButtonVariants } 
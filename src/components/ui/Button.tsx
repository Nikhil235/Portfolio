import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react"
import { Loader2 } from "lucide-react"

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive"
export type ButtonSize = "sm" | "md" | "lg"

interface BaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
  fullWidth?: boolean
  children: ReactNode
}

type AsButton = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }
type AsLink = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
export type ButtonProps = AsButton | AsLink

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-on-accent shadow-[var(--shadow-accent)] hover:brightness-110 active:brightness-95",
  secondary:
    "border border-border-strong bg-surface text-text-primary hover:border-accent hover:text-accent",
  ghost: "text-text-secondary hover:bg-surface hover:text-text-primary",
  destructive: "bg-error text-on-accent hover:brightness-110 active:brightness-95",
}

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-caption gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-6 text-body gap-2",
}

export function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth,
}: Pick<BaseProps, "variant" | "size" | "fullWidth">) {
  return [
    "inline-flex select-none items-center justify-center whitespace-nowrap rounded-control font-semibold",
    "transition-[transform,filter,background-color,border-color,color] duration-[var(--dur-micro)] ease-[var(--ease-standard)]",
    "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45",
    variants[variant],
    sizes[size],
    fullWidth ? "w-full" : "",
  ].join(" ")
}

/** Single source of truth for actions. Renders <a> when `href` is set, otherwise <button>. */
export default function Button(props: ButtonProps) {
  const { variant, size, loading, iconLeft, iconRight, fullWidth, children, className = "", ...rest } = props
  const cls = `${buttonClasses({ variant, size, fullWidth })} ${className}`
  const content = (
    <>
      {loading ? <Loader2 size={16} className="animate-spin" aria-hidden /> : iconLeft}
      <span>{children}</span>
      {!loading && iconRight}
    </>
  )

  if ("href" in rest && rest.href !== undefined) {
    return (
      <a className={cls} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </a>
    )
  }
  const btn = rest as ButtonHTMLAttributes<HTMLButtonElement>
  return (
    <button
      type={btn.type ?? "button"}
      className={cls}
      aria-busy={loading || undefined}
      {...btn}
      disabled={btn.disabled || loading}
    >
      {content}
    </button>
  )
}

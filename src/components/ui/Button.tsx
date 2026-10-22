import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Link, type LinkProps } from "react-router";
import { cn } from "../../lib/cn";

/*
 * Shape rule for the whole app: interactive controls are full pills,
 * cards and panels use rounded-2xl.
 */
type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string): string {
  return cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold",
    "transition-[background-color,border-color,color,transform] duration-150 ease-out active:scale-[0.98]",
    "disabled:pointer-events-none disabled:opacity-50",
    size === "md" ? "min-h-11 px-5 text-[0.95rem]" : "min-h-9 px-3.5 text-sm",
    variant === "primary" && "bg-accent text-accent-contrast hover:bg-accent-hover",
    variant === "secondary" && "border border-line-strong bg-surface text-ink hover:border-accent hover:text-accent-text",
    variant === "ghost" && "text-ink-muted hover:bg-surface-2 hover:text-ink",
    className,
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, className, type = "button", ...props },
  ref,
) {
  return <button ref={ref} type={type} className={buttonClasses(variant, size, className)} {...props} />;
});

interface ButtonLinkProps extends LinkProps {
  variant?: Variant;
  size?: Size;
}

export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClasses(variant, size, typeof className === "string" ? className : undefined)} {...props} />;
}

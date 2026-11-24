import { cn } from "@/lib/cn";
import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "fill-accent-gradient text-brand-dark shadow-glow hover:-translate-y-0.5 hover:brightness-105",
  secondary:
    "border border-brand-border bg-brand-card text-brand-cream hover:border-brand-accent hover:text-brand-accent",
  ghost:
    "bg-transparent text-brand-cream/90 hover:bg-brand-cream/10 hover:text-brand-accent",
  outline:
    "border border-brand-cream/20 bg-transparent text-brand-cream hover:border-brand-accent hover:text-brand-accent",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-5 text-sm",
  md: "h-12.5 px-7 text-base",
  lg: "h-12.5 px-7 text-base sm:px-8",
};

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps & {
  href: string;
  onClick?: () => void;
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonAsButton | ButtonAsLink) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-pill font-medium transition duration-brand disabled:pointer-events-none disabled:opacity-60",
    variants[variant],
    sizes[size],
    className,
  );

  if ("href" in props && props.href) {
    const { href, onClick } = props;
    if (href.startsWith("http")) {
      return (
        <a
          href={href}
          className={classes}
          onClick={onClick}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}

"use client";

import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "dark";
type Size = "default" | "sm";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-primary text-white rounded-3xl h-14 shadow-[0_6px_16px_#8B5CF650] font-semibold text-base font-body active:shadow-[0_4px_12px_#8B5CF640] active:translate-y-px",
  secondary:
    "bg-surface text-text-primary rounded-3xl h-[52px] font-semibold text-base font-body",
  outline:
    "border border-border bg-white text-text-primary rounded-3xl h-[52px] font-semibold text-base font-body",
  ghost: "bg-transparent text-text-secondary font-medium text-base font-body",
  dark: "bg-text-primary text-white rounded-3xl h-[52px] font-semibold text-base font-body",
};

const sizeClasses: Record<Size, string> = {
  default: "px-6",
  sm: "px-4 h-10 text-sm",
};

export function Button({
  variant = "primary",
  size = "default",
  fullWidth = true,
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={`
        inline-flex items-center justify-center transition-all cursor-pointer
        ${variantClasses[variant]}
        ${size === "sm" ? sizeClasses.sm : sizeClasses.default}
        ${fullWidth ? "w-full" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

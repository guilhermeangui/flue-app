"use client";

import type { ButtonHTMLAttributes, ElementType } from "react";

type Variant = "default" | "ghost";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ElementType;
  variant?: Variant;
  size?: number;
}

const variantClasses: Record<Variant, string> = {
  default: "bg-surface rounded-[10px] w-9 h-9",
  ghost: "bg-transparent w-9 h-9",
};

export function IconButton({
  icon: Icon,
  variant = "default",
  size = 18,
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={`
        inline-flex items-center justify-center text-text-secondary
        transition-colors cursor-pointer hover:text-text-primary
        ${variantClasses[variant]}
        ${className}
      `}
      {...props}
    >
      <Icon size={size} />
    </button>
  );
}

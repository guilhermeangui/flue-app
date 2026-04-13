"use client";

type Variant = "score" | "status" | "language";

interface BadgeProps {
  variant: Variant;
  value?: number;
  label?: string;
  className?: string;
}

function getScoreClasses(value: number): string {
  if (value >= 85) return "bg-green-100 text-green-700";
  if (value >= 70) return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
}

export function Badge({ variant, value, label, className = "" }: BadgeProps) {
  if (variant === "score" && value !== undefined) {
    return (
      <span
        className={`
          inline-flex items-center px-2.5 py-0.5 rounded-full
          text-xs font-semibold font-body
          ${getScoreClasses(value)}
          ${className}
        `}
      >
        {value}
      </span>
    );
  }

  if (variant === "status") {
    return (
      <span
        className={`
          inline-flex items-center px-2.5 py-0.5 rounded-full
          text-xs font-semibold font-body
          bg-green-100 text-green-700
          ${className}
        `}
      >
        {label ?? "Active"}
      </span>
    );
  }

  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full
        text-xs font-medium font-body
        bg-surface text-text-secondary
        ${className}
      `}
    >
      {label}
    </span>
  );
}

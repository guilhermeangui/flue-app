"use client";

import Image from "next/image";

type Size = "sm" | "md" | "lg";
type Variant = "default" | "ai";

interface AvatarProps {
  name?: string;
  imageUrl?: string;
  size?: Size;
  variant?: Variant;
  className?: string;
}

const sizeMap: Record<Size, { container: string; text: string }> = {
  sm: { container: "w-[30px] h-[30px]", text: "text-xs" },
  md: { container: "w-[42px] h-[42px]", text: "text-sm" },
  lg: { container: "w-[56px] h-[56px]", text: "text-base" },
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function Avatar({
  name,
  imageUrl,
  size = "md",
  variant = "default",
  className = "",
}: AvatarProps) {
  const { container, text } = sizeMap[size];
  const isAi = variant === "ai";

  return (
    <div
      className={`
        ${container} rounded-full overflow-hidden flex items-center justify-center shrink-0
        ${isAi ? "bg-primary text-white" : "bg-surface text-text-secondary"}
        ${text} font-semibold font-body
        ${className}
      `}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={name ?? "Avatar"}
          width={size === "sm" ? 30 : size === "md" ? 42 : 56}
          height={size === "sm" ? 30 : size === "md" ? 42 : 56}
          className="w-full h-full object-cover"
        />
      ) : isAi ? (
        "AI"
      ) : name ? (
        getInitials(name)
      ) : (
        "?"
      )}
    </div>
  );
}

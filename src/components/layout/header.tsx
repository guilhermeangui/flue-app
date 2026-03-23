"use client";

import type { LucideIcon } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightIcon?: LucideIcon;
  onRightClick?: () => void;
}

export function Header({
  title,
  showBack,
  rightIcon: RightIcon,
  onRightClick,
}: HeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between px-5 pb-2 pt-0">
      {showBack ? (
        <button type="button" onClick={() => router.back()} className="p-1">
          <ChevronLeft className="h-7 w-7 text-text-primary" />
        </button>
      ) : (
        <h1 className="font-heading text-[26px] font-extrabold text-text-primary">
          {title}
        </h1>
      )}
      {showBack && (
        <span className="font-heading text-[17px] font-bold text-text-primary">
          {title}
        </span>
      )}
      {RightIcon ? (
        <button type="button" onClick={onRightClick} className="p-1">
          <RightIcon className="h-[22px] w-[22px] text-text-secondary" />
        </button>
      ) : showBack ? (
        <div className="w-7" />
      ) : null}
    </div>
  );
}

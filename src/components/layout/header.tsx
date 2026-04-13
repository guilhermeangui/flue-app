"use client";

import { ChevronLeft, Search, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

const ICONS = {
  search: Search,
  settings: Settings,
} as const;

type IconName = keyof typeof ICONS;

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightIcon?: IconName;
  onRightClick?: () => void;
}

export function Header({
  title,
  showBack,
  rightIcon,
  onRightClick,
}: HeaderProps) {
  const router = useRouter();
  const RightIcon = rightIcon ? ICONS[rightIcon] : null;

  return (
    <div className="flex items-center justify-between px-5 pb-2 pt-5">
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

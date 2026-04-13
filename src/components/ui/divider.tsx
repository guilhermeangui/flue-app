"use client";

interface DividerProps {
  text?: string;
}

export function Divider({ text }: DividerProps) {
  if (!text) {
    return <div className="h-px bg-surface w-full" />;
  }

  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1 h-px bg-surface" />
      <span className="text-[13px] text-text-muted font-body">{text}</span>
      <div className="flex-1 h-px bg-surface" />
    </div>
  );
}

"use client";

import { Mic, Paperclip } from "lucide-react";
import { useState } from "react";

interface ChatInputProps {
  disabled?: boolean;
  placeholder?: string;
  onSend?: (text: string) => void;
}

export function ChatInput({
  disabled,
  placeholder = "Type or hold mic...",
  onSend,
}: ChatInputProps) {
  const [text, setText] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && text.trim()) {
      e.preventDefault();
      onSend?.(text.trim());
      setText("");
    }
  };

  return (
    <div className="flex items-center gap-2.5 border-t border-surface bg-white px-4 py-4">
      <div className="flex flex-1 items-center gap-2 rounded-[22px] bg-surface px-4">
        <Paperclip className="h-[18px] w-[18px] text-text-muted" />
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          className="h-11 flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted disabled:cursor-not-allowed"
        />
      </div>
      <button
        type="button"
        disabled={disabled}
        className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[26px] ${
          disabled ? "bg-[#D4D4D8]" : "bg-primary shadow-[0_4px_12px_#8B5CF640]"
        }`}
      >
        <Mic className="h-[22px] w-[22px] text-white" />
      </button>
    </div>
  );
}

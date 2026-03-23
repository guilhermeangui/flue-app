"use client";

import type { Message } from "@/lib/types";

export function MessageBubble({ message }: { message: Message }) {
  if (message.sender === "user") {
    return (
      <div className="flex justify-end">
        <div className="rounded-[20px] rounded-br-[4px] bg-primary px-3.5 py-3 text-sm text-white">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2">
      <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[15px] bg-primary">
        <span className="text-[11px] font-bold text-white">AI</span>
      </div>
      <div className="max-w-[270px] rounded-[20px] rounded-tl-[4px] bg-white px-4 py-3.5 shadow-[0_2px_8px_#00000012]">
        <p className="text-sm leading-relaxed text-text-primary">
          {message.content}
        </p>
      </div>
    </div>
  );
}

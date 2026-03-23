"use client";

import { Mic } from "lucide-react";

const WAVEFORM_BARS = [
  { id: "w0", h: 10, dim: true },
  { id: "w1", h: 18, dim: false },
  { id: "w2", h: 26, dim: false },
  { id: "w3", h: 16, dim: true },
  { id: "w4", h: 28, dim: false },
  { id: "w5", h: 20, dim: false },
  { id: "w6", h: 14, dim: true },
  { id: "w7", h: 22, dim: false },
  { id: "w8", h: 10, dim: false },
];

export function VoiceMessage({ duration }: { duration: string }) {
  return (
    <div className="flex justify-end">
      <div className="flex w-[220px] flex-col gap-2.5 rounded-[20px] rounded-br-[4px] bg-primary px-3.5 py-3">
        <div className="flex items-center gap-2">
          <Mic className="h-4 w-4 text-white" />
          <span className="text-[13px] font-semibold text-white">
            Voice Message
          </span>
        </div>
        <div className="flex h-8 items-end gap-[3px] px-1">
          {WAVEFORM_BARS.map((bar) => (
            <div
              key={bar.id}
              className="w-1 rounded-sm bg-white"
              style={{
                height: bar.h,
                opacity: bar.dim ? 0.67 : 1,
              }}
            />
          ))}
        </div>
        <span className="text-xs font-medium text-white/80">{duration}</span>
      </div>
    </div>
  );
}

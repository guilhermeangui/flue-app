"use client";

import { Mic, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

function formatVoiceDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

interface VoiceMessageProps {
  voiceUrl?: string;
  durationSeconds?: number;
}

export function VoiceMessage({
  voiceUrl,
  durationSeconds = 3,
}: VoiceMessageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const updateProgress = () => {
    const audio = audioRef.current;
    if (audio && !audio.paused) {
      setProgress(audio.currentTime / (audio.duration || 1));
      setCurrentTime(Math.floor(audio.currentTime));
      animFrameRef.current = requestAnimationFrame(updateProgress);
    }
  };

  const togglePlayback = () => {
    if (!voiceUrl) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(voiceUrl);
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
      };
    }

    if (isPlaying) {
      audioRef.current.pause();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      animFrameRef.current = requestAnimationFrame(updateProgress);
      setIsPlaying(true);
    }
  };

  const displayTime = isPlaying ? currentTime : durationSeconds;

  return (
    <div className="flex justify-end">
      <div className="flex w-[240px] flex-col gap-2 rounded-[20px] rounded-br-[4px] bg-primary px-3.5 py-3">
        <div className="flex items-center gap-2">
          {voiceUrl ? (
            <button
              type="button"
              onClick={togglePlayback}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 fill-white text-white" />
              ) : (
                <Play className="h-4 w-4 fill-white text-white" />
              )}
            </button>
          ) : (
            <Mic className="h-4 w-4 text-white" />
          )}
          <div className="flex flex-1 flex-col gap-1.5">
            <div className="flex h-8 items-end gap-[3px]">
              {WAVEFORM_BARS.map((bar, i) => {
                const barProgress = i / WAVEFORM_BARS.length;
                const isActive = barProgress <= progress;
                return (
                  <div
                    key={bar.id}
                    className="w-1 rounded-sm transition-opacity duration-150"
                    style={{
                      height: bar.h,
                      backgroundColor: "white",
                      opacity: isActive ? 1 : bar.dim ? 0.35 : 0.55,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <span className="text-xs font-medium text-white/80">
          {formatVoiceDuration(displayTime)}
        </span>
      </div>
    </div>
  );
}

"use client";

import { Mic, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { loadAudio } from "@/lib/audio-storage";
import { computeWaveform } from "@/lib/waveform";

const PLAYBACK_SPEEDS = [1, 1.5, 2] as const;
const WAVEFORM_BUCKETS = 40;
const BAR_MAX_HEIGHT = 28;
const BAR_MIN_HEIGHT = 2;

function formatVoiceDuration(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function formatSpeed(speed: number): string {
  return Number.isInteger(speed) ? `${speed}x` : `${speed}x`;
}

interface VoiceMessageProps {
  voiceLocalId?: string;
  durationSeconds?: number;
}

export function VoiceMessage({
  voiceLocalId,
  durationSeconds = 3,
}: VoiceMessageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioAvailable, setAudioAvailable] = useState<boolean | null>(null);
  const [peaks, setPeaks] = useState<number[]>([]);
  const [speed, setSpeed] = useState<number>(PLAYBACK_SPEEDS[0]);
  const [isScrubbing, setIsScrubbing] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animFrameRef = useRef<number>(0);
  const waveformRef = useRef<HTMLButtonElement | null>(null);
  const scrubbingRef = useRef(false);
  const wasPlayingRef = useRef(false);

  // Load blob from IndexedDB on mount (or when id changes).
  useEffect(() => {
    if (!voiceLocalId) {
      setAudioAvailable(false);
      return;
    }
    let objectUrl: string | null = null;
    let cancelled = false;

    loadAudio(voiceLocalId)
      .then(async (blob) => {
        if (cancelled) return;
        if (!blob) {
          setAudioAvailable(false);
          return;
        }
        objectUrl = URL.createObjectURL(blob);
        setAudioUrl(objectUrl);
        setAudioAvailable(true);
        // Compute waveform in background — don't block UI.
        const p = await computeWaveform(blob, WAVEFORM_BUCKETS);
        if (!cancelled) setPeaks(p);
      })
      .catch(() => {
        if (!cancelled) setAudioAvailable(false);
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [voiceLocalId]);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // MediaRecorder WebM files often report audio.duration === Infinity.
  // Fall back to the recorded durationSeconds prop in that case.
  const getSafeDuration = useCallback((): number => {
    const audio = audioRef.current;
    const d = audio?.duration;
    if (typeof d === "number" && Number.isFinite(d) && d > 0) return d;
    return durationSeconds > 0 ? durationSeconds : 1;
  }, [durationSeconds]);

  const updateProgress = useCallback(() => {
    const audio = audioRef.current;
    if (audio && !audio.paused && !scrubbingRef.current) {
      const dur = getSafeDuration();
      setProgress(Math.min(1, audio.currentTime / dur));
      setCurrentTime(audio.currentTime);
      animFrameRef.current = requestAnimationFrame(updateProgress);
    }
  }, [getSafeDuration]);

  const ensureAudio = useCallback((): HTMLAudioElement | null => {
    if (!audioUrl) return null;
    if (!audioRef.current) {
      const el = new Audio(audioUrl);
      el.onended = () => {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
      };
      audioRef.current = el;
    }
    audioRef.current.playbackRate = speed;
    return audioRef.current;
  }, [audioUrl, speed]);

  const togglePlayback = useCallback(() => {
    const audio = ensureAudio();
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      setIsPlaying(false);
    } else {
      audio.playbackRate = speed;
      audio.play();
      animFrameRef.current = requestAnimationFrame(updateProgress);
      setIsPlaying(true);
    }
  }, [ensureAudio, isPlaying, speed, updateProgress]);

  const toggleSpeed = useCallback(() => {
    const idx = PLAYBACK_SPEEDS.indexOf(
      speed as (typeof PLAYBACK_SPEEDS)[number],
    );
    const next = PLAYBACK_SPEEDS[(idx + 1) % PLAYBACK_SPEEDS.length];
    setSpeed(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  }, [speed]);

  const applySeekFromClientX = useCallback(
    (clientX: number, commit: boolean) => {
      const el = waveformRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const pct = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      setProgress(pct);
      const dur = getSafeDuration();
      const target = pct * dur;
      setCurrentTime(target);
      const audio = audioRef.current;
      if (commit && audio && Number.isFinite(target)) {
        try {
          audio.currentTime = target;
        } catch {
          // Some browsers throw if metadata isn't ready yet — ignore.
        }
      }
    },
    [getSafeDuration],
  );

  // Global pointer listeners while scrubbing.
  useEffect(() => {
    if (!isScrubbing) return;

    const onMove = (e: PointerEvent) => {
      applySeekFromClientX(e.clientX, false);
    };
    const onUp = (e: PointerEvent) => {
      applySeekFromClientX(e.clientX, true);
      scrubbingRef.current = false;
      setIsScrubbing(false);
      // Resume playback if it was playing before scrub.
      if (wasPlayingRef.current) {
        const audio = audioRef.current;
        if (audio) {
          audio.playbackRate = speed;
          audio.play();
          animFrameRef.current = requestAnimationFrame(updateProgress);
          setIsPlaying(true);
        }
      }
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [isScrubbing, applySeekFromClientX, speed, updateProgress]);

  const handleWaveformPointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (!audioAvailable) return;
      // Ensure the audio element exists so seeking works.
      ensureAudio();
      wasPlayingRef.current = isPlaying;
      if (isPlaying && audioRef.current) {
        audioRef.current.pause();
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        setIsPlaying(false);
      }
      scrubbingRef.current = true;
      setIsScrubbing(true);
      applySeekFromClientX(e.clientX, false);
    },
    [audioAvailable, ensureAudio, isPlaying, applySeekFromClientX],
  );

  const displayTime = isPlaying || isScrubbing ? currentTime : durationSeconds;
  const canPlay = audioAvailable === true && !!audioUrl;

  // Bars to render: real peaks if available, otherwise flat placeholder.
  const bars =
    peaks.length > 0
      ? peaks
      : Array.from({ length: WAVEFORM_BUCKETS }, () => 0);

  return (
    <div className="flex justify-end">
      <div className="flex w-[240px] flex-col gap-2 rounded-[20px] rounded-br-[4px] bg-primary px-3.5 py-3">
        <div className="flex items-center gap-2">
          {canPlay ? (
            <button
              type="button"
              onClick={togglePlayback}
              aria-label={isPlaying ? "Pause audio" : "Play audio"}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 fill-white text-white" />
              ) : (
                <Play className="h-4 w-4 fill-white text-white" />
              )}
            </button>
          ) : (
            <Mic className="h-4 w-4 shrink-0 text-white" />
          )}
          <button
            ref={waveformRef}
            type="button"
            disabled={!canPlay}
            onPointerDown={handleWaveformPointerDown}
            aria-label="Seek audio"
            className="flex h-8 min-w-0 flex-1 items-center gap-px touch-none disabled:cursor-default"
            style={{ cursor: canPlay ? "pointer" : "default" }}
          >
            {bars.map((peak, i) => {
              const barProgress = (i + 0.5) / bars.length;
              const isActive = barProgress <= progress;
              const h =
                peaks.length > 0
                  ? Math.max(BAR_MIN_HEIGHT, peak * BAR_MAX_HEIGHT)
                  : 6;
              return (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: bars are positional
                  key={i}
                  className="min-w-0 flex-1 rounded-sm transition-opacity duration-150"
                  style={{
                    height: `${h}px`,
                    backgroundColor: "white",
                    opacity: isActive ? 1 : 0.4,
                  }}
                />
              );
            })}
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-white/80">
            {formatVoiceDuration(displayTime)}
          </span>
          {canPlay ? (
            <button
              type="button"
              onClick={toggleSpeed}
              aria-label={`Playback speed: ${formatSpeed(speed)}`}
              className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold text-white"
            >
              {formatSpeed(speed)}
            </button>
          ) : audioAvailable === false ? (
            <span className="text-[10px] font-medium text-white/60">
              áudio indisponível neste dispositivo
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

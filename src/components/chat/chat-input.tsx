"use client";

import { Mic, Paperclip, Send, Square } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { t as tFn } from "@/i18n";
import { useI18n } from "@/i18n/context";
import { MAX_VOICE_SECONDS } from "@/lib/constants";

/**
 * Produce an AI-optimized version of a recorded blob.
 *
 * Downmixes to mono and resamples to 16 kHz (Whisper's native rate), then
 * encodes as 16-bit PCM WAV. Unlike the previous pipeline, there is NO
 * time-stretching — acceleration was the main cause of pronunciation loss.
 * The resulting file is compact enough (~32 KB/s) to send over a Server
 * Action while still preserving phoneme fidelity for transcription.
 */
async function compressForAi(blob: Blob): Promise<Blob> {
  try {
    const audioCtx = new AudioContext();
    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

    const TARGET_SAMPLE_RATE = 16000;
    const duration = audioBuffer.duration;
    const offlineCtx = new OfflineAudioContext(
      1, // mono
      Math.ceil(TARGET_SAMPLE_RATE * duration),
      TARGET_SAMPLE_RATE,
    );

    const source = offlineCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offlineCtx.destination);
    source.start();

    const rendered = await offlineCtx.startRendering();
    await audioCtx.close();

    const wavBuffer = encodeWav(rendered);
    return new Blob([wavBuffer], { type: "audio/wav" });
  } catch {
    // Fallback: return original blob if processing fails
    return blob;
  }
}

function encodeWav(buffer: AudioBuffer): ArrayBuffer {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitsPerSample = 16;
  const samples = buffer.getChannelData(0);

  const dataLength = samples.length * (bitsPerSample / 8);
  const wavBuffer = new ArrayBuffer(44 + dataLength);
  const view = new DataView(wavBuffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataLength, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * (bitsPerSample / 8), true);
  view.setUint16(32, numChannels * (bitsPerSample / 8), true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataLength, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }

  return wavBuffer;
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

interface ChatInputProps {
  disabled?: boolean;
  placeholder?: string;
  onSend?: (text: string) => void;
  onSendVoice?: (rawBlob: Blob, aiBlob: Blob, durationSeconds: number) => void;
  remaining?: number;
  limit?: number;
}

export function ChatInput({
  disabled,
  placeholder,
  onSend,
  onSendVoice,
  remaining,
  limit,
}: ChatInputProps) {
  const { t: dict } = useI18n();
  const resolvedPlaceholder = placeholder ?? dict.typeOrHoldMic;
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoStopRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef(0);

  const hasText = text.trim().length > 0;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && hasText) {
      e.preventDefault();
      onSend?.(text.trim());
      setText("");
    }
  };

  const handleSendClick = () => {
    if (hasText) {
      onSend?.(text.trim());
      setText("");
    }
  };

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (autoStopRef.current) {
      clearTimeout(autoStopRef.current);
      autoStopRef.current = null;
    }
    setIsRecording(false);
    setRecordingTime(0);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (autoStopRef.current) clearTimeout(autoStopRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];

      // opus/webm at 64 kbps mono — good quality for voice playback
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 64000,
      });

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        for (const track of stream.getTracks()) track.stop();
        const durationSeconds = Math.round(
          (Date.now() - startTimeRef.current) / 1000,
        );
        if (chunksRef.current.length > 0 && durationSeconds >= 1) {
          // Raw blob — saved to IndexedDB for playback (preserves full quality)
          const rawBlob = new Blob(chunksRef.current, { type: mimeType });
          // Optimized blob — sent to Whisper (mono 16 kHz WAV, no acceleration)
          const aiBlob = await compressForAi(rawBlob);
          onSendVoice?.(rawBlob, aiBlob, durationSeconds);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      startTimeRef.current = Date.now();
      mediaRecorder.start(250);
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingTime(
          Math.round((Date.now() - startTimeRef.current) / 1000),
        );
      }, 1000);

      // Auto-stop at MAX_VOICE_SECONDS
      autoStopRef.current = setTimeout(() => {
        stopRecording();
      }, MAX_VOICE_SECONDS * 1000);
    } catch {
      // Microphone permission denied or not available
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const maxTimeLabel = formatTime(MAX_VOICE_SECONDS);
  const progressPct = Math.min(100, (recordingTime / MAX_VOICE_SECONDS) * 100);
  const nearLimit = MAX_VOICE_SECONDS - recordingTime <= 15;

  const showUsage = remaining != null && limit != null;
  const usageLow = showUsage && remaining <= 3;

  return (
    <div className="flex flex-col gap-1.5 border-t border-surface bg-white px-4 py-4">
      <div className="flex items-center gap-2.5">
        {isRecording ? (
          <div className="flex h-11 flex-1 flex-col justify-center gap-1.5 rounded-[22px] bg-red-50 px-4">
            <div className="flex items-center gap-2.5">
              <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-error" />
              <span
                className={`flex-1 text-sm font-medium ${
                  nearLimit ? "text-error" : "text-error/80"
                }`}
              >
                {tFn(dict.recording, {
                  time: formatTime(recordingTime),
                  max: maxTimeLabel,
                })}
              </span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-red-100">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  nearLimit ? "bg-error" : "bg-error/60"
                }`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center gap-2 rounded-[22px] bg-surface px-4">
            <Paperclip className="h-[18px] w-[18px] text-text-muted" />
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              placeholder={resolvedPlaceholder}
              className="h-11 flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted disabled:cursor-not-allowed"
            />
          </div>
        )}
        <button
          type="button"
          disabled={disabled}
          onClick={hasText ? handleSendClick : handleMicClick}
          className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[26px] transition-colors ${
            disabled
              ? "bg-[#D4D4D8]"
              : isRecording
                ? "animate-recording-pulse bg-error"
                : "bg-primary shadow-[0_4px_12px_#8B5CF640]"
          }`}
        >
          {isRecording ? (
            <Square className="h-5 w-5 fill-white text-white" />
          ) : hasText ? (
            <Send className="h-[22px] w-[22px] text-white" />
          ) : (
            <Mic className="h-[22px] w-[22px] text-white" />
          )}
        </button>
      </div>
      {showUsage && (
        <p
          className={`text-center text-[11px] ${
            usageLow ? "font-medium text-warning" : "text-text-muted"
          }`}
        >
          {tFn(dict.messagesRemaining, {
            remaining: remaining ?? 0,
            limit: limit ?? 0,
          })}
        </p>
      )}
    </div>
  );
}

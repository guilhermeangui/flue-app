"use client";

import { Mic, Paperclip, Send, Square } from "lucide-react";
import { useCallback, useRef, useState } from "react";

const AUDIO_SPEED_FACTOR = 1.3;

/**
 * Accelerate an audio blob by AUDIO_SPEED_FACTOR using Web Audio API.
 * This reduces audio duration (and therefore API cost) when sent for transcription.
 */
async function accelerateAudio(blob: Blob): Promise<Blob> {
  try {
    const audioCtx = new AudioContext();
    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

    const duration = audioBuffer.duration / AUDIO_SPEED_FACTOR;
    const offlineCtx = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      Math.ceil(audioBuffer.sampleRate * duration),
      audioBuffer.sampleRate,
    );

    const source = offlineCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.playbackRate.value = AUDIO_SPEED_FACTOR;
    source.connect(offlineCtx.destination);
    source.start();

    const rendered = await offlineCtx.startRendering();
    await audioCtx.close();

    // Encode to WAV (universally supported, no codec dependency)
    const wavBuffer = encodeWav(rendered);
    return new Blob([wavBuffer], { type: "audio/wav" });
  } catch {
    // Fallback: return original blob if acceleration fails
    return blob;
  }
}

function encodeWav(buffer: AudioBuffer): ArrayBuffer {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitsPerSample = 16;

  const samples =
    numChannels === 2
      ? interleave(buffer.getChannelData(0), buffer.getChannelData(1))
      : buffer.getChannelData(0);

  const dataLength = samples.length * (bitsPerSample / 8);
  const wavBuffer = new ArrayBuffer(44 + dataLength);
  const view = new DataView(wavBuffer);

  // WAV header
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

  // PCM samples
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

function interleave(left: Float32Array, right: Float32Array): Float32Array {
  const result = new Float32Array(left.length + right.length);
  for (let i = 0; i < left.length; i++) {
    result[i * 2] = left[i];
    result[i * 2 + 1] = right[i];
  }
  return result;
}

interface ChatInputProps {
  disabled?: boolean;
  placeholder?: string;
  onSend?: (text: string) => void;
  onSendVoice?: (blob: Blob, durationSeconds: number) => void;
  remaining?: number;
  limit?: number;
}

export function ChatInput({
  disabled,
  placeholder = "Type or hold mic...",
  onSend,
  onSendVoice,
  remaining,
  limit,
}: ChatInputProps) {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
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
    setIsRecording(false);
    setRecordingTime(0);
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];

      // Use webm/opus for compression — good quality at low bitrate
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 32000, // 32kbps for compression
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
          const originalBlob = new Blob(chunksRef.current, { type: mimeType });
          // Accelerate audio to reduce transcription cost
          const acceleratedBlob = await accelerateAudio(originalBlob);
          onSendVoice?.(acceleratedBlob, durationSeconds);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      startTimeRef.current = Date.now();
      mediaRecorder.start(250); // Collect chunks every 250ms
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingTime(
          Math.round((Date.now() - startTimeRef.current) / 1000),
        );
      }, 1000);
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

  const showUsage = remaining != null && limit != null;
  const usageLow = showUsage && remaining <= 3;

  return (
    <div className="flex flex-col gap-1.5 border-t border-surface bg-white px-4 py-4">
      <div className="flex items-center gap-2.5">
        {isRecording ? (
          <div className="flex flex-1 items-center gap-3 rounded-[22px] bg-red-50 px-4">
            <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-error" />
            <span className="h-11 flex-1 content-center text-sm font-medium text-error">
              Recording... {formatTime(recordingTime)}
            </span>
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
              placeholder={placeholder}
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
          {remaining}/{limit} messages remaining today
        </p>
      )}
    </div>
  );
}

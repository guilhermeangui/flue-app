/**
 * Decode an audio blob and compute a normalized peak waveform.
 *
 * Returns an array of `buckets` floats in [0, 1], where each value represents
 * the peak amplitude of the corresponding slice of the audio. Returns an
 * empty array on any decoding error — callers should render a placeholder.
 */
export async function computeWaveform(
  blob: Blob,
  buckets = 40,
): Promise<number[]> {
  if (typeof window === "undefined") return [];

  try {
    const arrayBuffer = await blob.arrayBuffer();
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new AudioCtx();
    let audioBuffer: AudioBuffer;
    try {
      audioBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0));
    } finally {
      // Close the context to release resources (some browsers require this).
      if (typeof ctx.close === "function") ctx.close();
    }

    const channel = audioBuffer.getChannelData(0);
    const bucketSize = Math.max(1, Math.floor(channel.length / buckets));
    const peaks: number[] = new Array(buckets).fill(0);

    for (let i = 0; i < buckets; i++) {
      const start = i * bucketSize;
      const end = Math.min(start + bucketSize, channel.length);
      let peak = 0;
      for (let j = start; j < end; j++) {
        const v = Math.abs(channel[j]);
        if (v > peak) peak = v;
      }
      peaks[i] = peak;
    }

    const max = Math.max(...peaks);
    if (max === 0) return peaks;
    return peaks.map((p) => p / max);
  } catch {
    return [];
  }
}

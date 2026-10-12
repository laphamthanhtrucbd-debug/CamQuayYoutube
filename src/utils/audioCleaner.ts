/**
 * Professional zero-latency audio cleaner:
 * Removes static, crackling ("rè rè", "giật giật"), and low-frequency rumble using standard Web Audio filters 
 * and a Dynamics Compressor, ensuring pristine, distortion-free vocal clarity without artificial gain clipping.
 */
export function cleanAudioStream(rawStream: MediaStream): MediaStream {
  const tracks = rawStream.getAudioTracks();
  if (tracks.length === 0) return rawStream;

  try {
    const AudioCtxClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    
    const audioCtx = new AudioCtxClass();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }

    const source = audioCtx.createMediaStreamSource(rawStream);

    // 1. Highpass filter (80Hz) to remove room rumble and low-freq mic thumps (which cause "rè")
    const highpass = audioCtx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 80;

    // 2. Lowpass filter (10kHz) to remove high-frequency static and hiss
    const lowpass = audioCtx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 10000;

    // 3. Dynamics Compressor to prevent clipping, smooth out volume spikes, and eliminate crackling ("rè rè", "giật giật")
    const compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.value = -24; // dB
    compressor.knee.value = 30; // dB
    compressor.ratio.value = 4; // compression ratio
    compressor.attack.value = 0.003; // 3ms fast attack to catch crackle peaks
    compressor.release.value = 0.25; // 250ms smooth release

    const destination = audioCtx.createMediaStreamDestination();

    source.connect(highpass);
    highpass.connect(lowpass);
    lowpass.connect(compressor);
    compressor.connect(destination);

    return destination.stream;
  } catch {
    return rawStream;
  }
}

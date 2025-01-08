function generateSquareWave(freq, sampleRate, duration) {
  const output = new Float32Array(duration * sampleRate);
  const period = (1 / freq) * sampleRate;
  for (let i = 0; i < output.length; i++) {
    const point = i % period;
    if (point > (period / 2)) {
      output[i] = -1;
    } else {
      output[i] = 1;
    }
  }
  console.error(sampleRate, output)
  return output;
}

function playSound() {
  const ctx = new AudioContext();
  const duration = 1; // in seconds
  const sampleRate = ctx.sampleRate; // audio context's sample rate

  // Generate the square wave data
  const data = generateSquareWave(1000, sampleRate, duration);

  // Create an AudioBuffer
  const audioBuffer = ctx.createBuffer(1, data.length, sampleRate);

  // Fill the buffer with the square wave data
  const channelData = audioBuffer.getChannelData(0);
  channelData.set(data);

  // Create an AudioBufferSourceNode
  const source = ctx.createBufferSource();
  source.buffer = audioBuffer;

  // Connect the source to the context's destination
  source.connect(ctx.destination);

  // Start playback
  source.start();
}
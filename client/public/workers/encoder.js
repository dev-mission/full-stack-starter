import { lamejs } from '/workers/lame.min.js';
class EncoderProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    this.encoder = new lamejs.Mp3Encoder(1, options?.processorOptions?.sampleRate ?? 44100, 128);
    this.buffer = [];
    this.port.onmessage = (event) => this.onMessage(event);
  }

  onMessage(event) {
    if (event.data === 'finish') {
      this.buffer.push(this.encoder.flush());
      this.port.postMessage(
        this.buffer,
        this.buffer.map((array) => array.buffer)
      );
      this.buffer = [];
    }
  }

  process(inputs, outputs) {
    const [[input]] = inputs;
    const output = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]));
      output[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    const samplesPerFrame = 1152;
    let samplesRemaining = output.length;
    for (let i = 0; samplesRemaining > 0; i += samplesPerFrame) {
      const frame = output.subarray(i, i + samplesPerFrame);
      const result = this.encoder.encodeBuffer(frame);
      this.buffer.push(result);
      samplesRemaining -= samplesPerFrame;
    }
    return true;
  }
}
registerProcessor('encoder-processor', EncoderProcessor);

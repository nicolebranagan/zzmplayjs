// Programmable Interrupt Timer frequency, in Hz.
const PIT_FREQUENCY = 1193181.66;
const SIXTEENTH_DURATION = 65535 / PIT_FREQUENCY;
// If set to true, frequency values are truncated/rounded as in ZZT.
const EMULATE_FREQUENCY_ROUNDING = true;

function f32ArrayConcat(array1, array2) {
  const result = new Float32Array(array1.length + array2.length);
  result.set(array1, 0);
  result.set(array2, array1.length);
  return result;
}

function generateSquareWave(freq, sampleRate, duration) {
  if (EMULATE_FREQUENCY_ROUNDING) {
    // Apply frequency rounding from Turbo Pascal Trunc().
    freq = Math.floor(freq);

    // Apply frequency rounding from Turbo Pascal Sound(),
    // which calculates a divisor for the PIT.
    freq = PIT_FREQUENCY / Math.floor(PIT_FREQUENCY / freq);
  }

  const output = new Float32Array(Math.floor(duration * sampleRate));
  const period = (1 / freq) * sampleRate;
  for (let i = 0; i < output.length; i++) {
    const point = i % period;
    if (point >= (period / 2)) {
      output[i] = -1;
    } else {
      output[i] = 1;
    }
  }
  return output;
}

function generateRest(sampleRate, duration) {
  const output = new Float32Array(Math.floor(duration * sampleRate));
  for (let i = 0; i < output.length; i++) {
    output[i] = 0;
  }
  return output;
}

// Translated from Turbo Pascal
function initSoundFreqTable() {
  let soundFreqTable = [];
  const freqC1 = 32;
  const ln2 = Math.LN2;
  const noteStep = Math.exp(ln2 / 12);
  for (let octave = 1; octave <= 15; octave++) {
    let noteBase = Math.exp(octave*ln2) * freqC1;
    for (let note = 0; note <= 11; note++) {
      soundFreqTable[octave * 16 + note] = noteBase;
      noteBase *= noteStep;
    }
  }
  return soundFreqTable;
}

const soundFreqTable = initSoundFreqTable();

const DRUM_NOTE_LENGTH = 1 / 1000;
function generateDrum(drum, sampleRate, duration) {
  let result = new Float32Array(0);
  for (let i = 0; i < drum.length; i++) {
    result = f32ArrayConcat(result, generateSquareWave(drum[i], sampleRate, DRUM_NOTE_LENGTH));
  }

  // Extend to length of current note
  if (result.length > duration * sampleRate) {
    return result;
  }
  const finalResult = new Float32Array(duration * sampleRate);
  finalResult.set(result, 0);
  return finalResult;
}

// Extracted from a modified ZZT executable
const soundDrumTable = [
  [3200],
  [1100,  1200,   1300,   1400,   1500,   1600,   1700,   1800,   1900,   2000,   2100,   2200,   2300,   2400],
  [4800,  4800,   8000,   1600,   4800,   4800,   8000,   1600,   4800,   4800,   8000,   1600,   4800,   4800],
  [],
  [500,   2556,   1929,   3776,   3386,   4517,   1385,   1103,   4895,   3396,   874,    1616,   5124,   606],
  [1600,  1514,   1600,   821,    1600,   1715,   1600,   911,    1600,   1968,   1600,   1490,   1600,   1722],
  [2200,  1760,   1760,   1320,   2640,   880,    2200,   1760,   1760,   1320,   2640,   880,    2200,   1760],
  [688,   676,    664,    652,    640,    628,    616,    604,    592,    580,    568,    556,    544,    532],
  [1207,  1224,   1163,   1127,   1159,   1236,   1269,   1314,   1127,   1224,   1320,   1332,   1257,   1327],
  [378,   331,    316,    230,    224,    384,    480,    320,    358,    412,    376,    621,    554,    426]
];

function durationToTime(duration) {
  // ZZT stores the note duration as a byte.
  duration = duration % 256;
  if (duration == 0) {
      duration = 256;
  }
  return SIXTEENTH_DURATION * duration;
}

function parseSound(input, sampleRate) {
  let output = new Float32Array(0);
  let noteOctave = 3;
  let noteDuration = 1;

  while (input.length > 0) {
    let noteTone = -1;
    const char = input[0].toUpperCase();
    switch (char) {
      case 'T': {
        noteDuration = 1;
        break;
      }
      case 'S': {
        noteDuration = 2;
        break;
      }
      case 'I': {
        noteDuration = 4;
        break;
      }
      case 'Q': {
        noteDuration = 8;
        break;
      }
      case 'H': {
        noteDuration = 16;
        break;
      }
      case 'W': {
        noteDuration = 32;
        break;
      }
      case ".": {
        noteDuration = Math.floor(noteDuration * 3 / 2);
        break;
      }
      case '3': {
        noteDuration = Math.floor(noteDuration / 3);
        break;
      }
      case '+': {
        if (noteOctave < 6) {
          noteOctave = noteOctave + 1;
        }
        break;
      }
      case '-': {
        if (noteOctave > 1) {
          noteOctave = noteOctave - 1;
        }
        break;
      }
      case 'C': {
        noteTone = 0;
        break;
      }
      case 'D': {
        noteTone = 2;
        break;
      }
      case 'E': {
        noteTone = 4;
        break;
      }
      case 'F': {
        noteTone = 5;
        break;
      }
      case 'G': {
        noteTone = 7;
        break;
      }
      case 'A': {
        noteTone = 9;
        break;
      }
      case 'B': {
        noteTone = 11;
        break;
      }
      case 'X': {
        output = f32ArrayConcat(output, generateRest(sampleRate, durationToTime(noteDuration)))
        break;
      }
      case '0': {
        output = f32ArrayConcat(output, generateDrum(soundDrumTable[0], sampleRate, durationToTime(noteDuration)))
        break;
      }
      case '1': {
        output = f32ArrayConcat(output, generateDrum(soundDrumTable[1], sampleRate, durationToTime(noteDuration)))
        break;
      }
      case '2': {
        output = f32ArrayConcat(output, generateDrum(soundDrumTable[2], sampleRate, durationToTime(noteDuration)))
        break;
      }
      case '4': {
        output = f32ArrayConcat(output, generateDrum(soundDrumTable[4], sampleRate, durationToTime(noteDuration)))
        break;
      }
      case '5': {
        output = f32ArrayConcat(output, generateDrum(soundDrumTable[5], sampleRate, durationToTime(noteDuration)))
        break;
      }
      case '6': {
        output = f32ArrayConcat(output, generateDrum(soundDrumTable[6], sampleRate, durationToTime(noteDuration)))
        break;
      }
      case '7': {
        output = f32ArrayConcat(output, generateDrum(soundDrumTable[7], sampleRate, durationToTime(noteDuration)))
        break;
      }
      case '8': {
        output = f32ArrayConcat(output, generateDrum(soundDrumTable[8], sampleRate, durationToTime(noteDuration)))
        break;
      }
      case '9': {
        output = f32ArrayConcat(output, generateDrum(soundDrumTable[9], sampleRate, durationToTime(noteDuration)))
        break;
      }
    }

    if (noteTone !== -1) {
      if (input[1] === '!') {
        noteTone = noteTone - 1;
        input = input.substring(1);
      } else if (input[1] === '#') {
        noteTone = noteTone + 1;
        input = input.substring(1);
      }
      output = f32ArrayConcat(output, generateSquareWave(soundFreqTable[noteOctave * 16 + noteTone], sampleRate, durationToTime(noteDuration)));
    }

    input = input.substring(1);
  }

  return output;
}

let activeSource = null;

function playZzmAudio(zztAudio) {
  if (activeSource) {
    activeSource.stop();
  }
  const ctx = new AudioContext();
  const sampleRate = ctx.sampleRate; // audio context's sample rate

  // Generate the square wave data
  const data = parseSound(zztAudio, sampleRate);

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
  activeSource = source;
}

function stopZzmAudio() {
  if (activeSource) {
    activeSource.stop();
  }
}

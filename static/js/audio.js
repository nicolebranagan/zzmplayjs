const SIXTEENTH_DURATION = 55 / 1000;

function f32ArrayConcat(array1, array2) {
  const result = new Float32Array(array1.length + array2.length);
  result.set(array1, 0);
  result.set(array2, array1.length);
  return result;
}

function generateSquareWave(freq, sampleRate, duration) {
  const output = new Float32Array(Math.floor(duration * sampleRate));
  const period = (1 / freq) * sampleRate;
  for (let i = 0; i < output.length; i++) {
    const point = i % period;
    if (point > (period / 2)) {
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
      soundFreqTable[octave * 16 + note] = Math.floor(noteBase);
      noteBase *= noteStep;
    }
  }
  return soundFreqTable;
}

const soundFreqTable = initSoundFreqTable();

const DRUM_NOTE_LENGTH = 1 / 1000;
function generateDrum(drum, sampleRate) {
  let result = new Float32Array(0);
  for (let i = 0; i < drum.length; i++) {
    result = f32ArrayConcat(result, generateSquareWave(drum[i], sampleRate, DRUM_NOTE_LENGTH));
  }
  return result;
}

// Translated from TurboPascal
function initSoundDrumTable() {
  const SoundDrumTable = Array.from({ length: 10 }, () => []);

  SoundDrumTable[0][0] = 3200;

  for (let i = 0; i < 14; i++) {
    SoundDrumTable[1][i] = (i + 1) * 100 + 1000;
  }

  for (let i = 0; i < 16; i++) {
    SoundDrumTable[2][i] = (i % 2) * 1600 + 1600 + (i % 4) * 1600;
  }

  for (let i = 0; i < 14; i++) {
    SoundDrumTable[4][i] = Math.floor(Math.random() * 5000) + 500;
  }

  for (let i = 0; i < 8; i++) {
    SoundDrumTable[5][i * 2] = 1600;
    SoundDrumTable[5][i * 2 + 1] = Math.floor(Math.random() * 1600) + 800;
  }

  for (let i = 0; i < 14; i++) {
    SoundDrumTable[6][i] = ((i % 2) * 880) + 880 + ((i % 3) * 440);
  }

  for (let i = 0; i < 14; i++) {
    SoundDrumTable[7][i] = 700 - ((i + 1) * 12);
  }

  for (let i = 0; i < 14; i++) {
    SoundDrumTable[8][i] = ((i + 1) * 20 + 1200) - Math.floor(Math.random() * ((i + 1) * 40));
  }

  for (let i = 0; i < 14; i++) {
    SoundDrumTable[9][i] = Math.floor(Math.random() * 440) + 220;
  }

  return SoundDrumTable;
}

const soundDrumTable = initSoundDrumTable();

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
        output = f32ArrayConcat(output, generateRest(sampleRate, SIXTEENTH_DURATION * noteDuration))
        break;
      }
      case '0': {
        output = f32ArrayConcat(output, generateDrum(soundDrumTable[0], sampleRate))
        break;
      }
      case '1': {
        output = f32ArrayConcat(output, generateDrum(soundDrumTable[1], sampleRate))
        break;
      }
      case '2': {
        output = f32ArrayConcat(output, generateDrum(soundDrumTable[2], sampleRate))
        break;
      }
      case '4': {
        output = f32ArrayConcat(output, generateDrum(soundDrumTable[4], sampleRate))
        break;
      }
      case '5': {
        output = f32ArrayConcat(output, generateDrum(soundDrumTable[5], sampleRate))
        break;
      }
      case '6': {
        output = f32ArrayConcat(output, generateDrum(soundDrumTable[6], sampleRate))
        break;
      }
      case '7': {
        output = f32ArrayConcat(output, generateDrum(soundDrumTable[7], sampleRate))
        break;
      }
      case '8': {
        output = f32ArrayConcat(output, generateDrum(soundDrumTable[8], sampleRate))
        break;
      }
      case '9': {
        output = f32ArrayConcat(output, generateDrum(soundDrumTable[9], sampleRate))
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
      output = f32ArrayConcat(output, generateSquareWave(soundFreqTable[noteOctave * 16 + noteTone], sampleRate, SIXTEENTH_DURATION * noteDuration));
    }

    input = input.substring(1);
  }

  return output;
}


function playSound() {
  const ctx = new AudioContext();
  const sampleRate = ctx.sampleRate; // audio context's sample rate

  // Generate the square wave data
  const data = parseSound(`sc-g+c-g+c-g+c-g+e!ce!ce!ce!cfcfcfc
sfca!da!dgfe!d
sc-g+c-g+c-g+c-g+e!ce!ce!ce!cfcfcfc
sfca!da!dgfe!d
scxx64x6xxxx64x21xxx64x6xxxx64x21
scxx64x6x6x64x210xxx64x6x6x64x210
scxx64x6xcxx64x6xe!xx64x6xfx6xgx6x
scxx64x6xe!x6x4x6xfx210x10xgx210x00
sc-g+c-g+c-g+c-g+e!ce!ce!ce!cfcfcfc
sfca!da!dgfe!d
sc-g+c-g+c-g+c-g+e!ce!ce!ce!cfcfcfc
sfca!da!dgfe!d
qc`, sampleRate);

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
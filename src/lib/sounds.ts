type SoundType =
  | "kill"
  | "meeting"
  | "vote"
  | "task_complete"
  | "role_reveal"
  | "button_click"
  | "player_join"
  | "player_leave"
  | "sabotage"
  | "victory"
  | "defeat";

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioContext;
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  volume: number = 0.3
) {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch {
    // Audio not available
  }
}

function playSequence(
  notes: Array<{ freq: number; dur: number; delay: number }>,
  type: OscillatorType = "sine",
  volume: number = 0.3
) {
  try {
    const ctx = getAudioContext();

    notes.forEach(({ freq, dur, delay }) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime + delay);

      gainNode.gain.setValueAtTime(volume, ctx.currentTime + delay);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        ctx.currentTime + delay + dur
      );

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(ctx.currentTime + delay);
      oscillator.stop(ctx.currentTime + delay + dur);
    });
  } catch {
    // Audio not available
  }
}

const sounds: Record<SoundType, () => void> = {
  kill: () => {
    playTone(200, 0.15, "sawtooth", 0.4);
    setTimeout(() => playTone(150, 0.2, "sawtooth", 0.3), 100);
    setTimeout(() => playTone(100, 0.3, "sawtooth", 0.2), 200);
  },

  meeting: () => {
    playSequence([
      { freq: 800, dur: 0.1, delay: 0 },
      { freq: 600, dur: 0.1, delay: 0.12 },
      { freq: 800, dur: 0.1, delay: 0.24 },
      { freq: 600, dur: 0.1, delay: 0.36 },
      { freq: 1000, dur: 0.2, delay: 0.48 },
    ], "square", 0.2);
  },

  vote: () => {
    playTone(523, 0.1, "sine", 0.3);
    setTimeout(() => playTone(659, 0.1, "sine", 0.3), 100);
    setTimeout(() => playTone(784, 0.15, "sine", 0.3), 200);
  },

  task_complete: () => {
    playSequence([
      { freq: 523, dur: 0.08, delay: 0 },
      { freq: 659, dur: 0.08, delay: 0.08 },
      { freq: 784, dur: 0.08, delay: 0.16 },
      { freq: 1047, dur: 0.15, delay: 0.24 },
    ], "sine", 0.25);
  },

  role_reveal: () => {
    playSequence([
      { freq: 300, dur: 0.2, delay: 0 },
      { freq: 400, dur: 0.2, delay: 0.25 },
      { freq: 500, dur: 0.2, delay: 0.5 },
      { freq: 700, dur: 0.3, delay: 0.75 },
    ], "triangle", 0.3);
  },

  button_click: () => {
    playTone(800, 0.05, "sine", 0.15);
  },

  player_join: () => {
    playSequence([
      { freq: 440, dur: 0.08, delay: 0 },
      { freq: 554, dur: 0.08, delay: 0.08 },
      { freq: 659, dur: 0.12, delay: 0.16 },
    ], "sine", 0.2);
  },

  player_leave: () => {
    playSequence([
      { freq: 659, dur: 0.08, delay: 0 },
      { freq: 554, dur: 0.08, delay: 0.08 },
      { freq: 440, dur: 0.12, delay: 0.16 },
    ], "sine", 0.2);
  },

  sabotage: () => {
    playSequence([
      { freq: 200, dur: 0.15, delay: 0 },
      { freq: 180, dur: 0.15, delay: 0.1 },
      { freq: 160, dur: 0.15, delay: 0.2 },
      { freq: 140, dur: 0.2, delay: 0.3 },
    ], "sawtooth", 0.25);
  },

  victory: () => {
    playSequence([
      { freq: 523, dur: 0.1, delay: 0 },
      { freq: 659, dur: 0.1, delay: 0.12 },
      { freq: 784, dur: 0.1, delay: 0.24 },
      { freq: 1047, dur: 0.3, delay: 0.36 },
    ], "sine", 0.3);
  },

  defeat: () => {
    playSequence([
      { freq: 400, dur: 0.15, delay: 0 },
      { freq: 350, dur: 0.15, delay: 0.15 },
      { freq: 300, dur: 0.15, delay: 0.3 },
      { freq: 200, dur: 0.4, delay: 0.45 },
    ], "triangle", 0.3);
  },
};

export function playSound(type: SoundType) {
  try {
    sounds[type]();
  } catch {
    // Silently fail if audio not available
  }
}

export function initAudio() {
  try {
    getAudioContext();
  } catch {
    // Audio not available
  }
}

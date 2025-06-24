// Sound URLs from freesound.org and other public sources
export const SOUND_URLS = {
  MOVE: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  CAPTURE: 'https://www.soundjay.com/misc/sounds/fail-buzzer-02.wav',
  CHECK: 'https://www.soundjay.com/misc/sounds/bell-ringing-04.wav',
  GAME_OVER: 'https://www.soundjay.com/misc/sounds/bell-ringing-01.wav',
  CASTLE: 'https://www.soundjay.com/misc/sounds/bell-ringing-03.wav',
  PAWN_MOVE: 'https://www.soundjay.com/misc/sounds/bell-ringing-06.wav',
  KNIGHT_MOVE: 'https://www.soundjay.com/misc/sounds/bell-ringing-07.wav',
  BISHOP_MOVE: 'https://www.soundjay.com/misc/sounds/bell-ringing-08.wav',
  ROOK_MOVE: 'https://www.soundjay.com/misc/sounds/bell-ringing-09.wav',
  QUEEN_MOVE: 'https://www.soundjay.com/misc/sounds/bell-ringing-10.wav',
  KING_MOVE: 'https://www.soundjay.com/misc/sounds/bell-ringing-11.wav',
};

let audioEnabled = true;
let audioContext: AudioContext | null = null;
const audioBufferCache = new Map<string, AudioBuffer>();

// Initialize audio context
const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

// Load and cache audio buffer
const loadAudioBuffer = async (url: string): Promise<AudioBuffer> => {
  if (audioBufferCache.has(url)) {
    return audioBufferCache.get(url)!;
  }

  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await getAudioContext().decodeAudioData(arrayBuffer);
    audioBufferCache.set(url, audioBuffer);
    return audioBuffer;
  } catch (error) {
    console.warn(`Failed to load audio from ${url}:`, error);
    throw error;
  }
};

// Play audio buffer
const playAudioBuffer = (audioBuffer: AudioBuffer, volume: number = 0.3): void => {
  try {
    const context = getAudioContext();
    const source = context.createBufferSource();
    const gainNode = context.createGain();

    source.buffer = audioBuffer;
    source.connect(gainNode);
    gainNode.connect(context.destination);
    
    gainNode.gain.setValueAtTime(volume, context.currentTime);
    source.start(0);
  } catch (error) {
    console.warn('Failed to play audio buffer:', error);
  }
};

// Generate fallback beep sound
const generateBeepSound = (frequency: number, duration: number = 0.1, volume: number = 0.1): void => {
  try {
    const context = getAudioContext();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(volume, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration);
    
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + duration);
  } catch (error) {
    console.warn('Failed to generate beep sound:', error);
  }
};

export const toggleAudio = () => {
  audioEnabled = !audioEnabled;
  return audioEnabled;
};

export const isAudioEnabled = () => audioEnabled;

export const playSound = async (soundType: keyof typeof SOUND_URLS) => {
  if (!audioEnabled) return;
  
  const url = SOUND_URLS[soundType];
  
  try {
    // Try to load and play the actual audio file
    const audioBuffer = await loadAudioBuffer(url);
    playAudioBuffer(audioBuffer);
  } catch (error) {
    // Fallback to generated beep sounds if audio files fail to load
    console.warn(`Falling back to beep sound for ${soundType}`);
    
    const frequencies = {
      MOVE: 800,
      CAPTURE: 400,
      CHECK: 1000,
      GAME_OVER: 600,
      CASTLE: 900,
      PAWN_MOVE: 750,
      KNIGHT_MOVE: 850,
      BISHOP_MOVE: 950,
      ROOK_MOVE: 700,
      QUEEN_MOVE: 1100,
      KING_MOVE: 650,
    };
    
    generateBeepSound(frequencies[soundType]);
  }
};

// Play piece-specific sounds
export const playPieceSound = (pieceType: string, isCapture: boolean = false) => {
  if (isCapture) {
    playSound('CAPTURE');
    return;
  }

  switch (pieceType) {
    case 'pawn':
      playSound('PAWN_MOVE');
      break;
    case 'knight':
      playSound('KNIGHT_MOVE');
      break;
    case 'bishop':
      playSound('BISHOP_MOVE');
      break;
    case 'rook':
      playSound('ROOK_MOVE');
      break;
    case 'queen':
      playSound('QUEEN_MOVE');
      break;
    case 'king':
      playSound('KING_MOVE');
      break;
    default:
      playSound('MOVE');
  }
};

// Preload all audio files for better performance
export const preloadAudioFiles = async (): Promise<void> => {
  if (!audioEnabled) return;
  
  const loadPromises = Object.values(SOUND_URLS).map(async (url) => {
    try {
      await loadAudioBuffer(url);
    } catch (error) {
      console.warn(`Failed to preload audio: ${url}`);
    }
  });
  
  await Promise.allSettled(loadPromises);
};
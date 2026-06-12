// 音效系统 - 使用 Web Audio API，无需外部音频文件

let audioCtx: AudioContext | null = null;
let initialized = false;
let muted = false;

// 必须在用户手势（点击）中调用，否则浏览器会阻止
export function initSound(): void {
  if (initialized) return;
  try {
    audioCtx = new (window as any).AudioContext || new (window as any).webkitAudioContext();
    audioCtx!.resume();
    initialized = true;
  } catch {
    // 静默失败
  }
}

export function isMuted(): boolean {
  return muted;
}

export function toggleMute(): boolean {
  muted = !muted;
  return muted;
}

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    // 如果还没初始化（比如initSound还没被调用），在这里惰性创建
    try {
      audioCtx = new (window as any).AudioContext || new (window as any).webkitAudioContext();
      audioCtx!.resume();
      initialized = true;
    } catch {
      // 静默失败
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx!;
}

// 播放一个音调
function playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) {
  if (muted) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {
    // 静默失败
  }
}

// 播放音效序列
function playSequence(notes: { freq: number; dur: number; delay: number }[], type: OscillatorType = 'sine') {
  notes.forEach(({ freq, dur, delay }) => {
    setTimeout(() => playTone(freq, dur, type), delay);
  });
}

// ========== 文本语音朗读（Web Speech API） ==========
// 使用浏览器自带的语音合成功能朗读文字内容
// 支持播放、暂停、停止，适合小朋友"听题"和"听解题方法"

let currentUtterance: SpeechSynthesisUtterance | null = null;
let speechSpeaking = false;

export function speak(text: string, options?: { rate?: number; pitch?: number; volume?: number; lang?: string; onEnd?: () => void }): void {
  // 静音则不朗读
  if (muted) return;

  // 浏览器不支持就直接返回
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  // 内容为空不朗读
  if (!text || text.trim().length === 0) return;

  try {
    // 先停止之前正在朗读的内容
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options?.lang || 'zh-CN';      // 默认中文
    utterance.rate = options?.rate ?? 0.95;          // 稍慢一点，适合小朋友听
    utterance.pitch = options?.pitch ?? 1.1;         // 音调稍高，更有亲和力
    utterance.volume = options?.volume ?? 1;         // 音量最大

    // 尝试选择中文语音（如果有）
    const voices = window.speechSynthesis.getVoices();
    const zhVoice = voices.find((v) => v.lang.startsWith('zh'));
    if (zhVoice) utterance.voice = zhVoice;

    utterance.onstart = () => {
      speechSpeaking = true;
    };

    utterance.onend = () => {
      speechSpeaking = false;
      currentUtterance = null;
      if (options?.onEnd) options.onEnd();
    };

    utterance.onerror = () => {
      speechSpeaking = false;
      currentUtterance = null;
    };

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  } catch {
    // 静默失败，不影响主流程
  }
}

// 停止当前正在朗读的语音
export function speakStop(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  speechSpeaking = false;
  currentUtterance = null;
}

// 判断是否正在朗读
export function isSpeaking(): boolean {
  return speechSpeaking;
}

// ========== 继续原来的音效系统 ==========

export const sound = {
  // 点击按钮
  click() {
    playTone(800, 0.08, 'sine', 0.15);
  },

  // 答对 - 欢快上升音
  correct() {
    playSequence([
      { freq: 523, dur: 0.12, delay: 0 },       // C5
      { freq: 659, dur: 0.12, delay: 100 },      // E5
      { freq: 784, dur: 0.25, delay: 200 },      // G5
    ]);
  },

  // 答错 - 低沉提示
  wrong() {
    playTone(330, 0.3, 'sawtooth', 0.15);
  },

  // 连击 - 越来越高的激励音
  combo(count: number) {
    const base = 500 + Math.min(count, 10) * 80;
    playTone(base, 0.15, 'sine', 0.2);
    setTimeout(() => playTone(base * 1.25, 0.15, 'sine', 0.2), 80);
  },

  // 获得星星
  star() {
    playSequence([
      { freq: 784, dur: 0.1, delay: 0 },
      { freq: 988, dur: 0.1, delay: 80 },
      { freq: 1175, dur: 0.3, delay: 160 },
    ]);
  },

  // 段位升级 - 华丽音效
  rankUp() {
    playSequence([
      { freq: 523, dur: 0.15, delay: 0 },
      { freq: 659, dur: 0.15, delay: 120 },
      { freq: 784, dur: 0.15, delay: 240 },
      { freq: 1047, dur: 0.15, delay: 360 },
      { freq: 1319, dur: 0.4, delay: 480 },
    ]);
  },

  // 打卡成功
  checkIn() {
    playSequence([
      { freq: 660, dur: 0.1, delay: 0 },
      { freq: 880, dur: 0.1, delay: 80 },
      { freq: 1100, dur: 0.2, delay: 160 },
    ]);
  },

  // 导航/页面切换
  navigate() {
    playTone(600, 0.06, 'sine', 0.1);
  },
};

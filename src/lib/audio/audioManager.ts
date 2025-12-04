class AudioManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private muted: boolean = false;
  private loops: Map<string, HTMLAudioElement> = new Map();

  constructor() {
    if (typeof window !== 'undefined') {
      this.preloadDefaults();
    }
  }

  private preloadDefaults() {
    // Placeholder paths - ensure these exist in public/sfx/ or update paths
    const defaults: Record<string, string> = {
      'place': '/sfx/place.mp3',
      'delete': '/sfx/delete.mp3',
      'engine': '/sfx/engine_loop.mp3',
      'break': '/sfx/break.mp3',
      'win': '/sfx/win.mp3',
      'click': '/sfx/click.mp3',
      'splash': '/sfx/splash.mp3'
    };
    this.preload(defaults);
  }

  preload(sfxMap: Record<string, string>) {
    Object.entries(sfxMap).forEach(([name, path]) => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      this.sounds.set(name, audio);
    });
  }

  play(name: string, opts?: { loop?: boolean; volume?: number }) {
    if (this.muted) return;
    
    const sound = this.sounds.get(name);
    if (!sound) {
      // Fail silently if asset missing
      // console.warn(`Sound not found: ${name}`);
      return;
    }

    // Clone node for overlapping sounds (except loops)
    if (opts?.loop) {
      if (this.loops.has(name)) return; // Already looping
      sound.loop = true;
      sound.volume = opts.volume ?? 1.0;
      sound.play().catch(() => {});
      this.loops.set(name, sound);
    } else {
      const clone = sound.cloneNode() as HTMLAudioElement;
      clone.volume = opts?.volume ?? 1.0;
      clone.play().catch(() => {});
    }
  }

  stop(name: string) {
    const sound = this.loops.get(name);
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
      this.loops.delete(name);
    }
  }

  setMuted(bool: boolean) {
    this.muted = bool;
    if (bool) {
      this.loops.forEach(s => s.pause());
    } else {
      this.loops.forEach(s => s.play().catch(() => {}));
    }
  }
}

export const audioManager = new AudioManager();
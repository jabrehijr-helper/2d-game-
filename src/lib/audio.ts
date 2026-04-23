class CosmicAudio {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmOsc: OscillatorNode | null = null;
  private bgmGain: GainNode | null = null;

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  setMute(mute: boolean) {
    this.isMuted = mute;
    if (this.bgmGain) {
      this.bgmGain.gain.value = mute ? 0 : 0.05;
    }
  }

  playMerge(tier: number) {
    if (this.isMuted || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    // Higher tier = higher frequency sweep
    const baseFreq = 200 + (tier * 100);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 2, this.ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  playForge() {
    if (this.isMuted || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(50, this.ctx.currentTime + 0.2);
    
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.2);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  startBGM() {
    if (!this.ctx || this.bgmOsc) return;
    
    const now = this.ctx.currentTime;
    
    // "Cold Blue" Frequencies - A Minor 9 chord: A2, E3, B3, C4
    const freqs = [110, 164.81, 246.94, 261.63]; 
    
    this.bgmGain = this.ctx.createGain();
    this.bgmGain.gain.value = 0; // Start at 0 for fade-in
    this.bgmGain.connect(this.ctx.destination);
    
    // Fade in
    this.bgmGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : 0.04, now + 2);

    freqs.forEach((f, i) => {
      const osc = this.ctx!.createOscillator();
      const lfo = this.ctx!.createOscillator();
      const lfoGain = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);
      
      // Much slower LFO for "deep cold" effect
      lfo.frequency.setValueAtTime(0.2 + (i * 0.05), now);
      lfoGain.gain.setValueAtTime(1.5, now);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, now);
      filter.Q.setValueAtTime(1, now);

      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      
      osc.connect(filter);
      filter.connect(this.bgmGain!);
      
      osc.start();
      lfo.start();
    });

    this.bgmOsc = {} as any; 
  }
}

export const audioManager = new CosmicAudio();

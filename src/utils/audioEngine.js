class AudioEngine {
  constructor() {
    this.ctx = null;
    this.analyser = null;
    this.gainNode = null;
    this.bassFilter = null;
    this.trebleFilter = null;
    this.pannerNode = null;
    this.audioSource = null;
    this.micStream = null;
    this.audioElement = new Audio();
    this.audioElement.crossOrigin = "anonymous";
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 256;

    this.gainNode = this.ctx.createGain();
    
    // Bass filter
    this.bassFilter = this.ctx.createBiquadFilter();
    this.bassFilter.type = 'lowshelf';
    this.bassFilter.frequency.value = 200;

    // Treble filter
    this.trebleFilter = this.ctx.createBiquadFilter();
    this.trebleFilter.type = 'highshelf';
    this.trebleFilter.frequency.value = 3000;

    // Stereo Panner
    this.pannerNode = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;

    // Connect audio node chain
    // Source -> Bass -> Treble -> (Panner) -> Gain -> Analyser -> Destination
    if (this.pannerNode) {
      this.bassFilter.connect(this.trebleFilter);
      this.trebleFilter.connect(this.pannerNode);
      this.pannerNode.connect(this.gainNode);
    } else {
      this.bassFilter.connect(this.trebleFilter);
      this.trebleFilter.connect(this.gainNode);
    }

    this.gainNode.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    this.isInitialized = true;
  }

  async loadFile(file) {
    this.init();
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    this.disconnectSources();

    const url = URL.createObjectURL(file);
    this.audioElement.src = url;

    this.audioSource = this.ctx.createMediaElementSource(this.audioElement);
    this.audioSource.connect(this.bassFilter);
  }

  async connectMicrophone() {
    this.init();
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    this.disconnectSources();

    this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.audioSource = this.ctx.createMediaStreamSource(this.micStream);
    this.audioSource.connect(this.bassFilter);
  }

  disconnectSources() {
    if (this.audioSource) {
      this.audioSource.disconnect();
      this.audioSource = null;
    }
    if (this.micStream) {
      this.micStream.getTracks().forEach(track => track.stop());
      this.micStream = null;
    }
    this.audioElement.pause();
  }

  play() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.audioElement.play();
  }

  pause() {
    this.audioElement.pause();
  }

  setVolume(value) {
    if (this.gainNode) this.gainNode.gain.value = value;
  }

  setBass(gain) {
    if (this.bassFilter) this.bassFilter.gain.value = gain;
  }

  setTreble(gain) {
    if (this.trebleFilter) this.trebleFilter.gain.value = gain;
  }

  setPan(pan) {
    if (this.pannerNode) this.pannerNode.pan.value = pan;
  }

  getFrequencyData(array) {
    if (this.analyser) {
      this.analyser.getByteFrequencyData(array);
    }
  }

  getWaveformData(array) {
    if (this.analyser) {
      this.analyser.getByteTimeDomainData(array);
    }
  }
}

export const audioEngine = new AudioEngine();
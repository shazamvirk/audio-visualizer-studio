# 🎵 Browser-Based Audio Visualizer & Waveform Studio

An interactive, high-performance web studio that processes real-time audio streams via the native **Web Audio API** and renders dynamic 60 FPS graphics on **HTML5 Canvas**. Built using **React**, **Redux Toolkit**, and **Tailwind CSS**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.x-61dafb.svg)
![Redux](https://img.shields.io/badge/Redux_Toolkit-2.x-764abc.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x/4.x-38bdf8.svg)

---

## 🚀 Live Demo & Key Highlights

- **60 FPS Real-Time Graphics:** High-framerate Canvas rendering decoupled from React re-render cycles.
- **Digital Signal Processing (DSP):** Real-time volume gain, bass low-shelf filter, treble high-shelf filter, and stereo panning nodes.
- **Multiple Visualizations:** Frequency spectrum bars, time-domain oscilloscopes, and radial polar frequency rings.
- **Dual Audio Sources:** Seamless switching between local audio files (`.mp3`, `.wav`) and live microphone input streams via `getUserMedia`.

---

## 🏗️ System Architecture

The application separates UI state management from high-frequency audio processing and graphics loops.

```
                  +-----------------------------------+
                  |        React UI Components        |
                  |  (Sliders, Mode Pickers, File)   |
                  +-----------------+-----------------+
                                    |
                                    v
                  +-----------------+-----------------+
                  |      Redux Store (Global State)    |
                  |   (Volume, Filters, Colors, Style)|
                  +-----------------+-----------------+
                                    |
            +-----------------------+-----------------------+
            | Dispatch actions                              | Read parameters
            v                                               v
+-----------------------+                       +-----------------------+
|  AudioEngine Engine   |                       |    VisualizerCanvas   |
|   (Web Audio API)     |                       |    (HTML5 Canvas)     |
+-----------+-----------+                       +-----------+-----------+
            |                                               |
            | Connects Audio Nodes:                         | Runs render loop
            | Source -> Bass -> Treble -> Panner -> Gain     | via requestAnimationFrame
            | -> AnalyserNode                               | using Uint8Array frequency data
            +-----------------------------------------------+
```

---

## 🛠️ Key Technical Challenges & Solutions

### 1. Preventing React Render Bottlenecks at 60 FPS
* **Challenge:** Triggering React state updates at 60 frames per second causes excessive Virtual DOM diffing, leading to dropped frames and UI jitter.
* **Solution:** Decoupled the canvas animation loop using browser-native `requestAnimationFrame`. The canvas component reads directly from the `AudioEngine` singleton's typed array (`Uint8Array`) buffer inside the loop without dispatching React state changes during frame updates.

### 2. Audio Node Graph Lifecycle Management
* **Challenge:** Switching between static file playback and microphone input without memory leaks, ghost audio processing, or audio context collisions.
* **Solution:** Encapsulated the audio chain inside a dedicated `AudioEngine` class. Implemented clean source disconnection methods to terminate active audio tracks, close microphone streams, and release hardware buffers before attaching new media streams.

---

## 📦 Tech Stack

- **Frontend Library:** React.js
- **State Management:** Redux Toolkit (`@reduxjs/toolkit`)
- **Styling:** Tailwind CSS
- **Audio Processing:** Native Web Audio API (`AudioContext`, `BiquadFilterNode`, `StereoPannerNode`, `AnalyserNode`)
- **Graphics Engine:** HTML5 Canvas API + `requestAnimationFrame`
- **Icon Set:** Lucide React

---

## ⚡ Quick Start & Setup

### Prerequisites
Make sure you have Node.js (v18+) and npm installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/audio-visualizer-studio.git
   cd audio-visualizer-studio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

---

## 📂 Project Structure

```
src/
├── components/
│   ├── AudioControls.jsx       # File upload, playback & DSP sliders
│   ├── VisualSettings.jsx      # Theme and visual style selector
│   └── VisualizerCanvas.jsx    # HTML5 Canvas rendering loop
├── store/
│   ├── audioSlice.js           # Redux slice for audio & UI state
│   └── store.js                # Redux store configuration
├── utils/
│   └── audioEngine.js          # Web Audio API singleton class
├── App.jsx                     # Root application container
├── index.css                   # Tailwind CSS directives
└── main.jsx                    # Application entry point & Redux provider
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request for new visualization presets or audio filters.

## 📄 License

This project is licensed under the [MIT License](LICENSE).
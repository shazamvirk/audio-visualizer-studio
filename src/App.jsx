import React from 'react';
import { VisualizerCanvas } from './components/VisualizerCanvas';
import { AudioControls } from './components/AudioControls';
import { VisualSettings } from './components/VisualSettings';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 flex flex-col items-center">
      <div className="max-w-4xl w-full space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Audio Waveform & Visualizer Studio
          </h1>
          <p className="text-sm text-slate-400">
            Real-time Web Audio API & HTML5 Canvas Spectrum Analyzer
          </p>
        </header>

        <VisualizerCanvas />
        <AudioControls />
        <VisualSettings />
      </div>
    </div>
  );
}
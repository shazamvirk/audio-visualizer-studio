import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Play, Pause, Upload, Mic, Volume2 } from 'lucide-react';
import {
  setIsPlaying,
  setVolume,
  setBass,
  setTreble,
  setPan,
  setSourceType,
  setFileName,
} from '../store/audioSlice';
import { audioEngine } from '../utils/audioEngine';

export const AudioControls = () => {
  const dispatch = useDispatch();
  const { isPlaying, volume, bass, treble, pan, sourceType, fileName } = useSelector(
    (state) => state.audio
  );

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await audioEngine.loadFile(file);
      dispatch(setSourceType('file'));
      dispatch(setFileName(file.name));
      dispatch(setIsPlaying(false));
    }
  };

  const handleMicToggle = async () => {
    if (sourceType === 'mic') {
      audioEngine.disconnectSources();
      dispatch(setSourceType('none'));
      dispatch(setIsPlaying(false));
    } else {
      await audioEngine.connectMicrophone();
      dispatch(setSourceType('mic'));
      dispatch(setFileName('Microphone Stream'));
      dispatch(setIsPlaying(true));
    }
  };

  const togglePlay = () => {
    if (sourceType === 'file') {
      if (isPlaying) {
        audioEngine.pause();
        dispatch(setIsPlaying(false));
      } else {
        audioEngine.play();
        dispatch(setIsPlaying(true));
      }
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-xl">
      {/* File / Source Section */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg cursor-pointer transition text-sm font-medium">
            <Upload className="w-4 h-4" />
            Upload Track
            <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
          </label>
          <button
            onClick={handleMicToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              sourceType === 'mic'
                ? 'bg-red-600 hover:bg-red-500 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            <Mic className="w-4 h-4" />
            {sourceType === 'mic' ? 'Stop Mic' : 'Live Mic'}
          </button>
        </div>

        {sourceType === 'file' && (
          <button
            onClick={togglePlay}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        )}

        <div className="text-xs text-slate-400 max-w-[200px] truncate">
          {fileName ? `Active: ${fileName}` : 'No Track Loaded'}
        </div>
      </div>

      {/* DSP Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Volume */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1"><Volume2 className="w-3 h-3"/> Volume</span>
            <span>{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              dispatch(setVolume(val));
              audioEngine.setVolume(val);
            }}
            className="w-full accent-indigo-500 bg-slate-800 rounded-lg cursor-pointer h-2"
          />
        </div>

        {/* Bass */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-400 font-medium">
            <span>Bass Boost</span>
            <span>{bass} dB</span>
          </div>
          <input
            type="range"
            min="-10"
            max="15"
            step="1"
            value={bass}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              dispatch(setBass(val));
              audioEngine.setBass(val);
            }}
            className="w-full accent-pink-500 bg-slate-800 rounded-lg cursor-pointer h-2"
          />
        </div>

        {/* Treble */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-400 font-medium">
            <span>Treble</span>
            <span>{treble} dB</span>
          </div>
          <input
            type="range"
            min="-10"
            max="15"
            step="1"
            value={treble}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              dispatch(setTreble(val));
              audioEngine.setTreble(val);
            }}
            className="w-full accent-cyan-500 bg-slate-800 rounded-lg cursor-pointer h-2"
          />
        </div>

        {/* Stereo Pan */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-400 font-medium">
            <span>Stereo Pan</span>
            <span>{pan === 0 ? 'Center' : pan < 0 ? `L ${Math.abs(pan)}` : `R ${pan}`}</span>
          </div>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.1"
            value={pan}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              dispatch(setPan(val));
              audioEngine.setPan(val);
            }}
            className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer h-2"
          />
        </div>
      </div>
    </div>
  );
};
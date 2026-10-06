import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setVisualStyle, setColorTheme } from '../store/audioSlice';

export const VisualSettings = () => {
  const dispatch = useDispatch();
  const { visualStyle, colorTheme } = useSelector((state) => state.audio);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6 shadow-xl">
      {/* Visual Modes */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Visual Style
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['bars', 'radial', 'wave'].map((style) => (
            <button
              key={style}
              onClick={() => dispatch(setVisualStyle(style))}
              className={`py-2 px-3 rounded-lg text-xs font-semibold capitalize border transition ${
                visualStyle === style
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Color Themes */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Color Palette
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'neon', name: 'Neon Cyber' },
            { id: 'fire', name: 'Fire Blast' },
            { id: 'ocean', name: 'Ocean Depth' },
          ].map((theme) => (
            <button
              key={theme.id}
              onClick={() => dispatch(setColorTheme(theme.id))}
              className={`py-2 px-3 rounded-lg text-xs font-semibold border transition ${
                colorTheme === theme.id
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {theme.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
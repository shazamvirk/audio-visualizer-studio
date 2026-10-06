import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isPlaying: false,
  volume: 0.8,
  bass: 0,
  treble: 0,
  pan: 0,
  visualStyle: 'bars', // 'bars' | 'radial' | 'wave'
  colorTheme: 'neon',  // 'neon' | 'fire' | 'ocean'
  sourceType: 'none',   // 'file' | 'mic' | 'none'
  fileName: '',
};

const audioSlice = createSlice({
  name: 'audio',
  initialState,
  reducers: {
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
    setVolume: (state, action) => {
      state.volume = action.payload;
    },
    setBass: (state, action) => {
      state.bass = action.payload;
    },
    setTreble: (state, action) => {
      state.treble = action.payload;
    },
    setPan: (state, action) => {
      state.pan = action.payload;
    },
    setVisualStyle: (state, action) => {
      state.visualStyle = action.payload;
    },
    setColorTheme: (state, action) => {
      state.colorTheme = action.payload;
    },
    setSourceType: (state, action) => {
      state.sourceType = action.payload;
    },
    setFileName: (state, action) => {
      state.fileName = action.payload;
    },
  },
});

export const {
  setIsPlaying,
  setVolume,
  setBass,
  setTreble,
  setPan,
  setVisualStyle,
  setColorTheme,
  setSourceType,
  setFileName,
} = audioSlice.actions;

export default audioSlice.reducer;
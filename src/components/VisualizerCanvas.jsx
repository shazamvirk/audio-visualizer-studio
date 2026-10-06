import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { audioEngine } from '../utils/audioEngine';

export const VisualizerCanvas = () => {
  const canvasRef = useRef(null);
  const { visualStyle, colorTheme, isPlaying, sourceType } = useSelector((state) => state.audio);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const bufferLength = audioEngine.analyser ? audioEngine.analyser.frequencyBinCount : 128;
    const dataArray = new Uint8Array(bufferLength);

    const getColors = () => {
      switch (colorTheme) {
        case 'fire':
          return ['#f97316', '#ef4444', '#eab308'];
        case 'ocean':
          return ['#06b6d4', '#3b82f6', '#6366f1'];
        case 'neon':
        default:
          return ['#a855f7', '#ec4899', '#3b82f6'];
      }
    };

    const render = () => {
      animationId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (sourceType === 'none') {
        ctx.fillStyle = '#64748b';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Upload an audio file or enable Microphone to start', canvas.width / 2, canvas.height / 2);
        return;
      }

      const colors = getColors();

      if (visualStyle === 'bars') {
        audioEngine.getFrequencyData(dataArray);
        const barWidth = (canvas.width / bufferLength) * 2.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * canvas.height;
          
          const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
          gradient.addColorStop(0, colors[0]);
          gradient.addColorStop(0.5, colors[1]);
          gradient.addColorStop(1, colors[2]);

          ctx.fillStyle = gradient;
          ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
          x += barWidth;
        }
      } else if (visualStyle === 'wave') {
        audioEngine.getWaveformData(dataArray);
        ctx.lineWidth = 3;
        ctx.strokeStyle = colors[1];
        ctx.beginPath();

        const sliceWidth = canvas.width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * canvas.height) / 2;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);

          x += sliceWidth;
        }

        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      } else if (visualStyle === 'radial') {
        audioEngine.getFrequencyData(dataArray);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) / 3;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * 100;
          const rads = (Math.PI * 2) / bufferLength * i;

          const x1 = centerX + Math.cos(rads) * radius;
          const y1 = centerY + Math.sin(rads) * radius;
          const x2 = centerX + Math.cos(rads) * (radius + barHeight);
          const y2 = centerY + Math.sin(rads) * (radius + barHeight);

          ctx.strokeStyle = colors[i % colors.length];
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [visualStyle, colorTheme, isPlaying, sourceType]);

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-2xl">
      <canvas
        ref={canvasRef}
        width={800}
        height={350}
        className="w-full h-[350px] bg-slate-950 rounded-lg block"
      />
    </div>
  );
};
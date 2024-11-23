'use client';

import { useState, useEffect, useRef } from 'react';

export default function MusicPlayer() {
  const [audioFile, setAudioFile] = useState(null);
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showVisualizer, setShowVisualizer] = useState(false);

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const audioInstance = new Audio();
    setAudio(audioInstance);
    return () => audioInstance.pause(); // Cleanup
  }, []);

  useEffect(() => {
    if (audio && showVisualizer) {
      setupVisualizer();
    }
  }, [audio, showVisualizer]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const audioUrl = URL.createObjectURL(file);
      audio.src = audioUrl;
      setAudioFile(audioUrl);
      setShowVisualizer(true);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleForward = () => {
    if (audio) audio.currentTime += 10;
  };

  const handleBackward = () => {
    if (audio && audio.currentTime >= 10) audio.currentTime -= 10;
  };

  const setupVisualizer = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audio);

    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      analyser.getByteFrequencyData(dataArray);

      dataArray.forEach((value, index) => {
        const barHeight = value / 2;
        const x = (index * canvas.width) / bufferLength;
        const barWidth = canvas.width / bufferLength;

        ctx.fillStyle = `rgb(${value}, ${50 + value}, ${100})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      });

      requestAnimationFrame(draw);
    };
    draw();
  };

  return (
    <div className="music-player">


      <h1 className="music-title">My Fancy Music Player</h1>
      <input
        type="file"
        accept="audio/*"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="file-input"
      />
      <div className="controls">
        <button onClick={handleBackward}>&lt;&lt;</button>
        <button onClick={togglePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
        <button onClick={handleForward}>&gt;&gt;</button>
      </div>
      <canvas ref={canvasRef} className="visualizer"></canvas>
      <footer className="footer">
        <p>&copy; 2024 Music Player by Yemna Mehmood</p>
      </footer>

    </div>
  );
}

import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { SecurityWatermark } from './SecurityWatermark';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  ShieldAlert,
} from 'lucide-react';

interface Props {
  videoUrl: string;
  videoType: 'mp4' | 'youtube' | 'vimeo';
  title: string;
  lessonId: string;
  onEnded?: () => void;
}

export const VideoPlayer: React.FC<Props> = ({
  videoUrl,
  videoType,
  title,
  lessonId,
  onEnded,
}) => {
  const { markLessonCompleted, logSecurityAction, showToast } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showRightClickNotice, setShowRightClickNotice] = useState(false);

  // Prevent right click on video player container
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowRightClickNotice(true);
    logSecurityAction(
      'anti_leak_triggered',
      `Tentative de clic droit ou capture détectée sur la leçon: ${title}`,
      'avertissement'
    );
    showToast(
      'Protection DRM Active',
      'Le téléchargement direct et la capture d\'écran sont désactivés pour protéger les droits d\'auteur.',
      'warning'
    );
    setTimeout(() => setShowRightClickNotice(false), 4000);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
        logSecurityAction('video_stream', `Lecture vidéo démarrée : ${title}`);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      const dur = videoRef.current.duration || 1;
      setCurrentTime(cur);
      setDuration(dur);
      setProgress((cur / dur) * 100);

      // Auto-mark completed when reached 90%
      if (cur / dur >= 0.9) {
        markLessonCompleted(lessonId);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekToPercent = parseFloat(e.target.value);
    if (videoRef.current && duration > 0) {
      const newTime = (seekToPercent / 100) * duration;
      videoRef.current.currentTime = newTime;
      setProgress(seekToPercent);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.parentElement?.requestFullscreen();
      }
    }
  };

  const formatTime = (timeInSec: number) => {
    const mins = Math.floor(timeInSec / 60);
    const secs = Math.floor(timeInSec % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      className="relative w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group select-none"
    >
      {/* Dynamic Watermark Overlay */}
      <SecurityWatermark />

      {/* Right Click Notice Popup */}
      {showRightClickNotice && (
        <div className="absolute top-4 right-4 z-50 bg-rose-950/90 border border-rose-500/50 backdrop-blur-md p-3 rounded-xl text-rose-200 text-xs flex items-center gap-2 animate-in fade-in zoom-in-95">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
          <span>Protection DRM Active — Copie vidéo interdite par le Cabinet Excelium.</span>
        </div>
      )}

      {/* MP4 Player */}
      {videoType === 'mp4' ? (
        <video
          ref={videoRef}
          src={videoUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => {
            setIsPlaying(false);
            markLessonCompleted(lessonId);
            if (onEnded) onEnded();
          }}
          className="w-full h-full object-contain cursor-pointer"
          onClick={togglePlay}
        />
      ) : (
        /* YouTube Embed Player Fallback */
        <iframe
          src={`${videoUrl}?autoplay=0&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      )}

      {/* Video Custom Control Overlay Bar (For MP4) */}
      {videoType === 'mp4' && (
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-2">
          {/* Progress Timeline Slider */}
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={handleSeek}
            className="w-full h-1.5 bg-slate-800 accent-emerald-500 rounded-lg cursor-pointer focus:outline-none"
          />

          <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="p-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg font-bold transition-transform active:scale-95"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-slate-950" />}
              </button>

              <button onClick={toggleMute} className="text-slate-300 hover:text-white">
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <span>
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Playback Speed dropdown */}
              <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                {[0.75, 1, 1.25, 1.5, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSpeedChange(s)}
                    className={`px-1.5 py-0.5 rounded text-[10px] ${
                      playbackSpeed === s ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>

              <button onClick={toggleFullscreen} className="text-slate-300 hover:text-white">
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

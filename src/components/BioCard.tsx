import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Github,
  Send,
  MessageSquare,
  Twitter,
  Youtube,
  Globe,
  ExternalLink,
  Music
} from 'lucide-react';
import { SotorikoConfig } from '../types';

interface BioCardProps {
  config: SotorikoConfig;
  isPreview?: boolean;
}

export default function BioCard({ config, isPreview = false }: BioCardProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Sync music URL and load
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = config.audioUrl || '';
      audioRef.current.loop = config.audioLoop;
      audioRef.current.load();
      setIsPlaying(false);
    }
  }, [config.audioUrl, config.audioLoop]);

  // Audio Progress Listener
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const togglePlayback = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current || !config.audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log('Autoplay or trigger blocked: ', err));
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!audioRef.current || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    const newTime = percentage * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Helper to convert hexadecimal to RGBA for glass backdrops
  const hexToRgba = (hex: string, alpha: number) => {
    const cleanedHex = hex.replace('#', '');
    const r = parseInt(cleanedHex.substring(0, 2), 16) || 0;
    const g = parseInt(cleanedHex.substring(2, 4), 16) || 0;
    const b = parseInt(cleanedHex.substring(4, 6), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const cardBgStyle = hexToRgba(config.colorBg, config.opacity / 100);

  // Locate the suitable icon
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Github':
        return <Github className="w-5 h-5" />;
      case 'Telegram':
        return <Send className="w-5 h-5 rotate-[320deg] transform translate-y-[-1px] translate-x-[-1px]" />;
      case 'Discord':
        return <MessageSquare className="w-5 h-5" />;
      case 'Twitter':
        return <Twitter className="w-5 h-5" />;
      case 'Youtube':
        return <Youtube className="w-5 h-5" />;
      case 'Globe':
        return <Globe className="w-5 h-5" />;
      default:
        return <ExternalLink className="w-5 h-5" />;
    }
  };

  return (
    <div
      className="relative flex items-center justify-center w-full min-h-screen overflow-hidden p-6 select-none transition-all duration-700"
      style={{
        fontFamily: config.fontFamily || 'Inter, sans-serif',
        justifyContent: config.cardPosition === 'center' ? 'center' : config.cardPosition
      }}
    >
      {/* Background Wrapper */}
      <div className="absolute inset-0 w-full h-full z-0 transition-all duration-700 pointer-events-none">
        {config.bgType === 'image' && config.bgUrl ? (
          <img
            src={config.bgUrl}
            alt="Background"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover scale-[1.03] filter brightness-[0.35] blur-[2px] transition-all duration-1000"
          />
        ) : (
          <div
            className="w-full h-full transition-all duration-1000"
            style={{
              background: `linear-gradient(135deg, ${config.bgGradientStart}, ${config.bgGradientEnd})`
            }}
          />
        )}
      </div>

      {/* Embedded Hidden HTML Audio Player */}
      {config.audioUrl && (
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleAudioEnded}
          src={config.audioUrl}
          loop={config.audioLoop}
        />
      )}

      {/* The Glassmorphism Portfolio Card */}
      <motion.div
        id="main-card"
        initial={{ opacity: 0, y: 35, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.75, cubicBezier: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[420px] rounded-3xl border border-white/10 shadow-2xl overflow-hidden p-8 text-center flex flex-col items-center justify-between"
        style={{
          backgroundColor: cardBgStyle,
          backdropFilter: `blur(${config.blur}px)`,
          WebkitBackdropFilter: `blur(${config.blur}px)`,
          color: config.colorText,
          marginLeft: config.cardPosition === 'flex-start' ? '1.5rem' : '0',
          marginRight: config.cardPosition === 'flex-end' ? '1.5rem' : '0',
          boxShadow: `0 30px 60px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.15)`
        }}
      >
        {/* Neon accent ambient glow behind card */}
        <div
          className="absolute -top-24 -left-20 w-44 h-44 rounded-full opacity-35 blur-[50px] pointer-events-none transition-all duration-500"
          style={{ backgroundColor: config.colorAccent }}
        />
        <div
          className="absolute -bottom-24 -right-20 w-44 h-44 rounded-full opacity-35 blur-[50px] pointer-events-none transition-all duration-500"
          style={{ backgroundColor: config.colorAccent }}
        />

        {/* Content Body */}
        <div className="w-full flex flex-col items-center z-10">
          
          {/* Avatar Container */}
          <div className="relative mb-6 group">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
              className="relative w-28 h-28 rounded-full overflow-hidden border-2 transition-all duration-500"
              style={{
                borderColor: config.colorAccent,
                boxShadow: `0 0 25px ${hexToRgba(config.colorAccent, 0.4)}`
              }}
            >
              {config.avatarUrl ? (
                <img
                  src={config.avatarUrl}
                  alt={config.username}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover select-none pointer-events-none"
                  onError={(e) => {
                    // Fail gracefully
                    (e.target as HTMLElement).style.display = 'none';
                    const parent = (e.target as HTMLElement).parentElement;
                    if (parent) {
                      const fallback = parent.querySelector('.avatar-fallback-el');
                      if (fallback) fallback.classList.remove('hidden');
                    }
                  }}
                />
              ) : null}
              
              <div
                className={`avatar-fallback-el absolute inset-0 flex items-center justify-center font-bold text-3xl select-none bg-slate-900/90 ${config.avatarUrl ? 'hidden' : ''}`}
                style={{ color: config.colorAccent }}
              >
                {config.username ? config.username[0].toUpperCase() : 'S'}
              </div>
            </motion.div>

            {/* Pulsing micro-dot on avatar in preview */}
            {isPreview && (
              <span className="absolute bottom-1 right-1 flex h-4.5 w-4.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: config.colorAccent }}></span>
                <span className="relative inline-flex rounded-full h-4.5 w-4.5 border-2 border-slate-900" style={{ backgroundColor: config.colorAccent }}></span>
              </span>
            )}
          </div>

          {/* Username */}
          <motion.h1
            id="username"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`text-3xl font-bold tracking-wide mb-1 transition-all duration-500`}
            style={{
              textShadow: config.animTitle
                ? `0 0 10px ${hexToRgba(config.colorAccent, 0.65)}, 0 0 25px ${hexToRgba(config.colorAccent, 0.3)}`
                : 'none',
              animation: config.animTitle ? 'pulse-glow 3s infinite alternate' : 'none'
            }}
          >
            {config.username || 'Sotoriko'}
          </motion.h1>

          {/* Location Badge */}
          {config.location && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5 text-xs font-medium mb-5 tracking-wide backdrop-blur-md"
              style={{ color: hexToRgba(config.colorText, 0.7) }}
            >
              <MapPin className="w-3.5 h-3.5" style={{ color: config.colorAccent }} />
              <span>{config.location}</span>
            </motion.div>
          )}

          {/* Profile Bio Description */}
          {config.bio && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="text-sm font-normal leading-relaxed mb-6 px-1 text-center"
              style={{ color: hexToRgba(config.colorText, 0.85) }}
            >
              {config.bio}
            </motion.p>
          )}

          {/* SOTORIKO AMBIENT PLAYER (Custom Glassmorphism UI) */}
          {config.audioUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="w-full p-4 rounded-2xl bg-black/35 border border-white/5 flex flex-col gap-3.5 mb-6 backdrop-blur-md"
            >
              <div className="flex items-center gap-3">
                {/* Vinyl animated icon */}
                <div
                  className={`flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-tr from-stone-900 to-stone-800 border border-white/10 flex items-center justify-center ${isPlaying ? 'animate-spin [animation-duration:6s]' : ''}`}
                >
                  <Music className="w-4 h-4" style={{ color: isPlaying ? config.colorAccent : 'inherit' }} />
                </div>
                
                {/* Media Metadata & Controls */}
                <div className="flex-grow text-left overflow-hidden">
                  <div className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: config.colorAccent }}>
                    {isPlaying ? 'Сейчас играет' : 'Аудио-фон'}
                  </div>
                  <div className="text-xs font-semibold truncate max-w-full" style={{ color: hexToRgba(config.colorText, 0.9) }}>
                    {config.audioUrl.split('/').pop()?.split('?')[0] || 'Ambient Synthwave'}
                  </div>
                </div>

                {/* Micro Action buttons */}
                <div className="flex items-center gap-1.5">
                  {config.volumeControl && (
                    <button
                      onClick={toggleMute}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 transition-all text-gray-300 hover:text-white"
                      title={isMuted ? "Включить звук" : "Выключить звук"}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  )}
                  <button
                    onClick={togglePlayback}
                    className="p-2 rounded-xl transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
                    style={{
                      backgroundColor: config.colorAccent,
                      color: config.colorBg
                    }}
                    title={isPlaying ? "Пауза" : "Играть"}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current translate-x-[0.5px]" />}
                  </button>
                </div>
              </div>

              {/* Progress Slider Bar */}
              <div
                className="relative h-1.5 w-full bg-white/10 rounded-full overflow-hidden cursor-pointer group"
                onClick={handleProgressBarClick}
              >
                <div
                  className="absolute top-0 left-0 h-full rounded-full transition-all duration-100 ease-out"
                  style={{
                    backgroundColor: config.colorAccent,
                    width: `${duration ? (currentTime / duration) * 100 : 0}%`
                  }}
                />
                {/* Floating scrubber hover effect */}
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                <span>
                  {Math.floor(currentTime / 60)}:{(Math.floor(currentTime % 60)).toString().padStart(2, '0')}
                </span>
                <span>
                  {duration ? `${Math.floor(duration / 60)}:${(Math.floor(duration % 60)).toString().padStart(2, '0')}` : '--:--'}
                </span>
              </div>
            </motion.div>
          )}

          {/* Social Bio Links Container */}
          <div className="w-full flex flex-col gap-3.5 mt-2">
            <AnimatePresence>
              {config.links.map((link, idx) => (
                <motion.a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: 0.5 + idx * 0.05 }}
                  className="group relative w-full p-4 rounded-xl border flex items-center justify-between font-semibold tracking-wide uppercase text-sm cursor-pointer transition-all duration-300"
                  style={{
                    backgroundColor: config.monoIcons ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.25)',
                    borderColor: config.monoIcons ? 'rgba(255, 255, 255, 0.1)' : config.colorAccent,
                    color: config.colorText,
                    textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                    boxShadow: `0 4px 10px rgba(0, 0, 0, 0.15)`
                  }}
                  whileHover={{
                    y: -3,
                    backgroundColor: config.colorAccent,
                    color: config.colorBg,
                    borderColor: config.colorAccent,
                    borderColorOpacity: 1,
                    textShadow: 'none',
                    boxShadow: `0 0 20px ${hexToRgba(config.colorAccent, 0.6)}`
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="opacity-80 group-hover:opacity-100 transition-transform duration-300 group-hover:scale-110">
                      {getIconComponent(link.icon)}
                    </span>
                    <span className="text-left select-none">{link.label}</span>
                  </div>
                  <ExternalLink className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                </motion.a>
              ))}
            </AnimatePresence>
          </div>

        </div>

        {/* CSS Animation injection */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes pulse-glow {
            from {
              text-shadow: 0 0 8px ${hexToRgba(config.colorAccent, 0.6)}, 0 0 20px ${hexToRgba(config.colorAccent, 0.25)};
            }
            to {
              text-shadow: 0 0 18px ${hexToRgba(config.colorAccent, 0.85)}, 0 0 35px ${hexToRgba(config.colorAccent, 0.45)};
            }
          }
        `}} />
      </motion.div>
    </div>
  );
}

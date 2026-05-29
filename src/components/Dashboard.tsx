import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Settings,
  Palette,
  Music,
  Link as LinkIcon,
  Sparkles,
  Layout,
  RefreshCw,
  Download,
  Trash2,
  Plus,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  Sparkle,
  Type,
  FileCode,
  Check,
  Globe,
  ArrowLeft
} from 'lucide-react';
import { SotorikoConfig, SocialLink } from '../types';
import { THEME_PRESETS, AVAILABLE_FONTS, DEFAULT_CONFIG } from '../defaults';
import BioCard from './BioCard';

interface DashboardProps {
  config: SotorikoConfig;
  onUpdateConfig: (newConfig: SotorikoConfig) => void;
  onSave: () => void;
  onReset: () => void;
  onExit: () => void;
}

type TabType = 'general' | 'media' | 'colors' | 'links' | 'effects';

export default function Dashboard({
  config,
  onUpdateConfig,
  onSave,
  onReset,
  onExit
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Links Form States
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkIcon, setNewLinkIcon] = useState('Globe');

  const updateField = (field: keyof SotorikoConfig, value: any) => {
    onUpdateConfig({
      ...config,
      [field]: value
    });
  };

  const handleApplyPreset = (preset: typeof THEME_PRESETS[0]) => {
    onUpdateConfig({
      ...config,
      colorAccent: preset.colorAccent,
      colorBg: preset.colorBg,
      colorText: preset.colorText,
      opacity: preset.opacity,
      blur: preset.blur,
      bgUrl: preset.bgUrl,
      bgType: 'image',
      themePreset: preset.id
    });
  };

  // Links CRUD
  const handleAddNewLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLinkLabel || !newLinkUrl) return;

    // Auto prepend http if missing
    let finalUrl = newLinkUrl.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
    }

    const newLink: SocialLink = {
      id: Date.now().toString(),
      label: newLinkLabel,
      url: finalUrl,
      icon: newLinkIcon
    };

    updateField('links', [...config.links, newLink]);
    setNewLinkLabel('');
    setNewLinkUrl('');
    setNewLinkIcon('Globe');
  };

  const handleDeleteLink = (id: string) => {
    const filtered = config.links.filter(l => l.id !== id);
    updateField('links', filtered);
  };

  const handleSaveWithAnimation = () => {
    onSave();
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2200);
  };

  // Self-Contained single file static exporter!
  const handleExportHTML = () => {
    const hexToRgba = (hex: string, alpha: number) => {
      const cleaned = hex.replace('#', '');
      const r = parseInt(cleaned.substring(0, 2), 16) || 0;
      const g = parseInt(cleaned.substring(2, 4), 16) || 0;
      const b = parseInt(cleaned.substring(4, 6), 16) || 0;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const linksHtml = config.links.map(l => {
      let iconSvg = '';
      if (l.icon === 'Github') iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-github"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>`;
      else if (l.icon === 'Telegram') iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(320deg) translate(-1px, -1px);"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`;
      else if (l.icon === 'Discord') iconSvg = `<svg xmlns="http://www.w3.org/2500/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`;
      else if (l.icon === 'Twitter') iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-twitter"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>`;
      else if (l.icon === 'Youtube') iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-youtube"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>`;
      else if (l.icon === 'Globe') iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-globe"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`;
      else iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-external-link"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`;

      return `
      <a href="${l.url}" target="_blank" class="social-btn ${config.monoIcons ? 'mono' : ''}">
        <span class="btn-icon">${iconSvg}</span>
        <span class="btn-text">${l.label}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-external"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
      </a>`;
    }).join('\n');

    const cardBgColor = hexToRgba(config.colorBg, config.opacity / 100);

    const fullStaticHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.username} | Bio</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;750&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;700&family=Outfit:wght@400;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

        :root {
            --accent: ${config.colorAccent};
            --text-color: ${config.colorText};
            --card-bg: ${cardBgColor};
            --blur-val: ${config.blur}px;
            --font-family: ${config.fontFamily || 'Inter, sans-serif'};
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            margin: 0; padding: 0; min-height: 100vh;
            display: flex; align-items: center; 
            justify-content: ${config.cardPosition === 'center' ? 'center' : (config.cardPosition === 'flex-start' ? 'flex-start' : 'flex-end')};
            font-family: var(--font-family);
            color: var(--text-color);
            overflow-x: hidden;
            background-color: #02060c;
        }

        #bg-wrapper {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-size: cover; background-position: center; z-index: -1;
            filter: brightness(0.35) blur(2px);
            transform: scale(1.03);
            pointer-events: none;
            ${config.bgType === 'image' && config.bgUrl ? `background-image: url('${config.bgUrl}');` : `background: linear-gradient(135deg, ${config.bgGradientStart}, ${config.bgGradientEnd});`}
        }

        .card {
            background: var(--card-bg);
            backdrop-filter: blur(var(--blur-val));
            -webkit-backdrop-filter: blur(var(--blur-val));
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 24px;
            padding: 40px; width: 90%; max-width: 420px;
            text-align: center;
            box-shadow: 0 30px 60px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.15);
            animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
            margin: 20px;
            ${config.cardPosition === 'flex-start' ? 'margin-left: 5%;' : ''}
            ${config.cardPosition === 'flex-end' ? 'margin-right: 5%;' : ''}
            position: relative;
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .ambient-glow-1 {
            position: absolute; -top: 96px; -left: 80px; width: 176px; height: 176px;
            border-radius: 50%; opacity: 0.35; filter: blur(50px);
            background-color: var(--accent); pointer-events: none;
        }
        .ambient-glow-2 {
            position: absolute; -bottom: 96px; -right: 80px; width: 176px; height: 176px;
            border-radius: 50%; opacity: 0.35; filter: blur(50px);
            background-color: var(--accent); pointer-events: none;
        }

        .avatar-container { margin-bottom: 24px; display: flex; justify-content: center; }
        .avatar-box {
            width: 110px; height: 110px; border-radius: 50%;
            border: 2px solid var(--accent);
            box-shadow: 0 0 25px rgba(0, 210, 255, 0.45);
            background: #111827; overflow: hidden; position: relative;
        }
        #avatar-img { width: 100%; height: 100%; object-fit: cover; }
        .avatar-fallback {
            display: flex; align-items: center; justify-content: center;
            font-size: 3rem; font-weight: bold; height: 100%; color: var(--accent);
        }

        .username { font-size: 1.85rem; font-weight: bold; margin-bottom: 4px; letter-spacing: 0.5px; }
        .username.anim-glow { animation: neonPulse 3s infinite alternate; }

        @keyframes neonPulse {
            from { text-shadow: 0 0 8px rgba(0, 210, 255, 0.6), 0 0 20px rgba(0, 210, 255, 0.25); }
            to { text-shadow: 0 0 18px rgba(0, 210, 255, 0.85), 0 0 35px rgba(0, 210, 255, 0.45); }
        }

        .location-box {
            display: inline-flex; align-items: center; gap: 6px;
            font-size: 0.75rem; font-weight: 500;
            background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.75);
            padding: 4px 12px; border-radius: 300px;
            border: 1px solid rgba(255,255,255,0.05);
            margin-bottom: 20px;
        }
        .location-box svg { stroke: var(--accent); fill: none; }

        .bio { font-size: 0.875rem; line-height: 1.6; margin-bottom: 24px; color: rgba(255,255,255,0.85); text-align: center; }

        /* Custom Audio element styles */
        .audio-wrapper {
            background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.05);
            border-radius: 16px; padding: 16px; margin-bottom: 24px;
            display: flex; flex-direction: column; gap: 14px; text-align: left;
        }
        .audio-header { display: flex; align-items: center; gap: 12px; }
        .vinyl {
            width: 36px; height: 36px; border-radius: 50%;
            background: linear-gradient(135deg, #1f2937, #111827);
            border: 1px solid rgba(255,255,255,0.1);
            display: flex; align-items: center; justify-content: center;
        }
        .vinyl.spinning { animation: spin 6s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .audio-info { flex-grow: 1; overflow: hidden; }
        .audio-info-title { font-size: 11px; text-transform: uppercase; font-weight: 600; color: var(--accent); }
        .audio-info-track { font-size: 12px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: rgba(255,255,255,0.9); }
        .audio-btn {
            background-color: var(--accent); color: #0f172a; border: none; width: 32px; height: 32px;
            border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s;
        }
        .audio-btn:hover { transform: scale(1.05); }
        .audio-progress-bar { height: 6px; background: rgba(255,255,255,0.1); border-radius: 100px; cursor: pointer; position: relative; }
        .audio-progress-fill { height: 100%; border-radius: 100px; background-color: var(--accent); width: 0%; transition: width 0.1s linear; }
        .audio-times { display: flex; justify-content: space-between; font-size: 10px; font-family: monospace; color: #9ca3af; }

        /* Кнопки соцсетей */
        .social-btn {
            display: flex; align-items: center; justify-content: space-between;
            width: 100%; padding: 16px; margin-bottom: 14px;
            background: rgba(0,0,0,0.25); border: 1px solid var(--accent);
            color: var(--text-color); text-decoration: none; border-radius: 12px;
            font-weight: 600; text-transform: uppercase; font-size: 14px; letter-spacing: 0.5px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 10px rgba(0,0,0,0.15);
        }
        .social-btn:hover {
            background: var(--accent); color: #0f172a; border-color: var(--accent);
            box-shadow: 0 0 20px rgba(0, 210, 255, 0.6);
            transform: translateY(-3px);
        }
        .social-btn.mono { border-color: rgba(255,255,255,0.1); background-color: rgba(255,255,255,0.03); }
        .social-btn.mono:hover { background: #ffffff; color: #02060c; border-color: #ffffff; box-shadow: 0 0 20px rgba(255,255,255,0.5); }
        .btn-icon { display: flex; align-items: center; }
        .btn-external { opacity: 0.4; }
        .social-btn:hover .btn-external { opacity: 1; }

        @media (max-width: 500px) {
            body { justify-content: center !important; }
            .card { margin: 16px; margin-left: 16px !important; margin-right: 16px !important; }
        }
    </style>
</head>
<body>
    <div id="bg-wrapper"></div>

    <div class="card" id="main-card">
        <div class="ambient-glow-1"></div>
        <div class="ambient-glow-2"></div>
        
        <div class="avatar-container">
            <div class="avatar-box">
                ${config.avatarUrl ? `<img id="avatar-img" src="${config.avatarUrl}" alt="Avatar">` : `<div class="avatar-fallback">${config.username ? config.username[0].toUpperCase() : 'S'}</div>`}
            </div>
        </div>

        <h1 id="username" class="username ${config.animTitle ? 'anim-glow' : ''}">${config.username}</h1>
        
        ${config.location ? `
        <div class="location-box" id="location-box">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span id="location-text">${config.location}</span>
        </div>` : ''}

        <p id="bio" class="bio">${config.bio}</p>

        ${config.audioUrl ? `
        <div class="audio-wrapper">
            <div class="audio-header">
                <div class="vinyl" id="vinyl-disc">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color:var(--accent);"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
                </div>
                <div class="audio-info">
                    <div class="audio-info-title">Аудио-фон</div>
                    <div class="audio-info-track">${config.audioUrl.split('/').pop()?.split('?')[0] || 'Ambient Stream'}</div>
                </div>
                <button class="audio-btn" id="play-btn">
                    <svg id="play-icn" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                </button>
            </div>
            <div class="audio-progress-bar" id="progress-bar-container">
                <div class="audio-progress-fill" id="progress-indicator"></div>
            </div>
            <div class="audio-times">
                <span id="time-curr">0:00</span>
                <span id="time-dur">--:--</span>
            </div>
        </div>` : ''}

        <div class="links-container" id="links-container">
            ${linksHtml}
        </div>
    </div>

    ${config.audioUrl ? `
    <audio id="bg-audio" loop>
        <source src="${config.audioUrl}" type="audio/mpeg">
    </audio>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const audio = document.getElementById('bg-audio');
            const playBtn = document.getElementById('play-btn');
            const playIcn = document.getElementById('play-icn');
            const vinyl = document.getElementById('vinyl-disc');
            const progressContainer = document.getElementById('progress-bar-container');
            const progressFill = document.getElementById('progress-indicator');
            const currTimeLabel = document.getElementById('time-curr');
            const durationLabel = document.getElementById('time-dur');

            let isPlaying = false;

            const formatTime = (time) => {
                if (isNaN(time)) return '--:--';
                const mins = Math.floor(time / 60);
                const secs = Math.floor(time % 60);
                return mins + ':' + secs.toString().padStart(2, '0');
            };

            playBtn.addEventListener('click', () => {
                if (isPlaying) {
                    audio.pause();
                    playIcn.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
                    vinyl.classList.remove('spinning');
                    isPlaying = false;
                } else {
                    audio.play()
                        .then(() => {
                            playIcn.innerHTML = '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';
                            vinyl.classList.add('spinning');
                            isPlaying = true;
                        })
                        .catch(err => alert("Нажмите в любое место экрана, а затем нажмите воспроизвести. Браузер блокирует автовоспроизведение."));
                }
            });

            audio.addEventListener('timeupdate', () => {
                if (!audio.duration) return;
                const ratio = audio.currentTime / audio.duration;
                progressFill.style.width = (ratio * 100) + '%';
                currTimeLabel.textContent = formatTime(audio.currentTime);
            });

            audio.addEventListener('loadedmetadata', () => {
                durationLabel.textContent = formatTime(audio.duration);
            });

            progressContainer.addEventListener('click', (e) => {
                if (!audio.duration) return;
                const rect = progressContainer.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const percentage = clickX / rect.width;
                audio.currentTime = percentage * audio.duration;
            });
        });
    </script>` : ''}
</body>
</html>`;

    const blob = new Blob([fullStaticHtml], { type: 'text/html;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${config.username.toLowerCase()}_bio.html`;
    link.click();
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-950 text-slate-100 font-sans">
      
      {/* 1. Sidebar Panel Workspace */}
      <aside className="w-full lg:w-[450px] bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col shrink-0">
        
        {/* Sidebar Header Console */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-[#00d2ff] animate-pulse" />
            <div className="font-bold tracking-wider text-base uppercase">
              SOTORIKO<span className="text-[#00d2ff]">.FUN</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded border border-[#00d2ff]/20 bg-[#00d2ff]/10 text-[#00d2ff] font-mono">
              v1.2-VITE
            </span>
          </div>

          <button
            onClick={onExit}
            className="p-2 text-xs font-semibold uppercase leading-none rounded-lg border border-slate-800 hover:border-[#00d2ff] hover:text-[#00d2ff] flex items-center gap-1.5 transition-all outline-none cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Выйти</span>
          </button>
        </div>

        {/* Console Quick Quick Tabs navigation */}
        <div className="px-4 py-3 bg-slate-950/20 border-b border-slate-800 grid grid-cols-5 gap-1 text-center select-none font-medium">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-2 rounded-lg text-xs flex flex-col items-center gap-1 cursor-pointer transition-all ${
              activeTab === 'general' ? 'bg-[#00d2ff]/10 text-[#00d2ff]' : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
            }`}
            title="Общие Настройки"
          >
            <Layout className="w-4 h-4" />
            <span className="scale-[0.9]">Сайт</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`py-2 rounded-lg text-xs flex flex-col items-center gap-1 cursor-pointer transition-all ${
              activeTab === 'media' ? 'bg-[#00d2ff]/10 text-[#00d2ff]' : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
            }`}
            title="Фоны и Музыка"
          >
            <Music className="w-4 h-4" />
            <span className="scale-[0.9]">Медиа</span>
          </button>

          <button
            onClick={() => setActiveTab('colors')}
            className={`py-2 rounded-lg text-xs flex flex-col items-center gap-1 cursor-pointer transition-all ${
              activeTab === 'colors' ? 'bg-[#00d2ff]/10 text-[#00d2ff]' : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
            }`}
            title="Палитры цв."
          >
            <Palette className="w-4 h-4" />
            <span className="scale-[0.9]">Цвета</span>
          </button>

          <button
            onClick={() => setActiveTab('links')}
            className={`py-2 rounded-lg text-xs flex flex-col items-center gap-1 cursor-pointer transition-all ${
              activeTab === 'links' ? 'bg-[#00d2ff]/10 text-[#00d2ff]' : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
            }`}
            title="Ссылки профиля"
          >
            <LinkIcon className="w-4 h-4" />
            <span className="scale-[0.9]">Ссылки</span>
          </button>

          <button
            onClick={() => setActiveTab('effects')}
            className={`py-2 rounded-lg text-xs flex flex-col items-center gap-1 cursor-pointer transition-all ${
              activeTab === 'effects' ? 'bg-[#00d2ff]/10 text-[#00d2ff]' : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
            }`}
            title="Тумблеры и эффекты"
          >
            <Sparkles className="w-4 h-4" />
            <span className="scale-[0.9]">Эффекты</span>
          </button>
        </div>

        {/* Scrollable control workspace body */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: GENERAL CONTROLS */}
          {activeTab === 'general' && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#00d2ff] mb-2 flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
                  <Layout className="w-4 h-4" />
                  <span>Основные сведения</span>
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                  Настройте имя профиля, текстовое биоописание и текущую геопозицию на визитке.
                </p>
              </div>

              {/* Username Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-300">Отображаемое имя (Никнейм)</label>
                <input
                  type="text"
                  value={config.username}
                  onChange={(e) => updateField('username', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-[#00d2ff] outline-none rounded-xl px-4 py-3 text-sm text-white transition-all text-ellipsis"
                  placeholder="Sotoriko"
                />
              </div>

              {/* Bio description */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-300">Описание профиля (Bio)</label>
                  <span className="text-[10px] text-gray-500 font-mono">{config.bio?.length || 0}/180</span>
                </div>
                <textarea
                  value={config.bio}
                  onChange={(e) => updateField('bio', e.target.value.substring(0, 180))}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-[#00d2ff] outline-none rounded-xl px-4 py-3 text-sm text-white resize-none transition-all leading-relaxed"
                  placeholder="Напиши что-нибудь о себе..."
                />
              </div>

              {/* Location Tag */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-300">Местоположение / Локация</label>
                <input
                  type="text"
                  value={config.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-[#00d2ff] outline-none rounded-xl px-4 py-3 text-sm text-white transition-all text-ellipsis"
                  placeholder="MegaDubinkaCity"
                />
              </div>

              {/* Card screen alignments */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-300">Выравнивание карточки на экране</label>
                <select
                  value={config.cardPosition}
                  onChange={(e) => updateField('cardPosition', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-[#00d2ff] outline-none rounded-xl px-4 py-3 text-sm text-white cursor-pointer transition-all select-none"
                >
                  <option value="center">По центру</option>
                  <option value="flex-start">Выровнять Слева</option>
                  <option value="flex-end">Выровнять Справа</option>
                </select>
              </div>

              {/* Typography */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-1">
                  <Type className="w-3.5 h-3.5 text-[#00d2ff]" />
                  <span>Шрифт текстовых блоков</span>
                </label>
                <select
                  value={config.fontFamily}
                  onChange={(e) => updateField('fontFamily', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-[#00d2ff] outline-none rounded-xl px-4 py-3 text-sm text-white cursor-pointer transition-all select-none"
                >
                  {AVAILABLE_FONTS.map(font => (
                    <option key={font.value} value={font.value}>{font.name}</option>
                  ))}
                </select>
              </div>

            </div>
          )}

          {/* TAB 2: MEDIA & AUDIO */}
          {activeTab === 'media' && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#00d2ff] mb-2 flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
                  <Music className="w-4 h-4" />
                  <span>Медиа и Обложки</span>
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                  Добавьте сочные ссылки на файлы, медиа-ссылки и музыкальный плейбек треков.
                </p>
              </div>

              {/* Background Types */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-300">Режим фонового слоя</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateField('bgType', 'image')}
                    className={`py-2 px-3 border rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      config.bgType === 'image'
                        ? 'border-[#00d2ff] bg-[#00d2ff]/10 text-white'
                        : 'border-slate-800 bg-slate-950/40 text-gray-400 hover:text-white'
                    }`}
                  >
                    Арт / Картина / GIF URL
                  </button>
                  <button
                    onClick={() => updateField('bgType', 'gradient')}
                    className={`py-2 px-3 border rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      config.bgType === 'gradient'
                        ? 'border-[#00d2ff] bg-[#00d2ff]/10 text-white'
                        : 'border-slate-800 bg-slate-950/40 text-gray-400 hover:text-white'
                    }`}
                  >
                    Статический CSS Градиент
                  </button>
                </div>
              </div>

              {config.bgType === 'image' ? (
                /* Background image path input */
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-300">Ссылка на Фоновую заставку (Картинка / GIF)</label>
                  <input
                    type="text"
                    value={config.bgUrl}
                    onChange={(e) => updateField('bgUrl', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-[#00d2ff] outline-none rounded-xl px-4 py-3 text-sm text-white transition-all font-mono"
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                  <span className="text-[10px] text-gray-500 leading-normal">
                    Вставьте любой прямой URL-адрес картинки, обоев или анимированного GIF.
                  </span>
                </div>
              ) : (
                /* CSS gradient choosers */
                <div className="p-4 bg-slate-950/50 border border-slate-800/80 rounded-2xl grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-semibold text-gray-400">Начальный цвет</label>
                    <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                      <input
                        type="color"
                        value={config.bgGradientStart}
                        onChange={(e) => updateField('bgGradientStart', e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <span className="text-xs font-mono">{config.bgGradientStart}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-semibold text-gray-400">Конечный цвет</label>
                    <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                      <input
                        type="color"
                        value={config.bgGradientEnd}
                        onChange={(e) => updateField('bgGradientEnd', e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <span className="text-xs font-mono">{config.bgGradientEnd}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Avatar profile field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-300">Ссылка на Аватар профиля (URL)</label>
                <input
                  type="text"
                  value={config.avatarUrl}
                  onChange={(e) => updateField('avatarUrl', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-[#00d2ff] outline-none rounded-xl px-4 py-3 text-sm text-white transition-all font-mono"
                  placeholder="https://..."
                />
              </div>

              {/* Audio MP3 asset chooser */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-300">Ссылка на Фоновую Музыку (Прямой MP3 URL)</label>
                <input
                  type="text"
                  value={config.audioUrl}
                  onChange={(e) => updateField('audioUrl', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-[#00d2ff] outline-none rounded-xl px-4 py-3 text-sm text-white transition-all font-mono"
                  placeholder="https://www.soundhelix.com/..."
                />
                <span className="text-[10px] text-gray-500 leading-normal">
                  (Рекомендуется использовать хостинги аудио вроде SoundHelix для тестирования или любой стабильный прямой .mp3 поток)
                </span>
              </div>

            </div>
          )}

          {/* TAB 3: PALETTES & COLORS */}
          {activeTab === 'colors' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#00d2ff] mb-2 flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
                  <Palette className="w-4 h-4" />
                  <span>Цветовые Схемы</span>
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                  Выберите готовые премиум скины или настройте точечные параметры оттенков стекла.
                </p>
              </div>

              {/* Dynamic Preset presets */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-300 mb-2.5">Готовые Темы-Пресеты</div>
                <div className="grid grid-cols-2 gap-2.5">
                  {THEME_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleApplyPreset(preset)}
                      className={`p-3 rounded-xl border border-slate-800 flex flex-col gap-1 text-left bg-slate-950/40 hover:border-slate-700 transition-all cursor-pointer ${
                        config.themePreset === preset.id ? 'border-[#00d2ff]/40 bg-[#00d2ff]/5' : ''
                      }`}
                    >
                      <span className="text-xs font-bold leading-normal text-white">{preset.name}</span>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="w-3.5 h-3.5 rounded-full border border-white/10" style={{ backgroundColor: preset.colorAccent }} title="Акцент" />
                        <span className="w-3.5 h-3.5 rounded-full border border-white/10" style={{ backgroundColor: preset.colorBg }} title="Карточка" />
                        <span className="w-3.5 h-3.5 rounded-full border border-white/10" style={{ backgroundColor: preset.colorText }} title="Текст" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Single Custom color picks */}
              <div className="space-y-4 pt-1 border-t border-slate-800/80">
                <div className="text-xs font-semibold text-gray-300">Ручная палитра (Customizer)</div>
                
                {/* Accent chooser */}
                <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white">Акцентный цвет</span>
                    <span className="text-[10px] text-gray-500 uppercase font-mono">{config.colorAccent}</span>
                  </div>
                  <input
                    type="color"
                    value={config.colorAccent}
                    onChange={(e) => updateField('colorAccent', e.target.value)}
                    className="w-10 h-10 border-0 bg-transparent cursor-pointer rounded-lg shrink-0 outline-none"
                  />
                </div>

                {/* Card Background chooser */}
                <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white">Фон карточки</span>
                    <span className="text-[10px] text-gray-500 uppercase font-mono">{config.colorBg}</span>
                  </div>
                  <input
                    type="color"
                    value={config.colorBg}
                    onChange={(e) => updateField('colorBg', e.target.value)}
                    className="w-10 h-10 border-0 bg-transparent cursor-pointer rounded-lg shrink-0 outline-none"
                  />
                </div>

                {/* Clear Text chooser */}
                <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white">Цвет текста визитки</span>
                    <span className="text-[10px] text-gray-500 uppercase font-mono">{config.colorText}</span>
                  </div>
                  <input
                    type="color"
                    value={config.colorText}
                    onChange={(e) => updateField('colorText', e.target.value)}
                    className="w-10 h-10 border-0 bg-transparent cursor-pointer rounded-lg shrink-0 outline-none"
                  />
                </div>
              </div>

              {/* Sliders for Glass shaders */}
              <div className="space-y-4 pt-4 border-t border-slate-800/80">
                <div className="text-xs font-semibold text-gray-300 flex items-center gap-1">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#00d2ff]" />
                  <span>Фильтры Стекла (Glassmorphism)</span>
                </div>

                {/* Opacity slider */}
                <div className="space-y-1 bg-slate-950 p-4 border border-slate-800/80 rounded-xl">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400 font-medium">Прозрачность заливки карточки</span>
                    <span className="text-[#00d2ff] font-mono font-bold">{config.opacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={config.opacity}
                    onChange={(e) => updateField('opacity', Number(e.target.value))}
                    className="w-full accent-[#00d2ff] h-1.5 bg-slate-850 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Blur slider */}
                <div className="space-y-1 bg-slate-950 p-4 border border-slate-800/80 rounded-xl">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400 font-medium font-medium">Плотность размытия фона</span>
                    <span className="text-[#00d2ff] font-mono font-bold">{config.blur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={config.blur}
                    onChange={(e) => updateField('blur', Number(e.target.value))}
                    className="w-full accent-[#00d2ff] h-1.5 bg-slate-850 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: SOCIAL BIO LINKS MANAGER */}
          {activeTab === 'links' && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#00d2ff] mb-2 flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
                  <LinkIcon className="w-4 h-4" />
                  <span>Менеджер Соцсетей</span>
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                  Редактируйте активный список кнопок, добавляйте новые ссылки или перенаправляйте посетителей.
                </p>
              </div>

              {/* Add New Link Form Element */}
              <form onSubmit={handleAddNewLink} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                <div className="text-xs font-bold text-slate-200 border-b border-slate-850 pb-1 flex items-center gap-1">
                  <Plus className="w-4 h-4 text-[#00d2ff]" />
                  <span>Добавить новую ссылку</span>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase text-gray-400 font-semibold leading-normal">Текст ссылки (Название)</label>
                  <input
                    type="text"
                    required
                    value={newLinkLabel}
                    onChange={(e) => setNewLinkLabel(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-850 focus:border-[#00d2ff] outline-none rounded-lg px-3 py-2 text-xs text-white"
                    placeholder="Например: My TikTok"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase text-gray-400 font-semibold leading-normal">URL-адрес (Ссылка)</label>
                  <input
                    type="text"
                    required
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-850 focus:border-[#00d2ff] outline-none rounded-lg px-3 py-2 text-xs text-white font-mono"
                    placeholder="https://t.me/username"
                  />
                </div>

                {/* Icon Grid chooser */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase text-gray-400 font-semibold leading-normal">Иконка соцсети</label>
                  <select
                    value={newLinkIcon}
                    onChange={(e) => setNewLinkIcon(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-850 focus:border-[#00d2ff] outline-none rounded-lg px-3 py-2 text-xs text-white cursor-pointer"
                  >
                    <option value="Globe">Сайт / Глобус</option>
                    <option value="Telegram">Telegram / Самолет</option>
                    <option value="Discord">Discord / Сообщество</option>
                    <option value="Github">GitHub / Код</option>
                    <option value="Twitter">Twitter / X</option>
                    <option value="Youtube">YouTube / Видео</option>
                    <option value="ExternalLink">По умолчанию / Стрелка</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider bg-[#00d2ff] text-slate-950 flex items-center justify-center gap-1 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Добавить Кнопку</span>
                </button>
              </form>

              {/* Active Links lists */}
              <div className="space-y-2.5">
                <div className="text-xs font-semibold text-gray-300">Текущие Ссылки визитки ({config.links.length})</div>
                
                {config.links.length === 0 ? (
                  <div className="text-xs text-center border border-dashed border-slate-800 p-6 text-gray-500 rounded-xl leading-relaxed bg-slate-950/20">
                    Нет активных ссылок. Добавьте одну сверху.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {config.links.map((link) => (
                      <div
                        key={link.id}
                        className="p-3 rounded-xl border border-slate-800/80 bg-slate-950/50 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex flex-col overflow-hidden max-w-[70%]">
                          <span className="font-semibold text-white leading-tight truncate">{link.label}</span>
                          <span className="text-[10px] text-gray-500 font-mono leading-tight truncate mt-0.5">{link.url}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="px-2 py-1 text-[9px] font-semibold border-white/5 bg-slate-900 border text-gray-400 rounded-md">
                            {link.icon}
                          </span>
                          <button
                            onClick={() => handleDeleteLink(link.id)}
                            className="p-1.5 rounded-lg border border-slate-850 hover:border-rose-500/30 hover:bg-rose-500/10 text-gray-500 hover:text-rose-400 cursor-pointer transition-all"
                            title="Удалить ссылку"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 5: EFFECTS & TOGGLES */}
          {activeTab === 'effects' && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#00d2ff] mb-2 flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Тумблеры и эффекты</span>
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                  Управляйте интерактивными режимами, графикой и особенностями плеера визитки.
                </p>
              </div>

              {/* Monochrome Toggles switches */}
              <div className="space-y-3">
                
                {/* Monochrome Toggle */}
                <label className="flex items-center justify-between p-4 bg-slate-950 border border-slate-850 hover:border-slate-800 rounded-xl cursor-pointer select-none transition-all Group">
                  <div className="flex flex-col gap-0.5 max-w-[80%]">
                    <span className="text-xs font-semibold text-white">Монохромные кнопки</span>
                    <span className="text-[10px] text-gray-500 leading-normal">
                      Делает контуры кнопок матовыми, превращая их в глянец при наведении курсора.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.monoIcons}
                    onChange={(e) => updateField('monoIcons', e.target.checked)}
                    className="w-4 h-4 accent-[#00d2ff]"
                  />
                </label>

                {/* Animated neon title */}
                <label className="flex items-center justify-between p-4 bg-slate-950 border border-slate-850 hover:border-slate-800 rounded-xl cursor-pointer select-none transition-all Group">
                  <div className="flex flex-col gap-0.5 max-w-[80%]">
                    <span className="text-xs font-semibold text-white">Анимированный заголовок</span>
                    <span className="text-[10px] text-gray-500 leading-normal">
                      Добавляет пульсирующее неоновое свечение вашему никнейму на карте.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.animTitle}
                    onChange={(e) => updateField('animTitle', e.target.checked)}
                    className="w-4 h-4 accent-[#00d2ff]"
                  />
                </label>

                {/* Audio loops */}
                <label className="flex items-center justify-between p-4 bg-slate-950 border border-slate-850 hover:border-slate-800 rounded-xl cursor-pointer select-none transition-all Group">
                  <div className="flex flex-col gap-0.5 max-w-[80%]">
                    <span className="text-xs font-semibold text-white">Автозацикливание Аудио трека</span>
                    <span className="text-[10px] text-gray-500 leading-normal">
                      По завершении проигрывания музыкального фона, трек начнется заново.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.audioLoop}
                    onChange={(e) => updateField('audioLoop', e.target.checked)}
                    className="w-4 h-4 accent-[#00d2ff]"
                  />
                </label>

                {/* volumeControl */}
                <label className="flex items-center justify-between p-4 bg-slate-950 border border-slate-850 hover:border-slate-800 rounded-xl cursor-pointer select-none transition-all Group">
                  <div className="flex flex-col gap-0.5 max-w-[80%]">
                    <span className="text-xs font-semibold text-white">Регулятор громкости</span>
                    <span className="text-[10px] text-gray-500 leading-normal">
                      Отображает кнопку мгновенного отключения звука на плеере.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.volumeControl}
                    onChange={(e) => updateField('volumeControl', e.target.checked)}
                    className="w-4 h-4 accent-[#00d2ff]"
                  />
                </label>

              </div>

            </div>
          )}

        </div>

        {/* Dashboard bottom dock: containing reset, save and static HTML export */}
        <div className="p-5 border-t border-slate-800 bg-slate-950/60 flex flex-col gap-3">
          
          <div className="grid grid-cols-2 gap-2">
            
            {/* Exporter button */}
            <button
              onClick={handleExportHTML}
              className="py-3 px-2 border border-[#00d2ff]/20 bg-[#00d2ff]/5 hover:bg-[#00d2ff]/10 hover:border-[#00d2ff]/40 text-[#00d2ff] scroll-none rounded-xl text-xs font-semibold uppercase flex items-center justify-center gap-1.5 transition-all text-ellipsis cursor-pointer outline-none"
              title="Экспортирует один файл HTML со стилями"
            >
              <FileCode className="w-4 h-4" />
              <span>Создать HTML</span>
            </button>

            {/* Reset Defaults */}
            <button
              onClick={onReset}
              className="py-3 px-2 border border-slate-800 text-gray-400 hover:text-white hover:border-slate-700 hover:bg-slate-900 rounded-xl text-xs font-semibold uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer outline-none"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Сбросить</span>
            </button>

          </div>

          {/* Core Master Config save */}
          <button
            onClick={handleSaveWithAnimation}
            className="w-full py-3.5 rounded-xl font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
            style={{
              backgroundColor: saveSuccess ? '#10b981' : '#00d2ff',
              color: '#0f172a',
              boxShadow: saveSuccess
                ? '0 0 15px rgba(16, 185, 129, 0.45)'
                : '0 0 15px rgba(0, 210, 255, 0.35)'
            }}
          >
            {saveSuccess ? (
              <>
                <Check className="w-4.5 h-4.5 animate-bounce text-slate-950" />
                <span>Сохранено! ✔️</span>
              </>
            ) : (
              <>
                <ArrowLeft className="w-4 h-4 opacity-50 shrink-0" />
                <span>Опубликовать и Обновить</span>
              </>
            )}
          </button>
        </div>

      </aside>

      {/* 2. Interactive Real-time canvas preview pane */}
      <section className="flex-grow flex flex-col min-h-[500px] relative bg-slate-950 select-none">
        <div className="absolute top-5 left-5 z-20 flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 backdrop-blur px-3 py-1.5 rounded-full text-[10px] text-gray-400 text-medium font-mono leading-none shadow-md">
          <Eye className="w-3.5 h-3.5 animate-pulse text-[#00d2ff]" />
          <span>ИНТЕРАКТИВНЫЙ РЕЖИМ ПРЕДВЬЮ (ЖИВАЯ КАРТА)</span>
        </div>

        {/* Display rendering Canvas */}
        <div className="flex-grow flex items-center justify-center bg-radial from-slate-900 to-slate-950">
          <BioCard config={config} isPreview={true} />
        </div>
      </section>

    </div>
  );
}

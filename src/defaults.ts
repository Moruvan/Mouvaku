import { SotorikoConfig } from './types';

export const DEFAULT_CONFIG: SotorikoConfig = {
  bgUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80',
  bgType: 'image',
  bgGradientStart: '#020617',
  bgGradientEnd: '#0f172a',
  audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Relaxing synth-ambient track
  audioLoop: true,
  avatarUrl: 'https://avatars.githubusercontent.com/u/104190846?v=4', // Dynamic portfolio/github avatar
  username: 'Sotoriko',
  bio: 'Fullstack Developer & UI/UX enthusiast. Exploring the boundaries of digital canvases & web interfaces. Welcome to my personal dashboard.',
  location: 'MegaDubinkaCity',
  cardPosition: 'center',
  opacity: 45,
  blur: 24,
  colorAccent: '#00d2ff',
  colorBg: '#0f172a',
  colorText: '#ffffff',
  monoIcons: false,
  animTitle: true,
  volumeControl: true,
  links: [
    { id: '1', label: 'Telegram Channel', url: 'https://t.me/', icon: 'Telegram' },
    { id: '2', label: 'Discord Server', url: 'https://discord.com', icon: 'Discord' },
    { id: '3', label: 'GitHub Profile', url: 'https://github.com/Moruvan', icon: 'Github' },
    { id: '4', label: 'Personal Website', url: 'https://sotoriko.fun', icon: 'Globe' }
  ],
  themePreset: 'neon-dark',
  fontFamily: 'Inter'
};

export const AVAILABLE_FONTS = [
  { name: 'Inter (Sans)', value: 'Inter, sans-serif' },
  { name: 'JetBrains Mono', value: '"JetBrains Mono", monospace' },
  { name: 'Space Grotesk', value: '"Space Grotesk", sans-serif' },
  { name: 'Outfit (Modern)', value: '"Outfit", sans-serif' },
  { name: 'Playfair Display', value: '"Playfair Display", serif' }
];

export const THEME_PRESETS = [
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    colorAccent: '#ff007f',
    colorBg: '#05050a',
    colorText: '#00f0ff',
    opacity: 30,
    blur: 15,
    bgUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'minimal-light',
    name: 'Minimalist Ivory',
    colorAccent: '#1e293b',
    colorBg: '#f8fafc',
    colorText: '#0f172a',
    opacity: 70,
    blur: 20,
    bgUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'cosmic-purple',
    name: 'Ethereal Nebula',
    colorAccent: '#a855f7',
    colorBg: '#090514',
    colorText: '#f3e8ff',
    opacity: 40,
    blur: 25,
    bgUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'emerald-abyss',
    name: 'Emerald Abyss',
    colorAccent: '#10b981',
    colorBg: '#021e17',
    colorText: '#ecfdf5',
    opacity: 50,
    blur: 20,
    bgUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
  }
];

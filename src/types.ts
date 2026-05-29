export interface SocialLink {
  id: string;
  label: string;
  url: string;
  icon: string; // "Github" | "Telegram" | "Discord" | "Twitter" | "Youtube" | "Globe" | "ExternalLink"
}

export interface SotorikoConfig {
  bgUrl: string;
  bgType: 'image' | 'video' | 'gradient';
  bgGradientStart: string;
  bgGradientEnd: string;
  audioUrl: string;
  audioLoop: boolean;
  avatarUrl: string;
  username: string;
  bio: string;
  location: string;
  cardPosition: 'center' | 'flex-start' | 'flex-end';
  opacity: number; // 0 to 100
  blur: number; // 0 to 50
  colorAccent: string;
  colorBg: string;
  colorText: string;
  monoIcons: boolean;
  animTitle: boolean;
  volumeControl: boolean;
  links: SocialLink[];
  themePreset: string;
  fontFamily: string;
}

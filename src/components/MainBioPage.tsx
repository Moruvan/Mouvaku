import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Lock, LogIn } from 'lucide-react';
import { SotorikoConfig } from '../types';
import BioCard from './BioCard';
import SecurityGate from './SecurityGate';

interface MainBioPageProps {
  config: SotorikoConfig;
  onEnterAdmin: () => void;
}

export default function MainBioPage({ config, onEnterAdmin }: MainBioPageProps) {
  const [showGate, setShowGate] = useState(false);

  return (
    <div className="relative w-full min-h-screen bg-slate-950 overflow-hidden select-none">
      {/* Bio Card render */}
      <BioCard config={config} isPreview={false} />

      {/* Subtle Floating Lock/Admin Portal Button */}
      <div className="absolute bottom-6 right-6 z-30">
        <motion.button
          onClick={() => setShowGate(true)}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.35, scale: 1 }}
          whileHover={{ opacity: 1, scale: 1.05 }}
          className="p-3 rounded-full bg-black/45 border border-white/10 text-gray-400 hover:text-[#00d2ff] hover:border-[#00d2ff]/30 shadow-lg cursor-pointer flex items-center justify-center transition-all outline-none"
          title="Вход в Панель управления"
        >
          <Lock className="w-4.5 h-4.5 transition-all text-neutral-400 hover:text-[#00d2ff]" />
        </motion.button>
      </div>

      {/* Cyber Security passcode Prompt Screen overlay */}
      <AnimatePresence>
        {showGate && (
          <SecurityGate
            onSuccess={() => {
              setShowGate(false);
              onEnterAdmin();
            }}
            onClose={() => setShowGate(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

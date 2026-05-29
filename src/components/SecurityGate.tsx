import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock, X, Play, ShieldAlert, Asterisk, CornerDownLeft, Eye, EyeOff } from 'lucide-react';

interface SecurityGateProps {
  onSuccess: () => void;
  onClose: () => void;
}

export default function SecurityGate({ onSuccess, onClose }: SecurityGateProps) {
  const [pin, setPin] = useState<string>('');
  const [errorCount, setErrorCount] = useState<number>(0);
  const [showPin, setShowPin] = useState<boolean>(false);
  const [shake, setShake] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>('Введите секретный пин-код доступа');

  const SECRET_PIN = "152515";

  const handleKeyPress = (num: string) => {
    if (pin.length < 8) {
      setPin(prev => prev + num);
      setShake(false);
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setShake(false);
  };

  const handleClear = () => {
    setPin('');
    setShake(false);
  };

  const handleVerify = () => {
    if (pin === SECRET_PIN) {
      // Plays standard futuristic chime natively if wanted, or we just grant success
      setStatusText('ДОСТУП  РАЗРЕШЕН.  ВХОД...');
      setTimeout(() => {
        onSuccess();
      }, 700);
    } else {
      setShake(true);
      setErrorCount(prev => prev + 1);
      setPin('');
      setStatusText('НЕВЕРНЫЙ ПИН-КОД! ОТКАЗАНО В ДОСТУПЕ');
      setTimeout(() => {
        setStatusText('Введите секретный пин-код доступа');
      }, 2500);
    }
  };

  // Allow native keyboard numbers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Enter') {
        handleVerify();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4 font-mono select-none"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,210,255,0.1)_0%,transparent_70%)] pointer-events-none" />
      {/* Techno Grid scan lines background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.1)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <motion.div
        initial={{ scale: 0.9, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 15 }}
        className="w-full max-w-sm rounded-3xl border border-[#00d2ff]/20 bg-slate-900/80 p-8 shadow-[0_0_50px_rgba(0,d2,ff,0.15)] flex flex-col relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/5 text-gray-500 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Security Emblem Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="relative mb-3 flex items-center justify-center">
            {shake ? (
              <motion.div
                animate={{ x: [-10, 10, -10, 10, -5, 5, -2, 2, 0] }}
                transition={{ duration: 0.4 }}
                className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500"
              >
                <ShieldAlert className="w-7 h-7 animate-pulse" />
              </motion.div>
            ) : (
              <div className="w-14 h-14 rounded-full bg-[#00d2ff]/10 border border-[#00d2ff]/30 flex items-center justify-center text-[#00d2ff]">
                <Lock className="w-7 h-7" />
              </div>
            )}
          </div>
          <h2 className="text-sm uppercase tracking-widest font-semibold text-gray-400">
            SOTORIKO_SECURE_GATE
          </h2>
          <div
            className={`text-xs mt-1 transition-all duration-300 font-medium ${
              shake ? 'text-rose-500 font-semibold' : 'text-[#00d2ff]/80'
            }`}
          >
            {statusText}
          </div>
        </div>

        {/* Password Dots Terminal View */}
        <div
          className={`flex items-center justify-between px-5 py-4 bg-slate-950/80 rounded-2xl border mb-6 transition-all font-mono text-xl ${
            shake ? 'border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.35)]' : 'border-slate-800 focus-within:border-[#00d2ff]'
          }`}
        >
          <div className="flex items-center gap-1.5 h-6 overflow-hidden max-w-[80%]">
            {pin.length === 0 ? (
              <span className="text-xs text-gray-600 animate-pulse">ОЖИДАНИЕ_ВВОДА...</span>
            ) : (
              pin.split('').map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ scale: 0.4, y: 5 }}
                  animate={{ scale: 1, y: 0 }}
                  className="font-bold flex items-center justify-center"
                  style={{ color: '#00d2ff' }}
                >
                  {showPin ? char : <Asterisk className="w-4 h-4 text-[#00d2ff] shrink-0" />}
                </motion.span>
              ))
            )}
          </div>

          <button
            onClick={() => setShowPin(!showPin)}
            className="p-1 rounded-md text-gray-500 hover:text-white hover:bg-slate-850 cursor-pointer"
          >
            {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Secure key numbers and grids */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              className="py-3.5 rounded-xl border border-slate-800/80 bg-slate-950/40 text-lg hover:border-[#00d2ff]/40 hover:bg-[#00d2ff]/5 text-gray-300 active:bg-[#00d2ff]/10 hover:text-white cursor-pointer active:scale-95 transition-all outline-none"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="py-3.5 rounded-xl border border-slate-800/80 bg-slate-950/40 text-xs font-semibold uppercase hover:border-rose-500/40 hover:bg-rose-500/5 text-rose-400 hover:text-rose-300 active:scale-95 transition-all outline-none cursor-pointer"
          >
            Сброс
          </button>
          <button
            onClick={() => handleKeyPress('0')}
            className="py-3.5 rounded-xl border border-slate-800/80 bg-slate-950/40 text-lg hover:border-[#00d2ff]/40 hover:bg-[#00d2ff]/5 text-gray-300 active:bg-[#00d2ff]/10 hover:text-white cursor-pointer active:scale-95 transition-all outline-none"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="py-3.5 rounded-xl border border-slate-800/80 bg-slate-950/40 text-xs font-semibold uppercase hover:border-amber-500/40 hover:bg-amber-500/5 text-amber-400 hover:text-amber-300 active:scale-95 transition-all outline-none cursor-pointer"
          >
            ←
          </button>
        </div>

        {/* Submit verification bar */}
        <button
          onClick={handleVerify}
          className="w-full py-4 rounded-xl font-semibold uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
          style={{
            backgroundColor: '#00d2ff',
            color: '#0f172a',
            boxShadow: '0 0 15px rgba(0, 210, 255, 0.35)'
          }}
        >
          <Unlock className="w-4 h-4" />
          <span>Подтвердить Вход</span>
        </button>

        {errorCount > 0 && (
          <div className="text-[10px] text-center text-rose-400/60 font-mono mt-4">
            Внимание: Ведутся логи безопасности. Ошибок: {errorCount}/5
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

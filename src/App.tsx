/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SotorikoConfig } from './types';
import { DEFAULT_CONFIG } from './defaults';
import MainBioPage from './components/MainBioPage';
import Dashboard from './components/Dashboard';
import SecurityGate from './components/SecurityGate';
import { AnimatePresence } from 'motion/react';

export default function App() {
  const [config, setConfig] = useState<SotorikoConfig>(DEFAULT_CONFIG);
  const [view, setView] = useState<'bio' | 'admin'>('bio');
  const [authRequired, setAuthRequired] = useState<boolean>(false);

  // Load configuration and inspect hash of address bar
  useEffect(() => {
    const saved = localStorage.getItem('sotoriko_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure proper merge with default state to prevent missing keys on older configurations
        setConfig({
          ...DEFAULT_CONFIG,
          ...parsed
        });
      } catch (err) {
        console.error('Failed to parse cached configuration, resetting default: ', err);
        setConfig(DEFAULT_CONFIG);
      }
    } else {
      setConfig(DEFAULT_CONFIG);
    }

    // Hash routing for direct designer access
    const checkLocHash = () => {
      if (window.location.hash === '#admin') {
        const lockValue = sessionStorage.getItem('admin_lock');
        if (lockValue === '152515') {
          setView('admin');
        } else {
          setAuthRequired(true);
        }
      } else {
        setView('bio');
      }
    };

    checkLocHash();
    window.addEventListener('hashchange', checkLocHash);
    return () => window.removeEventListener('hashchange', checkLocHash);
  }, []);

  // Set the dashboard state on authorized security entry
  const handleAuthorizeSuccess = () => {
    sessionStorage.setItem('admin_lock', '152515');
    setAuthRequired(false);
    setView('admin');
    window.location.hash = '#admin';
  };

  const handleSaveConfig = () => {
    localStorage.setItem('sotoriko_config', JSON.stringify(config));
  };

  const handleResetConfig = () => {
    if (window.confirm('Вы уверены, что хотите сбросить все ваши кастомные настройки к авторскому оригиналу?')) {
      setConfig(DEFAULT_CONFIG);
      localStorage.setItem('sotoriko_config', JSON.stringify(DEFAULT_CONFIG));
    }
  };

  const handleExitAdmin = () => {
    setView('bio');
    window.location.hash = '';
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 font-sans text-slate-100 antialiased overflow-x-hidden">
      
      {/* View router switcher */}
      {view === 'admin' ? (
        <Dashboard
          config={config}
          onUpdateConfig={setConfig}
          onSave={handleSaveConfig}
          onReset={handleResetConfig}
          onExit={handleExitAdmin}
        />
      ) : (
        <MainBioPage
          config={config}
          onEnterAdmin={() => {
            const lockValue = sessionStorage.getItem('admin_lock');
            if (lockValue === '152515') {
              setView('admin');
              window.location.hash = '#admin';
            } else {
              setAuthRequired(true);
            }
          }}
        />
      )}

      {/* Security Gate Overlay when hash loading directly */}
      <AnimatePresence>
        {authRequired && (
          <SecurityGate
            onSuccess={handleAuthorizeSuccess}
            onClose={() => {
              setAuthRequired(false);
              window.location.hash = '';
            }}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

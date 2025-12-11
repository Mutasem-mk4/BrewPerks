import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

export const InstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if app is already installed (standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandalone) return;

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
      setDeferredPrompt(null);
    }
  };

  if (!isVisible) return null;

  return (
    // Position adjusted: bottom-20 on mobile to clear the BottomNav, bottom-6 on desktop
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50 animate-in slide-in-from-bottom-10 duration-500">
      <div className="bg-coffee-900 text-white rounded-2xl shadow-2xl p-4 flex items-center justify-between border border-coffee-700/50 backdrop-blur-sm bg-opacity-95">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-sm">
             <Smartphone size={20} className="text-coffee-100" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Get the App</h4>
            <p className="text-[10px] text-coffee-200/80 uppercase tracking-wide">Better experience</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsVisible(false)}
            className="text-white/60 hover:text-white p-1 transition-colors"
          >
            <X size={18} />
          </button>
          <button 
            onClick={handleInstallClick}
            className="bg-white text-coffee-900 px-4 py-2 rounded-lg text-xs font-bold tracking-wide hover:bg-coffee-50 transition-colors flex items-center gap-2 shadow-lg"
          >
            INSTALL
          </button>
        </div>
      </div>
    </div>
  );
};
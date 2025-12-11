import React from 'react';
import { Home, Coffee, LayoutDashboard } from 'lucide-react';
import { AppView, Language } from '../types';
import { getTranslation } from '../utils/translations';

interface BottomNavProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  language: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate, language }) => {
  const t = getTranslation(language);
  
  const scrollToCafes = () => {
    if (currentView === 'dashboard') {
      onNavigate('home');
      setTimeout(() => {
        document.getElementById('cafe-list-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }

    const listElement = document.getElementById('cafe-list-section');
    if (listElement) {
      listElement.scrollIntoView({ behavior: 'smooth' });
    } else {
        onNavigate('home');
        setTimeout(() => {
            document.getElementById('cafe-list-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
  };

  const navItemClass = (isActive: boolean) => `
    flex flex-col items-center justify-center gap-1 w-full h-full
    transition-colors duration-200
    ${isActive ? 'text-coffee-900 dark:text-coffee-100' : 'text-coffee-400 dark:text-coffee-500 hover:text-coffee-600 dark:hover:text-coffee-300'}
  `;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-coffee-900 border-t border-coffee-100 dark:border-coffee-800 pb-safe shadow-[0_-4px_20px_-2px_rgba(42,34,30,0.05)]">
      <div className="flex items-center justify-around h-16 px-2">
        
        <button 
          onClick={() => onNavigate('home')}
          className={navItemClass(currentView === 'home')}
        >
          <Home size={24} strokeWidth={currentView === 'home' ? 2.5 : 2} />
          <span className="text-[10px] font-bold tracking-wide">{t.nav.home}</span>
        </button>

        <button 
          onClick={scrollToCafes}
          className={navItemClass(currentView === 'home' && false)}
        >
          <Coffee size={24} strokeWidth={2} />
          <span className="text-[10px] font-bold tracking-wide">{t.nav.explore}</span>
        </button>

        <button 
          onClick={() => onNavigate('dashboard')}
          className={navItemClass(currentView === 'dashboard')}
        >
          <LayoutDashboard size={24} strokeWidth={currentView === 'dashboard' ? 2.5 : 2} />
          <span className="text-[10px] font-bold tracking-wide">{t.nav.partner}</span>
        </button>

      </div>
    </div>
  );
};
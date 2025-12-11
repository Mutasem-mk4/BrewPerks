import React from 'react';
import { Coffee, ArrowLeft, Moon, Sun, Globe } from 'lucide-react';
import { AppView, Language } from '../types';
import { getTranslation } from '../utils/translations';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onBack?: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  language: Language;
  toggleLanguage: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentView, 
  onNavigate, 
  onBack, 
  isDarkMode, 
  toggleTheme,
  language,
  toggleLanguage
}) => {
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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 pt-safe transition-all duration-300">
      <div className="container mx-auto max-w-5xl px-4 pt-4">
        <div className="glass-panel rounded-full px-5 py-3 flex items-center justify-between shadow-soft transition-colors duration-300">
          
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => onNavigate('home')}>
            <div className="bg-coffee-900 dark:bg-coffee-100 text-white dark:text-coffee-900 p-2 rounded-full transition-transform group-hover:scale-105">
              <Coffee size={18} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-serif font-bold tracking-tight text-coffee-900 dark:text-coffee-50">BrewPerks</span>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-coffee-600 dark:text-coffee-300">
              <button onClick={() => onNavigate('home')} className={`hover:text-coffee-900 dark:hover:text-coffee-50 transition-colors ${currentView === 'home' ? 'text-coffee-900 dark:text-coffee-50 font-bold' : ''}`}>
                {t.nav.home}
              </button>
              <button onClick={scrollToCafes} className="hover:text-coffee-900 dark:hover:text-coffee-50 transition-colors">
                {t.nav.cafes}
              </button>
              <button 
                onClick={() => onNavigate('dashboard')}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all shadow-md active:scale-95 ${currentView === 'dashboard' ? 'bg-coffee-100 dark:bg-coffee-800 text-coffee-900 dark:text-coffee-100 border border-coffee-200 dark:border-coffee-700' : 'bg-coffee-900 dark:bg-coffee-100 text-coffee-50 dark:text-coffee-900 hover:bg-coffee-800 dark:hover:bg-coffee-200'}`}
              >
                {t.nav.partner}
              </button>
            </div>

            <div className="w-px h-6 bg-coffee-200 dark:bg-coffee-700 hidden md:block"></div>

            {/* Language Toggle */}
            <button 
              onClick={toggleLanguage}
              className="flex items-center justify-center w-8 h-8 md:w-auto md:h-auto md:px-3 md:py-1.5 rounded-full hover:bg-coffee-100 dark:hover:bg-coffee-800 text-coffee-600 dark:text-coffee-300 transition-colors font-bold text-xs gap-1"
              aria-label="Switch Language"
            >
              <Globe size={18} />
              <span className="hidden md:inline uppercase">{language === 'en' ? 'Ar' : 'En'}</span>
            </button>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-coffee-100 dark:hover:bg-coffee-800 text-coffee-600 dark:text-coffee-300 transition-colors"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Mobile Back Button (only shown in detailed views) */}
            <div className="md:hidden">
              {currentView === 'pass' && (
                <button 
                  onClick={onBack}
                  className="p-2 text-coffee-700 dark:text-coffee-200 hover:bg-coffee-100 dark:hover:bg-coffee-800 rounded-full transition-colors"
                >
                  <ArrowLeft size={22} className="rtl:rotate-180" />
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
};
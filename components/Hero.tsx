import React, { useState } from 'react';
import { Search, MapPin, ArrowRight, Map, Tag, QrCode } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';

interface HeroProps {
  onSearch: (query: string) => void;
  onUseLocation: () => void;
  loading: boolean;
  language: Language;
}

const JORDAN_GOVERNORATES = [
  "Amman", "Zarqa", "Irbid", "Balqa", "Karak", "Ma'an", 
  "Aqaba", "Mafraq", "Tafilah", "Madaba", "Jerash", "Ajloun"
];

export const Hero: React.FC<HeroProps> = ({ onSearch, onUseLocation, loading, language }) => {
  const [input, setInput] = useState('');
  const [selectedGovernorate, setSelectedGovernorate] = useState('');
  const t = getTranslation(language);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let query = '';
    
    if (selectedGovernorate && input.trim()) {
      query = `Coffee shops in ${selectedGovernorate}, Jordan matching "${input}"`;
    } else if (selectedGovernorate) {
      query = `Best coffee shops in ${selectedGovernorate}, Jordan`;
    } else if (input.trim()) {
      query = input;
    } else {
      return; // Do nothing if empty
    }
    
    onSearch(query);
  };

  return (
    <div className="relative pt-36 pb-24 md:pt-48 md:pb-32 overflow-hidden">
      {/* Abstract Background Shapes - Softened */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[800px] h-[800px] bg-coffee-100/60 dark:bg-coffee-900/30 rounded-full blur-[120px] opacity-50 transition-colors duration-1000 rtl:left-0 rtl:right-auto rtl:-ml-20 rtl:-mr-0"></div>
      <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-[500px] h-[500px] bg-stone-100 dark:bg-coffee-800/20 rounded-full blur-[100px] opacity-40 transition-colors duration-1000 rtl:right-0 rtl:left-auto rtl:-mr-10 rtl:-ml-0"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          
          {/* Left Column: Text & Search */}
          <div className="flex-1 text-center lg:text-start rtl:lg:text-right space-y-10">
            <div className="inline-block animate-in fade-in slide-in-from-bottom-4 duration-700">
               <span className="px-5 py-2 rounded-full border border-coffee-200/50 dark:border-coffee-700/50 bg-white/40 dark:bg-coffee-900/40 text-[11px] md:text-xs font-bold tracking-widest text-coffee-600 dark:text-coffee-300 uppercase backdrop-blur-md flex items-center gap-2 w-fit mx-auto lg:mx-0 shadow-sm">
                  <Tag size={14} className="text-coffee-500" />
                  {t.hero.badge}
               </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-serif font-medium text-coffee-900 dark:text-coffee-50 leading-[1.15] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 transition-colors whitespace-pre-line tracking-tight">
              {t.hero.title}
            </h1>
            
            <p className="text-lg md:text-xl text-coffee-600 dark:text-coffee-200 font-light leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200 transition-colors max-w-xl mx-auto lg:mx-0 opacity-90">
              {t.hero.subtitle}
            </p>

            <div className="pt-6 max-w-xl mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <form onSubmit={handleSubmit} className="relative group flex flex-col md:flex-row bg-white dark:bg-coffee-900 p-2 rounded-3xl shadow-soft border border-coffee-100 dark:border-coffee-800/50 transition-all hover:shadow-comfort focus-within:ring-4 focus-within:ring-coffee-100/50 dark:focus-within:ring-coffee-800/50">
                
                {/* Governorate Dropdown */}
                <div className="relative md:w-1/3 border-b md:border-b-0 md:border-r rtl:md:border-r-0 rtl:md:border-l border-coffee-100 dark:border-coffee-800">
                  <div className="absolute inset-y-0 left-5 rtl:left-auto rtl:right-5 flex items-center pointer-events-none text-coffee-400 dark:text-coffee-500">
                    <Map size={20} className="opacity-70" />
                  </div>
                  <select
                    value={selectedGovernorate}
                    onChange={(e) => setSelectedGovernorate(e.target.value)}
                    className="w-full h-full pl-12 pr-8 rtl:pr-12 rtl:pl-8 py-4 md:py-0 bg-transparent outline-none text-coffee-800 dark:text-coffee-200 font-medium text-sm appearance-none cursor-pointer"
                  >
                    <option value="" className="dark:bg-coffee-900">{t.hero.allJordan}</option>
                    {JORDAN_GOVERNORATES.map(gov => (
                      <option key={gov} value={gov} className="dark:bg-coffee-900">{gov}</option>
                    ))}
                  </select>
                </div>

                {/* Keyword Input */}
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-5 rtl:left-auto rtl:right-5 flex items-center pointer-events-none text-coffee-400 dark:text-coffee-500">
                    <Search size={20} className="opacity-70" />
                  </div>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t.hero.searchPlaceholder}
                    className="w-full h-full pl-12 pr-4 rtl:pr-12 rtl:pl-4 py-4 md:py-0 bg-transparent outline-none text-coffee-900 dark:text-coffee-100 placeholder-coffee-300 dark:placeholder-coffee-500 text-sm"
                  />
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-coffee-900 dark:bg-coffee-100 text-coffee-50 dark:text-coffee-900 px-8 py-3.5 rounded-2xl font-bold hover:bg-coffee-800 dark:hover:bg-coffee-200 transition-all disabled:opacity-80 flex items-center justify-center gap-2 whitespace-nowrap shadow-md hover:shadow-lg transform active:scale-95"
                >
                  {loading ? '...' : t.hero.search}
                  {!loading && <ArrowRight size={18} className="rtl:rotate-180" />}
                </button>
              </form>
              
              <div className="mt-5 flex justify-center lg:justify-start">
                <button 
                  onClick={onUseLocation}
                  className="group flex items-center gap-2 text-xs font-bold text-coffee-500 dark:text-coffee-400 hover:text-coffee-800 dark:hover:text-coffee-200 transition-colors uppercase tracking-wide px-3 py-2 rounded-xl hover:bg-white/50 dark:hover:bg-coffee-800/50"
                >
                  <span className="p-1.5 rounded-full bg-coffee-100 dark:bg-coffee-800 group-hover:bg-coffee-200 dark:group-hover:bg-coffee-700 transition-colors text-coffee-600 dark:text-coffee-300">
                      <MapPin size={14} />
                  </span>
                  <span>{t.hero.nearMe}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Offer Card */}
          <div className="flex-1 relative w-full max-w-sm lg:max-w-md mx-auto animate-in fade-in slide-in-from-right-8 duration-1000 delay-200 hidden md:block group perspective-1000">
             <div className="relative z-10 transform rotate-[-3deg] hover:rotate-0 transition-transform duration-700 ease-out">
                {/* The Card */}
                <div className="bg-gradient-to-br from-[#3D332A] to-[#54473A] rounded-3xl p-8 text-white shadow-comfort border border-white/5 relative overflow-hidden h-72 flex flex-col justify-between">
                   <div className="absolute top-0 right-0 -mr-20 -mt-20 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
                   <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-40 h-40 bg-coffee-400/10 rounded-full blur-2xl"></div>

                   <div className="flex justify-between items-start z-10">
                      <div>
                         <p className="text-[10px] uppercase tracking-[0.2em] text-coffee-200 opacity-90 font-medium">{t.hero.promoCard.title}</p>
                         <h3 className="text-4xl font-serif mt-2 font-medium tracking-tight text-coffee-50">{t.hero.promoCard.discount}</h3>
                         <p className="text-sm text-coffee-100/80 mt-1 font-light">{t.hero.promoCard.desc}</p>
                      </div>
                      <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-md border border-white/5">
                         <QrCode size={28} className="text-coffee-50" />
                      </div>
                   </div>

                   <div className="z-10 flex items-end justify-between">
                      <div className="flex gap-2">
                         <div className="w-9 h-9 rounded-full bg-coffee-300/20 border border-white/10 backdrop-blur-sm"></div>
                         <div className="w-9 h-9 rounded-full bg-coffee-300/20 border border-white/10 backdrop-blur-sm -ml-4 rtl:-mr-4 rtl:ml-0"></div>
                         <div className="w-9 h-9 rounded-full bg-coffee-200 text-coffee-900 border border-white/10 -ml-4 rtl:-mr-4 rtl:ml-0 flex items-center justify-center text-[9px] font-bold shadow-sm">+2k</div>
                      </div>
                      <button className="bg-[#F9F8F6] text-[#3D332A] px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-white transition-colors shadow-lg tracking-wide">
                        Claim Now
                      </button>
                   </div>
                </div>
             </div>

             {/* Decorative Elements behind card - Softer */}
             <div className="absolute top-8 -right-8 w-full h-full bg-coffee-200/50 dark:bg-coffee-800/40 rounded-3xl -z-10 rotate-[4deg] blur-sm transition-transform duration-700 group-hover:rotate-[2deg] group-hover:blur-0"></div>
          </div>

        </div>
      </div>
    </div>
  );
};
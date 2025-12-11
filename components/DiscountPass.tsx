import React, { useEffect, useState } from 'react';
import { X, QrCode, Clock, Utensils, CreditCard } from 'lucide-react';
import { Cafe } from '../types';

interface DiscountPassProps {
  cafe: Cafe;
  onClose: () => void;
}

export const DiscountPass: React.FC<DiscountPassProps> = ({ cafe, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(600);
  const [activeTab, setActiveTab] = useState<'pass' | 'menu'>('menu');
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coffee-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#FAF9F6] dark:bg-coffee-950 w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl relative flex flex-col max-h-[85vh] border border-white/20 dark:border-coffee-800">
        
        {/* Header Image Area */}
        <div className="relative h-32 shrink-0">
             <div className="absolute inset-0">
                 <img src={cafe.imageUrl} className="w-full h-full object-cover opacity-90" alt="" />
                 <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70"></div>
             </div>
             <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-white/90 hover:text-white bg-black/20 hover:bg-black/40 backdrop-blur-sm p-2 rounded-full transition-colors z-10"
             >
                <X size={20} />
             </button>
             <div className="absolute bottom-4 left-6 text-white">
                 <h2 className="text-3xl font-serif font-medium">{cafe.name}</h2>
             </div>
        </div>

        {/* Tabs */}
        <div className="flex p-2 gap-2 bg-white dark:bg-coffee-900 shrink-0 border-b border-coffee-100 dark:border-coffee-800">
          <button 
            onClick={() => setActiveTab('menu')}
            className={`flex-1 py-2.5 text-xs font-bold tracking-wide uppercase rounded-xl flex items-center justify-center gap-2 transition-all ${activeTab === 'menu' ? 'bg-coffee-100 dark:bg-coffee-800 text-coffee-900 dark:text-coffee-100' : 'text-coffee-400 dark:text-coffee-500 hover:bg-coffee-50 dark:hover:bg-coffee-800'}`}
          >
            <Utensils size={14} />
            Menu
          </button>
          <button 
            onClick={() => setActiveTab('pass')}
            className={`flex-1 py-2.5 text-xs font-bold tracking-wide uppercase rounded-xl flex items-center justify-center gap-2 transition-all ${activeTab === 'pass' ? 'bg-coffee-900 dark:bg-coffee-100 text-white dark:text-coffee-900 shadow-md' : 'text-coffee-400 dark:text-coffee-500 hover:bg-coffee-50 dark:hover:bg-coffee-800'}`}
          >
            <CreditCard size={14} />
            Pass
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 scrollbar-hide bg-[#FAF9F6] dark:bg-coffee-950">
          
          {activeTab === 'pass' && (
            <div className="flex flex-col items-center animate-in slide-in-from-right-8 duration-500">
               
               {/* Digital Card Design */}
               <div className="w-full bg-gradient-to-br from-coffee-800 to-black rounded-2xl p-6 text-white shadow-xl mb-6 relative overflow-hidden border border-white/10">
                  <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-coffee-500 rounded-full blur-3xl opacity-30"></div>
                  
                  <div className="relative z-10 flex justify-between items-start mb-8">
                      <div>
                          <p className="text-[10px] uppercase tracking-widest text-coffee-300 mb-1">BrewPerks Exclusive</p>
                          <h3 className="text-xl font-serif italic">VIP Member</h3>
                      </div>
                      <div className="text-right">
                          <p className="text-3xl font-bold text-coffee-100">15%</p>
                          <p className="text-[10px] uppercase tracking-wide">Discount</p>
                      </div>
                  </div>

                  <div className="relative z-10 flex items-end justify-between">
                      <div className="font-mono text-sm opacity-80 tracking-wider">**** **** 4291</div>
                      <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-lg backdrop-blur-sm">
                          <Clock size={12} />
                          <span className="font-mono font-bold text-sm">{formatTime(timeLeft)}</span>
                      </div>
                  </div>
               </div>

              <div className="bg-white dark:bg-coffee-900 border border-coffee-100 dark:border-coffee-800 p-6 rounded-2xl mb-4 w-full flex flex-col items-center shadow-sm">
                <QrCode size={140} className="text-coffee-900 dark:text-coffee-100 mb-4" />
                <p className="text-xs text-coffee-400 dark:text-coffee-500 text-center uppercase tracking-wide">Scan at counter</p>
              </div>

              {cafe.mapLink && (
                  <a href={cafe.mapLink} target="_blank" rel="noreferrer" className="text-coffee-600 dark:text-coffee-300 text-xs font-bold hover:text-coffee-900 dark:hover:text-coffee-100 border-b border-coffee-300 dark:border-coffee-600 pb-0.5">
                    View Location on Maps
                  </a>
                )}
            </div>
          )}

          {activeTab === 'menu' && (
            <div className="animate-in slide-in-from-left-8 duration-500">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-serif font-bold text-coffee-900 dark:text-coffee-50">Signatures & Classics</h3>
              </div>
              
              <div className="space-y-3">
                {cafe.menu && cafe.menu.length > 0 ? (
                  cafe.menu.map((item, idx) => (
                    <div key={idx} className="group bg-white dark:bg-coffee-900 p-4 rounded-xl border border-coffee-100 dark:border-coffee-800 shadow-sm hover:shadow-md transition-all">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-coffee-800 dark:text-coffee-200 text-sm group-hover:text-coffee-600 dark:group-hover:text-coffee-100">{item.name}</h4>
                          {item.description && (
                            <p className="text-xs text-coffee-400 dark:text-coffee-500 mt-1">{item.description}</p>
                          )}
                        </div>
                        <span className="font-serif font-bold text-coffee-900 dark:text-coffee-100 text-sm">
                          {item.price}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-coffee-400 py-4 italic">Menu loading...</p>
                )}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-coffee-100/50 dark:bg-coffee-800/50 border border-coffee-100 dark:border-coffee-800 text-center">
                 <button 
                  onClick={() => setActiveTab('pass')}
                  className="text-sm font-bold text-coffee-800 dark:text-coffee-200 hover:text-coffee-600 dark:hover:text-coffee-100 underline"
                >
                  View Discount Pass
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
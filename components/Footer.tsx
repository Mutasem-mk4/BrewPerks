import React from 'react';
import { Coffee, Instagram, Twitter, Facebook } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-coffee-900 border-t border-coffee-100 dark:border-coffee-800 text-coffee-800 dark:text-coffee-200 py-12 mt-auto">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-coffee-900 dark:bg-coffee-100 p-2 rounded-full text-white dark:text-coffee-900">
              <Coffee size={20} />
            </div>
            <span className="text-xl font-serif font-bold tracking-tight text-coffee-900 dark:text-coffee-50">BrewPerks</span>
          </div>
          
          <div className="flex gap-6 text-coffee-400 dark:text-coffee-500">
            <a href="#" className="hover:text-coffee-900 dark:hover:text-coffee-200 transition-colors p-2 hover:bg-coffee-50 dark:hover:bg-coffee-800 rounded-full"><Instagram size={20} /></a>
            <a href="#" className="hover:text-coffee-900 dark:hover:text-coffee-200 transition-colors p-2 hover:bg-coffee-50 dark:hover:bg-coffee-800 rounded-full"><Twitter size={20} /></a>
            <a href="#" className="hover:text-coffee-900 dark:hover:text-coffee-200 transition-colors p-2 hover:bg-coffee-50 dark:hover:bg-coffee-800 rounded-full"><Facebook size={20} /></a>
          </div>
        </div>
        
        <div className="border-t border-coffee-50 dark:border-coffee-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs font-medium text-coffee-400 uppercase tracking-wide">
          <p>&copy; {new Date().getFullYear()} BrewPerks. Crafted in Jordan.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-coffee-900 dark:hover:text-coffee-200 transition-colors">Privacy</a>
            <a href="#" className="hover:text-coffee-900 dark:hover:text-coffee-200 transition-colors">Terms</a>
            <a href="#" className="hover:text-coffee-900 dark:hover:text-coffee-200 transition-colors">Partners</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
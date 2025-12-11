import React from 'react';
import { Star, ArrowUpRight } from 'lucide-react';
import { Cafe } from '../types';

interface CafeCardProps {
  cafe: Cafe;
  onSelect: (cafe: Cafe) => void;
}

export const CafeCard: React.FC<CafeCardProps> = ({ cafe, onSelect }) => {
  return (
    <div 
      className="group bg-white dark:bg-coffee-900/60 rounded-3xl p-4 shadow-soft hover:shadow-comfort transition-all duration-500 cursor-pointer transform hover:-translate-y-1"
      onClick={() => onSelect(cafe)}
    >
      <div className="relative h-64 overflow-hidden rounded-2xl bg-coffee-100 dark:bg-coffee-800">
        <img 
          src={cafe.imageUrl} 
          alt={cafe.name} 
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-coffee-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>
        
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-coffee-950/80 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold text-coffee-900 dark:text-coffee-100 shadow-sm">
          <Star size={12} className="fill-yellow-500 text-yellow-500" />
          {cafe.rating}
        </div>

        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 scale-90 group-hover:scale-100">
             <div className="bg-white dark:bg-coffee-100 p-2.5 rounded-full text-coffee-900 shadow-lg">
                 <ArrowUpRight size={18} />
             </div>
        </div>
      </div>
      
      <div className="pt-5 px-1 pb-1">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-serif font-bold text-coffee-900 dark:text-coffee-50 leading-tight">{cafe.name}</h3>
        </div>
        
        <p className="text-coffee-600 dark:text-coffee-300 text-sm mb-5 line-clamp-2 leading-relaxed opacity-90">{cafe.description}</p>
        
        <div className="flex flex-wrap gap-2">
          {cafe.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="bg-coffee-50 dark:bg-coffee-800/80 text-coffee-600 dark:text-coffee-200 text-[11px] uppercase tracking-wider font-semibold px-3 py-1.5 rounded-lg">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
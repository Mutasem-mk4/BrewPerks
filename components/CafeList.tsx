import React from 'react';
import { Cafe } from '../types';
import { CafeCard } from './CafeCard';

interface CafeListProps {
  cafes: Cafe[];
  onSelect: (cafe: Cafe) => void;
}

export const CafeList: React.FC<CafeListProps> = ({ cafes, onSelect }) => {
  if (cafes.length === 0) {
    return (
      <div className="text-center py-20 text-coffee-500">
        <h3 className="text-xl font-semibold mb-2">No cafes found yet</h3>
        <p>Try searching for a city or neighborhood!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cafes.map((cafe) => (
        <CafeCard key={cafe.id} cafe={cafe} onSelect={onSelect} />
      ))}
    </div>
  );
};
import React, { useState } from 'react';
import { Cafe } from '../types';
import { Plus, Edit2, Search, BarChart3, TrendingUp, Users } from 'lucide-react';
import { CafeForm } from './CafeForm';

interface DashboardProps {
  managedCafes: Cafe[];
  onSaveCafe: (cafe: Cafe) => void;
  onDeleteCafe?: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ managedCafes, onSaveCafe }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddNew = () => {
    setSelectedCafe(null);
    setIsEditing(true);
  };

  const handleEdit = (cafe: Cafe) => {
    setSelectedCafe(cafe);
    setIsEditing(true);
  };

  const handleSave = (cafe: Cafe) => {
    onSaveCafe(cafe);
    setIsEditing(false);
    setSelectedCafe(null);
  };

  const filteredCafes = managedCafes.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-24 md:py-32 max-w-7xl">
      {isEditing ? (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 max-w-4xl mx-auto">
            <div className="mb-6">
                <button onClick={() => setIsEditing(false)} className="text-sm font-bold text-coffee-500 hover:text-coffee-900 dark:hover:text-coffee-200 flex items-center gap-2 transition-colors">
                    &larr; BACK TO DASHBOARD
                </button>
            </div>
          <CafeForm 
            initialData={selectedCafe} 
            onSave={handleSave} 
            onCancel={() => setIsEditing(false)} 
          />
        </div>
      ) : (
        <>
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-coffee-900 dark:text-coffee-50 mb-2">Overview</h1>
                    <p className="text-coffee-500 dark:text-coffee-400">Welcome back, Partner.</p>
                </div>
                <button 
                    onClick={handleAddNew}
                    className="bg-coffee-900 dark:bg-coffee-100 text-white dark:text-coffee-900 px-6 py-3 rounded-xl font-bold text-sm tracking-wide shadow-lg hover:bg-coffee-800 dark:hover:bg-coffee-200 transition-all flex items-center gap-2"
                >
                    <Plus size={18} /> ADD NEW VENUE
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white dark:bg-coffee-900 p-6 rounded-2xl border border-coffee-100 dark:border-coffee-800 shadow-sm flex items-start justify-between">
                    <div>
                        <p className="text-xs font-bold text-coffee-400 uppercase tracking-wider mb-1">Total Venues</p>
                        <h3 className="text-3xl font-serif font-bold text-coffee-900 dark:text-coffee-50">{managedCafes.length}</h3>
                    </div>
                    <div className="bg-coffee-50 dark:bg-coffee-800 p-3 rounded-xl text-coffee-600 dark:text-coffee-300">
                        <BarChart3 size={24} />
                    </div>
                </div>
                <div className="bg-white dark:bg-coffee-900 p-6 rounded-2xl border border-coffee-100 dark:border-coffee-800 shadow-sm flex items-start justify-between">
                    <div>
                        <p className="text-xs font-bold text-coffee-400 uppercase tracking-wider mb-1">Total Menu Items</p>
                        <h3 className="text-3xl font-serif font-bold text-coffee-900 dark:text-coffee-50">
                            {managedCafes.reduce((acc, cafe) => acc + cafe.menu.length, 0)}
                        </h3>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl text-green-600 dark:text-green-400">
                        <TrendingUp size={24} />
                    </div>
                </div>
                <div className="bg-white dark:bg-coffee-900 p-6 rounded-2xl border border-coffee-100 dark:border-coffee-800 shadow-sm flex items-start justify-between">
                    <div>
                        <p className="text-xs font-bold text-coffee-400 uppercase tracking-wider mb-1">Active Passes</p>
                        <h3 className="text-3xl font-serif font-bold text-coffee-900 dark:text-coffee-50">24</h3>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl text-blue-600 dark:text-blue-400">
                        <Users size={24} />
                    </div>
                </div>
            </div>

            {/* Content Table */}
            <div className="bg-white dark:bg-coffee-900 rounded-3xl shadow-soft border border-coffee-100 dark:border-coffee-800 overflow-hidden">
                <div className="p-6 border-b border-coffee-50 dark:border-coffee-800 flex items-center gap-4 bg-white dark:bg-coffee-900">
                    <div className="relative flex-grow max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-300 dark:text-coffee-600" size={18} />
                        <input 
                            type="text" 
                            placeholder="Filter cafes..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-coffee-50 dark:bg-coffee-800 border border-coffee-100 dark:border-coffee-700 focus:outline-none focus:border-coffee-300 dark:focus:border-coffee-500 text-sm transition-all text-coffee-900 dark:text-coffee-100 placeholder-coffee-400 dark:placeholder-coffee-600"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-coffee-50 dark:bg-coffee-800/50 text-coffee-500 dark:text-coffee-400 text-xs uppercase tracking-wider font-semibold">
                            <tr>
                                <th className="px-6 py-4">Venue</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Rating</th>
                                <th className="px-6 py-4">Menu Size</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-coffee-50 dark:divide-coffee-800">
                            {filteredCafes.map((cafe) => (
                                <tr key={cafe.id} className="hover:bg-coffee-50/50 dark:hover:bg-coffee-800/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-coffee-200 dark:bg-coffee-700 overflow-hidden">
                                                <img src={cafe.imageUrl} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-coffee-900 dark:text-coffee-100">{cafe.name}</p>
                                                <p className="text-xs text-coffee-400 dark:text-coffee-500">{cafe.address || 'Location varies'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                                            Active
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-coffee-600 dark:text-coffee-300 font-medium">
                                        ★ {cafe.rating}
                                    </td>
                                    <td className="px-6 py-4 text-coffee-600 dark:text-coffee-300">
                                        {cafe.menu.length} items
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => handleEdit(cafe)}
                                            className="text-coffee-400 dark:text-coffee-500 hover:text-coffee-900 dark:hover:text-coffee-100 hover:bg-coffee-100 dark:hover:bg-coffee-700 p-2 rounded-lg transition-all"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredCafes.length === 0 && (
                        <div className="text-center py-12 text-coffee-400 dark:text-coffee-600">
                            <p>No venues found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
      )}
    </div>
  );
};
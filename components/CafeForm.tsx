import React, { useState, useEffect } from 'react';
import { Cafe, MenuItem } from '../types';
import { Save, Plus, Trash2, X, Image as ImageIcon } from 'lucide-react';

interface CafeFormProps {
  initialData?: Cafe | null;
  onSave: (cafe: Cafe) => void;
  onCancel: () => void;
}

export const CafeForm: React.FC<CafeFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Cafe>({
    id: '',
    name: '',
    description: '',
    address: '',
    rating: '5.0',
    mapLink: '',
    tags: [],
    imageUrl: '',
    menu: []
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setTagInput(initialData.tags.join(', '));
    } else {
      setFormData({
        id: `local-${Date.now()}`,
        name: '',
        description: '',
        address: '',
        rating: '5.0',
        mapLink: '',
        tags: [],
        imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=400',
        menu: [
            { name: 'Espresso', price: '2.00 JOD', description: 'Single shot' },
            { name: 'Latte', price: '3.50 JOD', description: 'Steamed milk' }
        ]
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
    setFormData(prev => ({ 
      ...prev, 
      tags: e.target.value.split(',').map(t => t.trim()).filter(t => t.length > 0)
    }));
  };

  const handleMenuChange = (index: number, field: keyof MenuItem, value: string) => {
    const updatedMenu = [...formData.menu];
    updatedMenu[index] = { ...updatedMenu[index], [field]: value };
    setFormData(prev => ({ ...prev, menu: updatedMenu }));
  };

  const addMenuItem = () => {
    setFormData(prev => ({
      ...prev,
      menu: [...prev.menu, { name: '', price: '', description: '' }]
    }));
  };

  const removeMenuItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      menu: prev.menu.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white dark:bg-coffee-900 rounded-3xl shadow-lg border border-coffee-100 dark:border-coffee-800 overflow-hidden">
      <div className="bg-coffee-50/50 dark:bg-coffee-800/50 backdrop-blur px-8 py-6 border-b border-coffee-100 dark:border-coffee-800 flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-serif font-bold text-coffee-900 dark:text-coffee-50">
             {initialData ? 'Edit Details' : 'New Partnership'}
           </h2>
           <p className="text-xs text-coffee-500 dark:text-coffee-400 uppercase tracking-wide mt-1">Venue Information</p>
        </div>
        <button onClick={onCancel} className="text-coffee-400 dark:text-coffee-500 hover:text-coffee-800 dark:hover:text-coffee-200 transition-colors p-2 hover:bg-coffee-100 dark:hover:bg-coffee-800 rounded-full">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="group">
              <label className="block text-xs font-bold text-coffee-500 dark:text-coffee-400 uppercase tracking-wide mb-2">Cafe Name</label>
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-coffee-50 dark:bg-coffee-800 rounded-xl border border-coffee-200 dark:border-coffee-700 focus:ring-2 focus:ring-coffee-200 focus:border-coffee-400 outline-none transition-all font-serif text-lg text-coffee-900 dark:text-coffee-50"
                placeholder="e.g. The Royal Grind"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-coffee-500 dark:text-coffee-400 uppercase tracking-wide mb-2">Description</label>
              <textarea
                required
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-coffee-50 dark:bg-coffee-800 rounded-xl border border-coffee-200 dark:border-coffee-700 focus:ring-2 focus:ring-coffee-200 focus:border-coffee-400 outline-none resize-none transition-all text-sm text-coffee-700 dark:text-coffee-200"
                placeholder="Tell us about the atmosphere and specialty..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-coffee-500 dark:text-coffee-400 uppercase tracking-wide mb-2">Tags</label>
              <input
                name="tags"
                value={tagInput}
                onChange={handleTagChange}
                className="w-full px-4 py-3 bg-coffee-50 dark:bg-coffee-800 rounded-xl border border-coffee-200 dark:border-coffee-700 focus:ring-2 focus:ring-coffee-200 focus:border-coffee-400 outline-none transition-all text-sm text-coffee-900 dark:text-coffee-200"
                placeholder="Cozy, WiFi, Patio (comma separated)"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-coffee-500 dark:text-coffee-400 uppercase tracking-wide mb-2">Cover Image URL</label>
              <input
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-coffee-50 dark:bg-coffee-800 rounded-xl border border-coffee-200 dark:border-coffee-700 focus:ring-2 focus:ring-coffee-200 focus:border-coffee-400 outline-none transition-all text-sm mb-3 text-coffee-900 dark:text-coffee-200"
                placeholder="https://..."
              />
              <div className="h-40 w-full bg-coffee-50 dark:bg-coffee-800 rounded-xl border-2 border-dashed border-coffee-200 dark:border-coffee-700 flex items-center justify-center overflow-hidden relative group">
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = '')} />
                ) : (
                  <div className="text-coffee-300 dark:text-coffee-600 flex flex-col items-center group-hover:text-coffee-400 transition-colors">
                    <ImageIcon size={32} />
                    <span className="text-xs mt-2 font-medium">Image Preview</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-coffee-500 dark:text-coffee-400 uppercase tracking-wide mb-2">Rating</label>
                    <input
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-coffee-50 dark:bg-coffee-800 rounded-xl border border-coffee-200 dark:border-coffee-700 outline-none text-sm text-coffee-900 dark:text-coffee-200"
                    />
                </div>
                 <div>
                    <label className="block text-xs font-bold text-coffee-500 dark:text-coffee-400 uppercase tracking-wide mb-2">Map Link</label>
                    <input
                        name="mapLink"
                        value={formData.mapLink}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-coffee-50 dark:bg-coffee-800 rounded-xl border border-coffee-200 dark:border-coffee-700 outline-none text-sm text-coffee-900 dark:text-coffee-200"
                        placeholder="Google Maps URL"
                    />
                </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-coffee-100 dark:border-coffee-800"></div>

        {/* Menu Editor */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-serif font-bold text-coffee-800 dark:text-coffee-100">Menu & Pricing</h3>
            <button 
              type="button" 
              onClick={addMenuItem}
              className="text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 text-coffee-600 dark:text-coffee-300 hover:text-white bg-coffee-100 dark:bg-coffee-800 hover:bg-coffee-900 dark:hover:bg-coffee-700 px-4 py-2 rounded-lg transition-all"
            >
              <Plus size={14} /> Add Item
            </button>
          </div>
          
          <div className="space-y-3 bg-coffee-50 dark:bg-coffee-800/50 p-6 rounded-2xl border border-coffee-100/50 dark:border-coffee-700/50 max-h-80 overflow-y-auto">
            {formData.menu.length === 0 && (
                <div className="text-center py-8 text-coffee-400">
                    <p className="font-serif italic text-lg">Your menu is empty</p>
                    <p className="text-xs">Add items to attract customers</p>
                </div>
            )}
            {formData.menu.map((item, index) => (
              <div key={index} className="flex gap-4 items-start animate-in slide-in-from-left-2 duration-300">
                <div className="flex-grow grid grid-cols-12 gap-4">
                  <div className="col-span-4">
                    <input
                      placeholder="Item Name"
                      value={item.name}
                      onChange={(e) => handleMenuChange(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-coffee-200 dark:border-coffee-600 bg-white dark:bg-coffee-700 focus:border-coffee-400 outline-none font-medium text-coffee-900 dark:text-coffee-100"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) => handleMenuChange(index, 'price', e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-coffee-200 dark:border-coffee-600 bg-white dark:bg-coffee-700 focus:border-coffee-400 outline-none font-mono text-coffee-900 dark:text-coffee-100"
                    />
                  </div>
                   <div className="col-span-6">
                    <input
                      placeholder="Description"
                      value={item.description || ''}
                      onChange={(e) => handleMenuChange(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-coffee-200 dark:border-coffee-600 bg-white dark:bg-coffee-700 focus:border-coffee-400 outline-none text-gray-500 dark:text-gray-400"
                    />
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => removeMenuItem(index)}
                  className="p-2 text-coffee-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors mt-0.5"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-8 py-3 rounded-xl border border-coffee-200 dark:border-coffee-700 text-coffee-600 dark:text-coffee-300 font-bold text-sm tracking-wide hover:bg-coffee-50 dark:hover:bg-coffee-800 transition-colors"
          >
            CANCEL
          </button>
          <button 
            type="submit"
            className="px-8 py-3 rounded-xl bg-coffee-900 dark:bg-coffee-100 text-white dark:text-coffee-900 font-bold text-sm tracking-wide hover:bg-coffee-800 dark:hover:bg-coffee-200 transition-colors shadow-lg flex items-center gap-2"
          >
            <Save size={16} />
            SAVE CHANGES
          </button>
        </div>
      </form>
    </div>
  );
};
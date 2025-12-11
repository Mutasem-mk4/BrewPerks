import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Hero } from './components/Hero';
import { CafeList } from './components/CafeList';
import { DiscountPass } from './components/DiscountPass';
import { Footer } from './components/Footer';
import { ChatAssistant } from './components/ChatAssistant';
import { Dashboard } from './components/Dashboard';
import { InstallBanner } from './components/InstallBanner';
import { Cafe, AppView, Language } from './types';
import { searchCafes } from './services/geminiService';
import { MapPin, Loader2, Sparkles } from 'lucide-react';
import { getTranslation } from './utils/translations';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  
  // Language State
  const [language, setLanguage] = useState<Language>('en');

  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Handle Theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#1C1612');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#F9F8F6');
    }
  }, [isDarkMode]);

  // Handle Language & Direction
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleLanguage = () => setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  
  const t = getTranslation(language);

  // Data sources
  const [fetchedCafes, setFetchedCafes] = useState<Cafe[]>([]);
  const [localCafes, setLocalCafes] = useState<Cafe[]>(() => {
    return [
      {
        id: 'local-demo-1',
        name: 'The Alchemist Coffee',
        description: 'Artisanal brewing in a minimalist industrial setting.',
        address: 'Downtown, Amman',
        rating: '4.9',
        tags: ['Specialty', 'Quiet', 'Workspace'],
        imageUrl: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=400',
        mapLink: 'https://maps.google.com',
        menu: [
            { name: 'V60 Ethiopian', price: '3.50 JOD', description: 'Floral notes with citrus finish' },
            { name: 'Salted Caramel Latte', price: '3.75 JOD', description: 'House-made caramel sauce' },
            { name: 'San Sebastian', price: '4.00 JOD', description: 'Creamy burnt cheesecake' }
        ]
      }
    ];
  });

  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [heroSearchTriggered, setHeroSearchTriggered] = useState(false);

  // Initial load
  useEffect(() => {
    const init = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (err) => console.log("Location access denied or error:", err)
        );
      }

      setLoading(true);
      try {
        const results = await searchCafes("Best coffee shops nearby", undefined, language);
        setFetchedCafes(results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [language]); // Reload initial cafes when language changes

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    setHeroSearchTriggered(true);
    
    const listElement = document.getElementById('cafe-list-section');
    if (listElement) {
      listElement.scrollIntoView({ behavior: 'smooth' });
    }
    
    try {
      const results = await searchCafes(query, userLocation || undefined, language);
      setFetchedCafes(results);
    } catch (err: any) {
      setError("Unable to find cafes at the moment. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCafe = (cafe: Cafe) => {
    setSelectedCafe(cafe);
    setView('pass');
  };

  const handleBack = () => {
    if (view === 'pass') {
      setView('home');
      setSelectedCafe(null);
    }
  };

  const handleSaveLocalCafe = (cafe: Cafe) => {
    setLocalCafes(prev => {
        const exists = prev.find(c => c.id === cafe.id);
        if (exists) {
            return prev.map(c => c.id === cafe.id ? cafe : c);
        } else {
            return [cafe, ...prev];
        }
    });
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(loc);
        handleSearch("Specialty coffee shops nearby");
      },
      (err) => {
        setLoading(false);
        setError("Could not retrieve your location. Please check permissions.");
      }
    );
  };

  const allCafes = [...localCafes, ...fetchedCafes];

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500 bg-coffee-50 dark:bg-coffee-950 text-coffee-900 dark:text-coffee-50 pb-20 md:pb-0 font-sans antialiased" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar 
        currentView={view} 
        onNavigate={(v) => setView(v)} 
        onBack={view === 'pass' ? handleBack : undefined}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        language={language}
        toggleLanguage={toggleLanguage}
      />

      <main className="flex-grow flex flex-col">
        {view === 'dashboard' && (
            <Dashboard 
                managedCafes={localCafes} 
                onSaveCafe={handleSaveLocalCafe} 
            />
        )}

        {view === 'home' && (
          <>
            <Hero 
              onSearch={handleSearch} 
              onUseLocation={handleUseMyLocation}
              loading={loading}
              language={language}
            />

            <div id="cafe-list-section" className="container mx-auto px-4 py-12 max-w-6xl">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
                <div>
                  <div className="flex items-center gap-2 text-coffee-500 dark:text-coffee-400 mb-4">
                    <Sparkles size={16} className="text-coffee-400" />
                    <span className="uppercase tracking-widest text-[10px] font-bold">{t.stats.curated}</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-serif font-medium text-coffee-900 dark:text-coffee-50 tracking-tight">
                    {heroSearchTriggered ? t.stats.searchResults : t.stats.partner}
                  </h2>
                  <p className="text-coffee-600 dark:text-coffee-300 mt-5 max-w-xl font-light text-lg leading-relaxed opacity-90">
                    {heroSearchTriggered 
                      ? (language === 'en' ? "A selection of venues matching your criteria." : "مجموعة مختارة من الأماكن التي تطابق بحثك.")
                      : (language === 'en' ? "Explore our collection of Jordan's most distinguished coffee houses." : "اكتشف مجموعتنا من أرقى بيوت القهوة في الأردن.")}
                  </p>
                </div>

                {!heroSearchTriggered && (
                  <button 
                    onClick={handleUseMyLocation}
                    className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-coffee-900 border border-coffee-100 dark:border-coffee-700/50 rounded-xl text-coffee-800 dark:text-coffee-100 hover:bg-coffee-50 dark:hover:bg-coffee-800 transition-all shadow-sm hover:shadow-md text-sm font-bold tracking-wide"
                  >
                    <MapPin size={16} />
                    {t.stats.findNearMe}
                  </button>
                )}
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-32 text-coffee-500 dark:text-coffee-400">
                  <div className="relative">
                    <div className="absolute inset-0 bg-coffee-200 dark:bg-coffee-800 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                    <Loader2 className="animate-spin relative z-10 h-10 w-10 text-coffee-800 dark:text-coffee-200 mb-6" />
                  </div>
                  <p className="font-serif italic text-lg animate-pulse">{t.stats.brewing}</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-8 rounded-2xl border border-red-100 dark:border-red-900/30 text-center max-w-2xl mx-auto">
                  <p className="font-medium">{error}</p>
                </div>
              ) : (
                <CafeList cafes={allCafes} onSelect={handleSelectCafe} />
              )}
            </div>
          </>
        )}

        {view === 'pass' && selectedCafe && (
          <DiscountPass cafe={selectedCafe} onClose={handleBack} />
        )}
      </main>
      
      <BottomNav currentView={view} onNavigate={(v) => setView(v)} language={language} />

      <div className="mb-16 md:mb-0">
        <InstallBanner />
      </div>
      
      {view !== 'dashboard' && (
        <div className="mb-16 md:mb-0">
          <ChatAssistant />
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default App;
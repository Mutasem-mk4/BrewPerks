import { GoogleGenAI } from "@google/genai";
import { Cafe, GroundingChunk, MenuItem, Language } from "../types";

// Ensure API Key is available
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-types' });

// Helper to generate context-aware menus
const generateMenu = (cafeName: string, tags: string[], lang: Language = 'en'): MenuItem[] => {
  const isBakery = cafeName.toLowerCase().includes('bakery') || tags.includes('Pastries');
  const isRoastery = cafeName.toLowerCase().includes('roaster') || tags.includes('Roastery');
  
  // English Menu
  if (lang === 'en') {
    const baseMenu: MenuItem[] = [
      { name: 'Americano', price: '2.50 JOD', description: 'Double shot espresso with hot water' },
      { name: 'Latte', price: '3.00 JOD', description: 'Espresso with steamed milk and foam' },
      { name: 'Cappuccino', price: '3.00 JOD', description: 'Equal parts espresso, milk, and foam' },
    ];

    if (isBakery) {
      baseMenu.push(
        { name: 'Zaatar Croissant', price: '1.75 JOD', description: 'Freshly baked with local thyme' },
        { name: 'Cheese Danish', price: '2.00 JOD', description: 'Sweet cream cheese filling' }
      );
    } else if (isRoastery) {
      baseMenu.push(
        { name: 'V60 Pour Over', price: '4.50 JOD', description: 'Single origin Ethiopian beans' },
        { name: 'Cold Brew', price: '3.50 JOD', description: 'Steeped for 24 hours' }
      );
    } else {
      baseMenu.push(
        { name: 'Turkish Coffee', price: '1.50 JOD', description: 'Traditional cardamom spiced coffee' },
        { name: 'Spanish Latte', price: '3.75 JOD', description: 'Sweetened milk with espresso' }
      );
    }
    return baseMenu;
  } else {
    // Arabic Menu
     const baseMenu: MenuItem[] = [
      { name: 'أمريكانو', price: '٢.٥٠ دينار', description: 'اسبريسو مزدوج مع ماء ساخن' },
      { name: 'لاتيه', price: '٣.٠٠ دينار', description: 'اسبريسو مع حليب مبخر ورغوة' },
      { name: 'كابتشينو', price: '٣.٠٠ دينار', description: 'كميات متساوية من الاسبريسو والحليب والرغوة' },
    ];

    if (isBakery) {
      baseMenu.push(
        { name: 'كرواسون زعتر', price: '١.٧٥ دينار', description: 'مخبوز طازج مع زعتر بلدي' },
        { name: 'دانيش جبنة', price: '٢.٠٠ دينار', description: 'حشوة الجبنة الكريمية الحلوة' }
      );
    } else if (isRoastery) {
      baseMenu.push(
        { name: 'قهوة مقطرة V60', price: '٤.٥٠ دينار', description: 'بن إثيوبي فاخر' },
        { name: 'كولد برو', price: '٣.٥٠ دينار', description: 'منقعة لمدة ٢٤ ساعة' }
      );
    } else {
      baseMenu.push(
        { name: 'قهوة تركية', price: '١.٥٠ دينار', description: 'قهوة تقليدية مع الهيل' },
        { name: 'سبانش لاتيه', price: '٣.٧٥ دينار', description: 'حليب محلى مع اسبريسو' }
      );
    }
    return baseMenu;
  }
};

export const searchCafes = async (query: string, location?: {lat: number, lng: number}, lang: Language = 'en'): Promise<Cafe[]> => {
  if (!apiKey) {
    console.warn("No API Key, returning mock cafes");
    return getMockCafes(lang);
  }

  const model = "gemini-2.5-flash";
  // Updated instruction to focus on Jordan context
  const systemInstruction = `You are a helpful assistant for 'BrewPerks', a cafe discovery app in Jordan. 
  Your goal is to find excellent coffee shops in the requested Jordanian governorate or city.
  When the user asks to find cafes, list 6-9 distinct, highly-rated coffee shops.
  For each cafe, provide a brief, inviting description.
  Ensure you trigger the Google Maps tool to get real locations.
  IMPORTANT: Respond in ${lang === 'ar' ? 'Arabic' : 'English'}.`;

  const prompt = lang === 'ar' 
    ? `جد ٦ مقاهي ممتازة تطابق "${query}" في الأردن.`
    : `Find 6 great coffee shops matching "${query}" in Jordan.`;

  try {
    const config: any = {
      tools: [{ googleMaps: {} }],
      systemInstruction,
    };

    if (location) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: location.lat,
            longitude: location.lng
          }
        }
      };
    }

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];
    const text = response.text || "";

    const cafes: Cafe[] = [];

    // Strategy: Filter for map chunks.
    const mapChunks = groundingChunks.filter(c => c.maps);

    mapChunks.forEach((chunk, index) => {
      if (chunk.maps) {
        const name = chunk.maps.title;
        const tags = lang === 'ar' ? ["قهوة", "مريح"] : ["Coffee", "Cozy"]; 
        if (Math.random() > 0.5) tags.push(lang === 'ar' ? "شريك" : "Partner");
        
        cafes.push({
          id: `cafe-${index}-${Date.now()}`,
          name: name,
          description: lang === 'ar' ? "وجهة رائعة لعشاق القهوة في الأردن." : "A wonderful destination for coffee lovers in Jordan.",
          address: lang === 'ar' ? "عرض الخريطة" : "View on map", 
          mapLink: chunk.maps.uri,
          rating: (4 + Math.random()).toFixed(1),
          tags: tags,
          imageUrl: `https://picsum.photos/400/300?random=${index + 100}`,
          menu: generateMenu(name, [], lang)
        });
      }
    });

    if (cafes.length === 0) {
      // Parse text fallback or return mock if text parsing fails too
      const lines = text.split('\n').filter(line => line.trim().match(/^\d+\.|^-\s/));
      if (lines.length > 0) {
        lines.forEach((line, index) => {
          const name = line.replace(/^\d+\.|^-\s/, '').split(':')[0].trim();
          cafes.push({
            id: `cafe-text-${index}`,
            name: name,
            description: line.split(':')[1]?.trim() || (lang === 'ar' ? "مكان رائع للقهوة." : "A great local coffee spot."),
            tags: lang === 'ar' ? ["قهوة", "محلي"] : ["Coffee", "Local"],
            rating: "4.5",
            imageUrl: `https://picsum.photos/400/300?random=${index + 200}`,
            menu: generateMenu(name, [], lang)
          });
        });
      } else {
        return getMockCafes(lang);
      }
    }

    return cafes;
  } catch (error) {
    console.error("Error fetching cafes:", error);
    return getMockCafes(lang); 
  }
};

export const chatWithAssistant = async (history: {role: 'user' | 'model', parts: string}[], message: string): Promise<string> => {
  if (!apiKey) return "I can't chat right now, my API key is missing.";

  const model = "gemini-2.5-flash";
  const systemInstruction = `You are "Barista Bot", the AI assistant for BrewPerks in Jordan. 
  You know about cafes in Amman, Irbid, Aqaba, etc.
  Prices are in JOD (Jordanian Dinar).
  Keep answers concise and helpful.`;

  const chat = ai.chats.create({
    model,
    config: { systemInstruction },
    history: history.map(h => ({
      role: h.role,
      parts: [{ text: h.parts }]
    }))
  });

  const response = await chat.sendMessage({ message });
  return response.text || "I'm having trouble brewing a response right now.";
};

// Helper for robust UI with Jordan specific content
function getMockCafes(lang: Language = 'en'): Cafe[] {
  if (lang === 'ar') {
     return [
      {
        id: 'mock-1',
        name: 'دارة القهوة',
        description: 'بيت قهوة أردني أصيل بلمسة عصرية في قلب عمان.',
        rating: '٤.٨',
        tags: ['عمان', 'تقليدي', 'جلسة خارجية'],
        imageUrl: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&q=80&w=400',
        menu: [
          { name: 'قهوة تركية', price: '١.٥٠ دينار', description: 'تحضير تقليدي مع الهيل' },
          { name: 'قهوة سعودية (دلة)', price: '٤.٠٠ دينار', description: 'تقدم مع التمر' },
          { name: 'لاتيه بالهيل', price: '٣.٢٥ دينار', description: 'اسبريسو مع حليب وهيل' }
        ]
      },
      {
        id: 'mock-2',
        name: 'مختبر الاسبريسو عمان',
        description: 'مساحة عصرية تركز على طرق التحضير العلمية في عبدون.',
        rating: '٤.٧',
        tags: ['عبدون', 'اسبريسو', 'مناسب للعمل'],
        imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=400',
        menu: [
          { name: 'فلات وايت', price: '٣.٢٥ دينار', description: 'ريستريتو مزدوج مع رغوة خفيفة' },
          { name: 'كيمكس لشخصين', price: '٦.٠٠ دينار', description: 'نكهات زهرية ونظيفة' }
        ]
      },
      {
        id: 'mock-3',
        name: 'مقهى رومي',
        description: 'مركز ثقافي في اللويبدة يقدم شاي وقهوة ممتازة.',
        rating: '٤.٩',
        tags: ['اللويبدة', 'شاي', 'ثقافي'],
        imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=400',
        menu: [
          { name: 'شاي بالميرمية', price: '٢.٠٠ دينار', description: 'أوراق ميرمية بلدية' },
          { name: 'مناقيش زعتر', price: '١.٢٥ دينار', description: 'طازجة من الفرن' }
        ]
      }
    ];
  }

  return [
    {
      id: 'mock-1',
      name: 'Darat Al Qahwa',
      description: 'Authentic Jordanian coffee house with a modern twist in the heart of Amman.',
      rating: '4.8',
      tags: ['Amman', 'Traditional', 'Patio'],
      imageUrl: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&q=80&w=400',
      menu: [
        { name: 'Turkish Coffee', price: '1.50 JOD', description: 'Traditional brew with cardamom' },
        { name: 'Saudi Coffee (Dallah)', price: '4.00 JOD', description: 'Served with dates' },
        { name: 'Cardamom Latte', price: '3.25 JOD', description: 'Espresso with cardamom milk' },
        { name: 'Date Cake', price: '2.50 JOD', description: 'Warm cake with toffee sauce' }
      ]
    },
    {
      id: 'mock-2',
      name: 'Espresso Lab Amman',
      description: 'Modern minimalist space focusing on scientific brewing methods in Abdoun.',
      rating: '4.7',
      tags: ['Abdoun', 'Espresso', 'Work Friendly'],
      imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=400',
      menu: [
        { name: 'Flat White', price: '3.25 JOD', description: 'Double ristretto with microfoam' },
        { name: 'Chemex For Two', price: '6.00 JOD', description: 'Clean, floral notes' },
        { name: 'Iced Spanish Latte', price: '3.75 JOD', description: 'Sweet and creamy' }
      ]
    },
    {
      id: 'mock-3',
      name: 'Rumi Cafe',
      description: 'A cultural hub in Weibdeh serving excellent teas and coffees.',
      rating: '4.9',
      tags: ['Weibdeh', 'Tea', 'Cultural'],
      imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=400',
      menu: [
        { name: 'Sage Tea', price: '2.00 JOD', description: 'Local sage leaves' },
        { name: 'Turkish Coffee', price: '1.50 JOD', description: 'Classic' },
        { name: 'Zaatar Manakish', price: '1.25 JOD', description: 'Fresh from the oven' }
      ]
    },
    {
      id: 'mock-4',
      name: 'Aqaba Coffee Roasters',
      description: 'Freshly roasted beans by the Red Sea.',
      rating: '4.6',
      tags: ['Aqaba', 'Roastery', 'Sea View'],
      imageUrl: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&q=80&w=400',
      menu: [
        { name: 'Cold Brew', price: '3.00 JOD', description: 'Refreshing for hot weather' },
        { name: 'Iced Latte', price: '3.50 JOD', description: 'With caramel option' },
        { name: 'Frappe', price: '4.00 JOD', description: 'Blended ice coffee' }
      ]
    },
    {
      id: 'mock-5',
      name: 'Irbid Student Cafe',
      description: 'Busy, vibrant spot near Yarmouk University.',
      rating: '4.5',
      tags: ['Irbid', 'Student', 'Budget'],
      imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=400',
      menu: [
        { name: 'Nescafe', price: '1.00 JOD', description: 'Classic instant mix' },
        { name: 'Tea with Mint', price: '0.75 JOD', description: 'Sweet black tea' },
        { name: 'Chicken Sandwich', price: '2.50 JOD', description: 'Grilled chicken breast' }
      ]
    },
    {
      id: 'mock-6',
      name: 'Desert Moon Ma\'an',
      description: 'A quiet oasis serving strong Arabic coffee.',
      rating: '4.7',
      tags: ['Ma\'an', 'Arabic Coffee', 'Quiet'],
      imageUrl: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=400',
      menu: [
        { name: 'Arabic Coffee Pot', price: '3.00 JOD', description: 'Served with dates' },
        { name: 'Karak Tea', price: '1.50 JOD', description: 'Spiced milk tea' }
      ]
    }
  ];
}
export type AppView = 'home' | 'pass' | 'dashboard';
export type Language = 'en' | 'ar';

export interface MenuItem {
  name: string;
  price: string; // e.g. "2.50 JOD"
  description?: string;
}

export interface Cafe {
  id: string;
  name: string;
  description: string; // Generated summary
  address?: string;
  rating?: string; // e.g. "4.5"
  mapLink?: string; // Google Maps URL
  tags: string[];
  imageUrl?: string;
  menu: MenuItem[];
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: any; // Contains details like review snippets
  };
}
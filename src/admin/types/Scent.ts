export interface ScentNote {
  id: string;
  name: string;
  description: string;
  category: ScentNoteCategory;
  intensity: number;
  isActive: boolean;
}

export interface ScentFamily {
  id: string;
  name: string;
  description: string;
  notes: string[]; // IDs of associated notes
  isActive: boolean;
}

export enum ScentNoteCategory {
  TOP = 'top',
  MIDDLE = 'middle',
  BASE = 'base'
}

export interface ScentCombination {
  id: string;
  name: string;
  description: string;
  notes: string[]; // IDs of notes
  intensity: number;
  seasons: Season[];
  moods: Mood[];
  isActive: boolean;
}

export enum Season {
  SPRING = 'spring',
  SUMMER = 'summer',
  FALL = 'fall',
  WINTER = 'winter'
}

export enum Mood {
  RELAXING = 'relaxing',
  ENERGIZING = 'energizing',
  ROMANTIC = 'romantic',
  FRESH = 'fresh',
  COZY = 'cozy',
  CALMING = 'calming',
  UPLIFTING = 'uplifting',
  SENSUAL = 'sensual',
  FESTIVE = 'festive',
  TROPICAL = 'tropical'
}

export interface ScentProfile {
  id: string;
  name: string;
  description: string;
  notes: {
    top: string[];    // IDs of top notes
    middle: string[]; // IDs of middle notes
    base: string[];   // IDs of base notes
  };
  intensity: number;
  seasons: Season[];
  moods: Mood[];
  isActive: boolean;
}

export type Rarity = 'Core' | 'Rare' | 'Epic';

export interface Personality {
  id: string;
  genreId: string;
  name: string;
  tag: string;
  avatar: string;
  rarity: Rarity;
  glow: string;
  intro: string;
}

export interface Genre {
  id: string;
  name: string;
  icon: string;
  description: string;
  accent: string;
}

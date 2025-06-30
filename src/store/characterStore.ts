import { create } from 'zustand';

export interface CharacterConfig {
  name: string;
  defaultImage: string;
  hammeredImage: string;
}

export type CharacterCombination = {
  id: string;
  enemies: string[];
  friends: string[];
  imageUrl: string;
};

interface CharacterState {
  enemy: CharacterConfig | null;
  friend: CharacterConfig | null;
  timeBonus: CharacterConfig | null;
  selectedCombination: CharacterCombination | null;
  setCharacterCombination: (enemy: CharacterConfig, friend: CharacterConfig, timeBonus: CharacterConfig) => void;
  setSelectedCombination: (combination: CharacterCombination) => void;
}

export const useCharacterStore = create<CharacterState>((set) => ({
  enemy: null,
  friend: null,
  timeBonus: null,
  selectedCombination: null,
  setCharacterCombination: (enemy, friend, timeBonus) => set({ enemy, friend, timeBonus }),
  setSelectedCombination: (combination) => set({ selectedCombination: combination }),
}));

export const characterCombinations: CharacterCombination[] = [
  {
    id: 'trump-selenskyi',
    enemies: ['Trump'],
    friends: ['Selenskyi'],
    imageUrl: '/images/trump-selenskyi.jpg'
  },
  {
    id: 'scheuer-greta',
    enemies: ['Scheuer'],
    friends: ['Greta'],
    imageUrl: '/images/scheuer-greta.jpg'
  }
]; 
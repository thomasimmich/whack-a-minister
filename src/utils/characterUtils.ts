import type { CharacterCombination } from "../store/characterStore";

interface CharacterState {
  default: string;
  hit: string;
}

interface ProcessedCombination {
  enemy: CharacterState;
  friend: CharacterState;
}

export const processCharacterCombination = (
  combination: CharacterCombination
): ProcessedCombination => {
  return {
    enemy: {
      default: `assets/images/${combination.enemies[0].toLowerCase()}.png`,
      hit: `assets/images/${combination.enemies[0].toLowerCase()}-hammered.png`,
    },
    friend: {
      default: `assets/images/${combination.friends[0].toLowerCase()}.png`,
      hit: `assets/images/${combination.friends[0].toLowerCase()}-hammered.png`,
    },
  };
};

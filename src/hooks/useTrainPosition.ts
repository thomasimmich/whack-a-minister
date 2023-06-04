import { useFrame, useLoader } from '@react-three/fiber';
import { useState } from 'react';
import { TextureLoader } from 'three';
import { BASE_ASSET_URL } from '../base/Constants';
import { useWindowSize } from './useWindowSize';
import { useEntity } from '@leanscope/ecs-engine';
import { GameStateFacet, GameStates } from '../app/GameFacets';

export function useCoachWidth() {
  const textureURL = BASE_ASSET_URL + '/images/train/train-a.png';
  const texture = useLoader(TextureLoader, textureURL);
  const windowSize = useWindowSize();
  // if the coach is exactly as wide as the window, it will be 1
  return texture.image.width / windowSize.width / 2;
}

export function useTrainPosition() {
  const [currentTimeliness, setCurrentTimeliness] = useState(1);
  const [gameStateEntity] = useEntity((e) => e.has(GameStateFacet));

  const trainStartPosition =  -3
  useFrame((_state, delta) => {
    if (gameStateEntity?.get(GameStateFacet)?.props.gameState === GameStates.DIALOUGE) {delta = 0}
    const newTimeliness = currentTimeliness! - delta * 0.1;
    setCurrentTimeliness(newTimeliness);
  });

  return trainStartPosition - currentTimeliness;
}
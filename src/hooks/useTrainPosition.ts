import { useFrame, useLoader } from '@react-three/fiber';
import { useState } from 'react';
import { TextureLoader } from 'three';
import { BASE_ASSET_URL } from '../base/Constants';
import { useWindowSize } from './useWindowSize';

export function useCoachWidth() {
  const textureURL = BASE_ASSET_URL + '/images/train/train-a.png';
  const texture = useLoader(TextureLoader, textureURL);
  const windowSize = useWindowSize();
  // if the coach is exactly as wide as the window, it will be 1
  return texture.image.width / windowSize.width / 2;
}

export function useTrainPosition(coachCode: string) {
  const [currentTimeliness, setCurrentTimeliness] = useState(1);

  const coachWidth = useCoachWidth();
  const trainCenterPosition = -(coachWidth / 2 * coachCode.length) / 2;

  useFrame((_state, delta) => {
    const newTimeliness = currentTimeliness! - delta * 0.01;
    setCurrentTimeliness(newTimeliness);
  });

  return trainCenterPosition - currentTimeliness;
}

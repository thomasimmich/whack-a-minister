import { useFrame, useLoader } from '@react-three/fiber';
import { useState } from 'react';
import { TextureLoader } from 'three';
import { useWindowSize } from './useWindowSize';

export function useTrainPosition(coachCode: string) {
  const [currentTimeliness, setCurrentTimeliness] = useState(1);
  const textureURL = 'src/assets/images/train/train-a.png';
  const texture = useLoader(TextureLoader, textureURL);
  const windowSize = useWindowSize();
  const coachWidth = texture.image.width / windowSize.width;
  const trainCenterPosition = -(coachWidth * coachCode.length) / 2;

  useFrame((_state, delta) => {
    const newTimeliness = currentTimeliness! - delta * 0.01;
    setCurrentTimeliness(newTimeliness);
  });

  return trainCenterPosition - currentTimeliness;
}

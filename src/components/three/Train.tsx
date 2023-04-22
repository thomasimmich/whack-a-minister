import { useFrame, useLoader } from '@react-three/fiber';
import { useState } from 'react';
import { TextureLoader } from 'three';
import { useWindowSize } from '../../hooks/useWindowSize';
import { TrainCoach } from './TrainCoach';
export interface TrainProps {
  coachCode?: string;

  timeliness?: number;
}
export function Train(
  props: TrainProps = {
    coachCode: '',
    timeliness: 1,
  },
) {
  const [currentTimeliness, setCurrentTimeliness] = useState(1);

  const textureURL = 'src/assets/images/train/train-a.png';
  const texture = useLoader(TextureLoader, textureURL);
  const windowSize = useWindowSize();
  const coachWidth = texture.image.width / windowSize.width;
  const trainPosition = -(coachWidth * props.coachCode!.length) / 2;

  const coachComponents = props.coachCode
    ?.split('')
    .map((char, index) => <TrainCoach key={index} index={index} type={char} />);

  useFrame((_state, delta) => {
    const newTimeliness = currentTimeliness! - delta * 0.05;
    setCurrentTimeliness(newTimeliness);
  });
  // Return the view, these are regular Threejs elements expressed in JSX
  return <group position={[trainPosition - currentTimeliness!, 0, 0]}>{coachComponents}</group>;
}

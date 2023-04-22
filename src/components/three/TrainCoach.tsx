import { Box } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { useWindowSize } from '../../hooks/useWindowSize';

export enum TrainCoachType {
  WAGON = 'a',
  ENGINE = 'e',
}
export interface TrainCoachProps {
  index: number;
  type?: string;
}
export function TrainCoach(
  props: TrainCoachProps = {
    index: 0,
    type: TrainCoachType.WAGON,
  },
) {
  const textureURL = 'src/assets/images/train/train-a.png';
  const texture = useLoader(TextureLoader, textureURL);
  const windowSize = useWindowSize();
  const boxWidth = texture.image.width / windowSize.width;
  const boxHeight = texture.image.height / windowSize.width;

  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <Box position={[props.index * boxWidth, 0, 0]} args={[boxWidth, boxHeight, 1]}>
      <meshStandardMaterial map={texture} />
    </Box>
  );
}

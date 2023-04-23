import { Box } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { BASE_ASSET_URL } from '../../base/Constants';
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
  const textureURL = BASE_ASSET_URL + '/images/train/train-' + props.type + '.png';
  const texture = useLoader(TextureLoader, textureURL);
  const windowSize = useWindowSize();
  const coachWidth = texture.image.width / windowSize.width;
  const coachHeight = texture.image.height / windowSize.width;

  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <Box position={[props.index * coachWidth / 2, 0, 0]} args={[coachWidth / 2, coachHeight / 2,  1]}>
      <meshStandardMaterial map={texture} transparent />
    </Box>
  );
}

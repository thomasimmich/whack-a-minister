import { Box } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { MeshBasicMaterial, TextureLoader } from 'three';
import { BASE_ASSET_URL, Tags } from '../../base/Constants';
import { useWindowSize } from '../../hooks/useWindowSize';
import { useEntity } from '@leanscope/ecs-engine';
import { LevelFacet } from '../../app/GameFacets';

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
  const [currentLevelEntity] = useEntity((e) => e.has(Tags.CURRENT));
  const textureURL =
    currentLevelEntity?.get(LevelFacet)?.props.levelValue == 1
      ? BASE_ASSET_URL + '/images/train/train-' + props.type + '.png'
      : BASE_ASSET_URL + '/images/l002Images/train/train-' + props.type + '.png';
  const texture = useLoader(TextureLoader, textureURL);
  const windowSize = useWindowSize();
  const coachWidth = texture.image.width / windowSize.width;
  const coachHeight = texture.image.height / windowSize.width;

  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <Box
      position={[(props.index * coachWidth) / 2, 0, 0]}
      args={[coachWidth / 2, coachHeight / 2, 1]}
    >
      <meshBasicMaterial map={texture} transparent />
    </Box>
  );
}

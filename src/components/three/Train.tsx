import { Box } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { useWindowSize } from '../../hooks/useWindowSize';
export interface TrainProps {
  position?: [number, number, number];
  length?: number;
}
export function Train(props: TrainProps) {
  const textureURL = 'src/assets/images/train/train-a.png';
  const texture = useLoader(TextureLoader, textureURL);
  const windowSize = useWindowSize();

  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <Box
      args={[texture.image.width / windowSize.width, texture.image.height / windowSize.width, 1]}
    >
      <meshStandardMaterial map={texture} />
    </Box>
  );
}

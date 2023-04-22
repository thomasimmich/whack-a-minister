import { Box } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { useWindowSize } from '../../hooks/useWindowSize';

export interface FriendProps {
  index: number;
}

export function Friend(props: FriendProps) {
  const textureURL = 'src/assets/images/people/friend-a.png';
  const texture = useLoader(TextureLoader, textureURL);
  const windowSize = useWindowSize();
  const faceWidth = texture.image.width / windowSize.width / 2;
  const faceHeight = texture.image.height / windowSize.width / 2;

  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <Box position={[props.index * faceWidth, 0, 0.0]} args={[faceWidth, faceHeight, 1]}>
      <meshBasicMaterial map={texture} transparent />
    </Box>
  );
}

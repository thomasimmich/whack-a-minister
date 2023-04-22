import { Box } from '@react-three/drei';

export interface EnemyProps {
  index: number;
}

export function Enemy(props: EnemyProps) {
  //const textureURL = 'src/assets/images/train/train-' + props.type + '.png';
  //const texture = useLoader(TextureLoader, textureURL);
  const faceWidth = 0.1;
  const faceHeight = 0.1;

  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <Box position={[props.index * faceWidth, 0, 0.1]} args={[faceWidth, faceHeight, 1]}>
      <meshBasicMaterial color="blue" />
    </Box>
  );
}

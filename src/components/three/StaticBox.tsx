 import { Box } from '@react-three/drei';
import { TextureLoader } from 'three';
import { useLoader, useFrame } from '@react-three/fiber';
import { useWindowSize } from '../../hooks/useWindowSize';
import { useRef } from 'react';

interface StaticBoxProps {
  imageUrl: string;
  x: number;
  y: number;
  z: number;
  speed: number;
}

export const StaticBox = ({ imageUrl,  x, y, z, speed }: StaticBoxProps) => {
  const textureURL = imageUrl;
  const texture = useLoader(TextureLoader, textureURL);
  const windowSize = useWindowSize();
  const coachWidth = texture.image.width / windowSize.width;
  const coachHeight = texture.image.height / windowSize.width;
  const meshRef = useRef<THREE.Mesh>(null);
  const meshRef2 = useRef<THREE.Mesh>(null);


  useFrame(({ clock }: any) => {
    if (meshRef.current) {
      meshRef.current.position.x = x - clock.elapsedTime * speed;
    }

  });

  useFrame(({ clock  }: any) => {
    if (meshRef2.current) {
      meshRef2.current.position.x = x - clock.elapsedTime * speed + coachWidth / 2;
    }
  });

  return (
    <>
     <Box ref={meshRef} position={[x, y, z]} args={[coachWidth / 2, coachHeight / 2, 1]}>
      <meshStandardMaterial map={texture} transparent />
    </Box>
    <Box ref={meshRef2} position={[x, y, z]} args={[coachWidth / 2, coachHeight / 2, 1]}>
      <meshStandardMaterial map={texture} transparent />
    </Box>
    </>
   
    
    
  );
};
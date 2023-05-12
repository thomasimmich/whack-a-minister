import { Box } from '@react-three/drei';
import { MeshBasicMaterial, TextureLoader } from 'three';
import { useLoader, useFrame } from '@react-three/fiber';
import { useWindowSize } from '../../hooks/useWindowSize';
import * as THREE from 'three';
import { useRef, useState } from 'react';

interface StaticBoxProps {
  imageUrl: string;
  x: number;
  y: number;
  z: number;
  speed: number;
  isMoving: boolean;
}

export const MovingImage = ({ imageUrl, x, y, z, speed, isMoving }: StaticBoxProps) => {
  const textureURL = imageUrl;
  const texture = useLoader(TextureLoader, textureURL);
  const windowSize = useWindowSize();
  const coachHeight = texture.image.height / windowSize.width;
  const coachWidth = texture.image.width / windowSize.width;
  const meshRef = useRef<THREE.Mesh>(null);
  const [currentSpeed, setCurrentSpeed] = useState(speed); // Aktuelle Geschwindigkeit

  useFrame(({ clock }: any) => {
    if (meshRef.current) {
      meshRef.current.position.x = x - clock.elapsedTime * currentSpeed;

      if (!isMoving && currentSpeed > 0) {
        setCurrentSpeed(currentSpeed - 0.000 1)
      }
    }
  });

  return (
    <Box ref={meshRef} position={[x, y, z]} args={[coachWidth / 2, coachHeight / 2, 1]}>
      <meshBasicMaterial map={texture} transparent />
    </Box>
  );
};

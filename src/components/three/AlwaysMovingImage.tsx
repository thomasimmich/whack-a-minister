import { Box } from '@react-three/drei';
import { MeshBasicMaterial, TextureLoader } from 'three';
import { useLoader, useFrame } from '@react-three/fiber';
import { useWindowSize } from '../../hooks/useWindowSize';
import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';

interface AlwaysMovingImage {
  imageUrl: string;
  x: number;
  y: number;
  z: number;
  speed: number;
  isMoving: boolean;
  isMovingDown: boolean;
}

export const AlwaysMovingImage = ({ imageUrl, x, y, z, speed, isMoving, isMovingDown}: AlwaysMovingImage) => {
  const textureURL = imageUrl;
  const texture = useLoader(TextureLoader, textureURL);
  const windowSize = useWindowSize();
  const coachHeight = texture.image.height / windowSize.width;
  const coachWidth = texture.image.width / windowSize.width;
  const meshRef = useRef<THREE.Mesh>(null);
  const [currentSpeed, setCurrentSpeed] = useState(speed * 0.5); // Aktuelle Geschwindigkeit

  useEffect(() => {
    if (isMoving == true) {setCurrentSpeed(speed)}
    if(isMoving == false) {setCurrentSpeed(speed * 0.5)}
  }, [isMoving])
  useFrame(({ clock }: any) => {
    if (meshRef.current ) {
     meshRef.current.position.x = x - clock.elapsedTime * currentSpeed ;
    }
    if(meshRef.current &&isMovingDown ) {
      meshRef.current.position.y = y - clock.elapsedTime * 0.001 ;
    }
  })

  return (
    <Box ref={meshRef} position={[x, y, z]} args={[coachWidth / 2, coachHeight / 2, 1]}>
      <meshBasicMaterial map={texture} transparent premultipliedAlpha={false}  />
    </Box>
  );
};

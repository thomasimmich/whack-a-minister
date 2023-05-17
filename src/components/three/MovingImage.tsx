import { Box } from '@react-three/drei';
import { MeshBasicMaterial, TextureLoader } from 'three';
import { useLoader, useFrame } from '@react-three/fiber';
import { useWindowSize } from '../../hooks/useWindowSize';
import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';

interface MovingImageProps {
  imageUrl: string;
  x: number;
  y: number;
  z: number;
  speed: number;
  isMoving: boolean;
  IsAlwaysMoving: boolean;
  idx: number;
  isLastImage: boolean;
}

export const MovingImage = ({ imageUrl, isLastImage, x, y, z, speed, isMoving, IsAlwaysMoving, idx} : MovingImageProps) => {
  const textureURL = imageUrl;
  const texture = useLoader(TextureLoader, textureURL);
  const windowSize = useWindowSize();
  const coachHeight = texture.image.height / windowSize.width;
  const coachWidth = texture.image.width / windowSize.width;
  const meshRef = useRef<THREE.Mesh>(null);
  const [currentSpeed, setCurrentSpeed] = useState(0); // Aktuelle Geschwindigkeit
  const [pauseElapsedTime, setPauseElapsedTime] = useState(0)


  useFrame(({ clock }: any) => {
    if (isLastImage == true && meshRef.current)  {
      if (meshRef.current) {}
      console.log(meshRef.current.position.x )
    }
    if (isMoving == true && currentSpeed <= speed)  {setCurrentSpeed(currentSpeed + (idx * 0.0001))}
    if (isMoving == false) {setPauseElapsedTime(clock.elapsedTime)}
    if (meshRef.current ) {
      if (isMoving == true || IsAlwaysMoving == true) {
        meshRef.current.position.x = x - (clock.elapsedTime - pauseElapsedTime) * currentSpeed ;
      }
    }
  })

  return (
    <Box ref={meshRef} position={[x, y, z]} args={[coachWidth / 2, coachHeight / 2, 1]}>
      <meshBasicMaterial map={texture} transparent premultipliedAlpha={false}  />
    </Box>
  );
};

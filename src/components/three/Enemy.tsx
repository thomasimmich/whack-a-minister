import { Box, PositionalAudio } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { TextureLoader } from 'three';

import { useWindowSize } from '../../hooks/useWindowSize';

export interface EnemyProps {
  index: number;
}

export function Enemy(props: EnemyProps) {
  const hitSoundRef = useRef<any>(null);
  //const hitSoundBuffer = useLoader(AudioLoader, '/sound.mp3');

  const textureURL = 'src/assets/images/people/enemy-';
  const normalTexture = useLoader(TextureLoader, textureURL + 'a.png');
  const hitTexture = useLoader(TextureLoader, textureURL + 'c.png');
  const [currentTexture, setCurrentTexture] = useState(normalTexture);

  const windowSize = useWindowSize();
  const faceWidth = normalTexture.image.width / windowSize.width / 2;
  const faceHeight = normalTexture.image.height / windowSize.width / 2;

  const onPointerDown = () => {
    if (hitSoundRef.current) {
      if (!hitSoundRef.current.isPlaying) {
        hitSoundRef.current?.play();
        console.log('play');
      }
    }

    setCurrentTexture(hitTexture);
    const timeoutId = setTimeout(() => {
      setCurrentTexture(normalTexture);
    }, 200);

    // Clean up the timeout when the component is unmounted
    return () => {
      clearTimeout(timeoutId);
    };
  };

  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <Box
      onPointerDown={onPointerDown}
      position={[props.index * faceWidth, 0, 0.0]}
      args={[faceWidth, faceHeight, 1]}
    >
      <meshBasicMaterial map={currentTexture} transparent />
      <PositionalAudio
        ref={hitSoundRef}
        url="src/assets/sounds/hammer0.mp3"
        load={undefined}
        autoplay={false}
        loop={false}
      />
    </Box>
  );
}

import { Box, PositionalAudio } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { useContext, useRef, useState } from 'react';
import { TextureLoader } from 'three';

import { ECSContext } from '../../app/ECSContext';
import { ScoreFacet } from '../../app/GameFacets';
import { BASE_ASSET_URL } from '../../base/Constants';
import { useWindowSize } from '../../hooks/useWindowSize';

export enum HitableType {
  ENEMY,
  FRIEND,
}
export interface HitableProps {
  index: number;

  type: HitableType;
}

export function Hitable(props: HitableProps) {
  const ecs = useContext(ECSContext);

  const hitSoundRef = useRef<any>(null);
  //const hitSoundBuffer = useLoader(AudioLoader, '/sound.mp3');
  let textureURL = BASE_ASSET_URL + '/images/people/';
  if (props.type === HitableType.ENEMY) {
    textureURL += 'enemy-';
  } else if (props.type === HitableType.FRIEND) {
    textureURL += 'friend-';
  }

  const normalTexture = useLoader(TextureLoader, textureURL + 'a.png');
  const hitTexture = useLoader(TextureLoader, textureURL + 'c.png');
  const [currentTexture, setCurrentTexture] = useState(normalTexture);

  const windowSize = useWindowSize();
  const faceWidth = normalTexture.image.width / 2 / windowSize.width / 2;
  const faceHeight = normalTexture.image.height / 2 / windowSize.width / 2;

  const onPointerDown = () => {
    const playerOneScore = ecs.engine.entities.find((e) => e.has(ScoreFacet));
    playerOneScore?.add(
      new ScoreFacet({ scoreValue: playerOneScore.get(ScoreFacet)?.props.scoreValue! + 100 }),
    );

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
        url={BASE_ASSET_URL + '/sounds/hammer0.mp3'}
        load={undefined}
        autoplay={false}
        loop={false}
      />
    </Box>
  );
}

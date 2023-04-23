import { Box, PositionalAudio } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { useContext, useEffect, useRef, useState } from 'react';
import { TextureLoader } from 'three';

import { ECSContext } from '../../app/ECSContext';
import { ScoreFacet } from '../../app/GameFacets';
import { BASE_ASSET_URL } from '../../base/Constants';
import { useWindowSize } from '../../hooks/useWindowSize';

export enum HitableType {
  ENEMY = 'a',
  FRIEND = 'b',
}
export interface HitableProps {
  index: number;

  type: string;
}

export function Hitable(props: HitableProps) {
  const ecs = useContext(ECSContext);

  const hitSoundRef = useRef<any>(null);
  const baseURL = BASE_ASSET_URL + '/images/people/';
  const normalEnemyTexture = useLoader(TextureLoader, baseURL + 'enemy-a.png');
  const hitEnemyTexture = useLoader(TextureLoader, baseURL + 'enemy-c.png');

  const normalFriendTexture = useLoader(TextureLoader, baseURL + 'friend-a.png');
  const hitFriendTexture = useLoader(TextureLoader, baseURL + 'friend-c.png');

  const [currentTexture, setCurrentTexture] = useState(normalEnemyTexture);

  useEffect(() => {
    if (props.type === HitableType.ENEMY) {
      setCurrentTexture(normalEnemyTexture);
    } else if (props.type === HitableType.FRIEND) {
      setCurrentTexture(normalFriendTexture);
    } else {
      setCurrentTexture(undefined);
    }
  }, [props.type]);

  const windowSize = useWindowSize();
  const faceWidth = normalEnemyTexture.image.width / 2 / windowSize.width / 2;
  const faceHeight = normalEnemyTexture.image.height / 2 / windowSize.width / 2;

  const gridWidth = 375 / 2 / windowSize.width / 2;

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

    if (props.type === HitableType.ENEMY) {
      setCurrentTexture(hitEnemyTexture);
    } else if (props.type === HitableType.FRIEND) {
      setCurrentTexture(hitFriendTexture);
    }
    const timeoutId = setTimeout(() => {
      if (props.type === HitableType.ENEMY) {
        setCurrentTexture(normalEnemyTexture);
      } else if (props.type === HitableType.FRIEND) {
        setCurrentTexture(normalFriendTexture);
      }
    }, 200);

    // Clean up the timeout when the component is unmounted
    return () => {
      clearTimeout(timeoutId);
    };
  };

  console.log('gridwidth ', gridWidth);
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <Box
      onPointerDown={onPointerDown}
      position={[props.index * gridWidth, 0, 0.0]}
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

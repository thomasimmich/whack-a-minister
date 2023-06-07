import { Box, PositionalAudio } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { Suspense, useContext, useEffect, useRef, useState } from 'react';
import { TextureLoader, Texture} from 'three';


import { ScoreFacet } from '../../app/GameFacets';
import { BASE_ASSET_URL } from '../../base/Constants';
import { useWindowSize } from '../../hooks/useWindowSize';
import { ECSContext } from '@leanscope/ecs-engine';

export enum HitableType {
  ENEMY = 'a',
  FRIEND = 'b',
}
export interface HitableProps {
  index: number;

  type: string;
}

export async function loadTextures(): Promise<{ normalEnemyTexture: Texture; hitEnemyTexture: Texture; normalFriendTexture: Texture; hitFriendTexture: Texture; }> {
  const baseURL = BASE_ASSET_URL + '/images/people/';

  const normalEnemyTexturePromise = new Promise<Texture>((resolve, reject) => {
    const loader = new TextureLoader();
    loader.load(baseURL + 'enemy-a.png', resolve, undefined, reject);
  });

  const hitEnemyTexturePromise = new Promise<Texture>((resolve, reject) => {
    const loader = new TextureLoader();
    loader.load(baseURL + 'enemy-b.png', resolve, undefined, reject);
  });

  const normalFriendTexturePromise = new Promise<Texture>((resolve, reject) => {
    const loader = new TextureLoader();
    loader.load(baseURL + 'friend-e.png', resolve, undefined, reject);
  });

  const hitFriendTexturePromise = new Promise<Texture>((resolve, reject) => {
    const loader = new TextureLoader();
    loader.load(baseURL + 'friend-f.png', resolve, undefined, reject);
  });

  const [
    normalEnemyTexture,
    hitEnemyTexture,
    normalFriendTexture,
    hitFriendTexture,
  ] = await Promise.all([
    normalEnemyTexturePromise,
    hitEnemyTexturePromise,
    normalFriendTexturePromise,
    hitFriendTexturePromise,
  ]);

  return {
    normalEnemyTexture,
    hitEnemyTexture,
    normalFriendTexture,
    hitFriendTexture,
  };
}


export function Hitable(props: HitableProps) {
  const ecs = useContext(ECSContext);
  const [normalEnemyTexture, setNormalEnemyTexture] = useState<Texture | undefined>(undefined);
  const [hitEnemyTexture, setHitEnemyTexture] = useState<Texture | undefined>(undefined);
  const [normalFriendTexture, setNormalFriendTexture] = useState<Texture | undefined>(undefined);
  const [hitFriendTexture, setHitFriendTexture] = useState<Texture | undefined>(undefined);

  const hitFriendSoundRef = useRef<any>(null);
  const hitEnemySoundRef = useRef<any>(null);
  useEffect(() => {
    // Lade die Texturen asynchron und setze sie, wenn sie vollständig geladen sind
    const loadAsyncTextures = async () => {
      const textures = await loadTextures();

      setNormalEnemyTexture(textures.normalEnemyTexture);
      setHitEnemyTexture(textures.hitEnemyTexture);
      setNormalFriendTexture(textures.normalFriendTexture);
      setHitFriendTexture(textures.hitFriendTexture);
    };

    loadAsyncTextures();
  }, []);

  const [currentTexture, setCurrentTexture] = useState<Texture | undefined>(undefined);

  useEffect(() => {
    if (props.type === HitableType.ENEMY) {
      setCurrentTexture(normalEnemyTexture);
    } else if (props.type === HitableType.FRIEND) {
      setCurrentTexture(normalFriendTexture);
    } else {
      setCurrentTexture(undefined);
    }
  }, [props.type, normalEnemyTexture, normalFriendTexture]);

  const windowSize = useWindowSize();
  const faceWidth = normalEnemyTexture?.image.width / 2 / windowSize.width / 2;
  const faceHeight = normalEnemyTexture?.image.height / 2 / windowSize.width / 2;

  const gridWidth = 375 / windowSize.width / 2;

  const onPointerDown = () => {
    const playerOneScore = ecs.engine.entities.find((e) => e.has(ScoreFacet));
    if (props.type === HitableType.ENEMY) {
      playerOneScore?.add(
        new ScoreFacet({ scoreValue: playerOneScore.get(ScoreFacet)?.props.scoreValue! + 100 }),
      );
    } else if (props.type === HitableType.FRIEND) {
      playerOneScore?.add(
        new ScoreFacet({ scoreValue: playerOneScore.get(ScoreFacet)?.props.scoreValue! - 100 }),
      );
    }

    if (props.type === HitableType.ENEMY) {
      setCurrentTexture(hitEnemyTexture);

      if (hitFriendSoundRef.current) {
        if (!hitFriendSoundRef.current.isPlaying) {
          hitFriendSoundRef.current?.play();
          //console.log('play');
        }
      }
    } else if (props.type === HitableType.FRIEND) {
      setCurrentTexture(hitFriendTexture);

      if (hitEnemySoundRef.current) {
        if (!hitEnemySoundRef.current.isPlaying) {
          hitEnemySoundRef.current?.play();
          //console.log('play');
        }
      }
    } else {
      setCurrentTexture(undefined);
    }
    const timeoutId = setTimeout(() => {
      if (props.type === HitableType.ENEMY) {
        setCurrentTexture(normalEnemyTexture);
      } else if (props.type === HitableType.FRIEND) {
        setCurrentTexture(normalFriendTexture);
      } else {
        setCurrentTexture(undefined);
      }
    }, 200);

    // Clean up the timeout when the component is unmounted
    return () => {
      clearTimeout(timeoutId);
    };
  };

  //console.log('gridwidth ', gridWidth);
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <Suspense fallback={null}>
      <Box
        key={`${props.type}-${normalEnemyTexture}-${normalFriendTexture}`}
        onPointerDown={onPointerDown}
        position={[props.index * gridWidth - gridWidth / 2, 0.015, 0.001 - props.index * 0.0001]}
        args={[faceWidth ? faceWidth / 1.5 : 0, faceHeight ? faceHeight / 1.5 : 0, 1]}
      >
        {currentTexture ? (
          <meshBasicMaterial map={currentTexture} transparent />
        ) : (
          <meshBasicMaterial transparent opacity={0} />
        )}
        <PositionalAudio
          ref={hitFriendSoundRef}
          url={BASE_ASSET_URL + '/sounds/hammer0.mp3'}
          load={undefined}
          autoplay={false}
          loop={false}
        />
        <PositionalAudio
          ref={hitEnemySoundRef}
          url={BASE_ASSET_URL + '/sounds/hammer1.mp3'}
          load={undefined}
          autoplay={false}
          loop={false}
        />
      </Box>
    </Suspense>
  );
}
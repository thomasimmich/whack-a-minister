import { Box, PositionalAudio } from '@react-three/drei';
import './App.css';

import { useContext, useEffect, useRef, useState } from 'react';
import { Entity } from 'tick-knock';

import { ECS, ECSContext } from './app/ECSContext';
import {
  ActivationFacet,
  GameStateFacet,
  GameStates,
  HitableFacet,
  LevelFacet,
  ScoreFacet,
} from './app/GameFacets';
import { FullScreenCanvas } from './components/three/FullScreenCanvas';

import { useAnimationFrame } from 'framer-motion';
import { System } from 'tick-knock';
import { BASE_ASSET_URL } from './base/Constants';
import { TrainWithPeople } from './components/three/TrainWithPeople';

import { StaticBoxContainer } from './components/three/StaticBoxContainer';
import { useWindowSize } from './hooks/useWindowSize';
import Menu from './pages/Menu';
import { ScoreEvaluationSystem } from './systems/ScoreEvaluationSystem';

const TriggerRenderAppSystems = () => {
  const ecs = useContext(ECSContext);

  useEffect(() => {
    console.log('app start');
    ecs.engine.clear();

    const scoreEntity = new Entity();
    ecs.engine.addEntity(scoreEntity);
    scoreEntity.addComponent(new ScoreFacet({ scoreValue: 0 }));

    const levelEntity = new Entity();
    ecs.engine.addEntity(levelEntity);
    levelEntity.addComponent(new LevelFacet({ levelValue: 1 }));
    levelEntity.addComponent(new ActivationFacet({ activationCode: 'aaaabbbbb' }));

    const enemyEntity = new Entity();
    ecs.engine.addEntity(enemyEntity);
    enemyEntity.addComponent(new HitableFacet({ hitCount: 0 }));

    const gameStateEntity = new Entity();
    ecs.engine.addEntity(gameStateEntity);
    gameStateEntity.addComponent(new GameStateFacet({ gameState: GameStates.WELCOME }));

    () => {
      ecs.engine.removeEntity(scoreEntity);
      ecs.engine.removeEntity(levelEntity);
      ecs.engine.removeEntity(enemyEntity);
      ecs.engine.removeEntity(gameStateEntity);
    };
  }, []);

  const [blacklistedIdentifiableSystems] = useState(new Set<System>());

  useAnimationFrame((_state, dt) => {
    const systems = ecs.engine.systems;

    systems.forEach((system) => {
      try {
        if (!blacklistedIdentifiableSystems.has(system)) {
          console.log('update system', system);
          system.update(dt);
        }
      } catch (e) {
        blacklistedIdentifiableSystems.add(system);

        console.error(e);
        console.warn(
          'Added system to blacklist, so that it is no longer executed in the systems pipeline.',
        );
      }
    });
  });

  return <></>;
};

function App() {
  const [ecs] = useState(new ECS());
  const [play, setPlay] = useState(false);
  const togglePlay = () => {
    setPlay(!play);
  };
  const windowSize = useWindowSize();
  const BGLayer4 = BASE_ASSET_URL + '/images/background/backgroundLayer4.png';
  const BGLayer3 = BASE_ASSET_URL + '/images/background/backgroundLayer3.png';
  const BGLayer2 = BASE_ASSET_URL + '/images/background/backgroundLayer2.png';
  const BGLayer1 = BASE_ASSET_URL + '/images/background/backgroundLayer1.png';

  const MGLayer1 = BASE_ASSET_URL + '/images/middleground/middleGround.png';

  const FGLayer1 = BASE_ASSET_URL + '/images/foreground/foreground.png';

  const mainTuneSoundRef = useRef<any>(null);

  //const [gameStates] = useRenderSystemEntities((e) => e.has(GameStateFacet));
  const [activeScore, setActiveScore] = useState(false);
  const ScoreIlustration = BASE_ASSET_URL + '/images/menu/ScoreView.png';
  const Card = BASE_ASSET_URL + '/images/menu/card-1.png';

  function toggleActiveScore() {
    setActiveScore(!activeScore);
  }

  const [isPlayingVisible, setPlayingVisible] = useState(false);

  {
    /*
  useEffect(() => {
    const gameStateEntity = gameStates[0];
    const gameState = gameStateEntity?.get(GameStateFacet)?.props.gameState;
    if (gameState === GameStates.WELCOME) {
      setWelcomeVisible(true);
      setPlayingVisible(false);
      setHighscoreVisible(false);
    } else if (gameState === GameStates.PLAYING) {
      setWelcomeVisible(false);
      setPlayingVisible(true);
      setHighscoreVisible(false);
    } else if (gameState === GameStates.HIGH_SCORES) {
      setWelcomeVisible(false);
      setPlayingVisible(false);
      setHighscoreVisible(true);
    }
  }, [gameStates]); */
  }

  return (
    <div className="w-screen m-0 p-0 h-screen ">
      <ECSContext.Provider value={ecs}>
        {!isPlayingVisible ? (
          <Menu playFunction={() => togglePlay()} />
        ) : (
          <>
            <FullScreenCanvas>
              <TriggerRenderAppSystems />
              <Box position={[0, 0, 0]} args={[windowSize.width, windowSize.height, 0]}>
                <meshBasicMaterial color="#AEFFF1" />
              </Box>
              <StaticBoxContainer speed={0.0} imageUrl={BGLayer4} y={0} z={0} />
              <StaticBoxContainer speed={0.01} imageUrl={BGLayer3} y={0} z={0} />
              <StaticBoxContainer speed={0.02} imageUrl={BGLayer2} y={0} z={0} />
              <StaticBoxContainer speed={0.03} imageUrl={BGLayer1} y={0} z={0} />
              <StaticBoxContainer speed={0.06} imageUrl={MGLayer1} y={0} z={0} />
              <TrainWithPeople />
              <StaticBoxContainer speed={0.09} imageUrl={FGLayer1} y={0} z={0.11} />

              <PositionalAudio
                ref={mainTuneSoundRef}
                url={BASE_ASSET_URL + '/sounds/scheuertrack1.mp3'}
                load={undefined}
                autoplay={true}
                loop={true}
              />
            </FullScreenCanvas>
            <ScoreEvaluationSystem />
          </>
        )}
      </ECSContext.Provider>
    </div>
  );
}

export default App;

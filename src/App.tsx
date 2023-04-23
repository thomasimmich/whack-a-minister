import { Box, PositionalAudio } from '@react-three/drei';
import './App.css';

import { useContext, useEffect, useRef, useState } from 'react';
import { Entity } from 'tick-knock';
import { IoHome, IoStatsChart, IoCaretForward } from "react-icons/io5"

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
import { Scores } from './components/three/Score';
import { TrainWithPeople } from './components/three/TrainWithPeople';
import { useWindowSize } from './hooks/useWindowSize';
import { HighscoreLoadingSystem } from './systems/HighscoreLoadingSystem';
import { ScoreEvaluationSystem } from './systems/ScoreEvaluationSystem';

import { StaticBoxContainer } from './components/three/StaticBoxContainer';
//import { useRenderSystemEntities } from './hooks/useRenderSystemEntities';
import { BASE_ASSET_URL } from './base/Constants';




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
  const windowSize = useWindowSize();
  const BGLayer4 = BASE_ASSET_URL + '/images/background/backgroundLayer4.png';
  const BGLayer3 = BASE_ASSET_URL + '/images/background/backgroundLayer3.png';
  const BGLayer2 = BASE_ASSET_URL + '/images/background/backgroundLayer2.png';
  const BGLayer1 = BASE_ASSET_URL + '/images/background/backgroundLayer1.png';

  const MGLayer1 = BASE_ASSET_URL + '/images/middleground/middleGround.png';

  const FGLayer1 = BASE_ASSET_URL + '/images/foreground/foreground.png';

  const mainTuneSoundRef = useRef<any>(null);

  //const [gameStates] = useRenderSystemEntities((e) => e.has(GameStateFacet));
  const [activeScore, setActiveScore] = useState(false)
  const ScoreIlustration = BASE_ASSET_URL + '/images/menu/ScoreView.png'
  const Card =  BASE_ASSET_URL + '/images/menu/card-1.png';


  function toggleActiveScore() {setActiveScore(!activeScore)}
  function play() {setPlayingVisible(true)}



  const [isPlayingVisible, setPlayingVisible] = useState(false);

{/*
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
  }, [gameStates]); */}

  return (
    <div className="w-screen m-0 p-0 h-screen ">
        <ECSContext.Provider value={ecs}>
      {!isPlayingVisible ? (<>
        <>
      {!activeScore ? (
        /* Home Ansicht */
        <div  className='w-full h-full p-8   text-black'>
        <div className='flex justify-between w-full'>
          <div>
            <p className=' text-On-Surface-Variant '>SAMSTAG, 11. FEBRUAR</p>
            <p className='text-3xl font-bold'>Home</p>
          </div>
          <div className=' flex text-3xl  text-system-blue'>
            <div>
              <IoHome className='mr-3 w-full justify-center' />
              <p className=' text-sm w-full '>Home</p>
            </div>
            <div onClick={toggleActiveScore} className=' ml-2'>
              <IoStatsChart  className='mr-3  text-icon w-full justify-center' />
              <p className=' text-sm w-full text-icon '>Score</p>
            </div>
          </div>
        </div>
  
        <div className='mt-6'>
          <div onClick={play} className='w-full h-40 rounded-xl p-5 flex items-end'  style={{ backgroundImage: `url(${Card})`,}}>
            <p className='text-3xl font-bold text-white flex  '>Play <IoCaretForward className="text-3xl mt-1 ml-1"/></p>
          </div>
        </div>
      </div>
      ) : (<>
        {/* Score Ansicht */}
        <div  className='w-full h-full  text-black'>
          <div className='flex p-8 h-2/4 justify-between w-full'>
            <div>
              <p className=' text-On-Surface-Variant '>SAMSTAG, 11. FEBRUAR</p>
              <p className='text-3xl font-bold'>Score</p>
            </div>
            <div className=' flex text-3xl  text-system-blue'>
              <div  onClick={toggleActiveScore} >
                <IoHome className='mr-3 w-full text-icon justify-center' />
                <p className=' text-sm w-full  text-icon  '>Home</p>
              </div>
              <div className=' ml-2'>
                <IoStatsChart className='mr-3   w-full justify-center' />
                <p className=' text-sm w-full'>Score</p>
              </div>
           
            </div>
          </div>

        
          <div className='h-2/4  w-full justify-end flex items-end'>
            <img className='w-96 ' src={ScoreIlustration} />
          </div>
        </div>
      </>)}
    </>
      </>) : isPlayingVisible ? (
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

              <Scores />

              <PositionalAudio
                ref={mainTuneSoundRef}
                url={BASE_ASSET_URL + '/sounds/scheuertrack1.mp3'}
                load={undefined}
                autoplay={true}
                loop={true}
              />
            </FullScreenCanvas>

            <HighscoreLoadingSystem />

            <ScoreEvaluationSystem />
        

            {/* <UpdateOnRenderAppSystems /> */}

        </>
      ) : (
        <>.</>
      )}
      </ECSContext.Provider>
    </div>
  );
}

export default App;

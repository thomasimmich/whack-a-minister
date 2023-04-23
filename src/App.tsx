import { Box } from '@react-three/drei';
import './App.css';

import { useContext, useEffect, useState } from 'react';
import { Entity } from 'tick-knock';

import { ECS, ECSContext } from './app/ECSContext';
import { ActivationFacet, HitableFacet, LevelFacet, ScoreFacet } from './app/GameFacets';
import { FullScreenCanvas } from './components/three/FullScreenCanvas';

import { useAnimationFrame } from 'framer-motion';
import { System } from 'tick-knock';
import { Scores } from './components/three/Score';
import { TrainWithPeople } from './components/three/TrainWithPeople';
import { HighscoreLoadingSystem } from './systems/HighscoreLoadingSystem';
import { ScoreEvaluationSystem } from './systems/ScoreEvaluationSystem';
import { BASE_ASSET_URL } from './base/Constants';
import { StaticBox } from './components/three/StaticBox';
import { useWindowSize } from './hooks/useWindowSize';


const TriggerRenderAppSystems = () => {
  const ecs = useContext(ECSContext);

  useEffect(() => {
    console.log('app start');
    ecs.engine.clear();

    const scoreEntity = new Entity();
    ecs.engine.addEntity(scoreEntity);
    scoreEntity.addComponent(new ScoreFacet({ scoreValue: 1000 }));

    const levelEntity = new Entity();
    ecs.engine.addEntity(levelEntity);
    levelEntity.addComponent(new LevelFacet({ levelValue: 1 }));
    levelEntity.addComponent(new ActivationFacet({ activationCode: 'aaaabbbbb' }));

    const enemyEntity = new Entity();
    ecs.engine.addEntity(enemyEntity);
    enemyEntity.addComponent(new HitableFacet({ hitCount: 0 }));

    () => {
      ecs.engine.removeEntity(scoreEntity);
      ecs.engine.removeEntity(levelEntity);
      ecs.engine.removeEntity(enemyEntity);
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
  const BGLayer4 =  BASE_ASSET_URL + '/images/background/backgroundLayer4.png';
  const BGLayer3 =  BASE_ASSET_URL + '/images/background/backgroundLayer3.png';
  const BGLayer2 =  BASE_ASSET_URL + '/images/background/backgroundLayer2.png';
  const BGLayer1 =  BASE_ASSET_URL + '/images/background/backgroundLayer1.png';



  return (
    <div className="w-screen m-0 p-0 h-screen ">
      {true ? (
        <>
          <ECSContext.Provider value={ecs}>
            <FullScreenCanvas>
              <TriggerRenderAppSystems />
              <Box position={[0, 0, 0]} args={[windowSize.width, windowSize.height, 0]}>
                <meshBasicMaterial color="#AEFFF1" />
              </Box>
              <StaticBox speed={0.00} imageUrl={BGLayer4} x={0} y={0} z={0}  />
              <StaticBox speed={0.01}  imageUrl={BGLayer3} x={0} y={0} z={0}  />
              <StaticBox speed={0.02}  imageUrl={BGLayer2}  x={0} y={0} z={0}  />
              <StaticBox speed={0.03}  imageUrl={BGLayer1}  x={0} y={0} z={0}  />
              <TrainWithPeople />
             
              <Scores />
            </FullScreenCanvas>

            <HighscoreLoadingSystem />

            <ScoreEvaluationSystem />

            {/* <UpdateOnRenderAppSystems /> */}
          </ECSContext.Provider>
        </>
      ) : (
        <></> /* <Menu playFunc={togglePlay} /> */
      )}
    </div>
  );
}

export default App;

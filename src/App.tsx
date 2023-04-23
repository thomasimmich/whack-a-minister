import { Box } from '@react-three/drei';
import './App.css';

import { useContext, useEffect, useState } from 'react';
import { Entity } from 'tick-knock';

import { ECS, ECSContext } from './app/ECSContext';
import { ScoreFacet } from './app/GameFacets';
import { FullScreenCanvas } from './components/three/FullScreenCanvas';

import { useFrame } from '@react-three/fiber';
import { System } from 'tick-knock';
import { Highscore } from './base/types';
import { Scores } from './components/three/Score';
import { TrainWithPeople } from './components/three/TrainWithPeople';
import Menu from './pages/Menu';
import { HighscoreLoadingSystem } from './systems/HighscoreLoadingSystem';

const TriggerRenderAppSystems = () => {
  const ecs = useContext(ECSContext);

  useEffect(() => {
    console.log('app start');
    ecs.engine.clear();

    const scoreEntity = new Entity();
    ecs.engine.addEntity(scoreEntity);
    scoreEntity.addComponent(new ScoreFacet({ scoreValue: 1000 }));

    () => {
      ecs.engine.removeEntity(scoreEntity);
    };
  }, []);

  const [blacklistedIdentifiableSystems] = useState(new Set<System>());

  useFrame((_state, dt) => {
    const systems = ecs.engine.systems;

    systems.forEach((system) => {
      try {
        if (!blacklistedIdentifiableSystems.has(system)) {
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

  const currentDate = new Date().toLocaleDateString();
  const fakeData: Highscore[] = [
    { id: 1, user: 'asd', score: 0, date: currentDate },
    { id: 2, user: 'qwe', score: 10, date: currentDate },
    { id: 3, user: 'sdf', score: 20, date: currentDate },
    { id: 4, user: 'wer', score: 30, date: currentDate },
    { id: 5, user: 'dgf', score: 40, date: currentDate },
    { id: 6, user: 'dfg', score: 50, date: currentDate },
  ];

  return (
    <div className="w-screen m-0 p-0 h-screen ">
      {play ? (
        <>
          <ECSContext.Provider value={ecs}>
            <FullScreenCanvas>
              <TriggerRenderAppSystems />
              <Box position={[0, 0, 0]} args={[4, 4, 1]}>
                <meshBasicMaterial color="#AEFFF1" />
              </Box>
              <TrainWithPeople />
              <Scores />
            </FullScreenCanvas>

            <HighscoreLoadingSystem />

            {/* <UpdateOnRenderAppSystems /> */}
          </ECSContext.Provider>
        </>
      ) : (
        <Menu highscores={fakeData} playFunction={() => togglePlay()} />
      )}
    </div>
  );
}

export default App;

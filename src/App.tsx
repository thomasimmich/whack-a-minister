import { Box } from '@react-three/drei';
import './App.css';

import { useContext, useEffect, useState } from 'react';
import { Entity } from 'tick-knock';

import { ECS, ECSContext } from './app/ECSContext';
import { ScoreFacet } from './app/GameFacets';
import { FullScreenCanvas } from './components/three/FullScreenCanvas';

import { useFrame } from '@react-three/fiber';
import { System } from 'tick-knock';
import { Scores } from './components/three/Score';
import { TrainWithPeople } from './components/three/TrainWithPeople';

const AppSystems = () => {
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

  return (
    <div>
      <ECSContext.Provider value={ecs}>
        <FullScreenCanvas>
          <AppSystems />
          <Box position={[0, 0, 0]} args={[1, 1, 1]}>
            <meshBasicMaterial color="red" />
          </Box>
          <TrainWithPeople></TrainWithPeople>
          <Scores />
        </FullScreenCanvas>
      </ECSContext.Provider>
    </div>
  );
}

export default App;


import { useContext, useEffect, useState } from 'react';

import {CoinsFacet,GameStateFacet,GameStates,LevelFacet,ScoreFacet,} from '../../app/GameFacets';
import { IoPause, IoSparkles } from 'react-icons/io5';
import { ECSContext } from '@leanscope/ecs-engine';


interface LevelStatusProps {

}

const LevelStatus = ({}:LevelStatusProps ) => {
  const ecs = useContext(ECSContext);
  const [scoreValue, setScoreValue] = useState(0);
  const [coinsValue, setCoinsValue] = useState(0);

  useEffect(() => {
    const gameStateEntity =  ecs.engine.entities.find((e) => e.has(GameStateFacet))
    gameStateEntity?.addComponent(new GameStateFacet({ gameState: GameStates.PAUSE }));

  }, []
)

function onPauseClick() {
  const gameStateEntity =  ecs.engine.entities.find((e) => e.has(GameStateFacet))
  gameStateEntity?.addComponent(new GameStateFacet({ gameState: GameStates.PAUSE }));
}

{/*  useEffect(() => {
    const scoreEntity = ecs.engine.entities.find((entity: Entity) => entity.hasComponent(ScoreFacet));
    const coinsEntity = ecs.engine.entities.find((entity: Entity) => entity.hasComponent(CoinsFacet));

    const currentScoreValue = scoreEntity?.getComponent<ScoreFacet>(ScoreFacet)?.scoreValue;
    const currentCoinsValue = coinsEntity?.getComponent<CoinsFacet>(CoinsFacet)?.coinsValue;

    // Aktualisiere die State-Variablen mit den aktuellen Werten
    if (currentScoreValue !== undefined) {
      setScoreValue(currentScoreValue);
    }
    if (currentCoinsValue !== undefined) {
      setCoinsValue(currentCoinsValue);
    }

    return () => {
      ecs.engine.removeEntity(scoreEntity);
      ecs.engine.removeEntity(coinsEntity);
    };
  }, [ecs.engine.entities]);
*/}
  return (
    <div className='fixed flex  right-10  justify-between top-8 text-3xl left-10'>
      <div className='flex text-[#E05923]'><IoSparkles /><p className='ml-3 text-2xl'>{scoreValue}</p></div>
      <div onClick={() => {onPauseClick()}} className='flex text-white'><IoPause/></div>
    </div>
  );
};

export default LevelStatus;

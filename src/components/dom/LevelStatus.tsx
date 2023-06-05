import { useContext, useEffect, useState } from 'react';

import {
  CoinsFacet,
  GameStateFacet,
  GameStates,
  LevelFacet,
  ScoreFacet,
} from '../../app/GameFacets';
import { IoPause, IoSparkles } from 'react-icons/io5';
import { ECSContext } from '@leanscope/ecs-engine';

interface LevelStatusProps {
  scoreValue: number;
}

const LevelStatus = ({scoreValue}: LevelStatusProps) => {
  const ecs = useContext(ECSContext);

  const [coinsValue, setCoinsValue] = useState(0);

  function onPauseClick() {
    const gameStateEntity = ecs.engine.entities.find((e) => e.has(GameStateFacet));
    gameStateEntity?.addComponent(new GameStateFacet({ gameState: GameStates.PAUSE }));
  }

  return (
    <div className="fixed flex  right-10  justify-between top-8 text-3xl left-10">
      <div className="flex text-[#E05923]">
        <IoSparkles />
        <p className="ml-3 text-2xl">{scoreValue}</p>
      </div>
      <div
        onClick={() => {
          onPauseClick();
        }}
        className="flex text-white"
      >
        <IoPause />
      </div>
    </div>
  );
};

export default LevelStatus;

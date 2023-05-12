import { useContext, useState, useEffect } from 'react';
import { QueryPredicate, Entity, Query } from 'tick-knock';
import { LoadingScreen, LevelRenderer, Home, WelcomeScreen } from '.';
import { ECSContext } from '../../app/ECSContext';
import { GameStateFacet, GameStates } from '../../app/GameFacets';
import { HighscoreLoadingSystem } from '../../systems/HighscoreLoadingSystem';
import { ScoreEvaluationSystem } from '../../systems/ScoreEvaluationSystem';
import { useEntity } from '../../hooks/useEntity';

const UI = () => {
  //  const [gameStates] = useRenderSystemEntities((e) => e.has(GameStateFacet));

  const [gameStateEntity] = useEntity((e) => e.has(GameStateFacet));

  function toggleNewUser() {
    setNewUser(!newUser);
  }


  // Test

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
  const [activeLoad, setActiveLoad] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [newUser, setNewUser] = useState(true);

  console.log('Game State', gameStateEntity);
  return (
    <>

    {gameStateEntity?.get(GameStateFacet)?.props.gameState == GameStates.PLAYING && activeLoad  ? (
        <LoadingScreen />
      ) : true && // gameStateEntity?.get(GameStateFacet)?.props.gameState == GameStates.PLAYING
        activeLoad == false ? (
        <>

          <LevelRenderer currentLevel={currentLevel} />
          <HighscoreLoadingSystem />
          <ScoreEvaluationSystem />
        </>
      ) : (
        <></>
      )}

      { gameStateEntity?.get(GameStateFacet)?.props.gameState == GameStates.WELCOME  && ( 
        <Home  />
      )}
      {false && <WelcomeScreen toggleNewUser={toggleNewUser} />}
    </>
  );
};

export default UI;

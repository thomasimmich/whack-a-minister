import { useContext, useState, useEffect } from 'react';
import { LoadingScreen, LevelRenderer, Home, WelcomeScreen } from '.';

import { GameStateFacet, GameStates } from '../../app/GameFacets';
import { HighscoreLoadingSystem } from '../../systems/HighscoreLoadingSystem';
import { ScoreEvaluationSystem } from '../../systems/ScoreEvaluationSystem';
import { ECSContext, useAnimationFrame, useEntity, useEntityHasTag } from '@leanscope/ecs-engine';

const UI = () => {
  const ecs = useContext(ECSContext);
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const [gameStateEntity] = useEntity((e) => e.has(GameStateFacet));
  const [activeLoad, setActiveLoad] = useState(true);
  const [newUser, setNewUser] = useState(true);

  useAnimationFrame((dt: number) => {
    ecs.engine.update(dt);
  });
 
  useEffect(() => {
    if (
      gameStateEntity?.get(GameStateFacet)?.props.gameState === GameStates.DIALOUGE &&
      activeLoad == true
    ) {
      deaktivateLoadingScreen();
    }
  }, [gameStateEntity?.get(GameStateFacet)?.props.gameState]);

  function toggleNewUser() {
    setNewUser(!newUser);
  }
  async function deaktivateLoadingScreen() {
    await delay(400);
    setActiveLoad(false);
  }

  return (
    <>
      { gameStateEntity?.get(GameStateFacet)?.props.gameState == GameStates.PLAYING ||
        gameStateEntity?.get(GameStateFacet)?.props.gameState == GameStates.PAUSE ||
        gameStateEntity?.get(GameStateFacet)?.props.gameState == GameStates.DIALOUGE ||
        (gameStateEntity?.get(GameStateFacet)?.props.gameState == GameStates.LEVEL_DONE && // gameStateEntity?.get(GameStateFacet)?.props.gameState == GameStates.PLAYING
          activeLoad == false) ? (
        <>
          <LevelRenderer />
          <HighscoreLoadingSystem />
          <ScoreEvaluationSystem />
          {activeLoad &&(<LoadingScreen/>)}
        </>
      ) : (
        <></>
      )}

      {gameStateEntity?.get(GameStateFacet)?.props.gameState === GameStates.WELCOME && <Home />}
      {false && <WelcomeScreen toggleNewUser={toggleNewUser} />}
    </>
  );
};

export default UI;

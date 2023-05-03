import './App.css';
import {  useEffect, useState } from 'react';

import { ECS, ECSContext } from './app/ECSContext';
import { HighscoreLoadingSystem } from './systems/HighscoreLoadingSystem';
import { ScoreEvaluationSystem } from './systems/ScoreEvaluationSystem';
import {Home, WelcomeScreen, LevelRenderer, LoadingScreen, ErrorScreen} from './pages/System';
import { GameStateFacet, GameStates } from './app/GameFacets';
import { useRenderSystemEntities } from './hooks/useRenderSystemEntities';


function App() {
  const [ecs] = useState(new ECS());
  const delay =(ms: number) => new Promise(res => setTimeout(res, ms));
  const [activeLoad, setActiveLoad] = useState(false)
  const [currentLevel, setCurrentLevel] = useState(1)
  const [newUser, setNewUser] = useState(true)
  const [theme, setTheme] = useState("#ffffff");
  const [gameState] = useRenderSystemEntities((e) => e.has(GameStateFacet))

  function toggleNewUser() {setNewUser(!newUser)}
  function activateDarkBG() {setTheme('rgb(214,214,214)')}
  function activateLightBG() {setTheme('#ffffff')}
  async function play() {
    //setCurrentLevel(level)
    setActiveLoad(true)
    await delay(500);
    setActiveLoad(false)
  }

  // Test


  console.log(gameState)

  return (
    <div className="w-screen  m-0 p-0 h-screen ">
      <meta name="theme-color" content={theme} /> 
      <ECSContext.Provider value={ecs}>

        {gameState[0].get(GameStateFacet)?.props.gameState == GameStates.PLAYING  && activeLoad ?(
          <LoadingScreen />
        ) : gameState[0].get(GameStateFacet)?.props.gameState == GameStates.PLAYING && activeLoad == false ? (
          <>
            <LevelRenderer currentLevel={currentLevel} />
            <HighscoreLoadingSystem />
            <ScoreEvaluationSystem />
          </>
        ) : (<></>)}

        {gameState[0].get(GameStateFacet)?.props.gameState == GameStates.WELCOME  &&(<Home play={play} />)}
        {newUser &&(<WelcomeScreen toggleNewUser={toggleNewUser}  />)}

      </ECSContext.Provider>
    </div>
  );
}

export default App;

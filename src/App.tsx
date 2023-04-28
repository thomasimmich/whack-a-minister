import './App.css';
import {  useState } from 'react';

import { ECS, ECSContext } from './app/ECSContext';
import { HighscoreLoadingSystem } from './systems/HighscoreLoadingSystem';
import { ScoreEvaluationSystem } from './systems/ScoreEvaluationSystem';
import {Home, WelcomeScreen, LevelRenderer, LoadingScreen} from './pages/System';

function App() {
  const [ecs] = useState(new ECS());
  const delay =(ms: number) => new Promise(res => setTimeout(res, ms));
  const [activeLoad, setActiveLoad] = useState(false)
  const [currentLevel, setCurrentLevel] = useState(1)
  const [newUser, setNewUser] = useState(true)
  const [isPlayingVisible, setPlayingVisible] = useState(false);
  const [theme, setTheme] = useState('#ffffff');

  function toggleNewUser() {setNewUser(!newUser)}
  function activateDarkBG() {setTheme('rgb(214,214,214)')}
  function activateLightBG() {setTheme('#ffffff')}
  async function play(level) {
    setCurrentLevel(level)
    setPlayingVisible(true)
    setActiveLoad(true)
    await delay(500);
    setActiveLoad(false)
  }


  return (
    <div className="w-screen  m-0 p-0 h-screen ">
      <meta name="theme-color" content={theme} /> 
      <ECSContext.Provider value={ecs}>

        {isPlayingVisible &&(
          <>
            <LevelRenderer currentLevel={currentLevel} />
            <HighscoreLoadingSystem />
            <ScoreEvaluationSystem />
        
            {activeLoad &&(<LoadingScreen />)}
          </>
        )}

        {!isPlayingVisible  &&(<Home activeLoad={activeLoad} play={play} />)}
        {newUser &&(<WelcomeScreen activateDarkBG={activateDarkBG} activateLightBG={activateLightBG} toggleNewUser={toggleNewUser}  />)}

      </ECSContext.Provider>
    </div>
  );
}

export default App;

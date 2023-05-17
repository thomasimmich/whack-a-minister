import './App.css';
import { useContext, useEffect, useState } from 'react';


import { HighscoreLoadingSystem } from './systems/HighscoreLoadingSystem';
import { ScoreEvaluationSystem } from './systems/ScoreEvaluationSystem';
import { Home, WelcomeScreen, LevelRenderer, LoadingScreen, ErrorScreen } from './pages/Menu';
import { GameStateFacet, GameStates } from './app/GameFacets';

import { InitSystem } from './systems/AppSystems';
import UI from './pages/Menu/UI';
import { ECS, ECSContext } from '@leanscope/ecs-engine';




function App() {
  const [ecs] = useState(new ECS());
  const [theme, setTheme] = useState('#ffffff');

  return (
    <div className="w-screen  m-0 p-0 h-screen ">
      <meta name="theme-color" content={theme} />
      <ECSContext.Provider value={ecs}>
        <InitSystem />
        <UI />
      </ECSContext.Provider>
    </div>
  );
}

export default App;

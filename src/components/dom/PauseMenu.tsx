import { useContext } from 'react';
import { GameStateFacet, GameStates } from '../../app/GameFacets';
import SheetViewOutline from '../../pages/StyleLibary/SheetViewOutline';
import { BASE_ASSET_URL } from '../../base/Constants';
import TypingAnimation from '../../pages/StyleLibary/TypingAnimation';
import { ECSContext } from '@leanscope/ecs-engine';

interface PauseMenuProps {}

const PauseMenu = ({}: PauseMenuProps) => {
  const ecs = useContext(ECSContext);

  function handleBackClick() {
    const gameStateEntity = ecs.engine.entities.find((e) => e.has(GameStateFacet));
    gameStateEntity?.addComponent(new GameStateFacet({ gameState: GameStates.PAUSE }));
  }
  const LevelDoneIlustration = BASE_ASSET_URL + '/images/background/backgroundLayer0A.png';

  return (
    <div className="fixed">
      <SheetViewOutline
        backfunc={() => {}}
        backClick={false}
        small={false}
        clickOutside={false}
        save={false}
        customText={""}
        saveFunc={() => {}}
        content={
          <div className="h-full ">
            <div className="h-3/5">
              <p className="ml-10  text-3xl font-bold">Pause</p>
              <p className=" mx-10 mt-3 text-sm text-On-Surface-Variant">
                <TypingAnimation s="Während des Abenteuers machen Paul und Q-27 eine wohlverdiente Pause auf einem nahegelegenen Bauernhof. Sie lassen sich auf einer schattigen Bank nieder und genießen die idyllische Ruhe um sie herum. Der sanfte Duft von frisch gemähtem Gras und das leise Muhen der Kühe tragen zur entspannten Atmosphäre bei. " />
              </p>
            </div>
            <div className="ml-10 flex h-2/5 items-end ">
              <img className="w-full " src={LevelDoneIlustration} />
            </div>
          </div>
        }
      />
    </div>
  );
};

export default PauseMenu;

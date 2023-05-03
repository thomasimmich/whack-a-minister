import { useContext } from "react";
import { GameStateFacet, GameStates } from "../../app/GameFacets";
import SheetViewOutline from "../../pages/StyleLibary/SheetViewOutline"
import { ECSContext } from "../../app/ECSContext";


interface PauseMenuProps {
 
}

const PauseMenu = ({}: PauseMenuProps) => {
  const ecs = useContext(ECSContext);

  function handleBackClick() {
    const gameStateEntity =  ecs.engine.entities.find((e) => e.has(GameStateFacet))
    gameStateEntity?.addComponent(new GameStateFacet({ gameState: GameStates.PAUSE }));
  }
  return (
   <>
     { /*<SheetViewOutline backfunc={handleBackClick}  content={(<></>)} /> */}
     Pause
   </>
  )
}

export default PauseMenu
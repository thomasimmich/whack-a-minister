import { useEntity } from "@leanscope/ecs-engine";
import Level001 from "../Levels/Level001";
import Level002 from "../Levels/Level002";
import ErrorScreen from "./ErrorScreen";
import { CurrentLevelFacet, LevelFacet } from "../../app/GameFacets";
import { Tags } from "../../base/Constants";

  

const LevelRenderer = () => {
  const [currentLevel] = useEntity((e) => e.has(Tags.CURRENT));


  return (
    <>
      {currentLevel?.get(LevelFacet)?.props.levelValue == 1 ? (
        <Level001 />
      ) : currentLevel?.get(LevelFacet)?.props.levelValue ==  2 ? (
        <Level002 />
      ) : (
        <ErrorScreen />
      )}
    </>
  )
}

export default LevelRenderer
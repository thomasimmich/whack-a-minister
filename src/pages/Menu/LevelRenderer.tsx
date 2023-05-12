import Level001 from "../Levels/Level001";
import Level002 from "../Levels/Level002";
import ErrorScreen from "./ErrorScreen";

interface LevelRendererProps {
  currentLevel: number;
}
  

const LevelRenderer = ({currentLevel}: LevelRendererProps) => {
  
  return (
    <>
      {currentLevel == 1 ? (
        <Level001 />
      ) : currentLevel ==  2 ? (
        <Level002 />
      ) : (
        <ErrorScreen />
      )}
    </>
  )
}

export default LevelRenderer
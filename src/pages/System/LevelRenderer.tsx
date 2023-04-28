import Level001 from "../Levels/Level001";
import Level002 from "../Levels/Level002";
import ErrorScreen from "./ErrorScreen";

interface LevelRendererProps {
  currentLevel: number;
  stoppPlaying: () => void;
}
  

const LevelRenderer = ({currentLevel, stoppPlaying}: LevelRendererProps) => {
  return (
    <>
      {currentLevel == 1 ? (
        <Level001 stoppPlaying={stoppPlaying} />
      ) : currentLevel ==  2 ? (
        <Level002 stoppPlaying={stoppPlaying}/>
      ) : (
        <ErrorScreen />
      )}
    </>
  )
}

export default LevelRenderer
import { useAnimationFrame } from 'framer-motion';
import { useContext } from 'react';
import { GameStateFacet, GameStates } from '../../app/GameFacets';
import { useTrainPosition } from '../../hooks/useTrainPosition';
import { TrainCoach } from './TrainCoach';
import { ECSContext } from '@leanscope/ecs-engine';
export interface TrainProps {
  coachCode: string;
}
export function Train(
  props: TrainProps = {coachCode: ''},
) {
  const ecs = useContext(ECSContext);
  //console.log(props.coachCode);
  const coachComponents = props.coachCode
    ?.split('')
    .map((char, index) => <TrainCoach key={index} index={index} type={char} />);
  const trainPosition = useTrainPosition();

  useAnimationFrame((_state) => {
    const gameStateEntity = ecs.engine.entities.find((e) => e.has(GameStateFacet));
    if (
      trainPosition > 1.0 &&
      gameStateEntity?.get(GameStateFacet)?.props.gameState !== GameStates.DIALOUGE
    ) {
      console.log('GAME OVER');

      gameStateEntity?.addComponent(new GameStateFacet({ gameState: GameStates.DIALOUGE }));
    }
  });

  // Return the view, these are regular Threejs elements expressed in JSX
  return <group position={[trainPosition, -0.047, 0]}>{coachComponents}</group>;
}

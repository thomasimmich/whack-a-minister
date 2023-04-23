import { useTrainPosition } from '../../hooks/useTrainPosition';
import { TrainCoach } from './TrainCoach';
export interface TrainProps {
  coachCode: string;
}
export function Train(
  props: TrainProps = {
    coachCode: '',
  },
) {
  console.log(props.coachCode)
  const coachComponents = props.coachCode
    ?.split('')
    .map((char, index) => <TrainCoach key={index} index={index} type={char} />);
  const trainPosition = useTrainPosition(props.coachCode);

  // Return the view, these are regular Threejs elements expressed in JSX
  return <group position={[trainPosition, -0.047, 0]}>{coachComponents}</group>;
}

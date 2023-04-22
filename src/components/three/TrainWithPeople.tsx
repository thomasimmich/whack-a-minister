import { useCoachWidth, useTrainPosition } from '../../hooks/useTrainPosition';
import { Enemy } from './Enemy';
import { Friend } from './Friend';
import { Train } from './Train';

export const TrainWithPeople: React.FC<{}> = () => {
  const coachCode = 'avz';
  const coachWidth = useCoachWidth();
  const trainPosition = useTrainPosition(coachCode);
  const peoplePosition = trainPosition % 2;
  console.log('trainPosition', trainPosition);
  console.log('coachWidth', coachWidth);
  return (
    <group>
      <Train coachCode={coachCode} />
      <group position={[peoplePosition, 0, 0.1]}>
        <Enemy index={0} />
        <Friend index={1} />
        <Enemy index={2} />
        <Enemy index={3} />
        <Enemy index={4} />
        <Enemy index={5} />
      </group>
    </group>
  );
};

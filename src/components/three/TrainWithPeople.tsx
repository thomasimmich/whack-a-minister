import { useTrainPosition } from '../../hooks/useTrainPosition';
import { Enemy } from './Enemy';
import { Train } from './Train';

export const TrainWithPeople: React.FC<{}> = () => {
  const coachCode = 'avz';
  const trainPosition = useTrainPosition(coachCode);
  return (
    <group>
      <Train coachCode={coachCode} />
      <Enemy index={0} />
      <Enemy index={1} />
    </group>
  );
};

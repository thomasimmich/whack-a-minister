import { useCoachWidth, useTrainPosition } from '../../hooks/useTrainPosition';
import { Hitable, HitableType } from './Hitable';
import { Train } from './Train';

export const TrainWithPeople: React.FC<{}> = () => {
  const coachCode = 'avz';
  const coachWidth = useCoachWidth();
  const trainPosition = useTrainPosition(coachCode);
  const peoplePosition = trainPosition;
  console.log('trainPosition', trainPosition);
  console.log('coachWidth', coachWidth);
  return (
    <group>

      <Train coachCode={coachCode} />
   
      <group position={[peoplePosition, 0, 0.1]}>
        <Hitable index={0} type={HitableType.ENEMY} />
        <Hitable index={1} type={HitableType.FRIEND} />
        <Hitable index={2} type={HitableType.ENEMY} />
        <Hitable index={3} type={HitableType.ENEMY} />
        <Hitable index={4} type={HitableType.ENEMY} />
        <Hitable index={5} type={HitableType.ENEMY} />
      </group>
    </group>
  );
};

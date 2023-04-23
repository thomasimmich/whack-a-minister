import { useCoachWidth, useTrainPosition } from '../../hooks/useTrainPosition';
import { Hitable } from './Hitable';
import { Train } from './Train';

export const TrainWithPeople: React.FC<{}> = () => {
  const coachCode = 'avz';
  const hitableCode = 'aaabaaaaaabaaaabaaab';
  const coachWidth = useCoachWidth();
  const trainPosition = useTrainPosition(coachCode);
  const peoplePosition = trainPosition;
  console.log('trainPosition', trainPosition);
  console.log('coachWidth', coachWidth);

  const hitableComponents = hitableCode
    ?.split('')
    .map((char, index) => <Hitable key={index} index={index} type={char} />);
  return (
    <group>
      <Train coachCode={coachCode} />

      <group position={[peoplePosition, 0, 0.1]}>{hitableComponents}</group>
    </group>
  );
};

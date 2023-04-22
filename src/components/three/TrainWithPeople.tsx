import { Enemy } from './Enemy';
import { Train } from './Train';

export const TrainWithPeople: React.FC<{}> = () => {
  return (
    <group>
      <Train coachCode="avz" />
      <Enemy index={0} />
      <Enemy index={1} />
    </group>
  );
};

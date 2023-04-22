import { TrainCoach } from './TrainCoach';
export interface TrainProps {
  coachCode?: string;

  timeliness?: number;
}
export function Train(
  props: TrainProps = {
    coachCode: 'aaa',
    timeliness: 1,
  },
) {
  const coachComponents = props.coachCode
    ?.split('')
    .map((char, index) => <TrainCoach key={index} index={index} type={char} />);

  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <group>
      <TrainCoach index={0} type={'a'} />
      <TrainCoach index={1} type={'a'} />
    </group>
  );
}

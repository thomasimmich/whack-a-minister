import { useAnimationFrame } from 'framer-motion';
import { useState } from 'react';
import { useCoachWidth, useTrainPosition } from '../../hooks/useTrainPosition';
import { Hitable } from './Hitable';
import { Train } from './Train';

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomString(length: number, characters: string): string {
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = getRandomInt(0, characters.length - 1);
    result += characters.charAt(randomIndex);
  }

  return result;
}

// Example usage:

const allowedCharacters = 'abc';

export const TrainWithPeople: React.FC<{}> = () => {
  // const [levelEntities] = useRenderSystemEntities((e) => e.hasAll(LevelFacet, ActivationFacet));

  // useEffect(() => {
  //   const ac = levelEntities[0]?.get(ActivationFacet)?.props.activationCode ?? '';
  //   setActivationCode(ac);
  //   console.log('Setting activation code to ', activationCode);
  // }, [levelEntities]);

  const coachCode = 'avz';

  const [activationCode, setActivationCode] = useState(
    generateRandomString(coachCode.length * 8, allowedCharacters),
  );

  const [elapsedTime, setElapsedTime] = useState(0);

  useAnimationFrame((_state, _dt) => {
    setElapsedTime((elapsedTime) => elapsedTime + _dt);
    console.log('elapsedTime', elapsedTime);

    if (elapsedTime > 1000) {
      const activationCode = generateRandomString(coachCode.length * 8, allowedCharacters);
      console.log('activationCode', activationCode);
      setActivationCode(activationCode);
      setElapsedTime(0);
    }
  });

  const coachWidth = useCoachWidth();
  const trainPosition = useTrainPosition(coachCode);
  const peoplePosition = trainPosition;
  console.log('trainPosition', trainPosition);
  console.log('coachWidth', coachWidth);

  const hitableComponents = activationCode
    ?.split('')
    .map((char, index) => <Hitable key={index} index={index} type={char} />);
  return (
    <group>
      <Train coachCode={coachCode} />

      <group position={[peoplePosition, -0.047, 0.1]}>{hitableComponents}</group>
    </group>
  );
};

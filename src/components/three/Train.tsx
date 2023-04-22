export interface TrainProps {
  position: [number, number, number];
  length: number;
}
export function Train(props: TrainProps) {
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={'hotpink'} />
    </mesh>
  );
}

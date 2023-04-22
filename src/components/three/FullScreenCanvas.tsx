import { Box } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { PropsWithChildren, useEffect, useRef } from 'react';

const ScaledBox = () => {
  const boxRef = useRef<any>(null);
  const { size, viewport } = useThree();

  useEffect(() => {
    const aspectX = size.width / viewport.width;
    const aspectY = size.height / viewport.height;
    boxRef.current.scale.set(1.0 * aspectX, 1.0 * aspectY, 1.0);
  }, [size, viewport]);

  // useFrame(() => {
  //   boxRef.current.rotation.y += 0.01;
  // });

  return <Box ref={boxRef} args={[1, 1, 1]} />;
};

const ScaledScene: React.FC<PropsWithChildren<{}>> = (props: PropsWithChildren<{}>) => {
  const sceneRef = useRef<any>(null);
  const { size, viewport } = useThree();

  useEffect(() => {
    const aspectX = size.width / viewport.width;
    const aspectY = size.height / viewport.height;
    sceneRef.current.scale.set(aspectX * 0.2, aspectY * 0.2, 1.0);
  }, [size, viewport]);

  return (
    <group ref={sceneRef}>
      <Box args={[1, 1, 1]}>
        <meshBasicMaterial color="blue" />
      </Box>
      {props.children}
    </group>
  );
};

export const FullScreenCanvas: React.FC<PropsWithChildren<{}>> = (props: PropsWithChildren<{}>) => {
  return (
    <Canvas style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <ScaledScene>{props.children}</ScaledScene>
      <camera position={[0, 0, 5]} />
    </Canvas>
  );
};

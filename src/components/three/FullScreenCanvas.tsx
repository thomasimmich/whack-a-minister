import { Box } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { PropsWithChildren, useEffect, useRef } from 'react';
import { MeshBasicMaterial } from 'three';

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
      {props.children}
      <Box position={[0, 0, -0.1]} args={[1, 1, 1]}>
        <meshBasicMaterial color="#ffffff" />
      </Box>
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

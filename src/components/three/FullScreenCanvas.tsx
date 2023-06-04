import { Box } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { MeshBasicMaterial } from 'three';

const ScaledScene: React.FC<PropsWithChildren<{}>> = (props: PropsWithChildren<{}>) => {
  const sceneRef = useRef<any>(null);
  const { size, viewport } = useThree();
  const [isWideScreen, setIsWideScreen] = useState(false);

  useEffect(() => {
    const aspectX = size.width / viewport.width;
    const aspectY = size.height / viewport.height;
    if ( isWideScreen == true) {sceneRef.current.scale.set(aspectX * 0.2, aspectY * 0.2, 1.0);}
    else {sceneRef.current.scale.set(aspectX * 0.1, aspectY * 0.1, 1.0);}
  }, [size, viewport]);

  useEffect(() => {
    const handleResize = () => {
      const screenRatio = window.innerHeight / window.innerWidth;
      setIsWideScreen(screenRatio < 0.5); // Überprüft, ob das Verhältnis Höhe zu Breite größer als 1.5 ist
    };

    // Event Listener für Bildschirmgrößenänderungen hinzufügen
    window.addEventListener('resize', handleResize);

    // Initialisierung der Bildschirmgröße überprüfen
    handleResize();

    // Event Listener entfernen, wenn die Komponente unmountet wird
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  console.log( window.innerHeight / window.innerWidth)

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

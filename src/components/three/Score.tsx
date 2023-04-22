import { Text } from '@react-three/drei';
import React from 'react';

export const Score: React.FC = () => {
  return (
    <React.Suspense fallback={null}>
      <Text
        color="black" // Text color
        fontSize={0.02} // Font size (default is 1)
        maxWidth={200} // Max width for text wrapping (default is Infinity)
        lineHeight={1} // Line height (default is 1)
        letterSpacing={0} // Letter spacing (default is 0)
        textAlign="left" // Text alignment (default is 'left')
        font="/src/assets/fonts/ravie.ttf" // URL to the font file (required)
        anchorX="center" // Horizontal anchor point (default is 'left')
        anchorY="middle" // Vertical anchor point (default is 'top')
        position={[0, 0.15, 1]} // Position in the 3D space
      >
        Hello, React Three Fiber!
      </Text>
    </React.Suspense>
  );
};

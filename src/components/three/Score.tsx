import { Text } from '@react-three/drei';
import React from 'react';

import { ScoreFacet } from '../../app/GameFacets';
import { BASE_ASSET_URL } from '../../base/Constants';
import { useRenderSystemEntities } from '../../hooks/useRenderSystemEntities';
import { ScoreProps } from '../dom/Score';
export const Score: React.FC<ScoreProps> = (props: ScoreProps) => {
  console.log('score props', props);
  return (
    <React.Suspense fallback={null}>
      <Text
        color="black" // Text color
        fontSize={0.02} // Font size (default is 1)
        maxWidth={200} // Max width for text wrapping (default is Infinity)
        lineHeight={1} // Line height (default is 1)
        letterSpacing={0} // Letter spacing (default is 0)
        textAlign="left" // Text alignment (default is 'left')
        font={BASE_ASSET_URL + '/fonts/ravie.ttf'} // URL to the font file (required)
        anchorX="center" // Horizontal anchor point (default is 'left')
        anchorY="middle" // Vertical anchor point (default is 'top')
        position={[0, 0.05, 1]} // Position in the 3D space
      >
        {props?.scoreValue}
      </Text>
    </React.Suspense>
  );
};
export const Scores: React.FC = () => {
  const [scores] = useRenderSystemEntities((e) => e.has(ScoreFacet));

  return (
    <group>
      {scores.map((e) => (
        <Score key={e.id} {...e.get(ScoreFacet)?.props} />
      ))}
    </group>
  );
};

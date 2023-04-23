import { useEffect } from 'react';
import { Entity } from 'tick-knock';
import { GameStateFacet, GameStates, ScoreFacet } from '../app/GameFacets';
import { useRenderSystemEntities } from '../hooks/useRenderSystemEntities';

export const ScoreEvaluationSystem = () => {
  //const ecs = useContext(ECSContext);
  const [gameEntities] = useRenderSystemEntities((e) => e.has(ScoreFacet));

  useEffect(() => {
    console.log('ScoreEvaluationSystem ', gameEntities);
    function onScoreChanged(e: Entity, c: unknown) {
      if (c instanceof ScoreFacet && (e?.get(ScoreFacet)?.props.scoreValue ?? 0) > 1400) {
        e?.addComponent(new GameStateFacet({ gameState: GameStates.GAME_OVER }));
        console.log('GAME OVER');
      }
    }

    console.log('ScoreEvaluationSystem useEffect');
    const gameEntity = gameEntities[0];

    gameEntity?.onComponentAdded.connect(onScoreChanged);

    return () => {
      gameEntity?.onComponentAdded.disconnect(onScoreChanged);
    };
  }, gameEntities);

  // gameEntities.map((gameEntity) => {
  //   function onScoreChanged(e: Entity, c: unknown) {
  //     if (e?.get(ScoreFacet)?.props.scoreValue ?? 0 > 1200) {
  //       e?.addComponent(new GameStateFacet({ gameState: GameStates.GAME_OVER }));
  //       console.log('GAME OVER');
  //     }
  //   }
  //   gameEntity?.onComponentAdded.connect(onScoreChanged);
  //   return () => {
  //     gameEntity?.onComponentAdded.disconnect(onScoreChanged);
  //   };
  // });

  return <></>;
};

import { useAnimationFrame } from 'framer-motion';
import { useEffect } from 'react';
import { ActivationFacet, HitableFacet } from '../app/GameFacets';
import { useRenderSystemEntities } from '../hooks/useRenderSystemEntities';

export const HitableActivationSystem = () => {
  //const ecs = useContext(ECSContext);
  const [hitableEntities] = useRenderSystemEntities((e) => e.hasAll(HitableFacet, ActivationFacet));

  useEffect(() => {
    console.log('HitableActivationSystem ', hitableEntities);
  }, [hitableEntities]);

  useAnimationFrame((_state, _dt) => {
    hitableEntities.forEach((hitableEntity) => {
      hitableEntity.add(new ActivationFacet({ activatedIndexes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] }));
    });
  });

  // function onHitCountChanged(e: Entity, c: unknown) {
  //   if (c instanceof HitableFacet) {
  //     console.log('GAME OVER');
  //   }
  // }

  // console.log('HitableActivationSystem useEffect');
  // hitableEntities.forEach((hitableEntity) => {
  //   hitableEntity?.onComponentAdded.connect(onHitCountChanged);
  // });

  // return () => {
  //   hitableEntities.forEach((hitableEntity) => {
  //     hitableEntity?.onComponentAdded.disconnect(onHitCountChanged);
  //   });
  // };

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

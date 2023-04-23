import { useAnimationFrame } from 'framer-motion';
import { useEffect } from 'react';
import { ActivationFacet, LevelFacet } from '../app/GameFacets';
import { useRenderSystemEntities } from '../hooks/useRenderSystemEntities';

export const HitableActivationSystem = () => {
  //const ecs = useContext(ECSContext);
  const [levelEntities] = useRenderSystemEntities((e) => e.hasAll(LevelFacet, ActivationFacet));

  useEffect(() => {
    console.log('HitableActivationSystem ', levelEntities);
  }, [levelEntities]);

  useAnimationFrame((_state, _dt) => {
    levelEntities.forEach((levelEntity) => {
      levelEntity.add(new ActivationFacet({ activationCode: 'aaaabbbbb' }));
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

import { useCallback, useContext, useEffect, useState } from 'react';
import { Entity, QueryPredicate } from 'tick-knock';
import { ECSContext } from '../app/ECSContext';
import { RenderSystem } from '../systems/RenderSystem';

export function useRenderSystemEntities(predicate: QueryPredicate): [readonly Entity[], number] {
  const ecs = useContext(ECSContext);
  //const isCoEngine = (ecs as any).isCoEngine;
  const [timeStamp, setTimeStamp] = useState(0);

  const renderCallback = useCallback((dt: any) => {
    setTimeStamp(dt);
  }, []);

  const [renderSystem] = useState<RenderSystem>(new RenderSystem('🎨', predicate, renderCallback));

  useEffect(() => {
    ecs.engine.addSystem(renderSystem);
    return () => {
      ecs.engine.removeSystem(renderSystem);
    };
  }, [renderSystem, ecs.engine]);

  return [renderSystem.entities, timeStamp];
}

export function useRenderSystemEffect(
  predicate: QueryPredicate,
  callback: (entities: readonly Entity[]) => void,
) {
  const [entities] = useRenderSystemEntities(predicate);

  useEffect(() => {
    callback(entities);
  }, [entities, callback]);
}

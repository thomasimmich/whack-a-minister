import { useContext, useState, useEffect } from 'react';
import { QueryPredicate, Entity, Query } from 'tick-knock';
import { ECSContext } from '../app/ECSContext';

export function useEntity(queryPredicate: QueryPredicate): [Entity | undefined, number] {
  const ecs = useContext(ECSContext);
  //const entities = useEntities(queryPredicate);
  const [entity, setEntity] = useState<Entity>();
  const [timestamp, setTimestamp] = useState<number>(Date.now());
  useEffect(() => {
    const query = new Query(queryPredicate);
    query.matchEntities(ecs.engine.entities);
    console.log('Entities in useEntity() ', ecs.engine.entities);

    if (query.entities.length === 1) {
      const entity = query.entities[0];

      entity.onComponentAdded.connect((e: Entity, c: unknown) => {
        console.log('Component added to entity', e, c)
        setTimestamp(Date.now());
      })
      setEntity(entity);
    }
  }, []);
  return [entity, timestamp];
}

export function useEntities(queryPredicate: QueryPredicate) {
  const ecs = useContext(ECSContext);
  const [entities, setEntities] = useState<readonly Entity[]>();
  useEffect(() => {
    const query = new Query(queryPredicate);
    query.matchEntities(ecs.engine.entities);
    console.log('Entities in useEntity() ', ecs.engine.entities);

    ecs.engine.onEntityAdded.connect((e) => {
      console.log('Entity added in useEntity hook', e);
    });

    setEntities(query.entities)
  }, []);
  if (entities === undefined) {
    return [];
  }
  return entities;
}

import { useEffect, useState } from 'react';
import { Entity } from 'tick-knock';
import { Class, Facet } from '../base/Facet';

export function useFacetProps<A>(entity: Entity, facetAClass: Class<Facet<A>>) {
  const [facetAProps, setFacetAProps] = useState<A>();
  useEffect(() => {
    function onComponentAdded(e: Entity, component: unknown) {
      console.log('onComponentAdded', e, component);
      if (e !== undefined && e === entity) {
        setFacetAProps(e.get(facetAClass)?.props);
      }
    }

    function onComponentRemoved(e: Entity, component: unknown) {
      if (e !== undefined && e === entity && component instanceof facetAClass) {
        setFacetAProps(undefined);
      }
    }

    entity?.onComponentAdded.connect(onComponentAdded);
    entity?.onComponentRemoved.connect(onComponentRemoved);

    onComponentAdded(entity, entity?.get(facetAClass));

    return () => {
      entity?.onComponentAdded.disconnect(onComponentAdded);
      entity?.onComponentRemoved.disconnect(onComponentRemoved);
    };
  }, [entity, facetAClass]);
  return [facetAProps];
}

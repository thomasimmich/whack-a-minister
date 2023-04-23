import { useAnimationFrame } from 'framer-motion';
import { useContext, useEffect, useState } from 'react';
import { ECSContext } from '../app/ECSContext';
import { Class } from '../base/Facet';
import { UpdateOnRenderSystem } from '../systems/UpdateOnRenderSystem';

export function useUpdateOnRenderSystem<T extends UpdateOnRenderSystem>(
  systemClass?: Class<T>,
): [UpdateOnRenderSystem | undefined] {
  const emoji = '🎨⚙️🪝';
  const ecs = useContext(ECSContext);
  const [uorSystem, setUorSystem] = useState<UpdateOnRenderSystem>();
  const [shouldUpdateOnRender, setShouldUpdateOnRender] = useState(true);
  useEffect(() => {
    if (systemClass) {
      if (uorSystem) {
        ecs.engine.removeSystem(uorSystem);
      }

      const system = new systemClass();
      ecs.engine.addSystem(system);
      setUorSystem(system);

      system.onNeedsUpdate = () => {
        console.log(emoji + 'System needs update', system.constructor.name);
        setShouldUpdateOnRender(true);
      };

      system.onhasUpdated = () => {
        if (shouldUpdateOnRender) {
          console.log(emoji + 'System has updated after rendering', system.constructor.name);
        }
        setShouldUpdateOnRender(false);
      };
    }
  }, []);

  useAnimationFrame((dt: number) => {
    if (shouldUpdateOnRender) {
      console.log(emoji + ' update(dt)');
      uorSystem?.update(dt);
    }
  });

  return [uorSystem];
}

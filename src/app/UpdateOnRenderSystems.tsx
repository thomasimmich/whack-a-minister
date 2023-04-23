import { Class } from '../base/Facet';
import { useUpdateOnRenderSystem } from '../hooks/useUpdateOnRenderSystem';
import { ScoreSystem } from '../systems/ScoreSystem';
import { UpdateOnRenderSystem } from '../systems/UpdateOnRenderSystem';

export function UpdateOnRenderSystemRenderer<T extends UpdateOnRenderSystem>(props: {
  systemClass: Class<T>;
}) {
  const [system] = useUpdateOnRenderSystem(props.systemClass);
  return <>{system?.emoji}</>;
}

export default function UpdateOnRenderAppSystems() {
  return (
    <div style={{ display: 'none' }}>
      <UpdateOnRenderSystemRenderer systemClass={ScoreSystem} />
    </div>
  );
}

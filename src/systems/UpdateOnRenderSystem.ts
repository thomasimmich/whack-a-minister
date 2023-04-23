import { EntitySnapshot, IterativeSystem, QueryPredicate } from 'tick-knock';
export abstract class UpdateOnRenderSystem extends IterativeSystem {
  protected needsUpdate = true;
  constructor(
    public emoji: string,
    queryPredicate: QueryPredicate,
    public onNeedsUpdate?: () => void,
    public onhasUpdated?: () => void,
  ) {
    super(queryPredicate);
  }

  public update(dt: number): void {
    super.update(dt);
    if (this.onhasUpdated) {
      this.onhasUpdated();
    }
    this.needsUpdate = false;
  }

  protected entityAdded = ({}: EntitySnapshot) => {
    if (this.onNeedsUpdate) {
      this.onNeedsUpdate();
    }
    this.needsUpdate = true;
  };

  protected entityRemoved = ({}: EntitySnapshot) => {
    if (this.onNeedsUpdate) {
      this.onNeedsUpdate();
    }
    this.needsUpdate = true;
  };
}

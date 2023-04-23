import { Entity } from 'tick-knock';
import { ScoreFacet } from '../app/GameFacets';
import { UpdateOnRenderSystem } from './UpdateOnRenderSystem';

export class ScoreSystem extends UpdateOnRenderSystem {
  constructor() {
    super('🥇', (e) => e.has(ScoreFacet));
    console.log(this.emoji + 'ScoreSystem constructor invoked', this);
  }

  // onAddedToEngine(): void {
  //   super.onAddedToEngine();
  //   this.query.onEntityAdded.connect(this.onEntityAdded.bind(this));
  //   this.query.onEntityRemoved.connect(this.onEntityRemoved.bind(this));
  //   this.query.entities.forEach((e) => this.connectEntity(e));
  // }

  // connectEntity(entity: Entity) {
  //   console.log(this.emoji + 'connectEntity');
  //   entity.onComponentAdded.disconnect(this.onComponentAdded.bind(this));
  // }

  // disconnectEntity(entity: Entity) {
  //   console.log(this.emoji + 'disconnectEntity');
  //   entity.onComponentAdded.disconnect(this.onComponentAdded.bind(this));
  // }

  // onEntityAdded(entity: EntitySnapshot) {
  //   console.log(this.emoji + 'onEntityAdded');
  //   this.connectEntity(entity.current);
  // }

  // onEntityRemoved(entity: EntitySnapshot) {
  //   console.log(this.emoji + 'onEntityRemoved');
  //   this.disconnectEntity(entity.current);
  // }

  protected updateEntity(entity: Entity, dt: number): void {
    console.log(this.emoji + 'updateEntity_', entity, dt);
  }

  onComponentAdded(_e: Entity, c: unknown) {
    if (c instanceof ScoreFacet) {
      if (c.props.scoreValue > 1200) {
        console.log(this.emoji + 'Score > 1200');
      }
    }
  }
}

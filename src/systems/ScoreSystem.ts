import { Entity, UpdateOnRenderSystem } from '@leanscope/ecs-engine';
import { ScoreFacet } from '../app/GameFacets';


export class ScoreSystem extends UpdateOnRenderSystem {
  constructor() {
    super('🥇', (e) => e.has(ScoreFacet));
    console.log(this.identifier + 'ScoreSystem constructor invoked', this);
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
    console.log(this.identifier + 'updateEntity_', entity, dt);
  }

  onComponentAdded(_e: Entity, c: unknown) {
    if (c instanceof ScoreFacet) {
      if (c.props.scoreValue > 1200) {
        //console.log(this.emoji + 'Score > 1200');
      }
    }
  }
}

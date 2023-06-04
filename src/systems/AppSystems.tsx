import { useContext, useEffect, useState } from 'react';
import {
  CoinsFacet,
  ScoreFacet,
  LevelFacet,
  HitableFacet,
  GameStateFacet,
  GameStates,
  NameFacet,
  ImageFacet,
  CurrentLevelFacet,
  CurrentDialougeFacet,
} from '../app/GameFacets';
import { BASE_ASSET_URL, Tags } from '../base/Constants';
import { ECSContext, Entity, System } from '@leanscope/ecs-engine';

export const InitSystem = () => {
  const ecs = useContext(ECSContext);

  useEffect(() => {
    console.log('app init');
    ecs.engine.clear();

      // Dialouge
    const currentDialougeEntity = new Entity();
    ecs.engine.addEntity(currentDialougeEntity);
    currentDialougeEntity.addComponent(
      new CurrentDialougeFacet({
        currentDialougeArray: [ 
          'Hallo Paul! Es ist nun an der Zeit, dass unsere Reise beginnt. Der Zug wird in Kürze eintreffen, um die Milchtüte sicher zum König zu bringen. Doch wir sollten uns vor den Plastikjägern in Acht nehmen. Sie sind darauf aus, uns die Tüte zu entreißen. Wir müssen wachsam sein und uns gegenseitig unterstützen, um unser Ziel zu erreichen.',
          'Also lass uns bereit sein, Paul! Der Zug wird jeden Moment ankommen, und wir werden diese aufregende Reise antreten. Zusammen können wir Hindernisse überwinden und eine positive Veränderung bewirken. Auf geht`s!',
        ],
      }),
    );
    // Current Level
    const currentLevelEntity = new Entity();
    ecs.engine.addEntity(currentLevelEntity);
    currentLevelEntity.addComponent(new CurrentLevelFacet({ currentLevelValue: 2 }));

    // Coins
    const coinsEntity = new Entity();
    ecs.engine.addEntity(coinsEntity);
    coinsEntity.addComponent(new CoinsFacet({ coinsValue: 0 }));

    // Score
    const scoreEntity = new Entity();
    ecs.engine.addEntity(scoreEntity);
    scoreEntity.addComponent(new ScoreFacet({ scoreValue: 0 }));

    //  Level 1
    const level1Entity = new Entity();
    ecs.engine.addEntity(level1Entity);
    level1Entity.addComponent(new LevelFacet({ levelValue: 1 }));
    level1Entity.addComponent(new NameFacet({ name: 'Level 001' }));
    level1Entity.addComponent(new ImageFacet({ src: BASE_ASSET_URL + '/images/menu/card-1.png' }));

    const level2Entity = new Entity();
    ecs.engine.addEntity(level2Entity);
    level2Entity.addComponent(new LevelFacet({ levelValue: 2 }));
    level2Entity.addComponent(new NameFacet({ name: 'Level 002' }));
    level2Entity.addComponent(new ImageFacet({ src: BASE_ASSET_URL + '/images/menu/card-2.png' }));


    // Hitable
    const enemyEntity = new Entity();
    ecs.engine.addEntity(enemyEntity);
    enemyEntity.addComponent(new HitableFacet({ hitCount: 0 }));

    // Gamestate
    const gameStateEntity = new Entity();
    ecs.engine.addEntity(gameStateEntity);
    gameStateEntity.addComponent(new GameStateFacet({ gameState: GameStates.WELCOME }));

    console.log('Game state entity added', ecs.engine.entities);

    return () => {
      ecs.engine.removeEntity(scoreEntity);
      ecs.engine.removeEntity(level1Entity);
      ecs.engine.removeEntity(level2Entity);
      ecs.engine.removeEntity(enemyEntity);
      ecs.engine.removeEntity(gameStateEntity);
      ecs.engine.removeEntity(coinsEntity);
    };
  }, []);

  const [blacklistedIdentifiableSystems] = useState(new Set<System>());

  return <></>;
};

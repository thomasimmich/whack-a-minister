import { useContext, useEffect, useState } from "react";
import { CoinsFacet, ScoreFacet, LevelFacet, HitableFacet, GameStateFacet, GameStates, NameFacet, ImageFacet } from "../app/GameFacets";
import { BASE_ASSET_URL, Tags } from "../base/Constants";
import { ECSContext, Entity, System } from "@leanscope/ecs-engine";

export const InitSystem = () => {
    const ecs = useContext(ECSContext);
  
    useEffect(() => {
      console.log('app init');
      ecs.engine.clear();
  
      // Level System@
  
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
      level1Entity.addComponent(new NameFacet({ name: "Level 001" }));
      level1Entity.addComponent(new ImageFacet({ src: BASE_ASSET_URL + '/images/menu/card-1.png' }));


        
      const level2Entity = new Entity();
      ecs.engine.addEntity(level2Entity);
      level2Entity.addComponent(new LevelFacet({ levelValue: 2 }));
      level1Entity.addComponent(new ImageFacet({ src: BASE_ASSET_URL + '/images/menu/card-1.png' }));
      level2Entity.addTag(Tags.LOCKED)


      // Hitable
      const enemyEntity = new Entity();
      ecs.engine.addEntity(enemyEntity);
      enemyEntity.addComponent(new HitableFacet({ hitCount: 0 }));
  
      // Gamestate
      const gameStateEntity = new Entity();
      ecs.engine.addEntity(gameStateEntity);
      gameStateEntity.addComponent(new GameStateFacet({ gameState: GameStates.PLAYING }));
  
      console.log('Game state entity added', ecs.engine.entities)
  
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

  
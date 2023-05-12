import { ECSContext } from "../app/ECSContext";
import { Entity } from 'tick-knock';
import { BuildCodeFacet, CoinsFacet, IsActiveFacet, LevelScoreFacet, LockedFacet, NameFacet, ImageFacet } from "../app/GameFacets";
import { useContext, useEffect } from "react";
import { BASE_ASSET_URL } from "../base/Constants";

const LevelSystem = () => {
    const ecs = useContext(ECSContext);
    
    useEffect(() => {
      console.log('app start');
      ecs.engine.clear();
  
      // name
      const nameEntity = new Entity();
      ecs.engine.addEntity(nameEntity);
      nameEntity.addComponent(new NameFacet({ name: "Lavel001" }));
  
      // src
      const srcEntity = new Entity();
      ecs.engine.addEntity(srcEntity);
      srcEntity.addComponent(new ImageFacet({ src: BASE_ASSET_URL + '/images/menu/card-1.png'}));
  
      // buildCode
      const buildCodeEntity = new Entity();
      ecs.engine.addEntity(buildCodeEntity);
      buildCodeEntity.addComponent(new BuildCodeFacet({ buildCode: "abc"}));
  
      // locked
      const lockedEntity = new Entity();
      ecs.engine.addEntity(lockedEntity);
      lockedEntity.addComponent(new LockedFacet({ locked: false}));
  
      // isActive
      const isActiveEntity = new Entity();
      ecs.engine.addEntity(isActiveEntity);
      isActiveEntity.addComponent(new IsActiveFacet({ isActive: false}));
   
      // score    
      const levelScoreEntity = new Entity();
      ecs.engine.addEntity(levelScoreEntity);
      levelScoreEntity.addComponent(new LevelScoreFacet({ score: 0}));
   
  
      return () => {
        ecs.engine.removeEntity(nameEntity);
        ecs.engine.removeEntity(srcEntity);
        ecs.engine.removeEntity(buildCodeEntity);
        ecs.engine.removeEntity(lockedEntity);
        ecs.engine.removeEntity(isActiveEntity);
        ecs.engine.removeEntity(levelScoreEntity);
  
      };
    
      
    }, []);
  }
  
  
  
  export default LevelSystem
  
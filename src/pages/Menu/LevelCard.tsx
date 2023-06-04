
import { IoCaretForward, IoLockClosed} from 'react-icons/io5';
import { GameStateFacet, GameStates, ImageFacet, ImageProps, NameFacet, NameProps } from '../../app/GameFacets';
import { useContext } from 'react';
import { ECSContext, useEntity, useEntityComponent, useEntityHasTag } from '@leanscope/ecs-engine';
import { EntityProps } from '@leanscope/ecs-engine/react-api/classes/EntityProps';
import { Tags } from '../../base/Constants';



const LevelCard = (props: EntityProps ) => {
  const [isLocked] = useEntityHasTag(props.entity, Tags.LOCKED)
  const [nameFacet] = useEntityComponent(props.entity, NameFacet)

  const [imageFacet] = useEntityComponent(props.entity, ImageFacet)

  const [gameStateEntity] = useEntity((e) => e.has(GameStateFacet))


  function handleClick(event: any) {

  
    // Füge den "CURRENT"-Tag dem angeklickten Entity hinzu
    props.entity.addTag(Tags.CURRENT);
  
    // Aktualisiere den GameState
    gameStateEntity?.addComponent(new GameStateFacet({ gameState: GameStates.DIALOUGE }));
  
    console.log("Clicked on level card ", event);
  }
  



  return (
    <>
      {isLocked ? (
        <div  className='w-full mt-4 h-40 rounded-2xl '  style={{ backgroundImage: `url(${imageFacet.props.src})`,}}>
          <div className='bg-black p-5  rounded-xl flex items-center justify-center  bg-opacity-60 w-full h-full'>
            <IoLockClosed  className="text-5xl  text-white"/>
          </div>
        </div>
      ) : (
        <div id={nameFacet.props.name} onClick={handleClick} className='w-full mt-4 h-40 rounded-xl p-5 flex items-end'  style={{ backgroundImage: `url(${imageFacet.props.src})`,}}>
          <p className='text-3xl font-bold text-white flex  '>{nameFacet.props.name} <IoCaretForward className="text-3xl mt-1 ml-1"/></p>
        </div>
      )}
    </>
  )
}

export default LevelCard
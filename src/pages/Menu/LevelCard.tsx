
import { IoCaretForward, IoLockClosed} from 'react-icons/io5';
import { GameStateFacet, GameStates, ImageProps, NameProps } from '../../app/GameFacets';
import { useContext } from 'react';
import { ECSContext } from '../../app/ECSContext';
import { useEntity } from '../../hooks/useEntity';

interface LevelCardProps extends ImageProps, NameProps {


 isLocked: boolean;
}

const LevelCard = ({src, name, isLocked, }: LevelCardProps ) => {
  const ecs = useContext(ECSContext);
  const [gameStateEntity] = useEntity((e) => e.has(GameStateFacet))


  function handleClick(event: any) {
   gameStateEntity?.addComponent(new GameStateFacet({ gameState: GameStates.PLAYING }));
    console.log("Clicked on level card ", event)
  
  }

  return (
    <>
      {isLocked ? (
        <div  className='w-full mt-4 h-40 rounded-2xl '  style={{ backgroundImage: `url(${src})`,}}>
          <div className='bg-black p-5  rounded-xl flex items-center justify-center  bg-opacity-60 w-full h-full'>
            <IoLockClosed  className="text-5xl  text-white"/>
          </div>
        </div>
      ) : (
        <div id={name} onClick={handleClick} className='w-full mt-4 h-40 rounded-xl p-5 flex items-end'  style={{ backgroundImage: `url(${src})`,}}>
          <p className='text-3xl font-bold text-white flex  '>{name} <IoCaretForward className="text-3xl mt-1 ml-1"/></p>
        </div>
      )}
    </>
  )
}

export default LevelCard
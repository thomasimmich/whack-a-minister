import { IoCaretForward, IoLockClosed} from 'react-icons/io5';

interface LevelCardProps {
  play: () => void;
  src: string;
  name: string;
  locked: boolean;
  id: number;
}

const LevelCard = ({play, src, name, locked, id}: LevelCardProps ) => {
  function handleClick() {play(id)}

  return (
    <>
      {locked ? (
        <div  className='w-full mt-4 h-40 rounded-2xl '  style={{ backgroundImage: `url(${src})`,}}>
          <div className='bg-black p-5  rounded-xl flex items-center justify-center  bg-opacity-60 w-full h-full'>
            <IoLockClosed  className="text-5xl  text-white"/>
          </div>
        </div>
      ) : (
        <div onClick={handleClick} className='w-full mt-4 h-40 rounded-xl p-5 flex items-end'  style={{ backgroundImage: `url(${src})`,}}>
          <p className='text-3xl font-bold text-white flex  '>{name} <IoCaretForward className="text-3xl mt-1 ml-1"/></p>
        </div>
      )}
    </>
  )
}

export default LevelCard
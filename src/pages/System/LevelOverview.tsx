import { IoHome, IoStatsChart } from 'react-icons/io5';

import LevelCard from './LevelCard';
import { levels } from '../levels';
import { useRenderSystemEntities } from '../../hooks/useRenderSystemEntities';

interface LevelOverviewProps {
  play: () => void;
  toggleActiveScore: () => void;
}
  
const LevelOverview = ({play, toggleActiveScore}: LevelOverviewProps) => {

  return (
    <div  className='w-full h-full p-8   text-black'>
      <div className='flex justify-between pb-3  w-full'>
        <div>
          <p className=' text-On-Surface-Variant '>SAMSTAG, 11. FEBRUAR</p>
          <p className='text-3xl font-bold'>Home</p>
        </div>

        <div className=' flex text-3xl  text-system-blue'>
          <div>
            <IoHome className='mr-3 w-full justify-center' />
            <p className=' text-sm w-full '>Home</p>
          </div>
          <div onClick={toggleActiveScore} className=' ml-2'>
            <IoStatsChart  className='mr-3  text-icon w-full justify-center' />
            <p className=' text-sm w-full text-icon '>Score</p>
          </div>
        </div>
      </div>
    
      {levels.map((level) => (<LevelCard id={level.id} play={play} src={level.src} name={level.name} locked={level.locked} />))}
    </div>
  )
}

export default LevelOverview
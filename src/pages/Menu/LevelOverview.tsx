import { IoHome, IoStatsChart } from 'react-icons/io5';

import LevelCard from './LevelCard';


import { ImageFacet, LevelFacet, NameFacet } from '../../app/GameFacets';
import { Tags } from '../../base/Constants';
import { useEntities } from '@leanscope/ecs-engine';

interface LevelOverviewProps {
  toggleActiveScore: () => void;
}
  
const LevelOverview = ({ toggleActiveScore}: LevelOverviewProps) => {
 const levelEntities = useEntities((e) => e.has(LevelFacet));


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

      {/* {levelEntities.map((e, index) => (<LevelCard  key={index} src={e.get(ImageFacet)?.props.src ?? 'myplaceholde.png'}  name={e.get(NameFacet)?.props.name ?? 'Untitled'} isLocked={e.hasTag(Tags.LOCKED)} />))}
       */}
    </div>
  )
}

export default LevelOverview
import { IoHome, IoStatsChart } from 'react-icons/io5';

import LevelCard from './LevelCard';

import {
  CurrentLevelFacet,
  GameStateFacet,
  GameStates,
  ImageFacet,
  LevelFacet,
  NameFacet,
} from '../../app/GameFacets';
import { Tags } from '../../base/Constants';
import { useEntities, useEntity } from '@leanscope/ecs-engine';

interface LevelOverviewProps {
  toggleActiveScore: () => void;
}

const getCurrentDate = (): string => {
  const daysOfWeek = ['SONNTAG', 'MONTAG', 'DIENSTAG', 'MITTWOCH', 'DONNERSTAG', 'FREITAG', 'SAMSTAG'];
  const months = ['JANUAR', 'FEBRUAR', 'MÄRZ', 'APRIL', 'MAI', 'JUNI', 'JULI', 'AUGUST', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DEZEMBER'];

  const currentDate = new Date();
  const dayOfWeek = daysOfWeek[currentDate.getDay()];
  const dayOfMonth = currentDate.getDate();
  const month = months[currentDate.getMonth()];

  return `${dayOfWeek}, ${dayOfMonth}. ${month}`;
};

const LevelOverview = ({ toggleActiveScore }: LevelOverviewProps) => {
  const [levelEntities] = useEntities((e) => e.has(LevelFacet));
  const currentDate = getCurrentDate();



  return (
    <div className="w-full h-full p-8   text-black">
      <div className="flex justify-between pb-3  w-full">
        <div>
          <p className=" text-On-Surface-Variant ">{currentDate.toUpperCase()}</p>
          <p className="text-3xl font-bold">Home</p>
        </div>

        <div className=" flex text-3xl  text-system-blue">
          <div>
            <IoHome className="mr-3 w-full justify-center" />
            <p className=" text-sm w-full ">Home</p>
          </div>
          <div onClick={toggleActiveScore} className=" ml-2">
            <IoStatsChart className="mr-3  text-icon w-full justify-center" />
            <p className=" text-sm w-full text-icon ">Score</p>
          </div>
        </div>
      </div>

   
      {levelEntities.map((e, index) => (<LevelCard entity={e}  key={index} />))} 
    </div>
  );
};

export default LevelOverview;

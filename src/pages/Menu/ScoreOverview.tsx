import { IoHome, IoStatsChart } from 'react-icons/io5';
import { BASE_ASSET_URL } from '../../base/Constants';

interface ScoreOverviewProps {
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


const ScoreOverview = ({toggleActiveScore}: ScoreOverviewProps ) => {
  const ScoreIlustration = BASE_ASSET_URL + '/images/menu/ScoreView.png';
  const currentDate = getCurrentDate();

  return (
    <div  className='w-full h-full  text-black'>
      <div className='flex p-8 h-1/3 justify-between w-full'>
        <div>
          <p className=' text-On-Surface-Variant '>{currentDate.toUpperCase()}</p>
          <p className='text-3xl font-bold'>Score</p>
        </div>
        <div className=' flex text-3xl  text-system-blue'>
          <div  onClick={toggleActiveScore} >
            <IoHome className='mr-3 w-full text-icon justify-center' />
            <p className=' text-sm w-full  text-icon  '>Home</p>
          </div>
          <div className=' ml-2'>
            <IoStatsChart className='mr-3   w-full justify-center' />
            <p className=' text-sm w-full'>Score</p>
          </div>     
        </div>
      </div>
   
      <div className='h-2/3  w-full justify-end flex items-end'>
        <img className='w-2/3' src={ScoreIlustration} />
      </div>
    </div>
  )
}

export default ScoreOverview
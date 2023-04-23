
import { IoHome, IoStatsChart } from "react-icons/io5"
import { BASE_ASSET_URL } from '../base/Constants';



const Home = () => {
  function toggleActiveScore() {}
  function play() {}

  const Card =  BASE_ASSET_URL + '/images/menu/card-1.png';

  return (
    <div  className='w-full h-full p-8   text-black'>
      <div className='flex justify-between w-full'>
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

      <div className='mt-6'>
        <div onClick={play} className='w-full h-40 rounded-xl p-5 flex items-end'  style={{ backgroundImage: `url(${Card})`,}}>
          <p className='text-3xl font-bold text-white '>Play</p>
        </div>
      </div>
    </div>
  )
}

export default Home
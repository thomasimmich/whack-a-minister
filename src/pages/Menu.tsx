import  { useState } from 'react'
import { IoHome, IoStatsChart, IoCaretForward } from "react-icons/io5"
import { BASE_ASSET_URL } from '../base/Constants';



const Menu = () => {
  const [activeScore, setActiveScore] = useState(false)
  const ScoreIlustration = BASE_ASSET_URL + '/images/menu/ScoreView.png'
  const Card =  BASE_ASSET_URL + '/images/menu/card-1.png';


  function toggleActiveScore() {setActiveScore(!activeScore)}
  function play() {}


  return (
    <>
      {!activeScore ? (
        /* Home Ansicht */
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
            <p className='text-3xl font-bold text-white flex  '>Play <IoCaretForward className="text-3xl mt-1 ml-1"/></p>
          </div>
        </div>
      </div>
      ) : (<>
        {/* Score Ansicht */}
        <div  className='w-full h-full  text-black'>
          <div className='flex p-8 h-2/4 justify-between w-full'>
            <div>
              <p className=' text-On-Surface-Variant '>SAMSTAG, 11. FEBRUAR</p>
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

        
          <div className='h-2/4  w-full justify-end flex items-end'>
            <img src={ScoreIlustration} />
          </div>
        </div>
      </>)}
    </>
  )
}

export default Menu

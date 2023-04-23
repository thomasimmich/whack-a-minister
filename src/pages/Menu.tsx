import  { useState } from 'react'
import { IoHome, IoStatsChart } from "react-icons/io5"
import Home from './Home'
import { BASE_ASSET_URL } from '../base/Constants';



const Menu = () => {
  const [activeScore, setActiveScore] = useState(false)
  const ScoreIlustration = BASE_ASSET_URL + '/images/menu/ScoreView.png'


  function toggleActiveScore() {setActiveScore(!activeScore)}


  return (
    <>
      {!activeScore ? (
        /* Home Ansicht */
        <Home  />
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

        
          <div className='h-2/4  flex items-end'>
            <img src={ScoreIlustration} />
          </div>
        </div>
      </>)}
    </>
  )
}

export default Menu
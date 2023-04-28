import { BASE_ASSET_URL } from '../../base/Constants';
import TypingAnimation from '../../components/dom/TypingAnimation';
  
const LoadingScreen = () => {
  const ScoreIlustration = BASE_ASSET_URL + '/images/menu/ScoreView.png';
 
  return (
    <div className='w-screen h-screen fixed bg-white bootm-0 right-0 top-0 left-0'>
      <div className='w-full pt-32 h-1/2'>
        <p className='text-On-Surface-Variant w-full text-xl  text-center uppercase '>Watsch den Wissing</p>
        <p className='text-5xl text-black font-bold text-center '><TypingAnimation s='Lädt ...' /></p>
      </div>
   
      <div className='h-1/2  w-full justify-end flex items-end'>
        <img className='w-2/3' src={ScoreIlustration} />
      </div>

    </div>
  )

};

export default LoadingScreen
  

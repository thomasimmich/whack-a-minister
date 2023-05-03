import SheetViewOutline from '../StyleLibary/SheetViewOutline';
import { BASE_ASSET_URL } from '../../base/Constants';

interface WelcomeScreenProps {
  toggleNewUser: () => void;  
}

const WelcomeScreen = ({ toggleNewUser }: WelcomeScreenProps) => {
  const WelcomeImage = BASE_ASSET_URL + '/images/menu/image.png'

  return (
    <SheetViewOutline 
      backfunc={() => {
        toggleNewUser();
        return {}; 
      }}
    
      customText=''
      backClick={false}
      small={false}
      clickOutside={false}
      save={false}
      saveFunc={() => {}}
      content={(
        <>
        
          <div className='h-1/2 mx-5'> 
            <p className=' text-3xl font-bold  '>Wilkommen!</p>
            <p className='mt-3 text-On-Surface-Variant'>Bitte halte dein Handy wenn du spielst quer. </p>
          </div>
          <div className='h-1/2 flex items-end'>
            <img  className='w-full  md:rounded-b-xl' src={WelcomeImage} />
          </div>
        </>
    )} />
  )
  
}

export default WelcomeScreen
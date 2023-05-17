import SheetViewOutline from "../../pages/StyleLibary/SheetViewOutline"
import { BASE_ASSET_URL } from '../../base/Constants';
import TypingAnimation from "../../pages/StyleLibary/TypingAnimation";

const LevelDoneMenu = () => {
  const LevelDoneIlustration =  BASE_ASSET_URL + '/images/menu/levelDone001.png'

  return (
    <div className="fixed"><SheetViewOutline 
    backfunc={() => {}}
    backClick={false}
    small={false}
    clickOutside={false}
    save={false}
    customText={""}
    saveFunc={() => {}}content={<>
      <div className="ml-10"> <img className="w-4/6 " src={LevelDoneIlustration} /></div>
      <p className="ml-10 mt-10 text-3xl font-bold">Level Geschafft!</p>
      <p className=" mx-10 mt-3 text-sm text-On-Surface-Variant">  <TypingAnimation s="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. " /></p>
    </>} /></div>
  )
}

export default LevelDoneMenu
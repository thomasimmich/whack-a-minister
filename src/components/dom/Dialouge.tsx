import { IoPlayForward } from 'react-icons/io5';
import { BASE_ASSET_URL } from '../../base/Constants';
import TypingAnimation from '../../pages/StyleLibary/TypingAnimation';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface DialougeProps {
  text: string[];
  startGame: () => {};
}

const Dialouge = ({ text,startGame }: DialougeProps) => {
  const Q27 = BASE_ASSET_URL + '/images/menu/q-27TextBox.png';

  const [currentText, setCurrentText] = useState(text[0]);
  const [count, setCount] = useState(1);
  const [isVisible, setIsVisible] = useState(true)

  function handleNextClick() {
    if (count !== text.length) {
      setCount(count + 1);
      setCurrentText(text[count]);
    } else {
      setIsVisible(false)
      startGame()
    }
  }

  return (
    <motion.div
      transition={{ type: 'Tween' }}
      animate={{ y: !isVisible ? 1110 : 0 }}
      initial={{ y: 1110 }}
      className="fixed w-screen h-screen "
    >
      <div className="flex w-full fixed justify-center  bottom-14 ">
        <div className=" bg-opacity-40  bg-input-bg  mr-5 rounded-lg h-20 w-20 ">
          <img className="w-20 rounded-lg  h-20 " src={Q27} />
        </div>
        <div className=" w-7/12 h-fit p-3 pb-5 text-white  rounded-lg bg-opacity-60  bg-input-bg  ">
          <p className="  font-bold text-xl  mb-1">Q-27</p>
          <TypingAnimation s={currentText} />
          <div className="w-full flex justify-end ">
            {' '}
            <IoPlayForward onClick={handleNextClick} className="text-2xl mr-4 mt-1" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dialouge;

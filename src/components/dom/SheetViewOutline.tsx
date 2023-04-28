import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';



interface SheetViewOutlineProps {
  content: JSX.Element;
  backfunc: () => void;
  backClick: boolean;
  small: boolean;
  clickOutside: boolean;
  save: boolean;
  saveFunc: () => void;
  activateDarkBG: () => void;
  activateLightBG: () => void;
}

const SheetViewOutline = ({
  content,
  backfunc,
  backClick,
  small,
  clickOutside,
  save,
  saveFunc,
  activateDarkBG,
  activateLightBG,
}: SheetViewOutlineProps) => {
  const [back, setBack] = useState<boolean>(false);
  const refOne = useRef<HTMLDivElement>(null);
  const delay =(ms: number) => new Promise(res => setTimeout(res, ms));

  useEffect(() => {activateDarkBG();}, []);

  useEffect(() => {if (backClick === true) {handleBackClick();}}, [backClick]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  function handleClickOutside(e: MouseEvent) {
    if (!refOne.current?.contains(e.target as Node) && !clickOutside) {
      handleBackClick();
    }
  }

  const handleBackClick = async () => {
    setBack(true);
    activateLightBG();
    await delay(100);
    backfunc();
  };

  function handleSubmit() {
    saveFunc();
    handleBackClick();
  }

  return (
    <motion.div
      animate={{ background: back ? '#ffffff00' : '#00000029' }}
      initial={{ background: '#ffffff00' }}
      className="w-screen items-end md:items-center h-screen flex justify-center fixed top-0 left-0 text-[#ffffff00]"
    >
      <motion.div
        ref={refOne}
        transition={{ type: 'Tween' }}
        animate={{ y: back ? 1110 : 0 }}
        initial={{ y: 1110 }}
        className={
          small
            ? 'h-3/6 w-full md:w-8/12 text-black md:rounded-xl rounded-t-2xl'
            : 'h-5/6 w-full md:w-8/12 text-black bg-white  md:rounded-xl rounded-t-2xl'
        }
      >
        <div className="flex justify-between h-1/6 text-system-blue p-4 px-6">
          <div  onClick={handleBackClick}>Zurück</div>
          {save && (
            <div onClick={handleSubmit} className="font-bold">
              Sichern
            </div>
          )}
        </div>

        <div className="h-5/6 rounded-b-xl w-full md:h-5/6 ">{content}</div>
      </motion.div>
    </motion.div> 
  );
};

export default SheetViewOutline;


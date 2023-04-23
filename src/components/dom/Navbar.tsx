import { IoHome, IoStatsChart } from 'react-icons/io5';

// TODO: fix nav bar (score -> score, home -> home => no toggle!)
const Navbar = ({ togglePage }) => {
  const currentDate = () => {
    const currentWeekDay = new Date().toLocaleDateString(window.navigator.language, {
      weekday: 'long',
    });
    const currentDate = new Date().toLocaleDateString();
    const readableDate = currentWeekDay + ', ' + currentDate;
    return readableDate;
  };

  return (
    <div className="flex justify-between w-full">
      <div>
        <p className=" text-On-Surface-Variant ">{currentDate()}</p>
      </div>
      <div className=" flex text-3xl  text-system-blue">
        <div onClick={() => togglePage()}>
          <IoHome className="mr-3 w-full justify-center" />
          <p className=" text-sm w-full ">Home</p>
        </div>
        <div onClick={() => togglePage()} className=" ml-2">
          <IoStatsChart className="mr-3  text-icon w-full justify-center" />
          <p className=" text-sm w-full text-icon ">Score</p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

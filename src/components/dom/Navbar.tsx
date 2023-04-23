import { IoHome, IoStatsChart } from 'react-icons/io5';

// TODO: fix nav bar (score -> score, home -> home => no toggle!)
const Navbar = ({ togglePage }) => {
  return (
    <div className="flex justify-between w-full">
      <div>
        <p className=" text-On-Surface-Variant ">SAMSTAG, 11. FEBRUAR</p>
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

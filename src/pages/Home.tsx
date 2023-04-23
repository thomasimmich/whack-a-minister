import { BASE_ASSET_URL } from '../base/Constants';
const Card = BASE_ASSET_URL + '/images/card-1.png';
const Home = ({ play }) => {
  return (
    <div className="mt-6">
      <div
        onClick={play}
        className="w-full h-40 rounded-xl p-5 flex items-end"
        style={{ backgroundImage: `url(${Card})` }}
      >
        <p className="text-3xl font-bold text-white ">Play</p>
      </div>
    </div>
  );
};
export default Home;

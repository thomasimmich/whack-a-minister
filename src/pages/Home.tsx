import { BASE_ASSET_URL } from '../base/Constants';
import { HomeProps } from '../base/types';

const Home = ({ playFunction }: HomeProps) => {
  const Card = BASE_ASSET_URL + '/images/menu/card-1.png';

  return (
    <div className="w-full h-full p-8">
      <div className="mt-6">
        <div
          onClick={playFunction}
          className="w-full h-40 rounded-xl p-5 flex items-end"
          style={{ backgroundImage: `url(${Card})` }}
        >
          <p className="text-3xl font-bold text-white ">Play</p>
        </div>
      </div>
    </div>
  );
};

export default Home;

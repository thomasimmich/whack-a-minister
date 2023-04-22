import { Box } from '@react-three/drei';
import './App.css';

//import { Train } from './components/three/Train';
import { FullScreenCanvas } from './components/three/FullScreenCanvas';
import { Score } from './components/three/Score';
import { TrainWithPeople } from './components/three/TrainWithPeople';

function App() {
  return (
    <div>
      <FullScreenCanvas>
        <Box position={[0, 0, 0]} args={[1, 1, 1]}>
          <meshBasicMaterial color="red" />
        </Box>
        <TrainWithPeople></TrainWithPeople>
        <Score></Score>
      </FullScreenCanvas>
    </div>
  );
}

export default App;

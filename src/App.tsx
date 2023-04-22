import { Box } from '@react-three/drei';
import './App.css';

//import { Train } from './components/three/Train';
import { FullScreenCanvas } from './components/three/FullScreenCanvas';
import { TrainWithPeople } from './components/three/TrainWithPeople';

function App() {
  return (
    <div>
      <FullScreenCanvas>
        <Box args={[1, 1, 1]}>
          <meshBasicMaterial color="red" />
        </Box>
        <TrainWithPeople></TrainWithPeople>
      </FullScreenCanvas>
    </div>
  );
}

export default App;

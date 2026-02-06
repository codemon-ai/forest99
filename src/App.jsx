import { Canvas } from '@react-three/fiber';
import World from './components/game/World';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        shadows
        camera={{ position: [10, 10, 10], fov: 60 }}
      >
        <World />
      </Canvas>
    </div>
  );
}

export default App;

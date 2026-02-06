import { Canvas } from '@react-three/fiber';
import World from './components/game/World';
import HUD from './components/ui/HUD';
import SanityEffect from './components/ui/SanityEffect';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        shadows
        camera={{ position: [10, 10, 10], fov: 60 }}
      >
        <World />
      </Canvas>
      <HUD />
      <SanityEffect />
    </div>
  );
}

export default App;

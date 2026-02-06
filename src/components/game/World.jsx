import { COLORS } from '../../data/config';
import Terrain from './Terrain';
import Forest from './Forest';
import Rocks from './Rocks';
import Base from './Base';
import AntNest from './AntNest';
import Player from './Player';

export default function World() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      
      <color attach="background" args={[COLORS.sky_day]} />
      <fog attach="fog" args={[COLORS.sky_day, 30, 100]} />
       
      <Terrain />
      <Forest />
      <Rocks />
      <Base />
      <AntNest />
      <Player />
    </>
  );
}

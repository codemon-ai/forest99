import { COLORS } from '../../data/config';
import Terrain from './Terrain';
import Forest from './Forest';
import Rocks from './Rocks';
import Base from './Base';
import AntNest from './AntNest';
import Player from './Player';
import DayNight from './DayNight';

export default function World() {
  return (
    <>
      <DayNight />
      
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

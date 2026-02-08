import { COLORS } from '../../data/config';
import Terrain from './Terrain';
import InstancedForest from './InstancedForest';
import Rocks from './Rocks';
import Base from './Base';
import AntNest from './AntNest';
import Player from './Player';
import DayNight from './DayNight';
import MonsterSpawner from './MonsterSpawner';
import NightSpawner from './NightSpawner';
import BossSpawner from './BossSpawner';
import DamageNumbers from './DamageNumbers';
import EventEffects from './EventEffects';
import PostProcessing from '../effects/PostProcessing';

export default function World() {
  return (
    <>
      <DayNight />
      <EventEffects />
      
      <color attach="background" args={[COLORS.sky_day]} />
      <fog attach="fog" args={[COLORS.sky_day, 30, 100]} />
       
      <Terrain />
      <InstancedForest />
      <Rocks />
      <Base />
      <AntNest />
      <MonsterSpawner />
      <NightSpawner />
      <BossSpawner />
      <DamageNumbers />
      <Player />
      <PostProcessing />
    </>
  );
}

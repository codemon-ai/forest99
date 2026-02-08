import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import './i18n';
import World from './components/game/World';
import HUD from './components/ui/HUD';
import SanityEffect from './components/ui/SanityEffect';
import Inventory from './components/ui/Inventory';
import EventNotification from './components/ui/EventNotification';
import BossHUD from './components/ui/BossHUD';
import GameOverlay from './components/ui/GameOverlay';
import TutorialOverlay from './components/ui/TutorialOverlay';
import AchievementNotification from './components/ui/AchievementNotification';
import OfflineIndicator from './components/ui/OfflineIndicator';
import MainMenu from './components/ui/MainMenu';
import PauseMenu from './components/ui/PauseMenu';
import VirtualJoystick from './components/ui/VirtualJoystick';
import TouchButtons from './components/ui/TouchButtons';
import { useGameStore, GAME_STATE } from './stores/gameStore';
import { useAchievementStore } from './stores/achievementStore';
import { useDeviceDetect } from './hooks/useDeviceDetect';
import { initSounds } from './systems/SoundManager';
import { initMusic } from './systems/MusicManager';

function App() {
  const gameState = useGameStore((state) => state.gameState);
  const isPlaying = gameState !== GAME_STATE.MENU;
  const { isTouchDevice } = useDeviceDetect();
  
  useEffect(() => {
    initSounds();
    initMusic();
    useAchievementStore.getState().loadProgress();
  }, []);
  
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        shadows
        camera={{ position: [10, 10, 10], fov: 60 }}
      >
        {isPlaying && <World />}
      </Canvas>
      <MainMenu />
      <PauseMenu />
      {isPlaying && (
        <>
          <HUD />
          <SanityEffect />
          <Inventory />
          <EventNotification />
          <BossHUD />
        </>
      )}
      <GameOverlay />
      <TutorialOverlay />
      <AchievementNotification />
      <OfflineIndicator />
      {isTouchDevice && isPlaying && (
        <>
          <VirtualJoystick />
          <TouchButtons />
        </>
      )}
    </div>
  );
}

export default App;

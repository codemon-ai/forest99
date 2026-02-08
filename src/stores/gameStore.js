import { create } from 'zustand';
import { SaveSystem } from '../systems/SaveSystem';
import { useAchievementStore } from './achievementStore';

export const GAME_STATE = {
  MENU: 'menu',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'gameOver',
  VICTORY: 'victory',
  BOSS_FIGHT: 'bossFight',
};

export const useGameStore = create((set, get) => ({
  day: 1,
  timeOfDay: 0,
  isNight: false,
  isPaused: false,
  gameState: GAME_STATE.MENU,
  bossSpawned: false,
  bossDefeated: false,
  
  incrementDay: () => {
    set((state) => {
      const newDay = state.day + 1;
      useAchievementStore.getState().updateStat('daysSurvived', newDay);
      return { day: newDay };
    });
    setTimeout(() => {
      SaveSystem.saveGame();
    }, 100);
  },
  setTimeOfDay: (time) => set({ timeOfDay: time }),
  setIsNight: (isNight) => set({ isNight }),
  setPaused: (isPaused) => set({ isPaused, gameState: isPaused ? GAME_STATE.PAUSED : GAME_STATE.PLAYING }),
  setGameState: (gameState) => set({ gameState }),
  startGame: () => set({ gameState: GAME_STATE.PLAYING }),
  pauseGame: () => set({ isPaused: true, gameState: GAME_STATE.PAUSED }),
  resumeGame: () => set({ isPaused: false, gameState: GAME_STATE.PLAYING }),
  setBossSpawned: (bossSpawned) => set({ bossSpawned, gameState: bossSpawned ? GAME_STATE.BOSS_FIGHT : get().gameState }),
  setBossDefeated: () => set({ bossDefeated: true, gameState: GAME_STATE.VICTORY }),
  setGameOver: () => set({ gameState: GAME_STATE.GAME_OVER }),
  
   reset: () => set({
     day: 1,
     timeOfDay: 0,
     isNight: false,
     isPaused: false,
     gameState: GAME_STATE.MENU,
     bossSpawned: false,
     bossDefeated: false,
   }),
   
   getSaveData: () => {
     const state = get();
     return {
       day: state.day,
       timeOfDay: state.timeOfDay,
       isNight: state.isNight,
       bossDefeated: state.bossDefeated,
     };
   },
   
   loadSaveData: (data) => set({
     day: data.day,
     timeOfDay: data.timeOfDay,
     isNight: data.isNight,
     bossDefeated: data.bossDefeated,
     gameState: GAME_STATE.PLAYING,
   }),
}));

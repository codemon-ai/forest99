import { create } from 'zustand';

export const useGameStore = create((set, get) => ({
  day: 1,
  timeOfDay: 0,
  isNight: false,
  isPaused: false,
  
  incrementDay: () => set((state) => ({ day: state.day + 1 })),
  setTimeOfDay: (time) => set({ timeOfDay: time }),
  setIsNight: (isNight) => set({ isNight }),
  setPaused: (isPaused) => set({ isPaused }),
  
  reset: () => set({
    day: 1,
    timeOfDay: 0,
    isNight: false,
    isPaused: false,
  }),
}));

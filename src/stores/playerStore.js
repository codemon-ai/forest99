import { create } from 'zustand';

export const usePlayerStore = create((set) => ({
  position: [0, 0, 5],
  rotation: 0,
  
  isMoving: false,
  isRunning: false,
  isJumping: false,
  velocity: [0, 0, 0],
  
  health: 100,
  hunger: 100,
  sanity: 100,
  
  setPosition: (position) => set({ position }),
  setRotation: (rotation) => set({ rotation }),
  setIsMoving: (isMoving) => set({ isMoving }),
  setIsRunning: (isRunning) => set({ isRunning }),
  setIsJumping: (isJumping) => set({ isJumping }),
  setVelocity: (velocity) => set({ velocity }),
  
  damage: (amount) => set((state) => ({ 
    health: Math.max(0, state.health - amount) 
  })),
  heal: (amount) => set((state) => ({ 
    health: Math.min(100, state.health + amount) 
  })),
  eat: (amount) => set((state) => ({ 
    hunger: Math.min(100, state.hunger + amount) 
  })),
  decreaseHunger: (amount) => set((state) => ({ 
    hunger: Math.max(0, state.hunger - amount) 
  })),
  decreaseSanity: (amount) => set((state) => ({ 
    sanity: Math.max(0, state.sanity - amount) 
  })),
  restoreSanity: (amount) => set((state) => ({ 
    sanity: Math.min(100, state.sanity + amount) 
  })),
}));

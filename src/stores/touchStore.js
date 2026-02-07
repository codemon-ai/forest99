import { create } from 'zustand';

export const useTouchStore = create((set) => ({
  joystickInput: { x: 0, y: 0 },
  touchButtons: {
    attack: false,
    interact: false,
    jump: false,
  },

  setJoystickInput: (x, y) => set({ joystickInput: { x, y } }),
  
  resetJoystick: () => set({ joystickInput: { x: 0, y: 0 } }),

  pressAttack: () => {
    set((state) => ({ touchButtons: { ...state.touchButtons, attack: true } }));
    setTimeout(() => {
      set((state) => ({ touchButtons: { ...state.touchButtons, attack: false } }));
    }, 100);
  },

  pressInteract: () => {
    set((state) => ({ touchButtons: { ...state.touchButtons, interact: true } }));
    setTimeout(() => {
      set((state) => ({ touchButtons: { ...state.touchButtons, interact: false } }));
    }, 100);
  },

  pressJump: () => {
    set((state) => ({ touchButtons: { ...state.touchButtons, jump: true } }));
    setTimeout(() => {
      set((state) => ({ touchButtons: { ...state.touchButtons, jump: false } }));
    }, 100);
  },
}));

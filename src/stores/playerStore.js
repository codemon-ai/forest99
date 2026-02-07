import { create } from 'zustand';
import { playSound } from '../systems/SoundManager';

export const WEAPONS = {
  FIST: { name: '주먹', damage: 5, range: 1.5, cooldown: 0.5 },
  BRANCH: { name: '나뭇가지', damage: 10, range: 2, cooldown: 0.4 },
  STONE_AXE: { name: '돌도끼', damage: 20, range: 2.5, cooldown: 0.6 },
  SPEAR: { name: '창', damage: 25, range: 3, cooldown: 0.7 },
  TORCH: { name: '횃불', damage: 15, range: 2, cooldown: 0.5, fireDamage: 5 },
};

const COMBO_WINDOW_MS = 1000;
const COMBO_DECAY_MS = 1500;
const COMBO_DAMAGE_BONUS = 0.2;
const MAX_COMBO = 5;
const ATTACK_ANIMATION_MS = 200;

export const usePlayerStore = create((set, get) => ({
  position: [0, 0, 5],
  rotation: 0,
  
  isMoving: false,
  isRunning: false,
  isJumping: false,
  velocity: [0, 0, 0],
  
  health: 100,
  hunger: 100,
  sanity: 100,
  
  isAttacking: false,
  attackCooldown: 0,
  currentWeapon: 'FIST',
  comboCount: 0,
  lastAttackTime: 0,
  
  setPosition: (position) => set({ position }),
  setRotation: (rotation) => set({ rotation }),
  setIsMoving: (isMoving) => set({ isMoving }),
  setIsRunning: (isRunning) => set({ isRunning }),
  setIsJumping: (isJumping) => set({ isJumping }),
  setVelocity: (velocity) => set({ velocity }),
  
  attack: () => {
    const state = get();
    const now = Date.now();
    const weapon = WEAPONS[state.currentWeapon];
    
    if (state.attackCooldown > 0) return false;
    
    const timeSinceLastAttack = now - state.lastAttackTime;
    const isComboHit = timeSinceLastAttack < COMBO_WINDOW_MS;
    const newCombo = isComboHit ? Math.min(state.comboCount + 1, MAX_COMBO) : 1;
    
    set({ 
      isAttacking: true, 
      attackCooldown: weapon.cooldown,
      comboCount: newCombo,
      lastAttackTime: now,
    });
    
    playSound('attack_swing');
    setTimeout(() => set({ isAttacking: false }), ATTACK_ANIMATION_MS);
    
    return true;
  },
  
  updateCooldown: (delta) => set((state) => ({
    attackCooldown: Math.max(0, state.attackCooldown - delta),
    comboCount: Date.now() - state.lastAttackTime > COMBO_DECAY_MS ? 0 : state.comboCount,
  })),
  
  setWeapon: (weaponKey) => set({ currentWeapon: weaponKey }),
  
  getAttackDamage: () => {
    const state = get();
    const weapon = WEAPONS[state.currentWeapon];
    const comboMultiplier = 1 + (state.comboCount - 1) * COMBO_DAMAGE_BONUS;
    return Math.floor(weapon.damage * comboMultiplier);
  },
  
  getAttackRange: () => {
    const state = get();
    return WEAPONS[state.currentWeapon].range;
  },
  
  damage: (amount) => {
    playSound('player_hurt');
    set((state) => ({ health: Math.max(0, state.health - amount) }));
  },
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
   
   reset: () => set({
     position: [0, 0, 5],
     rotation: 0,
     isMoving: false,
     isRunning: false,
     isJumping: false,
     velocity: [0, 0, 0],
     health: 100,
     hunger: 100,
     sanity: 100,
     isAttacking: false,
     attackCooldown: 0,
     currentWeapon: 'FIST',
     comboCount: 0,
     lastAttackTime: 0,
   }),
   
   getSaveData: () => {
     const state = get();
     return {
       position: state.position,
       health: state.health,
       hunger: state.hunger,
       sanity: state.sanity,
       currentWeapon: state.currentWeapon,
     };
   },
   
   loadSaveData: (data) => set({
     position: data.position,
     health: data.health,
     hunger: data.hunger,
     sanity: data.sanity,
     currentWeapon: data.currentWeapon,
   }),
}));

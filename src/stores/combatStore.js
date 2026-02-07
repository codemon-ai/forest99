import { create } from 'zustand';
import { MONSTER_STATS } from '../data/monsters';
import { playSound } from '../systems/SoundManager';

export const useCombatStore = create((set, get) => ({
  monsters: {},
  damageNumbers: [],
  
  registerMonster: (id, type, position) => set((state) => ({
    monsters: {
      ...state.monsters,
      [id]: {
        id,
        type,
        position,
        hp: MONSTER_STATS[type]?.hp || 50,
        maxHp: MONSTER_STATS[type]?.hp || 50,
        isHit: false,
        isDead: false,
      }
    }
  })),
  
  unregisterMonster: (id) => set((state) => {
    const { [id]: removed, ...rest } = state.monsters;
    return { monsters: rest };
  }),
  
  updateMonsterPosition: (id, position) => set((state) => ({
    monsters: {
      ...state.monsters,
      [id]: state.monsters[id] ? { ...state.monsters[id], position } : state.monsters[id]
    }
  })),
  
  damageMonster: (id, damage, attackerPosition) => {
    const state = get();
    const monster = state.monsters[id];
    if (!monster || monster.isDead) return false;
    
    const newHp = Math.max(0, monster.hp - damage);
    const isDead = newHp <= 0;
    
    const damageNumber = {
      id: `${id}-${Date.now()}`,
      value: damage,
      position: [...monster.position],
      createdAt: Date.now(),
    };
    
    set((state) => ({
      monsters: {
        ...state.monsters,
        [id]: { ...state.monsters[id], hp: newHp, isHit: true, isDead }
      },
      damageNumbers: [...state.damageNumbers, damageNumber]
    }));
    
    playSound('attack_hit');
    if (isDead) {
      playSound('monster_death');
    }
    
    setTimeout(() => {
      set((state) => ({
        monsters: {
          ...state.monsters,
          [id]: state.monsters[id] ? { ...state.monsters[id], isHit: false } : state.monsters[id]
        }
      }));
    }, 200);
    
    return isDead;
  },
  
  clearDamageNumber: (numberId) => set((state) => ({
    damageNumbers: state.damageNumbers.filter(d => d.id !== numberId)
  })),
  
  getMonstersInRange: (position, range) => {
    const state = get();
    return Object.values(state.monsters).filter(monster => {
      if (monster.isDead) return false;
      const dx = monster.position[0] - position[0];
      const dz = monster.position[2] - position[2];
      const distance = Math.sqrt(dx * dx + dz * dz);
      return distance <= range;
    });
  },
  
  getClosestMonsterInRange: (position, range, facingAngle) => {
    const state = get();
    let closest = null;
    let closestDist = Infinity;
    
    Object.values(state.monsters).forEach(monster => {
      if (monster.isDead) return;
      
      const dx = monster.position[0] - position[0];
      const dz = monster.position[2] - position[2];
      const distance = Math.sqrt(dx * dx + dz * dz);
      
      if (distance > range) return;
      
      const angleToMonster = Math.atan2(dx, dz);
      const angleDiff = Math.abs(Math.atan2(Math.sin(angleToMonster - facingAngle), Math.cos(angleToMonster - facingAngle)));
      
      if (angleDiff < Math.PI / 2 && distance < closestDist) {
        closest = monster;
        closestDist = distance;
      }
    });
    
    return closest;
  },
}));

import { create } from 'zustand';
import { playSound } from '../systems/SoundManager';
import { useTutorialStore } from './tutorialStore';
import { useAchievementStore } from './achievementStore';

export const useResourceStore = create((set, get) => ({
  resources: {},
  nearbyResource: null,
  
  registerResource: (id, type, position) => set((state) => ({
    resources: {
      ...state.resources,
      [id]: { id, type, position, harvestable: true, lastHarvest: 0 }
    }
  })),
  
  unregisterResource: (id) => set((state) => {
    const { [id]: removed, ...rest } = state.resources;
    return { resources: rest };
  }),
  
  setNearbyResource: (resource) => set({ nearbyResource: resource }),
  
  harvestResource: (id) => {
    const state = get();
    const resource = state.resources[id];
    if (!resource || !resource.harvestable) return null;
    
    const now = Date.now();
    const cooldown = 5000;
    
    if (now - resource.lastHarvest < cooldown) return null;
    
    set((state) => ({
      resources: {
        ...state.resources,
        [id]: { ...state.resources[id], lastHarvest: now, harvestable: false }
      }
    }));
    
      playSound(resource.type === 'tree' ? 'chop_wood' : 'mine_rock');
      useTutorialStore.getState().completeCondition('resourceHarvested');
      useAchievementStore.getState().incrementStat('resourcesGathered');
     
     setTimeout(() => {
      set((state) => ({
        resources: {
          ...state.resources,
          [id]: state.resources[id] ? { ...state.resources[id], harvestable: true } : state.resources[id]
        }
      }));
    }, cooldown);
    
    return resource.type;
  },
  
  findNearestResource: (playerPos, maxDistance = 3) => {
    const state = get();
    let nearest = null;
    let nearestDist = Infinity;
    
    Object.values(state.resources).forEach(resource => {
      if (!resource.harvestable) return;
      
      const dx = resource.position[0] - playerPos[0];
      const dz = resource.position[2] - playerPos[2];
      const dist = Math.sqrt(dx * dx + dz * dz);
      
      if (dist < maxDistance && dist < nearestDist) {
        nearest = resource;
        nearestDist = dist;
      }
    });
    
    return nearest;
  },
}));

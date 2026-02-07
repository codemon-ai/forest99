import { create } from 'zustand';
import { EVENTS, rollForEvent } from '../data/events';

export const useEventStore = create((set, get) => ({
  currentEvent: null,
  eventTimeRemaining: 0,
  eventHistory: [],
  notification: null,
  
  startEvent: (eventType) => {
    const event = EVENTS[eventType];
    if (!event) return;
    
    set({
      currentEvent: event,
      eventTimeRemaining: event.duration,
      notification: {
        type: 'start',
        event: event,
        timestamp: Date.now(),
      },
    });
    
    setTimeout(() => {
      set({ notification: null });
    }, 4000);
  },
  
  updateEvent: (delta) => {
    const state = get();
    if (!state.currentEvent) return;
    
    const newTime = state.eventTimeRemaining - delta;
    
    if (newTime <= 0) {
      set((state) => ({
        eventHistory: [...state.eventHistory, {
          event: state.currentEvent,
          endTime: Date.now(),
        }],
        currentEvent: null,
        eventTimeRemaining: 0,
        notification: {
          type: 'end',
          event: state.currentEvent,
          timestamp: Date.now(),
        },
      }));
      
      setTimeout(() => {
        set({ notification: null });
      }, 3000);
    } else {
      set({ eventTimeRemaining: newTime });
    }
  },
  
  tryTriggerEvent: (day, isNight) => {
    const state = get();
    if (state.currentEvent) return false;
    
    const event = rollForEvent(day, isNight);
    if (event) {
      get().startEvent(event.id);
      return true;
    }
    return false;
  },
  
  getEffects: () => {
    const state = get();
    if (!state.currentEvent) {
      return {
        moveSpeedMultiplier: 1,
        visibilityRange: 100,
        sanityDrain: 0,
        monsterSpawnMultiplier: 1,
        monsterAggroRange: 1,
        monsterDamageMultiplier: 1,
        monsterSpeedMultiplier: 1,
        resourceMultiplier: 1,
        harvestCooldownMultiplier: 1,
        monsterDetectionRange: 1,
        cameraShake: 0,
        bonusResources: false,
      };
    }
    
    return {
      moveSpeedMultiplier: state.currentEvent.effects.moveSpeedMultiplier ?? 1,
      visibilityRange: state.currentEvent.effects.visibilityRange ?? 100,
      sanityDrain: state.currentEvent.effects.sanityDrain ?? 0,
      monsterSpawnMultiplier: state.currentEvent.effects.monsterSpawnMultiplier ?? 1,
      monsterAggroRange: state.currentEvent.effects.monsterAggroRange ?? 1,
      monsterDamageMultiplier: state.currentEvent.effects.monsterDamageMultiplier ?? 1,
      monsterSpeedMultiplier: state.currentEvent.effects.monsterSpeedMultiplier ?? 1,
      resourceMultiplier: state.currentEvent.effects.resourceMultiplier ?? 1,
      harvestCooldownMultiplier: state.currentEvent.effects.harvestCooldownMultiplier ?? 1,
      monsterDetectionRange: state.currentEvent.effects.monsterDetectionRange ?? 1,
      cameraShake: state.currentEvent.effects.cameraShake ?? 0,
      bonusResources: state.currentEvent.effects.bonusResources ?? false,
    };
  },
  
   clearNotification: () => set({ notification: null }),
   
   reset: () => set({
     currentEvent: null,
     eventTimeRemaining: 0,
     eventHistory: [],
     notification: null,
   }),
}));

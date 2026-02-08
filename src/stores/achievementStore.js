import { create } from 'zustand';
import { ACHIEVEMENTS } from '../data/achievements';

export const useAchievementStore = create((set, get) => ({
  unlocked: [],
  stats: {
    daysSurvived: 0,
    monstersKilled: 0,
    nightKills: 0,
    itemsCrafted: 0,
    resourcesGathered: 0,
    maxCombo: 0,
    bossDefeated: false,
    survivedLowHealth: false,
  },
  pendingNotifications: [],
  
  updateStat: (key, value) => {
    set((state) => ({
      stats: { ...state.stats, [key]: value },
    }));
    get().checkAchievements();
  },
  
  incrementStat: (key, amount = 1) => {
    set((state) => ({
      stats: { ...state.stats, [key]: state.stats[key] + amount },
    }));
    get().checkAchievements();
  },
  
  checkAchievements: () => {
    const { stats, unlocked } = get();
    
    Object.values(ACHIEVEMENTS).forEach((achievement) => {
      if (!unlocked.includes(achievement.id) && achievement.condition(stats)) {
        get().unlockAchievement(achievement);
      }
    });
  },
  
  unlockAchievement: (achievement) => {
    set((state) => ({
      unlocked: [...state.unlocked, achievement.id],
      pendingNotifications: [...state.pendingNotifications, achievement],
    }));
    get().saveProgress();
  },
  
  dismissNotification: () => {
    set((state) => ({
      pendingNotifications: state.pendingNotifications.slice(1),
    }));
  },
  
  saveProgress: () => {
    const { unlocked, stats } = get();
    localStorage.setItem('forest99_achievements', JSON.stringify({ unlocked, stats }));
  },
  
  loadProgress: () => {
    const saved = localStorage.getItem('forest99_achievements');
    if (saved) {
      const { unlocked, stats } = JSON.parse(saved);
      set({ unlocked, stats });
    }
  },
  
  getUnlockedCount: () => get().unlocked.length,
  getTotalCount: () => Object.keys(ACHIEVEMENTS).length,
}));

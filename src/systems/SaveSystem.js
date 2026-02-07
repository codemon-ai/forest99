import { useGameStore } from '../stores/gameStore';
import { usePlayerStore } from '../stores/playerStore';
import { useInventoryStore } from '../stores/inventoryStore';

const SAVE_KEY = 'forest99_save';

export const SaveSystem = {
  /**
   * Check if save data exists in localStorage
   * @returns {boolean} True if save data exists
   */
  hasSaveData() {
    return localStorage.getItem(SAVE_KEY) !== null;
  },

  /**
   * Save current game state to localStorage
   * @returns {boolean} True if save successful
   */
  saveGame() {
    try {
      const saveData = {
        version: 1,
        savedAt: Date.now(),
        player: usePlayerStore.getState().getSaveData(),
        game: useGameStore.getState().getSaveData(),
        inventory: useInventoryStore.getState().getSaveData(),
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
      return true;
    } catch (error) {
      console.error('Save failed:', error);
      return false;
    }
  },

  /**
   * Load game state from localStorage
   * @returns {boolean} True if load successful
   */
  loadGame() {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (!saved) return false;

      const saveData = JSON.parse(saved);
      usePlayerStore.getState().loadSaveData(saveData.player);
      useGameStore.getState().loadSaveData(saveData.game);
      useInventoryStore.getState().loadSaveData(saveData.inventory);
      return true;
    } catch (error) {
      console.error('Load failed:', error);
      return false;
    }
  },

  /**
   * Delete save data from localStorage
   */
  deleteSave() {
    localStorage.removeItem(SAVE_KEY);
  },
};

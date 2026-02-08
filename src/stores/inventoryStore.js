import { create } from 'zustand';
import { ITEMS, RECIPES, MONSTER_DROPS, RESOURCE_DROPS } from '../data/items';
import { playSound } from '../systems/SoundManager';
import { useTutorialStore } from './tutorialStore';
import { useAchievementStore } from './achievementStore';

const INVENTORY_SIZE = 20;

export const useInventoryStore = create((set, get) => ({
  slots: Array(INVENTORY_SIZE).fill(null),
  isOpen: false,
  isCraftingOpen: false,
  selectedSlot: null,
  
  toggleInventory: () => {
    const wasOpen = get().isOpen;
    playSound(wasOpen ? 'ui_close' : 'ui_open');
    set((state) => ({ 
      isOpen: !state.isOpen,
      isCraftingOpen: state.isOpen ? false : state.isCraftingOpen,
    }));
    
    if (!wasOpen) {
      useTutorialStore.getState().completeCondition('inventoryOpened');
    }
  },
  
  toggleCrafting: () => {
    const wasOpen = get().isCraftingOpen;
    playSound(wasOpen ? 'ui_close' : 'ui_open');
    set((state) => ({ 
      isCraftingOpen: !state.isCraftingOpen,
      isOpen: state.isCraftingOpen ? false : state.isOpen,
    }));
    
    if (!wasOpen) {
      useTutorialStore.getState().completeCondition('craftingOpened');
    }
  },
  
  closeAll: () => set({ isOpen: false, isCraftingOpen: false, selectedSlot: null }),
  
  selectSlot: (index) => set({ selectedSlot: index }),
  
  addItem: (itemId, amount = 1) => {
    const item = ITEMS[itemId];
    if (!item) return false;
    
    const state = get();
    const newSlots = [...state.slots];
    let remaining = amount;
    
    if (item.stackable) {
      for (let i = 0; i < newSlots.length && remaining > 0; i++) {
        const slot = newSlots[i];
        if (slot && slot.itemId === itemId && slot.amount < item.maxStack) {
          const canAdd = Math.min(remaining, item.maxStack - slot.amount);
          newSlots[i] = { ...slot, amount: slot.amount + canAdd };
          remaining -= canAdd;
        }
      }
    }
    
    for (let i = 0; i < newSlots.length && remaining > 0; i++) {
      if (!newSlots[i]) {
        const addAmount = item.stackable ? Math.min(remaining, item.maxStack) : 1;
        newSlots[i] = { itemId, amount: addAmount };
        remaining -= addAmount;
      }
    }
    
    if (remaining < amount) {
      set({ slots: newSlots });
      playSound('item_pickup');
      return true;
    }
    return false;
  },
  
  removeItem: (itemId, amount = 1) => {
    const state = get();
    const newSlots = [...state.slots];
    let remaining = amount;
    
    for (let i = newSlots.length - 1; i >= 0 && remaining > 0; i--) {
      const slot = newSlots[i];
      if (slot && slot.itemId === itemId) {
        const removeAmount = Math.min(remaining, slot.amount);
        if (slot.amount <= removeAmount) {
          newSlots[i] = null;
        } else {
          newSlots[i] = { ...slot, amount: slot.amount - removeAmount };
        }
        remaining -= removeAmount;
      }
    }
    
    set({ slots: newSlots });
    return remaining === 0;
  },
  
  getItemCount: (itemId) => {
    const state = get();
    return state.slots.reduce((total, slot) => {
      if (slot && slot.itemId === itemId) {
        return total + slot.amount;
      }
      return total;
    }, 0);
  },
  
  hasItems: (itemId, amount) => {
    return get().getItemCount(itemId) >= amount;
  },
  
  canCraft: (recipeId) => {
    const recipe = RECIPES[recipeId];
    if (!recipe) return false;
    
    const state = get();
    return recipe.ingredients.every(({ itemId, amount }) => 
      state.getItemCount(itemId) >= amount
    );
  },
  
   craft: (recipeId) => {
     const recipe = RECIPES[recipeId];
     if (!recipe || !get().canCraft(recipeId)) return false;
     
     recipe.ingredients.forEach(({ itemId, amount }) => {
       get().removeItem(itemId, amount);
     });
     
     get().addItem(recipe.result, 1);
     playSound('craft_complete');
     useAchievementStore.getState().incrementStat('itemsCrafted');
     return true;
   },
  
  useItem: (slotIndex) => {
    const state = get();
    const slot = state.slots[slotIndex];
    if (!slot) return null;
    
    const item = ITEMS[slot.itemId];
    if (!item) return null;
    
    if (item.type === 'consumable' && item.effect) {
      get().removeItem(slot.itemId, 1);
      return item.effect;
    }
    
    if (item.type === 'weapon' && item.weaponKey) {
      playSound('equip');
      return { equipWeapon: item.weaponKey };
    }
    
    return null;
  },
  
  generateMonsterDrops: (monsterType) => {
    const drops = MONSTER_DROPS[monsterType];
    if (!drops) return [];
    
    const results = [];
    drops.forEach(({ itemId, chance, min, max }) => {
      if (Math.random() < chance) {
        const amount = Math.floor(Math.random() * (max - min + 1)) + min;
        results.push({ itemId, amount });
        get().addItem(itemId, amount);
      }
    });
    return results;
  },
  
   generateResourceDrops: (resourceType) => {
     const drops = RESOURCE_DROPS[resourceType];
     if (!drops) return [];
     
     const results = [];
     drops.forEach(({ itemId, min, max }) => {
       const amount = Math.floor(Math.random() * (max - min + 1)) + min;
       results.push({ itemId, amount });
       get().addItem(itemId, amount);
     });
     return results;
   },
   
   reset: () => set({
     slots: Array(INVENTORY_SIZE).fill(null),
     isOpen: false,
     isCraftingOpen: false,
     selectedSlot: null,
   }),
   
   getSaveData: () => {
     const state = get();
     return {
       slots: state.slots,
     };
   },
   
   loadSaveData: (data) => set({
     slots: data.slots || Array(INVENTORY_SIZE).fill(null),
   }),
}));

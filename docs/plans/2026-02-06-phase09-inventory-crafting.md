# Phase 9: 인벤토리 & 제작 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 24칸 인벤토리, 자원 수집, 제작 시스템

**Architecture:** Zustand 인벤토리 스토어 + HTML UI 오버레이

**Tech Stack:** React, Zustand, CSS

---

## Task 1: 아이템 데이터 정의

**Files:**
- Create: `src/data/items.js`

**Step 1: items.js 생성**

```javascript
export const ITEM_TYPES = {
  WOOD: 'wood',
  STONE: 'stone',
  HERB: 'herb',
  CLOTH: 'cloth',
  FOOD_BERRY: 'foodBerry',
  FOOD_MEAT: 'foodMeat',
  TORCH: 'torch',
  TRAP: 'trap',
  BARRICADE: 'barricade',
  BED: 'bed',
  ARROW: 'arrow',
  POISON_ARROW: 'poisonArrow',
  KEY: 'key',
};

export const ITEMS = {
  [ITEM_TYPES.WOOD]: {
    name: 'Wood',
    maxStack: 50,
    color: '#8b4513',
  },
  [ITEM_TYPES.STONE]: {
    name: 'Stone',
    maxStack: 50,
    color: '#757575',
  },
  [ITEM_TYPES.HERB]: {
    name: 'Herb',
    maxStack: 20,
    color: '#4caf50',
  },
  [ITEM_TYPES.CLOTH]: {
    name: 'Cloth',
    maxStack: 20,
    color: '#e0e0e0',
  },
  [ITEM_TYPES.FOOD_BERRY]: {
    name: 'Berry',
    maxStack: 10,
    color: '#e91e63',
    hungerRestore: 15,
  },
  [ITEM_TYPES.FOOD_MEAT]: {
    name: 'Meat',
    maxStack: 5,
    color: '#bf360c',
    hungerRestore: 30,
  },
  [ITEM_TYPES.TORCH]: {
    name: 'Torch',
    maxStack: 5,
    color: '#ff9800',
  },
  [ITEM_TYPES.TRAP]: {
    name: 'Trap',
    maxStack: 10,
    color: '#795548',
  },
  [ITEM_TYPES.BARRICADE]: {
    name: 'Barricade',
    maxStack: 5,
    color: '#5d4037',
  },
  [ITEM_TYPES.KEY]: {
    name: 'Ant Nest Key',
    maxStack: 10,
    color: '#ffd700',
  },
};
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add item data definitions"
```

---

## Task 2: 레시피 데이터 정의

**Files:**
- Create: `src/data/recipes.js`

**Step 1: recipes.js 생성**

```javascript
import { ITEM_TYPES } from './items';

export const RECIPES = [
  {
    id: 'torch',
    name: 'Torch',
    result: ITEM_TYPES.TORCH,
    resultAmount: 1,
    ingredients: [
      { item: ITEM_TYPES.WOOD, amount: 2 },
      { item: ITEM_TYPES.CLOTH, amount: 1 },
    ],
  },
  {
    id: 'trap',
    name: 'Trap',
    result: ITEM_TYPES.TRAP,
    resultAmount: 1,
    ingredients: [
      { item: ITEM_TYPES.WOOD, amount: 3 },
      { item: ITEM_TYPES.STONE, amount: 2 },
    ],
  },
  {
    id: 'barricade',
    name: 'Barricade',
    result: ITEM_TYPES.BARRICADE,
    resultAmount: 1,
    ingredients: [
      { item: ITEM_TYPES.WOOD, amount: 5 },
    ],
  },
  {
    id: 'poisonArrow',
    name: 'Poison Arrow',
    result: ITEM_TYPES.POISON_ARROW,
    resultAmount: 3,
    ingredients: [
      { item: ITEM_TYPES.ARROW, amount: 3 },
      { item: ITEM_TYPES.HERB, amount: 1 },
    ],
  },
];
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add crafting recipes"
```

---

## Task 3: 인벤토리 스토어

**Files:**
- Create: `src/stores/inventoryStore.js`

**Step 1: inventoryStore.js 생성**

```javascript
import { create } from 'zustand';
import { ITEMS } from '../data/items';

const INVENTORY_SIZE = 24;

export const useInventoryStore = create((set, get) => ({
  slots: Array(INVENTORY_SIZE).fill(null),
  isOpen: false,
  
  toggleInventory: () => set((state) => ({ isOpen: !state.isOpen })),
  closeInventory: () => set({ isOpen: false }),
  
  addItem: (itemType, amount = 1) => {
    const { slots } = get();
    const itemData = ITEMS[itemType];
    let remaining = amount;
    
    const newSlots = [...slots];
    
    for (let i = 0; i < newSlots.length && remaining > 0; i++) {
      if (newSlots[i]?.type === itemType) {
        const canAdd = itemData.maxStack - newSlots[i].amount;
        const toAdd = Math.min(canAdd, remaining);
        newSlots[i] = { ...newSlots[i], amount: newSlots[i].amount + toAdd };
        remaining -= toAdd;
      }
    }
    
    for (let i = 0; i < newSlots.length && remaining > 0; i++) {
      if (newSlots[i] === null) {
        const toAdd = Math.min(itemData.maxStack, remaining);
        newSlots[i] = { type: itemType, amount: toAdd };
        remaining -= toAdd;
      }
    }
    
    set({ slots: newSlots });
    return remaining === 0;
  },
  
  removeItem: (itemType, amount = 1) => {
    const { slots } = get();
    let remaining = amount;
    
    const newSlots = [...slots];
    
    for (let i = newSlots.length - 1; i >= 0 && remaining > 0; i--) {
      if (newSlots[i]?.type === itemType) {
        const toRemove = Math.min(newSlots[i].amount, remaining);
        newSlots[i].amount -= toRemove;
        remaining -= toRemove;
        
        if (newSlots[i].amount <= 0) {
          newSlots[i] = null;
        }
      }
    }
    
    set({ slots: newSlots });
    return remaining === 0;
  },
  
  getItemCount: (itemType) => {
    const { slots } = get();
    return slots.reduce((sum, slot) => {
      if (slot?.type === itemType) return sum + slot.amount;
      return sum;
    }, 0);
  },
  
  hasItems: (itemType, amount) => {
    return get().getItemCount(itemType) >= amount;
  },
}));
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add inventory store"
```

---

## Task 4: 인벤토리 UI

**Files:**
- Create: `src/components/ui/Inventory.jsx`
- Create: `src/components/ui/Inventory.css`

**Step 1: Inventory.jsx 생성**

```jsx
import { useEffect } from 'react';
import { useInventoryStore } from '../../stores/inventoryStore';
import { ITEMS } from '../../data/items';
import './Inventory.css';

function InventorySlot({ slot, index }) {
  if (!slot) {
    return <div className="inventory-slot empty" />;
  }
  
  const item = ITEMS[slot.type];
  
  return (
    <div 
      className="inventory-slot filled"
      style={{ backgroundColor: item.color + '40' }}
    >
      <div 
        className="item-icon" 
        style={{ backgroundColor: item.color }}
      />
      <span className="item-amount">{slot.amount}</span>
      <span className="item-name">{item.name}</span>
    </div>
  );
}

export default function Inventory() {
  const isOpen = useInventoryStore((state) => state.isOpen);
  const slots = useInventoryStore((state) => state.slots);
  const toggleInventory = useInventoryStore((state) => state.toggleInventory);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Tab') {
        e.preventDefault();
        toggleInventory();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleInventory]);
  
  if (!isOpen) return null;
  
  return (
    <div className="inventory-overlay">
      <div className="inventory-container">
        <h2>Inventory</h2>
        <div className="inventory-grid">
          {slots.map((slot, index) => (
            <InventorySlot key={index} slot={slot} index={index} />
          ))}
        </div>
        <p className="inventory-hint">Press Tab to close</p>
      </div>
    </div>
  );
}
```

**Step 2: Inventory.css 생성**

```css
.inventory-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
}

.inventory-container {
  background: #2a2a2a;
  border-radius: 8px;
  padding: 20px;
  color: white;
}

.inventory-container h2 {
  margin: 0 0 15px 0;
  text-align: center;
}

.inventory-grid {
  display: grid;
  grid-template-columns: repeat(6, 60px);
  grid-template-rows: repeat(4, 60px);
  gap: 5px;
}

.inventory-slot {
  width: 60px;
  height: 60px;
  border: 2px solid #444;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.inventory-slot.empty {
  background: #333;
}

.inventory-slot.filled {
  cursor: pointer;
}

.item-icon {
  width: 30px;
  height: 30px;
  border-radius: 4px;
}

.item-amount {
  position: absolute;
  bottom: 2px;
  right: 4px;
  font-size: 12px;
  font-weight: bold;
}

.item-name {
  font-size: 8px;
  position: absolute;
  bottom: 2px;
  left: 2px;
}

.inventory-hint {
  text-align: center;
  color: #888;
  margin-top: 10px;
  font-size: 12px;
}
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add inventory UI component"
```

---

## Task 5: 제작 시스템

**Files:**
- Create: `src/systems/CraftingSystem.js`

**Step 1: CraftingSystem.js 생성**

```javascript
import { useInventoryStore } from '../stores/inventoryStore';
import { RECIPES } from '../data/recipes';

export function canCraft(recipeId) {
  const recipe = RECIPES.find((r) => r.id === recipeId);
  if (!recipe) return false;
  
  const { hasItems } = useInventoryStore.getState();
  
  return recipe.ingredients.every(({ item, amount }) => 
    hasItems(item, amount)
  );
}

export function craft(recipeId) {
  const recipe = RECIPES.find((r) => r.id === recipeId);
  if (!recipe) return false;
  
  if (!canCraft(recipeId)) return false;
  
  const { removeItem, addItem } = useInventoryStore.getState();
  
  for (const { item, amount } of recipe.ingredients) {
    removeItem(item, amount);
  }
  
  addItem(recipe.result, recipe.resultAmount);
  
  return true;
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add crafting system"
```

---

## Task 6: 제작 메뉴 UI

**Files:**
- Create: `src/components/ui/CraftingMenu.jsx`
- Create: `src/components/ui/CraftingMenu.css`

**Step 1: CraftingMenu.jsx 생성**

```jsx
import { useState, useEffect } from 'react';
import { RECIPES } from '../../data/recipes';
import { ITEMS } from '../../data/items';
import { useInventoryStore } from '../../stores/inventoryStore';
import { canCraft, craft } from '../../systems/CraftingSystem';
import './CraftingMenu.css';

export default function CraftingMenu({ isOpen, onClose }) {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const getItemCount = useInventoryStore((state) => state.getItemCount);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  const handleCraft = (recipeId) => {
    if (craft(recipeId)) {
      setSelectedRecipe(null);
    }
  };
  
  return (
    <div className="crafting-overlay">
      <div className="crafting-container">
        <h2>Crafting</h2>
        <div className="recipe-list">
          {RECIPES.map((recipe) => {
            const craftable = canCraft(recipe.id);
            
            return (
              <div 
                key={recipe.id}
                className={`recipe-item ${craftable ? 'craftable' : 'not-craftable'}`}
                onClick={() => craftable && handleCraft(recipe.id)}
              >
                <div className="recipe-name">{recipe.name}</div>
                <div className="recipe-ingredients">
                  {recipe.ingredients.map(({ item, amount }) => (
                    <span key={item} className="ingredient">
                      {ITEMS[item].name}: {getItemCount(item)}/{amount}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <p className="crafting-hint">Press C or Escape to close</p>
      </div>
    </div>
  );
}
```

**Step 2: CraftingMenu.css 생성**

```css
.crafting-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
}

.crafting-container {
  background: #2a2a2a;
  border-radius: 8px;
  padding: 20px;
  color: white;
  min-width: 300px;
}

.crafting-container h2 {
  margin: 0 0 15px 0;
  text-align: center;
}

.recipe-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.recipe-item {
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
}

.recipe-item.craftable {
  background: #4caf50;
}

.recipe-item.not-craftable {
  background: #666;
  opacity: 0.7;
  cursor: not-allowed;
}

.recipe-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.recipe-ingredients {
  font-size: 12px;
}

.ingredient {
  display: inline-block;
  margin-right: 10px;
}

.crafting-hint {
  text-align: center;
  color: #888;
  margin-top: 15px;
  font-size: 12px;
}
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add crafting menu UI"
```

---

## Phase 9 완료 체크리스트

- [ ] Tab키로 인벤토리 열기/닫기
- [ ] 24칸 (4x6) 그리드 인벤토리
- [ ] 아이템 아이콘 + 수량 표시
- [ ] 기지에서 C키로 제작 메뉴
- [ ] 레시피 목록 표시
- [ ] 재료 있으면 제작 가능
- [ ] E키로 자원 수집 (추후 구현)

---

## 다음 Phase

Phase 9 완료 후 → Phase 10 (이벤트 시스템) 진행

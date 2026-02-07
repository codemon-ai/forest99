import { useEffect } from 'react';
import { useInventoryStore } from '../../stores/inventoryStore';
import { usePlayerStore } from '../../stores/playerStore';
import { ITEMS, RECIPES } from '../../data/items';
import './Inventory.css';

function InventorySlot({ slot, index, isSelected, onClick }) {
  const item = slot ? ITEMS[slot.itemId] : null;
  
  return (
    <div 
      className={`inventory-slot ${isSelected ? 'selected' : ''} ${slot ? 'has-item' : ''}`}
      onClick={() => onClick(index)}
    >
      {item && (
        <>
          <span className="item-icon">{item.icon}</span>
          {slot.amount > 1 && <span className="item-count">{slot.amount}</span>}
        </>
      )}
    </div>
  );
}

function RecipeItem({ recipeId, canCraft, onCraft }) {
  const recipe = RECIPES[recipeId];
  const resultItem = ITEMS[recipe.result];
  
  return (
    <div 
      className={`recipe-item ${canCraft ? 'craftable' : 'disabled'}`}
      onClick={() => canCraft && onCraft(recipeId)}
    >
      <span className="recipe-icon">{resultItem.icon}</span>
      <div className="recipe-info">
        <div className="recipe-name">{resultItem.name}</div>
        <div className="recipe-ingredients">
          {recipe.ingredients.map(({ itemId, amount }) => (
            <span key={itemId}>
              {ITEMS[itemId].icon}{amount}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Inventory() {
  const slots = useInventoryStore((state) => state.slots);
  const isOpen = useInventoryStore((state) => state.isOpen);
  const isCraftingOpen = useInventoryStore((state) => state.isCraftingOpen);
  const selectedSlot = useInventoryStore((state) => state.selectedSlot);
  const toggleInventory = useInventoryStore((state) => state.toggleInventory);
  const toggleCrafting = useInventoryStore((state) => state.toggleCrafting);
  const closeAll = useInventoryStore((state) => state.closeAll);
  const selectSlot = useInventoryStore((state) => state.selectSlot);
  const useItem = useInventoryStore((state) => state.useItem);
  const canCraft = useInventoryStore((state) => state.canCraft);
  const craft = useInventoryStore((state) => state.craft);
  
  const setWeapon = usePlayerStore((state) => state.setWeapon);
  const eat = usePlayerStore((state) => state.eat);
  const restoreSanity = usePlayerStore((state) => state.restoreSanity);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'i' || e.key === 'I' || e.key === 'ㅑ') {
        e.preventDefault();
        toggleInventory();
      }
      if (e.key === 'c' || e.key === 'C' || e.key === 'ㅊ') {
        e.preventDefault();
        toggleCrafting();
      }
      if (e.key === 'Escape') {
        closeAll();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleInventory, toggleCrafting, closeAll]);
  
  const handleSlotClick = (index) => {
    if (selectedSlot === index) {
      const effect = useItem(index);
      if (effect) {
        if (effect.equipWeapon) {
          setWeapon(effect.equipWeapon);
        }
        if (effect.hunger) {
          eat(effect.hunger);
        }
        if (effect.sanity) {
          restoreSanity(effect.sanity);
        }
      }
      selectSlot(null);
    } else {
      selectSlot(index);
    }
  };
  
  const handleCraft = (recipeId) => {
    craft(recipeId);
  };
  
  if (!isOpen && !isCraftingOpen) return null;
  
  return (
    <div className="inventory-overlay">
      <div className="inventory-container">
        {isOpen && (
          <div className="inventory-panel">
            <div className="panel-header">
              <h2>인벤토리</h2>
              <button className="close-btn" onClick={closeAll}>×</button>
            </div>
            <div className="inventory-grid">
              {slots.map((slot, index) => (
                <InventorySlot
                  key={index}
                  slot={slot}
                  index={index}
                  isSelected={selectedSlot === index}
                  onClick={handleSlotClick}
                />
              ))}
            </div>
            <div className="inventory-hint">
              더블클릭으로 아이템 사용/장착
            </div>
          </div>
        )}
        
        {isCraftingOpen && (
          <div className="crafting-panel">
            <div className="panel-header">
              <h2>크래프팅</h2>
              <button className="close-btn" onClick={closeAll}>×</button>
            </div>
            <div className="recipe-list">
              {Object.keys(RECIPES).map((recipeId) => (
                <RecipeItem
                  key={recipeId}
                  recipeId={recipeId}
                  canCraft={canCraft(recipeId)}
                  onCraft={handleCraft}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

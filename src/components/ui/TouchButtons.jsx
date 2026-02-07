import { useTouchStore } from '../../stores/touchStore';
import { useInventoryStore } from '../../stores/inventoryStore';
import './TouchButtons.css';

export default function TouchButtons() {
  const pressAttack = useTouchStore((state) => state.pressAttack);
  const pressInteract = useTouchStore((state) => state.pressInteract);
  const pressJump = useTouchStore((state) => state.pressJump);
  const toggleInventory = useInventoryStore((state) => state.toggleInventory);

  const handleTouch = (callback) => (e) => {
    e.preventDefault();
    callback();
  };
  
  return (
    <div className="touch-buttons">
      <button 
        className="touch-btn touch-btn-attack"
        onTouchStart={handleTouch(pressAttack)}
      >
        ATK
      </button>
      <button 
        className="touch-btn touch-btn-interact"
        onTouchStart={handleTouch(pressInteract)}
      >
        E
      </button>
      <button 
        className="touch-btn touch-btn-inventory"
        onTouchStart={handleTouch(toggleInventory)}
      >
        I
      </button>
      <button 
        className="touch-btn touch-btn-jump"
        onTouchStart={handleTouch(pressJump)}
      >
        JUMP
      </button>
    </div>
  );
}

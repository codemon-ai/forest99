import { useTouchStore } from '../../stores/touchStore';
import { useInventoryStore } from '../../stores/inventoryStore';
import { useTutorialStore } from '../../stores/tutorialStore';
import './TouchButtons.css';

export default function TouchButtons() {
  const pressAttack = useTouchStore((state) => state.pressAttack);
  const pressInteract = useTouchStore((state) => state.pressInteract);
  const pressJump = useTouchStore((state) => state.pressJump);
  const toggleInventory = useInventoryStore((state) => state.toggleInventory);

  const highlightTarget = useTutorialStore((state) => {
    const step = state.getCurrentStep?.();
    return step?.highlight?.mobile;
  });

  const handleTouch = (callback) => (e) => {
    e.preventDefault();
    callback();
  };
  
  return (
    <div className="touch-buttons">
      <button 
        className={`touch-btn touch-btn-attack ${highlightTarget === 'touchBtn-attack' ? 'tutorial-highlight' : ''}`}
        onTouchStart={handleTouch(pressAttack)}
      >
        ATK
      </button>
      <button 
        className={`touch-btn touch-btn-interact ${highlightTarget === 'touchBtn-interact' ? 'tutorial-highlight' : ''}`}
        onTouchStart={handleTouch(pressInteract)}
      >
        E
      </button>
      <button 
        className={`touch-btn touch-btn-inventory ${highlightTarget === 'touchBtn-inventory' ? 'tutorial-highlight' : ''}`}
        onTouchStart={handleTouch(toggleInventory)}
      >
        I
      </button>
      <button 
        className={`touch-btn touch-btn-jump ${highlightTarget === 'touchBtn-jump' ? 'tutorial-highlight' : ''}`}
        onTouchStart={handleTouch(pressJump)}
      >
        JUMP
      </button>
    </div>
  );
}

import { usePlayerStore, WEAPONS } from '../../stores/playerStore';
import { useGameStore } from '../../stores/gameStore';
import { useResourceStore } from '../../stores/resourceStore';
import { useInventoryStore } from '../../stores/inventoryStore';
import { ITEMS } from '../../data/items';
import './HUD.css';

function StatBar({ value, maxValue, color, label }) {
  const percentage = (value / maxValue) * 100;
  
  return (
    <div className="stat-bar">
      <div className="stat-label">{label}</div>
      <div className="stat-bar-bg">
        <div 
          className="stat-bar-fill" 
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      <div className="stat-value">{Math.floor(value)}</div>
    </div>
  );
}

function ComboDisplay({ count }) {
  if (count <= 0) return null;
  
  return (
    <div className="combo-display">
      <span className="combo-count">{count}</span>
      <span className="combo-text">COMBO</span>
    </div>
  );
}

function WeaponDisplay({ weaponKey }) {
  const weapon = WEAPONS[weaponKey];
  
  return (
    <div className="weapon-display">
      <div className="weapon-name">{weapon.name}</div>
      <div className="weapon-stats">
        <span>DMG: {weapon.damage}</span>
        <span>RNG: {weapon.range}m</span>
      </div>
    </div>
  );
}

function InteractPrompt({ resource }) {
  if (!resource) return null;
  
  const resourceNames = {
    tree: '나무',
    rock: '바위',
    bush: '덤불',
  };
  
  return (
    <div className="interact-prompt">
      <span className="interact-key">E</span>
      <span>{resourceNames[resource.type] || resource.type} 채집</span>
    </div>
  );
}

function QuickInventory({ slots }) {
  const filledSlots = slots.filter(s => s !== null).slice(0, 5);
  
  if (filledSlots.length === 0) return null;
  
  return (
    <div className="quick-inventory">
      {filledSlots.map((slot, index) => {
        const item = ITEMS[slot.itemId];
        return (
          <div key={index} className="quick-slot">
            <span className="quick-icon">{item.icon}</span>
            {slot.amount > 1 && <span className="quick-count">{slot.amount}</span>}
          </div>
        );
      })}
    </div>
  );
}

export default function HUD() {
  const health = usePlayerStore((state) => state.health);
  const hunger = usePlayerStore((state) => state.hunger);
  const sanity = usePlayerStore((state) => state.sanity);
  const currentWeapon = usePlayerStore((state) => state.currentWeapon);
  const comboCount = usePlayerStore((state) => state.comboCount);
  const day = useGameStore((state) => state.day);
  const isNight = useGameStore((state) => state.isNight);
  const nearbyResource = useResourceStore((state) => state.nearbyResource);
  const slots = useInventoryStore((state) => state.slots);
  
  return (
    <div className="hud">
      <div className="hud-top-left">
        <div className="day-counter">
          Day {day} {isNight ? '🌙' : '☀️'}
        </div>
        <StatBar value={health} maxValue={100} color="#e53935" label="HP" />
        <StatBar value={hunger} maxValue={100} color="#ff9800" label="Hunger" />
        <StatBar value={sanity} maxValue={100} color="#7b1fa2" label="Sanity" />
      </div>
      
      <div className="hud-top-right">
        <QuickInventory slots={slots} />
      </div>
      
      <div className="hud-center">
        <InteractPrompt resource={nearbyResource} />
      </div>
      
      <div className="hud-bottom-center">
        <WeaponDisplay weaponKey={currentWeapon} />
        <ComboDisplay count={comboCount} />
      </div>
      
      <div className="hud-controls">
        <div>WASD: Move | Shift: Run | Space: Jump | Click: Attack</div>
        <div>I: Inventory | C: Crafting | E: Interact</div>
      </div>
    </div>
  );
}

import { usePlayerStore } from '../../stores/playerStore';
import { useGameStore } from '../../stores/gameStore';
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

export default function HUD() {
  const health = usePlayerStore((state) => state.health);
  const hunger = usePlayerStore((state) => state.hunger);
  const sanity = usePlayerStore((state) => state.sanity);
  const day = useGameStore((state) => state.day);
  const isNight = useGameStore((state) => state.isNight);
  
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
    </div>
  );
}

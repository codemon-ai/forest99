import { useGameStore } from '../../stores/gameStore';
import { useCombatStore } from '../../stores/combatStore';
import { MONSTER_STATS, MONSTER_TYPES } from '../../data/monsters';
import './BossHUD.css';

const BOSS_ID = 'forest-guardian';

export default function BossHUD() {
  const bossSpawned = useGameStore((state) => state.bossSpawned);
  const bossDefeated = useGameStore((state) => state.bossDefeated);
  const monsterData = useCombatStore((state) => state.monsters[BOSS_ID]);
  
  if (!bossSpawned || bossDefeated || !monsterData) return null;
  
  const maxHp = MONSTER_STATS[MONSTER_TYPES.FOREST_GUARDIAN].hp;
  const hpPercent = (monsterData.hp / maxHp) * 100;
  const phase = hpPercent <= 30 ? 3 : hpPercent <= 60 ? 2 : 1;
  
  return (
    <div className="boss-hud">
      <div className="boss-name">
        <span className="boss-icon">🌲</span>
        숲의 수호자
        <span className="boss-phase">Phase {phase}</span>
      </div>
      <div className="boss-hp-container">
        <div className="boss-hp-bg">
          <div 
            className={`boss-hp-fill phase-${phase}`}
            style={{ width: `${hpPercent}%` }}
          />
        </div>
        <div className="boss-hp-text">
          {monsterData.hp} / {maxHp}
        </div>
      </div>
    </div>
  );
}

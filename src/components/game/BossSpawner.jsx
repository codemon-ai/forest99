import { useState, useRef, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import ForestGuardian from './monsters/ForestGuardian';
import { useGameStore } from '../../stores/gameStore';
import { usePlayerStore } from '../../stores/playerStore';
import { useCombatStore } from '../../stores/combatStore';
import { MONSTER_TYPES, MONSTER_STATS } from '../../data/monsters';
import { updateBossAI, getBossPhase } from '../../systems/AISystem';

const BOSS_DAY = 99;
const BOSS_ID = 'forest-guardian';

function BossHealthBar({ hp, maxHp, phase }) {
  const hpPercent = hp / maxHp;
  
  const phaseColor = phase === 3 ? '#ff0000' : phase === 2 ? '#ff6600' : '#44ff44';
  
  return (
    <group position={[0, 16, 0]}>
      <mesh>
        <planeGeometry args={[4, 0.3]} />
        <meshBasicMaterial color="#333333" />
      </mesh>
      <mesh position={[(hpPercent - 1) * 2, 0, 0.01]}>
        <planeGeometry args={[hpPercent * 4, 0.25]} />
        <meshBasicMaterial color={phaseColor} />
      </mesh>
    </group>
  );
}

export default function BossSpawner() {
  const [boss, setBoss] = useState(null);
  const groupRef = useRef();
  const attackTimer = useRef(0);
  const hasDealtDamage = useRef(false);
  
  const day = useGameStore((state) => state.day);
  const bossSpawned = useGameStore((state) => state.bossSpawned);
  const setBossSpawned = useGameStore((state) => state.setBossSpawned);
  const setBossDefeated = useGameStore((state) => state.setBossDefeated);
  
  const playerPosition = usePlayerStore((state) => state.position);
  const damagePlayer = usePlayerStore((state) => state.damage);
  
  const registerMonster = useCombatStore((state) => state.registerMonster);
  const unregisterMonster = useCombatStore((state) => state.unregisterMonster);
  const monsterData = useCombatStore((state) => state.monsters[BOSS_ID]);
  const updateMonsterPosition = useCombatStore((state) => state.updateMonsterPosition);
  
  useEffect(() => {
    if (day >= BOSS_DAY && !bossSpawned && !boss) {
      const stats = MONSTER_STATS[MONSTER_TYPES.FOREST_GUARDIAN];
      const spawnPos = [30, 0, 30];
      
      setBoss({
        id: BOSS_ID,
        position: spawnPos,
        speed: stats.speed,
        attackCooldown: 0,
        windupTimer: 0,
        currentAttack: null,
        summonCooldown: 0,
        rageCooldown: 0,
        isRaging: false,
        hpPercent: 1,
        phase: 1,
      });
      
      registerMonster(BOSS_ID, MONSTER_TYPES.FOREST_GUARDIAN, spawnPos);
      setBossSpawned(true);
    }
  }, [day, bossSpawned, boss, registerMonster, setBossSpawned]);
  
  useEffect(() => {
    if (monsterData?.isDead && boss) {
      setTimeout(() => {
        unregisterMonster(BOSS_ID);
        setBoss(null);
        setBossDefeated();
      }, 2000);
    }
  }, [monsterData?.isDead, boss, unregisterMonster, setBossDefeated]);
  
  const handleBossAttack = useCallback((attackType, bossPos) => {
    const dx = playerPosition[0] - bossPos[0];
    const dz = playerPosition[2] - bossPos[2];
    const distance = Math.sqrt(dx * dx + dz * dz);
    
    const stats = MONSTER_STATS[MONSTER_TYPES.FOREST_GUARDIAN];
    const range = attackType === 'slam' ? 6 : 12;
    const damage = attackType === 'slam' ? stats.attack : stats.attack * 0.6;
    
    if (distance <= range) {
      damagePlayer(damage);
    }
  }, [playerPosition, damagePlayer]);
  
  useFrame((_, delta) => {
    if (!boss || !monsterData || monsterData.isDead) return;
    
    const hpPercent = monsterData.hp / monsterData.maxHp;
    
    const updatedBoss = updateBossAI(
      { ...boss, hpPercent },
      playerPosition,
      delta
    );
    
    if (updatedBoss.shouldAttack && !hasDealtDamage.current) {
      handleBossAttack(updatedBoss.currentAttack, updatedBoss.position);
      hasDealtDamage.current = true;
    }
    
    if (!updatedBoss.isAttacking) {
      hasDealtDamage.current = false;
    }
    
    updateMonsterPosition(BOSS_ID, updatedBoss.position);
    setBoss(updatedBoss);
    
    if (groupRef.current) {
      groupRef.current.position.set(...updatedBoss.position);
      
      const dx = playerPosition[0] - updatedBoss.position[0];
      const dz = playerPosition[2] - updatedBoss.position[2];
      groupRef.current.rotation.y = Math.atan2(dx, dz);
    }
  });
  
  if (!boss || !monsterData) return null;
  
  const phase = getBossPhase(monsterData.hp / monsterData.maxHp);
  
  return (
    <group ref={groupRef} position={boss.position}>
      <BossHealthBar 
        hp={monsterData.hp} 
        maxHp={monsterData.maxHp}
        phase={phase}
      />
      <ForestGuardian 
        phase={phase}
        isAttacking={boss.isAttacking}
        attackType={boss.currentAttack}
      />
    </group>
  );
}

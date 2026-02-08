import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useCombatStore } from '../../stores/combatStore';
import { useInventoryStore } from '../../stores/inventoryStore';

function HealthBar({ hp, maxHp, height = 2 }) {
  const hpPercent = hp / maxHp;
  
  return (
    <group position={[0, height, 0]}>
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[1, 0.1]} />
        <meshBasicMaterial color="#333333" />
      </mesh>
      <mesh position={[(hpPercent - 1) * 0.5, 0, 0.01]}>
        <planeGeometry args={[hpPercent, 0.08]} />
        <meshBasicMaterial color={hpPercent > 0.3 ? '#44ff44' : '#ff4444'} />
      </mesh>
    </group>
  );
}

export default function MonsterWrapper({ 
  id, 
  type, 
  position, 
  children, 
  onDeath,
  healthBarHeight = 2 
}) {
  const groupRef = useRef();
  const hitFlash = useRef(0);
  const droppedLoot = useRef(false);
  
  const registerMonster = useCombatStore((state) => state.registerMonster);
  const unregisterMonster = useCombatStore((state) => state.unregisterMonster);
  const updateMonsterPosition = useCombatStore((state) => state.updateMonsterPosition);
  const monsterData = useCombatStore((state) => state.monsters[id]);
  
  const generateMonsterDrops = useInventoryStore((state) => state.generateMonsterDrops);
  
  useEffect(() => {
    registerMonster(id, type, position);
    return () => unregisterMonster(id);
  }, [id, type, registerMonster, unregisterMonster]);
  
  useEffect(() => {
    if (monsterData?.isDead && !droppedLoot.current) {
      droppedLoot.current = true;
      generateMonsterDrops(type);
      
      if (onDeath) {
        const timer = setTimeout(() => onDeath(id), 500);
        return () => clearTimeout(timer);
      }
    }
  }, [monsterData?.isDead, id, type, onDeath, generateMonsterDrops]);
  
  useEffect(() => {
    if (groupRef.current && position) {
      groupRef.current.position.set(position[0], position[1], position[2]);
    }
  }, [position]);
  
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    
    const pos = groupRef.current.position;
    updateMonsterPosition(id, [pos.x, pos.y, pos.z]);
    
    if (monsterData?.isHit) {
      hitFlash.current = 1;
    }
    hitFlash.current = Math.max(0, hitFlash.current - delta * 5);
    
    if (monsterData?.isDead) {
      groupRef.current.scale.y = Math.max(0.1, groupRef.current.scale.y - delta * 3);
      groupRef.current.position.y = Math.max(-0.5, groupRef.current.position.y - delta * 2);
    }
  });
  
  if (!monsterData) return null;
  
  const showHealthBar = monsterData.hp < monsterData.maxHp && !monsterData.isDead;
  
  return (
    <group ref={groupRef} position={position}>
      {showHealthBar && (
        <HealthBar 
          hp={monsterData.hp} 
          maxHp={monsterData.maxHp} 
          height={healthBarHeight}
        />
      )}
      <group scale={monsterData.isHit ? [1.1, 1.1, 1.1] : [1, 1, 1]}>
        {children}
      </group>
    </group>
  );
}

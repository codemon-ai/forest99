import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useCombatStore } from '../../stores/combatStore';

const DAMAGE_DISPLAY_DURATION = 1000;

function DamageNumber({ data, onComplete }) {
  const ref = useRef();
  const startY = useRef(data.position[1] + 1);
  const elapsed = useRef(0);
  
  useFrame((_, delta) => {
    if (!ref.current) return;
    
    elapsed.current += delta * 1000;
    const progress = Math.min(elapsed.current / DAMAGE_DISPLAY_DURATION, 1);
    
    ref.current.position.y = startY.current + progress * 2;
    ref.current.material.opacity = 1 - progress;
    
    if (progress >= 1) {
      onComplete();
    }
  });
  
  return (
    <Text
      ref={ref}
      position={[data.position[0], startY.current, data.position[2]]}
      fontSize={0.5}
      color="#ff4444"
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.05}
      outlineColor="#000000"
      material-transparent={true}
    >
      {data.value}
    </Text>
  );
}

export default function DamageNumbers() {
  const damageNumbers = useCombatStore((state) => state.damageNumbers);
  const clearDamageNumber = useCombatStore((state) => state.clearDamageNumber);
  
  return (
    <>
      {damageNumbers.map((data) => (
        <DamageNumber
          key={data.id}
          data={data}
          onComplete={() => clearDamageNumber(data.id)}
        />
      ))}
    </>
  );
}

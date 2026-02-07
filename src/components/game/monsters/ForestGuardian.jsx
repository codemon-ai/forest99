import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

export default function ForestGuardian({ phase = 1, isAttacking = false, attackType = null }) {
  const groupRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const time = useRef(0);
  
  const phaseColor = useMemo(() => {
    if (phase === 3) return '#8b0000';
    if (phase === 2) return '#cc6600';
    return '#2e7d32';
  }, [phase]);
  
  const eyeColor = useMemo(() => {
    if (phase === 3) return '#ff0000';
    if (phase === 2) return '#ff6600';
    return '#ffff00';
  }, [phase]);
  
  useFrame((_, delta) => {
    time.current += delta;
    
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(time.current * 0.5) * 0.1;
    }
    
    if (leftArmRef.current && rightArmRef.current) {
      if (isAttacking && attackType === 'slam') {
        leftArmRef.current.rotation.x = Math.sin(time.current * 10) * 0.5 - 0.5;
        rightArmRef.current.rotation.x = Math.sin(time.current * 10) * 0.5 - 0.5;
      } else {
        const swing = Math.sin(time.current * 2) * 0.1;
        leftArmRef.current.rotation.x = swing;
        rightArmRef.current.rotation.x = -swing;
      }
    }
  });
  
  return (
    <group ref={groupRef} scale={2}>
      <mesh position={[0, 3, 0]} castShadow>
        <cylinderGeometry args={[1.2, 1.8, 4, 8]} />
        <meshStandardMaterial color={phaseColor} flatShading />
      </mesh>
      
      <mesh position={[0, 5.5, 0]} castShadow>
        <sphereGeometry args={[1.2, 6, 5]} />
        <meshStandardMaterial color={phaseColor} flatShading />
      </mesh>
      
      <mesh position={[-0.4, 5.8, 0.8]} castShadow>
        <sphereGeometry args={[0.25, 4, 4]} />
        <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.4, 5.8, 0.8]} castShadow>
        <sphereGeometry args={[0.25, 4, 4]} />
        <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={0.5} />
      </mesh>
      
      <group ref={leftArmRef} position={[-1.8, 4, 0]}>
        <mesh rotation={[0, 0, Math.PI / 4]} castShadow>
          <cylinderGeometry args={[0.3, 0.4, 3, 6]} />
          <meshStandardMaterial color={phaseColor} flatShading />
        </mesh>
        <mesh position={[-1.2, -1.2, 0]} castShadow>
          <coneGeometry args={[0.5, 1, 5]} />
          <meshStandardMaterial color="#1b5e20" flatShading />
        </mesh>
      </group>
      
      <group ref={rightArmRef} position={[1.8, 4, 0]}>
        <mesh rotation={[0, 0, -Math.PI / 4]} castShadow>
          <cylinderGeometry args={[0.3, 0.4, 3, 6]} />
          <meshStandardMaterial color={phaseColor} flatShading />
        </mesh>
        <mesh position={[1.2, -1.2, 0]} castShadow>
          <coneGeometry args={[0.5, 1, 5]} />
          <meshStandardMaterial color="#1b5e20" flatShading />
        </mesh>
      </group>
      
      <mesh position={[-0.6, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.5, 2, 6]} />
        <meshStandardMaterial color="#3e2723" flatShading />
      </mesh>
      <mesh position={[0.6, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.5, 2, 6]} />
        <meshStandardMaterial color="#3e2723" flatShading />
      </mesh>
      
      <mesh position={[0, 6.8, 0]} castShadow>
        <coneGeometry args={[1.5, 2, 8]} />
        <meshStandardMaterial color="#1b5e20" flatShading />
      </mesh>
      <mesh position={[-0.8, 6.2, 0]} rotation={[0, 0, 0.3]} castShadow>
        <coneGeometry args={[0.6, 1.2, 6]} />
        <meshStandardMaterial color="#2e7d32" flatShading />
      </mesh>
      <mesh position={[0.8, 6.2, 0]} rotation={[0, 0, -0.3]} castShadow>
        <coneGeometry args={[0.6, 1.2, 6]} />
        <meshStandardMaterial color="#2e7d32" flatShading />
      </mesh>
      
      {phase >= 2 && (
        <>
          <mesh position={[-1, 2, 0.5]} castShadow>
            <dodecahedronGeometry args={[0.3]} />
            <meshStandardMaterial color="#ff6600" emissive="#ff3300" emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[1, 3, 0.5]} castShadow>
            <dodecahedronGeometry args={[0.25]} />
            <meshStandardMaterial color="#ff6600" emissive="#ff3300" emissiveIntensity={0.3} />
          </mesh>
        </>
      )}
      
      {phase === 3 && (
        <pointLight position={[0, 4, 0]} color="#ff0000" intensity={2} distance={10} />
      )}
    </group>
  );
}

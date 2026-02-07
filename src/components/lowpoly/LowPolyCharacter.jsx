import { forwardRef, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const GUARD_COLORS = {
  body: '#1a237e',
  limbs: '#1a237e',
  skin: '#ffccbc',
  boots: '#212121',
  belt: '#5d4037',
};

const LowPolyCharacter = forwardRef(({ 
  isAttacking = false, 
  isMoving = false, 
  isRunning = false,
  isHarvesting = false 
}, ref) => {
  const rightArmRef = useRef();
  const leftArmRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();
  const attackProgress = useRef(0);
  const walkCycle = useRef(0);
  const harvestProgress = useRef(0);
  
  useFrame((_, delta) => {
    const walkSpeed = isRunning ? 18 : 12;
    if (isMoving) {
      walkCycle.current += delta * walkSpeed;
    } else {
      walkCycle.current *= 0.9;
    }
    
    if (leftLegRef.current && rightLegRef.current) {
      const legSwing = Math.sin(walkCycle.current) * 0.6;
      leftLegRef.current.rotation.x = legSwing;
      rightLegRef.current.rotation.x = -legSwing;
    }
    
    if (isHarvesting) {
      harvestProgress.current = Math.min(1, harvestProgress.current + delta * 10);
    } else {
      harvestProgress.current = Math.max(0, harvestProgress.current - delta * 6);
    }
    
    if (isAttacking) {
      attackProgress.current = Math.min(1, attackProgress.current + delta * 15);
    } else {
      attackProgress.current = Math.max(0, attackProgress.current - delta * 8);
    }
    
    if (rightArmRef.current) {
      if (attackProgress.current > 0) {
        const punchAngle = Math.sin(attackProgress.current * Math.PI) * 1.5;
        rightArmRef.current.rotation.x = -punchAngle;
        rightArmRef.current.position.z = Math.sin(attackProgress.current * Math.PI) * 0.3;
      } else if (harvestProgress.current > 0) {
        const harvestAngle = Math.sin(harvestProgress.current * Math.PI * 2) * 1.2;
        rightArmRef.current.rotation.x = -harvestAngle;
        rightArmRef.current.position.z = 0;
      } else if (isMoving) {
        const armSwing = Math.sin(walkCycle.current + Math.PI) * 0.4;
        rightArmRef.current.rotation.x = armSwing;
        rightArmRef.current.position.z = 0;
      } else {
        rightArmRef.current.rotation.x = 0;
        rightArmRef.current.position.z = 0;
      }
    }
    
    if (leftArmRef.current) {
      if (harvestProgress.current > 0) {
        const harvestAngle = Math.sin(harvestProgress.current * Math.PI * 2) * 1.2;
        leftArmRef.current.rotation.x = -harvestAngle;
      } else if (isMoving) {
        const armSwing = Math.sin(walkCycle.current) * 0.4;
        leftArmRef.current.rotation.x = armSwing;
      } else {
        leftArmRef.current.rotation.x = 0;
      }
    }
  });
  
  return (
    <group ref={ref}>
      {/* Head */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <sphereGeometry args={[0.25, 6, 4]} />
        <meshStandardMaterial color={GUARD_COLORS.skin} flatShading />
      </mesh>
      
      {/* Body */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[0.5, 0.7, 0.3]} />
        <meshStandardMaterial color={GUARD_COLORS.body} flatShading />
      </mesh>
      
      {/* Belt */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[0.52, 0.1, 0.32]} />
        <meshStandardMaterial color={GUARD_COLORS.belt} flatShading />
      </mesh>
      
      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.35, 1.2, 0]}>
        <mesh position={[0, -0.15, 0]} castShadow>
          <boxGeometry args={[0.15, 0.5, 0.15]} />
          <meshStandardMaterial color={GUARD_COLORS.limbs} flatShading />
        </mesh>
        <mesh position={[0, -0.45, 0]} castShadow>
          <sphereGeometry args={[0.1, 6, 4]} />
          <meshStandardMaterial color={GUARD_COLORS.skin} flatShading />
        </mesh>
      </group>
      
      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.35, 1.2, 0]}>
        <mesh position={[0, -0.15, 0]} castShadow>
          <boxGeometry args={[0.15, 0.5, 0.15]} />
          <meshStandardMaterial color={GUARD_COLORS.limbs} flatShading />
        </mesh>
        <mesh position={[0, -0.45, 0]} castShadow>
          <sphereGeometry args={[0.1, 6, 4]} />
          <meshStandardMaterial color={GUARD_COLORS.skin} flatShading />
        </mesh>
      </group>
      
      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.12, 0.7, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <boxGeometry args={[0.18, 0.6, 0.18]} />
          <meshStandardMaterial color={GUARD_COLORS.limbs} flatShading />
        </mesh>
        <mesh position={[0, -0.6, 0.02]} castShadow>
          <boxGeometry args={[0.2, 0.2, 0.25]} />
          <meshStandardMaterial color={GUARD_COLORS.boots} flatShading />
        </mesh>
      </group>
      
      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.12, 0.7, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <boxGeometry args={[0.18, 0.6, 0.18]} />
          <meshStandardMaterial color={GUARD_COLORS.limbs} flatShading />
        </mesh>
        <mesh position={[0, -0.6, 0.02]} castShadow>
          <boxGeometry args={[0.2, 0.2, 0.25]} />
          <meshStandardMaterial color={GUARD_COLORS.boots} flatShading />
        </mesh>
      </group>
    </group>
  );
});

LowPolyCharacter.displayName = 'LowPolyCharacter';

export default LowPolyCharacter;

import { forwardRef } from 'react';

const GUARD_COLORS = {
  body: '#1a237e',
  limbs: '#1a237e',
  skin: '#ffccbc',
  boots: '#212121',
  belt: '#5d4037',
};

const LowPolyCharacter = forwardRef((props, ref) => {
  return (
    <group ref={ref}>
      <mesh position={[0, 1.6, 0]} castShadow>
        <sphereGeometry args={[0.25, 6, 4]} />
        <meshStandardMaterial color={GUARD_COLORS.skin} flatShading />
      </mesh>
      
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[0.5, 0.7, 0.3]} />
        <meshStandardMaterial color={GUARD_COLORS.body} flatShading />
      </mesh>
      
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[0.52, 0.1, 0.32]} />
        <meshStandardMaterial color={GUARD_COLORS.belt} flatShading />
      </mesh>
      
      <mesh position={[-0.35, 1.1, 0]} castShadow>
        <boxGeometry args={[0.15, 0.5, 0.15]} />
        <meshStandardMaterial color={GUARD_COLORS.limbs} flatShading />
      </mesh>
      
      <mesh position={[0.35, 1.1, 0]} castShadow>
        <boxGeometry args={[0.15, 0.5, 0.15]} />
        <meshStandardMaterial color={GUARD_COLORS.limbs} flatShading />
      </mesh>
      
      <mesh position={[-0.12, 0.4, 0]} castShadow>
        <boxGeometry args={[0.18, 0.6, 0.18]} />
        <meshStandardMaterial color={GUARD_COLORS.limbs} flatShading />
      </mesh>
      
      <mesh position={[0.12, 0.4, 0]} castShadow>
        <boxGeometry args={[0.18, 0.6, 0.18]} />
        <meshStandardMaterial color={GUARD_COLORS.limbs} flatShading />
      </mesh>
      
      <mesh position={[-0.12, 0.1, 0.02]} castShadow>
        <boxGeometry args={[0.2, 0.2, 0.25]} />
        <meshStandardMaterial color={GUARD_COLORS.boots} flatShading />
      </mesh>
      
      <mesh position={[0.12, 0.1, 0.02]} castShadow>
        <boxGeometry args={[0.2, 0.2, 0.25]} />
        <meshStandardMaterial color={GUARD_COLORS.boots} flatShading />
      </mesh>
    </group>
  );
});

LowPolyCharacter.displayName = 'LowPolyCharacter';

export default LowPolyCharacter;

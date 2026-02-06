import { OrbitControls } from '@react-three/drei';
import { COLORS } from '../../data/config';

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color={COLORS.grass} flatShading />
    </mesh>
  );
}

function TestCube() {
  return (
    <mesh position={[0, 0.5, 0]} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={COLORS.tree_leaves} flatShading />
    </mesh>
  );
}

export default function World() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      
      <color attach="background" args={[COLORS.sky_day]} />
      <fog attach="fog" args={[COLORS.sky_day, 30, 100]} />
       
      <Ground />
      <TestCube />
      
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={50}
      />
    </>
  );
}

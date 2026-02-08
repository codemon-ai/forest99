import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GAME_CONFIG, COLORS } from '../../data/config';
import { getTerrainHeight, getRandomPosition } from '../../utils/noise';
import { registerCollider, unregisterCollider } from '../../systems/CollisionSystem';
import { useResourceStore } from '../../stores/resourceStore';
import { usePlayerStore } from '../../stores/playerStore';
import { usePerformanceStore, shouldRender } from '../../systems/PerformanceManager';

const BASE_TREE_COUNT = 100;
const BASE_RADIUS = 10;

export default function InstancedForest() {
  const trunkRef = useRef();
  const leaves1Ref = useRef();
  const leaves2Ref = useRef();
  const leaves3Ref = useRef();
  
  const registerResource = useResourceStore((state) => state.registerResource);
  const unregisterResource = useResourceStore((state) => state.unregisterResource);
  const settings = usePerformanceStore((state) => state.settings);
  
  const treeCount = Math.floor(BASE_TREE_COUNT * settings.treeDensity);
  
  const trees = useMemo(() => {
    const result = [];
    const mapSize = GAME_CONFIG.worldSize;
    
    for (let i = 0; i < treeCount; i++) {
      let position;
      let attempts = 0;
      
      do {
        position = getRandomPosition(mapSize);
        attempts++;
      } while (
        Math.sqrt(position[0] ** 2 + position[2] ** 2) < BASE_RADIUS &&
        attempts < 10
      );
      
      const height = getTerrainHeight(position[0], position[2]);
      position[1] = height;
      
      const scale = 0.8 + Math.random() * 0.6;
      const rotation = Math.random() * Math.PI * 2;
      
      result.push({ 
        position, 
        scale, 
        rotation,
        id: `tree-${i}`,
        matrix: new THREE.Matrix4()
      });
    }
    
    return result;
  }, [treeCount]);

  useEffect(() => {
    const colliderIds = trees.map(tree => 
      registerCollider(tree.position, 0.4 * tree.scale, 'tree')
    );
    
    trees.forEach(tree => {
      registerResource(tree.id, 'tree', tree.position);
    });
    
    return () => {
      colliderIds.forEach(unregisterCollider);
      trees.forEach(tree => {
        unregisterResource(tree.id);
      });
    };
  }, [trees, registerResource, unregisterResource]);

  useEffect(() => {
    if (!trunkRef.current || !leaves1Ref.current) return;
    
    const tempMatrix = new THREE.Matrix4();
    const tempPosition = new THREE.Vector3();
    const tempQuaternion = new THREE.Quaternion();
    const tempScale = new THREE.Vector3();
    
    trees.forEach((tree, i) => {
      const { position, scale, rotation } = tree;
      
      tempPosition.set(position[0], position[1] + 1 * scale, position[2]);
      tempQuaternion.setFromEuler(new THREE.Euler(0, rotation, 0));
      tempScale.set(scale, scale, scale);
      tempMatrix.compose(tempPosition, tempQuaternion, tempScale);
      trunkRef.current.setMatrixAt(i, tempMatrix);
      
      tempPosition.set(position[0], position[1] + 2.5 * scale, position[2]);
      tempMatrix.compose(tempPosition, tempQuaternion, tempScale);
      leaves1Ref.current.setMatrixAt(i, tempMatrix);
      
      tempPosition.set(position[0], position[1] + 3.5 * scale, position[2]);
      tempMatrix.compose(tempPosition, tempQuaternion, tempScale);
      leaves2Ref.current.setMatrixAt(i, tempMatrix);
      
      tempPosition.set(position[0], position[1] + 4.3 * scale, position[2]);
      tempMatrix.compose(tempPosition, tempQuaternion, tempScale);
      leaves3Ref.current.setMatrixAt(i, tempMatrix);
    });
    
    trunkRef.current.instanceMatrix.needsUpdate = true;
    leaves1Ref.current.instanceMatrix.needsUpdate = true;
    leaves2Ref.current.instanceMatrix.needsUpdate = true;
    leaves3Ref.current.instanceMatrix.needsUpdate = true;
  }, [trees]);

  useFrame(() => {
    const playerPos = usePlayerStore.getState().position;
    const drawDistance = settings.drawDistance;
    
    if (!trunkRef.current) return;
    
    const tempMatrix = new THREE.Matrix4();
    const tempPosition = new THREE.Vector3();
    const tempQuaternion = new THREE.Quaternion();
    const tempScale = new THREE.Vector3();
    const hiddenScale = new THREE.Vector3(0.001, 0.001, 0.001);
    
    trees.forEach((tree, i) => {
      const { position, scale, rotation } = tree;
      const distance = Math.sqrt(
        (position[0] - playerPos[0]) ** 2 + (position[2] - playerPos[2]) ** 2
      );
      
      const visible = shouldRender(distance, drawDistance);
      
      tempPosition.set(position[0], position[1] + 1 * scale, position[2]);
      tempQuaternion.setFromEuler(new THREE.Euler(0, rotation, 0));
      
      if (visible) {
        tempScale.set(scale, scale, scale);
      } else {
        tempScale.copy(hiddenScale);
      }
      
      tempMatrix.compose(tempPosition, tempQuaternion, tempScale);
      trunkRef.current.setMatrixAt(i, tempMatrix);
      
      tempPosition.set(position[0], position[1] + 2.5 * scale, position[2]);
      tempMatrix.compose(tempPosition, tempQuaternion, visible ? new THREE.Vector3(scale, scale, scale) : hiddenScale);
      leaves1Ref.current.setMatrixAt(i, tempMatrix);
      
      tempPosition.set(position[0], position[1] + 3.5 * scale, position[2]);
      leaves2Ref.current.setMatrixAt(i, tempMatrix);
      
      tempPosition.set(position[0], position[1] + 4.3 * scale, position[2]);
      leaves3Ref.current.setMatrixAt(i, tempMatrix);
    });
    
    trunkRef.current.instanceMatrix.needsUpdate = true;
    leaves1Ref.current.instanceMatrix.needsUpdate = true;
    leaves2Ref.current.instanceMatrix.needsUpdate = true;
    leaves3Ref.current.instanceMatrix.needsUpdate = true;
  });

  const trunkGeometry = useMemo(() => new THREE.CylinderGeometry(0.2, 0.3, 2, 6), []);
  const leaves1Geometry = useMemo(() => new THREE.ConeGeometry(1.2, 2, 6), []);
  const leaves2Geometry = useMemo(() => new THREE.ConeGeometry(0.9, 1.5, 6), []);
  const leaves3Geometry = useMemo(() => new THREE.ConeGeometry(0.6, 1, 6), []);
  
  const trunkMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: COLORS.tree_trunk, 
    flatShading: true 
  }), []);
  
  const leavesMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: COLORS.tree_leaves, 
    flatShading: true 
  }), []);

  return (
    <group>
      <instancedMesh 
        ref={trunkRef} 
        args={[trunkGeometry, trunkMaterial, treeCount]} 
        castShadow 
      />
      <instancedMesh 
        ref={leaves1Ref} 
        args={[leaves1Geometry, leavesMaterial, treeCount]} 
        castShadow 
      />
      <instancedMesh 
        ref={leaves2Ref} 
        args={[leaves2Geometry, leavesMaterial, treeCount]} 
        castShadow 
      />
      <instancedMesh 
        ref={leaves3Ref} 
        args={[leaves3Geometry, leavesMaterial, treeCount]} 
        castShadow 
      />
    </group>
  );
}

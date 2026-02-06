import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import LowPolyCharacter from '../lowpoly/LowPolyCharacter';
import { usePlayerStore } from '../../stores/playerStore';
import { useControls } from '../../hooks/useControls';
import { getTerrainHeight } from '../../utils/noise';
import { resolveCollision } from '../../systems/CollisionSystem';
import { updateSurvival } from '../../systems/SurvivalSystem';
import { GAME_CONFIG } from '../../data/config';

const MOVE_SPEED = 5;
const RUN_MULTIPLIER = 1.8;
const JUMP_FORCE = 8;
const GRAVITY = 20;
const ROTATION_SPEED = 3;

export default function Player() {
  const groupRef = useRef();
  const characterRef = useRef();
  const velocityY = useRef(0);
  const keys = useControls();
  const { camera } = useThree();
  
  const position = usePlayerStore((state) => state.position);
  const sanity = usePlayerStore((state) => state.sanity);
  const setPosition = usePlayerStore((state) => state.setPosition);
  const setIsMoving = usePlayerStore((state) => state.setIsMoving);
  const setIsRunning = usePlayerStore((state) => state.setIsRunning);

  const cameraAngle = useRef(0);
  const cameraPitch = useRef(0.5);
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (document.pointerLockElement) {
        cameraAngle.current -= e.movementX * 0.002;
        cameraPitch.current = Math.max(0.1, Math.min(1.2, 
          cameraPitch.current - e.movementY * 0.002
        ));
      }
    };
    
    const handleClick = () => {
      document.body.requestPointerLock();
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    
    const currentPos = groupRef.current.position;
    const moveDirection = new THREE.Vector3();
    
    if (keys.current.forward) moveDirection.z -= 1;
    if (keys.current.backward) moveDirection.z += 1;
    if (keys.current.left) moveDirection.x -= 1;
    if (keys.current.right) moveDirection.x += 1;
    
    const isMoving = moveDirection.length() > 0;
    const isRunning = keys.current.run && isMoving;
    setIsMoving(isMoving);
    setIsRunning(isRunning);
    
    if (isMoving) {
      moveDirection.normalize();
      
      moveDirection.applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        cameraAngle.current
      );
      
      const speed = MOVE_SPEED * (isRunning ? RUN_MULTIPLIER : 1);
      
      let newX = currentPos.x + moveDirection.x * speed * delta;
      let newZ = currentPos.z + moveDirection.z * speed * delta;
      
      const halfSize = GAME_CONFIG.worldSize / 2 - 2;
      newX = Math.max(-halfSize, Math.min(halfSize, newX));
      newZ = Math.max(-halfSize, Math.min(halfSize, newZ));
      
      currentPos.x = newX;
      currentPos.z = newZ;
      
      const targetRotation = Math.atan2(moveDirection.x, moveDirection.z);
      if (characterRef.current) {
        const currentRot = characterRef.current.rotation.y;
        const diff = targetRotation - currentRot;
        const normalizedDiff = Math.atan2(Math.sin(diff), Math.cos(diff));
        characterRef.current.rotation.y += normalizedDiff * ROTATION_SPEED * delta;
      }
    }
    
    const terrainHeight = getTerrainHeight(currentPos.x, currentPos.z);
    const groundLevel = terrainHeight + 0.1;
    
    if (keys.current.jump && currentPos.y <= groundLevel + 0.1) {
      velocityY.current = JUMP_FORCE;
    }
    
    velocityY.current -= GRAVITY * delta;
    currentPos.y += velocityY.current * delta;
    
    if (currentPos.y < groundLevel) {
      currentPos.y = groundLevel;
      velocityY.current = 0;
    }
    
    resolveCollision(currentPos, 0.3);
    
    setPosition([currentPos.x, currentPos.y, currentPos.z]);
    
    const cameraDistance = 8;
    const cameraHeight = 3 + cameraPitch.current * 3;
    
    camera.position.x = currentPos.x + Math.sin(cameraAngle.current) * cameraDistance;
    camera.position.z = currentPos.z + Math.cos(cameraAngle.current) * cameraDistance;
    camera.position.y = currentPos.y + cameraHeight;
    
    camera.lookAt(currentPos.x, currentPos.y + 1, currentPos.z);
    
    if (sanity <= 25) {
      const shakeIntensity = ((25 - sanity) / 25) * 0.05;
      camera.position.x += (Math.random() - 0.5) * shakeIntensity;
      camera.position.y += (Math.random() - 0.5) * shakeIntensity;
    }
    
    updateSurvival(delta, [currentPos.x, currentPos.y, currentPos.z]);
  });

  return (
    <group ref={groupRef} position={position}>
      <LowPolyCharacter ref={characterRef} />
    </group>
  );
}

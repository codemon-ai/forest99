import { useRef, useEffect, useCallback, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import LowPolyCharacter from '../lowpoly/LowPolyCharacter';
import { usePlayerStore } from '../../stores/playerStore';
import { useGameStore } from '../../stores/gameStore';
import { useCombatStore } from '../../stores/combatStore';
import { useResourceStore } from '../../stores/resourceStore';
import { useInventoryStore } from '../../stores/inventoryStore';
import { useEventStore } from '../../stores/eventStore';
import { useTutorialStore } from '../../stores/tutorialStore';
import { useControls } from '../../hooks/useControls';
import { useDeviceDetect } from '../../hooks/useDeviceDetect';
import { getTerrainHeight } from '../../utils/noise';
import { resolveCollision } from '../../systems/CollisionSystem';
import { updateSurvival } from '../../systems/SurvivalSystem';
import { GAME_CONFIG } from '../../data/config';

const MOVE_SPEED = 5;
const RUN_MULTIPLIER = 1.8;
const JUMP_FORCE = 8;
const GRAVITY = 20;
const ROTATION_SPEED = 3;
const HARVEST_RANGE = 3;

export default function Player() {
  const groupRef = useRef();
  const characterRef = useRef();
  const velocityY = useRef(0);
  const playerFacing = useRef(0);
  const lastInteract = useRef(0);
  const touchStartRef = useRef(null);
  const keys = useControls();
  const { camera } = useThree();
  const { isTouchDevice } = useDeviceDetect();
  
  const position = usePlayerStore((state) => state.position);
  const sanity = usePlayerStore((state) => state.sanity);
  const isAttacking = usePlayerStore((state) => state.isAttacking);
  const setPosition = usePlayerStore((state) => state.setPosition);
  const setIsMoving = usePlayerStore((state) => state.setIsMoving);
  const setIsRunning = usePlayerStore((state) => state.setIsRunning);
  const attack = usePlayerStore((state) => state.attack);
  const updateCooldown = usePlayerStore((state) => state.updateCooldown);
  const getAttackDamage = usePlayerStore((state) => state.getAttackDamage);
  const getAttackRange = usePlayerStore((state) => state.getAttackRange);
  
  const getClosestMonsterInRange = useCombatStore((state) => state.getClosestMonsterInRange);
  const damageMonster = useCombatStore((state) => state.damageMonster);
  const setCurrentTarget = useCombatStore((state) => state.setCurrentTarget);
  
  const findNearestResource = useResourceStore((state) => state.findNearestResource);
  const harvestResource = useResourceStore((state) => state.harvestResource);
  const setNearbyResource = useResourceStore((state) => state.setNearbyResource);
  
  const generateResourceDrops = useInventoryStore((state) => state.generateResourceDrops);
  const isInventoryOpen = useInventoryStore((state) => state.isOpen);
  const isCraftingOpen = useInventoryStore((state) => state.isCraftingOpen);
  
  const isPaused = useGameStore((state) => state.isPaused);
  
  const getEventEffects = useEventStore((state) => state.getEffects);

  const cameraAngle = useRef(0);
  const cameraPitch = useRef(0.5);
  const smoothCameraY = useRef(3);
  
  const [isMovingLocal, setIsMovingLocal] = useState(false);
  const [isRunningLocal, setIsRunningLocal] = useState(false);
  const [isHarvesting, setIsHarvesting] = useState(false);
  
  const hasMoved = useRef(false);
  const hasRotated = useRef(false);
  const hasJumped = useRef(false);
  const hasAttacked = useRef(false);
  
  const handleAttack = useCallback(() => {
    if (!groupRef.current) return;
    
    const didAttack = attack();
    if (!didAttack) return;
    
    if (!hasAttacked.current) {
      hasAttacked.current = true;
      useTutorialStore.getState().completeCondition('playerAttacked');
    }
    
    const pos = groupRef.current.position;
    const playerPos = [pos.x, pos.y, pos.z];
    const range = getAttackRange();
    const damage = getAttackDamage();
    
    const target = getClosestMonsterInRange(playerPos, range, playerFacing.current);
    if (target) {
      setCurrentTarget(target.id);
      damageMonster(target.id, damage, playerPos);
    }
  }, [attack, getAttackRange, getAttackDamage, getClosestMonsterInRange, damageMonster, setCurrentTarget]);
  
  const handleHarvest = useCallback(() => {
    if (!groupRef.current) return;
    
    const now = Date.now();
    if (now - lastInteract.current < 500) return;
    lastInteract.current = now;
    
    const pos = groupRef.current.position;
    const playerPos = [pos.x, pos.y, pos.z];
    
    const nearestResource = findNearestResource(playerPos, HARVEST_RANGE);
    if (nearestResource) {
      setIsHarvesting(true);
      setTimeout(() => setIsHarvesting(false), 300);
      
      const resourceType = harvestResource(nearestResource.id);
      if (resourceType) {
        setTimeout(() => generateResourceDrops(resourceType), 300);
      }
    }
  }, [findNearestResource, harvestResource, generateResourceDrops]);
  
   useEffect(() => {
     const handleMouseMove = (e) => {
       if (document.pointerLockElement) {
         cameraAngle.current -= e.movementX * 0.002;
         cameraPitch.current = Math.max(0.1, Math.min(1.2, 
           cameraPitch.current - e.movementY * 0.002
         ));
         
         if (!hasRotated.current) {
           hasRotated.current = true;
           useTutorialStore.getState().completeCondition('cameraRotated');
         }
       }
     };
     
     const handleClick = (e) => {
       if (isInventoryOpen || isCraftingOpen) return;
       
       if (document.pointerLockElement) {
         handleAttack();
       } else {
         document.body.requestPointerLock();
       }
     };
     
     const handleTouchStart = (e) => {
       if (!isTouchDevice) return;
       
       // Ignore touches on UI elements (joystick, buttons)
       const target = e.target;
       if (target.closest('.virtual-joystick') || target.closest('.touch-buttons')) {
         return;
       }
       
       touchStartRef.current = {
         x: e.touches[0].clientX,
         y: e.touches[0].clientY
       };
     };
     
      const handleTouchMove = (e) => {
        if (!touchStartRef.current) return;
        
        const dx = e.touches[0].clientX - touchStartRef.current.x;
        const dy = e.touches[0].clientY - touchStartRef.current.y;
        
        cameraAngle.current -= dx * 0.002;
        cameraPitch.current = Math.max(0.1, Math.min(1.2, 
          cameraPitch.current - dy * 0.002
        ));
        
        if (!hasRotated.current) {
          hasRotated.current = true;
          useTutorialStore.getState().completeCondition('cameraRotated');
        }
        
        touchStartRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        };
      };
     
     const handleTouchEnd = () => {
       touchStartRef.current = null;
     };
     
     window.addEventListener('mousemove', handleMouseMove);
     window.addEventListener('click', handleClick);
     
     if (isTouchDevice) {
       window.addEventListener('touchstart', handleTouchStart);
       window.addEventListener('touchmove', handleTouchMove);
       window.addEventListener('touchend', handleTouchEnd);
     }
     
     return () => {
       window.removeEventListener('mousemove', handleMouseMove);
       window.removeEventListener('click', handleClick);
       if (isTouchDevice) {
         window.removeEventListener('touchstart', handleTouchStart);
         window.removeEventListener('touchmove', handleTouchMove);
         window.removeEventListener('touchend', handleTouchEnd);
       }
     };
   }, [handleAttack, isInventoryOpen, isCraftingOpen, isTouchDevice]);

   useFrame((_, delta) => {
     if (!groupRef.current) return;
     
     if (isPaused || isInventoryOpen || isCraftingOpen) return;
     
     updateCooldown(delta);
     
     if (keys.touchButtons && keys.touchButtons.attack) {
       handleAttack();
     }
    
    const currentPos = groupRef.current.position;
    const playerPos = [currentPos.x, currentPos.y, currentPos.z];
    
    const nearbyResource = findNearestResource(playerPos, HARVEST_RANGE);
    setNearbyResource(nearbyResource);
    
    if (keys.current.interact) {
      handleHarvest();
    }
    
    const moveDirection = new THREE.Vector3();
    
    if (keys.current.forward) moveDirection.z -= 1;
    if (keys.current.backward) moveDirection.z += 1;
    if (keys.current.left) moveDirection.x -= 1;
    if (keys.current.right) moveDirection.x += 1;
    
     const isMoving = moveDirection.length() > 0;
     const isRunning = keys.current.run && isMoving;
     setIsMoving(isMoving);
     setIsRunning(isRunning);
     setIsMovingLocal(isMoving);
     setIsRunningLocal(isRunning);
     
     if (isMoving && !hasMoved.current) {
       hasMoved.current = true;
       useTutorialStore.getState().completeCondition('playerMoved');
     }
    
    const eventEffects = getEventEffects();
    
    if (isMoving) {
      moveDirection.normalize();
      
      moveDirection.applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        cameraAngle.current
      );
      
      const currentHeight = getTerrainHeight(currentPos.x, currentPos.z);
      const aheadHeight = getTerrainHeight(
        currentPos.x + moveDirection.x * 0.5,
        currentPos.z + moveDirection.z * 0.5
      );
      const slope = (aheadHeight - currentHeight) / 0.5;
      const slopeModifier = slope > 0 ? Math.max(0.5, 1 - slope * 0.5) : Math.min(1.3, 1 - slope * 0.3);
      
      const baseSpeed = MOVE_SPEED * (isRunning ? RUN_MULTIPLIER : 1);
      const speed = baseSpeed * eventEffects.moveSpeedMultiplier * slopeModifier;
      
      let newX = currentPos.x + moveDirection.x * speed * delta;
      let newZ = currentPos.z + moveDirection.z * speed * delta;
      
      const halfSize = GAME_CONFIG.worldSize / 2 - 2;
      newX = Math.max(-halfSize, Math.min(halfSize, newX));
      newZ = Math.max(-halfSize, Math.min(halfSize, newZ));
      
      currentPos.x = newX;
      currentPos.z = newZ;
      
      const targetRotation = Math.atan2(moveDirection.x, moveDirection.z);
      playerFacing.current = targetRotation;
      
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
      
      if (!hasJumped.current) {
        hasJumped.current = true;
        useTutorialStore.getState().completeCondition('playerJumped');
      }
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
    const targetCameraY = currentPos.y + cameraHeight;
    smoothCameraY.current += (targetCameraY - smoothCameraY.current) * Math.min(1, delta * 5);
    
    camera.position.x = currentPos.x + Math.sin(cameraAngle.current) * cameraDistance;
    camera.position.z = currentPos.z + Math.cos(cameraAngle.current) * cameraDistance;
    camera.position.y = smoothCameraY.current;
    
    camera.lookAt(currentPos.x, currentPos.y + 1, currentPos.z);
    
    let shakeIntensity = 0;
    
    if (sanity <= 25) {
      shakeIntensity += ((25 - sanity) / 25) * 0.05;
    }
    
    if (eventEffects.cameraShake > 0) {
      shakeIntensity += eventEffects.cameraShake;
    }
    
    if (shakeIntensity > 0) {
      camera.position.x += (Math.random() - 0.5) * shakeIntensity;
      camera.position.y += (Math.random() - 0.5) * shakeIntensity;
    }
    
    updateSurvival(delta, [currentPos.x, currentPos.y, currentPos.z], eventEffects.sanityDrain);
  });

  return (
    <group ref={groupRef} position={position}>
      <LowPolyCharacter 
        ref={characterRef} 
        isAttacking={isAttacking}
        isMoving={isMovingLocal}
        isRunning={isRunningLocal}
        isHarvesting={isHarvesting}
      />
    </group>
  );
}

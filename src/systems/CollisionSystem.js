import * as THREE from 'three';

const colliders = [];

export function registerCollider(position, radius, type = 'solid') {
  const id = colliders.length;
  colliders.push({ id, position, radius, type });
  return id;
}

export function unregisterCollider(id) {
  const index = colliders.findIndex(c => c.id === id);
  if (index !== -1) {
    colliders.splice(index, 1);
  }
}

export function checkCollision(position, radius = 0.3) {
  for (const collider of colliders) {
    const dx = position.x - collider.position[0];
    const dz = position.z - collider.position[2];
    const distance = Math.sqrt(dx * dx + dz * dz);
    
    if (distance < radius + collider.radius) {
      return {
        collided: true,
        collider,
        pushDirection: new THREE.Vector3(dx, 0, dz).normalize(),
        overlap: radius + collider.radius - distance,
      };
    }
  }
  
  return { collided: false };
}

export function resolveCollision(position, radius = 0.3) {
  const result = checkCollision(position, radius);
  
  if (result.collided) {
    position.x += result.pushDirection.x * result.overlap;
    position.z += result.pushDirection.z * result.overlap;
  }
  
  return result.collided;
}

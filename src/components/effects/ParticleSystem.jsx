import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function FireParticles({ position, count = 30, size = 0.15 }) {
  const particlesRef = useRef();
  const velocitiesRef = useRef([]);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    velocitiesRef.current = [];
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.3;
      positions[i * 3 + 1] = Math.random() * 0.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
      
      const t = Math.random();
      colors[i * 3] = 1.0;
      colors[i * 3 + 1] = 0.3 + t * 0.5;
      colors[i * 3 + 2] = 0.0;
      
      sizes[i] = size * (0.5 + Math.random() * 0.5);
      
      velocitiesRef.current.push({
        x: (Math.random() - 0.5) * 0.02,
        y: 0.02 + Math.random() * 0.03,
        z: (Math.random() - 0.5) * 0.02,
        life: Math.random(),
      });
    }
    
    return { positions, colors, sizes };
  }, [count, size]);
  
  useFrame((_, delta) => {
    if (!particlesRef.current) return;
    
    const positions = particlesRef.current.geometry.attributes.position.array;
    const velocities = velocitiesRef.current;
    
    for (let i = 0; i < count; i++) {
      velocities[i].life -= delta * 2;
      
      if (velocities[i].life <= 0) {
        positions[i * 3] = (Math.random() - 0.5) * 0.3;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
        velocities[i].life = 1;
      } else {
        positions[i * 3] += velocities[i].x;
        positions[i * 3 + 1] += velocities[i].y;
        positions[i * 3 + 2] += velocities[i].z;
      }
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });
  
  return (
    <points ref={particlesRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export function DustParticles({ position, active, count = 15 }) {
  const particlesRef = useRef();
  const dataRef = useRef({ particles: [], initialized: false });
  
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    dataRef.current.particles = [];
    for (let i = 0; i < count; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
      sizes[i] = 0.05 + Math.random() * 0.05;
      dataRef.current.particles.push({ life: 0, vx: 0, vy: 0, vz: 0 });
    }
    dataRef.current.initialized = true;
    
    return { positions, sizes };
  }, [count]);
  
  useFrame((_, delta) => {
    if (!particlesRef.current || !dataRef.current.initialized) return;
    
    const positions = particlesRef.current.geometry.attributes.position.array;
    const particles = dataRef.current.particles;
    
    for (let i = 0; i < count; i++) {
      if (particles[i].life > 0) {
        particles[i].life -= delta * 3;
        positions[i * 3] += particles[i].vx * delta;
        positions[i * 3 + 1] += particles[i].vy * delta;
        positions[i * 3 + 2] += particles[i].vz * delta;
        particles[i].vy -= delta * 2;
      } else if (active) {
        positions[i * 3] = (Math.random() - 0.5) * 0.5;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
        particles[i].life = 0.5 + Math.random() * 0.3;
        particles[i].vx = (Math.random() - 0.5) * 2;
        particles[i].vy = 0.5 + Math.random();
        particles[i].vz = (Math.random() - 0.5) * 2;
      }
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });
  
  return (
    <points ref={particlesRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={geometry.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#8B7355"
        transparent
        opacity={0.6}
        depthWrite={false}
      />
    </points>
  );
}

export function HitSparks({ position, active, onComplete }) {
  const particlesRef = useRef();
  const dataRef = useRef({ particles: [], startTime: 0 });
  const count = 20;
  
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    dataRef.current.particles = [];
    for (let i = 0; i < count; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
      colors[i * 3] = 1.0;
      colors[i * 3 + 1] = 0.8;
      colors[i * 3 + 2] = 0.2;
      
      const angle = (Math.PI * 2 / count) * i + Math.random() * 0.5;
      const speed = 2 + Math.random() * 3;
      dataRef.current.particles.push({
        vx: Math.cos(angle) * speed,
        vy: 1 + Math.random() * 2,
        vz: Math.sin(angle) * speed,
        life: 0,
      });
    }
    
    return { positions, colors };
  }, []);
  
  useFrame((state, delta) => {
    if (!particlesRef.current) return;
    
    const positions = particlesRef.current.geometry.attributes.position.array;
    const particles = dataRef.current.particles;
    
    if (active && dataRef.current.startTime === 0) {
      dataRef.current.startTime = state.clock.elapsedTime;
      for (let i = 0; i < count; i++) {
        positions[i * 3] = 0;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = 0;
        particles[i].life = 0.3 + Math.random() * 0.2;
      }
    }
    
    let allDead = true;
    for (let i = 0; i < count; i++) {
      if (particles[i].life > 0) {
        allDead = false;
        particles[i].life -= delta;
        positions[i * 3] += particles[i].vx * delta;
        positions[i * 3 + 1] += particles[i].vy * delta;
        positions[i * 3 + 2] += particles[i].vz * delta;
        particles[i].vy -= delta * 10;
      }
    }
    
    if (allDead && dataRef.current.startTime > 0) {
      dataRef.current.startTime = 0;
      if (onComplete) onComplete();
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });
  
  if (!active && dataRef.current.startTime === 0) return null;
  
  return (
    <points ref={particlesRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={geometry.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={geometry.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        vertexColors
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export function HealingParticles({ position, active }) {
  const particlesRef = useRef();
  const count = 25;
  
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i;
      const radius = 0.3 + Math.random() * 0.3;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.random() * 0.2;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      
      colors[i * 3] = 0.2;
      colors[i * 3 + 1] = 1.0;
      colors[i * 3 + 2] = 0.4;
    }
    
    return { positions, colors };
  }, []);
  
  useFrame((state) => {
    if (!particlesRef.current || !active) return;
    
    const positions = particlesRef.current.geometry.attributes.position.array;
    const time = state.clock.elapsedTime * 3;
    
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + time * 0.5;
      const radius = 0.3 + Math.sin(time + i) * 0.1;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.sin(time * 2 + i * 0.5) + 1) * 0.5;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });
  
  if (!active) return null;
  
  return (
    <points ref={particlesRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={geometry.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={geometry.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export function ItemGlow({ position }) {
  const particlesRef = useRef();
  const count = 8;
  
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i;
      positions[i * 3] = Math.cos(angle) * 0.2;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = Math.sin(angle) * 0.2;
    }
    return { positions };
  }, []);
  
  useFrame((state) => {
    if (!particlesRef.current) return;
    
    const positions = particlesRef.current.geometry.attributes.position.array;
    const time = state.clock.elapsedTime * 2;
    
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + time;
      positions[i * 3] = Math.cos(angle) * 0.2;
      positions[i * 3 + 1] = Math.sin(time * 3 + i) * 0.1 + 0.2;
      positions[i * 3 + 2] = Math.sin(angle) * 0.2;
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });
  
  return (
    <points ref={particlesRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={geometry.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#FFD700"
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

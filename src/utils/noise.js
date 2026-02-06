import { createNoise2D } from 'simplex-noise';

const noise2D = createNoise2D();

export function getTerrainHeight(x, z, scale = 0.05, amplitude = 2) {
  return noise2D(x * scale, z * scale) * amplitude;
}

export function getRandomPosition(mapSize, margin = 5) {
  const halfSize = mapSize / 2 - margin;
  return [
    (Math.random() - 0.5) * 2 * halfSize,
    0,
    (Math.random() - 0.5) * 2 * halfSize,
  ];
}

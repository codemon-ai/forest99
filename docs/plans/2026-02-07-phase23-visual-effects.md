# Phase 23: 시각 효과 (Visual Effects)

## Overview
파티클 시스템, 포스트 프로세싱, 셰이더 효과로 비주얼 향상.

## Particle Effects

| 효과 | 적용 대상 |
|------|-----------|
| 불꽃 | 횃불, 캠프파이어 |
| 먼지 | 이동, 착지 |
| 피격 스파크 | 몬스터 피격 |
| 아이템 반짝임 | 드롭 아이템 |
| 치유 빛 | HP 회복 |

## Post-Processing

| 효과 | 적용 조건 |
|------|-----------|
| Bloom | 광원 주변 |
| Vignette | 저체력, 저정신력 |
| Color Grading | 밤/낮, 이벤트별 색조 |
| Motion Blur | 달리기 |

## Files to Create

| 파일 | 설명 |
|------|------|
| `src/components/effects/ParticleSystem.jsx` | 파티클 시스템 |
| `src/components/effects/PostProcessing.jsx` | 후처리 효과 |
| `src/shaders/` | 커스텀 셰이더 |

## Dependencies

```bash
npm install @react-three/postprocessing
```

## Status
- [x] 구현 완료 (2026-02-08)

## Implementation Notes

### Created Files
- `src/components/effects/ParticleSystem.jsx` - 파티클 시스템
  - FireParticles: 불꽃 파티클 (횃불, 캠프파이어)
  - DustParticles: 먼지 파티클 (이동, 착지)
  - HitSparks: 피격 스파크 (몬스터 피격)
  - HealingParticles: 치유 빛 (HP 회복)
  - ItemGlow: 아이템 반짝임 (드롭 아이템)
- `src/components/effects/PostProcessing.jsx` - 후처리 효과
  - Bloom: 광원 주변 발광
  - Vignette: 저체력/저정신력 시 화면 어둡게
  - ChromaticAberration: 정신력 30% 이하 시 색수차

### Modified Files
- `src/components/game/World.jsx` - PostProcessing 통합

### Dependencies Added
- `@react-three/postprocessing@2.16.2`

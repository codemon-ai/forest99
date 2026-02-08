# Phase 24: 성능 최적화 (Performance Optimization)

## Overview
LOD, 청크 로딩, 인스턴싱으로 성능 향상. 특히 모바일 최적화.

## Optimization Techniques

### 1. Level of Detail (LOD)
- 거리에 따른 메시 품질 조절
- 나무, 바위 등 대량 오브젝트에 적용

### 2. Frustum Culling
- 카메라 시야 밖 오브젝트 렌더링 제외

### 3. Instanced Rendering
- 동일 오브젝트 일괄 렌더링
- 나무, 풀, 바위에 적용

### 4. Chunk Loading
- 맵을 청크로 분할
- 플레이어 근처 청크만 로드

### 5. Texture Optimization
- 텍스처 압축 (WebP, AVIF)
- 밉맵 적용

## Targets

| 디바이스 | 목표 FPS |
|----------|----------|
| 데스크톱 | 60 FPS |
| 태블릿 | 30 FPS |
| 모바일 | 30 FPS |

## Files to Modify

| 파일 | 변경 |
|------|------|
| `src/components/game/Terrain.jsx` | 청크 시스템 |
| `src/components/game/Environment.jsx` | LOD, 인스턴싱 |
| `vite.config.js` | 번들 최적화 |

## Status
- [x] 구현 완료 (2026-02-08)

## Implementation Notes

### Created Files
- `src/systems/PerformanceManager.js` - 성능 관리 시스템
  - QUALITY_PRESETS (LOW/MEDIUM/HIGH)
  - 자동 품질 조절 (FPS 기반)
  - 디바이스 감지 (모바일/저사양)
- `src/components/game/InstancedForest.jsx` - 인스턴스드 렌더링 나무

### Modified Files
- `vite.config.js` - 코드 스플리팅 (manualChunks)
  - vendor-three (666KB)
  - vendor-react-three (385KB)
  - vendor-postprocessing (70KB)
  - vendor-audio (36KB)
- `src/components/game/World.jsx` - InstancedForest 사용
- `src/components/effects/PostProcessing.jsx` - 품질 설정 적용

### Performance Improvements
- 코드 스플리팅으로 초기 로드 최적화
- 인스턴스드 렌더링으로 드로우콜 감소
- 거리 기반 컬링 (drawDistance)
- 품질 프리셋 (모바일/데스크톱)

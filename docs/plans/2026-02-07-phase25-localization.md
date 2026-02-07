# Phase 25: 다국어 지원 (Localization)

## Overview
한국어/영어 전환 지원. i18n 라이브러리 도입.

## Supported Languages

| 언어 | 코드 | 기본 |
|------|------|------|
| 한국어 | ko | ✅ |
| English | en | |

## Files to Create

| 파일 | 설명 |
|------|------|
| `src/i18n/index.js` | i18n 설정 |
| `src/i18n/locales/ko.json` | 한국어 번역 |
| `src/i18n/locales/en.json` | 영어 번역 |
| `src/hooks/useTranslation.js` | 번역 훅 |

## Translation Scope

| 카테고리 | 예시 |
|----------|------|
| UI | 메뉴, 버튼, HUD |
| 아이템 | 이름, 설명 |
| 몬스터 | 이름 |
| 이벤트 | 알림 메시지 |
| 튜토리얼 | 가이드 텍스트 |

## Files to Modify

| 파일 | 변경 |
|------|------|
| `App.jsx` | i18n Provider |
| `MainMenu.jsx` | 언어 선택 옵션 |
| 모든 UI 컴포넌트 | t() 함수 적용 |

## Dependencies

```bash
npm install i18next react-i18next
```

## Status
- [ ] 미구현

# BatteryLab Dashboard

이차전지(배터리) 실험 데이터를 조회하고 분석할 수 있는 웹 기반 대시보드입니다.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![ECharts](https://img.shields.io/badge/ECharts-6-AA344D)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)

## 주요 기능

- **실험 목록 조회** — 전체 실험 데이터를 테이블로 확인
- **검색 및 필터** — 배터리 타입, 온도 범위, 충전 조건, 상태 등 다중 필터 지원
- **실험 상세 분석** — 충전/방전 용량 변화, 효율-온도 상관관계 차트 제공
- **비교 분석** — 최대 8개 실험을 선택하여 동일 차트에서 오버레이 비교

## 페이지 구조

| 경로 | 설명 |
|---|---|
| `/experiments` | 실험 리스트 — 필터링, 정렬, 검색 |
| `/experiments/:id` | 실험 상세 — 데이터 테이블 + 시각화 차트 |
| `/compare` | 비교 분석 — 다중 실험 오버레이 차트 |

## 차트 구성

### Capacity vs Cycle (용량 변화)
- **X축**: 사이클 번호
- **Y축**: 용량 (mAh)
- 충전/방전 용량의 사이클별 열화 추이 확인

### Efficiency & Temperature (효율-온도 상관관계)
- **X축**: 사이클 번호
- **좌측 Y축**: 충방전 효율 (%)
- **우측 Y축**: 셀 온도 (°C)
- Dual Y-axis를 활용한 두 지표 간 상관관계 분석

## 기술 스택

| 분류 | 기술 |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 8 |
| 차트 | ECharts 6 (echarts-for-react) |
| 스타일 | Tailwind CSS 3 + shadcn/ui |
| 라우팅 | React Router 6 |
| 상태 관리 | TanStack React Query |

## 프로젝트 구조

```
src/
├── components/        # 공통 UI 컴포넌트
│   ├── ui/            # shadcn/ui 기반 컴포넌트
│   ├── AppSidebar.tsx
│   ├── DashboardLayout.tsx
│   ├── FilterTag.tsx
│   └── StatusBadge.tsx
├── pages/
│   ├── ExperimentsPage.tsx      # 실험 목록
│   ├── ExperimentDetailPage.tsx  # 실험 상세
│   └── ComparePage.tsx           # 비교 분석
├── data/
│   └── mockData.ts    # Mock 실험 데이터
└── hooks/             # 커스텀 훅
```

## 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

## 라이선스

MIT

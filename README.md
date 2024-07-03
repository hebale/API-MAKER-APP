## API-MAKER-APP

JSON 데이터 기반 API 생성 관리 앱

### 콘셉트

backend API 개발에 종속적인 frontend 개발 환경을 개선하기 위한 APP으로 API 통신 시 주고받는 정보들을 JSON 파일로 만들어 관리, 웹을 통한 조작(API 등록&설정), 협업자와 공유로 개발 생산성을 높이는 것에 기여함

### 실행

```bash
# node v20.11.1
npm -i -g pnpm # pnpm 패키지 메니저 설치
pnpm install
pnpm dev # 화면 UI 서버
pnpm start # api서버 & 화면 UI서버

# http://localhost:8080
```

### 폴더구조

작업환경 폴더구조 정보도

```bash
json-api
├── public # 빌드 경로
└── src
    ├── api # tanstack query API 목록
    ├── assets # 리소스 폴더(font, image, scss 등)
    ├── components # 기능 구조 컴포넌트
    │   ├── ApiBox # API 리스트
    │   ├── CreateBox # API 생성
    │   ├── LogBox # SSE 로그
    │   ├── PipelineBox # 파이프라인
    │   └── SearchBar.tsx # 검색바
    ├── config # webpack 설정 config 파일
    │   └── webpack.config.cjs
    ├── contexts # Context 훅 프로바이더(Alert, Dialog, Log, Modal, Query)
    ├── dialog # 일반적인 정보표시 모달
    │   └── EdidtApiDialog # JSON API 수정모달
    ├── feature # 최소 기능 단위 구조
    │   ├── Alerts.tsx
    │   ├── CopyButton.tsx
    │   ├── Dialogs.tsx
    │   ├── DownloadButton.tsx
    │   ├── DropBox.tsx # 파일 드래그&드롭
    │   ├── MapInput.tsx # key:value 구조의 입력인풋
    │   ├── Modals.tsx
    │   ├── Monaco.tsx
    │   ├── RefreshButton.tsx
    │   ├── SaveButton.tsx
    │   └── Viewer.tsx # Monaco 뷰어
    ├── hooks # Contexts 연결 훅
    │   ├── useAlert.ts
    │   ├── useDialog.ts
    │   └── useModal.ts
    ├── json # API 데이터 저장경로(JSON 타입)
    │   └── ...
    ├── layout # 화면 레이아웃 구성
    ├── loader # express 초기로더 모음 [nodejs]
    ├── router # 라우터
    ├── schema # JSON 파일 스키마 정의
    ├── service # API 서비스 모델 [nodejs]
    │   ├── api.cjs
    │   ├── error.cjs
    │   ├── index.cjs
    │   └── json.cjs
    ├── theme # Mui 공통 테마 설정
    ├── types # typescript 타입정의
    ├── utils # 공통사용 유틸
    │   └── index.ts
    ├── app.cjs # node server 진입점
    └── index.tsx # react 진입점
```

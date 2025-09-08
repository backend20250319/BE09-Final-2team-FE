# Momnect Frontend

> **Momnect** 중고 육아용품 거래 플랫폼의 프론트엔드 애플리케이션입니다.

Next.js 15와 React 19를 기반으로 한 모던 웹 애플리케이션으로, 사용자 친화적인 인터페이스를 제공합니다.

## 🚀 기술 스택

### Core Framework

- **Framework**: Next.js 15.4.5 (App Router)
- **UI Library**: React 19.1.0
- **Language**: JavaScript (ES6+)
- **Build Tool**: Turbopack (개발 모드)

### Styling & UI

- **CSS Framework**: Tailwind CSS 4.0
- **UI Components**: Radix UI (접근성 우선)
- **Icons**: Lucide React
- **Animation**: tw-animate-css

### State Management & Communication

- **State Management**: Zustand 5.0.7
- **HTTP Client**: Axios 1.11.0
- **Real-time Communication**:
  - Socket.io Client 4.8.1
  - STOMP + SockJS (WebSocket)
- **Form Handling**: React Hook Form (내장)

### Rich Text & Utilities

- **Rich Text Editor**: CKEditor 5
- **Address API**: React Daum Postcode
- **Utility Libraries**:
  - clsx (클래스명 조합)
  - tailwind-merge (Tailwind 클래스 병합)
  - class-variance-authority (컴포넌트 변형)

## 📁 프로젝트 구조

```
BE09-Final-2team-FE/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (user)/             # 사용자 관련 페이지 그룹
│   │   │   ├── login/          # 로그인
│   │   │   ├── signup/         # 회원가입
│   │   │   ├── mypage/         # 마이페이지
│   │   │   ├── profile-edit/   # 프로필 수정
│   │   │   ├── password-change/# 비밀번호 변경
│   │   │   ├── location-management/ # 거래지역 관리
│   │   │   ├── child-management/    # 자녀 관리
│   │   │   ├── withdrawal/          # 회원탈퇴
│   │   │   └── user-profile/        # 사용자 프로필
│   │   ├── chat/               # 채팅 기능
│   │   │   ├── components/     # 채팅 컴포넌트
│   │   │   ├── api/           # 채팅 API
│   │   │   └── page.jsx       # 채팅 메인 페이지
│   │   ├── product/            # 상품 관련
│   │   │   ├── form/          # 상품 등록/수정
│   │   │   ├── [id]/          # 상품 상세
│   │   │   └── page.jsx       # 상품 목록
│   │   ├── post/               # 게시글 관련
│   │   ├── review/             # 리뷰 관련
│   │   ├── main/               # 메인 페이지
│   │   ├── example/            # 예제 페이지 (개발용)
│   │   ├── loading/            # 로딩 페이지
│   │   ├── not-found.jsx       # 404 페이지
│   │   ├── layout.jsx          # 루트 레이아웃
│   │   └── page.jsx            # 홈페이지
│   ├── components/
│   │   ├── common/             # 공통 컴포넌트
│   │   │   ├── Header.jsx      # 헤더
│   │   │   ├── Footer.jsx      # 푸터
│   │   │   ├── Sidebar.jsx     # 사이드바
│   │   │   ├── ProductCard.jsx # 상품 카드
│   │   │   ├── WishlistSidebar.jsx # 위시리스트
│   │   │   └── ConfirmModal.jsx # 확인 모달
│   │   └── ui/                 # UI 컴포넌트 (Radix UI 기반)
│   │       ├── button.jsx      # 버튼 컴포넌트
│   │       ├── dialog.jsx      # 다이얼로그
│   │       ├── dropdown-menu.jsx # 드롭다운 메뉴
│   │       ├── tabs.jsx        # 탭 컴포넌트
│   │       └── scroll-area.jsx # 스크롤 영역
│   ├── lib/                    # 라이브러리 설정
│   │   ├── api.js              # Axios 설정 및 인터셉터
│   │   ├── websocketManager.js # WebSocket 관리
│   │   └── utils.js            # 유틸리티 함수
│   ├── store/                  # 상태 관리 (Zustand)
│   │   ├── userStore.js        # 사용자 상태
│   │   ├── categoryStore.js    # 카테고리 상태
│   │   ├── sidebarStore.js     # 사이드바 상태
│   │   └── mypageStore.js      # 마이페이지 상태
│   ├── hooks/                  # 커스텀 훅
│   │   └── useSidebar.js       # 사이드바 훅
│   ├── utils/                  # 유틸리티 함수
│   │   ├── format.js           # 포맷팅 함수
│   │   ├── profileImageUtils.js # 프로필 이미지 처리
│   │   ├── flattenCategoryNames.js # 카테고리 데이터 처리
│   │   └── groupCategoryData.js # 카테고리 그룹화
│   └── enums/                  # 열거형 상수
│       ├── ageGroup.js         # 연령대
│       ├── productStatus.js    # 상품 상태
│       ├── sortOption.js       # 정렬 옵션
│       └── tradeStatus.js      # 거래 상태
├── public/                     # 정적 파일
│   ├── fonts/                  # 폰트 파일
│   │   └── PretendardVariable.ttf
│   └── images/                 # 이미지 파일
│       ├── common/             # 공통 이미지
│       ├── main/               # 메인 페이지 이미지
│       └── product/            # 상품 관련 이미지
├── common-css/                 # 공통 CSS
│   ├── ProductCard.css         # 상품 카드 스타일
│   └── WishlistSidebar.css    # 위시리스트 스타일
├── components.json             # shadcn/ui 설정
├── next.config.mjs             # Next.js 설정
├── tailwind.config.js          # Tailwind CSS 설정
├── postcss.config.mjs          # PostCSS 설정
├── eslint.config.mjs           # ESLint 설정
├── jsconfig.json               # JavaScript 설정
├── package.json                # 의존성 관리
├── Dockerfile                  # Docker 설정
├── Dockerrun.aws.json          # AWS 배포 설정
└── README.md                   # 프로젝트 문서
```

## 🛠️ 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

> 💡 **빌드 준비 완료 시 진행**

### 3. 빌드

```bash
npm run build
```

### 4. 프로덕션 서버 실행

```bash
npm start
```

## 📖 주요 기능

### 1. 사용자 관리

- **회원가입/로그인**: JWT 기반 인증 시스템
- **프로필 관리**: 사용자 정보 수정, 프로필 이미지 업로드
- **자녀 정보 관리**: 자녀 연령대별 상품 추천
- **거래지역 관리**: 거래 가능 지역 설정
- **회원탈퇴**: 안전한 계정 삭제

### 2. 상품 관리

- **상품 등록/수정**: CKEditor를 활용한 상세 설명
- **상품 검색**: Elasticsearch 기반 고성능 검색
- **카테고리 분류**: 체계적인 상품 분류 시스템
- **이미지 업로드**: 다중 이미지 업로드 및 관리
- **상품 상태 관리**: 판매중, 예약중, 판매완료 상태 관리

### 3. 실시간 채팅

- **WebSocket 통신**: STOMP 프로토콜 기반 실시간 메시징
- **채팅방 관리**: 상품별 채팅방 생성 및 관리
- **메시지 히스토리**: 채팅 기록 저장 및 조회
- **읽음 상태**: 메시지 읽음/안읽음 상태 표시

### 4. 거래 관리

- **거래 요청**: 구매자-판매자 간 거래 요청
- **거래 상태 추적**: 거래 진행 상황 실시간 업데이트
- **리뷰 시스템**: 거래 완료 후 후기 작성
- **평점 관리**: 사용자 신뢰도 평가 시스템

### 5. 커뮤니티

- **게시판**: 자유게시판, 공지사항 등
- **게시글 작성**: CKEditor 기반 리치 텍스트 에디터
- **댓글 시스템**: 게시글 댓글 작성 및 관리
- **좋아요/북마크**: 관심 게시글 저장

### 6. 공통 기능

- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원
- **다크모드**: 사용자 선호에 따른 테마 변경
- **위시리스트**: 관심 상품 저장 및 관리
- **알림 시스템**: 실시간 알림 및 알림 히스토리

## 🔧 환경 설정

### API 설정

`src/lib/api.js`에서 API 기본 URL을 설정할 수 있습니다:

```javascript
baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
```

### 환경 변수

`.env.local` 파일을 생성하여 다음 환경 변수를 설정하세요:

```bash
# API 서버 URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# WebSocket 서버 URL
NEXT_PUBLIC_WS_URL=ws://localhost:8006

# 파일 서버 URL
NEXT_PUBLIC_FILE_URL=http://localhost:8007

# 개발 모드 설정
NODE_ENV=development
```

### WebSocket 설정

`src/lib/websocketManager.js`에서 WebSocket 연결을 관리합니다:

```javascript
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8006";
```

## 📝 개발 가이드

### 1. 새로운 페이지 추가

Next.js App Router를 사용하므로 `src/app/` 디렉토리 아래에 새로운 폴더를 생성하고 `page.jsx` 파일을 추가하세요:

```bash
src/app/new-page/
├── page.jsx          # 페이지 컴포넌트
├── loading.jsx       # 로딩 컴포넌트 (선택사항)
└── not-found.jsx     # 404 컴포넌트 (선택사항)
```

### 2. 컴포넌트 추가

- **공통 컴포넌트**: `src/components/common/`
- **UI 컴포넌트**: `src/components/ui/` (Radix UI 기반)

### 3. 상태 관리 (Zustand)

```javascript
import { create } from "zustand";

const useStore = create((set) => ({
  data: [],
  setData: (data) => set({ data }),
  clearData: () => set({ data: [] }),
}));

// 컴포넌트에서 사용
const { data, setData } = useStore();
```

### 4. API 호출

`src/lib/api.js`에서 설정된 axios 인스턴스를 사용하세요:

```javascript
import api from "@/lib/api";

// GET 요청
const response = await api.get("/api/products");

// POST 요청
const response = await api.post("/api/products", productData);

// 파일 업로드
const formData = new FormData();
formData.append("file", file);
const response = await api.post("/api/files/upload", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});
```

### 5. WebSocket 연결

```javascript
import { websocketManager } from "@/lib/websocketManager";

// 연결
websocketManager.connect();

// 메시지 전송
websocketManager.sendMessage("/app/chat.send", messageData);

// 메시지 구독
websocketManager.subscribe("/topic/chat", (message) => {
  console.log("Received message:", message);
});
```

### 6. 모달 사용

```javascript
import ConfirmModal, { MODAL_TYPES } from "@/components/common/ConfirmModal";

// 모달 상태 관리
const [modalOpen, setModalOpen] = useState(false);
const [modalConfig, setModalConfig] = useState({
  title: "제목",
  message: "메시지",
  type: MODAL_TYPES.CONFIRM_CANCEL,
  onConfirm: () => {
    // 확인 버튼 클릭 시 실행할 로직
    setModalOpen(false);
  },
  onCancel: () => {
    // 취소 버튼 클릭 시 실행할 로직
    setModalOpen(false);
  },
});
```

### 7. CKEditor 사용

```javascript
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const [content, setContent] = useState("");

<CKEditor
  editor={ClassicEditor}
  data={content}
  onChange={(event, editor) => {
    const data = editor.getData();
    setContent(data);
  }}
/>;
```

## 🎨 스타일링

### Tailwind CSS 4.0

프로젝트는 Tailwind CSS 4.0을 사용하여 유틸리티 퍼스트 방식으로 스타일링합니다:

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 커스텀 스타일 */
@layer components {
  .btn-primary {
    @apply bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded;
  }
}
```

### Radix UI 컴포넌트

접근성을 고려한 UI 컴포넌트를 사용합니다:

```javascript
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

<Button variant="default" size="lg">
  클릭하세요
</Button>;
```

## 📱 반응형 디자인

모든 컴포넌트는 모바일, 태블릿, 데스크톱을 지원하는 반응형으로 설계되었습니다:

```javascript
// Tailwind CSS 반응형 클래스 사용
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 모바일: 1열, 태블릿: 2열, 데스크톱: 3열 */}
</div>
```

## 🚀 배포

### GitHub Actions CI/CD (현재 사용 중)

프로젝트는 GitHub Actions를 통한 자동 배포를 사용합니다:

```yaml
# .github/workflows/frontend-deploy.yml
name: Frontend Deploy to Elastic Beanstalk

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-northeast-2

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Create .env file
        run: |
          echo "NEXT_PUBLIC_WEBSOCKET_URL=${{ secrets.NEXT_PUBLIC_WEBSOCKET_URL }}" >> .env
          echo "NEXT_PUBLIC_API_BASE_URL=${{ secrets.NEXT_PUBLIC_API_BASE_URL }}" >> .env
          echo "NEXT_PUBLIC_CHAT_API_URL=${{ secrets.NEXT_PUBLIC_CHAT_API_URL }}" >> .env
          echo "NEXT_PUBLIC_USER_API_URL=${{ secrets.NEXT_PUBLIC_USER_API_URL }}" >> .env
          echo "NEXT_PUBLIC_PRODUCT_API_URL=${{ secrets.NEXT_PUBLIC_PRODUCT_API_URL }}" >> .env
          echo "NEXT_PUBLIC_REVIEW_API_URL=${{ secrets.NEXT_PUBLIC_REVIEW_API_URL }}" >> .env
          echo "NEXT_PUBLIC_POST_API_URL=${{ secrets.NEXT_PUBLIC_POST_API_URL }}" >> .env

      - name: Build, Tag, and Push Docker image
        run: |
          IMAGE_REPO=${{ steps.login-ecr.outputs.registry }}/momnect-frontend
          IMAGE_TAG=latest
          docker build -t $IMAGE_REPO:$IMAGE_TAG .
          docker push $IMAGE_REPO:$IMAGE_TAG

      - name: Prepare Dockerrun.aws.json
        run: |
          sed -i "s|<AWS_ACCOUNT_ID>.dkr.ecr.ap-northeast-2.amazonaws.com/momnect-frontend:latest|${{ steps.login-ecr.outputs.registry }}/momnect-frontend:latest|g" Dockerrun.aws.json

      - name: Deploy to Elastic Beanstalk
        uses: einaregilsson/beanstalk-deploy@v22
        with:
          aws_access_key: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws_secret_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          application_name: momnect-frontend
          environment_name: momnect-frontend-env
          version_label: github-${{ github.run_id }}
          region: ap-northeast-2
          deployment_package: Dockerrun.aws.json
```

### 배포 과정

1. **코드 푸시**: `main` 브랜치에 코드가 푸시되면 자동으로 배포 시작
2. **Docker 이미지 빌드**: Next.js 애플리케이션을 Docker 이미지로 빌드
3. **ECR 푸시**: AWS ECR(Elastic Container Registry)에 이미지 업로드
4. **Elastic Beanstalk 배포**: ECR의 이미지를 사용하여 EB에 배포

### 로컬 Docker 테스트

```bash
# Docker 이미지 빌드
docker build -t momnect-frontend .

# 컨테이너 실행
docker run -p 3000:3000 momnect-frontend
```

### 환경 변수 설정

GitHub Secrets에 다음 환경 변수들을 설정해야 합니다:

- `AWS_ACCESS_KEY_ID`: AWS 액세스 키
- `AWS_SECRET_ACCESS_KEY`: AWS 시크릿 키
- `NEXT_PUBLIC_WEBSOCKET_URL`: WebSocket 서버 URL
- `NEXT_PUBLIC_API_BASE_URL`: API 기본 URL
- `NEXT_PUBLIC_CHAT_API_URL`: 채팅 API URL
- `NEXT_PUBLIC_USER_API_URL`: 사용자 API URL
- `NEXT_PUBLIC_PRODUCT_API_URL`: 상품 API URL
- `NEXT_PUBLIC_REVIEW_API_URL`: 리뷰 API URL
- `NEXT_PUBLIC_POST_API_URL`: 게시글 API URL

## 🧪 테스트

### 개발 환경 테스트

```bash
# 개발 서버 실행
npm run dev

# 브라우저에서 http://localhost:3000 접속
```

### 빌드 테스트

```bash
# 프로덕션 빌드
npm run build

# 빌드된 애플리케이션 실행
npm start
```

## 🔧 트러블슈팅

### 자주 발생하는 문제

1. **API 연결 오류**

   - `.env.local` 파일의 `NEXT_PUBLIC_API_URL` 확인
   - 백엔드 서버가 실행 중인지 확인

2. **WebSocket 연결 실패**

   - `NEXT_PUBLIC_WS_URL` 환경 변수 확인
   - WebSocket 서버 상태 확인

3. **빌드 오류**
   - Node.js 버전 확인 (18 이상)
   - `node_modules` 삭제 후 `npm install` 재실행

## 📊 성능 최적화

### 이미지 최적화

```javascript
import Image from "next/image";

<Image
  src="/images/product.jpg"
  alt="상품 이미지"
  width={300}
  height={200}
  priority // 중요한 이미지에 사용
/>;
```

### 코드 분할

```javascript
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <p>Loading...</p>,
});
```

## 🔗 관련 링크

- [Next.js 공식 문서](https://nextjs.org/docs)
- [React 19 문서](https://react.dev/)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [Radix UI 문서](https://www.radix-ui.com/)
- [Zustand 문서](https://zustand-demo.pmnd.rs/)
- [CKEditor 5 문서](https://ckeditor.com/docs/ckeditor5/latest/)
- [Socket.io 문서](https://socket.io/docs/)

## 📄 라이선스

이 프로젝트는 비공개 프로젝트입니다.

---

**Momnect Frontend** - 사용자 친화적인 중고 육아용품 거래 플랫폼 🍼👶

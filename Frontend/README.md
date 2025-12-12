## 📝 커밋 메시지 작성 규칙

- 작성 방법 : ```[카테고리]``` 작업 내용 요약

|카테고리	|설명|
|--|--|
|추가|	새로운 기능 추가
|수정|	기존 기능 수정, 버그 수정
|삭제|	불필요한 내용 삭제, 기능 삭제
|문서|	코드 편집X, 관련 문서 업로드 할 때
|테스트|	테스트 코드 작업 시
|환경|	빌드, 설정 파일 등 수정, DB 연결 작업

---

## ⚙️ 개발 환경 정보 (Environment)

| 항목          | 버전                      | 비고                               |
| ----------- | ----------------------- | -------------------------------- |
| **프레임워크** | React + Vite | SPA 환경 구성 |
| **언어** | TypeScript | 필요 시 TSX 사용 |
| **스타일** | Styled-Components | CSS-in-JS 방식 |
| **라우팅** | React Router DOM | 페이지 이동 및 SPA 라우팅 관리 |
| **패키지 매니저** | npm | package.json 기반 관리 |

---

## 💻 실행 방법

```bash
# 1. 레포지토리 복사
git clone https://github.com/YU-SE-25/Frontend.git

# 2. 프로젝트 폴더로 이동
cd Frontend

# 3. 의존성 다운로드 및 빌드

# 1) 전체 패키지 설치
npm install

# 2) 핵심 라이브러리 및 API 통신, 스타일링 패키지 설치
npm install axios styled-components

# 3) 개발 의존성 (TypeScript 타입 정의 파일) 설치
# styled-components와 axios를 TS 환경에서 사용하기 위한 타입 정의 파일입니다.
npm install -D @types/styled-components @types/axios

# 4. 서버 실행
npm run dev

# Software Design Specification (SDS)

---

## (Project Title)

UnIDE

---

## (Logo) - option

![image.png](image.png)

---

## (Team information: Student No, Name, E-mail)

노우현(PM) / 22012161 / nwh0326@yu.ac.kr

김형섭(FE) / 22112045 / felix0703@yu.ac.kr

전유진(FL) / 22112121 / zzzin18@yu.ac.kr

정석희(BL) / 22312049 / tjrgml8435@gmail.com

정보경(BE) / 22320549 / jbg33923@yu.ac.kr

---

## Revision History

| Revision date | Version # | Description | Author |
| --- | --- | --- | --- |
| MM/DD/YYYY | 0.00 | Type brief description here | Author name |
|  |  |  |  |
|  |  |  |  |

---

## Contents

1. Introduction
2. Use Case Analysis
3. Class diagram
4. Sequence diagram
5. State machiene diagram
6. User interface prototype
7. Implementation requirements
8. Glossary
9. References

---

## Authors by section

1. Introduction - 전유진
2. Use Case Analysis - 노우현, 정석희
3. Class diagram - 노우현, 정석희
4. Sequence diagram - 정보경
5. State machiene diagram
6. User interface prototype - 전유진
7. Implementation requirements - 전유진
8. Glossary
9. References

---

## 1. Introduction

본 문서는 우리 팀에서 개발하고자 하는 웹사이트인 ‘UnIDE’의 Software Design Specification(SDS)이다. 본 문서에서는 UnIDE를 위해 기존에 식별한 기능적 요구사항을 구현하기 위해 게임을 여러 관점에서 바라보고 설계한다.

Use case analysis는 사용자 관점에서 소프트웨어가 제공하는 기능을 서술했고 class diagram은 시스템의 구조적 관점, sequence diagram과 state machine diagram은 시스템의 동적 관점을 묘사했다. User interface는 사용자 인터페이스의 관점에서 시스템을 설계한다.

본 문서 작성 시 가장 중요하게 생각 한 점은 Diagram 간의 일관성이다. 여기서 작성된 모든 Diagram은 use casse를 기준으로 서로 모순되는 부분이 없도록 주의하여 작성했다. 또한 이전 단계에서 산출된 SRS 문서에 작성된 기능들이 빠짐없이 Diagram에 반영되어 작성되었는지를 확인하고 SRS 문서와 본 문서 간의 차이 또는 모순이 없도록 하였다.

UnIDE는 서버와 웹사이트로 이루어져 있다. 웹사이트의 개발 환경은 React 기반이며 Styled-Components를 사용하고,  TypeScript를 혼용한다. 서버는 Spring Boot로 구현되었으며, 데이터베이스로는 mySQL을 사용한다. 서버에 대한 설계는 주로 DB관점의 class diagram과 state machiene의 서버 파트에 간략히 설명되어 있다. 본 문서의 가장 중요한 부분은 인증 플로우 sequence diagram과 데이터 모델 class diagram이다. Use case analysis는 이후에 그려지는 거의 모든 UML diagram에 영향을 미칠 뿐 아니라 요구사항이 잘 반영되어 있는지 알 수 있으며 class diagram 은 구현 시에 가장 직접적인 영향을 끼칠 뿐만 아니라 시스템 구조 파악을 할 수 있게 도와준다. 본 문서는 문제 풀이와 커뮤니티 기능을 중심으로 각 Diagram을 다루었으며 상세 설명이 Description을 통해 서술되어 있다. 본 문서의 각 Diagram은 SRS 문서를 기반으로 사용자 요구사항 분석과 시스템 구현에 있어 시스템 구조를 쉽게 파악할 수 있도록 한다.

---

## 2. Use Case Analysis

본 장에서는 UnIDE 시스템의 Use case diagram과 Use case description을 제시한다. Use case diagram은 시스템의 전체 사용자 행위 흐름을 시각적으로 나타내며, 각 기능 간의 관계를 한눈에 파악할 수 있도록 구성하였다. diagram에 관한 주요 고려사항은 다음과 같다.

- 본 Use Case Diagram은 UnIDE 시스템의 전체 사용자 행위 흐름을 시각적으로 표현한 것이다.
- 시스템은 3개의 주요 엑터(User, Instructor, Administrator)와 7개의 상위 Use Case(AccountManagement, ProfileManagement, ProblemInteraction, CodeEvaluation, Community, StudyGroup, Administration)로 구성된다.
- 각 액터는 다음과 같은 목적을 가진다.
- Non_User(비회원)
    - 로그인하지 않은 사용자를 의미한다.
    - 계정 등록 및 로그인 등 기본적인 접근 기능을 사용할 수 있으며, 문제 목록 및 상세 조회 등 공개된 문제 열람 기능에 제한적으로 접근할 수 있다.
    - 시스템의 접근성과 유입률을 높이기 위한 진입 단계 사용자로, 회원가입을 통해 User 권한으로 전환될 수 있다.
- User (학습자)
    - 로그인 및 회원가입 후 문제를 탐색하고 풀이를 제출하며,다른 사용자의 풀이를 조회하거나 리뷰할 수 있다.
    - 또한 마이페이지(MyPage)를 통해 자신의 학습 진도, 풀이 이력, 성취도를 관리하고 공유할 수 있다.
    - 스터디 그룹에 가입하고, QnA 게시판 및 커뮤니티에 참여하며, 콘텐츠를 신고할 수 있다.
- Instructor (강사)
    - 문제 및 강의를 등록하고, 강의 콘텐츠를 관리한다.
    - Instructor는 일반 사용자보다 확장된 권한을 가지며, 자신의 포트폴리오 검수를 통해 인증 절차를 거친다.
- Administrator (관리자)
    - 시스템 전체의 운영을 담당하며, 사용자 관리(블랙리스트 등록, 계정 정지), 신고 처리, 문제 관리, 통계 확인 등의 기능을 수행한다.
    - 또한 비정상적인 접근이나 악성 사용자 행위를 제재하여 시스템의 안정성을 유지한다.
- 시스템의 주요 상위 Use Case는 다음과 같다.
    - UserManagement : 사용자 관리
    - Administration : 관리자 기능
    - ProblemManagement : 문제 관리
    - CodeEvaluation : 코드 채점 및 피드백
    - Performance Analysis : 성능 분석
    - Community : 커뮤니티 및 풀이 공유
    - LearningExapand : 학습 확장

![image.png](image%201.png)

[그림 2-1]은 UnIDE 시스템의 Use Case Diagram을 나타낸 것이다.

- 본 장의 이후 절에서는 각 상위 Use case를 중심으로, 세부 기능의 흐름과 시나리오를 구체적으로 기술한 Use Case Description을 제시한다.

(이미지 들어갈 공간)

| **Use case #1 : 회원가입** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 UnIDE 시스템에 새 계정(학습자 또는 강사)을 생성하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User(비회원) |
| **Preconditions** |  |  | 사용자가 UnIDE 웹 접속한 상태여야 한다. |
| **Trigger** |  |  | 사용자가 ‘회원가입’ 버튼을 누르고 계정 생성을 시작할 때 |
| **Success Post Condition** |  |  | 사용자의 계정이 생성되고 인증 완료 후 ‘활성(Active)’ 상태가 된다. |
| **Failed Post Condition** |  |  | 계정이 생성되지 않거나 ‘인증 대기(Pending)’ 상태로 남는다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자가 학습자(Learner)로 회원가입을 완료한다. |  |  |
| **1** | 사용자가 회원가입 페이지에서 ‘학습자’ 역할을 선택한다. |  |  |
| **2** | 사용자가 이메일, 비밀번호, 비밀번호 확인, 이름, 닉네임을 입력한다. |  |  |
| **3** | 시스템은 입력된 이메일과 닉네임의 중복 여부를 실시간으로 검사한다. |  |  |
| **4** | 시스템은 비밀번호가 보안 규칙(최소 8자, 대/소문자, 숫자 포함)을 만족하는지 검사한다. |  |  |
| **5** | 사용자가 약관 동의 및 개인정보 처리방침에 동의한다. |  |  |
| **6** | 사용자가 ‘가입하기’ 버튼을 누른다. |  |  |
| **7** | 시스템은 사용자 정보를 DB에 저장하고, 입력된 이메일로 인증 링크를 발송한다. |  |  |
| **8** | 사용자가 이메일을 확인하고 인증 링크를 클릭한다. |  |  |
| **9** | 시스템이 이메일 인증을 확인하고, DB의 계정 상태를 ‘활성(Active)’으로 변경한다. |  |  |
| **10** | 시스템이 회원가입 완료 및 환영 메시지를 표시하고 로그인 페이지로 이동시킨다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **1** | 1a. 강사(Instructor) 역할 선택 |
...1a1. 사용자가 ‘강사’ 역할을 선택한다. 
...1a2. 시스템이 포트폴리오 제출을 요청한다.
...1a3. 사용자가 포트폴리오를 업로드하고, 2단계로 계속한다.
1b. 소셜 계정으로 회원가입
...1b1. 사용자가 ‘Google로 가입’ 또는 ‘Github로 가입’ 버튼을 누른다.
...1b2. Use Case #3 (소셜 로그인)의 2단계로 이동한다. |  |  |
| **3** | 3a. 이메일 중복
...3a1. 시스템이 “이미 사용 중인 이메일입니다.” 메시지를 표시한다.
...3a2. 2단계로 돌아간다.
.3b. 닉네임 중복
...3b1. 시스템이 “이미 사용 중인 닉네임입니다.” 메시지를 표시한다.
...3b2. 2단계로 돌아간다. |  |  |
| **4** | 4a. 비밀번호 규칙 불일치
...4a1. 시스템이 “비밀번호는 최소 8자 이상이며, 대/소문자와 숫자를 포함해야 합니다.” 메시지를 표시한다.
...4a2. 2단계로 돌아간다. |  |  |
| **5** | 5a. 약관 미동의
...5a1. ‘가입하기’ 버튼이 활성화되지 않는다. |  |  |
| **8** | 8a. 이메일 인증을 즉시 수행하지 않음
...8a1. 계정은 '인증 대기(Pending)' 상태로 DB에 저장되며, 로그인 시 인증을 요구한다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | 양식 제출 및 이메일 발송까지 ≤ 3 seconds |  |
| **Frequency** |  | 사용자당 1회 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #2 : 로그인** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 시스템에 등록된 사용자가 자신의 계정에 접근하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 사용자가 UnIDE 계정을 가지고 있고, ‘활성(Active)’ 상태여야 한다. |
| **Trigger** |  |  | 사용자가 로그인 페이지에서 자격 증명(이메일, 비밀번호)을 입력하고 ‘로그인’ 버튼을 누를 때 |
| **Success Post Condition** |  |  | 사용자가 인증되고, 시스템의 메인 서비스에 접근한다. |
| **Failed Post Condition** |  |  | 사용자 인증에 실패하고, 로그인 페이지에 머무른다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자가 이메일과 비밀번호로 성공적으로 로그인한다. |  |  |
| **1** | 사용자가 이메일과 비밀번호를 입력한다. |  |  |
| **1-1** | 사용자가 ‘로그인 상태 유지’를 선택한다. |  |  |
| **2** | 사용자가 ‘로그인’ 버튼을 누른다. |  |  |
| **3** | 시스템은 입력된 이메일과 비밀번호 해시를 DB의 정보와 비교하여 자격 증명을 검증한다. |  |  |
| **4** | 시스템이 인증에 성공하고, 사용자 세션(JWT 토큰)을 발급한다. |  |  |
| **5** | 시스템이 사용자의 최근 로그인 시각을 기록한다. |  |  |
| **6** | 시스템이 사용자를 메인 대시보드 화면으로 리디렉션한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **1** | 1a. 소셜 로그인 시도
...1a1. 사용자가 ‘Google로 로그인’ 또는 ‘Github로 로그인’ 버튼을 누른다.
...1a2. Use Case #3 (소셜 로그인)으로 이동한다.
1b. 비밀번호 재설정 시도
...1b1. 사용자가 ‘비밀번호 찾기’ 링크를 클릭한다.
...1b2. Use Case #5 (비밀번호 재설정)으로 이동한다. |  |  |
| **4** | 4a. 자격 증명 불일치 (이메일 또는 비밀번호 오류)
...4a1. 시스템이 “이메일 또는 비밀번호가 올바르지 않습니다.” 메시지를 표시한다.
...4a2. 시스템이 로그인 실패 횟수를 1 증가시킨다.
...4a3. 1단계로 돌아간다.
4b. 로그인 5회 연속 실패 (Brute Force 방지)
...4b1. 시스템이 "로그인 시도가 5회 실패하여 계정이 10분간 잠깁니다." 메시지를 표시한다.
...4b2. 시스템이 해당 계정을 10분간 '잠금(Suspended)' 상태로 변경하고 잠금 해제 시각을 기록한다.
4c. 인증 대기(Pending) 상태의 계정
...4c1. 시스템이 "이메일 인증이 필요합니다. 이메일을 확인해주세요." 메시지를 표시한다.
...4c2. 시스템이 인증 이메일을 재발송할 수 있는 버튼을 제공한다.
...4c3. 1단계로 돌아간다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 2 seconds |  |
| **Frequency** |  | 사용자당 세션별 1회 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #3 : 소셜 로그인** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 외부 인증 공급자(Google, Github)를 통해 시스템에 인증하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Secondary Actors** |  |  | Google/Github 인증 서버 |
| **Preconditions** |  |  | 사용자가 로그인 또는 회원가입 페이지에 있다. |
| **Trigger** |  |  | 사용자가 ‘Google로 로그인/가입’ 또는 ‘Github로 로그인/가입’ 버튼을 누를 때 |
| **Success Post Condition** |  |  | 사용자가 인증되고, 시스템의 메인 서비스에 접근한다. |
| **Failed Post Condition** |  |  | 인증에 실패하고, 로그인/회원가입 페이지에 머문다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자가 외부 공급자를 통해 성공적으로 로그인(또는 가입)한다. |  |  |
| **1** | 사용자가 ‘Google로 로그인’ 버튼을 누른다. |  |  |
| **2** | 시스템이 사용자를 Google 인증 페이지로 리디렉션한다. |  |  |
| **3** | 사용자가 Google 계정으로 로그인하고 UnIDE에 대한 정보 제공 권한을 승인한다. |  |  |
| **4** | Google이 인증 토큰과 함께 사용자를 UnIDE 콜백 URL로 리디렉션한다. |  |  |
| **5** | 시스템이 Google로부터 받은 인증 토큰을 검증하고 사용자 이메일 등 프로필 정보를 요청한다. |  |  |
| **6** | 시스템이 DB에서 해당 이메일(또는 소셜 ID)을 조회한다. |  |  |
| **7** | 기존 사용자인 경우, 시스템이 해당 계정을 찾아 로그인 처리한다. |  |  |
| **8** | 신규 사용자인 경우, 시스템이 해당 이메일로 계정을 자동 생성하고, 소셜 계정 정보를 DB에 저장한 후 로그인 처리한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **1** | 1a. Github로 로그인
...1a1. 사용자가 ‘Github로 로그인’ 버튼을 누른다.
...1a2. 2~8단계를 Github 기준으로 동일하게 수행한다. |  |  |
| **3** | 3a. 사용자가 외부 인증을 거부/취소함
...3a1. Google/Github이 오류와 함께 사용자를 UnIDE 로그인 페이지로 리디렉션한다.
...3a2. 시스템이 “인증이 취소되었습니다.” 메시지를 표시한다. |  |  |
| **8** | 8a. 이미 해당 이메일로 가입된 계정 있음
...8a1. 시스템이 “이미 이 이메일로 가입된 계정이 있습니다.일반 로그인을 이용하거나, 프로필 설정에서 계정을 연동해주세요.” 메시지를 표시한다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | 외부 공급자 응답 포함 ≤ 5 seconds |  |
| **Frequency** |  | 사용자에 따라 다름 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #4 : 로그아웃** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 인증된 사용자가 시스템에서 안전하게 세션을 종료하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 사용자가 로그인된 상태이다. |
| **Trigger** |  |  | 사용자가 ‘로그아웃’ 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 사용자 세션이 무효화되고, 사용자는 로그인 페이지로 리디렉션된다. |
| **Failed Post Condition** |  |  | 세션이 종료되지 않는다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자가 성공적으로 로그아웃한다. |  |  |
| **1** | 사용자가 ‘로그아웃’ 버튼을 클릭한다. |  |  |
| **2** | 시스템이 현재 사용자 세션(JWT)을 무효화한다. |  |  |
| **3** | 로그인 상태 유지일 시 시스템이 로컬 스토리지/쿠키의 리프레시 토큰을 삭제 및 무효화한다. |  |  |
| **4** | 시스템이 사용자를 메인 페이지로 리디렉션한다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 1 second |  |
| **Frequency** |  | 세션당 1회 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #5 : 비밀번호 재설정** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 분실한 비밀번호를 이메일 인증을 통해 재설정하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 사용자가 로그인 페이지에 있다. |
| **Trigger** |  |  | 사용자가 ‘비밀번호 재설정’ 링크를 클릭할 때 |
| **Success Post Condition** |  |  | 사용자의 비밀번호가 새 비밀번호로 변경된다. |
| **Failed Post Condition** |  |  | 비밀번호가 변경되지 않는다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자가 이메일 인증을 통해 비밀번호를 성공적으로 변경한다. |  |  |
| **1** | 사용자가 '비밀번호 찾기' 링크를 클릭한다. |  |  |
| **2** | 시스템이 비밀번호 재설정을 위한 이메일 주소 입력란을 표시한다. |  |  |
| **3** | 사용자가 가입 시 사용한 이메일 주소를 입력하고 '인증 메일 발송' 버튼을 누른다. |  |  |
| **4** | 시스템이 해당 이메일로 비밀번호 재설정 인증 코드를 발송한다. |  |  |
| **5** | 사용자가 이메일을 확인하고 재설정 인증 코드를 입력한다. |  |  |
| **6** | 시스템이 인증 토큰의 유효성을 검사하고, 새 비밀번호와 비밀번호 확인 입력란이 있는 페이지를 표시한다. |  |  |
| **7** | 사용자가 새 비밀번호와 비밀번호 확인을 입력하고 '변경하기' 버튼을 누른다. |  |  |
| **8** | 시스템이 새 비밀번호가 보안 규칙을 만족하는지 검증한다. |  |  |
| **9** | 시스템이 DB에 저장되어있는 비밀번호 해시를 새 해시로 업데이트하고, 사용된 재설정 토큰을 무효화한다. |  |  |
| **10** | 시스템이 “비밀번호가 성공적으로 변경되었습니다.” 메시지를 표시하고 로그인 페이지로 리디렉션한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **3** | 3a. 가입되지 않은 이메일
...3a1. 보안을 위해 시스템은 실제 메일을 발송하지 않으나, “이메일이 유효하다면 재설정 링크가 발송됩니다.”라는 일반적인 메시지를 표시한다. |  |  |
| **5** | 5a. 인증 토큰이 만료됨
...5a1. 시스템이 “인증 시간이 만료되었습니다. 다시 시도해주세요.” 메시지를 표시한다.
...5a2. 2단계로 돌아간다. |  |  |
| **8** | 8a. 새 비밀번호가 규칙에 맞지 않음
...8a1. 시스템이 보안 규칙 메시지를 표시한다.
...8a2. 7단계로 돌아간다.
8b. 새 비밀번호와 확인이 일치하지 않음
...8b1. 시스템이 “비밀번호가 일치하지 않습니다.” 메시지를 표시한다.
...8b2. 7단계로 돌아간다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 3 seconds |  |
| **Frequency** |  | 필요시 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #6 : 마이페이지 확인 및 조회** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 마이페이지 화면에서 자신의 정보를 조회하거나, 공개 설정된 다른 사용자의 프로필을 검색하여 볼 수 있는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 사용자가 로그인에 성공한 상태여야 하며, 마이페이지 화면에 접근 가능한 상태여야 한다. |
| **Trigger** |  |  | 사용자가 마이페이지 창에서 자신의 프로필을 보거나, 검색창에 다른 사용자의 닉네임을 입력할 때 |
| **Success Post Condition** |  |  | 사용자의 정보 또는 공개 설정된 다른 사용자의 정보가 화면에 표시된다. |
| **Failed Post Condition** |  |  | 존재하지 않는 닉네임을 검색했거나, 비공개 계정일 경우 “조회할 수 없습니다.”라는 메시지가 표시된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자가 마이페이지 조회 기능을 이용한다. |  |  |
| **1** | 이 Use Case는 사용자가 마이페이지 화면에 접속할 때 시작된다. |  |  |
| **2** | 시스템은 로그인한 사용자의 프로필 정보를 불러와 화면에 표시한다. |  |  |
| **3** | 사용자는 검색창에 닉네임을 입력할 수 있다. |  |  |
| **4** | 시스템은 입력된 닉네임과 일치하는 사용자를 DB에서 조회한다. |  |  |
| **5** | 해당 사용자가 ‘공개’로 설정된 경우, 프로필 정보(닉네임, 소개글, 선호 언어 등)를 화면에 표시한다. |  |  |
| **6** | 이 UseCase는 사용자가 원하는 정보를 성공적으로 조회하면 종료된다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **1** | 1a. 로그인하지 않은 사용자가 접근한 경우
...1a1. 시스템은 “로그인이 필요합니다.”라는 메시지를 표시하고 로그인 페이지로 이동한다. |  |  |
| **4** | 4a. 검색된 닉네임이 존재하지 않을 경우
...4a1. 시스템은 “해당 사용자를 찾을 수 없습니다.”라는 메시지를 표시한다.
...4a2. 사용자는 검색창으로 돌아간다. |  |  |
| **5** | 5a. 검색된 사용자가 ‘비공개’로 설정된 경우
...5a1. 시스템은 “이 사용자는 비공개 계정입니다.”라는 메시지를 표시한다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 2 seconds |  |
| **Frequency** |  | 회원당 하루에 평균 3~5회 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #7 : 제출 내역 조회** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 마이페이지 내 ‘제출 내역 보기’ 링크를 통해 자신의 문제 풀이 기록(제출 결과, 시간, 언어 등)을 조회하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 사용자가 로그인에 성공한 상태여야 하며, 자기 마이페이지 화면에 접근한 상태여야 한다. |
| **Trigger** |  |  | “제출 내역 보기” 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 사용자의 제출 기록(문제명, 제출 일시, 사용 언어, 결과, 실행시간 등)이 표 형식으로 화면에 표시된다. |
| **Failed Post Condition** |  |  | 제출 기록이 없을 경우 “제출 내역이 없습니다.” 메시지가 출력되고, 서버 오류 발생 시 “데이터를 불러올 수 없습니다.” 메시지가 출력된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자가 자기 문제 제출 내역을 조회할 수 있다. |  |  |
| **1** | 사용자가 마이페이지 내 ‘제출 내역 보기’ 링크를 클릭한다. |  |  |
| **2** | 시스템은 사용자 ID를 기준으로 제출 기록을 DB에서 조회한다. |  |  |
| **3** | 조회된 데이터(문제명, 제출 일시, 결과, 실행 시간, 언어 등)를 표로 정렬해 표시한다. |  |  |
| **4** | 사용자가 특정 제출 내역을 클릭하면 코드 상세 보기 페이지로 이동한다. |  |  |
| **5** | 이 Use Case는 사용자가 제출 내역을 모두 확인하면 종료된다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **1** | 1a. 제출 기록 없음
...1a1. “아직 제출 내역이 없습니다.” 메시지 출력 |  |  |
| **2** | 2a. 네트워크 오류
...2a1. “조회 실패, 다시 시도하세요.” 메시지 출력 |  |  |
| **3** | 3a. 세부 코드 접근 실패
...3a1. “해당 제출 내역을 불러올 수 없습니다.” 메시지 출력 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 3 seconds |  |
| **Frequency** |  | 하루 평균 1~2회 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #8 : 마이페이지 삭제** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 마이페이지에서 자신의 프로필 정보(닉네임, 소개글, 선호 언어, 공개 여부 등)를 삭제하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 사용자가 로그인에 성공한 상태여야 하며, 마이페이지 화면에 접근 가능한 상태여야 한다. |
| **Trigger** |  |  | 사용자가 마이페이지 화면에서 “삭제” 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 사용자 프로필 정보가 DB에서 삭제되고, 기본(미등록) 상태의 마이페이지로 돌아간다. |
| **Failed Post Condition** |  |  | 삭제가 실패한 경우, 오류 메시지를 표시하고 기존 정보는 유지된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자가 마이페이지 정보를 삭제한다. |  |  |
| **1** | 이 Use Case는 사용자가 마이페이지 화면에서 “삭제“ 버튼을 클릭할 때 시작된다. |  |  |
| **2** | 시스템은 사용자에게 “정말 삭제하시겠습니까?”라는 확인 메시지를 표시한다. |  |  |
| **3** | 사용자가 “예”를 선택하면 시스템은 DB에서 해당 사용자의 프로필 데이터를 삭제한다. |  |  |
| **4** | 삭제가 완료되면 시스템은 “프로필 정보가 삭제되었습니다.”라는 메시지를 표시한다. |  |  |
| **5** | 시스템은 빈 상태의 기본 마이페이지 화면(또는 등록 유도 화면)을 다시 표시한다. |  |  |
| **6** | 이 Use Case는 프로필 정보가 성공적으로 삭제되면 종료된다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **2** | 2a. 사용자가 “아니오”를 선택한 경우
...2a1. 시스템은 삭제 과정을 취소하고 기존 마이페이지로 돌아간다. |  |  |
| **3** | 3a. DB 연결 오류 또는 삭제 중 서버 오류 발생
...3a1. 시스템은 “삭제 중 오류가 발생했습니다.”라는 메시지를 표시한다.
...3a2. 사용자는 삭제를 다시 시도하거나 관리자에게 문의할 수 있다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 2 seconds |  |
| **Frequency** |  | 드물게 사용됨 (회원당 평균 0.1회/월 이하) |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #9 : 아바타 꾸미기** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 마이페이지에서 자신의 아바타를 생성하고 꾸미는 기능. 머리, 의상, 표정, 배경 등을 선택해 자신만의 개성을 표현하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 사용자가 로그인에 성공한 상태여야 하며, 마이페이지 화면에 접근 가능한 상태여야 한다. |
| **Trigger** |  |  | 사용자가 마이페이지 화면에서 “아바타 꾸미기” 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 꾸민 아바타 정보가 성공적으로 저장되어, 마이페이지 및 프로필에 반영된다. |
| **Failed Post Condition** |  |  | 오류 발생 시 저장되지 않고, 이전 아바타 상태로 복원된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자가 아바타를 꾸민다. |  |  |
| **1** | 이 Use Case는 사용자가 마이페이지에서 “아바타 꾸미기” 버튼을 클릭할 때 시작된다. |  |  |
| **2** | 시스템은 현재 저장된 아바타(또는 기본 아바타)를 불러와 편집 화면에 표시한다. |  |  |
| **3** | 사용자는 카테고리(헤어, 의상, 표정, 배경 등)를 선택하고 원하는 스타일을 적용한다. |  |  |
| **4** | 사용자는 실시간 미리보기를 통해 꾸민 결과를 확인할 수 있다. |  |  |
| **5** | 사용자가 “저장” 버튼을 클릭하면 시스템은 선택된 아바타 설정 정보를 검증 후 DB에 저장한다. |  |  |
| **6** | 시스템은 “아바타가 저장되었습니다.”라는 메시지를 표시하고, 수정된 아바타를 마이페이지에 반영한다. |  |  |
| **7** | 이 Use Case는 꾸민 아바타가 성공적으로 저장되면 종료된다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **3** | 3a. 사용자가 선택한 아이템이 없는 경우
...3a1. 시스템은 “선택 가능한 아이템이 없습니다.”라는 메시지를 표시한다. |  |  |
| **4** | 4a. 미리보기 렌더링 실패
...4a1. 기본 아바타로 복원하고 “미리보기를 표시할 수 없습니다.”라는 메시지를 표시한다. |  |  |
| **5** | 5a. 서버 오류 또는 저장 실패
...5a1. “아바타 저장 중 오류가 발생했습니다.”라는 메시지를 표시한다.
...5a2. 사용자는 다시 시도하거나 “취소”버튼으로 돌아간다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | 실시간 미리보기 ≤ 1 seconds, 저장 ≤ 2 seconds |  |
| **Frequency** |  | 회원당 주 평균 1회 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #10 : 마이페이지 수정** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 마이페이지에서 자신의 프로필 정보(닉네임, 소개글, 선호 언어, 공개 여부 등)를 수정하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 사용자가 로그인에 성공한 상태여야 하며, 마이페이지 화면에 접근 가능한 상태여야 한다. |
| **Trigger** |  |  | 사용자가 마이페이지 화면에서 “수정” 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 변경된 프로필 정보가 성공적으로 저장되어 마이페이지 화면에 반영된다. |
| **Failed Post Condition** |  |  | 오류 메시지 창이 표시되며, 수정된 내용은 반영되지 않는다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자가 마이페이지 정보를 수정한다. |  |  |
| **1** | 이 Use Case는 사용자가 마이페이지 화면에서 “수정“ 버튼을 클릭할 때 시작된다. |  |  |
| **2** | 시스템은 기존에 등록된 사용자 정보를 입력 폼에 표시한다. |  |  |
| **3** | 사용자는 수정할 항목(닉네임, 소개글, 선호 언어, 공개 설정 등)을 변경한다. |  |  |
| **4** | 사용자가 “저장” 버튼을 클릭하면 시스템은 변경된 정보를 검증한다. |  |  |
| **5** | 검증이 완료되면 시스템은 DB의 기존 정보를 새 값으로 갱신한다. |  |  |
| **6** | 수정이 완료되면 시스템은 “수정이 완료되었습니다.”라는 메시지를 표시하고, 최신 정보가 반영된 마이페이지를 다시 보여준다. |  |  |
| **7** | 이 Use Case는 수정된 정보가 성공적으로 반영되면 종료된다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **3** | 3a. 필수 입력 항목이 비어 있거나 형식이 잘못된 경우
...3a1. 시스템은 “입력 정보가 올바르지 않습니다.”라는 오류 메시지를 표시한다.
...3a2. 사용자는 입력 폼으로 돌아가 다시 수정한다. |  |  |
| **4** | 4a. 서버 또는 DB 오류로 인해 수정 저장이 실패한 경우
...4a1. "서버 오류로 인해 수정에 실패했습니다.“라는 메시지를 표시한다.
...4a2. 사용자는 잠시 후 다시 시도하거나 변경 내용을 취소할 수 있다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 2 seconds |  |
| **Frequency** |  | 회원당 하루에 평균 1~2회 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #11 : 계정 탈퇴** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 시스템에서 자신의 계정과 관련 데이터를 비활성화(탈퇴)하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 사용자가 로그인된 상태이다. |
| **Trigger** |  |  | 사용자가 ‘마이페이지’ > ‘계정 설정’ > ‘계정 탈퇴’ 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 사용자의 계정이 ‘삭제됨(Deleted)’ 상태로 변경되고, 모든 세션이 무효화된다. |
| **Failed Post Condition** |  |  | 계정 상태가 변경되지 않는다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자가 본인 인증 후 계정을 성공적으로 탈퇴(비활성화)한다. |  |  |
| **1** | 사용자가 ‘계정 탈퇴’ 버튼을 클릭한다. |  |  |
| **2** | 시스템이 계정 탈퇴 시 복구 불가능함을 알리는 경고 메시지와 비밀번호(본인 확인) 확인란을 표시한다. |  |  |
| **3** | 사용자가 자신의 현재 비밀번호를 입력하고 ‘탈퇴 확인’ 버튼을 누른다. |  |  |
| **4** | 시스템이 비밀번호를 검증하여 본인 확인을 수행한다. |  |  |
| **5** | 시스템이 해당 계정의 상태를 ‘삭제됨(Deleted)’으로 변경한다. |  |  |
| **6** | 시스템이 사용자를 강제 로그아웃시키고(세션 무효화) 로그인 페이지로 리디렉션한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **3** | 3a. 비밀번호 불일치
...3a1. 시스템이 “비밀번호가 올바르지 않습니다.” 메시지를 표시한다.
...3a2. 3단계로 돌아간다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 3 seconds |  |
| **Frequency** |  | 사용자당 1회 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #12 : 전체 사용자 목록 조회** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 관리자가 시스템에 등록된 모든 사용자 정보를 목록 형태로 조회하여 관리 상태를 파악하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | Administrator level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | Administrator |
| **Preconditions** |  |  | 관리자 계정으로 로그인되어 있어야 한다. |
| **Trigger** |  |  | 관리자가 관리자 페이지에서 ‘사용자 관리’ 메뉴에서 ‘전체 사용자 목록 조회’ 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 사용자 목록이 정상적으로 화면에 출력된다. |
| **Failed Post Condition** |  |  | DB 조회 실패 시 “사용자 정보를 불러올 수 없습니다.” 메시지가 출력된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 관리자가 시스템을 사용하는 모든 사용자를 조회할 수 있다. |  |  |
| **1** | 관리자가 ‘사용자 관리’ 메뉴에 접근한다. |  |  |
| **2** | 시스템은 모든 사용자 데이터를 DB에서 불러온다. |  |  |
| **3** | 각 사용자 정보(닉네임, 이메일, 가입일, 상태, 역할 등)를 테이블 형식으로 표시한다. |  |  |
| **4** | 관리자는 정렬/검색 필터를 통해 특정 사용자를 탐색할 수 있다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **2** | 2a. DB 연결 오류
...2a1. 오류 메시지 표시 및 재시도 버튼 제공. |  |  |
| **3** | 3a. 사용자 데이터가 비어 있음
...3a1. “등록된 사용자가 없습니다.” 표시 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 2 seconds |  |
| **Frequency** |  | 하루 평균 10회 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #13 : 사용자 상태 관리** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 관리자가 특정 사용자의 계정 상태(활성, 비활성, 정지)를 변경하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | Administrator level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | Administrator |
| **Preconditions** |  |  | 관리자 계정으로 로그인되어 있어야 한다. |
| **Trigger** |  |  | 관리자가 특정 사용자를 선택하고 ‘상태 변경’ 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 사용자의 상태가 DB에 반영되고, UI에 즉시 갱신된다. |
| **Failed Post Condition** |  |  | 변경 요청 실패 시 “상태 변경에 실패했습니다.” 메시지가 표시된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 관리자가 특정 사용자의 상태(활성, 비활성, 정지)를 변경시킬 수 있다. |  |  |
| **1** | 관리자가 사용자 목록에서 특정 사용자를 선택한다. |  |  |
| **2** | ‘상태 변경’ 버튼 클릭 후 상태 중 하나를 선택한다. |  |  |
| **3** | 시스템은 변경된 상태를 DB에 업데이트한다. |  |  |
| **4** | 변경 결과를 관리자 화면에 반영한다. |  |  |
| **5** | 관리자는 변경 로그를 확인할 수 있다. |  |  |
| **6** | 이 Use Case는 사용자의 상태 변경이 성공적으로 완료되면 종료된다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **3** | 3a. 네트워크 오류
...3a1. 변경 반영 실패, 관리자에게 재시도 알림 표시 |  |  |
| **5** | 5a. 로그 기록 실패
...5a1. 별도 오류 로그에 남김 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 1 seconds |  |
| **Frequency** |  | 주간 평균 5~10회 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #14 : 사용자 역할 변경** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 관리자가 특정 사용자의 시스템 내 역할(User, Instructor, Adiministrator)을 변경하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | Administrator level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | Administrator |
| **Preconditions** |  |  | 관리자 계정으로 로그인이 되어 있어야 하고 사용자가 존재해야 한다. |
| **Trigger** |  |  | 관리자가 사용자 상세정보 창에서 ‘역할 변경’ 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 변경된 역할이 DB에 반영되고, 로그인 세션에 즉시 적용된다. |
| **Failed Post Condition** |  |  | DB 업데이트 실패 시 오류 메시지 표시 및 변경 취소 |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 관리자가 사용자의 역할을 변경한다. |  |  |
| **1** | 관리자가 사용자 상세정보 페이지를 연다. |  |  |
| **2** | ‘역할 변경’ 버튼을 클릭한다. |  |  |
| **3** | 관리자가 새로운 역할을 선택한다. |  |  |
| **4** | 시스템은 역할 변경을 DB에 반영한다. |  |  |
| **5** | 변경 결과를 관리자에게 확인시킨다. |  |  |
| **6** | 이 Use Case는 수정된 정보가 성공적으로 반영되면 종료된다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **1** | 1a. DB에서 사용자 정보를 불러오지 못한 경우
...1a1. 오류 메시지 출력 및 사용자 목록 조회로 돌아감. |  |  |
| **4** | 4a. 서버 또는 DB 오류로 인해 수정 저장이 실패한 경우
...4a1. "서버 오류로 인해 수정에 실패했습니다.“라는 메시지를 표시한다.
...4a2. 사용자는 잠시 후 다시 시도하거나 변경 내용을 취소할 수 있다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 1 seconds |  |
| **Frequency** |  | 월 평균 10회 이하 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #15 : 강사 지원서 목록 조회** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 관리자가 제출된 강사 지원서 목록을 조회하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | Administrator level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | Administrator |
| **Preconditions** |  |  | 관리자 계정으로 로그인 되어있어야 한다. |
| **Trigger** |  |  | 관리자가 ‘강사 관리’ 메뉴에서 ‘지원서 목록’을 클릭할 때 |
| **Success Post Condition** |  |  | 모든 지원서가 목록 형태로 표시된다. |
| **Failed Post Condition** |  |  | DB 오류 시 “지원서 목록을 불러올 수 없습니다.” 표시 |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 관리자가 강사들의 지원 상태 목록을 조회할 수 있다. |  |  |
| **1** | 관리자가 ‘강사 관리’메뉴로 이동한다. |  |  |
| **2** | 시스템은 강사 지원서 목록을 DB에 조회한다. |  |  |
| **3** | 목록에는 지원자명, 제출일, 상태(대기/승인/거절)가 표시된다. |  |  |
| **4** | 관리자는 특정 지원서를 클릭하여 상세 조회로 이동할 수 있다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **2** | 2a. DB 연결 오류 또는 서버 오류 발생
...2a1. 시스템은 “불러오는 중 오류가 발생했습니다.”라는 메시지를 표시
2b. 지원서가 없는 경우
...2a1. “등록된 지원서가 없습니다.” 표시 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 2 seconds |  |
| **Frequency** |  | 하루 평균 1~2회 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #16 : 강사 지원서 상세 조회** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 관리자가 선택한 지원서의 상세 정보를 열람하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | Administrator level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | Administrator |
| **Preconditions** |  |  | 관리자 계정으로 로그인 되어 있어야 한다. |
| **Trigger** |  |  | 관리자가 강사 지원서 목록에서 특정 지원서 항목을 클릭할 때 |
| **Success Post Condition** |  |  | 지원자의 상세 정보(이력서, 경력, 첨부파일 등)가 표시된다. |
| **Failed Post Condition** |  |  | 파일 접근 불가 시 “첨부파일을 열 수 없습니다.” 표시 |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 관리자가 강사의 지원서를 상세하게 볼 수 있다. |  |  |
| **1** | 관리자가 지원서 목록에서 특정 항목을 클릭한다. |  |  |
| **2** | 시스템은 해당 지원서의 세부 데이터를 DB에서 조회한다. |  |  |
| **3** | 지원자의 자기소개서, 경력사항, 포트폴리오 등을 표시한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **2** | 2a. 첨부 파일 누락
...2a1. “첨부 자료가 없습니다.” 표시
2b. DB 연결 오류 또는 서버 오류 발생
...2b1. 오류 메시지 표시 |  |  |
| **3** | 3a. 지원서 상태가 변경됨
...3a1. 최신 상태로 갱신 후 표시 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 1 seconds |  |
| **Frequency** |  | 주 평균 3~5회 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #17 : 강사 자격 승인 / 거절** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 관리자가 강사 지원서를 검토 후 자격을 승인하거나 거절하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | Administrator level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | Administrator |
| **Preconditions** |  |  | 관리자 계정으로 로그인 되어 있어야 하고, 강사 지원서가 “대기 중” 상태여야 한다. |
| **Trigger** |  |  | 관리자가 지원서 상세 조회 화면에서 ‘승인’ 또는 ‘거절’ 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 승인 시, 사용자의 역할이 Instructor로 변경되고,
거절 시, 사유가 기록되고 이메일로 통보된다. |
| **Failed Post Condition** |  |  | 변경 실패 시 오류 메시지 표시 및 반영 취소 |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 관리자가 지원서를 검토하고 강사의 자격을 승인 또는 거절할 수 있다. |  |  |
| **1** | 관리자가 지원서 상세 정보를 검토한다. |  |  |
| **2** | ‘승인’ 또는 ‘거절’ 버튼을 클릭한다. |  |  |
| **3** | 승인 시 DB에 역할 변경 반영 및 승인 시간을 기록한다. |  |  |
| **4** | 거절 시 사유 입력 후 이메일을 발송한다. |  |  |
| **5** | 시스템은 결과를 관리자 화면에 갱신한다. |  |  |
| **6** | 이 Use case는 강사 역할 승인 또는 거절이이 성공적으로 완료되면 종료된다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **3** | 3a. 이메일 발송 실패
...3a1. 오류 메시지 및 재전송 버튼 표시 |  |  |
| **4** | 4a. 지원서 상태가 이미 변경됨
...4a1. “이미 처리된 신청입니다.” 표시 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | 처리 응답 시간 ≤ 3 seconds |  |
| **Frequency** |  | 주 평균 1~2회 |  |
| **<Concurrency>** |  | 제한 없음 (문제 등록 요청은 순차적으로 처리됨) |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #18 : 블랙 리스트 사용자 등록 및 관리** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 관리자가 규정 위반 사용자나 신고 누적 사용자를 블랙리스트에 등록하고 관리하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | Administrator level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | Administrator |
| **Preconditions** |  |  | 관리자 계정으로 로그인되어 있어야 하고, User가 존재해야 한다. |
| **Trigger** |  |  | 관리자가 사용자 상세 화면에서 ‘블랙리스트 등록’ 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 해당 사용자가 블랙리스트에 등록되고, 활동이 제한된다. |
| **Failed Post Condition** |  |  | 등록 실패 시 DB롤백 및 오류 메시지 표시 |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 관리자가 사용자 활동을 보면서 블랙리스트로 관리할 수 있다. |  |  |
| **1** | 관리자가 사용자 상세 페이지를 연다. |  |  |
| **2** | ‘블랙리스트 등록’ 버튼을 클릭한다. |  |  |
| **3** | 사유를 입력하고 등록을 확정한다. |  |  |
| **4** | 시스템은 테이블에 정보 저장 및 사용자 상태를 “제한”으로 변경한다. |  |  |
| **5** | 관리자는 블랙리스트 목록에서 해당 사용자를 확인할 수 있다. |  |  |
| **6** | 이 Use case는 사용자가 DB 테이블에 성공적으로 등록이 되면 종료된다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **3** | 3a. 사유 미입력
...3a1. 등록 불가 및 경고창 표시 |  |  |
| **4** | 4a. 이미 등록된 사용자
...4a1. “이미 블랙리스트에 포함된 사용자입니다.” 표시 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 1 seconds |  |
| **Frequency** |  | 월 평균 2~3회 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.15 |  |

| **Use case #19 : 신고 내역 조회** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 관리자가 시스템에 접수된 모든 신고 내역을 조회하여 처리 현황을 파악하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | Administrator level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | Administrator |
| **Preconditions** |  |  | 관리자 계정으로 로그인되어 있어야 한다. |
| **Trigger** |  |  | 관리자가 ‘신고 관리’ 메뉴에서 ‘신고 내역 조회’를 선택할 때 |
| **Success Post Condition** |  |  | 시스템이 신고 내역 리스트를 정상적으로 화면에 표시한다. |
| **Failed Post Condition** |  |  | DB 오류 시 “신고 내역을 불러올 수 없습니다.”메시지가 표시된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 관리자가 사용자들이 신고한 모든 데이터 목록을 조회할 수 있다. |  |  |
| **1** | 관리자가 관리자 페이지에 접근한다. |  |  |
| **2** | ‘신고 관리’ 탭을 클릭한다. |  |  |
| **3** | 시스템은 테이블에서 모든 신고 데이터를 조회한다. |  |  |
| **4** | 신고자, 피신고자, 제목, 신고 사유, 상태(처리/미처리)를 목록 형태로 출력한다. |  |  |
| **5** | 관리자는 필터(상태/유형별)를 이용해 특정 신고를 검색한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **3** | 3a. 신고 데이터가 존재하지 않음.
...3a1. “등록된 신고가 없습니다.” 표시
3b. DB 오류로 인해 신고 데이터를 불러오지 못함. 
...3b1. “정보를 불러오지 못했습니다.” 오류 메시지 표시 |  |  |
| **4** | 4a. 네트워크 오류 발생 또는 세션 만료함.
...4a1. 로딩 중단 및 재시도 버튼 제공 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 2 seconds |  |
| **Frequency** |  | 하루 평균 5~10회 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.15 |  |

| **Use case #20 : 신고 내용 상세 확인** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 관리자가 선택한 신고 건의 상세 정보를 열람하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | Administrator level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | Administrator |
| **Preconditions** |  |  | 관리자 계정으로 로그인되어 있어야 한다. |
| **Trigger** |  |  | 관리자가 특정 신고 항목을 클릭할 때 |
| **Success Post Condition** |  |  | 선택한 신고의 상세 내용이 화면에 표시된다. |
| **Failed Post Condition** |  |  | 상세 정보 로딩 실패 시 “세부 정보를 불러올 수 없습니다.” 메시지 출력 |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 관리자는 사용자의 신고 내용을 상세하게 검토할 수 있다. |  |  |
| **1** | 관리자가 신고 목록에서 특정 항목을 선택한다. |  |  |
| **2** | 시스템은 해당 신고 ID를 기준으로 세부 정보를 DB에서 조회한다. |  |  |
| **3** | 신고자 정보, 피신고자 정보, 신고 사유, 첨부 자료, 신고 일시가 표시된다. |  |  |
| **4** | 관리자는 ‘컨텐츠 보기’ 버튼을 눌러 신고된 문제/게시물로 이동할 수 있다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **3** | 3a. DB 정보 불러오기 실패
...3a1. 오류 메시지 출력 |  |  |
| **4** | 4a. 신고된 컨텐츠가 삭제된 경우
...4a1. “해당 컨텐츠는 이미 삭제되었습니다.” 알림 표시
4b. 링크를 타고 이동하는데 네트워크/세션 만료
...4b1. 세션이 만료되었습니다. 다시 시도해주세요” 표시 |  |  |
| **6** | 6a. 네트워크/세션 만료
...6a1. “세션이 만료되었습니다. 다시 로그인해주세요.” 표시 후 로그인 페이지로 이동 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 2 seconds |  |
| **Frequency** |  | 하루 평균 5회 이하 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.15 |  |

| **Use case #21 : 신고 컨텐츠 검토 및 제재** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 관리자가 신고된 컨텐츠(게시글, 댓글, 문제, 강의 등)를 검토 후 적절한 제재 조치를 수행하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | Administrator level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | Administrator |
| **Preconditions** |  |  | 관리자 계정으로 로그인 되어 있어야 한다. |
| **Trigger** |  |  | 관리자가 ‘처리하기’ 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 신고된 컨텐츠에 대한 조치가 완료되고, 결과가 DB에 기록된다. |
| **Failed Post Condition** |  |  | 처리 중 오류 발생 시 “신고 처리를 완료하지 못했습니다.”메시지 표시 |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 관리자가 신고 내용을 검토하고 적절한 제재 조치를 할 수 있다. |  |  |
| **1** | 관리자가 신고 상세화면에서 ‘처리하기’ 버튼을 클릭한다. |  |  |
| **2** | 시스템은 선택 가능한 조치 목록(삭제, 비공개, 경고, 정지 등)을 표시한다. |  |  |
| **3** | 관리자가 조치 유형과 사유를 선택한다. |  |  |
| **4** | 시스템은 해당 조치를 DB에 반영하고 신고 상태를 “처리 완료”로 변경한다. |  |  |
| **5** | 조치 로그가 기록되고 관리자에게 완료 메시지를 표시한다. |  |  |
| **6** | 이 Use case는 신고 제재가 성공적으로 완료되면 종료된다. |  |  |
| **\EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **3** | 3a. 필수 입력란이 비어 있음.
...3a1. 조치 유형을 선택하지 않을 시 조치 유형 선택하라는 경고창 출력
...3a2. 사유 미입력 시 “조치 사유를 입력하세요.” 경고창 출력 |  |  |
| **4** | 4a. 조치 수행 중 DB 저장 실패 또는 네트워크 오류 발생
...4a1. 롤백 후 재시도 유도 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 3 seconds |  |
| **Frequency** |  | 주간 평균 2~3회 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.15 |  |

| **Use case #22 : 신고 처리 결과 통보** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 관리자가 신고 처리 결과를 신고자와 피신고자에게 시스템 알림 및 이메일로 전달하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | Administrator level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | Administrator |
| **Preconditions** |  |  | 관리자 계정으로 신고 처리가 완료된 상태여야 한다. |
| **Trigger** |  |  | 시스템이 자동으로 결과 통보 프로세스를 실행할 때 |
| **Success Post Condition** |  |  | 신고자에게 “신고가 처리되었습니다.” 알림을 전송하고,
피신고자에게 “제제 사유 및 조치 내용”을 통보한다. |
| **Failed Post Condition** |  |  | 메일 전송 실패 시 로그 기록 및 관리자에게 재발송 요청 알림 표시 |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 관리자가 신고를 처리하면서 신고자와 피신고자에게 메일이 전달된다. |  |  |
| **1** | 신고자 처리 완료되면 시스템이 자동으로 통보 절차를 시작한다. |  |  |
| **2** | 신고자에게 처리 결과(처리일자, 조치결과)를 이메일로 발송한다. |  |  |
| **3** | 피신고자에게는 제재 유형과 사유가 포함된 알림을 발송한다. |  |  |
| **4** | 시스템은 통보 내역을 DB로그에 기록한다. |  |  |
| **5** | 이 Use case는 신고 처리가 성공적으로 완료되고, 신고자 및 피신고자에게 성공적으로 메일이 전송되면 종료된다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **2** | 2a. 이메일 서버 오류
...2a1 재발송 시도 및 실패 로그 기록. |  |  |
| **3** | 3a. 피신고자 계정이 정지 상태
...3a1. 내부 메시지함에 통보 기록만 저장. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 3 seconds |  |
| **Frequency** |  | 신고 건당 1회 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.15 |  |

| **Use case #23 : 강의 검열 및 비공개 처리** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 관리자가 규정 위반 또는 부적절한 강의를 검열하고, 필요시 비공개로 전환하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | Adiministrator level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | Adiministrator |
| **Preconditions** |  |  | 관리자 계정으로 로그인 되어 있어야 함 |
| **Trigger** |  |  | 관리자가 ‘강의 관리’ 메뉴에서 특정 강의를 선택하고 ‘검열’또는 ‘비공개 처리’ 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 강의가 비공개 상태로 전환되고, 강사에게 통보 메일이 자동 전송된다. |
| **Failed Post Condition** |  |  | 상태 변경 실패 시 “강의 비공개 처리 실패” 메시지 표시 |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 관리자는 시스템 내 강의를 검열하여 비공개로 전환할 수 있다. |  |  |
| **1** | 관리자가 강의 목록을 조회한다. |  |  |
| **2** | 특정 강의를 선택하고 ‘검열’ 버튼을 클릭한다. |  |  |
| **3** | 시스템은 강의 내용을 로드하고, 관리자에게 미리보기를 제공한다. |  |  |
| **4** | 관리자가 ‘비공개 처리’ 선택 시 강의 상태를 “비공개”로 변경한다. |  |  |
| **5** | 강사에게 비공개 사유 및 조치 내용이 이메일로 전송된다. |  |  |
| **6** | 이 Use case는 강의가 비공개로 성공적으로 처리되고, 강사에게 성공적으로 이메일이 전송되면 종료된다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **4** | 4a. 강의가 이미 비공개 상태
...4a1. “이미 비공개 처리된 강의입니다.” 표시 |  |  |
| **5** | 5a. 이메일 발송 실패
...5a1. 로그 기록 및 관리자에게 재발송 알림. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 3 seconds |  |
| **Frequency** |  | 월간 평균 1~3회 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #24 : 문제 목록 조회** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자(또는 관리자, 강사)가 시스템에 등록된 모든 문제 목록을 조회하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User, Instructor, Administrator |
| **Preconditions** |  |  | 서비스 접속 상태여야 하고 DB에 문제 데이터가 존재해야 한다. |
| **Trigger** |  |  | 사용자가 메인 화면에서 ‘문제 목록’ 메뉴를 클릭할 때 |
| **Success Post Condition** |  |  | 문제 목록이 화면에 정상적으로 표시된다. |
| **Failed Post Condition** |  |  | DB 조회 실패 시 “문제를 불러올 수 없습니다.” 메시지를 표시한다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 시스템 이용자는 문제 목록은 조회할 수 있다. |  |  |
| **1** | 사용자가 메인 메뉴의 ‘문제’ 탭을 클릭한다. |  |  |
| **2** | 시스템은 DB의 문제 테이블에서 문제 데이터를 조회한다. |  |  |
| **3** | 각 문제의 ID, 제목, 난이도, 정답률, 조회수가 표시된다. |  |  |
| **4** | 기본 정렬은 최신순으로 적용된다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **2** | 2a. 데이터가 비어있음.
...2a1. “등록된 문제가 없습니다.” 표시 |  |  |
| **3** | 3a. 네트워크 오류
...3a1. 재시도 버튼 표시 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 2 seconds |  |
| **Frequency** |  | 상시 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #25 : 문제 목록 정렬(최신순/난이도순/조회순)** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 문제 목록의 정렬 기준을 변경하여 원하는 방식으로 볼 수 있게 하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User, Instructor, Administrator |
| **Preconditions** |  |  | 문제 목록이 조회된 상태여야 한다. |
| **Trigger** |  |  | 사용자가 정렬 기준 드롭다운(또는 버튼)을 클릭하고 기준을 선택할 때 |
| **Success Post Condition** |  |  | 선택된 기준에 따라 목록이 재정렬되어 표시된다. |
| **Failed Post Condition** |  |  | 정렬 로직 실패 시 “정렬을 적용할 수 없습니다.” 메시지 표시. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 시스템을 이용자는 문제 목록을 원하는 방식으로 정렬할 수 있다. |  |  |
| **1** | 사용자가 정렬 옵션(최신순/난이도순/조회순)을 선택한다. |  |  |
| **2** | 시스템은 선택된 기준에 따라 문제 데이터를 정렬한다. |  |  |
| **3** | 정렬된 결과를 UI에 즉시 반영한다. |  |  |
| **4** | 이 Use case는 1~3단계 사용자가 원할 때까지 계속 반복한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **2** | 2a. 정렬 중 데이터 손상
...2a1. 기본값(최신순)으로 복귀 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 1 seconds |  |
| **Frequency** |  | 상시 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #26 : 문제 검색(ID 또는 제목)** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 문제의 ID 또는 제목을 입력하여 특정 문제를 검색하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User, Instructor, Administrator |
| **Preconditions** |  |  | 문제 목록 페이지에 있어야 한다. |
| **Trigger** |  |  | 사용자가 검색창에 키워드를 입력하고 ‘검색’버튼을 누를 때 |
| **Success Post Condition** |  |  | 검색 결과가 목록 형태로 표시된다. |
| **Failed Post Condition** |  |  | 일치하는 결과가 없으면 “검색 결과가 없습니다.” 표시 |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 시스템 이용자는 원하는 문제를 검색할 수 있다. |  |  |
| **1** | 사용자가 문제 목록 페이지 상단의 검색창에 검색어를 입력한다. |  |  |
| **2** | 시스템은 문제 ID 또는 제목을 기준으로 DB에서 일치 항목을 검색한다. |  |  |
| **3** | 검색 결과가 목록으로 표시된다. |  |  |
| **4** | 사용자는 검색 결과를 클릭하여 상세 페이지로 이동할 수 있다. |  |  |
| **5** | 이 Use case는 1~3단계 사용자가 원할 때까지 계속 반복한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **2** | 2a. 입력값이 한 글자 이하
...2a1. "두 글자 이상 입력하세요.“ 안내창 표시. |  |  |
| **3** | 3a. 결과 없음
...3a1. 빈 목록과 안내 메시지 표시. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 1 seconds |  |
| **Frequency** |  | 상시 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #27 : 문제 미리보기 (마우스 오버)** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 문제 목록 위에서 마우스를 올리면 문제의 간략한 설명을 미리 볼 수 있는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User, Instructor, Administrator |
| **Preconditions** |  |  | 문제 목록이 조회된 상태여야 한다. |
| **Trigger** |  |  | 사용자가 특정 문제 카드나 행 위에 마우스를 올릴 때 |
| **Success Post Condition** |  |  | 해당 문제의 요약(설명, 제한시간, 정답률 등)이 툴팁 형태로 표시된다. |
| **Failed Post Condition** |  |  | 데티터 로드 실패 시 “요약 정보를 불러올 수 없습니다.” 표시 |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 시스템 이용자는 문제 목록에서 특정 항목 위에 마우스를 올리면 요약 데이터를 볼 수 있다. |  |  |
| **1** | 사용자가 문제 위에 마우스를 올린다. |  |  |
| **2** | 시스템은 해당 문제의 요약 데이터를 가져온다. |  |  |
| **3** | 툴팁 팝업에 요약 정보를 표시한다. |  |  |
| **4** | 이 Use case는 1~3단계 사용자가 원할 때까지 계속 반복한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **2** | 2a. 네트워크 지연
...2a1. 로딩 애니메이션 표시 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 0.5 seconds |  |
| **Frequency** |  | 상시 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #28 : 문제 등록(관리자/강사)** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 관리자나 강사가 새로운 문제를 등록하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | Instructor level, Administrator level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | Instructor, Administrator |
| **Preconditions** |  |  | 강사 또는 관리자 계정으로 로그인 되어 있어야 한다. |
| **Trigger** |  |  | ‘문제 등록’ 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 새로운 문제가 DB에 저장되고, 목록에 반영된다. |
| **Failed Post Condition** |  |  | 필수 입력 누락 또는 DB 오류 시 “등록 실패” 메시지 표시 |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 관리자 또는 강사는 시스템에 새로운 문제를 등록할 수 있다. |  |  |
| **1** | 관리자가 ‘문제 등록’ 버튼을 클릭한다. |  |  |
| **2** | 제목, 설명, 입출력 예제, 제한시간, 난이도, 태그 등을 입력한다. |  |  |
| **3** | 테스트케이스 파일을 업로드한다. |  |  |
| **4** | 시스템은 필수값을 검증한다. |  |  |
| **5** | 검증 통과 시 DB에 저장하고 목록을 갱신한다. |  |  |
| **6** | 이 Use case는 문제가 성공적으로 등록되면 종료된다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **3** | 3a. 파일 형식 오류
...3a1. “유효하지 않은 테스트케이스 파일입니다.” 표시 |  |  |
| **4** | 4a. 필수항목 누락
...4a1. 오류 메시지 출력 |  |  |
| **5** | 5a. DB 저장 실패 및 네트워크 오류
...5a1. 실패 메시지 표시 및 롤백 후 재시도 유도 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 3 seconds |  |
| **Frequency** |  | 주간 평균 5회 이하 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #29 : 테스트케이스 파일 업로드** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 문제 등록 또는 수정 시 테스트케이스 파일을 서버에 업로드하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | Instructor level, Administrator level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | Instructor, Administrator |
| **Preconditions** |  |  | 문제 등록 또는 수정 화면이 열려 있어야 한다. |
| **Trigger** |  |  | ‘테스트케이스 업로드’ 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 파일의 유효성 검증 후 서버에 저장된다. |
| **Failed Post Condition** |  |  | 파일 형식 오류 시 업로드 실패 메시지 표시 |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 등록자(관리자 또는 강사)는 테스트케이스 파일을 최소 1개 이상 업로드하여야 한다. |  |  |
| **1** | 등록자가 테스트케이스 파일을 선택한다. |  |  |
| **2** | 시스템은 파일 형식과 크기를 검증한다. |  |  |
| **3** | 파일을 서버 스토리지에 업로드한다. |  |  |
| **4** | 업로드 성공 메시지를 표시한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **2** | 2a. 파일 크기 초과
...2a1. 업로드 차단 및 경고 |  |  |
| **3** | 3a. 네트워크 오류
...3a1. 재시도 안내 표시 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 5 seconds |  |
| **Frequency** |  | 문제 등록 시 1회 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #30 : 문제 수정** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 문제를 등록한 작성자나 관리자가 기존 문제를 수정하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | Instructor level, Administrator level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | Instructor, Administrator |
| **Preconditions** |  |  | 문제 등록자이거나 관리자 계정으로 로그인 되어 있어야 한다. |
| **Trigger** |  |  | ‘문제 수정’ 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 수정된 정보가 DB에 반영되고, 문제 버전 기록이 남는다. |
| **Failed Post Condition** |  |  | 필수값 누락 또는 권한 오류 시 수정 실패 메시지 표시 |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 문제 등록자 또는 관리자는 문제 안에 오류가 있으면 수정할 수 있다. |  |  |
| **1** | 관리자가 수정할 문제를 선택한다. |  |  |
| **2** | 기존 데이터가 폼에 자동 로드된다. |  |  |
| **3** | 수정 후 ‘저장’ 버튼 클릭한다. |  |  |
| **4** | 시스템은 필수값 검증 후 DB를 갱신한다. |  |  |
| **5** | 수정 내역이 로그에 저장된다. |  |  |
| **6** | 이 Use case는 문제 수정이 성공적으로 완료되면 종료된다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **2** | 2a. DB 불러오기 실패
...2a1. “정보를 불러오지 못했습니다.” 오류 메시지 표시 |  |  |
| **4** | 4a. 네트워크 오류 및 DB 저장 실패
...3a1. 재시도 안내 표시
4b. 필수항목 누락시
...3b1. 오류 메시지 출력 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 2 seconds |  |
| **Frequency** |  | 월간 평균 10회 이하 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #31 : 문제 비공개 처리** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 관리자가 문제를 일반 사용자에게 비공개로 전환하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | Instructor level, Administrator level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | Instructor, Administrator |
| **Preconditions** |  |  | 문제 등록자이거나 관리자 계정으로 로그인 되어 있어야 한다. |
| **Trigger** |  |  | ‘비공개 처리’ 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 문제 상태가 “비공개”로 변경되고 일반 사용자 목록에서 제외된다. |
| **Failed Post Condition** |  |  | DB 업데이트 실패 시 오류 메시지 표시 |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 문제 등록자 또는 관리자는 문제를 비공개 처리할 수 있다. |  |  |
| **1** | 관리자 또는 등록자가 문제 상세 페이지를 연다. |  |  |
| **2** | ‘비공개 처리’ 버튼 클릭한다. |  |  |
| **3** | 시스템은 문제 상태를 ‘비공개’로 변경한다. |  |  |
| **4** | 변경 로그를 기록하고 완료 메시지를 표시한다. |  |  |
| **5** | 이 Use case는 문제 비공개 처리가 성공적으로 완료되면 종료된다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **3** | 3a. 이미 문제가 비공개 상태일 때
...3a1. “이미 비공개 처리된 문제입니다.” 표시
3b. 네트워크 오류 및 DB 저장 실패
...3b1. 재시도 안내 표시 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 1 seconds |  |
| **Frequency** |  | 주간 평균 2~3회 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #32 : 문제 영구 삭제** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 등록자 또는 관리자가 문제를 DB에서 완전히 삭제하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | Instructor level, Administrator level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | Instructor, Administrator |
| **Preconditions** |  |  | 문제 등록자이거나 관리자 계정으로 로그인 되어 있어야 한다. |
| **Trigger** |  |  | ‘영구 삭제’ 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 문제 데이터가 DB에서 제거되고 삭제 로그에 기록된다. |
| **Failed Post Condition** |  |  | 삭제 중 오류 발생 시 “삭제 실패” 메시지 표시 |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 문제 등록자 또는 관리자는 문제를 영구적으로 삭제할 수 있다. |  |  |
| **1** | 관리자 또는 등록자가 삭제할 문제를 선택한다. |  |  |
| **2** | 시스템은 확인 팝업을 표시한다. |  |  |
| **3** | 삭제를 확정한다. |  |  |
| **4** | 문제 데이터가 DB에서 제거된다. |  |  |
| **5** | 삭제 로그 테이블에 기록된다. |  |  |
| **6** | 이 Use case는 문제가 성공적으로 삭제가 되면 종료된다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **2** | 2a. 취소 선택
...2a1. 삭제 취소 및 유지 |  |  |
| **3** | 3a. 삭제 실패
...3a1. 오류 로그 기록 |  |  |
| **4** | 4a. 네트워크 오류
...4a1. 재시도 안내 표시 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 3 seconds |  |
| **Frequency** |  | 월간 평균 1~2회 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #33 : 문제 복구(비공개 또는 DB)** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 관리자 비공개 문제를 다시 공개하거나, 삭제 로그에서 문제를 복원하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | Administrator level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | Administrator |
| **Preconditions** |  |  | 복구 가능한 문제(비공개/삭제 로그)가 존재해야 한다. |
| **Trigger** |  |  | 관리자가 ‘복구’ 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 문제 상태가 “공개”로 변경되어 목록에 다시 표시된다. |
| **Failed Post Condition** |  |  | 복구 실패 시 “복구에 실패했습니다.” 메시지 출력. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 관리자는 삭제된 문제를 복구 시킬 수 있다. |  |  |
| **1** | 관리자는 관리자 페이지에서 ‘비공개/삭제 문제 관리’ 탭을 연다. |  |  |
| **2** | 복구할 문제를 선택한다. |  |  |
| **3** | ‘복구’ 버튼 클릭 시 시스템이 DB에서 데이터를 복원한다. |  |  |
| **4** | 기본 상태는 ‘비공개’이고 상태를 ‘공개’로 변경하면 목록에 반영된다. |  |  |
| **5** | 이 Use case는 문제가 성공적으로 복구가 되면 종료된다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **3** | 3a. 원본 데이터 손실
...3a1. 복구 불가 메시지 표시
3b. DB에서 데이터 불러오기 실패
...3b1. 재시도 안내 표시 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 3 seconds |  |
| **Frequency** |  | 월간 평균 1회 이하 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #34 : 웹 IDE 제공** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 문제 풀이를 위해 웹 브라우저 기반의 코드 편집기를 이용하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 사용자가 문제 상세 페이지에 접근한 상태여야 한다. |
| **Trigger** |  |  | 사용자가 문제 상세 페이지에서 ‘문제 풀기’ 버튼을 클릭하여 IDE 환경에 진입할 때 |
| **Success Post Condition** |  |  | Monaco Editor 기반의 웹 IDE가 로드되어 코드 작성이 가능한 상태가 된다. |
| **Failed Post Condition** |  |  | IDE 로딩에 실패하여 “편집기를 불러올 수 없습니다.” 메시지가 표시된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자가 웹 IDE를 성공적으로 로드한다. |  |  |
| **1** | 이 Use Case는 사용자가 '문제 풀기' 버튼을 클릭할 때 시작된다. |  |  |
| **2** | 시스템은 Monaco Editor 리소스를 로드한다. |  |  |
| **3** | 시스템은 문제 풀이 화면 레이아웃(문제 설명, 코드 편집기, 입/출력 창)을 표시한다. |  |  |
| **4** | 코드 편집기(IDE)가 활성화되고 사용자는 코드 입력을 시작할 수 있다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **2** | 2a. IDE 리소스 로드 실패
...2a1. 시스템이 “편집기 로딩 중 오류가 발생했습니다. 새로고침 해주세요.” 메시지를 표시한다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 2 seconds |  |
| **Frequency** |  | 문제 풀이 시도 시 항상 발생 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #35 : 다국어 지원** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 웹 IDE에서 지원되는 프로그래밍 언어(Python, Java, C++)를 선택하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 웹 IDE가 성공적으로 로드된 상태여야 한다. |
| **Trigger** |  |  | 사용자가 IDE 내의 언어 선택 드롭다운 메뉴를 클릭할 때 |
| **Success Post Condition** |  |  | 사용자가 선택한 언어로 IDE의 구문 강조(Syntax Highlighting) 및 자동 완성 기능이 변경된다. |
| **Failed Post Condition** |  |  | 언어 변경에 실패하고, 기본값(또는 이전 값)으로 유지된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자가 코드 작성 언어를 Python으로 변경한다. |  |  |
| **1** | 이 Use Case는 사용자가 IDE의 언어 선택 드롭다운을 클릭할 때 시작된다. |  |  |
| **2** | 시스템이 지원하는 언어 목록을 표시한다. |  |  |
| **3** | 사용자가 목록에서 ‘Python’을 선택한다. |  |  |
| **4** | 시스템이 편집기의 언어 모드를 ‘Python’으로 변경한다. |  |  |
| **5** | Python 구문 강조가 적용되고, 해당 문제의 Python 기본 템플릿 코드가 편집기에 로드된다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **5** | 5a. 언어 변경 시 기존 코드 존재
...5a1. 시스템이 “언어를 변경하면 작성 중인 코드가 초기화될 수 있습니다. 계속하시겠습니까?” 확인 메시지를 표시한다.
...5a2. 5단계를 계속 진행한다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 0.5 seconds |  |
| **Frequency** |  | 문제 풀이 시 평균 1~2회 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #36 : 편집기 테마 전환** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 IDE의 시각적 테마를 라이트 모드 또는 다크 모드로 전환하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 웹 IDE가 성공적으로 로드된 상태여야 한다. |
| **Trigger** |  |  | 사용자가 IDE 설정 메뉴에서 ‘테마’ 옵션을 선택할 때 |
| **Success Post Condition** |  |  | IDE의 시각적 테마가 즉시 변경되고, 사용자의 선택이 저장된다. |
| **Failed Post Condition** |  |  | 테마가 변경되지 않는다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자가 IDE 테마를 다크 모드로 변경한다. |  |  |
| **1** | 이 Use Case는 사용자가 IDE 설정 메뉴를 클릭할 때 시작된다. |  |  |
| **2** | 시스템이 ‘테마’ 옵션을 표시한다. |  |  |
| **3** | 사용자가 ‘테마’ 옵션을 클릭하고 ‘다크’를 선택한다. |  |  |
| **4** | 시스템이 즉시 IDE의 테마를 다크 모드로 변경한다. |  |  |
| **5** | 시스템이 사용자의 테마 선택을 브라우저 로컬 스토리지에 저장하여 다음 접속 시 유지되도록 한다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 0.5 seconds |  |
| **Frequency** |  | 사용자에 따라 다름 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #37 : 코드 포매팅** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 IDE에서 작성 중인 코드를 선택한 언어의 규칙에 맞게 자동 정렬하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 웹 IDE가 성공적으로 로드된 상태여야 한다. |
| **Trigger** |  |  | 사용자가 '코드 정렬하기' 버튼(또는 단축키)을 클릭할 때 |
| **Success Post Condition** |  |  | IDE에 작성된 코드가 해당 언어의 코드 스타일에 맞게 자동 정렬(들여쓰기, 공백 등)된다. |
| **Failed Post Condition** |  |  | 코드가 정렬되지 않거나, 구문 오류로 인해 실패 메시지가 표시된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자가 작성한 코드를 성공적으로 자동 정렬한다. |  |  |
| **1** | 이 Use Case는 사용자가 IDE 설정 메뉴에서 ‘코드 정렬하기’ 버튼을 클릭할 때 시작된다. |  |  |
| **2** | 시스템이 현재 설정된 언어의 포매터를 실행한다. |  |  |
| **3** | 시스템이 편집기 내의 코드를 즉시 자동 정렬한다. |  |  |
| **4** | 이 Use Case는 코드 정렬이 완료되면 종료된다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **2** | 2a. 심각한 구문 오류로 인한 정렬 실패
...2a1. 시스템이 정렬을 수행하지 못하고 “코드 포매팅에 실패했습니다.” 메시지를 표시한다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 1 seconds |  |
| **Frequency** |  | 사용자에 따라 다름 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #38 : 코드 자동 저장** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 시스템이 사용자의 코드 변경 사항을 브라우저 캐시에 주기적으로 자동 저장하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 사용자가 웹 IDE에서 코드를 수정 중이어야 한다. |
| **Trigger** |  |  | 사용자가 코드 수정을 멈춘 후 일정 시간이 경과했을 때 |
| **Success Post Condition** |  |  | 사용자의 최신 코드가 브라우저 캐시에 저장되어, 페이지를 새로고침해도 코드가 복원된다. |
| **Failed Post Condition** |  |  | 코드 저장에 실패한다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 시스템이 사용자 코드를 캐시에 자동 저장한다. |  |  |
| **1** | 이 Use Case는 사용자가 IDE에서 코드를 입력하거나 수정한 후 10초간 추가 입력이 없을 때 시작된다. |  |  |
| **2** | 시스템이 현재 IDE의 코드 내용을 가져온다. |  |  |
| **3** | 시스템이 해당 문제 ID와 사용자 ID를 키로 하여 브라우저 로컬 스토리지에 코드 내용을 저장한다. |  |  |
| **4** | 이 Use Case는 저장이 완료되면 종료된다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **3** | 3a. 사용자가 페이지를 새로고침하거나 재방문함
...3a1. IDE가 로드될 때, 시스템이 로컬 스토리지에 해당 키의 저장된 코드가 있는지 확인한다.
...3a2. 시스템이 “자동 저장된 코드를 불러왔습니다.” 메시지를 표시하고 해당 코드를 편집기에 로드한다.
3b. 로컬 스토리지 저장 실패
...3b1. 시스템이 자동 저장을 중지하고, 사용자에게 “자동 저장에 실패했습니다. ‘임시 저장’을 이용해주세요.” 메시지를 표시한다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 0.5 seconds |  |
| **Frequency** |  | 코드 수정 시 주기적으로 발생 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #39 : 코드 임시 저장** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 IDE에 작성 중인 코드를 ‘저장’ 버튼을 눌러 서버 DB에 ‘DRAFT’ 상태로 저장하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 사용자가 로그인 상태이며, 웹 IDE에 코드가 작성되어 있다. |
| **Trigger** |  |  | 사용자가 IDE 내의 ‘저장’ 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 코드가 서버 DB에 ‘DRAFT’ 상태로 저장된다. |
| **Failed Post Condition** |  |  | 네트워크 오류 등으로 서버 저장에 실패하고 “저장에 실패했습니다.” 메시지가 표시된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자가 ‘저장’ 버튼을 눌러 코드를 성공적으로 서버에 임시 저장한다. |  |  |
| **1** | 이 Use Case는 사용자가 IDE에서 코드 수정 후 ‘저장’ 버튼을 클릭할 때 시작된다. |  |  |
| **2** | 시스템은 현재 편집기의 코드, 선택된 언어, 문제 ID를 가져온다. |  |  |
| **3** | 시스템은 해당 정보를 서버의 임시 저장 API로 전송한다. |  |  |
| **4** | 서버는 DB 테이블에서 해당 사용자의 해당 문제에 대한 ‘DRAFT’ 레코드를 찾아 덮어쓰거나, 없는 경우 새로 생성한다. |  |  |
| **5** | 서버가 저장 성공 응답을 반환한다. |  |  |
| **6** | 시스템이 UI에 “저장되었습니다.” 라는 확인 메시지를 잠시 표시한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **5** | 5a. 서버 저장 실패
...5a1. 시스템이 “서버 저장에 실패했습니다.” 메시지를 표시한다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 1 seconds |  |
| **Frequency** |  | 문제 풀이 시 수시로 발생 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #40 : 임시 저장 코드 불러오기** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 이전에 서버에 임시 저장했던 코드를 IDE로 불러오는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 사용자가 로그인 상태이며, 웹 IDE에 접근한 상태이다. |
| **Trigger** |  |  | 사용자가 ‘내 제출 목록’ 탭에서 ‘임시 저장’ 항목을 클릭하거나, ‘불러오기’ 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 서버에 저장된 ‘DRAFT’ 상태의 코드가 IDE 편집기에 로드된다. |
| **Failed Post Condition** |  |  | 코드를 불러오지 못하고 “임시 저장된 코드를 불러올 수 없습니다.” 메시지가 표시된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자가 가장 최근에 임시 저장한 코드를 IDE로 성공적으로 불러온다. |  |  |
| **1** | 이 Use Case는 사용자가 ‘내 제출 목록’ 탭에서 ‘임시 저장 코드 불러오기’ 버튼을 클릭할 때 시작된다. |  |  |
| **2** | 시스템이 서버에 해당 문제의 'DRAFT' 상태 코드를 요청한다. |  |  |
| **3** | 서버가 테이블에서 가장 최근의 'DRAFT' 레코드를 찾아 코드와 언어 정보를 반환한다. |  |  |
| **4** | 시스템이 응답받은 언어로 IDE 언어를 자동 변경한다. |  |  |
| **5** | 시스템이 응답받은 코드를 IDE 편집기 창에 덮어쓴다. |  |  |
| **6** | 시스템이 "임시 저장된 코드를 불러왔습니다." 메시지를 표시한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **3** | 3a. 서버에 임시 저장된 코드가 없음
...3a1. 서버가 ‘Not Found’ 응답을 반환한다.
...3a2. 시스템이 “서버에 임시 저장된 코드가 없습니다.” 메시지를 표시한다.
3b. 서버 통신 실패
...3b1. 시스템이 “코드를 불러오는 데 실패했습니다.” 메시지를 표시한다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 1.5 seconds |  |
| **Frequency** |  | 문제 풀이 시작 시 또는 필요시 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #41 : 이전 제출 코드 불러오기** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 이전에 '제출'했던(채점 완료된) 특정 버전의 코드를 IDE로 불러오는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 사용자가 로그인 상태이며, 웹 IDE에 접근한 상태이다. |
| **Trigger** |  |  | 사용자가 '내 제출 목록' 탭에서 'DRAFT'가 아닌 특정 제출 이력을 클릭할 때 |
| **Success Post Condition** |  |  | 선택한 제출 이력의 코드가 IDE 편집기에 로드된다. |
| **Failed Post Condition** |  |  | 코드를 불러오지 못하고 "해당 제출 내역을 불러올 수 없습니다." 메시지가 표시된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자가 3일 전 ‘성공(Accepted)’했던 코드를 IDE로 불러온다. |  |  |
| **1** | 이 Use Case는 사용자가 '내 제출 목록' 탭에서 특정 제출 이력을 클릭할 때 시작된다. |  |  |
| **2** | 시스템이 해당 제출 ID를 기반으로 서버에 상세 정보(코드 포함)를 요청한다. |  |  |
| **3** | 서버가 테이블에서 ID에 해당하는 레코드를 찾아 코드와 언어 정보를 반환한다. |  |  |
| **4** | 시스템이 응답받은 언어로 IDE 언어를 자동 변경한다. |  |  |
| **5** | 시스템이 응답받은 코드를 IDE 편집기 창에 덮어쓴다. |  |  |
| **6** | 시스템이 "제출 이력(ID: 150)을 불러왔습니다." 메시지를 표시한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **3** | 3a. 제출 이력을 찾을 수 없음
...3a1. 서버가 'Not Found' 또는 오류 응답을 반환한다.
...3a2. 시스템이 "해당 제출 내역을 불러올 수 없습니다." 메시지를 표시한다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 1.5 seconds |  |
| **Frequency** |  | 문제 풀이 시 간헐적으로 발생 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #42 : 코드 실행** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 작성한 코드를 사용자 정의 입력값으로 실행하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 사용자가 로그인 상태이며, 웹 IDE에 접근한 상태이다. |
| **Trigger** |  |  | 사용자가 '코드 실행' 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 코드 실행이 완료되고, 실행 결과가 반환된다. |
| **Failed Post Condition** |  |  | 코드 실행이 완료되고, 실행 결과가 반환된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자가 코드를 사용자 정의 입력으로 성공적으로 실행 요청한다. |  |  |
| **1** | 이 Use Case는 사용자가 '코드 실행' 버튼을 클릭할 때 시작된다. |  |  |
| **2** | 시스템은 IDE의 코드, 선택된 언어, '입력' 탭의 사용자 정의 입력값을 가져온다. |  |  |
| **3** | 시스템은 해당 정보(코드, 언어, 입력값)를 시스템에 실행을 요청한다. |  |  |
| **4** | 서버는 격리된 실행 환경에서 코드를 컴파일 및 실행한다. |  |  |
| **5** | 실행 환경이 2단계의 입력값을 프로그램의 표준 입력으로 전달한다. |  |  |
| **6** | 시스템이 실행 결과(stdout, stderr, 실행 시간, 메모리)를 캡처한다. |  |  |
| **7** | 서버가 캡처된 실행 결과를 클라이언트(UI)에 응답으로 반환한다. |  |  |
| **8** | 이 Use Case는 실행 결과가 반환되면 종료된다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **4** | 4a. 컴파일 에러 발생
...4a1. 실행 환경이 컴파일 에러 로그를 캡처한다.
...4a2. 7단계로 이동한다. |  |  |
| **5** | 5a. 런타임 에러 발생
...5a1. 실행 환경이 런타임 에러 로그(stderr)를 캡처한다.
...5a2. 7단계로 이동한다.
5b. 리소스 제한 초과
...5b1. 실행 환경이 프로세스를 강제 종료시킨다.
...5b2. 7단계로 이동한다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 5 seconds |  |
| **Frequency** |  | 문제 풀이 시 수시로 발생 |  |
| **<Concurrency>** |  | 다수 사용자의 동시 실행 요청 처리 필요 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #43 : 실행 결과 확인** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 코드 실행의 결과를 사용자에게 시각적으로 표시하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 코드 실행이 완료되어 서버로부터 응답을 받은 상태여야 한다. |
| **Trigger** |  |  | 코드 실행의 결과가 반환됐을 때 |
| **Success Post Condition** |  |  | 표준 출력(stdout) 또는 에러(stderr)가 사용자 화면의 '출력' 탭에 표시된다. |
| **Failed Post Condition** |  |  | 결과가 표시되지 않는다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 시스템이 '코드 실행'의 성공 결과를 화면에 표시한다. |  |  |
| **1** | 이 Use Case는 코드 실행으로부터 성공 결과(stdout, 실행 시간, 메모리)를 전달받으며 시작된다. |  |  |
| **2** | 시스템이 '출력' 탭을 활성화한다. |  |  |
| **3** | 시스템이 전달받은 표준 출력(stdout)을 '출력' 탭 내부에 표시한다. |  |  |
| **4** | 시스템이 실행 시간과 메모리 사용량을 '출력' 탭 상단 요약란에 표시한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **1** | 1a. 코드 실행이 에러(컴파일/런타임/시간초과)로 종료됨
...1a1. 시스템이 에러 결과(stderr 또는 에러 메시지)를 전달받는다.
...1a2. 시스템이 '출력' 탭을 활성화하고, 에러 로그를 붉은색 텍스트로 표시한다.
...1a3. 시스템이 요약란에 "컴파일 에러" 또는 "런타임 에러" 등을 표시한다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | 즉시 |  |
| **Frequency** |  | 코드 실행 시마다 발생 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #44 : 코드 제출** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 작성한 코드를 문제의 공식 테스트케이스로 채점해달라고 서버에 요청하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 사용자가 로그인 상태이며, 웹 IDE에 채점할 코드가 작성되어 있다. |
| **Trigger** |  |  | 사용자가 '제출' 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 채점 요청이 성공적으로 '채점 큐'에 등록되고, "채점 대기 중..." 상태가 표시된다. |
| **Failed Post Condition** |  |  | 큐 등록에 실패하고 "제출에 실패했습니다." 메시지가 표시된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자가 코드를 성공적으로 제출하여 채점 큐에 등록한다. |  |  |
| **1** | 이 Use Case는 사용자가 IDE의 '제출' 버튼을 클릭할 때 시작된다. |  |  |
| **2** | 시스템은 현재 편집기의 코드, 선택된 언어, 문제 ID를 가져온다. |  |  |
| **3** | 시스템은 해당 정보를 시스템에 채점을 요청한다. |  |  |
| **4** | 서버가 요청을 수신하고, '채점 큐 등록'을 트리거한다. |  |  |
| **5** | 서버가 "제출 완료. 채점을 진행합니다." 메시지를 반환한다. |  |  |
| **6** | 시스템이 '내 제출 목록' 탭으로 자동 전환되고, '채점 진행 상태 실시간 표시‘를 시작한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **3** | 3a. 코드 내용이 비어있음
...3a1. 시스템이 "코드를 입력해주세요." 메시지를 표시하고 제출을 중단한다. |  |  |
| **5** | 5a. 서버 오류
...5a1. 서버가 오류 응답을 반환한다.
...5a2. 시스템이 "제출에 실패했습니다. 잠시 후 다시 시도해주세요." 메시지를 표시한다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 1 second |  |
| **Frequency** |  | 문제당 평균 2~5회 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #45 : 채점 큐 등록 및 순차 처리** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 코드 제출 요청을 큐에 등록하고, 채점 서버가 순차적으로 작업을 가져가 처리하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | System level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | System |
| **Preconditions** |  |  | 코드 제출 요청이 서버에 성공적으로 수신되어야 한다. |
| **Trigger** |  |  | 서버가 채점 요청을 수신했을 때 |
| **Success Post Condition** |  |  | 채점 작업이 큐에서 채점 서버로 전달되어 '채점 진행 중(GRADING)' 상태가 된다. |
| **Failed Post Condition** |  |  | 큐 등록에 실패하거나, 채점 서버가 작업을 가져가지 못한다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 시스템이 채점 요청을 큐에 등록하고, 채점 서버가 작업을 시작한다. |  |  |
| **1** | 이 Use Case는 채점 요청(코드, 문제ID, 사용자ID)을 전달받으며 시작된다. |  |  |
| **2** | 시스템이 테이블에 해당 제출 건을 'PENDING' 상태로 생성한다. |  |  |
| **3** | 시스템이 채점 큐에 작업 메시지를 전송한다. |  |  |
| **4** | 대기 중이던 채점 서버가 큐에서 해당 작업 메시지를 가져온다. |  |  |
| **5** | 채점 서버가 테이블의 해당 건 상태를 'GRADING'으로 업데이트한다. |  |  |
| **6** | 이 Use Case는 채점 서버가 '테스트 케이스별 채점‘을 시작하면 종료된다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **3** | 3a. 채점 큐 등록 실패
...3a1. 시스템이 테이블의 해당 건 상태를 'SYSTEM_ERROR'로 변경한다.
...3a2. 사용자에게 "채점 시스템 오류가 발생했습니다." 메시지를 표시한다. |  |  |
| **4** | 4a. 채점 서버가 작업을 가져가지 못함
...4a1. 작업은 큐에서 'PENDING' 상태로 계속 대기한다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 0.1 second |  |
| **Frequency** |  | 실행 시마다 발생 |  |
| **<Concurrency>** |  | 큐를 통해 순차 처리 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #46 : 채점 진행 상태 실시간 표시** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 채점 큐 및 채점 과정의 현재 상태를 사용자 UI에 실시간으로 갱신하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | System level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | System |
| **Preconditions** |  |  | 사용자가 코드 제출을 완료하여 '내 제출 목록' 탭을 보고 있어야 한다. |
| **Trigger** |  |  | 테이블의 상태 또는 진행률이 변경될 때 |
| **Success Post Condition** |  |  | 사용자 UI에 '채점 대기 중', '채점 진행 중 (3/10)', '성공' 등의 상태가 실시간으로 표시된다. |
| **Failed Post Condition** |  |  | 상태 갱신에 실패하고, 마지막 상태(예: '채점 대기 중...')에 머무른다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 시스템이 채점 상태를 '대기' -> '진행 중' -> '완료' 순서로 UI에 갱신한다. |  |  |
| **1** | 이 Use Case는 사용자가 '내 제출 목록' 탭에 진입할 때 시작된다. |  |  |
| **2** | 시스템이 1초마다 서버에 채점 상태를 폴링 요청한다. |  |  |
| **3** | 서버가 'PENDING' 상태를 반환하고, UI에 "채점 대기 중..."이 표시된다. |  |  |
| **4** | 서버가 'GRADING', 'currentTestCase: 1', 'totalTestCases: 10'을 반환한다. |  |  |
| **5** | 시스템이 UI에 "채점 진행 중... (1/10)"을 표시한다. |  |  |
| **6** | 서버가 'CA'(Accepted) 상태와 최종 결과를 반환한다. |  |  |
| **7** | 시스템이 UI에 "성공"을 표시하고, 폴링을 중지한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **6** | 6a. 채점 실패
...6a1. 서버가 'WA' 상태를 반환한다.
...6a2. 시스템이 UI에 "실패"를 표시하고 폴링을 중지한다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 1 second |  |
| **Frequency** |  | 채점 진행 중 1초마다 발생 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #47 : 테스트 케이스별 채점** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 채점 서버가 격리된 환경에서 각 테스트 케이스를 순차적으로 실행하고 결과를 검증하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | System level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | System |
| **Preconditions** |  |  | 채점 큐 처리가 작업을 'GRADING' 상태로 전환해야 한다. |
| **Trigger** |  |  | 채점 서버가 작업을 시작할 때 |
| **Success Post Condition** |  |  | 모든 테스트케이스의 채점이 완료되고, 케이스별 결과가 DB에 기록된다. |
| **Failed Post Condition** |  |  | 채점 중 시스템 오류가 발생하여 'SYSTEM_ERROR' 상태가 된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 채점 서버가 모든 테스트케이스를 순차적으로 실행하고 '성공’ 판정을 내린다. |  |  |
| **1** | 이 Use Case는 'GRADING' 상태를 전달받으며 시작된다. |  |  |
| **2** | 시스템이 해당 문제의 테스트케이스 파일을 스토리지에서 로드한다. |  |  |
| **3** | 시스템이 격리된 환경에서 TC(n)의 입력값으로 코드를 실행한다. |  |  |
| **4** | 실행 결과를 (시간, 메모리, 표준 출력) 캡처한다. |  |  |
| **5** | 실제 출력을 TC(n)의 기대 출력과 비교하여 '통과' 여부를 판정한다. |  |  |
| **6** | DB에 진행률을 업데이트한다. |  |  |
| **7** | 케이스별 결과를 임시 저장한다. |  |  |
| **8** | 모든 케이스가 '통과'했는지 확인한다. |  |  |
| **9** | 시스템이 최종 판정을 'CA'로 내리고, 총 실행 시간, 최대 메모리 사용량, 통과 케이스 수(10/10)를 DB에 저장한다. |  |  |
| **10** | 이 Use Case는 '채점 결과 리포트 제공'을 트리거하며 종료된다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **5** | 5a. 실패
...5a1. 시스템이 실제 출력이 기대 출력과 다름을 확인한다.
...5a2. 시스템이 즉시 채점을 중단한다.
...5a3. 9단계로 이동하여 최종 판정을 'WA', 통과 케이스 수(5/10), 실패 케이스(6)로 DB에 저장한다.
5b. 특정 케이스 '시간 초과(TLE)'
...5b1. 시스템이 실행 시간이 문제의 제한 시간(예: 2초)을 초과함을 감지한다.
...5b2. 시스템이 프로세스를 강제 종료하고 채점을 중단한다.
...5b3. 9단계로 이동하여 최종 판정을 'TLE', 통과 케이스 수(6/10)로 DB에 저장한다.
5c. 컴파일 에러
...5c1. 시스템이 코드 컴파일에 실패한다.
...5c2. 9단계로 이동하여 최종 판정을 'CE'로 DB에 저장한다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | 테스트 케이스 수 + 오버헤드 |  |
| **Frequency** |  | 채점 시마다 발생 |  |
| **<Concurrency>** |  | 다수의 채점 서버가 병렬로 각기 다른 제출 건을 처리 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #48 : 채점 결과 리포트 제공** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | '테스트케이스별 채점'이 완료된 후, 최종 결과와 상세 리포트를 사용자에게 표시하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | '테스트 케이스별 채점'이 완료되어 DB에 최종 결과가 저장된 상태여야 한다. |
| **Trigger** |  |  | '채점 진행 상태 표시'가 '완료'로 변경될 때
사용자가 '내 제출 목록'에서 이미 채점이 완료된 항목을 클릭할 때 |
| **Success Post Condition** |  |  | 최종 결과와 상세 채점 리포트(케이스별 시간/메모리)가 화면에 표시된다. |
| **Failed Post Condition** |  |  | 리포트 데이터를 불러오는 데 실패한다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자가 '성공(Accepted)'한 제출 건의 상세 리포트를 확인한다. |  |  |
| **1** | 이 Use Case는 '채점 진행 상태 표시'가 '성공'으로 갱신될 때 시작된다. |  |  |
| **2** | 시스템(UI)이 '내 제출 목록' 탭의 요약 정보(상태: '성공', 시간: 0.8s, 메모리: 20MB)를 갱신한다. |  |  |
| **3** | 사용자가 해당 제출 건을 클릭하여 상세 리포트 뷰로 이동한다. |  |  |
| **4** | 시스템이 테이블의 상세 결과(케이스별 통과 여부, 시간, 메모리)를 조회한다. |  |  |
| **5** | 시스템이 조회된 결과를 표 형태로 제공한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **1** | 1a. 채점 결과가 '실패'인 경우
...1a1. 상태가 '실패'로 갱신된다.
...1a2. 사용자가 상세 리포트 뷰로 이동한다.
...1a3. 시스템이 케이스별 결과를 표시한다.
...1a4. 시스템이 '실패 케이스 상세 비교'를 활성화(표시)한다.
1b. 채점 결과가 '컴파일 에러'인 경우
...1b1. 상태가 '컴파일 에러'로 갱신된다.
...1b2. 사용자가 상세 리포트 뷰로 이동한다.
...1b3. 시스템이 "테스트 케이스를 실행하지 못했습니다." 메시지와 함께 '컴파일 에러' 로그를 표시한다. |  |  |
| **4** | 4a. 상세 리포트 조회 실패
...4a1. 시스템이 "상세 리포트를 불러오는 데 실패했습니다." 메시지를 표시한다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 1 second |  |
| **Frequency** |  | 채점 완료 시마다, 또는 제출 이력 조회 시 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #49 : 실패 케이스 상세 비교** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 채점 결과가 '실패'일 경우, 틀린 테스트케이스의 '입력값', '기대 출력', '사용자 출력'을 비교하여 표시하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | '채점 결과 리포트'가 '실패' 상태로 표시되어 있어야 한다. |
| **Trigger** |  |  | 사용자가 '실패'로 표시된 테스트케이스의 '상세보기' 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 해당 테스트 케이스의 입력, 기대 출력, 실제 출력 내용이 팝업 또는 상세 뷰에 표시된다. |
| **Failed Post Condition** |  |  | 상세 데이터를 불러오지 못하고 "실패 케이스 정보를 불러올 수 없습니다." 메시지가 표시된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자가 실패한 테스트 케이스의 상세 정보를 성공적으로 확인한다. |  |  |
| **1** | 이 Use Case는 사용자가 '채점 결과 리포트' 화면에서 '실패'로 표시된 테스트 케이스를 클릭할 때 시작된다. |  |  |
| **2** | 시스템이 해당 제출 건의 '실패 케이스 상세 정보'(입력, 기대 출력, 실제 출력)를 서버에 요청한다. |  |  |
| **3** | 서버가 테스트케이스의 상세 데이터를 반환한다. |  |  |
| **4** | 시스템이 "실패한 테스트케이스 (6/10)"라는 제목의 팝업 또는 뷰를 표시한다. |  |  |
| **5** | 시스템이 "입력", "기대 출력", "내 출력"을 3단으로 비교하여 명확하게 보여준다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **3** | 3a. 상세 정보 로드 실패
...3a1. 시스템이 "실패 케이스 정보를 불러오는 데 실패했습니다." 메시지를 표시한다. |  |  |
| **5** | 5a. 출력 내용이 매우 긴 경우
...5a1. 시스템이 각 항목을 스크롤 가능한 텍스트 영역으로 표시하고, "내용이 너무 길어 일부만 표시됩니다." 메시지를 추가한다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 1 second |  |
| **Frequency** |  | 채점 실패 시 사용자가 디버깅을 위해 조회할 때 발생 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #50 : 제출 이력 관리** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 IDE 내 '내 제출 목록' 탭에서 자신의 모든 제출 이력(성공, 실패, 채점 중, 임시 저장 등)을 조회하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 사용자가 로그인 상태이며, 웹 IDE에 접근한 상태이다. |
| **Trigger** |  |  | 사용자가 IDE의 '내 제출 목록' 탭을 클릭할 때 |
| **Success Post Condition** |  |  | 해당 문제에 대한 모든 제출 이력이 최신순으로 정렬되어 목록에 표시된다. |
| **Failed Post Condition** |  |  | 이력을 불러오지 못하고 "제출 내역을 불러올 수 없습니다." 메시지가 표시된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자가 '내 제출 목록' 탭에서 자신의 모든 제출 이력을 성공적으로 조회한다. |  |  |
| **1** | 이 Use Case는 사용자가 IDE의 '내 제출 목록' 탭을 클릭할 때 시작된다. |  |  |
| **2** | 시스템이 서버에 해당 문제의 모든 제출 이력을 요청한다. |  |  |
| **3** | 서버가 테이블에서 해당 사용자와 문제 ID로 모든 제출 건을 조회하여 반환한다. |  |  |
| **4** | 시스템이 반환된 목록(상태, 시간, 메모리, 언어, 제출 시각)을 최신순으로 정렬하여 UI에 표시한다. |  |  |
| **5** | 사용자가 목록에서 특정 항목을 클릭한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **3** | 3a. 제출 이력이 전혀 없음
...3a1. 서버가 빈 목록을 반환한다.
...3a2. 시스템이 "아직 제출 기록이 없습니다." 메시지를 표시한다.
3b. 서버 통신 실패
...3b1. 시스템이 "제출 내역을 불러오는 데 실패했습니다." 메시지를 표시한다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 1.5 seconds |  |
| **Frequency** |  | IDE 사용 시 수시로 발생 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #51 : 제출 이력 비교** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 '내 제출 목록'에서 두 개의 다른 제출 이력을 선택하여 코드 및 성능 차이를 비교하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 제출 이력 관리 목록이 표시되어 있고, 2개 이상의 제출 이력이 존재해야 한다. |
| **Trigger** |  |  | 사용자가 '내 제출 목록'에서 2개의 항목을 선택하고 '비교하기' 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 두 제출 건의 코드 및 성능(시간, 메모리) 차이가 팝업 또는 새 뷰에 표시된다. |
| **Failed Post Condition** |  |  | 비교에 실패하고 "제출 내역을 비교할 수 없습니다." 메시지가 표시된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자가 두 개의 제출 이력을 선택하여 코드와 성능을 성공적으로 비교한다. |  |  |
| **1** | 이 Use Case는 사용자가 '내 제출 목록'에서 비교할 두 항목의 체크박스를 선택할 때 시작된다. |  |  |
| **2** | 사용자가 목록 상단의 '비교하기' 버튼을 클릭한다. |  |  |
| **3** | 시스템이 두 제출 건의 상세 정보(코드, 시간, 메모리)를 서버에 각각 요청한다. |  |  |
| **4** | 서버가 각 제출 건의 상세 정보를 반환한다. |  |  |
| **5** | 시스템이 별도의 팝업 뷰를 표시한다. |  |  |
| **6** | 팝업 뷰 상단에 두 제출 건의 성능 차이를 요약 표시한다. |  |  |
| **7** | 팝업 뷰 하단에 두 코드의 차이점을 나란히 시각화하여 표시한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **1** | 1a. 항목을 1개 또는 3개 이상 선택함
...1a1. 시스템이 '비교하기' 버튼을 비활성화하거나, "비교는 2개의 항목만 가능합니다." 메시지를 표시한다. |  |  |
| **3** | 3a. 상세 정보 로드 실패
...3a1. 시스템이 "선택한 제출 내역을 비교할 수 없습니다." 메시지를 표시한다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 2 seconds |  |
| **Frequency** |  | 디버깅 또는 코드 개선 확인 시 간헐적으로 발생 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.11.24 |  |

| **Use case #52 : 성능 데이터 통계 및 시각화** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | '채점 결과 리포트'에서 측정된 테스트케이스별 성능 데이터를 그래프 및 표 형태로 시각화하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | '채점 결과 리포트'가 화면에 표시된 상태여야 한다. |
| **Trigger** |  |  | 사용자가 '채점 결과 리포트' 화면 내의 '성능 분석' 탭 또는 '그래프 보기' 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 테스트 케이스별 실행 시간 및 메모리 사용량이 꺾은선 그래프 또는 막대 차트로 화면에 표시된다. |
| **Failed Post Condition** |  |  | 데이터 로드에 실패하고 "성능 데이터를 시각화할 수 없습니다." 메시지가 표시된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자가 채점 결과의 성능 데이터를 그래프로 확인한다. |  |  |
| **1** | 이 Use Case는 사용자가 '채점 결과 리포트'에서 '성능 분석' 탭을 클릭할 때 시작된다. |  |  |
| **2** | 시스템이 '채점 결과 리포트'에서 사용된 테스트 케이스별 성능 데이터를 가져온다. |  |  |
| **3** | 시스템이 이 데이터를 차트 라이브러리를 사용하여 렌더링한다. |  |  |
| **4** | '실행 시간' 꺾은선 그래프 (X축: 테스트 케이스 번호, Y축: 시간(ms))가 표시된다. |  |  |
| **5** | '메모리 사용량' 막대 그래프 (X축: 테스트 케이스 번호, Y축: 메모리(KB))가 표시된다. |  |  |
| **6** | 사용자가 그래프의 특정 데이터 포인트에 마우스를 올리면 상세 수치(툴팁)가 표시된다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **2** | 2a. 성능 데이터를 불러올 수 없음
...2a1. 시스템이 "데이터가 충분하지 않아 그래프를 생성할 수 없습니다." 메시지를 표시한다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 1 second |  |
| **Frequency** |  | 채점 결과 조회 시 간헐적으로 발생 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.15 |  |

| **Use case #53 : 알고리즘 시간 복잡도 추정** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 수집된 성능 데이터(입력 크기 대비 실행 시간)를 기반으로 알고리즘의 시간 복잡도(Big-O)를 추정하여 표시하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | '성능 데이터 시각화'가 완료되어 그래프가 표시된 상태여야 한다. |
| **Trigger** |  |  | 사용자가 '성능 분석' 탭에서 '복잡도 분석' 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 추정된 복잡도 결과가 그래프 및 텍스트로 표시된다. |
| **Failed Post Condition** |  |  | 데이터가 불충분하여 "복잡도를 추정할 수 없습니다." 메시지가 표시된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자가 자신의 코드에 대한 예상 시간 복잡도를 확인한다. |  |  |
| **1** | 이 Use Case는 사용자가 '성능 분석' 탭에서 '복잡도 분석' 버튼을 클릭할 때 시작된다. |  |  |
| **2** | 시스템이 서버에 테스트 케이스별 (입력 크기, 실행 시간) 데이터를 전송하여 복잡도 추정을 요청한다. |  |  |
| **3** | 서버가 수신된 데이터를 O(1), O(log N), O(N), O(N log N), O(N²) 등 후보 모델과 비교(피팅)한다. |  |  |
| **4** | 서버가 가장 적합도가 높은 모델(예: 'O(N²)')과 신뢰도(예: R²=0.95)를 반환한다. |  |  |
| **5** | 시스템이 그래프 영역에 "예상 시간 복잡도: O(N²) (신뢰도: 95%)" 메시지를 표시한다. |  |  |
| **6** | 시스템이 실제 데이터(산점도)와 추정된 모델(곡선)을 그래프에 함께 렌더링한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **4** | 4a. 데이터가 불충분하거나 신뢰도가 매우 낮음
...4a1. 서버가 "추정 불가" 응답을 반환한다.
...4a2. 시스템이 "데이터가 부족하여 복잡도를 추정할 수 없습니다. (추정 결과는 참고용입니다)" 메시지를 표시한다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 2 seconds |  |
| **Frequency** |  | 디버깅 또는 코드 개선 확인 시 간헐적으로 발생 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.15 |  |

| **Use case #54 : 비효율적 코딩 패턴 탐지** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 코드를 실행하지 않고(정적 분석), 비효율적인 패턴(예: 과도한 중첩 루프, 재귀 깊이)을 탐지하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 코드가 IDE에 작성되어 있다. |
| **Trigger** |  |  | 사용자가 IDE의 '코드 분석' 버튼을 클릭하거나, '제출' 시 자동으로 실행될 때 |
| **Success Post Condition** |  |  | 탐지된 비효율적인 패턴 목록이 '코드 분석' 탭에 표시된다. |
| **Failed Post Condition** |  |  | "분석 중 오류가 발생했습니다." 또는 "탐지된 비효율 패턴이 없습니다." 메시지가 표시된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자가 '코드 분석'을 요청하여 비효율적인 패턴 목록을 확인한다. |  |  |
| **1** | 이 Use Case는 사용자가 IDE 하단의 '코드 분석' 탭을 클릭할 때 시작된다. |  |  |
| **2** | 시스템이 현재 IDE의 코드를 정적 분석 엔진으로 전송한다. |  |  |
| **3** | 서버가 코드를 파싱하여 분석 가능한 구조를 생성한다. |  |  |
| **4** | 서버가 미리 정의된 규칙을 대조하여 검사한다. |  |  |
| **5** | 서버가 탐지된 항목(라인 번호, 규칙 ID, 요약) 목록을 반환한다. |  |  |
| **6** | 시스템이 "총 2개의 비효율적인 패턴이 탐지되었습니다." 메시지와 함께 목록을 '분석' 탭에 표시한다. |  |  |
| **7** | 사용자가 목록의 특정 항목을 클릭하면 '코드 개선 가이드'가 실행된다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **5** | 5a. 탐지된 항목이 없음
...5a1. 서버가 빈 목록을 반환한다.
...5a2. 시스템이 "탐지된 비효율 패턴이 없습니다. 코드가 효율적입니다!" 메시지를 표시한다.
5b. 정적 분석 실패
...5b1. 서버가 "코드 파싱 실패" 오류를 반환한다.
...5b2. 시스템이 "구문 오류로 인해 코드 분석을 실행할 수 없습니다." 메시지를 표시한다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 3 seconds |  |
| **Frequency** |  | 코드 작성 완료 후 또는 제출 시 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.15 |  |

| **Use case #55 : 코드 개선 가이드 제공** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | ‘비효율적 코딩 패턴 탐지'에서 탐지된 항목에 대한 상세 설명과 개선 가이드를 제공하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | System level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | '비효율적 코딩 패턴 탐지'가 완료되어 1개 이상의 항목이 '분석' 탭에 표시되어 있다. |
| **Trigger** |  |  | 사용자가 '분석' 탭의 특정 탐지 항목을 클릭할 때 |
| **Success Post Condition** |  |  | 해당 항목에 대한 상세 설명과 개선 예시 코드가 팝업 또는 상세 뷰에 표시된다. |
| **Failed Post Condition** |  |  | 가이드 정보를 불러오지 못한다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자가 탐지된 비효율 패턴의 개선 가이드를 확인한다. |  |  |
| **1** | 이 Use Case는 사용자가 '분석' 탭의 항목을 클릭할 때 시작된다. |  |  |
| **2** | 시스템이 해당 규칙 ID에 매핑된 개선 가이드를 조회한다. |  |  |
| **3** | 시스템이 "개선 가이드" 팝업 또는 상세 뷰를 표시한다. |  |  |
| **4** | 뷰에 상세 설명을 표시한다. |  |  |
| **5** | 뷰에 'Before'(사용자 코드)와 'After'(개선 예시) 코드를 나란히 비교하여 표시한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **2** | 2a. 매핑된 가이드 정보가 없음
...2a1. 시스템이 "상세 가이드 정보가 준비되지 않았습니다." 메시지를 표시한다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 0.5 seconds |  |
| **Frequency** |  | '비효율적 코딩 패턴 탐지' 실행 후 사용자가 클릭 시 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.15 |  |

| **Use case #56 : 라인별 실행 시간 및 호출 횟수 분석** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 코드 실행 시 각 라인(줄)이 몇 번 호출되고, 얼마나 많은 시간을 소요했는지 측정하여 IDE에 시각화하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | '코드 실행'이 성공적으로 완료된 상태여야 한다. |
| **Trigger** |  |  | 사용자가 '코드 실행' 완료 후 결과 탭의 '프로파일링 보기' 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | IDE 편집기 여백에 라인별 실행 시간/호출 횟수가 표시되고, 병목 구간이 히트맵으로 강조된다. |
| **Failed Post Condition** |  |  | 프로파일링에 실패하고 "라인별 분석에 실패했습니다." 메시지가 표시된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자가 코드의 병목 구간을 라인별 프로파일러를 통해 확인한다. |  |  |
| **1** | 이 Use Case는 사용자가 '코드 실행' 결과 창에서 '프로파일링 보기' 버튼을 클릭할 때 시작된다. |  |  |
| **2** | 시스템이 '프로파일링 모드'로 코드를 재실행하도록 서버에 요청한다. |  |  |
| **3** | 서버가 라인별 실행 시간과 호출 횟수를 수집하여 반환한다. |  |  |
| **4** | 시스템이 IDE 편집기 여백에 라인별 횟수와 시간을 표시한다. |  |  |
| **5** | 시스템이 시간이 많이 소요된 라인(병목 구간)을 붉은색 계열의 히트맵으로 강조 표시한다. |  |  |
| **6** | 사용자가 히트맵이 표시된 라인을 클릭하면, 해당 라인의 상세 정보가 팝업으로 표시된다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **2** | 2a. 프로파일링이 지원되지 않는 언어
...2a1. 시스템이 "선택하신 언어는 라인별 프로파일링을 지원하지 않습니다." 메시지를 표시한다. |  |  |
| **3** | 3a. 프로파일링 실패
...3a1. 서버가 에러를 반환한다.
...3a2. 시스템이 "프로파일링 실행 중 오류가 발생했습니다." 메시지를 표시한다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 10 seconds |  |
| **Frequency** |  | 코드 최적화 필요 시 간헐적으로 발생 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.15 |  |

| **Use case #57 : 알고리즘 동작 애니메이션 시각화** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 제출한(또는 예시) 코드의 알고리즘 실행 과정을 애니메이션으로 시각화하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | '채점 결과 리포트'가 표시된 상태이거나, 시각화를 지원하는 특정 문제 페이지에 있어야 한다. |
| **Trigger** |  |  | 사용자가 '채점 결과' 화면에서 '알고리즘 시각화' 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 코드와 연동되는 애니메이션 뷰어가 표시되고 애니메이션이 재생된다. |
| **Failed Post Condition** |  |  | 시각화에 실패하고 "알고리즘을 시각화할 수 없습니다." 메시지가 표시된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자가 자신의 '버블 정렬' 코드 실행 과정을 애니메이션으로 확인한다. |  |  |
| **1** | 이 Use Case는 사용자가 '채점 결과' 화면에서 '알고리즘 시각화' 버튼을 클릭할 때 시작된다. |  |  |
| **2** | 시스템이 코드를 시각화 엔진(서버)으로 전송한다. |  |  |
| **3** | 시각화 엔진이 코드를 실행하며, 주요 변수의 상태 변화를 단계별 로그로 생성한다. |  |  |
| **4** | 시스템이 코드 편집기 옆에 시각화 뷰어와 제어판을 표시한다. |  |  |
| **5** | 시스템이 3단계의 로그를 기반으로 배열의 상태 변화를 애니메이션으로 렌더링한다. |  |  |
| **6** | 애니메이션 각 단계(Step)에 맞춰, 현재 실행 중인 코드 라인이 IDE에서 하이라이트된다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **3** | 3a. 시각화가 지원되지 않는 코드 또는 알고리즘
...3a1. 시각화 엔진이 "시각화 지원 불가" 응답을 반환한다.
...3a2. 시스템이 "이 코드는 자동 시각화를 지원하지 않습니다." 메시지를 표시한다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 5 seconds |  |
| **Frequency** |  | 알고리즘 이해 필요 시 간헐적으로 발생 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.15 |  |

| **Use case #58 : 시각화 재생, 일시정지, 속도 조절** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | '알고리즘 동작 애니메이션'의 재생, 일시정지, 단계 이동, 속도 조절을 제어하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | System level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | '알고리즘 동작 애니메이션' 뷰어가 활성화된 상태여야 한다. |
| **Trigger** |  |  | 사용자가 시각화 뷰어의 제어판을 조작할 때 |
| **Success Post Condition** |  |  | 애니메이션이 사용자의 조작에 맞게 즉시 반응한다. |
| **Failed Post Condition** |  |  | 제어판 조작이 애니메이션에 반영되지 않는다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자가 애니메이션을 제어하여 단계별 동작을 확인한다. |  |  |
| **1** | 이 Use Case는 '알고리즘 동작 애니메이션' 제어판을 사용자가 조작할 때 시작된다. |  |  |
| **2** | 사용자가 '일시정지' 버튼을 클릭한다. |  |  |
| **3** | 시스템이 애니메이션 렌더링 루프를 중지하고, 코드 하이라이트도 해당 라인에 고정된다. |  |  |
| **4** | 사용자가 '다음 단계' 버튼을 클릭한다. |  |  |
| **5** | 시스템이 애니메이션을 다음 단계로 1 프레임 이동시킨다. |  |  |
| **6** | 사용자가 '속도 조절' 슬라이더를 '2x'로 이동한다. |  |  |
| **7** | 시스템이 애니메이션 렌더링 속도 변수를 2배로 설정한다. |  |  |
| **8** | 사용자가 '재생' 버튼을 클릭하면, 2배속으로 렌더링 루프가 재개된다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 0.1 seconds |  |
| **Frequency** |  | '알고리즘 동작 애니메이션' 실행 중 수시로 발생 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.20 |  |

| **Use case #59 : 코드 기반 플로우 차트 자동 생성** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 작성한 코드를 분석하여 제어 흐름(if, for, while)을 플로우 차트로 자동 생성하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 코드가 IDE에 작성되어 있으며, 구문 오류가 없어야 한다. |
| **Trigger** |  |  | 사용자가 IDE의 '플로우 차트 보기' 탭/버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 코드의 제어 흐름을 나타내는 플로우 차트 다이어그램이 화면에 표시된다. |
| **Failed Post Condition** |  |  | "플로우 차트를 생성할 수 없습니다." 메시지가 표시된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자가 작성한 코드의 플로우 차트를 확인한다. |  |  |
| **1** | 이 Use Case는 사용자가 IDE 탭 메뉴에서 '플로우 차트'를 클릭할 때 시작된다. |  |  |
| **2** | 시스템이 현재 IDE의 코드를 플로우 차트 생성 엔진(서버)으로 전송한다. |  |  |
| **3** | 서버가 코드를 파싱하여 제어 흐름(조건문, 반복문, 함수 호출)을 분석한다. |  |  |
| **4** | 서버가 다이어그램 데이터를 생성하여 클라이언트에 반환한다. |  |  |
| **5** | 시스템이 반환된 데이터를 기반으로 플로우 차트 다이어그램을 렌더링한다. |  |  |
| **6** | 사용자가 차트의 'if (x > 0)' 노드를 클릭하자, IDE의 'if (x > 0)' 코드 라인이 하이라이트된다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **3** | 3a. 코드에 구문 오류(Syntax Error)가 있음
...3a1. 서버가 "코드 파싱 실패" 응답을 반환한다.
...3a2. 시스템이 "구문 오류가 있어 플로우 차트를 생성할 수 없습니다." 메시지를 표시한다.
3b. 너무 복잡한 코드
...3b1. 서버가 "코드가 너무 복잡하여 차트를 생성할 수 없습니다." 응답을 반환한다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 3 seconds |  |
| **Frequency** |  | 코드 이해 필요 시 간헐적으로 발생 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.20 |  |

| **Use case #60 : 플로우 차트 내보내기** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | '플로우 차트 자동 생성'에서 생성된 다이어그램을 이미지(PNG) 또는 PDF 파일로 다운로드하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | System level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | '플로우 차트 자동 생성'이 완료되어 다이어그램이 화면에 렌더링되어 있다. |
| **Trigger** |  |  | 사용자가 플로우 차트 뷰의 '내보내기' 버튼을 클릭하고 'PNG' 또는 'PDF'를 선택할 때 |
| **Success Post Condition** |  |  | 플로우 차트 다이어그램이 이미지(PNG) 또는 PDF 파일로 사용자의 로컬 컴퓨터에 다운로드된다. |
| **Failed Post Condition** |  |  | 파일 변환에 실패하고 "내보내기에 실패했습니다." 메시지가 표시된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자가 생성된 플로우 차트를 PNG 이미지 파일로 저장한다. |  |  |
| **1** | 이 Use Case는 사용자가 '플로우 차트' 뷰에서 '내보내기' -> 'PNG로 저장'을 클릭할 때 시작된다. |  |  |
| **2** | 시스템이 현재 렌더링된 다이어그램을 PNG 이미지 데이터로 변환한다. |  |  |
| **3** | 시스템이 브라우저의 파일 다운로드 기능을 트리거하여 'flow_chart.png' 파일 저장을 요청한다. |  |  |
| **4** | 사용자가 파일을 로컬 컴퓨터에 저장한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **1** | 1a. PDF로 저장
...1a1. 사용자가 'PDF로 저장'을 클릭한다.
...1a2. 시스템이 다이어그램을 PDF 데이터로 변환한다.
...1a3. 'flow_chart.pdf' 파일 저장을 요청한다. |  |  |
| **2** | 2a. 파일 변환 실패
...2a1. 시스템이 "파일 변환 중 오류가 발생했습니다." 메시지를 표시한다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 2 seconds |  |
| **Frequency** |  | 필요 시 간헐적으로 발생 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.20 |  |

| **Use case #61 : 개인 학습 대시보드** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자의 학습 성과(풀이 수, 정답률, 스트릭 등)를 요약 카드와 그래프로 제공하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 사용자가 로그인 상태여야 한다. |
| **Trigger** |  |  | 사용자가 '마이페이지' 또는 '대시보드' 메뉴를 클릭할 때 |
| **Success Post Condition** |  |  | 개인화된 학습 성과 요약(통계, 그래프, 취약 개념, 추천)이 화면에 표시된다. |
| **Failed Post Condition** |  |  | "대시보드 정보를 불러올 수 없습니다." 메시지가 표시된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자가 '마이페이지'에서 자신의 학습 현황을 한눈에 파악한다. |  |  |
| **1** | 이 Use Case는 사용자가 '마이페이지' 메뉴를 클릭할 때 시작된다. |  |  |
| **2** | 시스템이 서버에 사용자의 통합 통계 데이터를 요청한다. |  |  |
| **3** | 서버가 사용자의 학습 성과와 관련된 데이터(풀이 기록, 접속일 등)를 집계한다. |  |  |
| **4** | 서버가 총 풀이 수, 정답률, 평균 풀이 시간, 취약 개념 TOP 3, 학습 스트릭 등을 계산하여 반환한다. |  |  |
| **5** | 시스템이 이 데이터를 요약 카드와 그래프 형태로 렌더링한다. |  |  |
| **6** | 시스템이 '학습 스트릭 시각화'와 '맞춤형 문제 추천'을 화면에 함께 표시한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **4** | 4a. 서버 집계 실패
...4a1. 서버가 오류를 반환한다.
...4a2. 시스템이 “대시보드 정보를 불러오는 데 실패했습니다.” 메시지를 표시한다. |  |  |
| **6** | 6a. 사용자 역할이 ‘강사’인 경우
...6a1. ‘성취도 대시보드’의 강사 시나리오가 대신 실행된다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 2 seconds |  |
| **Frequency** |  | 하루 평균 1~2회 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.15 |  |

| **Use case #62 : 취약 개념 분석** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자의 오답 및 통과 기록을 문제 태그별로 분석하여 취약한 알고리즘 개념(예: DP)을 도출하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | System level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | System |
| **Preconditions** |  |  | ‘개인 학습 대시보드 제공’이 요청되거나, 주기적인 서버 배치 작업이 실행되어야 한다. |
| **Trigger** |  |  | '개인 학습 대시보드 제공'의 서버 집계 단계에서 함께 실행될 때 |
| **Success Post Condition** |  |  | 취약 개념이 식별되어 사용자 통계 데이터에 갱신되거나 대시보드로 반환된다. |
| **Failed Post Condition** |  |  | 분석에 실패하거나, 데이터가 부족하여 "분석 불가"로 처리된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 시스템이 사용자의 취약 개념을 성공적으로 분석한다. |  |  |
| **1** | 이 Use Case는 '개인 학습 대시보드'의 서버 집계 작업 중 시작된다. |  |  |
| **2** | 시스템이 해당 사용자의 모든 '실패(오답, 시간 초과)' 제출 이력을 조회한다. |  |  |
| **3** | 시스템이 실패한 문제에 연결된 태그를 카운트한다. |  |  |
| **4** | 시스템이 '성공'한 문제의 태그 카운트와 3단계의 실패 카운트를 비교하여 태그별 정답률을 계산한다. |  |  |
| **5** | 시스템이 정답률이 가장 낮은 순서로 "취약 개념 TOP 3"를 식별한다. |  |  |
| **6** | 이 Use Case는 식별된 '취약 개념' 목록을 '개인 학습 대시보드' 프로세스로 반환하며 종료된다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **2** | 2a. 제출 이력 부족
...2a1. 시스템이 분석을 중단하고 "데이터 부족"을 반환한다.
...2a2. "더 많은 문제를 풀면 취약점을 분석해 드립니다." 메시지를 표시한다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | 대시보드 로드 프로세스에 포함되어 실행됨 |  |
| **Frequency** |  | 대시보드 조회 시마다 또는 일일 배치 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.15 |  |

| **Use case #63 : 맞춤형 문제 및 강좌 추천** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | '취약 개념 분석' 결과를 기반으로 사용자에게 풀어볼 문제나 수강할 강좌를 추천하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | '개인 학습 대시보드'가 표시되어 있고, '취약 개념'이 1개 이상 도출된 상태여야 한다. |
| **Trigger** |  |  | 사용자가 대시보드의 '추천 문제' 탭을 클릭하거나, 대시보드 로드 시 함께 표시될 때 |
| **Success Post Condition** |  |  | 사용자의 취약 개념 및 난이도에 맞는 추천 문제/강좌 목록이 표시된다. |
| **Failed Post Condition** |  |  | "추천할 항목이 없습니다." 메시지가 표시된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자가 대시보드에서 자신의 취약점에 맞는 추천 문제를 확인한다. |  |  |
| **1** | 이 Use Case는 '개인 학습 대시보드'가 표시될 때 함께 시작된다. |  |  |
| **2** | 시스템이 분석된 '취약 개념'을 기반으로 서버에 추천 목록을 요청한다. |  |  |
| **3** | 서버가 문제 데이터베이스에서 문제 목록 3개를 조회한다. |  |  |
| **4** | 서버가 강좌 데이터베이스에서 연관 강좌 목록 1개를 조회한다. |  |  |
| **5** | 시스템이 "DP 개념이 부족하시네요! 이 문제를 풀어보세요:" 목록과 "연관 강좌" 목록을 대시보드에 표시한다. |  |  |
| **6** | 사용자가 추천 문제를 클릭하여 문제 풀이(IDE) 화면으로 이동한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **3** | 3a. 추천할 문제가 없음 (취약 개념이 없거나, 모두 품)
...3a1. 서버가 빈 목록을 반환한다.
...3a2. 시스템이 "추천할 문제가 없습니다. 잘하고 계십니다!" 메시지를 표시한다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 1.5 seconds |  |
| **Frequency** |  | 대시보드 조회 시마다 발생 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.15 |  |

| **Use case #64 : 연속 학습일 계산 및 시각화** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자의 일별 학습 활동(문제 풀이)을 기준으로 연속 학습일을 계산하고, 달력/배지 형태로 시각화하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | System level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | System, User |
| **Preconditions** |  |  | '개인 학습 대시보드'가 표시되어 있다. |
| **Trigger** |  |  | '개인 학습 대시보드'의 서버 집계 및 UI 렌더링 단계에서 실행된다. |
| **Success Post Condition** |  |  | '연속 X일 학습 중!' 메시지와 활동 내역이 달력(Heatmap)에 표시된다. |
| **Failed Post Condition** |  |  | 스트릭 정보가 0일로 표시된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 시스템이 사용자의 연속 학습일을 계산하고, 사용자가 대시보드에서 이를 확인한다. |  |  |
| **1** | 이 Use Case는 '개인 학습 대시보드'의 서버 집계 작업 중 시작된다. |  |  |
| **2** | 시스템이 해당 사용자의 제출 기록을 일별로 조회한다. |  |  |
| **3** | 시스템이 어제와 오늘 모두 제출 기록이 있는지, 그 이전 날짜들도 연속되는지 확인하여 '연속 학습일'을 계산한다. |  |  |
| **4** | 시스템이 이 값을 사용자 통계 데이터에 갱신하고, '개인 학습 대시보드'로 반환한다. |  |  |
| **5** | 시스템이 "연속 7일 학습 중!" 배지를 표시한다. |  |  |
| **6** | 시스템이 월간 달력 뷰에 제출 기록이 있는 날짜를 히트맵(잔디)으로 시각화한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **3** | 3a. 어제 제출 기록이 없음
...3a1. 시스템이 스트릭을 0일로 계산한다.
...3a2. "연속 학습일이 끊겼습니다." 또는 "오늘 첫 학습!" 메시지를 표시한다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | 대시보드 로드 프로세스에 포함되어 실행됨 |  |
| **Frequency** |  | 대시보드 조회 시마다 발생 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.20 |  |

| **Use case #65 : 학습 알림 및 리마인더** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자의 학습 빈도 또는 미접속 기간을 분석하여 격려 또는 리마인드 알림(이메일, 푸시)을 전송하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | System level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | System, User |
| **Preconditions** |  |  | 사용자가 '학습 목표 설정'에서 알림 수신에 동의해야 한다. |
| **Trigger** |  |  | 서버의 주기적인 배치 작업이 사용자가 설정한 리마인더 시간에 실행될 때 |
| **Success Post Condition** |  |  | 조건에 맞는 사용자에게 "오늘의 챌린지에 도전하세요!" 또는 "3일간 접속하지 않았습니다." 등의 알림이 발송된다. |
| **Failed Post Condition** |  |  | 알림 발송에 실패한다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 시스템이 미접속 사용자에게 학습 리마인드 알림을 성공적으로 발송한다. |  |  |
| **1** | 이 Use Case는 매일 저녁 8시 30분에 서버의 주기적인 배치 작업이 실행될 때 시작된다. |  |  |
| **2** | 시스템이 '챌린지 모드'를 선택했으나 오늘 챌린지를 완료하지 않은 사용자 목록을 조회한다. |  |  |
| **3** | 시스템이 2단계의 사용자들에게 "오늘의 챌린지를 아직 완료하지 않았습니다!" 푸시 알림/이메일을 발송한다. |  |  |
| **4** | 시스템이 '최근 접속일'이 3일 전인 사용자 목록을 조회한다. |  |  |
| **5** | 시스템이 4단계의 사용자들에게 "오랜만이에요! 다시 학습을 시작해볼까요?" 리마인드 알림을 발송한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **3** | 3a. 사용자가 알림을 거부함
...3a1. 시스템이 알림 발송 대상에서 제외한다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | N/A |  |
| **Frequency** |  | 매일 1회 |  |
| **<Concurrency>** |  | N/A |  |
| **Due Date** |  | 2025.12.20 |  |

| **Use case #66 : 챌린지 모드** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 '챌린지 모드'에 참여하여 매일 랜덤으로 주어지는 5개의 문제를 푸는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 사용자가 로그인 상태여야 한다. |
| **Trigger** |  |  | 사용자가 '챌린지' 페이지 메뉴를 클릭할 때 |
| **Success Post Condition** |  |  | "오늘의 챌린지" 문제 5개가 표시되고, 사용자는 챌린지 문제 풀이를 시작한다. |
| **Failed Post Condition** |  |  | "챌린지 문제를 불러올 수 없습니다." 메시지가 표시된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자가 오늘의 챌린지 문제 5개를 확인하고 풀이를 시작한다. |  |  |
| **1** | 이 Use Case는 사용자가 '챌린지' 페이지를 클릭할 때 시작된다. |  |  |
| **2** | 시스템이 "지금부터 챌린지 모드를 시작하시겠습니까?" 확인창을 표시한다. |  |  |
| **3** | 사용자가 '확인'을 클릭하고, 시스템은 사용자의 '학습 목표'에 챌린지 모드를 추가한다. |  |  |
| **4** | 시스템이 서버에 "오늘의 챌린지" 문제 목록을 요청한다. |  |  |
| **5** | 서버가 유형별 랜덤 문제 5개를 오늘의 챌린지로 생성(선정)한다. |  |  |
| **6** | 서버가 문제 목록 5개를 반환한다. |  |  |
| **7** | 시스템이 "오늘의 챌린지 (0/5)" 목록과 진행률을 표시한다. |  |  |
| **8** | 사용자가 목록에서 첫 번째 문제를 클릭하여 IDE 화면으로 이동하고 풀이를 시작한다. |  |  |
| **9** | 사용자가 5문제를 모두 '성공'하면, "오늘의 챌린지 완료!" 배지가 표시된다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **3** | 3a. 최초 진입 시 '취소' 클릭
...3a1. 시스템이 챌린지 모드를 활성화하지 않고, 페이지 설명만 표시한다. |  |  |
| **5** | 5a. 서버가 문제 목록 생성 실패
...5a1. 서버가 오류를 반환한다.
...5a2. 시스템이 "오늘의 챌린지 문제를 불러오는 데 실패했습니다." 메시지를 표시한다. |  |  |
| **9** | 9a. 챌린지 모드 해제
...9a1. 사용자가 '마이페이지' -> '학습 목표 설정'에서 챌린지 모드를 삭제한다.
...9a2. 시스템이 "챌린지 모드를 해제하시겠습니까?" 확인창을 표시한다.
...9a3. '확인' 시 챌린지 모드가 비활성화된다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 2 seconds |  |
| **Frequency** |  | 챌린지 참여자당 매일 1회 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.20 |  |

| **Use case #67 : 성취도 대시보드** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자의 역할(학습자/강사)에 따라 맞춤형 성취도 대시보드를 제공하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User, Instructor |
| **Preconditions** |  |  | 사용자가 로그인 상태여야 한다. |
| **Trigger** |  |  | 사용자가 '마이페이지' 또는 '대시보드' 메뉴를 클릭할 때 |
| **Success Post Condition** |  |  | 사용자의 역할에 맞는(학습자용/강사용) 대시보드 UI와 데이터가 표시된다. |
| **Failed Post Condition** |  |  | 대시보드 데이터를 불러오지 못한다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 학습자(User)가 자신의 학습 성취도 대시보드를 확인한다. |  |  |
| **1** | 이 Use Case는 학습자(User)가 '마이페이지'를 클릭할 때 시작된다. |  |  |
| **2** | 시스템이 '개인 학습 대시보드 제공' 기능을 실행한다. |  |  |
| **3** | 학습자용 대시보드(개인 학습 진도, 풀이 수, 정답률, Q&A 등록 글 수, 챌린지 성취율 등)가 표시된다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **3** | 3a. 데이터 집계 실패
...3a1. 서버가 오류를 반환한다.
...3a2. 시스템이 "강사 대시보드 정보를 불러올 수 없습니다." 메시지를 표시한다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 2 seconds |  |
| **Frequency** |  | 하루 평균 1~2회 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.20 |  |

| **Use case #68 : 내 풀이 공유(공개/비공개 설정)** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 자신이 푼 문제의 풀이를 공개하거나 비공개로 설정하여 공유 범위를 관리하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 사용자가 문제 풀이를 완료하고 제출한 상태여야 한다. |
| **Trigger** |  |  | ‘풀이 공유 설정’ 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 풀이가 공개/비공개 설정에 따라 다른 사용자에게 표시 혹은 숨김 처리된다. |
| **Failed Post Condition** |  |  | 설정 변경 실패 시 “공유 설정을 저장할 수 없습니다.” 메시지 출력 |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자는 자신의 풀이를 공유할 수 있다. |  |  |
| **1** | 사용자가 마이페이지 또는 문제 상세의 ‘내 풀이’ 메뉴를 연다. |  |  |
| **2** | ‘공개 설정’ 버튼을 클릭하고 공개/비공개 옵션을 선택한다. |  |  |
| **3** | 시스템이 선택값을 DB에 반영한다. |  |  |
| **4** | 공개 설정이 즉시 반영되어 다른 사용자 조회에 적용된다. |  |  |
| **5** | 이 Use case는 문제가 성공적으로 공개 또는 비공개 처리가 되면 종료된다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **2** | 2a. 네트워크 오류 발생
...2a1. 임시 저장 후 재시도 요청 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 1 seconds |  |
| **Frequency** |  | 하루 평균 1~2회 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.15 |  |

| **Use case #69 : 다른 사용자 풀이 조회** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 다른 사람의 공개된 풀이를 열람하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 로그인이 된 상태여야 하고 대상 풀이가 공개 상태여야 한다. |
| **Trigger** |  |  | 사용자가 문제 상세 페이지 내 ‘다른 사용자 풀이 보기’ 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 선택된 사용자의 풀이 코드와 설명이 표시된다. |
| **Failed Post Condition** |  |  | 비공개 풀이 접근 시 “이 풀이를 볼 수 없습니다.” 표시 |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자는 다른 사용자의 풀이를 조회할 수 있다. |  |  |
| **1** | 사용자가 문제 상세 페이지를 연다. |  |  |
| **2** | ‘다른 사용자 풀이’ 탭을 선택한다. |  |  |
| **3** | 시스템은 공개된 풀이 목록을 표시한다. |  |  |
| **4** | 사용자가 특정 풀이를 클릭하면 코드 및 작성자 정보가 표시된다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **3** | 3a. 풀이 없음
...3a1. “등록된 풀이가 없습니다.” 표시 
3b. 네트워크 오류 또는 DB에서 정보를 불러오지 못함
...3b1. 오류 메시지 출력 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 2 seconds |  |
| **Frequency** |  | 상시 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.15 |  |

| **Use case #70 : 풀이 효율 랭킹 조회** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 같은 문제를 푼 사람들의 효율(시간, 메모리)을 기준으로 한 랭킹을 조회하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 해당 문제에 여러 사용자의 제출 데이터가 존재해야 한다. |
| **Trigger** |  |  | ‘효율 랭킹 보기’ 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 효율 기준(시간/메모리)에 따른 순위가 표시된다. |
| **Failed Post Condition** |  |  | 데이터 조회 실패 시 “랭킹을 불러올 수 없습니다.” 표시 |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자는 풀이를 효율 기준에 따른 랭킹을 조회할 수 있다. |  |  |
| **1** | 사용자가 문제 상세 페이지에서 ‘효율 랭킹 보기’를 클릭한다. |  |  |
| **2** | 시스템은 제출 기록을 분석해 상위 순위를 계산한다. |  |  |
| **3** | 결과를 표 형태로 출력한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **2** | 2a. 데이터 없음
...2a1. “아직 제출된 풀이가 없습니다.” 표시
2b. 네트워크 오류 및 DB 데이터 불러오기 오류
...2b1 오류 메시지 출력 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 2 seconds |  |
| **Frequency** |  | 상시 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.15 |  |

| **Use case #71 : 풀이 과정 리플레이** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 풀이 제출 기록을 기반으로 사용자가 자신의 코드를 단계별로 실행 과정을 시각적으로 재생하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 해당 문제에 제출 데이터가 존재해야 한다. |
| **Trigger** |  |  | ‘리플레이 보기’ 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 코드 실행 단계가 시각화되어 재생된다. |
| **Failed Post Condition** |  |  | 시각화 데이터 손실 시 오류 메시지 표시 |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자는 빈 화면에서 시작했을 때부터 제출 버튼을 눌렀을 때의 과정이 타임라인 형식으로 전부 다 볼 수 있다. |  |  |
| **1** | 사용자가 마이페이지에서 자신의 제출 내역을 선택한다. |  |  |
| **2** | ‘리플레이 보기’를 클릭한다. |  |  |
| **3** | 시스템은 실행 로그를 불러와 시각화 뷰어를 구동한다. |  |  |
| **4** | 실행 과정이 시간순으로 재생된다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **3** | 3a. 로그 손상
...3a1. “리플레이 데이터를 불러올 수 없습니다.” 메시지 출력 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 3 seconds |  |
| **Frequency** |  | 주간 평균 1~2회 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.15 |  |

| **Use case #72 : 코드 리뷰 조회** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 문제 풀이에 작성된 코드 리뷰 목록을 열람하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 코드 리뷰가 등록되어 있어야 한다. |
| **Trigger** |  |  | 문제 풀이 화면의 ‘리뷰’ 탭을 클릭할 때 |
| **Success Post Condition** |  |  | 리뷰 목록이 표시된다. |
| **Failed Post Condition** |  |  | 데이터 로드 실패 시 오류 메시지 표시 |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자는 특정 문제 풀이에 대한 리뷰를 볼 수 있다. |  |  |
| **1** | 사용자가 풀이 상세 페이지의 ‘리뷰’ 탭 클릭을 한다. |  |  |
| **2** | 시스템이 리뷰 데이터를 DB에서 조회를 한다. |  |  |
| **3** | 리뷰 작성자, 인용 코드, 내용, 작성일이 표시된다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **3** | 3a. 리뷰 없음
...3a1. “등록된 리뷰가 없습니다.” 메시지 출력
3b. 네트워크 오류 또는 DB 데이터 불러오지 못함
...3b1. 오류 메시지 출력 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 1 seconds |  |
| **Frequency** |  | 상시 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.15 |  |

| **Use case #73 : 코드 리뷰 작성 (코드 인용)** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 특정 코드 줄을 인용하여 리뷰를 작성하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 로그인되어 있어야 하고 대상 풀이가 공개 상태여야 한다. |
| **Trigger** |  |  | 코드 영역에서 줄을 선택하고 ‘리뷰 작성’ 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 리뷰가 등록되고 해당 줄에 표시된다. |
| **Failed Post Condition** |  |  | 저장 실패 시 오류 메시지가 출력된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자는 풀이에 대해 리뷰를 작성할 수 있다. |  |  |
| **1** | 사용자가 특정 코드 줄을 드래그한다. |  |  |
| **2** | ‘리뷰 작성’ 버튼을 클릭한다. |  |  |
| **3** | 리뷰 내용을 작성하고 저장한다. |  |  |
| **4** | 시스템은 인용 정보와 함께 DB에 저장한다. |  |  |
| **5** | 이 Use case는 리뷰가 DB에 성공적으로 저장되면 종료된다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **3** | 3a. 빈 내용 입력
...3a1. “내용을 입력하세요.” 메시지 출력 |  |  |
| **4** | 4a. 네트워크 오류 또는 DB에 저장을 못함
...4a1. 오류 및 재시도 유도 메시지 출력 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 1 seconds |  |
| **Frequency** |  | 상시 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.15 |  |

| **Use case #74 : 코드 리뷰 댓글 작성** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 코드 리뷰에 댓글을 작성하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 코드 리뷰가 등록되어 있어야 한다. |
| **Trigger** |  |  | 리뷰 하단의 ‘댓글 작성’ 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 댓글이 등록되어 리뷰 스레드에 표시된다. |
| **Failed Post Condition** |  |  | 입력 실패 시 오류 메시지가 출력된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자는 리뷰에 댓글을 작성할 수 있다. |  |  |
| **1** | 사용자가 풀이 상세 페이지의 ‘리뷰’ 탭을 클릭한다. |  |  |
| **2** | 시스템이 리뷰 데이터를 DB에서 조회한다. |  |  |
| **3** | ‘댓글 작성’ 클릭 후 내용을 입력한다. |  |  |
| **4** | 저장 클릭 시 DB에 추가되고 즉시 표시된다. |  |  |
| **5** | 이 Use case는 사용자가 원하면 2~3을 계속 반복한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **2** | 2a. 리뷰 없음
...2a1. “등록된 리뷰가 없습니다.” 메시지 출력
2b. 네트워크 오류 또는 DB 데이터 불러오지 못함
...2b1. 오류 메시지 출력 |  |  |
| **3** | 3a. 빈 내용 입력
...3a1. “내용을 입력하세요.” 메시지 출력 |  |  |
| **4** | 4a. 네트워크 오류 또는 DB 저장 실패
...4a1. 오류 메시지 출력 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 1 seconds |  |
| **Frequency** |  | 상시 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.15 |  |

| **Use case #75 : 코드 리뷰 투표** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 유용하거나 적절한 리뷰에 투표(좋아요/비추천)하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 로그인 상태여야 한다. |
| **Trigger** |  |  | ‘좋아요’ 또는 ‘비추천’ 아이콘을 클릭할 때 |
| **Success Post Condition** |  |  | 투표 수가 실시간 반영된다. |
| **Failed Post Condition** |  |  | 이미 투표한 경우 중복 방지 메시지 표시된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자는 리뷰에 좋은지 안 좋은지 결정하는 투표를 할 수 있다. |  |  |
| **1** | 사용자가 리뷰 리스트를 본다. |  |  |
| **2** | 특정 리뷰의 투표 아이콘을 클릭한다. |  |  |
| **3** | 시스템은 투표 여부를 검사 후 반영한다. |  |  |
| **4** | 이 Use case는 투표 여부가 DB에 성공적으로 저장되면 종료된다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **3** | 3a. 네트워크 오류 및 DB 저장 실패
...3a1. 오류 및 재시도 유도 메시지 출력 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 1 seconds |  |
| **Frequency** |  | 상시 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.15 |  |

| **Use case #76 : QnA 게시판 조회 (문제별)** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 문제별 QnA 게시판을 열람하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 게시판이 존재해야 한다. |
| **Trigger** |  |  | 문제 상세 화면에서 'QnA' 탭을 클릭할 때 |
| **Success Post Condition** |  |  | 문제별 질문 목록과 답변 수, 작성자 정보가 표시된다. |
| **Failed Post Condition** |  |  | DB 오류 시 “QnA 게시판을 불러올 수 없습니다.” 메시지가 표시된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자는 QnA 게시판을 조회할 수 있다. |  |  |
| **1** | ‘QnA’ 탭 클릭 시 시스템이 문제 ID 기준으로 게시글 목록을 조회한다. |  |  |
| **2** | 제목, 작성자, 등록일, 답변 수가 표시된다. |  |  |
| **3** | 사용자는 특정 게시글을 클릭해 상세보기로 이동한다. |  |  |
| **4** | 시스템은 해당 게시글의 본문과 답변 목록을 출력한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **1** | 1a. 게시글 없음
...1a1. “등록된 질문이 없습니다.” 출력 |  |  |
| **2** | 2a. 네트워크 오류
...2a1. “다시 시도하세요” 버튼 표시 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 2 seconds |  |
| **Frequency** |  | 상시 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.15 |  |

| **Use case #77 : QnA 게시판 검색 및 필터링** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 키워드나 답변 여부를 기준으로 QnA 게시글을 검색 및 필터링하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | QnA 게시판에 최소 1개 이상의 게시글이 존재해야 한다. |
| **Trigger** |  |  | 사용자가 검색어 입력 또는 필터 버튼을 선택할 때 |
| **Success Post Condition** |  |  | 조건에 맞는 게시글만 화면에 표시된다. |
| **Failed Post Condition** |  |  | 결과가 없으면 “검색 결과가 없습니다.” 출력 |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자는 QnA 게시판을 통해 원하는 게시글을 찾아볼 수 있다. |  |  |
| **1** | 사용자가 검색창에 키워드 입력한다. |  |  |
| **2** | 시스템은 입력된 키워드로 DB 질의 수행한다. |  |  |
| **3** | 결과를 필터링하여 게시글 목록으로 출력한다. |  |  |
| **4** | 사용자가 선택 시 해당 게시글 상세 보기로 이동한다. |  |  |
| **5** | 이 Use case는 1~3 단계를 계속 반복한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **3** | 3a. 입력값 공백
...3a1. “검색어를 입력하세요” 메시지 출력
3b. 네트워크 오류 및 DB 불러오기 실패
...3b1. 오류 및 재시도 유도 메시지 출력 |  |  |
| **4** | 4a. 결과 없음.
...4a1. “검색 결과가 없습니다.” 메시지 출력 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 1.5 seconds |  |
| **Frequency** |  | 상시 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.15 |  |

| **Use case #78 : QnA 질문 작성/수정/삭제** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 문제 관련 질문을 작성·수정·삭제하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 로그인 상태여야 하며, 질문 작성 권한이 있어야 한다. |
| **Trigger** |  |  | ‘질문 작성’ 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 질문이 DB에 저장되고 목록에 반영된다. |
| **Failed Post Condition** |  |  | 입력값 검증 실패 시 오류 메시지 출력 |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자는 QnA 게시판을 통해 원하는 게시글(질문)을 작성/수정/삭제할 수 있다. |  |  |
| **1** | 사용자가 QnA 게시판에 접속한다. |  |  |
| **2** | ‘질문 작성’ 클릭한다. |  |  |
| **3** | 제목과 본문 입력 후 등록한다. |  |  |
| **4** | 수정/삭제 시 본인 여부 확인 후 반영한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **3** | 3a. 필수 항목이 비어 있음(제목, 내용 등)
...3a1. “필수 항목을 입력하세요.” 메시지 출력
3b. 네트워크 오류 및 DB 저장 실패
...3b1. 오류 및 재시도 유도 메시지 출력 |  |  |
| **4** | 4a. 권한 없음
...4a1. "작성자만 수정/삭제할 수 있습니다.“ 메시지 출력 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 2 seconds |  |
| **Frequency** |  | 상시 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.15 |  |

| **Use case #79 : QnA 답변 작성/수정/삭제** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 질문에 대한 답변을 등록/수정/삭제하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 로그인 상태이며 해당 질문이 존재해야 한다. |
| **Trigger** |  |  | ‘답변 작성’ 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 답변이 등록되어 게시글 하단에 표시된다. |
| **Failed Post Condition** |  |  | DB 오류 시 저장 실패 메시지를 출력한다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자는 QnA 게시판 게시글(질문)에 답변을 작성/수정/삭제할 수 있다. |  |  |
| **1** | 사용자가 질문 상세 보기 진입한다. |  |  |
| **2** | ‘답변 작성’ 클릭한다. |  |  |
| **3** | 내용 입력 후 등록한다. |  |  |
| **4** | 수정/삭제 시 작성자 여부 검증 후 DB 반영을 한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **3** | 3a. 입력값이 비어 있음.
...3a1. “답변 내용을 입력하세요.” 메시지 출력
3b. 네트워크 오류 및 DB 저장 실패
...3b1. 오류 및 재시도 유도 메시지 출력 |  |  |
| **4** | 4a. 권한 없음
...4a1. "작성자만 수정/삭제할 수 있습니다.“ 메시지 출력 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 2 seconds |  |
| **Frequency** |  | 상시 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.15 |  |

| **Use case #80 : QnA 질문/답변 투표** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 유용한 질문이나 답변에 투표(추천/비추천)하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 로그인되어 있어야 한다. |
| **Trigger** |  |  | ‘추천’ 또는 ‘비추천’ 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 투표 수가 실시간 갱신된다. |
| **Failed Post Condition** |  |  | 중복 투표 시 “이미 투표한 항목입니다.” 표시된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자는 QnA 게시판 게시글(질문) 또는 답변에 투표(추천/비추천)를 할 수 있다. |  |  |
| **1** | 사용자가 질문 또는 답변을 조회한다. |  |  |
| **2** | 투표 버튼(‘추천’ 또는 ‘비추천’)을 클릭한다. |  |  |
| **3** | 시스템은 이전 투표 여부 확인 후 DB를 갱신한다. |  |  |
| **4** | UI에 실시간 반영을 한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **3** | 3a. 네트워크 오류 및 DB 저장 실패
...3a1. 오류 및 재시도 유도 메시지 출력 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 1 seconds |  |
| **Frequency** |  | 상시 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.15 |  |

| **Use case #81 : 토론 게시판 조회 (태그별)** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 선택한 태그별 토론 글 목록을 조회하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 게시판이 존재해야 한다. |
| **Trigger** |  |  | ‘토론 게시판’ 메뉴 클릭 후 태그를 클릭할 때 |
| **Success Post Condition** |  |  | 해당 태그가 적용된 게시글 목록이 표시된다. |
| **Failed Post Condition** |  |  | 게시글이 없을 경우 “해당 태그의 글이 없습니다.” 출력한다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자는 토론 게시판을 조회할 수 있다. |  |  |
| **1** | ‘토론 게시판’ 탭 클릭 시 시스템이 게시글 목록을 조회한다. |  |  |
| **2** | 제목, 작성자, 등록일, 답변 수가 표시된다. |  |  |
| **3** | 사용자는 태그를 클릭한다. |  |  |
| **4** | 시스템은 선택 태그로 필터링된 글 목록을 표시한다. |  |  |
| **5** | 사용자는 특정 게시글을 클릭해 상세보기로 이동한다. |  |  |
| **6** | 시스템은 해당 게시글의 본문과 답변 목록을 출력한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **1** | 1a. 게시글 없음
...1a1. “등록된 질문이 없습니다.” 출력 |  |  |
| **6** | 6a. 네트워크 오류 및 DB 불러오기 실패
...6a1. “다시 시도하세요” 버튼 표시 및 목록(게시판 조회)으로 돌아감 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 2 seconds |  |
| **Frequency** |  | 상시 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.15 |  |

| **Use case #82 : 토론 게시판 검색 및 필터링** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 키워드나 작성자, 날짜를 기준으로 토론 글을 검색하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 게시글이 존재해야 한다. |
| **Trigger** |  |  | 검색창 입력 후 ‘검색’을 클릭할 때 |
| **Success Post Condition** |  |  | 조건에 맞는 게시글을 표시한다. |
| **Failed Post Condition** |  |  | 검색 결과가 없을 시 안내 문구를 표시한다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자는 토론 게시판에서 원하는 게시글을 찾아볼 수 있다. |  |  |
| **1** | 사용자가 검색어를 입력한다. |  |  |
| **2** | 시스템이 DB 질의를 수행한다. |  |  |
| **3** | 결과 게시글들을 목록으로 표시한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **2** | 2a. 공백 입력
...2a1. “검색어를 입력하세요.” 메시지 출력 |  |  |
| **3** | 3a. 네트워크 오류 또는 DB 불러오기 실패
...3a1. 오류 메시지 및 재시도 유도 메시지 출력
3b. 검색 결과가 없음
...3b1. “검색 결과가 없습니다.” 메시지 출력 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 1.5 seconds |  |
| **Frequency** |  | 상시 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.15 |  |

| **Use case #83 : 토론 게시판 글 작성(코드, 이미지, 투표 포함)** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 코드, 이미지, 투표를 포함한 토론 게시글을 작성하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 로그인되어 있어야 한다. |
| **Trigger** |  |  | ‘글 작성’ 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 게시글이 DB에 저장되고 목록에 반영된다. |
| **Failed Post Condition** |  |  | 입력값 누락 또는 파일 첨부 실패 시 “등록 실패” 메시지가 표시된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자는 토론 게시판에 글을 작성할 수 있다. |  |  |
| **1** | 사용자가 토론 게시판에서 ‘글 작성’ 버튼을 클릭한다. |  |  |
| **2** | 제목, 내용, 첨부(코드/이미지/투표)를 입력한다. |  |  |
| **3** | ‘등록’클릭 시 시스템은 데이터를 검증한다. |  |  |
| **4** | DB에 저장 후 목록에 추가한다. |  |  |
| **5** | 성공 메시지를 표시하고 사용자를 게시글 상세 페이지로 이동한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **2** | 2a. 필수 항목(제목, 내용)이 비어있음
...2a1. “필수 항목을 입력하세요” 메시지 출력
2b. 첨부파일 형식 오류
...2b1. “허용되지 않는 파일 형식입니다.” 메시지 출력 |  |  |
| **3** | 3a. 네트워크 오류 또는 DB 저장 실패
...3a1. 오류 메시지 및 재시도 유도 메시지 출력 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 2 seconds |  |
| **Frequency** |  | 상시 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.15 |  |

| **Use case #84 : 토론 게시판 글 수정/삭제** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 작성자가 본인이 등록한 토론 게시글을 수정하거나 삭제하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 로그인되어 있어야 하고, 작성자 본인이어야 한다. |
| **Trigger** |  |  | ‘수정’ 또는 ‘삭제’ 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 수정/삭제 결과가 DB에 반영되고 목록이 갱신된다. |
| **Failed Post Condition** |  |  | 권한 없음 또는 서버 오류 시 실패 메시지를 출력한다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자는 토론 게시판에 작성한 글을 수정 또는 삭제를 할 수 있다. |  |  |
| **1** | 사용자가 자신의 게시글을 선택한다. |  |  |
| **2** | ‘수정’ 클릭 시 등록할 때 내용이 담긴 채로 불러오고 내용 변경 후 저장한다. |  |  |
| **3** | ‘삭제’ 클릭 시 확인 창을 출력한다. |  |  |
| **4** | 확인 시 DB에서 삭제 후 목록을 갱신한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **2** | 2a. 긴 시간 비워서 비로그인 상태로 변경
...2a1. 로그인 요청
2b. 네트워크 오류 및 DB 저장 실패
...2b1. 오류 메시지 및 재시도 유도 메시지 출력 |  |  |
| **4** | 4a. 삭제 취소 버튼 클릭
...4a1. 작업 종료 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 1.5 seconds |  |
| **Frequency** |  | 상시 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.15 |  |

| **Use case #85 : 토론 게시판 댓글 작성/수정/삭제** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 토론 글에 댓글을 작성, 수정, 삭제하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 로그인되어 있어야 한다. |
| **Trigger** |  |  | 댓글 입력창 또는 수정/삭제 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 댓글이 등록 또는 수정/삭제되어 게시글 하단에 반영된다. |
| **Failed Post Condition** |  |  | DB 오류 또는 권한 오류 발생 시 실패 메시지를 표시한다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자는 토론 게시판에 게시글에 댓글을 입력할 수 있다. |  |  |
| **1** | 사용자가 게시글 상세 페이지에 진입한다. |  |  |
| **2** | 댓글 입력 후 ‘등록’ 버튼을 클릭한다. |  |  |
| **3** | 시스템은 DB에 댓글을 저장한다. |  |  |
| **4** | 댓글이 실시간 목록에 표시한다.(UI 실시간 반영) |  |  |
| **5** | 수정/삭제 시에는 작성자 확인 후 반영한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **3** | 3a. 공백 입력
...3a1. “내용을 입력하세요.” 메시지 출력
3b. 네트워크 오류 및 DB 저장 실패
...3b1. 오류 메시지 및 재시도 유도 메시지 출력 |  |  |
| **4** | 5a. 권한 없음
...5a1. “작성자만 수정/삭제 가능합니다.” 메시지 출력 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 1 seconds |  |
| **Frequency** |  | 상시 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.15 |  |

| **Use case #86 : 스터디 그룹 생성** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 새로운 스터디 그룹을 생성하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 로그인되어 있어야 하고, 그룹명 중복이 없어야 한다. |
| **Trigger** |  |  | ‘스터디 그룹 생성’ 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 그룹 정보가 DB에 등록되고 그룹장이 자동 설정된다. |
| **Failed Post Condition** |  |  | 중복 그룹명 존재 시 “이미 존재하는 그룹명입니다.” 메시지 표시한다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자는 스터디 그룹을 만들 수 있다. |  |  |
| **1** | 사용자가 스터디 페이지에 접속한다. |  |  |
| **2** | ‘그룹 생성’ 버튼을 클릭한다. |  |  |
| **3** | 그룹명, 소개, 공개 여부 등을 입력한다. |  |  |
| **4** | 시스템은 검증 후 DB에 저장한다. |  |  |
| **5** | 그룹장이 자동으로 설정되고 생성 완료 메시지가 출력된다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **4** | 4a. 필수 입력값 누락
...4a1. “필수 입력 값 작성해주세요.” 메시지 출력 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 2 seconds |  |
| **Frequency** |  | 주간 평균 1~2회 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.15 |  |

| **Use case #87 : 스터디 그룹 가입** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 기존의 스터디 그룹에 가입하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 로그인되어 있어야 하고, 그룹이 공개 상태이거나 초대 링크가 유효해야 한다. |
| **Trigger** |  |  | ‘가입하기’ 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 사용자가 그룹 멤버로 등록된다. |
| **Failed Post Condition** |  |  | 초대 코드 오류 또는 제한 인원 초과 시 가입이 실패된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자는 스터디 그룹에 가입할 수 있다. |  |  |
| **1** | 사용자가 스터디 그룹 상세 페이지에 접속한다. |  |  |
| **2** | ‘가입하기’ 버튼을 클릭한다. |  |  |
| **3** | 시스템은 자격 검증 후 DB에 멤버 추가한다. |  |  |
| **4** | 그룹 리스트에 사용자 이름을 표시한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **2** | 2a. 초대 코드 오류
...2a1. “잘못된 초대 코드 입니다.” 메시지 출력 |  |  |
| **3** | 3a. 인원 초과
...3a1. “최대 인원을 초과했습니다.” 메시지 출력 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 1.5 seconds |  |
| **Frequency** |  | 주간 평균 5회 이하 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.15 |  |

| **Use case #88 : 스터디 그룹 문제 지정 (그룹장)** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 스터디 그룹장이 학습용 문제를 그룹에 지정하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User(Group Leader) |
| **Preconditions** |  |  | 그룹장이어야 하고, 등록 가능한 문제 목록이 존재해야 한다. |
| **Trigger** |  |  | ‘문제 지정’ 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 지정된 문제가 그룹 학습 목록에 추가된다. |
| **Failed Post Condition** |  |  | 문제 등록 실패 시 경고 메시지가 표시된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자 중 스터디 그룹 안 그룹장은 그룹원들에게 학습용 문제를 지정할 수 있다. |  |  |
| **1** | 그룹장이 그룹 관리 페이지에 접근한다. |  |  |
| **2** | ‘문제 지정’ 버튼을 클릭한다. |  |  |
| **3** | 문제 검색 및 선택을 한 후 등록한다. |  |  |
| **4** | 시스템은 그룹 문제 테이블에 데이터를 추가한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **3** | 3a. 이미 등록된 문제
...3a1. “이미 추가된 문제입니다.” 메시지 출력 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 2 seconds |  |
| **Frequency** |  | 주간 평균 1~2회 |  |
| **<Concurrency>** |  | 1명 |  |
| **Due Date** |  | 2025.12.15 |  |

| **Use case #89 : 스터디 그룹 전용 토론** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 스터디 그룹 내부에서만 참여 가능한 전용 토론 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User(Group Member) |
| **Preconditions** |  |  | 해당 그룹 멤버여야 한다. |
| **Trigger** |  |  | ‘그룹 토론’ 탭을 클릭할 때 |
| **Success Post Condition** |  |  | 그룹 멤버 전용 게시글이 표시되고 글 작성이 가능하다 |
| **Failed Post Condition** |  |  | 비회원 접근 시 “권한이 없습니다.” 메시지를 출력한다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자는 스터디 그룹에 가입한 그룹원끼리 토론을 할 수 있다. |  |  |
| **1** | 그룹 멤버가 그룹 페이지에 진입한다. |  |  |
| **2** | ‘토론’ 탭을 클릭한다. |  |  |
| **3** | 시스템은 그룹 ID를 기준으로 내부 글 목록을 표시한다. |  |  |
| **4** | 특정 게시글을 입력해 상세 페이지에 접근한다. |  |  |
| **5** | 입력란에 댓글을 작성한다. |  |  |
| **6** | 등록하면 실시간으로 반영되고 자신이 작성한 글은 수정/삭제 버튼이 출려된다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **3** | 3a. 게시글 없음
...3a1. “등록된 글이 없습니다.” 메시지 출력 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 2 seconds |  |
| **Frequency** |  | 상시 |  |
| **<Concurrency>** |  | 그룹 내 50명 이하 |  |
| **Due Date** |  | 2025.12.15 |  |

| **Use case #90 : 스터디 그룹 활동 기록 조회** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 스터디 그룹 내 문제 풀이, 참여도, 토론 내역을 조회하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User(Group Member) |
| **Preconditions** |  |  | 해당 그룹 멤버여야 한다. |
| **Trigger** |  |  | ‘활동 기록 조회’ 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 활동 내역이 표/그래프 형태로 표시된다. |
| **Failed Post Condition** |  |  | 데이터 없음 시 “활동 기록이 없습니다.” 메시지가 출력된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자는 가입한 스터디 그룹의 활도 기록을 조회할 수 있다. |  |  |
| **1** | 사용자가 그룹 페이지에 접속한다. |  |  |
| **2** | ‘활동 기록’ 버튼을 클릭한다. |  |  |
| **3** | 시스템이 활동 데이터를 조회하여 시각화 출력한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **3** | 3a. 데이터 누락
...3a1. “기록 데이터가 없습니다.” 메시지가 출력 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 3 seconds |  |
| **Frequency** |  | 주간 평균 3회 |  |
| **<Concurrency>** |  | 그룹 내 50명 이하 |  |
| **Due Date** |  | 2025.12.15 |  |

| **Use case #91 : 스터디 그룹 탈퇴** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 자신이 속한 스터디 그룹에서 자발적으로 탈퇴할 수 있는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User Level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User(Group Member) |
| **Preconditions** |  |  | 로그인 상태여야 하고 스터디 그룹에 가입한 상태여야 한다. |
| **Trigger** |  |  | 사용자가 스터디 그룹 설정 화면에서 ‘탈퇴’ 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 해당 회원의 정보를 스터디 그룹에서 삭제시키며, 스터디 그룹 목록으로 돌아간다. |
| **Failed Post Condition** |  |  | 사용자가 권한 위임 없이 그룹장일 경우 탈퇴가 불가하다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자는 스터디 그룹에서 자발적으로 탈퇴할 수 있다. |  |  |
| **1** | ‘그룹 설정‘ 메뉴에서 ‘그룹 탈퇴‘ 버튼을 클릭한다. |  |  |
| **2** | 시스템은 사용자가 그룹 회원인지 확인한다. |  |  |
| **3** | 시스템은 탈퇴 확인 팝업을 표시한다. |  |  |
| **4** | 사용자가 “확인”을 선택하면 DB에서 해당 사용자를 그룹 회원 목록에서 제거한다. |  |  |
| **5** | “그룹에서 탈퇴 되었습니다.” 메시지를 출력하고 그룹 목록에서 제거한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **2** | 2a. 그룹 미가입자 접근 시
...2a1. “해당 그룹의 회원이 아닙니다.” 메시지 출력 |  |  |
| **4** | 4a. 그룹장이 탈퇴 시도 시
...4a1. “권한 위임 후 탈퇴 가능합니다.” 메시지 출력 |  |  |
| **5** | 5a. 네트워크 오류 및 DB 저장 실패
...5a1. 오류 메시지 및 재시도 유도 메시지 출력 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 2 seconds |  |
| **Frequency** |  | 월간 평균 1회 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.15 |  |

| **Use case #92 : 스터디 그룹 활동 강퇴** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 스터디 그룹에서 그룹장이 회원을 강퇴시킬 수 있는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User Level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User(Group Leader) |
| **Preconditions** |  |  | 그룹장 계정으로 로그인 되어 있어야 하고 그룹에 회원이 있어야 한다. |
| **Trigger** |  |  | 그룹장이 회원 목록에서 ‘강퇴’ 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 해당 회원은 탈퇴되며, 해당 회원은 탈퇴 여부를 알림으로 받게 된다. |
| **Failed Post Condition** |  |  | 사용자가 권한 위임 없이 그룹장일 경우 탈퇴가 불가하다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 스터디 그룹에서 그룹장이 회원을 강퇴시킬 수 있다. |  |  |
| **1** | 그룹장이 스터디 그룹 관리 페이지에 접근한다. |  |  |
| **2** | 시스템은 모든 회원 목록과 권한 상태를 표시한다. |  |  |
| **3** | 그룹장이 특정 회원의 “강퇴” 버튼을 클릭한다. |  |  |
| **4** | 시스템은 확인 팝업을 표시하고 승인 시 DB에서 해당 회원을 제거한다. |  |  |
| **5** | 강퇴된 사용자는 그룹 접근 권한을 즉시 상실하며, 알림 메시지를 수신한다. |  |  |
| **6** | 시스템은 그룹 로그에 “강퇴 처리” 이력을 기록한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **3** | 3a. 강퇴 대상이 존재하지 않을 경우
...3a1. “대상 사용자를 찾을 수 없습니다.” 메시지 출력 |  |  |
| **4** | 4a. 그룹장이 아닌 사용자가 시도
...4a1. “권한이 없습니다.” 메시지 출력 |  |  |
| **5** | 5a. 네트워크 오류 또는 DB 저장 실패
...5a1. 오류 메시지 및 재시도 유도 메시지 출력 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 2 seconds |  |
| **Frequency** |  | 월간 평균 1회 |  |
| **<Concurrency>** |  | 그룹 내 1명만 가능 |  |
| **Due Date** |  | 2025.12.15 |  |

| **Use case #93 : 스터디 그룹 삭제** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 스터디 그룹장이 더 이상 운영하지 않는 스터디 그룹을 영구 삭제하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User Level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User(Group Leader), Administrator |
| **Preconditions** |  |  | 그룹장 계정으로 로그인 상태여야 한다. |
| **Trigger** |  |  | 그룹 설정 화면에서 ‘그룹 삭제‘ 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 시스템은 모든 데이터와 그룹을 DB에서 삭제하고, 스터디 그룹 메인 화면으로 돌아온다. |
| **Failed Post Condition** |  |  | 삭제 중 오류 발생 시 “삭제 실패, 관리자에게 문의하세요.” 메시지를 출력한다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 스터디 그룹에서 그룹장 또는 관리자는 그룹을 삭제할 수 있다. |  |  |
| **1** | 그룹장이 스터디 그룹 관리 페이지에 접근한다. |  |  |
| **2** | “그룹 삭제” 버튼을 클릭한다. |  |  |
| **3** | 시스템은 “삭제 시 복구 불가” 경고 팝업을 표시한다. |  |  |
| **4** | 사용자가 “예”를 선택하면 시스템은 그룹 데이터 전체를 삭제한다. |  |  |
| **5** | 그룹 삭제 완료 메시지를 출력하고, 그룹 목록에서 제거한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **2** | 2a. 그룹장이 아닌 사용자가 접근
...2a1. “권한이 없습니다.” 메시지 출력 |  |  |
| **3** | 3a. 취소 선택 시
...3a1. 작업 종료 |  |  |
| **4** | 4a. 네트워크 오류 및 DB 삭제 실패
...4a1. 오류 메시지 및 재시도 유도 메시지 출력 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 3 seconds |  |
| **Frequency** |  | 월간 평균 1회 |  |
| **<Concurrency>** |  | 그룹 내 1명만 가능 |  |
| **Due Date** |  | 2025.12.15 |  |

| **Use case #94 : 컨텐츠 신고** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 부적절한 게시글, 댓글, 코드, QnA, 토론 등을 신고하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 정석희 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 로그인 상태여야 한다. |
| **Trigger** |  |  | ‘신고하기’ 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 신고 정보가 DB에 저장되고 관리자에게 전달된다. |
| **Failed Post Condition** |  |  | 중복 신고 시 “이미 신고된 컨텐츠입니다.” 메시지가 표시된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자는 부적절한 게시글, 댓글, 코드, QnA, 토론 등을 신고할 수 있다. |  |  |
| **1** | 사용자가 게시글 또는 댓글의 ‘신고’ 버튼을 클릭한다. |  |  |
| **2** | 신고 사유 입력 후 제출한다. |  |  |
| **3** | 시스템은 DB에 저장하고 관리자에게 알림을 전송한다. |  |  |
| **4** | 성공 메시지를 표시한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **Step** | Branching Action |  |  |
| **3** | 3a. 네트워크 오류
...3a1. “전송 실패, 다시 시도하세요.” 메시지 출력
3b. 신고 사유 미입력
...3b1. “필수 항목 입력해주세요” 메시지 출력 |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 1 seconds |  |
| **Frequency** |  | 상시 |  |
| **<Concurrency>** |  | 무제한 |  |
| **Due Date** |  | 2025.12.15 |  |

| **Use case #95 : 강좌 목록 조회** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 시스템에 등록된 강좌 목록을 조회하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User, Instructor, Administrator |
| **Preconditions** |  |  | 시스템에 1개 이상의 강좌가 등록되어 있어야 한다. |
| **Trigger** |  |  | 사용자가 메인 네비게이션에서 '강의' 또는 '학습' 탭 메뉴를 클릭할 때 |
| **Success Post Condition** |  |  | 강좌 목록(썸네일, 제목, 강사명, 평점, 태그 등)이 화면에 표시된다. |
| **Failed Post Condition** |  |  | "강좌를 불러올 수 없습니다." 메시지가 표시된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자가 등록된 강좌 목록을 성공적으로 조회한다. |  |  |
| **1** | 이 Use Case는 사용자가 '강의' 탭을 클릭할 때 시작된다. |  |  |
| **2** | 시스템이 데이터베이스에서 '공개' 상태의 모든 강좌 정보를 조회한다. |  |  |
| **3** | 강좌 목록이 썸네일, 제목, 강사명, 평점, 태그와 함께 카드 형태로 표시된다. |  |  |
| **4** | 사용자는 검색창이나 필터(태그, 난이도별)를 통해 목록을 탐색할 수 있다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **2** | 2a. 등록된 강좌가 없음
...2a1. 시스템이 "현재 등록된 강좌가 없습니다." 메시지를 표시한다.
2b. 서버 통신 실패
...2b1. 시스템이 "강좌 목록을 불러오는 데 실패했습니다." 메시지를 표시한다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 2 seconds |  |
| **Frequency** |  | 상시 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.20 |  |

| **Use case #96 : 강좌 등록, 수정, 삭제** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 강사(Instructor)가 자신의 강좌(영상, 문서)를 등록, 수정, 삭제하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | Instructor level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | Instructor, Administrator |
| **Preconditions** |  |  | 사용자가 '강사(Instructor)' 역할로 로그인되어 있어야 한다. |
| **Trigger** |  |  | 강사가 '강의 관리' 페이지에서 '새 강좌 등록' 또는 '수정'/'삭제' 버튼을 클릭할 때 |
| **Success Post Condition** |  |  | 강좌 정보가 데이터베이스에 성공적으로 생성, 갱신, 또는 삭제(비공개) 처리된다. |
| **Failed Post Condition** |  |  | 필수 항목 누락 또는 서버 오류로 "작업에 실패했습니다." 메시지가 표시된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 강사가 자신의 강좌를 성공적으로 관리한다. |  |  |
| **1** | 이 Use Case는 강사가 '강의 관리' 페이지에서 '새 강좌 등록'을 클릭할 때 시작된다. |  |  |
| **2** | 강사가 강좌 제목, 설명, 태그, 썸네일을 입력하고 강의 자료(영상/문서 파일)를 업로드한다. |  |  |
| **3** | 강사가 강좌와 연계할 '실습 문제'를 문제 목록에서 선택한다. |  |  |
| **4** | 시스템이 입력값을 검증하고 강좌를 데이터베이스에 저장한다. |  |  |
| **5** | 강사가 '강의 관리' 목록에서 '수정'을 클릭하고, 2, 3단계의 정보를 갱신한 후 '저장'을 클릭한다. |  |  |
| **6** | 강사가 '강의 관리' 목록에서 '삭제'(또는 비공개)를 클릭하고, 확인창에서 '확인'을 누른다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **4** | 4a. 필수 항목 누락
...4a1. 시스템이 "강좌 제목을 입력해야 합니다." 메시지를 표시한다.
4b. 파일 업로드 실패
...4b1. 시스템이 "영상 파일 업로드에 실패했습니다." 메시지를 표시한다. |  |  |
| **6** | 6a. 관리자에 의한 비공개 처리
...6a1. 관리자(Administrator)가 검토 후 부적절한 강의를 '비공개' 처리하고, 강사에게 사유를 통보한다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 3 seconds |  |
| **Frequency** |  | 강사당 주 1~2회 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.20 |  |

| **Use case #97 : 강좌 수강** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 '강좌 목록'에서 선택한 강좌의 상세 페이지로 이동하여 영상 및 문서를 학습하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | '강좌 목록 조회'가 완료되어 있으며, 사용자가 로그인 상태여야 한다. |
| **Trigger** |  |  | 사용자가 '강좌 목록'에서 특정 강좌 카드를 클릭할 때 |
| **Success Post Condition** |  |  | 강좌 상세 페이지로 이동하며, 영상 플레이어 또는 문서 뷰어를 통해 학습 콘텐츠가 표시된다. |
| **Failed Post Condition** |  |  | "강좌를 불러올 수 없습니다." 메시지가 표시된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자가 선택한 강좌의 학습을 시작한다. |  |  |
| **1** | 이 Use Case는 사용자가 '강좌 목록'에서 특정 강좌를 클릭할 때 시작된다. |  |  |
| **2** | 시스템이 해당 강좌의 상세 정보(소개, 목차, 자료, 연계 문제, 강좌 문의, 평점)를 표시한다. |  |  |
| **3** | 사용자가 목차에서 '1강'을 클릭한다. |  |  |
| **4** | 시스템이 '1강'에 해당하는 영상(또는 문서)을 뷰어에 로드하여 재생(표시)한다. |  |  |
| **5** | 사용자가 학습을 완료하면, '학습 완료' 버튼을 클릭한다. |  |  |
| **6** | 시스템이 해당 강의의 학습 이력을 사용자의 '학습 진도'에 기록한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **4** | 4a. 콘텐츠 로드 실패
...4a1. 시스템이 "강의 자료를 불러오는 데 실패했습니다." 메시지를 뷰어에 표시한다. |  |  |
| **5** | 5a. 강좌와 연계된 문제 풀이
...5a1. 사용자가 '1강' 학습 완료 후, '연계 문제 풀기' 버튼을 클릭한다.
...5a2. 시스템이 해당 문제의 IDE 화면으로 이동시킨다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 3 seconds |  |
| **Frequency** |  | 상시 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.20 |  |

| **Use case #98 : 강좌 문의 게시판** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 수강생이 강좌에 대해 질문하고 강사(또는 다른 수강생)가 답변하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User, Instructor |
| **Preconditions** |  |  | '강좌 수강' 화면에 진입한 상태여야 한다. |
| **Trigger** |  |  | 사용자가 '강좌 수강' 화면의 '문의하기(Q&A)' 탭을 클릭할 때 |
| **Success Post Condition** |  |  | 질문/답변 목록이 표시되고, 질문 또는 답변이 성공적으로 등록된다. |
| **Failed Post Condition** |  |  | 게시판을 불러오지 못하거나, 질문/답변 등록에 실패한다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 수강생이 강좌에 대해 질문하고 답변을 받는다. |  |  |
| **1** | 이 Use Case는 수강생이 '문의하기' 탭을 클릭할 때 시작된다. |  |  |
| **2** | 시스템이 해당 강좌의 Q&A 목록을 조회하여 표시한다. |  |  |
| **3** | 수강생이 '질문 작성' 버튼을 클릭하고, 제목과 내용을 입력한 후 '등록'을 클릭한다. |  |  |
| **4** | 시스템이 질문을 저장하고 목록에 갱신한다. |  |  |
| **5** | 강사(또는 다른 수강생)가 해당 질문에 '답변 작성'을 클릭하고, 내용을 입력한 후 '등록'을 클릭한다. |  |  |
| **6** | 시스템이 답변을 저장하고 질문 하단에 스레드 형태로 표시한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **4** | 4a. 필수 항목 누락
...4a1. 시스템이 "질문 내용을 입력해야 합니다." 메시지를 표시한다.
4b. 서버 통신 실패
...4b1. 시스템이 "질문 등록에 실패했습니다." 메시지를 표시한다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 2 seconds |  |
| **Frequency** |  | 강좌 수강 중 수시로 발생 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.20 |  |

| **Use case #99 : 강좌 평점 부여** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 강좌 수강을 완료한 사용자가 해당 강좌에 대해 평점(별점)과 한 줄 후기를 남기는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 사용자가 해당 강좌의 '학습 완료' 상태이거나 수강 이력이 있어야 한다. |
| **Trigger** |  |  | 사용자가 강좌 상세 페이지에서 '평점 남기기' 버튼을 클릭하거나, 학습 완료 시 팝업이 표시될 때 |
| **Success Post Condition** |  |  | 평점과 후기가 성공적으로 등록되고, 강좌의 전체 평균 평점에 반영된다. |
| **Failed Post Condition** |  |  | "평점 등록에 실패했습니다." 메시지가 표시된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자가 수강 완료한 강좌에 평점을 등록한다. |  |  |
| **1** | 이 Use Case는 사용자가 '학습 완료' 버튼을 클릭했을 때 시작된다. |  |  |
| **2** | 시스템이 "강의는 어떠셨나요?"라는 평점 등록 팝업(또는 뷰)을 표시한다. |  |  |
| **3** | 사용자가 별점(1~5점)을 선택하고 한 줄 후기를 입력한다. |  |  |
| **4** | 사용자가 '등록' 버튼을 클릭한다. |  |  |
| **5** | 시스템이 평점과 후기를 저장하고, 해당 강좌의 평균 평점을 재계산한다. |  |  |
| **6** | "소중한 후기 감사합니다." 메시지를 표시한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **2** | 2a. 이미 평점을 등록함
...2a1. 시스템이 평점 등록 팝업 대신, 사용자가 이전에 남긴 평점을 표시한다.
...2a2. '수정하기' 또는 '삭제하기' 버튼을 제공한다. |  |  |
| **3** | 3a. 별점 미선택
...3a1. '등록' 버튼이 비활성화되거나, "평점을 선택해주세요." 메시지를 표시한다. |  |  |
| **5** | 5a. 서버 저장 실패
...5a1. 시스템이 "평점 등록에 실패했습니다. 다시 시도해주세요." 메시지를 표시한다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 2 seconds |  |
| **Frequency** |  | 강좌 완료 시 1회 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.20 |  |

| **Use case #100 : 커리큘럼 목록 조회** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 관리자와 강사가 설정한 정규 커리큘럼 목록을 조회하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | 시스템에 1개 이상의 커리큘럼이 등록되어 있어야 한다. |
| **Trigger** |  |  | 사용자가 '강의' 페이지의 '커리큘럼' 탭을 클릭할 때 |
| **Success Post Condition** |  |  | 커리큘럼 목록이 표시된다. |
| **Failed Post Condition** |  |  | "커리큘럼 목록을 불러올 수 없습니다." 메시지가 표시된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자가 등록된 커리큘럼 목록을 확인한다. |  |  |
| **1** | 이 Use Case는 사용자가 '커리큘럼' 탭을 클릭할 때 시작된다. |  |  |
| **2** | 시스템이 '공개' 상태의 모든 커리큘럼 목록을 조회한다. |  |  |
| **3** | 각 커리큘럼의 제목, 간략한 소개, 포함된 강좌/문제 수 등을 카드 형태로 표시한다. |  |  |
| **4** | 사용자가 특정 커리큘럼 카드를 클릭한다. |  |  |
| **5** | 시스템이 해당 커리큘럼의 상세 페이지를 표시하고 '수강 시작' 버튼을 제공한다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **2** | 2a. 커리큘럼 없음
...2a1. 시스템이 "현재 진행 중인 커리큘럼이 없습니다." 메시지를 표시한다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 2 seconds |  |
| **Frequency** |  | 학습 시작 시 간헐적으로 발생 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.20 |  |

| **Use case #101 : 커리큘럼 수강** |  |  |  |
| --- | --- | --- | --- |
| **GENERAL CHARACTERISTICS** |  |  |  |
| **Summary** |  |  | 사용자가 '커리큘럼 목록'에서 특정 코스를 선택하여 수강을 시작하고, 정해진 순서대로 학습을 진행하는 기능 |
| **Scope** |  |  | UnIDE System |
| **Level** |  |  | User level |
| **Author** |  |  | 노우현 |
| **Last Update** |  |  | 2025.11.03 |
| **Status** |  |  | Analysis |
| **Primary Actor** |  |  | User |
| **Preconditions** |  |  | '커리큘럼 목록 조회'가 완료된 상태여야 한다. |
| **Trigger** |  |  | 사용자가 '커리큘럼 목록'에서 특정 항목을 클릭하고 '수강 시작' 버튼을 누를 때 |
| **Success Post Condition** |  |  | 커리큘럼이 '마이페이지'에 등록되고, 학습 진도 관리가 시작된다. |
| **Failed Post Condition** |  |  | "커리큘럼 수강 신청에 실패했습니다." 메시지가 표시된다. |
| **MAIN SUCCESS SCENARIO** |  |  |  |
| **Step** | Action |  |  |
| **S** | 사용자가 '초급 알고리즘 코스' 수강을 시작하고 진도를 관리한다. |  |  |
| **1** | 이 Use Case는 사용자가 '초급 알고리즘 코스'를 선택하고 '수강 시작'을 클릭할 때 시작된다. |  |  |
| **2** | 시스템이 해당 커리큘럼을 사용자의 '학습 중인 과정'에 등록한다. |  |  |
| **3** | 시스템이 커리큘럼 상세 페이지를 표시한다. |  |  |
| **4** | 사용자가 'A강의 수강'을 클릭하여 '강좌 수강'을 시작한다. |  |  |
| **5** | 'A강의 수강'을 완료하면(학습 진도 기록됨), 'B문제 풀이' 항목이 활성화된다. |  |  |
| **6** | 시스템이 '마이페이지'의 학습 목표에 해당 커리큘럼의 일일 목표량을 자동으로 설정한다. |  |  |
| **7** | 사용자가 모든 단계를 완료하면, 커리큘럼 '완료' 배지가 지급된다. |  |  |
| **EXTENSION SCENARIOS** |  |  |  |
| **2** | 2a. 이미 수강 중인 커리큘럼임
...2a1. 시스템이 "이미 학습 중인 커리큘럼입니다." 메시지를 표시하고, 3단계로 이동한다. |  |  |
| **6** | 6a. 일일 목표량 미달
...6a1. 시스템이 '학습 알림 및 리마인더'를 통해 사용자에게 알림을 전송한다. |  |  |
| **RELATED INFORMATION** |  |  |  |
| **Performance** |  | ≤ 2 seconds |  |
| **Frequency** |  | 커리큘럼 시작 시 1회 |  |
| **<Concurrency>** |  | 제한 없음 |  |
| **Due Date** |  | 2025.12.20 |  |

---

## 3. Class diagram

본 장에서는 UnIDE 시스템의 정적 구조를 나타내는 Class diagram과 각각에 대한 설명을 기술한다. 본 문서는 시스템의 핵심 구성 요소인 백엔드(Backend) 시스템의 정적 구조를 다양한 관점에서 명확히 정의하는 것을 목표로 한다.

본 문서의 Class diagram을 이해하기 위해 고려해야 할 사항은 다음과 같다.

아키텍처(Architecture)

- 백엔드 : Spring Boot 프레임워크를 기반으로 하며, Controller, Service, Repository, Entity, DTO 등의 계층적 구조(Layered Architecture)를 반영한다.

일관성(Consistency)

- 모든 Class diagram은 앞서 2장에서 정의한 Use case analysis의 요구사항을 충실히 반영한다.
- 이후 4장에서 기술될 Sequence diagram은 본 장에서 정의된 클래스의 연산 및 관계와 모순이 없도록 작성되었다.

표기 규칙(Notation Rules)

- 클래스와 인터페이스 이름은 PascalCase를 사용한다.
- 속성(Attribute)과 연산(Operation)의 이름은 camelCase를 사용한다.
- 가시성(Visibility)은 UML 표준 표기법인 +(public), -(private), #(protected)를 따른다.

전제(Prerequisites)

- 가독성을 위해 Lombok(@Getter, @Setter) 등으로 자동 생성되는 기본 메서드는 다이어그램에서 생략될 수 있다.
- 한 번 정의된 클래스는 이후 다이어그램에서 시각적 편의성을 위해 클래스 이름으로만 표기할 수 있다.

### 3.1 클래스 다이어그램 구성

본 장의 Class diagram은 역할과 책임에 따라 다음과 같은 목차로 구성된다. 이 구조는 팀원들이 파트를 분담하여 효율적으로 작업할 수 있도록 작성되었다.

1. 도메인 모델(Entity) 다이어그램
    - 시스템의 핵심 데이터와 그 관계를 정의한다.
    - User, Problem, Submission, Course 등 데이터베이스와 매핑되는 Entity 클래스
2. 데이터 전송 객체(DTO) 다이어그램
    - 계층 간 데이터 전달 및 API 요청 및 응답에 사용되는 DTO 클래스들을 정의한다.
    - ex.) UserDto, ProblemRequest, SubmissionResponse 등
3. 기능별 상세 다이어그램(Functional)
    - 주요 Use Case 그룹별 Controller, Service, Repository의 관계를 기술한다.
    - 사용자 관리(UserManagement)
    - 문제 및 코드 실행/채점(CodeEvaluation)
    - 성능 분석 및 피드백(PerformanceAnalysis)
    - 커뮤니티 및 풀이 공유(Community)
    - 학습 확장(LearningExpansion)
4. 공통 모듈(Common & Util) 다이어그램
    - 시스템 전반에서 공통으로 사용되는 모듈을 정의한다.
    - ex.) JwtTokenProvider, S3FileUploader, GlobalExceptionHandler 등

아래 절부터 각 다이어그램에 대한 상세한 설명이 기술된다.

---

## 4. Sequence diagram

**4.1 Register**

![그림 [4-1]](7266c440-b1b9-4dd9-9644-c89322b32dd4.png)

그림 [4-1]

위 그림 [4-1]은 회원 가입 과정의 Use Case를 나타내는 Sequence diagram 이다.  먼저 사용자는 register class에 자신의 회원 가입 form을 제출한다. 해당 form은 register maker 로 전송되어, user db를 참조해 id, email 중복 검사를 한다. 중복 검사란, UNIDE 서비스를 이용하고 있는 사용자의 정보와 중복되는지 아닌 지를 검사한다는 것이다. 중복 검사를 통과한 사용자는 인증 email을 받게 되는데, 해당 과정에서 email verification token db가 관여한다. email 인증까지 완료된 사용자의 비밀번호는 hash 번호로 변경되어 user db에 사용자 정보와 함께 저장된다. 회원으로서 정보가 저장된 사용자는 자신의 초기 설정을 진행한다. 자신의 특이사항을 First Setting class에 작성하면 해당 과정에서 강사가 될 사람, 학습자가 될 사람이 나뉜다. 만약 강사가 되길 희망한다면 instructor application db에 저장된다. 강사 희망자는 개인의 portfolio를 제출해야 하는데, 해당 portfolio는 user portfolio file db에 저장된다. instructor application db는 user portfolio file db를 참조한다.

**4.2 Login**

![그림 [4-2]](login.drawio.png)

그림 [4-2]

위 그림 4-2는 사용자가 시스템에 로그인하는 use case를 나타내는 sequence diagram이다.

시스템이 시작되면서 기능을 시작한다. 우선 로그인 되어있는지 확인하기 로컬 DB에 저장된 계정 정보를 가져온다. 계정이 존재하는 경우 서버에 접속하였다는 요청을 보내고 메인화면으로 전환한다. 계정이 존재하지 않는다면 사용자가 로그인 화면에 아아디, 비밀번호를 입력한 후 로그인 버튼을 누르면 서버에 로그인 하고, 사용자의 계정을 로컬 DB에 저장하고 메인 화면으로 전환한다.

**4.3 Reset password**

![그림 [4-3]](image%202.png)

그림 [4-3]

위 그림 4-3은 사용자가 비밀번호를 재설정하는 use case를 나타내는 sequence diagram이다.

본 diagram에서는 비밀번호를 재설정 하는 경우의 수를 2가지로 설정하였다. 먼저, 로그인 하면서 재설정 하는 경우와 로그인 한 후, 모종의 사유로 변경하는 경우이다.

먼저, 로그인 하면서 비밀 번호를 잊은 경우 비밀번호 재설정을 진행할 수 있다. 이 때, password_reset_token db가 사용되어 비밀번호 재설정 시 진행되는 인증 메일을 관리한다.

두 번째로, 모종의 사유로 기존 비밀번호를 재설정하는 경우다. 이 때 역시 password_reset_token db가 사용되어 비밀번호 재설정 시 진행되는 인증 메일을 관리한다.

4.4 logout

![image.png](image%203.png)

그림 [4-4]

위 그림 4-4은 사용자가 로그아웃 버튼을 눌렀을때의 흐름을 나타내는 sequence diagram이다. 

사용자가 topbar등의 버튼을 통해 onlogoutclick() 이벤트를 발생시키면, webpage는 main logic에 logout 요청을 전달한다.

이때 사용자가 중요한 작업을 수행 중인 경우(doing important task), webpage는 “현재 상황을 저장하시겠습니까?”라는 알림(send alert)을 띄우고 사용자의 응답(receive response)을 기다린다.
사용자의 응답이 response : true인 경우, main logic은 현재 작업 내용을 server로 전송(send current progress)하여 저장(save)을 수행한다.
server는 저장이 완료되면(save finished) main logic에 결과를 반환한다.

이후 main logic은 server에 토큰 만료 요청(expire token)을 보내고, local cache에서는 저장된 토큰을 삭제(clear token)한다.
모든 과정이 완료되면 webpage는 메인화면으로 재접속하여(redirect to mainpage) 절차가 마무리된다.

**4.5 community create/view**

![그림 [4-5]](image%204.png)

그림 [4-5]

위 그림[4-5] 은 게시판 이용 관련 use case 를 나타낸 sequence diagram이다. 해당 그림은 많은 내용을 담고 있기 때문에 자세한 login과정은 생략한다.

그림의 내용은 게시물 생성과 조회에 중점을 맞추었고, 여러 게시판의 이용 과정을 통합한 모습이다.

사용자들은 login을 완료한 후, UNIDE의 메인 화면에서 게시판 이용 과정을 시작할 수 있다. 메인 화면의 menu를 통해 community에 접속한다. 

먼저, community 조회 기능이다. 사용자가 community에 접속함과 동시에 community 관리 db에 조회 요청이 도착하고, 사용자들은 조회 및 좋아요, 댓글, 투표 등의 서비스 이용이 가능하다.

community 게시물 작성 시에는 community 관리, poll, tag, attachment 관련 db가 관여한다.

**4.6 community update/delete**

![그림 [4-6]](image%205.png)

그림 [4-6]

위 그림 [4-6]는 게시판 수정 및 삭제 use case를 나타낸 sequence diagram이다. 해당 그림은 많은 내용을 담고 있기 때문에 자세한 login과정은 생략한다.

그림의 내용은 게시물 수정과 삭제에 중점을 맞추었고, 여러 게시판의 이용 과정을 통합한 모습이다.

먼저 수정은 다른 과정과 비교해서 간단하다. 특정 부분을 수정하면 관련 db에만 영향을 미친다.

반면 게시물 수정은 게시물 관련 db에 모두 영향을 미쳐서 관련 정보를 다 delete 처리를 해야한다.

**4.7 problem create/update/delete/restore**

![그림[4-7]](image%206.png)

그림[4-7]

위 그림 [4-7]은 문제 생성 수정 삭제 복구 를 다룬 use case를 나타낸 sequence diagram이다. 위의 diagram은 많은 내용을 담고 있기 때문에 login 과정에 대한 자세한 내용을 담고 있지 않다.

해당 과정에는 problems db, user db가 관여한다.

문제 생성, 수정 삭제, 복구 에 관여할 수 있는 사용자는 강사 혹은 관리자가 인증되어있어야 한다.

모든 과정은 log에 기록이 되고, 삭제된 문제 복구 시에는 log의 flag를 읽는 방법을 사용한다

**4.8 mypage**

다음은 my page 를 조회하는 방식의 use case를 나타낸 sequence diagram이다.

해당 과정은 크게 2 가지로 나뉘어 소개할 수 있다.

**4.8.1**

![그림 [4-8.1]](c3e43a3e-fc8e-42dd-958f-09d82ae15b72.png)

그림 [4-8.1]

위의 그림 [4-8.1]은 사용자가 본인의 mypage를 조회하는 usecase를 나타낸다.
사용자는 자신의 mypage를 조회하기 전, login이 완료되어야한다.
my page를 조회하기 위해서는 mypage db가 관여한다.

**4.8.2** 

![그림[4-8.2]](ed6c5534-e5bd-4998-889a-4362c39f4d29.png)

그림[4-8.2]

위 그림 [4-8.2]는 사용자가 본인이 아닌 다른 사람의 mypage를 조회하는 use case를 나타낸다.
이 경우 또한 마찬가지로 login이 완료되어 있어야 한다.
해당 use case에서는사용자가 다른 사람을 검색하는 과정이 있어 user db에서 검색 대상자가 존재하는지 확인하는 과정이 필요하다. 검색 대상자가 존재한다면 앞서 설명한 그림 [4-7.1]과 같이 my page에 접속한다. 만약 존재하지 않는다면 my page에 접속할 수 없다.

**4.9 view my submission**

![그림[4-9]](image%207.png)

그림[4-9]

그림 [4-9]은 사용자가 자신이 제출했던 '제출 내역'을 확인하는 use case를나타낸 sequence diagram이다.
'제출 내역'은 '마이 페이지'에서 확인 가능하며, 해당 과정에서는 my page db와 submission db가 관여한다. 만약 제출 내역이 없을 경우, 제출 내역이 없음을 나타내는 메시지를 반환하고 제출 내역이 있을 경우 해당 내용을 반환한다.

**4.10 my page update**

![image.png](image%208.png)

**4.11 Admins view user list**

![image.png](image%209.png)

위 그림 [4-11]은 관리자가 '전체 사용자 목록 조회'를 실행하는 use case를 나타낸 sequence diagram이다.
먼저, 관리자가 '관리자 페이지'에 접근하기 위해서는 user db 가 관여하여 관리자 권한이 있는지 확인한다. 해당 권한이 있다면 '전체 사용자 목록 조회'가 가능하며, user db에서 데이터를 반환 받는다. 만약 db연동에 문제가 생긴다면 에러 메시지가 반환 된다.

**4.12 change the user’s state**

![그림[4-12]](image%2010.png)

그림[4-12]

위 그림 [4-12]은 관리자가 사용자의 상태를 공개, 비공개, 정지 등으로 바꿀 수 있는 use case의 sequence diagram이다.
위 그림에서는 관리자가 UNIDE 전체 user list를 구하는 내용은 앞 4.10과 겹치기 때문에 예외 상황은 생략한다. 관리자는 user list에서 특정 사용자를 한 명 선택한 후, 상태 변경을 누르게 되면 사용자의 계정 상태는 변경 되고 user db는 update 된다. 해당 내용은 log에도 기록된다.
만약 user db가 update 하는 과정에서 오류가 난다면 메시지를 반환한다.

**4.13 admins view instructors’ application lists**

![그림[4-13]](image%2011.png)

그림[4-13]

[그림 4-13]은 관리자가 관리자 페이지에서 강사 지원 목록을 조회하는 과정을 나타낸 시퀀스 다이어그램이다. 관리자가 로그인 후 페이지를 클릭하면 Admin Service가 JWT 토큰을 검증하고, Instructor Application DB로부터 지원서 목록을 조회한다.

조회가 성공하면 신청 내역이 화면에 표시되고, 실패 시 “강사 신청 정보를 불러올 수 없습니다.”라는 오류 메시지가 출력된다. 이 과정은 인증, 데이터 조회, 결과 반환의 순서로 진행된다.

4.14

---

## 5. State machine diagram

[https://drive.google.com/file/d/17PqKTZuBthIxweG_30RKfS2sybvM5rmR/view](https://drive.google.com/file/d/17PqKTZuBthIxweG_30RKfS2sybvM5rmR/view)

![state.drawio (2).png](state.drawio_(2).png)

[그림 5 - state machine diagram]

이곳엔 UnIDE 웹사이트의 상태 머신에 대해 서술한다. 위 그림은 본 프로젝트의 웹 애플리케이션 전반(페이지, 화면)과 문제 풀이 플로우(IDE 내부 서브머신)를 함께 표현한 상태머신 다이어그램이다. 각 상태는 사용자가 보는 화면에 대응하며, 문제 풀이 IDE는 코드작성 및 실행결과 과정에 함께 나타내었다. 

### **주요 상태 설명**

### 1) 홈 화면 (Home)

- 사이트 접속 시 가장 먼저 표시되는 초기 상태이다.
- UniIDE 플랫폼의 간략한 소개, 주요 기능 요약, 그리고 사용자 평판 및 랭킹 정보가 표시된다.
- 상단 Topbar를 통해 로그인, 회원가입, 문제목록, 게시판 등으로 이동할 수 있다.
- 홈 화면은 비로그인 상태에서도 접근 가능하지만, 대부분의 기능은 로그인 후 이용할 수 있다.

### 2) 로그인 / 회원가입 (Login / Sign-Up)

- 사용자가 계정을 등록하거나 로그인할 수 있는 상태이다.
- 로그인 완료 후에는 홈 화면 혹은 이전 페이지로 복귀한다.
- 회원가입 시 중복 확인 절차를 거치며, 성공 시 로그인 페이지로 자동 전환된다.

### 3)  문제 목록 (Problem List)

- 다양한 프로그래밍 문제가 나열된 상태로, 각 문제는 제목·난이도·조회수·등록일 등으로 표시된다.
- **검색(Search)**, **정렬(Sort)**, **필터(Filter)** 기능을 통해 특정 조건의 문제를 탐색할 수 있다.
- 문제를 선택하면 **문제 상세(Problem Detail)** 페이지로 전이한다.
- 상단 Topbar를 통해 언제든 홈 화면 또는 게시판으로 이동할 수 있다.

### 4)  문제 상세 (Problem Detail)

- 문제 설명, 입출력 형식, 제한사항, 예제 입출력, 작성자, 성공률 등의 정보를 볼 수 있다.
- “코드 작성하기” 버튼을 누르면 IDE 환경으로 전이하여 실제 코드를 작성할 수 있다.
- 이미 풀이한 문제의 경우, 기존 제출 결과나 풀이 이력을 확인할 수 있다.
- Topbar를 통해 문제 목록이나 홈 화면으로 복귀할 수 있다.

### 5)  코드 작성 및 실행 (IDE 내부 서브머신)

- 실제 코드 작성과 실행이 이루어지는 핵심 기능 영역이다.
- 하위 상태는 다음과 같이 구성된다:
    - **코드 작성 (Editing)**: 코드 입력 및 언어 선택, 예제 테스트 실행 가능.
    - **코드 실행 (Running)**: 사용자가 작성한 코드를 샘플 입력으로 실행.
    - **결과 확인 (Result View)**: 표준 출력, 오류 메시지, 실행 시간 등을 표시.
    - **문제 제출 (Submitting)**: 서버에 채점을 요청하고 결과를 대기.
    - **채점 결과 (Judged)**: 테스트 결과(성공/실패)에 따른 피드백 및 해설 보기.
- 사용자는 언제든 다시 코드 편집 화면으로 돌아가 수정할 수 있으며,
    
    상단 Topbar를 통해 문제 목록 또는 홈으로 복귀할 수 있다.
    

### 6)  게시판 (Board)

- 사용자들이 자유롭게 글을 작성하고, 질문을 올리며, 댓글을 통해 상호작용할 수 있는 커뮤니티 공간이다.
- 게시글 등록, 수정, 삭제가 가능하며, 댓글 기능을 통해 의견을 남길 수 있다.
- 특정 게시글 클릭 시 **게시글 상세 보기** 상태로 진입한다.
- Topbar를 통해 홈 화면, 문제 목록, 코드 작성 등 다른 페이지로 쉽게 전환할 수 있다.

### 7) 마이페이지 (My Page)

- 사용자의 개인 활동 및 학습 현황을 확인할 수 있는 공간이다.
- 로그인된 사용자만 접근할 수 있으며, Topbar에서 프로필 아이콘 또는 사용자 이름을 클릭하면 이동할 수 있다.
- 마이페이지는 다음과 같은 주요 구성 요소를 포함한다:
    - **내 정보 보기**: 사용자 이름, 이메일, 가입일 등 기본 계정 정보를 확인한다.
    - **풀이 현황(Problem History)**: 지금까지 푼 문제 목록, 시도 횟수, 정답률, 마지막 제출 결과 등을 시각적으로 보여준다.
    - **제출 이력(Submission Log)**: 각 문제별 코드 제출 내역과 실행 결과(성공, 실패, 시간 초과 등)를 확인할 수 있다.
    - **랭킹 및 평판(Performance & Reputation)**: 문제 해결 점수, 누적 포인트, 전체 사용자 중 순위를 확인할 수 있다.
    - **설정(Settings)**: 프로필 이미지 변경, 비밀번호 재설정, 다크모드 토글 등의 사용자 환경 설정 기능을 제공한다.
- 마이페이지에서 특정 문제를 클릭하면 해당 문제의 **문제 상세 페이지** 또는 **IDE 화면(코드 작성)** 으로 바로 이동할 수 있다.
- Topbar를 통해 다시 홈, 문제 목록, 게시판 등으로 쉽게 전환할 수 있다.

### 8) 강사/관리자 페이지 (Admin Page)

- 관리자는 해당 상태를 통해 사용자 계정 관리, 문제 등록 및 삭제, 게시글 검수 등의 작업을 수행한다.
- 강사는 해당 상태에서 문제 등록, 수정 등의 작업을 수행한다.
- 일반 사용자와 접근 권한이 구분되며, 강사와 관리는 마이페이지에서 관리 메뉴로 진입할 수 있다.
- 관리 페이지에서는 “문제 등록/수정/삭제”, “게시글 관리”, “유저 제재” 등의 기능이 존재한다.

### 9) 스터디 그룹 (Study Group)

- 사용자가 함께 학습하고 문제를 공유할 수 있는 **협업형 커뮤니티 공간**이다.
- 로그인된 사용자라면 누구나 스터디 그룹을 생성하거나 기존 그룹에 가입할 수 있다.
- 마이페이지나 홈 화면, 혹은 Topbar의 전용 메뉴를 통해 접근 가능하다.

### 스터디 그룹 구성요소

1. **스터디 그룹 목록** 
    - 현재 존재하는 모든 스터디 그룹을 볼 수 있다.
    - 그룹명, 인원 수, 활동 현황 등이 표시되며,
        
        원하는 그룹에 ‘그룹 가입 버튼’을 눌러 참여할 수 있다.
        
    - 새로운 그룹을 만들고 싶다면 “스터디 그룹 생성” 버튼을 통해 생성 가능하다.
2. **내 스터디 그룹 (My Study Group)**
    - 자신이 속한 스터디 그룹을 관리하는 페이지이다.
    - 각 그룹별 활동 현황, 그룹원 목록, 공지사항 등을 확인할 수 있다.
    - 그룹장이면 그룹 이름, 설명, 규칙 등을 수정하거나 그룹 해산을 할 수 있다.
    - 일반 구성원은 그룹 탈퇴가 가능하며, 다른 그룹으로 이동할 수 있다.
3. **그룹 대화 (Group Chat)**
    - 스터디 그룹 내 구성원들이 실시간으로 대화하거나 의견을 교환할 수 있는 기능이다.
    - 문제 풀이, 일정 조율, 코드 리뷰 등 협력 학습을 위한 중심 공간으로 사용된다.
4. **그룹 활동 (Group Activities)**
    - 그룹원들이 함께 푼 문제, 진행 중인 과제, 랭킹 등을 시각적으로 보여준다.
    - 스터디 목표, 기간, 진행률을 설정하고 관리할 수 있다.
    - 그룹장이 주간 미션을 설정하거나, 공지글을 게시할 수 있다.
5. **그룹 관리 (Group Management)**
    - 그룹장은 멤버 초대, 추방, 역할 부여(리더/일반 멤버) 등의 권한을 가진다.
    - 필요 시 “그룹 해산” 기능을 통해 그룹을 삭제할 수 있다.

## Topbar 전역 네비게이션

Topbar는 모든 페이지 상단에 고정되어 있으며,
사용자의 로그인 여부에 따라 메뉴 구성이 달라진다.

Topbar는 다음과 같은 전역 내비게이션 기능을 제공한다.

- 홈, 문제 목록, 게시판, 스터디 그룹, 로그인/회원가입 페이지로 즉시 이동 가능하다
- 로그인 후에는 사용자 이름과 프로필 이미지를 표시하며, 마이페이지 진입 버튼 역할 수행한다
- 로그아웃 버튼 클릭 시 세션 종료 후 홈 화면으로 복귀한다

---

## 6. User interface prototype

*일단 프런트 개발 완료된 페이지들 올려두고 개발되지 못한 페이지들은 피그마로 임시 대체 해두고, 개발 최종 완료될 때 다시 그걸로 수정해두겠습니다 *

이 장은 예상 UI와 UI안의 각 구성요소를 설명한다. 실제 개발된 어플의 UI와 디자인은 조금씩 달라지지만 내용은 같다.

[User interface prototype](https://www.notion.so/User-interface-prototype-2a058162dd728026a3bdcc85b6dbec98?pvs=21)

양이 너무 거대해져서 + 랙먹어서 사진 포함한 이후 내용들은 페이지 새로 파서 넣어놨습니다!

---

## 7. Implementation requirements

**H/W platform requirements**

-CPU : Intel Core i3 또는 동급 AMD 프로세서 이상

-RAM: 8GB 이상

-Storage: SSD 128GB 이상

-Network: WAN 연결

 **S/W platform requirements**

-OS: Windows 10 / 11 또는 macOS

-Implementation Language : JavaScript(React), TypeScript

-Bundler / Dev Server: Vite

-Package Manager: npm 10.9.3

-Node.js 22.18.0

 **Server platform requirements**

-JDK 22.0.2 

-Java 17

-Spring Boot 3.5.6 

-Gradle 8.14.3

-MySQL 8.4.6 

---

## 8. Glossary

---

## 9. References
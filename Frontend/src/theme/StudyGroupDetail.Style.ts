import styled from "styled-components";

//팀장 본인 색 표시 다른용도
export interface MemberItemProps {
  isLeader: boolean;
  isSelf: boolean;
}

/* 전체 레이아웃 */
export const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  margin: 0 auto;
  padding: 80px 40px 40px 40px;
  background-color: ${(p) => p.theme.bgColor};
  color: ${(p) => p.theme.textColor};
  box-sizing: border-box;
`;

/* 페이지 레이아웃: 좌측 사이드바 + 우측 메인 */
export const PageLayout = styled.div`
  display: flex;
  gap: 30px;
  align-items: flex-start;
  max-width: 1600px;
  margin: 0 auto;
`;

/* 사이드바 */
export const SidebarContainer = styled.aside`
  width: 350px;
  flex: 0 0 350px;
`;

/* 메인 콘텐츠 영역 (탭 포함) */
export const MainContentContainer = styled.main`
  flex: 1;
`;

/* 사이드바 내부 */
export const SidebarWrapper = styled.div`
  background-color: ${(p) => p.theme.headerBgColor};
  border-radius: 12px;
  padding: 25px;
`;

/* 그룹 헤더 */
export const GroupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 10px;
`;

/* 그룹명 (크게) */
export const GroupName = styled.h2`
  font-size: 30px;
  font-weight: 700;
  margin: 0;
  color: ${(p) => p.theme.textColor};
`;

export const LeaderBadge = styled.p`
  font-size: 18px;
  color: ${(p) => p.theme.logoColor};
  font-weight: 600;
  margin: 5px 0 10px 0;
`;

/* 수정 버튼 */
export const EditButton = styled.button`
  background-color: transparent;
  border: 1px solid ${(p) => p.theme.authHoverBgColor};
  color: ${(p) => p.theme.textColor};
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
`;

/* 태그 컨테이너 */
export const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 15px 0;
`;

/* 개별 태그 */
export const TagChip = styled.span`
  background-color: ${(p) => p.theme.focusColor};
  color: ${(p) => p.theme.bgColor};
  padding: 8px 12px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
`;

/* 그룹 설명 */
export const GroupDescription = styled.p`
  font-size: 18px;
  line-height: 1.6;
  margin: 15px 0;
  color: ${(p) => p.theme.textColor};
`;

/* 목표 박스 */
export const GoalContainer = styled.div`
  margin-top: 15px;
  padding: 15px;
  background-color: ${(p) => p.theme.authHoverBgColor};
  border-radius: 8px;
  font-size: 18px;
  h3 {
    color: ${(props) => props.theme.textColor};
  }
  color: ${(props) => props.theme.textColor};
`;

/* 멤버 리스트 */
export const MemberListContainer = styled.div`
  margin-top: 20px;
  h3 {
    color: ${(props) => props.theme.textColor};
  }
`;

/* 개별 멤버 */
export const MemberItem = styled.div<MemberItemProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 8px;
  border-radius: 6px;
  margin-top: 8px;
  background-color: transparent;
  font-size: 18px;
  color: ${(props) => props.theme.textColor};

  /*isLeader*/
  ${(props) =>
    props.isLeader &&
    `
      color: ${props.theme.focusColor};
      font-weight: 700;
  `}

  /*isSelf */
  ${(props) =>
    props.isSelf &&
    `
      color: ${props.theme.logoColor}; 
      font-weight: 700;
  `}
`;

/* 작은 버튼들 */
export const SmallButton = styled.button<{ $isDanger?: boolean }>`
  width: 100%;
  margin-top: 15px;
  padding: 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 400;
  font-size: 18px;
  background-color: ${(p) => (p.$isDanger ? "#E45757" : p.theme.logoColor)};
  color: ${(p) => p.theme.bgColor};
`;

/* 탭 네비게이션 (상단) */
export const TabNav = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
`;

/* 탭 버튼 */
export const TabButton = styled.button<{ isActive?: boolean }>`
  padding: 12px 18px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 20px;
  background-color: ${(p) => (p.isActive ? p.theme.logoColor : "transparent")};
  color: ${(p) =>
    p.isActive ? p.theme.authHoverTextColor : p.theme.textColor};};
`;

/* 탭 내용 영역 */
export const TabContent = styled.section`
  background-color: ${(p) => p.theme.headerBgColor};
  border-radius: 12px;
  padding: 25px;
`;

/* ProblemListTab 관련 스타일들 */
export const TabContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h3 {
    font-size: 24px;
    font-weight: 700;
    color: ${(p) => p.theme.textColor};
  }
`;

export const ProblemListAddButton = styled.button`
  padding: 10px 16px;
  border-radius: 8px;
  background-color: ${(p) => p.theme.focusColor};
  color: ${(p) => p.theme.bgColor};
  font-weight: 700;
  font-size: 18px;
  border: none;
  cursor: pointer;
`;

/* 아코디언 컨테이너 */
export const ProblemAccordionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

/* 아코디언 항목 (접힘/펼침) */
export const ProblemAccordionItem = styled.div<{ $isExpanded?: boolean }>`
  border-radius: 10px;
  overflow: hidden;
  background-color: ${(p) => p.theme.bgColor};
  border: 1px solid ${(p) => p.theme.authHoverBgColor};
`;

/* 아코디언 헤더 (클릭해서 열림) */
export const AccordionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px;
  cursor: pointer;
`;

/* 제목 요약 영역 */
export const ProblemSummary = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${(p) => p.theme.textColor};
`;

/* 작은 요약 (예: 3/5) */
export const ProblemSummarySmall = styled.div`
  font-size: 18px;
  color: ${(p) => p.theme.textColor};
  opacity: 0.8;
`;

/* 아코디언 내부 정보 (펼쳐졌을 때) */
export const ProblemListInfo = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  color: ${(p) => p.theme.textColor};
  font-size: 18px;
`;

/* 상세 문제 목록 */
export const ProblemDetailList = styled.div`
  padding: 15px 20px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

/* 개별 상세 문제 아이템 */
export const ProblemDetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  justify-content: space-between;
  padding: 10px;
  border-radius: 8px;
`;

/* 문제 제목 링크처럼 보이게 */
export const ProblemTitleLink = styled.button`
  background: none;
  border: none;
  padding: 0;
  text-align: left;
  cursor: pointer;
  font-weight: 600;
  font-size: 20px;
  color: ${(p) => p.theme.textColor};
`;

/* 상태 배지 */
export const StatusBadge = styled.span<{ $status?: string }>`
  padding: 8px 12px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 18px;
  color: ${({ theme, $status }) =>
    $status === "ok" ? theme.logoColor : "#E45757"};
`;

export const ProblemListInfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  span {
    color: ${(p) => p.theme.textColor};
  }
`;

/* 제출일 */
export const SubmissionDateText = styled.span`
  font-size: 18px;
  opacity: 0.8;
  color: ${(props) => props.theme.textColor};
  white-space: nowrap;
`;

//문제목록 생성 관련
import { SecondaryButton as GlobalSecondaryButton } from "./StudyGroupMain.Style";

export const PLWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const PLRow = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
`;

export const PLLabel = styled.label`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.textColor};
`;

export const ProblemListBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ProblemItem = styled.div`
  padding: 12px 14px;
  background: ${({ theme }) => theme.headerBgColor};
  border: 1px solid ${({ theme }) => theme.authHoverBgColor};
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  color: ${({ theme }) => theme.textColor};
  font-size: 15px;
`;

export const RemoveButton = styled(GlobalSecondaryButton)`
  padding: 4px 10px;
  font-size: 13px;
  border-radius: 6px;
`;

/*그룹장 이름*/
export const GroupLeader = styled.div`
  font-weight: bold;
  color: ${({ theme }) => theme.logoColor};
  margin-top: 5px;
  margin-bottom: 10px;
`;

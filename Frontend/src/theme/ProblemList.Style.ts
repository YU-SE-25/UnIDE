import styled from "styled-components";
import { Link } from "react-router-dom";
import { TOPBAR_HEIGHT } from "../components/Topbar";

// HeaderCell 너비 prop 타입
export interface HeaderCellProps {
  width: string;
}
export type UserProblemStatus = "SOLVED" | "ATTEMPTED" | "NOT_SOLVED";

// 푼 문제 상태 타입
export interface StatusProps {
  $userStatus?: "SOLVED" | "ATTEMPTED" | "NOT_SOLVED";
}
//레이아웃 및 컨트롤 스타일, 스터디그룹 화면 크기용 추가
export const ProblemListWrapper = styled.div<{ $fullWidth?: boolean }>`
  height: 100%;
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "80%")};
  margin: 0 auto;
  display: flex;
  padding-top: ${TOPBAR_HEIGHT + 10}px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: ${(props) => props.theme.bgColor};
`;
//PageTitle과 AddButton을 묶는 컨테이너
export const PageTitleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

export const PageTitle = styled.h1`
  font-size: 30px;
  font-weight: 700;
  color: ${(props) => props.theme.textColor};
  flex-shrink: 0;
`;
export const ControlBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
  transform: scale(1.1);
`;
export const SearchContainer = styled.div`
  display: flex;
  gap: 10px;
`;
export const SearchInput = styled.input`
  padding: 10px 14px;
  border: 1px solid ${(props) => props.theme.authHoverBgColor};
  border-radius: 4px;
  width: 340px;
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.bgColor};
`;
export const SearchButton = styled.button`
  padding: 10px 18px;
  background-color: ${(props) => props.theme.logoColor};
  color: ${(props) => props.theme.bgColor};
  border: none;
  border-radius: 6px;
  font-size: 15px;
  cursor: pointer;
  transition: background-color 0.2s;
`;
export const SortSelect = styled.select`
  min-width: 120px;
  padding: 10px 14px;
  border: 1px solid ${(props) => props.theme.authHoverBgColor};
  border-radius: 6px;
  font-size: 15px;
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.bgColor};
  option {
    color: ${(props) => props.theme.textColor};
    background-color: ${(props) => props.theme.bgColor};
  }
`;
//문제 추가 버튼
export const AddButton = styled.button`
  padding: 10px 25px;
  background-color: ${(props) => props.theme.logoColor};
  color: ${(props) => props.theme.bgColor};
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
`;

//문제 목록 테이블 스타일
export const ProblemTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 40px;
  background-color: ${(props) => props.theme.headerBgColor};
  border-radius: 10px;
  overflow: hidden;
  table-layout: fixed;
`;
export const TableHead = styled.thead`
  background-color: ${(props) => props.theme.logoColor};
`;
export const HeaderCell = styled.th<HeaderCellProps>`
  width: ${(props) => props.width};
  padding: 12px 10px;
  text-align: left;
  font-weight: 600;
  color: ${(props) => props.theme.bgColor};
`;
export const TableRow = styled.tr<StatusProps>`
  border-bottom: 1px solid ${(props) => props.theme.authHoverBgColor};
`;
export const TableCell = styled.td`
  padding: 12px 10px;
  color: ${(props) => props.theme.textColor};
  font-size: 17px;
  vertical-align: middle;
  background-color: ${(props) => props.theme.headerBgColor}60;
`;
export const EmptyCell = styled(TableCell)`
  text-align: center;
  padding: 40px;
  color: ${(props) => props.theme.textColor}60;
  font-style: italic;
`;

//제목 셀, 링크, 아코디언 스타일
export const ProblemLink = styled(Link)`
  color: ${(props) => props.theme.textColor};
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  /* 제목 텍스트가 너무 길 경우 처리 (선택 사항) */
  /* white-space: nowrap; */
  /* overflow: hidden; */
  /* text-overflow: ellipsis; */

  &:hover {
    text-decoration: underline;
    color: ${(props) => props.theme.focusColor};
  }
`;
export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

//필터상태
export const StatusIndicator = styled.span<StatusProps>`
  font-size: 17px;
  padding: 4px 8px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;

  ${({ $userStatus, theme }) => {
    switch ($userStatus) {
      case "SOLVED":
        return `
          background: ${theme.logoColor + "30"}; 
          border: 1px solid ${theme.logoColor}; 
          color: ${theme.textColor}; 
        `;
      case "ATTEMPTED":
        return `
          background: #ff383830; 
          border: 1px solid #ff3838; 
          color: ${theme.textColor}; 
        `;
      default:
        return ``;
    }
  }}
`;
export const TitleCell = styled(TableCell)`
  /* TitleCell 고유 스타일이 있다면 여기에 추가 */
`;
//문제 필터 드롭다운 스타일
export const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid ${(props) => props.theme.authHoverBgColor};
  border-radius: 4px;
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.bgColor};
  /* 💡 ControlBar 내에서 다른 요소와 구분되도록 margin-left를 auto로 설정 */
  margin-left: auto;
`;

// 아코디언 펼치기 버튼
export const ExpandButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${(props) => props.theme.textColor};
  padding: 5px;
  line-height: 1;
  margin-left: auto;

  &:hover {
    color: ${(props) => props.theme.focusColor};
  }
`;
// 아코디언 내용 행
export const SummaryRow = styled.tr`
  background-color: ${(props) => props.theme.bgColor};
  border-bottom: 1px solid ${(props) => props.theme.authHoverBgColor};
`;
// 아코디언 내용 박스
export const SummaryBox = styled.div`
  padding: 15px 20px;
  font-size: 20px;
  color: ${(props) => props.theme.textColor};
  line-height: 1.6;
  text-align: left;

  display: flex;
  justify-content: space-between;
  align-items: center;

  p {
    margin-bottom: 8px;
  }
  p,
  div,
  strong {
    color: ${(props) => props.theme.textColor};
  }
`;
export const ButtonContainer = styled.div`
  display: flex;
  gap: 10px; /* 버튼 사이 간격 */
  flex-shrink: 0; /* 버튼 영역 줄어들지 않게 */
`;
//코드 바로 작성 버튼
export const ActionInSummaryButton = styled.button`
  padding: 6px 12px;
  background-color: ${(props) => props.theme.logoColor};
  color: ${(props) => props.theme.bgColor};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 20px;
  transition: background-color 0.2s;
`;
//문제 상세보기 버튼
export const DetailsButton = styled.button`
  padding: 6px 12px;
  background-color: ${(props) => props.theme.authHoverBgColor};
  color: ${(props) => props.theme.textColor};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 20px;
  transition: background-color 0.2s;
`;

//페이지네이션
export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 30px;
`;

export const PageLink = styled.span<{
  isActive?: boolean;
  isDisabled?: boolean;
}>`
  /* 기본 텍스트 스타일 */
  color: ${(props) => props.theme.textColor};
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  text-decoration: none;
  transition: color 0.2s;

  /* 현재 페이지 강조 (굵게) */
  font-weight: ${(props) => (props.isActive ? "bold" : "normal")};
  color: ${(props) => (props.isActive ? "#ff3838" : props.theme.textColor)};

  /* 비활성화 상태 (클릭 불가, 흐리게) */
  ${(props) =>
    props.isDisabled &&
    `
    color: ${props.theme.textColor}60; 
    cursor: not-allowed;
    pointer-events: none; /* 클릭 이벤트 자체를 막음 */
  `}

  /* 호버 효과 (비활성화 아닐 때만) */
  &:not([aria-disabled="true"]):hover {
    color: ${(props) => props.theme.focusColor};
    text-decoration: underline;
  }
`;
// 태그 표시 컨테이너
export const TagDisplayContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 25px;
  padding-bottom: 5px;
`;
// 개별 태그 Chip 스타일
export const TagChip = styled.span<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  background-color: ${(props) =>
    props.$active ? props.theme.focusColor : props.theme.authHoverBgColor};
  color: ${(props) =>
    props.$active ? props.theme.bgColor : props.theme.textColor};
  padding: 4px 9px;
  border-radius: 13px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
`;

//문제 목록 속 태그 칩
export const ProblemTagChip = styled.span<{ $status?: string }>`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: white;

  background-color: ${({ $status }) =>
    $status === "SOLVED"
      ? "#4caf50"
      : $status === "ATTEMPTED"
      ? "#ff9800"
      : "transparent"};
`;

// 문제 기록 상태 뱃지
export const StatusChip = styled.span<{
  $status?: "SOLVED" | "ATTEMPTED" | "NOT_SOLVED";
}>`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: white;

  background-color: ${({ $status }) =>
    $status === "SOLVED"
      ? "#4caf50" // 초록
      : $status === "ATTEMPTED"
      ? "#f44336" // 빨강
      : "gray"}; // NONE = 회색
`;
export const TagChipForList = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;

  background: ${({ theme }) => theme.focusColor};
  color: ${({ theme }) => theme.bgColor};
  border: none;

  margin-right: 6px;
  margin-bottom: 4px;
`;

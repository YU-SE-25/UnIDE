import styled from "styled-components";
import { Link } from "react-router-dom";
import type { StatusProps } from "./ProblemList.Style";

//페이지 전체 레이아웃
export const ProblemWrapper = styled.div`
  height: 100%;
  width: 80%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
`;
export const MainContent = styled.div`
  height: 100%;
  width: 80%;
  margin: 0 auto;
  padding: 30px;
  border-radius: 8px;
`;

//문제 메타 정보 섹션
export const MetaInfoSection = styled.section`
  margin-bottom: 35px;
`;

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 15px; /* 간격 조정 */
  margin-bottom: 12px;
  font-size: 20px;
  color: ${(props) => props.theme.textColor};

  &:first-child {
    gap: 10px 15px;
    font-size: 25px;
  }
`;
export const MetaLabel = styled.span`
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
  margin-right: 5px;
`;
export const MetaValue = styled.span`
  font-weight: 400;
  color: ${(props) => props.theme.textColor};
  a {
    color: ${(props) => props.theme.textColor};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
      color: ${(props) => props.theme.logoColor};
    }
  }
  &:not(:last-child)::after {
    content: "|";
    margin-left: 20px;
    color: ${(props) => props.theme.authHoverBgColor};
    font-weight: normal;
  }
`;
//푼 문제 통계 박스
export const UserStatsBox = styled.div<StatusProps>`
  /* StatusProps 타입 필요 */
  margin-top: 15px;
  padding: 10px 15px;
  border-radius: 6px;
  font-size: 14px;
  display: flex;
  gap: 8px 20px;
  color: ${(props) => props.theme.textColor};

  border: 2px solid
    ${(props) =>
      props.$userStatus === "SOLVED"
        ? props.theme.logoColor
        : props.$userStatus === "ATTEMPTED"
        ? "#ff3838"
        : "transparent"};

  /* 내부 MetaLabel, MetaValue 색상도 상속받도록 조정 */
  ${MetaLabel}, ${MetaValue} {
    color: inherit;
  }
`;

//문제 설명 및 예제 섹션
export const DescriptionSection = styled.section`
  margin-bottom: 30px;
  line-height: 1.7;

  h3 {
    font-size: 30px;
    font-weight: 600;
    margin-top: 30px;
    margin-bottom: 5px;
    border-bottom: 1px solid ${(props) => props.theme.authHoverBgColor};
    color: ${(props) => props.theme.textColor};
  }

  p,
  pre {
    /* 본문과 코드 예제 스타일 */
    font-size: 20px;
    margin-bottom: 30px;
    color: ${(props) => props.theme.textColor};
  }

  /*코드 블록 스타일*/
  pre {
    background-color: ${(props) => props.theme.bgColor};
    padding: 15px;
    border-radius: 4px;
    border: 1px solid ${(props) => props.theme.authHoverBgColor};
    color: ${(props) => props.theme.logoColor}; /* 코드 글자색을 강조색으로 */
  }
`;
//제목과 태그를 묶는 헤더
export const SectionHeader = styled.div`
  display: flex;
  align-items: baseline;
  gap: 15px;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid ${(props) => props.theme.authHoverBgColor};
  flex-wrap: wrap;

  h3 {
    margin: 0;
    border: none;
    padding: 0;
    flex-shrink: 0; /* 제목 줄어들지 않게 */
    color: ${(props) => props.theme.textColor};
  }
`;
//인라인 태그 목록 스타일
export const InlineTagList = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;
//태그 영역
export const TagLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  background-color: ${(props) => props.theme.focusColor};
  color: ${(props) => props.theme.bgColor};
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
`;
//태그 간격
export const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 8px 0 12px 0;
`;

//입출력
// 전체 예제들을 세로로 쌓는 컨테이너 (기존)
export const ExampleContainer = styled.div`
  display: flex;
  flex-direction: column; /* 세로 배치 유지 */
  gap: 20px; /* 예제 쌍 사이의 세로 간격 */
  margin-top: 20px;
`;

//추가: 입력/출력 한 쌍을 가로로 묶는 컨테이너
export const ExamplePairWrapper = styled.div`
  display: flex; /* 내부 요소(입력/출력)를 가로로 배치 */
  gap: 20px; /* 입력과 출력 사이 간격 */
`;

// 입력 또는 출력 예제 하나를 담는 섹션
export const ExampleSection = styled.div`
  flex: 1;
  h4 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
    color: ${(props) => props.theme.textColor};
  }
  pre {
    background-color: ${(props) => props.theme.bgColor};
    color: ${(props) => props.theme.textColor};
    padding: 15px;
    border-radius: 4px;
    border: 1px solid ${(props) => props.theme.authHoverBgColor};
    white-space: pre-wrap;
    word-break: break-all;
    min-height: 50px; /* 최소 높이 확보 */
  }
  code {
    color: ${(props) => props.theme.textColor};
  }
`;

//힌트 내용을 가리는 스포일러
export const HintSpoiler = styled.div`
  /* 배경색 제거 또는 투명하게 */
  background-color: transparent;

  /* 초기 글자색 */
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.textColor};

  border-radius: 4px;
  cursor: default;
  display: inline-block;
  transition: color 0.1s, background-color 0.1s;

  /* 마우스로 긁었을 때 */
  ::selection {
    color: ${(props) => props.theme.textColor};
    background-color: ${(props) => props.theme.bgColor};
  }
  /* Firefox 대응 */
  ::-moz-selection {
    color: ${(props) => props.theme.textColor};
    background-color: ${(props) => props.theme.logoColor};
  }

  p {
    margin: 0;
    font-size: 15px;
    line-height: 1.6;
  }
`;

// 액션 버튼 영역
export const ActionSection = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 16px 0;
  flex-wrap: wrap;

  .left,
  .right {
    display: flex;
    gap: 10px;
  }
`;

// 문제 풀기 버튼
export const SolveButton = styled.button`
  padding: 10px 25px;
  background-color: ${(props) => props.theme.logoColor};
  color: ${(props) => props.theme.authHoverTextColor};
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:disabled {
    background-color: ${(props) => props.theme.authHoverBgColor};
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    background-color: ${(props) => props.theme.logoColor};
  }
`;
// 이외의 버튼들 (보조 버튼 스타일)
export const ViewCodeButton = styled.button`
  padding: 10px 25px;
  border-radius: 5px;

  background-color: ${({ theme }) => theme.authHoverBgColor};
  color: ${({ theme }) => theme.authHoverTextColor};

  border: none;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.authHoverBgColor};
  }
`;

//문제 상세 위쪽 버튼들
export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
`;

export const SmallButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 5px;
`;

import styled from "styled-components";

/* 전체 레이아웃 */
export const Container = styled.div`
  display: flex;
  width: 100%;
  height: calc(100vh - 60px);
  overflow: hidden;
`;

/* 좌측 패널 */
export const LeftPanel = styled.div`
  flex: 1;
  padding: 16px;
  background: ${({ theme }) => theme.bgColor};
  color: ${({ theme }) => theme.textColor};
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

/* 문제 정보 */
export const ProblemInfo = styled.div`
  margin: 8px 0 14px 0;
  font-size: 20px;
  opacity: 0.9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.textColor};
  span {
    color: ${({ theme }) => theme.textColor};
  }
`;

/* 사용 언어 + 글씨크기 */
export const Toolbar = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 10px;
  font-size: 20px;
  color: ${({ theme }) => theme.textColor};

  span {
    opacity: 0.9;
    font-size: 14px;
    color: ${({ theme }) => theme.textColor};
  }
`;

/* Monaco Editor 박스 */
export const CodeBox = styled.div`
  margin-top: 10px;
  height: 300px;
  background: ${({ theme }) => theme.headerBgColor};
  border: 1px solid ${({ theme }) => theme.authHoverBgColor};
  padding: 8px;
  border-radius: 6px;
  color: ${({ theme }) => theme.textColor};
`;

/* 아코디언 박스 */
export const Accordion = styled.div`
  margin-top: 16px;
  padding: 14px;
  border: 1px solid ${({ theme }) => theme.authHoverBgColor};
  background: ${({ theme }) => theme.headerBgColor};
  border-radius: 6px;
  cursor: pointer;
  font-size: 20px;
  color: ${({ theme }) => theme.textColor};

  strong {
    display: block;
    margin-bottom: 4px;
    color: ${({ theme }) => theme.textColor};
  }
`;

/* 드래그바 */
export const Resizer = styled.div`
  width: 6px;
  cursor: col-resize;
  background: ${({ theme }) => theme.logoColor};
`;

/* 우측 분석 패널 */
export const RightPanel = styled.div<{ width: number }>`
  width: ${({ width }) => width}px;
  background: ${({ theme }) => theme.headerBgColor};
  border-left: 1px solid ${({ theme }) => theme.authHoverBgColor};
  display: flex;
  flex-direction: column;
  font-size: 18px;
  color: ${({ theme }) => theme.textColor};
`;

/* 탭 */
export const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.authHoverBgColor};
  color: ${({ theme }) => theme.textColor};
`;

export const TabButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 10px;
  background: transparent;
  border: none;
  cursor: pointer;

  color: ${({ active, theme }) => (active ? theme.logoColor : theme.textColor)};

  border-bottom: ${({ active, theme }) =>
    active ? `2px solid ${theme.logoColor}` : "none"};
`;

/* 탭 내용, h3,p 임시 */
export const Content = styled.div`
  padding: 16px;
  overflow-y: auto;
  flex: 1;
  color: ${({ theme }) => theme.textColor};

  h3 {
    color: ${({ theme }) => theme.textColor};
  }
  p {
    color: ${({ theme }) => theme.textColor};
  }
`;

/* 폰트 크기 선택 */
export const FontSizeSelect = styled.select`
  padding: 6px 10px;
  border-radius: 6px;
  background: ${({ theme }) => theme.headerBgColor};
  color: ${({ theme }) => theme.textColor};
  border: 1px solid ${({ theme }) => theme.authHoverBgColor};
  outline: none;

  option {
    background: ${({ theme }) => theme.headerBgColor};
    color: ${({ theme }) => theme.textColor};
  }
`;

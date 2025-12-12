import styled from "styled-components";

/* 기본 컨테이너 */
export const ProblemSolveWrapper = styled.div`
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  padding: 30px;
  display: flex;
  gap: 25px;
  min-height: 80vh;
  color: ${(props) => props.theme.textColor};
`;

/* 왼쪽: 문제 정보 영역 */
export const ProblemInfoContainer = styled.div`
  width: 35%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  color: ${(props) => props.theme.textColor};
`;

export const ProblemTitle = styled.h2`
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 10px;
  color: ${(props) => props.theme.textColor};
`;

export const ProblemDetailText = styled.div`
  font-size: 20px;
  opacity: 0.9;
  color: ${(props) => props.theme.textColor};
`;

export const ProblemDescriptionBox = styled.div`
  padding: 20px;
  border-radius: 6px;
  white-space: pre-wrap;
  line-height: 1.5;
  background: ${(props) =>
    props.theme.bgColor === "#191919"
      ? "rgba(255,255,255,0.05)"
      : "rgba(0,0,0,0.05)"};
  color: ${(props) => props.theme.textColor};
`;

/* 입출력 예시 */
export const ExampleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const ExamplePairWrapper = styled.div`
  display: flex;
  gap: 20px;
`;

export const ExampleSection = styled.div`
  flex: 1;

  h4 {
    font-size: 20px;
    margin-bottom: 8px;
    color: ${(props) => props.theme.textColor};
  }

  pre {
    background-color: ${(props) =>
      props.theme.bgColor === "#191919"
        ? "rgba(255,255,255,0.05)"
        : "rgba(0,0,0,0.05)"};
    color: ${(props) => props.theme.textColor};
    padding: 15px;
    border-radius: 4px;
    border: 1px solid ${(props) => props.theme.authHoverBgColor};
    white-space: pre-wrap;
    word-break: break-all;
    min-height: 50px;
  }

  code {
    color: ${(props) => props.theme.textColor};
  }
`;

/* 오른쪽 에디터 */
export const EditorPanelContainer = styled.div`
  width: 65%;
  display: flex;
  flex-direction: column;
  background: ${(props) =>
    props.theme.bgColor === "#191919" ? "#1f1f1f" : "#f4f4f4"};
  border-radius: 10px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
  overflow: hidden;
`;

/* 탭 영역 */
export const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

export const TabButton = styled.button<{
  $active: boolean;
  $disabled?: boolean;
}>`
  padding: 12px 16px;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  border: none;
  background: ${({ $active, theme }) =>
    $active ? theme.focusColor : "transparent"};
  color: ${({ $active, theme }) => ($active ? theme.bgColor : theme.textColor)};
  font-weight: bold;
  border-radius: 5px 5px 0 0;
  opacity: ${({ $disabled }) => ($disabled ? 0.4 : 1)};
`;

/* 내부 뷰 */
export const ViewContentWrapper = styled.div`
  padding: 20px;
  height: 500px;
  display: flex;
  flex-direction: column;
`;

/* 언어 표시 */
export const LanguageDisplay = styled.div`
  margin-bottom: 5px;
  opacity: 0.9;
  color: ${(props) => props.theme.textColor};
`;

/* 코드 영역 */
export const CodeArea = styled.div`
  flex: 1;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 15px;
`;

/* 버튼 줄 */
export const ActionRow = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

export const ActionButton = styled.button<{ $main?: boolean }>`
  padding: 8px 12px;
  border-radius: 5px;
  border: none;
  cursor: pointer;

  background: ${({ $main, theme }) =>
    $main ? theme.focusColor : theme.authHoverBgColor};

  color: ${({ $main, theme }) =>
    $main ? theme.bgColor : theme.authHoverTextColor};

  font-weight: 600;
`;

/*실행 결과 */
export const ResultBox = styled.div<{ $success: boolean }>`
  padding: 20px;
  border-radius: 10px;

  background: ${({ $success, theme }) =>
    $success ? `${theme.logoColor}30` : `#ff383830`};

  border-left: 4px solid
    ${({ $success, theme }) => ($success ? theme.logoColor : "#ff3838")};

  border: 1px solid
    ${({ $success, theme }) => ($success ? theme.logoColor : "#ff3838")};

  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ResultStatus = styled.div<{ $success: boolean }>`
  font-size: 20px;
  font-weight: bold;
  color: ${({ $success, theme }) => ($success ? theme.logoColor : "#ff3838")};
`;

export const ResultRow = styled.div`
  display: flex;
  justify-content: space-between;
  opacity: 0.9;

  span {
    opacity: 0.85;
  }
`;

/* 모달 오버레이 팝업*/
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
`;

export const ModalBox = styled.div<{ $success: boolean }>`
  width: 380px;
  padding: 25px;
  border-radius: 10px;

  background: ${(props) =>
    props.theme.bgColor === "#191919" ? "#252525" : "#ffffff"};

  border-left: 5px solid
    ${({ $success, theme }) => ($success ? theme.logoColor : "#ff3838")};

  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const ModalTitle = styled.h2<{ $success: boolean }>`
  font-size: 22px;
  font-weight: bold;
  color: ${({ $success, theme }) => ($success ? theme.logoColor : "#ff3838")};
`;

export const ModalButtons = styled.div`
  margin-top: 15px;
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  font-size: 15px;
`;

export const ModalButton = styled.button<{ $main?: boolean }>`
  padding: 8px 14px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;

  background: ${({ $main, theme }) =>
    $main ? theme.focusColor : theme.authHoverBgColor};
  color: ${({ $main, theme }) =>
    $main ? theme.bgColor : theme.authHoverTextColor};
`;

export const ResultText = styled.p`
  color: ${(props) => props.theme.textColor};
  font-size: 20px;
  margin: 4px 0;
  opacity: 0.9;
`;

export const LanguageSelectWrapper = styled.div`
  display: inline-block;
  margin-left: 10px;
`;

export const LanguageSelect = styled.select`
  padding: 4px 6px;
  border-radius: 6px;
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
  border: 1px solid ${(props) => props.theme.authHoverBgColor};
  font-size: 14px;
`;

// 코드 에디터 전체 박스를 감싸는 wrapper (배경색 커스텀 가능)
export const EditorWrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
  border-radius: 10px;
  padding: 10px;
  box-sizing: border-box;
`;

// 폰트 크기 선택 드롭다운
export const FontSizeSelect = styled.select`
  margin-left: 10px;
  padding: 4px 6px;
  border-radius: 6px;
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
  border: 1px solid ${(props) => props.theme.authHoverBgColor};
  font-size: 14px;
`;

// solve 전용 예시 박스
export const ExampleBox = styled.div`
  margin-top: 20px;
  background-color: ${(props) => props.theme.headerBgColor};
  padding: 16px;
  border-radius: 8px;
  font-size: 15px;
  line-height: 1.5;
  white-space: pre-wrap;
`;

//input값 박스 틀
export const RunInputBox = styled.textarea`
  width: 100%;
  height: 80px;
  margin-top: 8px;
  border-radius: 6px;
  padding: 8px;
  resize: vertical;

  background: ${({ theme }) => theme.bgColor};
  color: ${({ theme }) => theme.textColor};
  border: 1px solid ${({ theme }) => theme.textColor}55;

  &::placeholder {
    color: ${({ theme }) => theme.textColor}88;
  }
`;

//문제 검색(코드 스크래치 페이지)
export const ScratchInput = styled.input`
  padding: 8px;
  width: 150px;
  border-radius: 6px;

  background-color: ${({ theme }) => theme.bgColor};
  color: ${({ theme }) => theme.textColor};
  border: 1px solid ${({ theme }) => theme.authHoverBgColor};

  &::placeholder {
    color: ${({ theme }) => theme.textColor}88;
  }
`;



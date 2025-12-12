import styled from "styled-components";
import { TOPBAR_HEIGHT } from "../components/Topbar";

interface ActionButtonProps {
  $main?: boolean;
  disabled?: boolean;
}

export const ResetPageWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: ${TOPBAR_HEIGHT + 50}px;
  background-color: ${(props) => props.theme.bgColor};
`;
export const LoginBox = styled.div`
  position: relative;
  width: 800px;
  padding: 40px;
  margin-top: 50px;
  background-color: ${(props) => props.theme.headerBgColor};

  color: ${(props) => props.theme.textColor};
`;

export const ResetTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: ${(props) => props.theme.textColor};
  text-align: center;
`;

export const InputGroup = styled.div`
  margin-bottom: 15px;
  font-size: 16px;
  color: ${(props) => props.theme.textColor};
  display: flex;
  align-items: center;
`;

// 아이디/비밀번호 레이블
export const Label = styled.label`
  flex-shrink: 0;
  margin-right: 15px;
  font-weight: 600;
  width: 120px;
  color: ${(props) => props.theme.textColor};
`;

// 텍스트 입력창
export const StyledInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid ${(props) => props.theme.authHoverBgColor};
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 16px;
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.bgColor};
`;

// 작은 버튼 (인증하기, 확인하기)
export const ActionButton = styled.button<ActionButtonProps>`
  padding: 10px 20px;
  margin-left: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;

  background-color: ${(props) => props.theme.logoColor};
  color: ${(props) => props.theme.authHoverTextColor};

  &:disabled {
    background-color: ${(props) => props.theme.authHoverBgColor};
    cursor: not-allowed;
    color: ${(props) => props.theme.textColor};
  }

  &:not(:disabled):hover {
    background-color: #3cb86b; /* logoColor보다 살짝 어둡게 */
  }
`;

// 최종 제출 버튼 (FullWidthButton)
export const MainButton = styled(ActionButton)`
  width: 100%;
  margin: 20px 0 0 0;
  margin-left: 0;
`;

// 에러 메시지
export const ErrorMessage = styled.p`
  color: #ff3838; /* 오류 메시지는 빨간색 */
  font-size: 14px;
  text-align: right;
  margin-bottom: 10px;
  padding-right: 15px;
`;

//뒤로가기
export const BackButton = styled.button`
  position: absolute;
  top: 70px;
  left: 30px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  z-index: 10;
`;

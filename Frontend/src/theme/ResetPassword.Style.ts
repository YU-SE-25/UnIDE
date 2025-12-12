import styled from "styled-components";
import { TOPBAR_HEIGHT } from "../components/Topbar";

export const ResetPageWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: ${TOPBAR_HEIGHT + 50}px;
  background-color: ${(props) => props.theme.bgColor};
`;
export const LoginBox = styled.div`
  position: relative;
  width: 400px;
  padding: 40px;
  background-color: ${(props) => props.theme.headerBgColor};
`;
export const ResetTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: ${(props) => props.theme.textColor};
  text-align: center;
`;

//폼 및 입력 스타일
export const InputGroup = styled.div`
  margin-bottom: 15px;
  font-size: 16px;
  color: ${(props) => props.theme.textColor};
  display: flex;
  align-items: center;
`;
export const Label = styled.label`
  flex-shrink: 0;
  margin-right: 15px;
  font-weight: 600;
  width: 120px;
  color: ${(props) => props.theme.textColor};
`;
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

//버튼 및 메시지 스타일
export const MainButton = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 20px;
  background-color: ${(props) => props.theme.logoColor};
  color: ${(props) => props.theme.authHoverTextColor};
  font-size: 18px;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
`;
export const ErrorMessage = styled.p`
  color: #ff3838;
  font-size: 18px;
  text-align: right;
  margin-bottom: 10px;
  margin-top: -10px;
`;

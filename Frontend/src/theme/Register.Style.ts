import styled from "styled-components";

export const RegisterPageWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.bgColor};
`;
export const RegisterBox = styled.div`
  width: 600px;
  margin-top: 50px;
  margin-bottom: 50px;
  padding: 30px;
  background-color: ${(props) => props.theme.headerBgColor};
  border-radius: 5px;
  color: ${(props) => props.theme.textColor};
  border: 2px solid ${(props) => props.theme.focusColor};
  position: relative;
`;
export const Title = styled.h2`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 30px;
  color: ${(props) => props.theme.textColor};
`;

//입력 및 버튼 스타일
export const InputGroup = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  font-size: 16px;
`;
export const Label = styled.label`
  width: 150px;
  flex-shrink: 0;
  font-weight: 600;
  margin-right: 15px;
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
export const ActionButton = styled.button<{ $main?: boolean }>`
  padding: 10px 20px;
  margin-left: 10px;
  border: none;
  border-radius: 4px;

  background-color: ${(props) => props.theme.logoColor};
  color: ${(props) => props.theme.authHoverTextColor};
`;
export const FullWidthButton = styled(ActionButton)`
  width: 100%;
  margin: 20px 0 0 0;
  cursor: pointer;
  &:disabled {
    /*조건 미만족 시 회색 계열(authHoverBgColor)로 변경*/
    background-color: ${(props) => props.theme.authHoverBgColor};
    color: ${(props) => props.theme.textColor};
    cursor: not-allowed;
  }
`;
export const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin: -10px 0 10px 165px;
  text-align: left;
`;

export const TermsGroup = styled.div`
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid ${(props) => props.theme.authHoverBgColor};
  font-size: 14px;
  color: ${(props) => props.theme.textColor};
`;
export const CheckboxLabel = styled.label`
  display: block;
  margin-bottom: 10px;
  cursor: pointer;
  color: ${(props) => props.theme.textColor};
  span {
    color: ${(props) => props.theme.textColor};
  }
`;

//약관
export const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
`;
export const ModalContentBox = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  width: 80%;
  max-width: 600px;
  max-height: 80%;
  overflow-y: auto;
`;
export const CloseButton = styled.button`
  float: right;
  border: none;
  background: none;
  font-size: 20px;
  cursor: pointer;
`;

export const RoleSelectWrapper = styled.div`
  display: flex;
  gap: 16px;
  margin: 8px 0 16px;
`;

export const RoleOption = styled.label<{ $checked: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  border: 2px solid
    ${(props) => (props.$checked ? props.theme.logoColor : props.theme.bgColor)};
  background-color: ${(props) =>
    props.$checked ? "rgba(76, 175, 80, 0.1)" : "transparent"};
  color: ${(props) => props.theme.textColor};
  input[type="radio"] {
    accent-color: ${(props) => props.theme.logoColor};
    cursor: pointer;
    color: ${(props) => props.theme.textColor};
  }
`;

import styled from "styled-components";

//레이아웃 및 컨테이너 스타일
export const RegisterWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.bgColor};
`;

export const MainContent = styled.div`
  width: 80%;
  max-width: 900px;
  padding: 30px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
`;
export const TitleRow = styled.div`
  margin-bottom: 30px;
  h1 {
    font-size: 38px;
    font-weight: 700;
    padding-bottom: 15px;
    color: ${(props) => props.theme.textColor};
  }
`;
//폼 구조 및 입력 요소
export const SectionTitle = styled.h3`
  font-size: 20px;
  margin-top: 30px;
  margin-bottom: 15px;
  padding-bottom: 5px;
  border-bottom: 1px solid ${(props) => props.theme.authHoverBgColor};
  color: ${(props) => props.theme.textColor};
`;
export const InputGroup = styled.div`
  margin-bottom: 25px;
  display: flex;
  align-items: center;
`;
export const Label = styled.label`
  display: block;
  font-size: 20px;
  font-weight: 300;
  margin-right: 15px;
  width: 150px;
  flex-shrink: 0;
  color: ${(props) => props.theme.textColor};
`;
export const StyledInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid ${(props) => props.theme.authHoverBgColor};
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 15px;
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.bgColor};
`;
export const StyledTextArea = styled.textarea`
  width: 100%;
  min-height: 150px;
  padding: 10px;
  border: 1px solid ${(props) => props.theme.authHoverBgColor};
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 15px;
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.bgColor};
  resize: vertical;
`;
// 예제 입력/출력 가로 배치
export const ExampleGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
`;

// 예제 추가 버튼
export const ActionButton = styled.button`
  padding: 8px 15px;
  background-color: ${(props) => props.theme.focusColor};
  color: ${(props) => props.theme.bgColor};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  white-space: nowrap;
`;
// 최종 제출 버튼
export const MainButton = styled.button`
  width: 100%;
  padding: 15px;
  background-color: ${(props) => props.theme.logoColor};
  color: ${(props) => props.theme.authHoverTextColor};
  border: none;
  border-radius: 4px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: filter 0.2s;

  &:disabled {
    background-color: ${(props) => props.theme.authHoverBgColor};
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.p`
  color: #ff3838;
  text-align: center;
  margin-bottom: 15px;
`;

//드롭다운 스타일
export const StyledSelect = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid ${(props) => props.theme.authHoverBgColor};
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 15px;
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.bgColor};
  option {
    color: ${(props) => props.theme.textColor};
  }
`;

//태그 표시 컨테이너
export const TagDisplayContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 25px;
  padding-bottom: 5px;
`;

//개별 태그 Chip 스타일
export const TagChip = styled.span`
  display: inline-flex;
  align-items: center;
  background-color: ${(props) => props.theme.focusColor};
  color: ${(props) => props.theme.bgColor};
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 14px;
  font-weight: 500;
`;
//삭제 버튼
export const RemoveTagButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.authHoverTextColor};
  margin-left: 8px;
  cursor: pointer;
  font-weight: bold;
`;

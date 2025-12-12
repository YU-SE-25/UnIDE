import styled from "styled-components";
import EditPage from "./EditPage";
import { useState } from "react";

/*******************나중에 할 것*****************



*************************************************/

const MainContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const AlertContainer = styled.div`
  margin-top: 20%;
  width: 600px;
  height: 200px;
  border-radius: 16px;
  background-color: ${(props) => props.theme.headerBgColor};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;
const AlertTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: ${(props) => props.theme.textColor};
`;
const StyledInput = styled.input`
  margin-top: 15px;
  width: 80%;
  padding: 10px;
  /* 입력창 경계선 색상은 텍스트 색상 또는 포커스 색상 활용 */
  border: 1px solid ${(props) => props.theme.authHoverBgColor};
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 16px;
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.bgColor};
`;
const Button = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: ${(props) => props.theme.logoColor};
  color: white;
  border-radius: 8px;
  border: none;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 640px;
`;
export default function EditAlert() {
  const [verified, setVerified] = useState(true); // 여기 화면 DEPRECATED
  if (verified) {
    return <EditPage />;
  }
  return (
    <MainContainer>
      <AlertContainer>
        <AlertTitle>마이페이지를 수정하려면 비밀번호를 입력하세요.</AlertTitle>
        <Form onSubmit={() => setVerified(true)}>
          <StyledInput type="password" placeholder="비밀번호 입력" />
          <Button>확인</Button>
        </Form>
      </AlertContainer>
    </MainContainer>
  );
}

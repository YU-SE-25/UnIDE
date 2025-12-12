import styled from "styled-components";
import { Link } from "react-router-dom";
import { AuthAPI } from "../api/auth_api";

const CheckWrapper = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 24px;
`;

const CheckCard = styled.div`
  width: min(90%, 700px);
  padding: 50px 30px;
  background-color: ${(props) => props.theme.headerBgColor};
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;

  h2 {
    color: ${(props) => props.theme.textColor};
  }

  p {
    color: ${(props) => props.theme.textColor};
  }
`;

/* 공통 버튼 */
const StyledButton = styled.button<{ variant?: "primary" | "secondary" }>`
  width: 220px; /* 버튼 너비 고정 */
  padding: 12px 0;
  border-radius: 6px;
  font-size: 18px;
  cursor: pointer;
  border: none;
  text-decoration: none;

  color: ${(props) => props.theme.textColor};
  background-color: ${(props) =>
    props.variant === "primary"
      ? props.theme.logoColor
      : props.theme.authHoverBgColor};

  transition: 0.2s ease;
  &:hover {
    filter: brightness(1.08);
  }
`;

const ButtonLink = styled(StyledButton).attrs({ as: Link })``;

/* 버튼들을 가로로 정렬하는 컨테이너 */
const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 15px;
  margin-top: 10px;
`;

export default function RegisterSuccess() {
  return (
    <CheckWrapper>
      <CheckCard>
        <h2>회원가입 작성이 완료되었습니다.</h2>
        <p>회원가입을 완료하려면 이메일로 발송된 인증 링크를 클릭해 주세요.</p>
        <p style={{ fontSize: "16px" }}>
          이메일이 안보이시나요? 스팸함을 확인해 보시거나, 10분 뒤에 다시
          회원가입을 시도해 주세요.
        </p>

        <ButtonRow>
          <StyledButton
            variant="primary"
            onClick={async () => {
              const email = localStorage.getItem("regEmail");

              if (!email) {
                alert("이메일 정보를 찾을 수 없습니다. 다시 회원가입해주세요.");
                return;
              }

              try {
                await AuthAPI.sendEmailVerify(email);
                alert("인증 이메일을 재발송했습니다!");
              } catch {
                alert("재발송 중 오류가 발생했습니다.");
              }
            }}
          >
            인증 이메일 다시 받기
          </StyledButton>

          <ButtonLink to="/login" variant="primary">
            로그인 하러가기
          </ButtonLink>
        </ButtonRow>
      </CheckCard>
    </CheckWrapper>
  );
}

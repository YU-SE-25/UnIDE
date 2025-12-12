import { useEffect, useRef } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { api } from "../api/axios";

const SuccessWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 24px;
`;

const SuccessCard = styled.div`
  width: min(90%, 800px);
  padding: 50px 30px;
  margin-top: 50px;
  background-color: ${(props) => props.theme.headerBgColor};
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 15px;

  h2 {
    color: ${(props) => props.theme.textColor};
  }
`;

const SuccessText = styled.p`
  font-size: 20px;
  color: ${(props) => props.theme.textColor};
  line-height: 1.5;
`;

const LoginLink = styled(Link)`
  display: inline-block;
  padding: 10px 30px;
  margin-top: 40px;

  background-color: ${(props) => props.theme.logoColor};
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-size: 18px;
  font-weight: bold;
`;

export default function VerifySuccessPage() {
  const hasSentRef = useRef(false);

  useEffect(() => {
    const email = localStorage.getItem("regEmail");
    const storedUserId = localStorage.getItem("regUserId");

    // ✅ StrictMode에서 useEffect 두 번 도는 거 방지
    if (hasSentRef.current) {
      return;
    }
    hasSentRef.current = true;

    if (!email) {
      // 혹시 값 없으면 그냥 로컬 정리만 하고 끝
      localStorage.removeItem("regEmail");
      localStorage.removeItem("regUserId");
      return;
    }

    const sendWelcomeEmail = async () => {
      try {
        console.log("[VerifySuccess] 환영 이메일 API 호출", {
          email,
          storedUserId,
        });

        await api.post("/auth/email/send-welcome", {
          userId: storedUserId ? Number(storedUserId) : null,
          email,
        });
      } catch (err) {
        // 실패해도 조용히 넘어감
      } finally {
        localStorage.removeItem("regEmail");
        localStorage.removeItem("regUserId");
      }
    };

    sendWelcomeEmail();
  }, []);

  return (
    <SuccessWrapper>
      <SuccessCard>
        <h2>🎉 인증 완료!</h2>

        <SuccessText>이메일 인증이 성공적으로 완료되었습니다.</SuccessText>
        <SuccessText>
          강사 신청의 경우, 현재 일반 회원으로 가입되었으며, 강사 신청은 관리자
          검토 후 승인됩니다.
        </SuccessText>
        <SuccessText>환영합니다 학습자님!</SuccessText>

        <LoginLink to="/login">로그인 하러가기</LoginLink>
      </SuccessCard>
    </SuccessWrapper>
  );
}

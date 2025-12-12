import { Link } from "react-router-dom";
import styled from "styled-components";


const Wrap = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: ${({ theme }) => theme.bgColor};
  color: ${({ theme }) => theme.textColor};
  padding: 48px 16px;
`;

const Card = styled.section`
  width: 100%;
  max-width: 720px;
  border-radius: 20px;
  background: ${({ theme }) => theme.headerBgColor};
  border: 1px solid ${({ theme }) => `${theme.textColor}20`};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  padding: 36px;
  text-align: center;
`;

const Code = styled.h1`
  font-size: clamp(64px, 12vw, 140px);
  line-height: 0.9;
  margin: 0 0 12px;
  letter-spacing: -2px;
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.focusColor},
    ${({ theme }) => theme.logoColor}
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const Title = styled.h2`
  font-size: clamp(18px, 2.2vw, 24px);
  margin: 0 0 8px;
  color: ${({ theme }) => theme.textColor};
`;

const Sub = styled.p`
  margin: 0 0 24px;
  opacity: 0.8;
`;

const Row = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled(Link)<{ variant?: "primary" | "soft" | "ghost" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  text-decoration: none;
  border: 1px solid transparent;
  transition: filter 0.15s ease, background 0.15s ease, border-color 0.15s ease,
    color 0.15s ease;
  ${({ variant, theme }) => {
    switch (variant) {
      case "primary":
        return `background:${theme.focusColor};color:${theme.bgColor};border-color:${theme.focusColor};`;
      case "soft":
        return `background:${theme.authHoverBgColor};color:${theme.textColor};border-color:${theme.authActiveBgColor}40;`;
      default:
        return `background:transparent;color:${theme.textColor};border-color:${theme.textColor}20;`;
    }
  }}
  &:hover {
    filter: brightness(0.97);
    border-color: ${({ theme }) => theme.focusColor};
  }
  &:active {
    background: ${({ theme }) => theme.authActiveBgColor};
  }
`;

export default function NotFound() {
  return (
    <Wrap>
      <Card>
        <Code>404</Code>
        <Title>페이지를 찾을 수 없어요</Title>
        <Sub>요청한 주소가 변경되었거나 삭제되었을 수 있어요.</Sub>
        <Row>
          <Button to="/" variant="primary">
            홈으로 가기
          </Button>
          <Button to="/problem-list" variant="ghost">
            문제 목록 보기
          </Button>
        </Row>
      </Card>
    </Wrap>
  );
}

import styled from "styled-components";

//페이지 및 레이아웃 컨테이너
export const HomeWrapper = styled.div`
  width: 100%;
  min-height: calc(100vh - 80px);
  padding-top: 80px;
  padding-bottom: 60px;

  display: flex;
  flex-direction: column;
  align-items: center;

  text-align: center;
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
`;

//메인
export const MainContentArea = styled.div`
  max-width: 1600px;
  width: 90%;
  margin: 0 auto;
  padding: 0 20px;

  display: flex;
  flex-direction: column;
  gap: 50px;
`;

//제목 및 서브 타이틀 스타일
export const PageHeader = styled.div`
  margin-bottom: 100px;
`;

export const MainTitle = styled.h1`
  font-size: 70px;
  font-weight: 800;
  margin-bottom: 15px;
  color: ${(props) => props.theme.logoColor};
`;

export const SubText = styled.p`
  font-size: 30px;
  font-weight: 500;
  line-height: 1.5;
  opacity: 0.9;
  color: ${(props) => props.theme.textColor};
`;

//기능 섹션 스타일
export const FeatureSectionContainer = styled.div`
  background-color: ${(props) => props.theme.headerBgColor};
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

//탭 전환
export const TabHeader = styled.div`
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
  border-bottom: 2px solid ${(props) => props.theme.authHoverBgColor};
  padding-bottom: 15px;
`;

interface TabButtonProps {
  isActive: boolean;
}

export const TabButton = styled.button<TabButtonProps>`
  background: none;
  border: none;
  font-size: 28px;
  font-weight: 700;
  cursor: pointer;
  padding: 0 0 10px 0;
  color: ${(props) =>
    props.isActive ? props.theme.logoColor : props.theme.textColor};
  transition: all 0.2s ease-in-out;
`;

export const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
`;

//카드들
export const FeatureCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
  padding: 20px;
  background-color: ${(props) => props.theme.bgColor};
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid ${(props) => props.theme.authHoverBgColor};
`;

//아이콘
export const FeatureIcon = styled.span`
  font-size: 35px;
  color: ${(props) => props.theme.focusColor};
`;

//제목
export const FeatureCardTitle = styled.h4`
  font-size: 22px;
  font-weight: 700;
  color: ${(props) => props.theme.textColor};
`;

//설명
export const FeatureCardDescription = styled.p`
  font-size: 17px;
  line-height: 1.6;
  opacity: 0.8;
  color: ${(props) => props.theme.textColor};
`;

//주간 순위 테이블 스타일
export const RankingSection = styled.div`
  max-width: 1600px;
  width: 95%;
  margin: 60px auto 0 auto;
  text-align: left;
  padding: 30px;
  border-radius: 12px;
`;

export const RankingTitle = styled.h2`
  font-size: 35px;
  font-weight: 700;
  margin-bottom: 20px;
  color: ${(props) => props.theme.textColor};
`;

export const RankingTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    background-color: ${(props) => props.theme.logoColor};
  }

  th {
    padding: 12px 15px;
    color: ${(props) => props.theme.bgColor};
    font-size: 20px;
    font-weight: 600;
    text-align: left;
  }

  td {
    padding: 12px 15px;
    border-bottom: 1px solid ${(props) => props.theme.authHoverBgColor};
    color: ${(props) => props.theme.textColor};
    font-size: 20px;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

//중간 연결문
export const BridgeSection = styled.section`
  text-align: left;
  margin-top: 60px;
  line-height: 1.6;

  h2 {
    font-size: 20px;
    margin-bottom: 15px;
    color: ${(props) => props.theme.textColor};
  }

  p {
    font-size: 20px;
    color: ${(props) => props.theme.textColor};
    max-width: 1200px;

    strong {
      color: ${(props) => props.theme.logoColor};
      font-weight: 600;
    }
  }
`;

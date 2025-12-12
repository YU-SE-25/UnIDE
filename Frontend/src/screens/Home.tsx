import { useState, useEffect } from "react";
import {
  HomeWrapper,
  MainContentArea,
  PageHeader,
  MainTitle,
  SubText,
  FeatureSectionContainer,
  TabHeader,
  TabButton,
  FeatureGrid,
  FeatureCard,
  FeatureIcon,
  FeatureCardTitle,
  FeatureCardDescription,
  RankingSection,
  RankingTitle,
  RankingTable,
  BridgeSection,
} from "../theme/Home.Style";

import { useNavigate } from "react-router-dom";
import {
  getProblemRanking,
  getReputationRanking,
  getReviewRanking,
} from "../api/home_api";

const MAIN_TABS = {
  CODE_ANALYSIS: "CODE_ANALYSIS",
  USER_DASHBOARD: "USER_DASHBOARD",
} as const;

const RANKING_TABS = {
  PROBLEM_VIEWS: "문제 조회수",
  REPUTATION: "평판",
  CODE_REVIEW: "코드 리뷰",
} as const;

// 서버 응답 타입
type ProblemItem = {
  rank: number;
  delta: number;
  problemId: number;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  views: number;
};

type ReputationItem = {
  userId: number;
  nickname: string;
  ranking: number;
  delta: number;
};

type ReviewItem = {
  reviewId: number;
  authorId: number;
  nickname: string;
  ranking: number;
  delta: number;
  vote: number;
};

type ProblemRow = {
  rank: number;
  title: string;
  value1: number;
  value2: number;
  problemId: number;
};

type BaseRow = {
  rank: number;
  title: string;
  value1: number;
  value2: number;
};

type RankingData =
  | { category: "problem"; headers: string[]; data: ProblemRow[] }
  | { category: "reputation"; headers: string[]; data: BaseRow[] }
  | { category: "review"; headers: string[]; data: BaseRow[] };

export default function HomePage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<
    (typeof MAIN_TABS)[keyof typeof MAIN_TABS]
  >(MAIN_TABS.CODE_ANALYSIS);
  const [activeRankingTab, setActiveRankingTab] = useState<
    (typeof RANKING_TABS)[keyof typeof RANKING_TABS]
  >(RANKING_TABS.PROBLEM_VIEWS);

  const [problemRanking, setProblemRanking] = useState<ProblemItem[]>([]);
  const [reputationRanking, setReputationRanking] = useState<ReputationItem[]>(
    []
  );
  const [reviewRanking, setReviewRanking] = useState<ReviewItem[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const problemRes = await getProblemRanking();
        setProblemRanking(problemRes.slice(0, 5));

        const repRes = await getReputationRanking();
        setReputationRanking(repRes.slice(0, 5));

        const reviewRes = await getReviewRanking();
        setReviewRanking(reviewRes.slice(0, 5));
      } catch (e) {
        console.error("랭킹 로딩 실패", e);
      }
    };
    load();
  }, []);

  // 랭킹 테이블 데이터 구성
  const renderRankingData = (): RankingData => {
    if (activeRankingTab === RANKING_TABS.PROBLEM_VIEWS) {
      return {
        category: "problem",
        headers: ["순위", "문제 제목", "총 조회수", "주간 변화량"],
        data: problemRanking.map((item) => ({
          rank: item.rank,
          title: item.title,
          value1: item.views,
          value2: item.delta,
          problemId: item.problemId,
        })),
      };
    }

    if (activeRankingTab === RANKING_TABS.REPUTATION) {
      return {
        category: "reputation",
        headers: ["순위", "유저명", "주간 평판 변화", "비고"],
        data: reputationRanking.map((item) => ({
          rank: item.ranking,
          title: item.nickname,
          value1: item.delta,
          value2: item.delta,
        })),
      };
    }

    // CODE_REVIEW
    return {
      category: "review",
      headers: ["순위", "작성자", "투표수", "주간 변화량"],
      data: reviewRanking.map((item) => ({
        rank: item.ranking,
        title: item.nickname,
        value1: item.vote,
        value2: item.delta,
      })),
    };
  };

  const currentRankingData = renderRankingData();

  // 메인 리턴
  return (
    <HomeWrapper>
      <MainContentArea>
        <PageHeader>
          <MainTitle>UnIDE</MainTitle>
          <SubText>
            단순한 채점 플랫폼을 넘어, 학습자의 알고리즘 이해와 성장을 돕는
            지능형 IDE
          </SubText>
        </PageHeader>

        <BridgeSection>
          <h2>어떻게 학습을 더 똑똑하게 바꿀 수 있을까요?</h2>
          <p>
            UnIDE는 단순한 문제풀이 플랫폼이 아니라{" "}
            <strong>코드 분석·시각화·피드백</strong>을 통해 개발자의 성장 여정을
            함께 설계하는 학습 도구입니다.
          </p>
        </BridgeSection>

        <FeatureSectionContainer>
          <TabHeader>
            <TabButton
              isActive={activeTab === MAIN_TABS.CODE_ANALYSIS}
              onClick={() => setActiveTab(MAIN_TABS.CODE_ANALYSIS)}
            >
              코드 분석
            </TabButton>

            <TabButton
              isActive={activeTab === MAIN_TABS.USER_DASHBOARD}
              onClick={() => setActiveTab(MAIN_TABS.USER_DASHBOARD)}
            >
              사용자 대시보드
            </TabButton>
          </TabHeader>

          <FeatureGrid>
            {(activeTab === MAIN_TABS.CODE_ANALYSIS
              ? [
                  {
                    icon: "🧩",
                    title: "코딩 패턴 분석",
                    desc: "사용자의 코드를 분석하여 개선된 코드와 사유를 시각적으로 제공합니다.",
                  },
                  {
                    icon: "🚀",
                    title: "성능 분석 및 프로파일링",
                    desc: "실행 시간 및 메모리 사용량, 라인별 호출 횟수를 분석합니다.",
                  },
                  {
                    icon: "🛡️",
                    title: "취약점 개념 분석",
                    desc: "코드 내 잠재적 취약점을 식별하고 관련 개념을 제공합니다.",
                  },
                ]
              : [
                  {
                    icon: "📊",
                    title: "개인화된 학습 목표",
                    desc: "언어별 학습 시간, 주간 학습 목표를 설정해보세요.",
                  },
                  {
                    icon: "💬",
                    title: "커뮤니티 활동 성과",
                    desc: "좋은 답변/리뷰 제공 시 평판 점수를 부여합니다.",
                  },
                  {
                    icon: "🔔",
                    title: "학습 리마인드",
                    desc: "활동 패턴 분석을 통한 맞춤 리마인드를 제공합니다.",
                  },
                ]
            ).map((f) => (
              <FeatureCard key={f.title}>
                <FeatureIcon>{f.icon}</FeatureIcon>
                <FeatureCardTitle>{f.title}</FeatureCardTitle>
                <FeatureCardDescription>{f.desc}</FeatureCardDescription>
              </FeatureCard>
            ))}
          </FeatureGrid>
        </FeatureSectionContainer>

        <RankingSection>
          <RankingTitle>주간 순위</RankingTitle>

          <TabHeader>
            {Object.values(RANKING_TABS).map((tab) => (
              <TabButton
                key={tab}
                isActive={activeRankingTab === tab}
                onClick={() => setActiveRankingTab(tab)}
                style={{ fontSize: "18px", padding: "10px 15px" }}
              >
                {tab}
              </TabButton>
            ))}
          </TabHeader>

          <RankingTable>
            <thead>
              <tr>
                {currentRankingData.headers.map((header, i) => (
                  <th key={i}>{header}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {currentRankingData.data.length === 0 ? (
                <tr>
                  <td
                    colSpan={currentRankingData.headers.length}
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    순위가 없습니다
                  </td>
                </tr>
              ) : currentRankingData.category === "problem" ? (
                currentRankingData.data.map((row, i) => (
                  <tr key={i}>
                    <td>{row.rank}</td>
                    <td
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        navigate(`/problem-detail/${row.problemId}`)
                      }
                    >
                      {row.title}
                    </td>
                    <td>{row.value1}</td>
                    <td>{row.value2}</td>
                  </tr>
                ))
              ) : currentRankingData.category === "reputation" ? (
                currentRankingData.data.map((row, i) => (
                  <tr key={i}>
                    <td>{row.rank}</td>
                    <td
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/mypage/${row.title}`)}
                    >
                      {row.title}
                    </td>
                    <td>{row.value1}</td>
                    <td>{row.value2}</td>
                  </tr>
                ))
              ) : (
                currentRankingData.data.map((row, i) => (
                  <tr key={i}>
                    <td>{row.rank}</td>
                    <td>{row.title}</td>
                    <td>{row.value1}</td>
                    <td>{row.value2}</td>
                  </tr>
                ))
              )}
            </tbody>
          </RankingTable>
        </RankingSection>
      </MainContentArea>
    </HomeWrapper>
  );
}

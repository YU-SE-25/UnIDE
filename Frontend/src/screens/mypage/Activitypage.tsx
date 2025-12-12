import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { getUserProfile } from "../../api/mypage_api";
import { useAtomValue } from "jotai";
import { userProfileAtom } from "../../atoms";

type Submission = {
  submissionId: number;
  problemId: number;
  verdict: "AC" | "WA" | "TLE" | "MLE" | "RE";
  runtimeMs?: number;
  language: string;
  submittedAt: string;
};

const Page = styled.div`
  max-width: 1040px;
  margin: 0 auto;
  padding: 24px;
  display: grid;
  gap: 20px;
`;

const Grid = styled.section`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  border: 1px solid ${({ theme }) => `${theme.textColor}12`};
  border-radius: 16px;
  padding: 18px;
  background-color: ${(props) => props.theme.headerBgColor};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: grid;
  gap: 12px;
`;

const CardTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CardTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
`;

const Muted = styled.div`
  color: ${(props) => props.theme.textColor};
  font-size: 13px;
  opacity: 0.7;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const Button = styled.button<{ variant?: "primary" | "soft" | "ghost" }>`
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: filter 0.15s ease, background 0.15s ease, border-color 0.15s ease,
    color 0.15s ease;

  ${({ variant, theme }) => {
    switch (variant) {
      case "primary":
        return `
          background: ${theme.focusColor};
          color: white;
          border-color: ${theme.focusColor};
        `;
      case "soft":
        return `
          background: ${theme.logoColor};
          color:white;
        `;
      default:
        return `
          background: transparent;
          color: ${theme.textColor};
          border-color: ${theme.textColor}20;
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    filter: brightness(0.97);
    border-color: ${({ theme }) => theme.textColor}40;
  }

  &:active:not(:disabled) {
    background: ${({ theme }) => theme.authActiveBgColor};
  }
`;

const ReputationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0 20px;
`;

const ReputationCircle = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid ${({ theme }) => theme.focusColor};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
`;

const ReputationScore = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.textColor};
`;

const StreakText = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textColor};
  text-align: center;
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-height: 50px;
`;

const Chip = styled.span`
  color: ${(props) => props.theme.textColor};
  display: inline-flex;
  align-items: center;
  border: 1px solid ${({ theme }) => `${theme.textColor}20`};
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 13px;
  transition: font-weight 0.15s ease;
  &:hover {
    font-weight: 600;
    cursor: pointer;
  }
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const Stat = styled.div`
  border: 1px solid ${(props) => props.theme.textColor}40;
  border-radius: 14px;
  padding: 14px;
  display: grid;
  gap: 6px;
`;

const StatLabel = styled.div`
  color: ${(props) => props.theme.textColor};
  font-size: 12px;
  opacity: 0.7;
`;

const StatValue = styled.div`
  color: ${(props) => props.theme.textColor};
  font-size: 20px;
  font-weight: 700;
`;

const List = styled.ul`
  display: grid;
  gap: 8px;
`;

const Strong = styled.span`
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
`;

const SubmissionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: ${({ theme }) => theme.textColor};
`;

const Item = styled.li`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => `${theme.textColor}20`};
  border-radius: 12px;
  transition: border-color 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.textColor}40;
    cursor: pointer;
  }
`;

const Pill = styled.span<{ tone?: "ok" | "bad" | "neutral" }>`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => `${theme.textColor}20`};
  ${({ tone }) =>
    tone === "ok"
      ? `background:#e6fbe6;border-color:#b7e2b7;`
      : tone === "bad"
      ? `background:#ffecec;border-color:#f3b5b5;`
      : `background:#f3f4f6;`};
`;

const GoalsLayout = styled.div`
  margin-top: 16px;
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 2fr);
  gap: 20px;

  @media (max-width: 840px) {
    grid-template-columns: 1fr;
  }
`;

const GoalsHighlight = styled.div`
  border-radius: 20px;
  padding: 20px 22px;
  background: radial-gradient(
    circle at top left,
    ${({ theme }) => theme.focusColor}33,
    transparent 55%
  );
  border: 1px solid ${({ theme }) => theme.focusColor}55;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const HighlightLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.textColor};
`;

const HighlightValue = styled.div`
  font-size: 26px;
  font-weight: 700;
  color: ${({ theme }) => theme.textColor};
`;

const HighlightSub = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.muteColor};
`;

const GoalsListGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
`;

const MiniGoalBox = styled.div`
  border-radius: 16px;
  padding: 12px 14px;
  background-color: ${({ theme }) => theme.bgCardColor};
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

const MiniGoalIcon = styled.div`
  font-size: 18px;
  line-height: 1;
  margin-top: 2px;
`;

const MiniGoalTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MiniGoalLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.textColor};
`;

const MiniGoalValue = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textColor};
  line-height: 1.4;
`;
export default function ActivityPage() {
  const { username } = useParams<{ username: string }>();
  const nav = useNavigate();
  const myProfile = useAtomValue(userProfileAtom);

  // 🔹 1) 훅은 무조건 위에서 다 호출
  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["userProfileActivity", username],
    enabled: !!username, // username 없으면 요청만 안 날림 (훅은 그래도 호출됨)
    queryFn: async () => {
      if (!username) {
        throw new Error("username is missing");
      }
      return await getUserProfile(username);
    },
    staleTime: 5 * 60 * 1000,
  });
  const isMyPage = !!myProfile && myProfile.userId === user?.userId;

  const solvedIds = user?.solvedProblems ?? [];
  const submissions: Submission[] = (user?.recentSubmissions ?? []).map(
    (s) => ({
      submissionId: s.submissionId,
      problemId: s.problemId,
      verdict: s.verdict,
      runtimeMs: s.runtimeMs,
      language: s.language,
      submittedAt: s.submittedAt,
    })
  );

  const stat = user?.stats;
  const goal = user?.goals;
  const reminders = user?.reminders;
  function mapDayNumberToKorean(day: number) {
    switch (day) {
      case 1:
        return "월";
      case 2:
        return "화";
      case 3:
        return "수";
      case 4:
        return "목";
      case 5:
        return "금";
      case 6:
        return "토";
      case 7:
        return "일";
      default:
        return "";
    }
  }

  // 🔹 2) useMemo도 조건 밖에서 항상 호출
  const solvedPreview = useMemo(() => solvedIds.slice(0, 10), [solvedIds]);

  // 🔹 3) "조건에 따라 다른 JSX를 return"은 훅들 밑에서
  if (!username) {
    return (
      <Page>
        <Muted>잘못된 접근입니다.</Muted>
      </Page>
    );
  }

  if (isError) {
    return (
      <Page>
        <Card>
          <Muted>❌ 데이터를 불러오는 중 오류가 발생했습니다.</Muted>
          <Row>
            <Button onClick={() => refetch()} variant="primary">
              다시 시도하기
            </Button>
          </Row>
        </Card>
      </Page>
    );
  }

  if (isLoading || !user) {
    return (
      <Page>
        <Muted>⏳ 데이터를 불러오는 중입니다...</Muted>
      </Page>
    );
  }

  const goSolved = () =>
    solvedIds.length &&
    nav(`/problems/${user.username}/submitted?showResult=false`);
  const goAll = () => nav("/problem-list");
  const goDetail = (problemId: number) => nav(`/problem-detail/${problemId}`);

  //최근 제출 클릭 시 코드 분석(제출 상세) 페이지로 이동
  const goSubmissionDetail = (problemId: number) => {
    nav(`/problem-detail/${problemId}`);
  };

  return (
    <Page>
      <StatGrid>
        <Stat>
          <StatLabel>푼 문제 수</StatLabel>
          <StatValue>{stat?.totalSolved ?? solvedIds.length}</StatValue>
        </Stat>
        <Stat>
          <StatLabel>최근 푼 문제 수</StatLabel>
          <StatValue>{submissions.length}</StatValue>
        </Stat>
        <Stat>
          <StatLabel>정답률</StatLabel>
          <StatValue>{stat?.acceptanceRate?.toFixed(2)}%</StatValue>
        </Stat>
      </StatGrid>

      <Grid>
        <Card>
          <CardTitleRow>
            <CardTitle>내가 푼 문제</CardTitle>
            <Muted>{isLoading ? "동기화 중…" : ""}</Muted>
          </CardTitleRow>

          <Row>
            <Button
              onClick={goSolved}
              disabled={isLoading || !solvedIds.length || !isMyPage}
              variant="primary"
            >
              내가 푼 문제 보기
            </Button>
            <Button onClick={goAll} variant="soft">
              전체 문제 보기
            </Button>
            <Button onClick={() => refetch()} variant="ghost">
              새로고침
            </Button>
          </Row>

          {/*length가 0일 때 */}
          {!isLoading && solvedIds.length === 0 ? (
            <Muted>아직 푼 문제가 없습니다.</Muted>
          ) : (
            <Chips>
              {solvedPreview.map((id) => (
                <Chip key={id} onClick={() => goDetail(id)}>
                  #{id}
                </Chip>
              ))}

              {solvedIds.length > solvedPreview.length && (
                <Muted>
                  + {solvedIds.length - solvedPreview.length} 더보기
                </Muted>
              )}
            </Chips>
          )}
        </Card>

        <Card>
          <CardTitleRow>
            <CardTitle>평판</CardTitle>
            <Muted>{isLoading ? "동기화 중…" : ""}</Muted>
          </CardTitleRow>

          <ReputationWrapper>
            <ReputationCircle>
              <ReputationScore>{stat?.rating ?? 0}</ReputationScore>
            </ReputationCircle>

            <StreakText>
              {stat?.streakDays && stat.streakDays > 0
                ? `🔥${stat.streakDays}일 째 연속 학습중이에요!`
                : "오늘부터 1일째 학습 시작!"}
            </StreakText>
          </ReputationWrapper>
        </Card>
      </Grid>

      <Card>
        <CardTitleRow>
          <CardTitle>최근 제출</CardTitle>
          <Muted>{isLoading ? "동기화 중…" : ""}</Muted>
        </CardTitleRow>
        {!submissions.length ? (
          <Muted>기록 없음</Muted>
        ) : (
          <List>
            {submissions.slice(0, 5).map((s) => (
              <Item
                key={s.submissionId}
                onClick={() => goSubmissionDetail(s.problemId)}
              >
                <SubmissionInfo>
                  <Strong>#{s.problemId}</Strong> · {s.language} ·{" "}
                  {new Date(s.submittedAt).toLocaleString()}
                </SubmissionInfo>

                <Pill
                  tone={
                    s.verdict === "AC"
                      ? "ok"
                      : s.verdict === "WA"
                      ? "bad"
                      : "neutral"
                  }
                >
                  {s.verdict}
                  {s.runtimeMs ? ` · ${s.runtimeMs}ms` : ""}
                </Pill>
              </Item>
            ))}
          </List>
        )}
      </Card>

      <Card>
        <CardTitleRow>
          <CardTitle>학습 목표</CardTitle>
          <Muted>{isLoading ? "동기화 중…" : ""}</Muted>
        </CardTitleRow>

        <GoalsLayout>
          <GoalsHighlight>
            <HighlightLabel>이번 주 학습 목표</HighlightLabel>
            <HighlightValue>
              {goal?.weeklyStudyGoalMinutes
                ? `${goal.weeklyStudyGoalMinutes}분`
                : "아직 설정하지 않았어요"}
            </HighlightValue>
            <HighlightSub>
              {goal?.dailyMinimumStudyMinutes
                ? `하루 최소 ${goal.dailyMinimumStudyMinutes}분씩 공부해봐요.`
                : "하루 최소 학습 시간을 설정해보세요."}
            </HighlightSub>
          </GoalsHighlight>

          <GoalsListGrid>
            <MiniGoalBox>
              <MiniGoalIcon>⏱️</MiniGoalIcon>
              <MiniGoalTextGroup>
                <MiniGoalLabel>언어별 학습 시간</MiniGoalLabel>
                <MiniGoalValue>
                  {goal?.studyTimeByLanguage &&
                  Object.keys(goal.studyTimeByLanguage).length > 0
                    ? Object.entries(goal.studyTimeByLanguage)
                        .map(([lang, min]) => `${lang}: ${min}분`)
                        .join(" · ")
                    : "언어별 목표를 추가해보세요."}
                </MiniGoalValue>
              </MiniGoalTextGroup>
            </MiniGoalBox>

            <MiniGoalBox>
              <MiniGoalIcon>📅</MiniGoalIcon>
              <MiniGoalTextGroup>
                <MiniGoalLabel>하루 최소 학습</MiniGoalLabel>
                <MiniGoalValue>
                  {goal?.dailyMinimumStudyMinutes
                    ? `${goal.dailyMinimumStudyMinutes}분`
                    : "미설정"}
                </MiniGoalValue>
              </MiniGoalTextGroup>
            </MiniGoalBox>

            <MiniGoalBox>
              <MiniGoalIcon>📈</MiniGoalIcon>
              <MiniGoalTextGroup>
                <MiniGoalLabel>주간 학습 목표</MiniGoalLabel>
                <MiniGoalValue>
                  {goal?.weeklyStudyGoalMinutes
                    ? `${goal.weeklyStudyGoalMinutes}분`
                    : "미설정"}
                </MiniGoalValue>
              </MiniGoalTextGroup>
            </MiniGoalBox>

            <MiniGoalBox>
              <MiniGoalIcon>⏰</MiniGoalIcon>
              <MiniGoalTextGroup>
                <MiniGoalLabel>학습 알림 시간</MiniGoalLabel>
                <MiniGoalValue>
                  {reminders && reminders.length > 0 ? (
                    <>
                      {mapDayNumberToKorean(reminders[0].day)}요일{" "}
                      {reminders[0].times?.join(", ")}
                    </>
                  ) : (
                    "알림 시간을 설정해보세요."
                  )}
                </MiniGoalValue>
              </MiniGoalTextGroup>
            </MiniGoalBox>
          </GoalsListGrid>
        </GoalsLayout>
      </Card>
    </Page>
  );
}

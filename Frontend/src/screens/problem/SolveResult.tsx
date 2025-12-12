import { useEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
//import {  getSubmissionStatus,  type ICodeSubmitRequest,  type ICodeSubmitResult,} from "../../api/codeeditor_api";
import {
  fetchSubmissionDetail,
  type SubmissionDetail,
  type SubmissionStatus,
} from "../../api/mySubmissions_api";

export interface GradingResponse {
  status: string;
  currentTestCase?: number;
  totalTestCases?: number;
  passedTestCases?: number;
  failedTestCase?: number;
  runtime?: number;
  memory?: number;
}
export type SolveResultProps = {
  onLookMyCode?: (submissionId: number) => void;
  onNavEditor?: (problemId: number, submissionId: number) => void;
  initialResult?: GradingResponse | null;
  initialProblemId?: number | null;
};

type Tone = "neutral" | "success" | "error";

type LiveJudgeStats = {
  runtime: number | null;
  memory: number | null;
  passedTestCases: number | null;
  totalTestCases: number | null;
};

const STATUS_LABEL: Record<SubmissionStatus, string> = {
  PENDING: "Waiting",
  GRADING: "Running",
  CA: "Accepted",
  WA: "Wrong Answer",
  CE: "Compile Error",
  RE: "Runtime Error",
  TLE: "Time Limit",
  MLE: "Memory Limit",
  DRAFT: "Draft",
};

const STATUS_MAIN: Record<SubmissionStatus, string> = {
  PENDING: "채점 대기중입니다",
  GRADING: "채점중 ...",
  CA: "정답입니다!",
  WA: "오답입니다.",
  CE: "컴파일 에러가 발생했습니다.",
  RE: "실행 중 오류가 발생했습니다.",
  TLE: "시간 초과입니다.",
  MLE: "메모리 초과입니다.",
  DRAFT: "임시 저장된 코드입니다.",
};

function getStatusSubText(status: SubmissionStatus): string {
  switch (status) {
    case "DRAFT":
      return "임시 저장된 코드입니다.";
    case "PENDING":
      return "채점 서버와 연결을 준비하는 중입니다.";
    case "GRADING":
      return "테스트케이스를 순차적으로 채점하는 중입니다.";
    case "CA":
      return "해낼 줄 알았다구요!";
    case "WA":
      return "정답과 다른 출력이 발생했습니다. 실패한 테스트케이스를 확인해 보세요.";
    case "CE":
      return "컴파일 로그를 확인하고 문법 오류나 빌드 에러를 수정해 주세요.";
    case "RE":
      return "실행 중 예외가 발생했습니다. 인덱스 범위, 0으로 나누기 등을 점검해 보세요.";
    case "TLE":
      return "시간 제한을 초과했습니다. 알고리즘의 시간 복잡도를 줄여 보세요.";
    case "MLE":
      return "메모리 제한을 초과했습니다. 불필요한 메모리 사용을 줄여 보세요.";
    default:
      return "";
  }
}

function getTone(status: SubmissionStatus): Tone {
  if (status === "CA") return "success";
  if (status === "PENDING" || status === "GRADING" || status === "DRAFT") {
    return "neutral";
  }
  return "error";
}

const ResultCard = styled.div`
  width: 100%;
  max-width: 960px;
  border-radius: 24px;
  padding: 28px 32px 22px;
  background: ${({ theme }) => theme.bgCardColor};
  box-shadow: 0 22px 60px rgba(15, 23, 42, 0.22);
  color: ${({ theme }) => theme.textColor};
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: flex-start;
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ServiceTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.12);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  width: fit-content;
  color: ${({ theme }) => theme.textColor};
`;

const Dot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: ${({ theme }) => theme.focusColor};
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.textColor};
`;

const Subtitle = styled.div`
  font-size: 13px;
  color: ${({ theme }) => `${theme.textColor}60`};
`;

const MetaBlock = styled.div`
  text-align: right;
  font-size: 13px;
  color: ${({ theme }) => `${theme.textColor}60`};
  display: flex;
  flex-direction: column;
  gap: 2px;

  * {
    color: ${({ theme }) => `${theme.textColor}`};
  }
`;

const Strong = styled.span`
  color: ${({ theme }) => theme.textColor};
  font-weight: 500;
`;

const StatusSection = styled.div`
  position: relative;
  border-radius: 18px;
  padding: 18px 22px;
  background: ${({ theme }) =>
    theme.mode === "light"
      ? "linear-gradient(135deg, #eaf1fd, #f0faf7)"
      : "transparent"};

  ${({ theme }) =>
    theme.mode === "dark" &&
    css`
      &::before {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 18px;
        padding: 4px;
        background: linear-gradient(135deg, #eaf1fd, #f0faf7);
        -webkit-mask: linear-gradient(#fff 0 0) content-box,
          linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        pointer-events: none;
      }
    `}
`;

const StatusTextBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StatusLabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusLabel = styled.span<{ tone: Tone }>`
  font-size: 11px;
  padding: 3px 11px;
  border-radius: 999px;
  border: 1px solid
    ${({ tone }) =>
      tone === "success"
        ? "rgba(16, 185, 129, 0.7)"
        : tone === "error"
        ? "rgba(248, 113, 113, 0.7)"
        : "rgba(148, 163, 184, 0.8)"};
  color: ${({ tone }) =>
    tone === "success" ? "#10b981" : tone === "error" ? "#f97373" : "#4b5563"};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background-color: ${({ theme }) => `${theme.muteColor}30`};
`;

const StatusMain = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.textColor};
`;

const StatusSub = styled.div`
  font-size: 13px;
  color: ${({ theme }) => `${theme.muteColor}`};
`;

const GlowNumber = styled.span`
  font-size: 26px;
  font-weight: 700;
  color: ${({ theme }) => theme.focusColor};
`;

const pulse = keyframes`
  0% { opacity: 0.6; transform: scaleX(0.99); }
  50% { opacity: 1; transform: scaleX(1); }
  100% { opacity: 0.6; transform: scaleX(0.99); }
`;

const ProgressWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ProgressBar = styled.div`
  position: relative;
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.25);
  overflow: hidden;
`;

const ProgressInner = styled.div<{ percent: number }>`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  border-radius: 999px;
  width: ${({ percent }) => Math.min(percent, 100)}%;
  background: linear-gradient(
    90deg,
    rgba(59, 130, 246, 1),
    rgba(16, 185, 129, 1)
  );
  animation: ${pulse} 1.2s ease-in-out infinite;
`;

const ProgressLabel = styled.div`
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  color: ${({ theme }) => `${theme.textColor}60`};
  & > span:first-child {
    color: ${({ theme }) => theme.textColor};
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-top: 4px;

  @media (max-width: 960px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media (max-width: 720px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const StatCard = styled.div`
  border-radius: 14px;
  padding: 10px 12px;
  background-color: ${({ theme }) => theme.bgCardColor};
  border: 1px solid ${({ theme }) => theme.muteColor};
  display: flex;
  flex-direction: column;
  gap: 2px;
  backdrop-filter: blur(8px);
`;

const StatLabel = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.muteColor};
`;

const StatValue = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.textColor};
  span {
    color: inherit;
  }
`;

const FooterRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HintText = styled.div`
  font-size: 11px;
  color: ${({ theme }) => `${theme.textColor}60`};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button<{ variant?: "primary" | "ghost" }>`
  min-width: 120px;
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid
    ${({ theme, variant }) =>
      variant === "primary" ? theme.focusColor : "rgba(148, 163, 184, 0.9)"};
  background: ${({ theme, variant }) =>
    variant === "primary" ? theme.focusColor : "transparent"};
  color: ${({ theme, variant }) =>
    variant === "primary" ? theme.bgColor : theme.textColor};
  cursor: pointer;
  transition: filter 0.15s ease, background 0.15s ease, transform 0.1s ease;

  &:hover {
    filter: brightness(1.03);
    transform: translateY(-0.5px);
  }

  &:active {
    transform: translateY(0);
    filter: brightness(0.98);
  }
`;

export default function SolveResult({
  onNavEditor,
  onLookMyCode,
  initialResult,
}: SolveResultProps) {
  const [sp] = useSearchParams();
  const params = useParams();
  const navigate = useNavigate();

  const idFromQuery = sp.get("id");
  const idFromPath = params.solvedId;

  const idFromParam = idFromQuery ?? idFromPath;
  const storedId = localStorage.getItem("lastSubmissionId");
  const submissionId = idFromParam
    ? Number(idFromParam)
    : storedId
    ? Number(storedId)
    : null;

  const [submission, setSubmission] = useState<SubmissionDetail | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const [liveStatus, setLiveStatus] = useState<SubmissionStatus | null>(
    (initialResult?.status as SubmissionStatus) ?? null
  );
  const [liveStats, setLiveStats] = useState<LiveJudgeStats | null>(
    initialResult
      ? {
          runtime: initialResult.runtime ?? null,
          memory: initialResult.memory ?? null,
          passedTestCases: initialResult.passedTestCases ?? null,
          totalTestCases: initialResult.totalTestCases ?? null,
        }
      : null
  );

  useEffect(() => {
    if (!submissionId) return;

    let active = true;

    fetchSubmissionDetail(submissionId)
      .then((detail) => {
        if (!active) return;
        setSubmission(detail);
        setSubmissionError(null);
      })
      .catch(() => {
        if (!active) return;
        setSubmission(null);
        setSubmissionError("제출 정보를 불러오지 못했습니다.");
      });

    return () => {
      active = false;
    };
  }, [submissionId]);

  useEffect(() => {
    if (!initialResult) return;

    setLiveStatus(initialResult.status as SubmissionStatus);
    setLiveStats({
      runtime: initialResult.runtime ?? null,
      memory: initialResult.memory ?? null,
      passedTestCases: initialResult.passedTestCases ?? null,
      totalTestCases: initialResult.totalTestCases ?? null,
    });
  }, [initialResult]);
  /*채점 완료후 결과가 나오는 방식이라, 아래코드는 deprecated 예정
  useEffect(() => {
    if (!submissionId) return;
    if (!submission) return;

    const baseStatus = submission.status;
    if (baseStatus && baseStatus !== "PENDING" && baseStatus !== "GRADING") {
      return;
    }

    const req: ICodeSubmitRequest = {
      problemId: submission.problemId,
      code: submission.code ?? "",
      language: submission.language,
    };

    let alive = true;

    (async () => {
      try {
        const res: ICodeSubmitResult = await getSubmissionStatus(req);
        if (!alive) return;

        setLiveStatus(res.status);
        setLiveStats({
          runtime: res.runtime,
          memory: res.memory,
          passedTestCases: res.passedTestCases,
          totalTestCases: res.totalTestCases,
        });

        setSubmission((prev) =>
          prev
            ? {
                ...prev,
                status: res.status,
                runtime: res.runtime ?? prev.runtime,
                memory: res.memory ?? prev.memory,
              }
            : prev
        );
      } catch (e) {
        console.error(e);
      }
    })();

    return () => {
      alive = false;
    };
  }, [submissionId, submission]);
*/
  const status: SubmissionStatus =
    liveStatus ?? submission?.status ?? "PENDING";

  const tone = getTone(status);

  const passedTests = liveStats?.passedTestCases ?? null;
  const totalTests = liveStats?.totalTestCases ?? null;
  const failedTests =
    totalTests != null && passedTests != null
      ? Math.max(totalTests - passedTests, 0)
      : null;

  const progressPercent =
    status === "PENDING"
      ? 15
      : status === "GRADING" && totalTests != null && totalTests > 0
      ? Math.round(((passedTests ?? 0) / totalTests) * 100)
      : status === "DRAFT"
      ? 0
      : 100;

  const effectiveRuntime =
    liveStats?.runtime != null
      ? liveStats.runtime
      : submission?.runtime != null
      ? submission.runtime
      : null;

  const effectiveMemory =
    liveStats?.memory != null
      ? liveStats.memory
      : submission?.memory != null
      ? submission.memory
      : null;

  const problemId = submission?.problemId;
  const problemTitle = submission?.problemTitle ?? "";
  const language = submission?.language ?? "-";
  const submittedAt = submission?.submittedAt ?? "알 수 없음";

  const handleClickMyCode = () => {
    submissionId !== null && onLookMyCode?.(submissionId);
  };

  const handleClickNavEditor = () => {
    problemId !== undefined &&
      submissionId !== null &&
      onNavEditor?.(problemId, submissionId);
  };
  return (
    <ResultCard>
      <HeaderRow>
        <TitleBlock>
          <ServiceTag>
            <Dot />
            채점 결과
          </ServiceTag>
          <Title>
            {problemId ? `문제 [${problemId}] ${problemTitle}` : "채점 리포트"}
          </Title>
          <Subtitle>선택한 제출에 대한 온라인 채점 결과입니다.</Subtitle>
        </TitleBlock>
        <MetaBlock>
          <div>
            언어: <Strong>{language}</Strong>
          </div>
          <div>
            제출 ID: <Strong>{submissionId ?? "-"}</Strong>
          </div>
          <div>
            제출 시간: <Strong>{submittedAt}</Strong>
          </div>
        </MetaBlock>
      </HeaderRow>

      <StatusSection>
        <StatusTextBlock>
          <StatusLabelRow>
            <StatusLabel tone={tone}>{STATUS_LABEL[status]}</StatusLabel>
          </StatusLabelRow>
          <StatusMain>{STATUS_MAIN[status]}</StatusMain>
          <StatusSub>{getStatusSubText(status)}</StatusSub>
        </StatusTextBlock>

        <ProgressWrapper>
          <ProgressBar>
            <ProgressInner
              percent={status === "DRAFT" ? 0 : progressPercent || 8}
            />
          </ProgressBar>
          <ProgressLabel>
            <span>
              {status === "PENDING"
                ? "채점을 준비하고 있어요…"
                : status === "GRADING"
                ? totalTests != null
                  ? `테스트를 순차적으로 실행하는 중입니다 (${
                      passedTests ?? 0
                    }/${totalTests})`
                  : "테스트를 순차적으로 실행하는 중입니다"
                : status === "CA"
                ? "모든 테스트를 통과했습니다"
                : status === "DRAFT"
                ? "아직 제출되지 않은 코드입니다"
                : "실패한 테스트케이스를 확인해 보세요"}
            </span>
            <span>
              <GlowNumber>
                {status === "PENDING"
                  ? "--"
                  : status === "GRADING"
                  ? `${progressPercent}%`
                  : status === "CA"
                  ? "100%"
                  : status === "DRAFT"
                  ? "0%"
                  : "100%"}
              </GlowNumber>
            </span>
          </ProgressLabel>
        </ProgressWrapper>
      </StatusSection>

      <StatsRow>
        <StatCard>
          <StatLabel>통과한 테스트</StatLabel>
          <StatValue>
            {totalTests != null
              ? `${passedTests ?? 0} / ${totalTests}`
              : status === "PENDING" || status === "GRADING"
              ? "집계 중"
              : status === "CA"
              ? "모든 테스트 통과"
              : "-"}
          </StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>실패한 테스트</StatLabel>
          <StatValue>
            {failedTests != null
              ? `${failedTests}`
              : status === "PENDING" ||
                status === "GRADING" ||
                status === "DRAFT"
              ? "집계 중"
              : status === "CA"
              ? "0"
              : "있음"}
          </StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>실행 시간</StatLabel>
          <StatValue>
            {effectiveRuntime != null
              ? `${effectiveRuntime} ms`
              : status === "PENDING" || status === "GRADING"
              ? "측정 중"
              : "-"}
          </StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>메모리 사용량</StatLabel>
          <StatValue>
            {effectiveMemory != null
              ? `${effectiveMemory} KB`
              : status === "PENDING" || status === "GRADING"
              ? "측정 중"
              : "-"}
          </StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>채점 ID</StatLabel>
          <StatValue>{submissionId ?? <span>정보 없음</span>}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>최종 결과</StatLabel>
          <StatValue>
            {status === "PENDING"
              ? "대기중"
              : status === "GRADING"
              ? "채점중"
              : status === "CA"
              ? "맞았습니다!"
              : status === "DRAFT"
              ? "임시 저장"
              : "틀렸습니다"}
          </StatValue>
        </StatCard>
      </StatsRow>

      <FooterRow>
        <HintText>
          {status === "PENDING" &&
            "채점 서버와 연결 중입니다. 잠시만 기다려 주세요."}
          {status === "GRADING" &&
            "테스트케이스 수가 많을수록 시간이 조금 더 걸릴 수 있어요."}
          {status === "CA" &&
            "이제 다른 난이도의 문제를 풀어보거나, 다른 언어로 다시 도전해 볼 수 있어요."}
          {status === "DRAFT" &&
            "임시 저장된 코드라 채점 기록은 남지 않습니다."}
          {status !== "PENDING" &&
            status !== "GRADING" &&
            status !== "CA" &&
            status !== "DRAFT" &&
            "실패한 테스트케이스의 입출력을 확인하고 코드를 수정해 보세요."}
          {submissionError && ` (${submissionError})`}
        </HintText>
        <ButtonGroup>
          <ActionButton variant="ghost" onClick={handleClickMyCode}>
            내 코드 보기
          </ActionButton>
          <ActionButton
            variant="ghost"
            onClick={() =>
              navigate(`/problems/${problemId}/analysis/${submissionId}`)
            }
          >
            코드 분석
          </ActionButton>

          <ActionButton variant="primary" onClick={handleClickNavEditor}>
            에디터로 돌아가기
          </ActionButton>
          <ActionButton
            variant="primary"
            onClick={() =>
              problemId
                ? navigate(`/problem-detail/${problemId}/solved`)
                : alert("문제 ID가 없어 다른 사람 풀이를 볼 수 없습니다.")
            }
          >
            다른 사람 풀이 보기
          </ActionButton>
        </ButtonGroup>
      </FooterRow>
    </ResultCard>
  );
}

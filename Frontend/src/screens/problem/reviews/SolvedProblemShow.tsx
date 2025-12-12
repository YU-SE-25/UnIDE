import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { fetchProblemDetail } from "../../../api/problem_api";
import type { IProblem } from "../../../api/problem_api";

import { fetchSubmissionDetail } from "../../../api/mySubmissions_api";
import ProblemMeta from "../../../components/ProblemMeta";
import { timeConverter } from "../../../utils/timeConverter";
import { ButtonContainer } from "../../../theme/ProblemList.Style";
import ReviewSection from "./Review";
import type { Review } from "./Review";
import {
  fetchCommentsByReview,
  fetchReviewsBySubmission,
} from "../../../api/review_api";
const Page = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 32px 24px;
  display: flex;
  justify-content: center;
  background: ${({ theme }) => theme.bgColor};
`;

const Inner = styled.div`
  width: 100%;
  max-width: 960px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const HeadingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: auto;
`;

const OtherCodeButton = styled.button`
  padding: 10px 12px;
  font-size: 13px;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme.logoColor};
  color: white;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const Heading = styled.h1`
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  color: ${({ theme }) => theme.textColor};
`;

const MetaRow = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textColor}99;
  margin-top: 4px;
`;

const ErrorText = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
`;

const langMap: Record<string, string> = {
  C: "c",
  CPP: "cpp",
  "C++": "cpp",
  Java: "java",
  JAVA: "java",
  Python: "python",
  PYTHON: "python",
  Python3: "python",
  PYTHON3: "python",
  JS: "javascript",
  TS: "typescript",
};

export default function SolvedProblemShow() {
  const { problemId, solutionId } = useParams<{
    problemId: string;
    solutionId: string;
  }>();
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [rawLang, setRawLang] = useState("C");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isMine, setIsMine] = useState(false);
  const [ownerName, setOwnerName] = useState<string | null>(null);

  const [problem, setProblem] = useState<IProblem | null>(null);

  const [solutionMeta, setSolutionMeta] = useState<{
    createdAt: string;
    memory: number;
    runtime: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!problemId) return;

    let mounted = true;

    const loadProblem = async () => {
      try {
        const real = await fetchProblemDetail(Number(problemId));
        if (mounted) setProblem(real as IProblem);
      } catch (e) {
        console.error("문제 정보 로드 실패:", e);
        if (mounted) setProblem(null);
      }
    };

    loadProblem();

    return () => {
      mounted = false;
    };
  }, [problemId]);
  useEffect(() => {
    if (!problemId) return;

    let mounted = true;

    const loadSolvedAndReviews = async () => {
      setLoading(true);
      setError(null);

      if (!solutionId) {
        if (mounted) {
          setError("유효하지 않은 접근입니다.");
          setLoading(false);
        }
        return;
      }

      const submissionId = Number(solutionId);
      if (Number.isNaN(submissionId)) {
        if (mounted) {
          setError("잘못된 제출 ID입니다.");
          setLoading(false);
        }
        return;
      }

      try {
        // 🔹 1) 제출 상세 정보 가져오기 (mySubmissions_api)
        const detail = await fetchSubmissionDetail(submissionId);

        if (!mounted) return;

        setCode(detail.code ?? "");
        setRawLang(detail.language);
        setSolutionMeta({
          createdAt: detail.submittedAt,
          memory: detail.memory,
          runtime: detail.runtime,
        });

        // (지금 SubmissionDetail에 username 정보가 없으니까
        //  isMine / ownerName은 일단 초기값 그대로 둠)
        setIsMine(false);
        setOwnerName(null);

        // 🔹 2) 리뷰 + 댓글 조회
        const reviewsRes = await fetchReviewsBySubmission(submissionId);

        let reviewsWithComments: Review[] = [];

        if (reviewsRes && reviewsRes.reviews.length > 0) {
          reviewsWithComments = await Promise.all(
            reviewsRes.reviews.map(async (r) => {
              const commentsRes = await fetchCommentsByReview(r.reviewId);

              const comments =
                commentsRes?.comments.map((c) => ({
                  id: c.commentId,
                  author: c.commenter,
                  content: c.content,
                  createdAt: c.createdAt,
                })) ?? [];

              return {
                id: r.reviewId,
                lineNumber: r.lineNumber,
                content: r.content,
                author: r.reviewer,
                createdAt: r.createdAt,
                voteCount: r.voteCount,
                comments,
              };
            })
          );
        }

        if (!mounted) return;

        setReviews(reviewsWithComments);
      } catch (e) {
        if (mounted) {
          console.error("SolvedProblemShow load error:", e);
          setError("제출된 코드를 불러오는 중 오류가 발생했습니다.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadSolvedAndReviews();

    return () => {
      mounted = false;
    };
  }, [problemId, solutionId]);

  const hlLang = langMap[rawLang] || "text";

  if (loading) {
    return (
      <Page>
        <Inner>
          {problem && <ProblemMeta problem={problem} />}

          <HeadingRow>
            <Heading>제출된 코드</Heading>
            <OtherCodeButton disabled>다른 사람 풀이 보기</OtherCodeButton>
          </HeadingRow>
          <MetaRow>코드를 불러오는 중입니다…</MetaRow>
        </Inner>
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <Inner>
          {problem && <ProblemMeta problem={problem} />}

          <HeadingRow>
            <Heading>제출된 코드</Heading>
            <OtherCodeButton
              onClick={() =>
                problemId && navigate(`/problem-detail/${problemId}/solved`)
              }
            >
              다른 사람 풀이 보기
            </OtherCodeButton>
          </HeadingRow>
          <ErrorText>{error}</ErrorText>
        </Inner>
      </Page>
    );
  }

  if (!code) {
    return (
      <Page>
        <Inner>
          {problem && <ProblemMeta problem={problem} />}

          <HeadingRow>
            <Heading>제출된 코드</Heading>
            <OtherCodeButton
              onClick={() =>
                problemId && navigate(`/problem-detail/${problemId}/solved`)
              }
            >
              다른 사람 풀이 보기
            </OtherCodeButton>
          </HeadingRow>
          <ErrorText>표시할 코드가 없습니다.</ErrorText>
        </Inner>
      </Page>
    );
  }

  const handleViewOtherSolutions = () => {
    if (!problemId) return;
    navigate(`/problem-detail/${problemId}/solved`);
  };

  return (
    <Page>
      <Inner>
        {problem && <ProblemMeta problem={problem} />}

        <HeadingRow>
          <Heading>제출된 코드</Heading>
          <ButtonContainer>
            {isMine && (
              <OtherCodeButton
                onClick={() => {
                  navigate(`/users/${ownerName}/submissions/${solutionId}`);
                }}
              >
                편집...
              </OtherCodeButton>
            )}

            <OtherCodeButton onClick={handleViewOtherSolutions}>
              다른 사람 풀이 보기
            </OtherCodeButton>
          </ButtonContainer>
        </HeadingRow>

        <MetaRow>
          언어: {rawLang}
          {solutionMeta && (
            <>
              {" · 제출 시각: "}
              {timeConverter(solutionMeta.createdAt)}
              {" · 메모리: "}
              {solutionMeta.memory}MB
              {" · 실행시간: "}
              {solutionMeta.runtime}ms
            </>
          )}
        </MetaRow>

        <ReviewSection
          code={code}
          language={hlLang}
          reviews={reviews}
          onChangeReviews={setReviews}
          submissionId={Number(solutionId)}
        />
      </Inner>
    </Page>
  );
}

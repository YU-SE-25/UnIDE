import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import { timeConverter } from "../../utils/timeConverter";
import { ButtonContainer } from "../../theme/ProblemList.Style";
import ReviewSection from "./reviews/Review";
import type { Review } from "./reviews/Review";

import {
  fetchSubmissionDetail,
  updateSubmissionShare,
  type SubmissionDetail,
} from "../../api/mySubmissions_api";
import {
  fetchCommentsByReview,
  fetchReviewsBySubmission,
} from "../../api/review_api";

// ===================== 스타일 =====================

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

const ShareButton = styled.button<{ $active: boolean }>`
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 13px;
  border: 1px solid ${({ theme }) => theme.focusColor};
  cursor: pointer;

  background: ${({ theme, $active }) =>
    $active ? theme.focusColor : "transparent"};

  color: ${({ theme, $active }) =>
    $active ? theme.bgColor : theme.focusColor};

  transition: background 0.15s ease, color 0.15s ease, filter 0.15s ease;

  &:hover {
    filter: brightness(0.95);
  }
`;

const RetryButton = styled.button`
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 13px;
  border: none;
  background: ${({ theme }) => theme.textColor};
  color: ${({ theme }) => theme.bgColor};
  cursor: pointer;

  transition: filter 0.15s ease;

  &:hover {
    filter: brightness(0.95);
  }
`;

// ===================== 타입 / 유틸 =====================

// 새 API 언어코드까지 커버하도록 확장
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

// ===================== 컴포넌트 =====================

export default function MySubmissionsDetail() {
  const { solutionId } = useParams<{ solutionId: string }>();
  const navigate = useNavigate();

  // 백엔드 상세 응답 전체
  const [submission, setSubmission] = useState<SubmissionDetail | null>(null);

  // 코드 + 언어 (하이라이팅용)
  const [code, setCode] = useState("");
  const [rawLang, setRawLang] = useState("C");

  const [reviews, setReviews] = useState<Review[]>([]);
  const [isShared, setIsShared] = useState(false);
  const [problemId, setProblemId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const numericSubmissionId = solutionId ? Number(solutionId) : NaN;

  useEffect(() => {
    if (!solutionId || Number.isNaN(numericSubmissionId)) {
      setError("유효하지 않은 접근입니다.");
      setLoading(false);
      return;
    }

    let mounted = true;

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        // 🔹 1) 제출 상세 정보 가져오기
        const detail = await fetchSubmissionDetail(numericSubmissionId);

        if (!mounted) return;

        if (!detail) {
          setError("제출 정보를 찾을 수 없습니다.");
          return;
        }

        setSubmission(detail);
        setCode(detail.code ?? "");
        setRawLang(detail.language);
        setIsShared(detail.shared);
        setProblemId(detail.problemId);

        // 🔹 2) 리뷰 + 댓글 조회
        const reviewsRes = await fetchReviewsBySubmission(numericSubmissionId);

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
          console.error("MySubmissionsDetail load error:", e);
          setError("제출된 코드를 불러오는 중 오류가 발생했습니다.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();

    return () => {
      mounted = false;
    };
  }, [solutionId, numericSubmissionId]);

  const hlLang = langMap[rawLang] || "text";

  const handleToggleShare = async () => {
    if (!submission || Number.isNaN(numericSubmissionId)) return;

    const next = !isShared;
    const ok = window.confirm(
      next
        ? "코드를 다른 사람과 공유하시겠습니까?"
        : "코드 공유를 해제하시겠습니까?"
    );

    if (!ok) return;

    try {
      await updateSubmissionShare(numericSubmissionId, next);
      setIsShared(next);
    } catch (e) {
      console.error("update share error:", e);
      alert("공유 상태를 변경하는 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return (
      <Page>
        <Inner>
          <HeadingRow>
            <Heading>내 코드 보기</Heading>
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
          <HeadingRow>
            <Heading>내 코드 보기</Heading>
          </HeadingRow>
          <ErrorText>{error}</ErrorText>
        </Inner>
      </Page>
    );
  }

  if (!code || !submission) {
    return (
      <Page>
        <Inner>
          <HeadingRow>
            <Heading>내 코드 보기</Heading>
          </HeadingRow>
          <ErrorText>표시할 코드가 없습니다.</ErrorText>
        </Inner>
      </Page>
    );
  }

  return (
    <Page>
      <Inner>
        <HeadingRow>
          <Heading>내 코드 보기</Heading>
        </HeadingRow>

        <MetaRow>
          언어: {rawLang}
          {" · 제출 시각: "}
          {timeConverter(submission.submittedAt)}
          {" · 메모리: "}
          {submission.memory}MB
          {" · 실행시간: "}
          {submission.runtime}ms
        </MetaRow>

        <ButtonContainer>
          <ShareButton $active={isShared} onClick={handleToggleShare}>
            {isShared ? "공유중" : "코드 공유"}
          </ShareButton>

          <RetryButton
            onClick={() =>
              problemId && navigate(`/problems/${problemId}/solve`)
            }
          >
            다시 풀기
          </RetryButton>
        </ButtonContainer>

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

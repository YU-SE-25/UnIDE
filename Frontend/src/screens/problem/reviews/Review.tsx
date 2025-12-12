import { useState } from "react";
import styled from "styled-components";
import CodePreview from "./CodePreview";
import { timeConverter } from "../../../utils/timeConverter";
import { isOwner } from "../../../utils/isOwner";
import { useNavigate } from "react-router-dom";

import {
  createReview,
  createReviewComment,
  deleteReview,
  deleteReviewComment,
  fetchCommentsByReview,
  fetchReviewsBySubmission,
  toggleReviewVote,
  updateReview,
  updateReviewComment,
} from "../../../api/review_api";

// ===================== styled ======================

const ReviewSectionTitle = styled.h2`
  margin-top: 24px;
  margin-bottom: 8px;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.textColor};
`;

const ReviewCount = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.textColor}88;
  margin-left: 6px;
`;

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ReviewItem = styled.div<{ $expanded: boolean }>`
  width: 100%;
  text-align: left;
  border-radius: 10px;
  border: 1px solid
    ${({ theme, $expanded }) =>
      $expanded ? theme.focusColor : `${theme.textColor}33`};
  background: ${({ theme, $expanded }) =>
    $expanded ? `${theme.focusColor}11` : theme.bgColor};
  padding: 10px 12px;
  cursor: pointer;

  display: flex;
  flex-direction: column;
  gap: 8px;

  &:hover {
    background: ${({ theme, $expanded }) =>
      $expanded ? "" : `${theme.textColor}0f`};
  }
`;

const ReviewTopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

const LineTag = styled.span`
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.textColor}44;
  color: ${({ theme }) => theme.textColor};
`;

const LineCodeText = styled.span`
  font-family: "Consolas", monospace;
  font-size: 12px;
  color: ${({ theme }) => theme.textColor}cc;
  flex: 1;
  margin-left: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ReviewMeta = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: ${({ theme }) => theme.textColor}88;
`;

const LikeButton = styled.button<{ $liked?: boolean }>`
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid
    ${({ theme, $liked }) =>
      $liked ? theme.textColor + "55" : theme.textColor + "33"};
  background: ${({ theme, $liked }) =>
    $liked ? theme.textColor + "11" : theme.bgColor};
  font-size: 11px;
  cursor: pointer;
  color: ${({ theme }) => theme.textColor};
`;

const ReviewPreview = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.textColor};
`;

const ReviewFull = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.textColor}dd;
  line-height: 1.4;
`;

const CommentSection = styled.div`
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid ${({ theme }) => theme.textColor}22;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CommentHeader = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textColor}99;
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const CommentItem = styled.div`
  padding: 6px 8px;
  border-radius: 8px;
  background: ${({ theme }) => theme.headerBgColor}22;
`;

const CommentMeta = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.textColor}88;
  margin-bottom: 2px;
`;

const CommentContent = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.textColor}dd;
`;

const CommentForm = styled.form`
  display: flex;
  gap: 6px;
  margin-top: 4px;
`;

const CommentInput = styled.textarea`
  flex: 1;
  min-height: 40px;
  max-height: 80px;
  resize: vertical;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.textColor}44;
  padding: 6px 8px;
  font-size: 13px;
  background: ${({ theme }) => theme.bgColor};
  color: ${({ theme }) => theme.textColor};
`;

const CommentSubmitBtn = styled.button`
  padding: 6px 10px;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme.focusColor};
  color: #000;
  font-size: 13px;
  cursor: pointer;
`;

const CommentActionButton = styled.button<{ $danger?: boolean }>`
  margin-left: 6px;
  font-size: 11px;
  border: none;
  background: none;
  cursor: pointer;
  color: ${({ theme, $danger }) => ($danger ? "#ff4d4f" : theme.muteColor)};
`;

const ReviewEmptyText = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textColor}99;
`;

// ===================== types ======================

type ReviewComment = {
  id: number;
  author: string;
  content: string;
  createdAt: string;
};

export type Review = {
  id: number;
  lineNumber: number;
  content: string;
  author: string;
  createdAt: string;
  voteCount: number;
  comments: ReviewComment[];
};

interface ReviewSectionProps {
  code: string;
  language: string;
  reviews: Review[];
  onChangeReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  submissionId: number;
}

// ===================== Component ======================

export default function ReviewSection({
  code,
  language,
  reviews,
  onChangeReviews,
  submissionId,
}: ReviewSectionProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [commentDrafts, setCommentDrafts] = useState<Record<number, string>>(
    {}
  );
  const [editingTarget, setEditingTarget] = useState<{
    reviewId: number;
    commentId: number;
  } | null>(null);

  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editReviewTarget, setEditReviewTarget] = useState<{
    lineNumber: number;
    lineCode: string;
    content: string;
  } | null>(null);

  const [likedReviews, setLikedReviews] = useState<Record<number, boolean>>({});

  const codeLines = code.split("\n");
  const getLineContent = (lineNumber: number) =>
    codeLines[lineNumber - 1] ?? "";

  const navigate = useNavigate();
  const goMypage = (username: string) => () => {
    if (!username || username === "익명") return;
    navigate(`/mypage/${username}`);
  };

  // ======================
  // 리뷰 펼치기 + 댓글 로딩
  // ======================
  const handleToggle = async (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));

    if (expandedId === id) return;

    const res = await fetchCommentsByReview(id);

    const mapped = res.comments.map((c) => ({
      id: c.commentId,
      author: c.commenter,
      content: c.content,
      createdAt: c.createdAt,
    }));

    onChangeReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, comments: mapped } : r))
    );
  };

  const makePreview = (content: string, max = 40) =>
    content.length <= max ? content : content.slice(0, max) + "…";

  // ======================
  // 댓글 입력
  // ======================
  const handleCommentChange = (reviewId: number, text: string) => {
    setCommentDrafts((prev) => ({ ...prev, [reviewId]: text }));
  };

  // ======================
  // 댓글 등록 / 수정
  // ======================
  const handleCommentSubmit = async (e: React.FormEvent, reviewId: number) => {
    e.preventDefault();

    const text = commentDrafts[reviewId]?.trim();
    if (!text) return;

    const isEditing = editingTarget && editingTarget.reviewId === reviewId;

    if (isEditing && editingTarget) {
      await updateReviewComment(reviewId, editingTarget.commentId, text);
      setEditingTarget(null);
    } else {
      await createReviewComment(reviewId, text);
    }

    const res = await fetchCommentsByReview(reviewId);

    const mapped = res.comments.map((c) => ({
      id: c.commentId,
      author: c.commenter,
      content: c.content,
      createdAt: c.createdAt,
    }));

    onChangeReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, comments: mapped } : r))
    );

    setCommentDrafts((prev) => ({ ...prev, [reviewId]: "" }));
  };

  // ======================
  // 리뷰 수정 모드 진입
  // ======================
  const handleEditReview = (review: Review) => {
    setEditingReviewId(review.id);
    setEditReviewTarget({
      lineNumber: review.lineNumber,
      lineCode: getLineContent(review.lineNumber),
      content: review.content,
    });
    setExpandedId(review.id);
  };

  // ======================
  // 리뷰 삭제
  // ======================
  const handleDeleteReview = async (reviewId: number) => {
    const ok = window.confirm("리뷰를 삭제하시겠습니까?");
    if (!ok) return;

    await deleteReview(reviewId);

    // ✅ 로컬 state에서 바로 제거
    onChangeReviews((prev) => prev.filter((r) => r.id !== reviewId));

    if (editingReviewId === reviewId) {
      setEditingReviewId(null);
      setEditReviewTarget(null);
    }

    alert("삭제되었습니다.");
  };

  // ======================
  // 댓글 수정 진입
  // ======================
  const handleEditComment = (reviewId: number, c: ReviewComment) => {
    setEditingTarget({ reviewId, commentId: c.id });
    setCommentDrafts((prev) => ({ ...prev, [reviewId]: c.content }));
  };

  // ======================
  // 댓글 삭제
  // ======================
  const handleDeleteComment = async (reviewId: number, commentId: number) => {
    const ok = window.confirm("삭제하시겠습니까?");
    if (!ok) return;

    await deleteReviewComment(reviewId, commentId);

    const res = await fetchCommentsByReview(reviewId);

    const mapped = res.comments.map((c) => ({
      id: c.commentId,
      author: c.commenter,
      content: c.content,
      createdAt: c.createdAt,
    }));

    onChangeReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, comments: mapped } : r))
    );

    alert("삭제되었습니다.");
  };

  // ======================
  // 좋아요
  // ======================
  const handleLikeReview = async (e: React.MouseEvent, reviewId: number) => {
    e.stopPropagation();

    const res = await toggleReviewVote(reviewId);

    onChangeReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, voteCount: res.voteCount } : r
      )
    );

    setLikedReviews((prev) => ({
      ...prev,
      [reviewId]: res.viewerLiked,
    }));
  };

  // ======================
  // 리뷰 추가
  // ======================
  const handleAddReview = async ({
    lineNumber,
    content,
  }: {
    lineNumber: number;
    lineCode: string;
    content: string;
  }) => {
    // 1) 리뷰 생성
    await createReview({
      submissionId,
      content,
      lineNumber,
    });

    // 2) 최신 리뷰 목록 다시 불러오기
    const res = await fetchReviewsBySubmission(submissionId);
    // 혹시 디버깅용으로 한 번 보려면:

    // 3) Review[] 형태로 매핑
    const mapped: Review[] = res.reviews.map((r) => ({
      id: r.reviewId,
      lineNumber: r.lineNumber,
      content: r.content,
      author: r.reviewer,
      createdAt: r.createdAt,
      voteCount: r.voteCount,
      comments:
        r.comments?.map((c: any) => ({
          id: c.commentId,
          author: c.commenter,
          content: c.content,
          createdAt: c.createdAt,
        })) ?? [],
    }));

    onChangeReviews(mapped);

    // 4) 가장 최근 리뷰 열어주기 (정렬이 최신순이라고 가정)
    const newest = res.reviews[0];
    if (newest) setExpandedId(newest.reviewId);
  };

  // ======================
  // 리뷰 수정
  // ======================
  const handleEditReviewSubmit = async ({
    content,
  }: {
    lineNumber: number;
    lineCode: string;
    content: string;
  }) => {
    if (!editingReviewId) return;

    await updateReview(editingReviewId, content);

    // ✅ 해당 리뷰만 내용 갱신
    onChangeReviews((prev) =>
      prev.map((r) => (r.id === editingReviewId ? { ...r, content } : r))
    );

    setEditingReviewId(null);
    setEditReviewTarget(null);
  };

  // ======================
  // JSX
  // ======================
  return (
    <>
      <CodePreview
        code={code}
        language={language}
        editReviewTarget={editReviewTarget}
        onEditReview={handleEditReviewSubmit}
        onAddReview={handleAddReview}
      />

      <ReviewSectionTitle>
        코드 리뷰 <ReviewCount>({reviews.length})</ReviewCount>
      </ReviewSectionTitle>

      {reviews.length === 0 ? (
        <ReviewEmptyText>아직 등록된 리뷰가 없습니다.</ReviewEmptyText>
      ) : (
        <ReviewList>
          {reviews.map((review) => {
            const expanded = expandedId === review.id;
            const lineCode = getLineContent(review.lineNumber);
            const isEditingThisReview =
              editingTarget && editingTarget.reviewId === review.id;
            const liked = !!likedReviews[review.id];

            return (
              <ReviewItem
                key={review.id}
                $expanded={expanded}
                onClick={() => handleToggle(review.id)}
              >
                <ReviewTopRow>
                  <LineTag>{review.lineNumber}번째 줄</LineTag>
                  <LineCodeText>{lineCode}</LineCodeText>

                  <ReviewMeta>
                    <LikeButton
                      type="button"
                      $liked={liked}
                      disabled={liked}
                      onClick={(e) => handleLikeReview(e, review.id)}
                    >
                      👍 {review.voteCount}
                    </LikeButton>
                    {isOwner(review) && (
                      <>
                        <CommentActionButton
                          type="button"
                          onClick={() => handleEditReview(review)}
                        >
                          수정
                        </CommentActionButton>

                        <CommentActionButton
                          type="button"
                          $danger
                          onClick={() => handleDeleteReview(review.id)}
                        >
                          삭제
                        </CommentActionButton>
                      </>
                    )}
                    <span
                      onClick={goMypage(review.author)}
                      style={{ cursor: "pointer", fontWeight: 600 }}
                    >
                      {review.author}
                    </span>
                    {" · " + timeConverter(review.createdAt)}
                  </ReviewMeta>
                </ReviewTopRow>

                {!expanded && (
                  <ReviewPreview>{makePreview(review.content)}</ReviewPreview>
                )}

                {expanded && (
                  <>
                    <ReviewFull>{review.content}</ReviewFull>

                    <CommentSection onClick={(e) => e.stopPropagation()}>
                      <CommentHeader>
                        댓글 {review.comments.length}개
                      </CommentHeader>

                      <CommentList>
                        {review.comments.map((c) => (
                          <CommentItem key={c.id}>
                            <CommentMeta>
                              <span
                                onClick={goMypage(c.author)}
                                style={{ cursor: "pointer", fontWeight: 600 }}
                              >
                                {c.author}
                              </span>
                              {" · " + timeConverter(c.createdAt)}

                              {isOwner(c) && (
                                <>
                                  <CommentActionButton
                                    type="button"
                                    onClick={() =>
                                      handleEditComment(review.id, c)
                                    }
                                  >
                                    수정
                                  </CommentActionButton>

                                  <CommentActionButton
                                    type="button"
                                    $danger
                                    onClick={() =>
                                      handleDeleteComment(review.id, c.id)
                                    }
                                  >
                                    삭제
                                  </CommentActionButton>
                                </>
                              )}
                            </CommentMeta>

                            <CommentContent>{c.content}</CommentContent>
                          </CommentItem>
                        ))}
                      </CommentList>

                      <CommentForm
                        onSubmit={(e) => handleCommentSubmit(e, review.id)}
                      >
                        <CommentInput
                          placeholder="댓글을 입력하세요."
                          value={commentDrafts[review.id] ?? ""}
                          onChange={(e) =>
                            handleCommentChange(review.id, e.target.value)
                          }
                        />
                        <CommentSubmitBtn type="submit">
                          {isEditingThisReview ? "댓글 수정" : "등록"}
                        </CommentSubmitBtn>
                      </CommentForm>
                    </CommentSection>
                  </>
                )}
              </ReviewItem>
            );
          })}
        </ReviewList>
      )}
    </>
  );
}

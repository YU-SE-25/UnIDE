import { api } from "./axios";

export type ReportTargetType =
  | "DIS_POST"
  | "DIS_COMMENT"
  | "QNA_POST"
  | "QNA_COMMENT"
  | "REVIEW"
  | "REVIEW_COMMENT";

// 개별 신고 요청 (reason만 전송!)

export async function reportDisBoardPost(postId: number, reason: string) {
  return api.post(`/dis_board/${postId}/reports`, { reason });
}

export async function reportDisBoardComment(commentId: number, reason: string) {
  return api.post(`/dis_board/comment/${commentId}/reports`, { reason });
}

export async function reportQnaPost(postId: number, reason: string) {
  return api.post(`/qna_board/${postId}/reports`, { reason });
}

export async function reportQnaComment(commentId: number, reason: string) {
  return api.post(`/qna_board/comment/${commentId}/reports`, { reason });
}

export async function reportReview(reviewId: number, reason: string) {
  return api.post(`/reviews/${reviewId}/reports`, { reason });
}

export async function reportReviewComment(
  reviewId: number,
  commentId: number,
  reason: string
) {
  return api.post(`/reviews/${reviewId}/comments/${commentId}/reports`, {
    reason,
  });
}

// 신고 통합 처리 함수

export interface CreateReportParams {
  targetContentType: ReportTargetType;
  targetContentId: number;
  reason: string;
  extraId?: number; // review의 경우 reviewId
}

export async function createReport({
  targetContentType,
  targetContentId,
  reason,
  extraId,
}: CreateReportParams) {
  const trimmedReason = reason.trim();
  if (!trimmedReason) throw new Error("신고 사유를 입력해주세요.");

  switch (targetContentType) {
    case "DIS_POST":
      return reportDisBoardPost(targetContentId, trimmedReason);

    case "DIS_COMMENT":
      return reportDisBoardComment(targetContentId, trimmedReason);

    case "QNA_POST":
      return reportQnaPost(targetContentId, trimmedReason);

    case "QNA_COMMENT":
      return reportQnaComment(targetContentId, trimmedReason);

    case "REVIEW":
      return reportReview(targetContentId, trimmedReason);

    case "REVIEW_COMMENT":
      if (!extraId)
        throw new Error(
          "REVIEW_COMMENT의 경우 extraId(reviewId)가 필요합니다."
        );
      return reportReviewComment(extraId, targetContentId, trimmedReason);

    default:
      throw new Error(`지원하지 않는 신고 타입: ${targetContentType}`);
  }
}

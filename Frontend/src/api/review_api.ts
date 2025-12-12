// src/api/review_api.ts
import { api } from "./axios"; // axios 인스턴스 경로에 맞게 수정
type ReviewCommentDto = {
  commentId: number;
  commenter: string;
  content: string;
  createdAt: string;
};
export interface Review {
  comments: ReviewCommentDto[];
  lineNumber: number;
  reviewId: number;
  reviewer: string;
  content: string;
  voteCount: number;
  createdAt: string;
  owner: boolean;
}

export interface ReviewPage {
  totalPages: number;
  currentPage: number;
  reviews: Review[];
}

/** 리뷰 목록 조회: GET /api/submissions/{submissionId}/reviews?page= */
export async function fetchReviewsBySubmission(
  submissionId: number,
  page: number = 0
): Promise<ReviewPage> {
  const res = await api.get<ReviewPage>(
    `/submissions/${submissionId}/reviews`,
    {
      params: { page },
    }
  );
  return res.data;
}

/** 리뷰 작성: POST /api/reviews */
export async function createReview(payload: {
  submissionId: number;
  content: string;
  lineNumber: number;
}): Promise<{ message: string }> {
  const res = await api.post<{ message: string }>(`/reviews`, payload);
  return res.data;
}

/** 리뷰 수정: PATCH /api/reviews/{reviewId} */
export async function updateReview(
  reviewId: number,
  content: string
): Promise<{ reviewId: number; message: string }> {
  const res = await api.patch<{ reviewId: number; message: string }>(
    `/reviews/${reviewId}`,
    { content }
  );
  return res.data;
}

/** 리뷰 삭제: DELETE /api/reviews/{reviewId} */
export async function deleteReview(
  reviewId: number
): Promise<{ reviewId: number; message: string }> {
  const res = await api.delete<{ reviewId: number; message: string }>(
    `/reviews/${reviewId}`
  );
  return res.data;
}

/** 리뷰 투표 토글: POST /api/reviews/{reviewId}/vote */
export interface ReviewVoteResponse {
  reviewId: number;
  voteCount: number;
  viewerLiked: boolean;
  message: string;
}

export async function toggleReviewVote(
  reviewId: number
): Promise<ReviewVoteResponse> {
  const res = await api.post<ReviewVoteResponse>(`/reviews/${reviewId}/vote`);
  return res.data;
}

/* =======================
   리뷰 댓글 관련
   ======================= */

export interface ReviewComment {
  commentId: number;
  commenter: string;
  content: string;
  createdAt: string;
  owner: boolean;
}

export interface ReviewCommentPage {
  totalPages: number;
  currentPage: number;
  comments: ReviewComment[];
}

/** 리뷰 댓글 목록 조회: GET /api/reviews/{reviewId}/comments?page= */
export async function fetchCommentsByReview(
  reviewId: number,
  page: number = 0
): Promise<ReviewCommentPage> {
  const res = await api.get<ReviewCommentPage>(
    `/reviews/${reviewId}/comments`,
    {
      params: { page },
    }
  );
  return res.data;
}

/** 리뷰 댓글 작성: POST /api/reviews/{reviewId}/comments */
export async function createReviewComment(
  reviewId: number,
  content: string
): Promise<{ commentId: number; message: string }> {
  const res = await api.post<{ commentId: number; message: string }>(
    `/reviews/${reviewId}/comments`,
    { content }
  );
  return res.data;
}

/** 리뷰 댓글 수정: PATCH /api/reviews/{reviewId}/comments/{commentId} */
export async function updateReviewComment(
  reviewId: number,
  commentId: number,
  content: string
): Promise<{ commentId: number; message: string }> {
  const res = await api.patch<{ commentId: number; message: string }>(
    `/reviews/${reviewId}/comments/${commentId}`,
    { content }
  );
  return res.data;
}

/** 리뷰 댓글 삭제: DELETE /api/reviews/{reviewId}/comments/{commentId} */
export async function deleteReviewComment(
  reviewId: number,
  commentId: number
): Promise<{ message: string }> {
  const res = await api.delete<{ message: string }>(
    `/reviews/${reviewId}/comments/${commentId}`
  );
  return res.data;
}

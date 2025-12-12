// src/api/qna_api.ts
import type { BoardComment } from "../screens/board/BoardList";
import type { QnaContent } from "../screens/board/QnaList";
import { api } from "./axios";
import { mapCommentDto } from "./board_api";

/* ========================== 게시글 DTO & 매핑 ========================== */

export interface QnaProblemDto {
  problemId: number;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
}

export interface QnaPostDto {
  authorId: number;
  authorName: string;
  postId: number;
  anonymous: boolean;
  title: string;
  contents: string;
  privatePost: boolean;
  message: string | null;
  likeCount: number;
  commentCount: number;
  attachmentUrl: string | null;

  problemId: number;
  problem?: QnaProblemDto;

  createdAt: string;
  updatedAt: string;
  viewerLiked: boolean;
}

export interface QnaPostPage {
  content: QnaPostDto[];
  page: number; // 0 기반
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

/* 게시글 DTO → QnaContent 매핑 */
export function mapqnaPost(dto: QnaPostDto): QnaContent {
  return {
    post_id: dto.postId,
    post_title: dto.title,
    problem_id: dto.problemId,

    author: dto.authorName,
    author_id: dto.authorId,

    tag: { id: 0, name: "" },
    anonymity: dto.anonymous,

    like_count: dto.likeCount,
    comment_count: dto.commentCount,

    create_time: dto.createdAt,
    updated_time: dto.updatedAt,

    is_private: dto.privatePost,
    contents: dto.contents,

    viewer_liked: dto.viewerLiked,
    attachment_url: dto.attachmentUrl,
    message: dto.message,

    comments: [],
  };
}

export function mapqnaPostPage(pageDto: QnaPostPage) {
  return {
    content: pageDto.content.map(mapqnaPost),
    page: pageDto.page,
    size: pageDto.size,
    totalElements: pageDto.totalElements,
    totalPages: pageDto.totalPages,
    last: pageDto.last,
  };
}

/* ========================== 게시글 API ========================== */

/** 게시글 단건 조회: GET /api/qna_board/{postId} */
export async function fetchqnaPost(postId: number): Promise<QnaContent> {
  const res = await api.get<QnaPostDto>(`/qna_board/${postId}`);
  return mapqnaPost(res.data);
}

/** 게시글 수정: PUT /api/qna_board/{postId} */
export async function updateqnaPost(postId: number, payload: any) {
  const res = await api.put(`/qna_board/${postId}`, payload);
  return res.data;
}

/** 게시글 삭제: DELETE /api/qna_board/{postId} */
export async function deleteqnaPost(postId: number) {
  const res = await api.delete(`/qna_board/${postId}`);
  return res.data;
}

/** 게시글 목록(페이지 기반): GET /api/qna_board?page= */
export async function fetchqnaList(page: number) {
  const res = await api.get<QnaPostPage>("/qna_board", {
    params: { page },
  });
  return mapqnaPostPage(res.data);
}

/** 게시글 생성: POST /api/qna_board */
export async function createqnaPost(payload: any) {
  const res = await api.post("/qna_board", payload);
  return res.data;
}

export async function addProblemNumber(postId: number, problemId: number) {
  const res = await api.post("/qna_board/problem/link", { postId, problemId });
  return res.data;
}

/** 게시글 신고: POST /api/qna_board/{postId}/reports */
export async function reportqnaPost(postId: number, payload: any) {
  const res = await api.post(`/qna_board/${postId}/reports`, payload);
  return res.data;
}

/* ========================== 투표 API ========================== */

export async function fetchqnaPoll(postId: number) {
  const res = await api.get(`/qna_board/${postId}/poll`);
  return res.data;
}

export async function createOrUpdateqnaPoll(postId: number, payload: any) {
  const res = await api.post(`/qna_board/${postId}/poll`, payload);
  return res.data;
}

export async function voteqnaPoll(
  postId: number,
  pollId: number,
  payload?: any
) {
  const res = await api.post(
    `/qna_board/${postId}/poll/${pollId}/vote`,
    payload
  );
  return res.data;
}

/* ========================== 좋아요 & 첨부파일 ========================== */

export async function likeqnaPost(postId: number) {
  const res = await api.post(`/qna_board/${postId}/like`);
  return res.data;
}
export interface AttachUrlPayload {
  post_id: number;
  contents: string; // 이미지 URL
}

export async function attachqnaFile(postId: number, imageUrl: string) {
  const payload = {
    post_id: postId,
    contents: imageUrl,
  };

  const res = await api.post(`/qna_board/${postId}/attach`, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
}
/* ========================== 게시글 검색 ========================== */

export interface qnaSearchParams {
  keyword: string;
  page?: number; // 1 기반
  size?: number;
}

export async function searchqnaPosts(params: qnaSearchParams) {
  const { page = 1, ...rest } = params;
  const backendPage = Math.max(page - 1, 0);

  const res = await api.get<QnaPostPage>("/qna_board/search", {
    params: { ...rest, page: backendPage },
  });
  return mapqnaPostPage(res.data);
}

/* ========================== 댓글 API ========================== */

/** 단일 댓글 조회: GET /api/qna_board/comment/{commentId} */
export async function fetchCommentsById(
  commentId: number
): Promise<BoardComment> {
  const res = await api.get(`/qna_board/comment/${commentId}`);
  return mapCommentDto(res.data);
}

/** 댓글 수정: PUT /api/qna_board/comment/{commentId} */
export async function updateComment(commentId: number, payload: any) {
  const res = await api.put(`/qna_board/comment/${commentId}`, payload);
  return res.data;
}

/** 댓글 삭제: DELETE /api/qna_board/comment/{commentId} */
export async function deleteComment(commentId: number) {
  await api.delete(`/qna_board/comment/${commentId}`);
}

/** 특정 게시글의 댓글 목록: GET /api/qna_board/{postId}/comments */
export async function fetchCommentsByPostId(
  postId: number
): Promise<BoardComment[]> {
  const res = await api.get(`/qna_board/${postId}/comments`);

  const raw = Array.isArray(res.data)
    ? res.data
    : res.data.comments ?? res.data.content ?? [];

  return raw.map(mapCommentDto);
}

/** 특정 게시글에 댓글 작성: POST /api/qna_board/{postId}/comments */
export async function createComment(
  postId: number,
  payload: {
    contents: string;
    anonymity: boolean;
    is_private: boolean;
    parent_id: number | null;
  }
) {
  const res = await api.post(`/qna_board/${postId}/comments`, payload);
  return res.data;
}

/** 댓글 신고: POST /api/qna_board/comment/{commentId}/reports */
export async function reportComment(commentId: number, payload: any) {
  await api.post(`/qna_board/comment/${commentId}/reports`, payload);
}

/** 댓글 좋아요: POST /api/qna_board/comment/{commentId}/like */
export async function likeComment(
  commentId: number
): Promise<{ likeCount: number; liked: boolean }> {
  const res = await api.post(`/qna_board/comment/${commentId}/like`);
  return res.data;
}

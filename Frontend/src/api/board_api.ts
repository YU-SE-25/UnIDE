import type {
  BoardComment,
  BoardContent,
} from "../screens/board/BoardList.tsx";
import { api } from "./axios.ts";

/* ========================== 게시글 DTO & 매핑 ========================== */

export interface DiscussPostDto {
  authorId: number;
  authorName: string;
  postId: number;
  anonymous: boolean;
  title: string;
  contents: string;
  privatePost: boolean;
  message: string | null; // null까지 받아서 이렇게
  likeCount: number;
  commentCount: number;
  attachmentUrl: string | null; // null까지
  createdAt: string; // "2025-12-01T16:40:04.527742"
  updatedAt: string;
  viewerLiked: boolean;
}
export interface DiscussPostPage {
  content: DiscussPostDto[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
/* 게시글 DTO → BoardContent 매핑 */
export function mapDiscussPost(dto: DiscussPostDto): BoardContent {
  return {
    post_id: dto.postId,
    post_title: dto.title,

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

    comments: [], // 댓글은 별도 API로 가져올 예정
  };
}

export function mapDiscussPostPage(pageDto: DiscussPostPage) {
  return {
    content: pageDto.content.map(mapDiscussPost),
    page: pageDto.page,
    size: pageDto.size,
    totalElements: pageDto.totalElements,
    totalPages: pageDto.totalPages,
    last: pageDto.last,
  };
}

export function mapCommentDto(dto: any): BoardComment {
  return {
    comment_id: dto.comment_id,
    post_id: dto.post_id,
    parent_id: dto.parent_id,

    author_id: dto.author_id,
    author_name: dto.author_name,

    anonymity: dto.anonymity,
    content: dto.content,
    is_private: dto.is_private,

    like_count: dto.like_count,
    viewer_liked: dto.viewerLiked,

    created_at: dto.created_at,
    updated_at: dto.updated_at,

    message: dto.message,
  };
}

/* ========================== 게시글 API ========================== */

/* 게시글 단건 조회: GET /api/dis_board/{postId} */
export async function fetchDiscussPost(postId: number): Promise<BoardContent> {
  const res = await api.get(`/dis_board/${postId}`);
  return mapDiscussPost(res.data);
}

/* 게시글 수정: PUT /api/dis_board/{postId} */
export async function updateDiscussPost(postId: number, payload: any) {
  const res = await api.put(`/dis_board/${postId}`, payload);
  return res.data;
}

/* 게시글 삭제: DELETE /api/dis_board/{postId} */
export async function deleteDiscussPost(postId: number) {
  const res = await api.delete(`/dis_board/${postId}`);
  return res.data;
}

/* 게시글 목록(페이지 기반): GET /api/dis_board?page= */
export async function fetchDiscussList(page = 1) {
  const res = await api.get<DiscussPostPage>("/dis_board", {
    params: { page },
  });
  return mapDiscussPostPage(res.data);
}
/* 게시글 생성: POST /api/dis_board */
export async function createDiscussPost(payload: any) {
  const res = await api.post("/dis_board", payload);
  return res.data;
}

/* 게시글 신고: POST /api/dis_board/{postId}/reports */
export async function reportDiscussPost(postId: number, payload: any) {
  const res = await api.post(`/dis_board/${postId}/reports`, payload);
  return res.data;
}

/* ========================== 투표 API ========================== */

/* 투표 정보 조회: GET /api/dis_board/{postId}/poll */
export async function fetchDiscussPoll(postId: number) {
  const res = await api.get(`/dis_board/${postId}/poll`);
  return res.data;
}

/* 투표 생성/수정: POST /api/dis_board/{postId}/poll */
export async function createOrUpdateDiscussPoll(postId: number, payload: any) {
  const res = await api.post(`/dis_board/${postId}/poll`, payload);
  return res.data;
}

/* 투표하기: POST /api/dis_board/{postId}/poll/{pollId}/vote */
export async function voteDiscussPoll(
  postId: number,
  pollId: number,
  payload?: any
) {
  const res = await api.post(
    `/dis_board/${postId}/poll/${pollId}/vote`,
    payload
  );
  return res.data;
}

/* ========================== 좋아요 & 첨부파일 ========================== */

/* 게시글 좋아요: POST /api/dis_board/{postId}/like */
export async function likeDiscussPost(postId: number) {
  const res = await api.post(`/dis_board/${postId}/like`);
  return res.data;
}

/* 첨부파일 업로드: POST /api/dis_board/{postId}/attach */
export async function attachDiscussImageUrl(postId: number, imageUrl: string) {
  const payload = {
    post_id: postId,
    contents: imageUrl,
  };

  const res = await api.post(`/dis_board/${postId}/attach`, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
}

/* ========================== 게시글 검색 ========================== */

/* 게시글 검색: GET /api/dis_board/search */
export interface DiscussSearchParams {
  keyword: string;
  page?: number;
  size?: number;
}

export async function searchDiscussPosts(params: DiscussSearchParams) {
  const res = await api.get("/dis_board/search", { params });
  return res.data;
}

/* ========================== 댓글 API ========================== */

/* 단일 댓글 조회: GET /api/dis_board/comment/{commentId} */
export async function fetchCommentsById(postId: number) {
  const res = await api.get(`/dis_board/comment/${postId}`);
  return res.data.map(mapCommentDto);
}

/* 댓글 수정: PUT /api/dis_board/comment/{commentId} */
export async function updateComment(commentId: number, payload: any) {
  const res = await api.put(`/dis_board/comment/${commentId}`, payload);
  return res.data;
}

/* 댓글 삭제: DELETE /api/dis_board/comment/{commentId} */
export async function deleteComment(commentId: number) {
  await api.delete(`/dis_board/comment/${commentId}`);
}

/* 특정 게시글의 댓글 목록 조회: GET /api/dis_board/{postId}/comments */
export async function fetchCommentsByPostId(postId: number) {
  const res = await api.get(`/dis_board/${postId}/comments`);
  return res.data;
}

/* 특정 게시글에 댓글 작성: POST /api/dis_board/{postId}/comments */
export async function createComment(
  postId: number,
  payload: {
    contents: string;
    anonymity: boolean;
    is_private: boolean;
    parent_id: number | null;
  }
) {
  const res = await api.post(`/dis_board/${postId}/comments`, payload);
  return res.data;
}

/* 댓글 신고: POST /api/dis_board/comment/{commentId}/reports */
export async function reportComment(commentId: number, payload: any) {
  await api.post(`/dis_board/comment/${commentId}/reports`, payload);
}

/* 댓글 좋아요: POST /api/dis_board/comment/{commentId}/like */
export async function likeComment(
  commentId: number
): Promise<{ likeCount: number; liked: boolean }> {
  const res = await api.post(`/dis_board/comment/${commentId}/like`);
  return res.data;
}

export interface DiscussTagDto {
  id: number;
  name: string;
}

export interface TagPostSummaryDto {
  postId: number;
  title: string;
  contents: string;
  authorId: number;
  authorName: string;
  likeCount: number;
  commentCount: number;
  viewerLiked: boolean;
  createdAt?: string;
}
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
export type BoardPage = PageResponse<BoardContent>;

function mapTagPostToBoardContent(dto: TagPostSummaryDto): BoardContent {
  return {
    post_id: dto.postId,
    post_title: dto.title,
    author: dto.authorName,
    author_id: dto.authorId,
    updated_time: dto.createdAt ?? "",
    viewer_liked: dto.viewerLiked,
    attachment_url: null,
    message: null,
    tag: { id: 0, name: "" }, // 필요하면 나중에 채워도 됨
    anonymity: false,
    like_count: dto.likeCount,
    comment_count: dto.commentCount,
    create_time: dto.createdAt ?? "",
    is_private: false,
    contents: dto.contents,
    comments: [],
  };
}

export async function fetchAllDiscussTags(): Promise<DiscussTagDto[]> {
  const res = await api.get<DiscussTagDto[]>("/dis_board/tags");
  return res.data;
}

export async function updatePostTags(
  postId: number,
  tagIds: number[]
): Promise<void> {
  await api.post(`/dis_board/${postId}/tag`, { tagIds });
}

/**
 * 3. 특정 게시글의 태그 조회
 * GET /api/dis_board/tag/list/{postId}
 * 응답: number[] (tagId 배열)
 */
export async function fetchTagIdsByPost(postId: number): Promise<number[]> {
  const res = await api.get<number[]>(`/dis_board/tag/list/${postId}`);
  return res.data;
}

export async function fetchPostsByTag(
  tagId: number,
  page: number
): Promise<BoardPage> {
  const res = await api.get<PageResponse<TagPostSummaryDto>>(
    `/dis_board/tag/${tagId}/posts`,
    { params: { page } }
  );

  return {
    ...res.data,
    content: res.data.content.map(mapTagPostToBoardContent),
  };
}

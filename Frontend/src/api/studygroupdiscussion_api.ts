import { api } from "./axios";

export interface DiscussionListItem {
  postId: number;
  groupId: number;
  authorId: number;
  authorName: string;
  anonymous: boolean;
  title: string;
  contents: string;
  privatePost: boolean;
  likeCount: number;
  commentCount: number;
  attachmentUrl: string | null;
  message: string | null;
  viewerLiked: boolean;
  createTime: string;
  modifyTime: string;
}

// 상세 조회
export interface DiscussionPostDetailAPI {
  post_id: number;
  post_title: string;
  contents: string;
  author: string;
  tag: string;
  anonymity: boolean;
  like_count: number;
  comment_count: number;
  create_time: string;
  modify_time: string;
}

export interface LikeDiscussionResponse {
  likeCount: number;
  viewerLiked: boolean;
}

// 리스트 조회
export async function getDiscussionList(
  groupId: number,
  pageSize = 10
): Promise<DiscussionListItem[]> {
  const res = await api.get<{
    content: DiscussionListItem[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  }>(`/studygroup/discuss/${groupId}`, {
    params: { pageSize },
  });

  if (!Array.isArray(res.data.content)) {
    console.error("API 응답이 배열이 아님:", res.data);
    return [];
  }

  return res.data.content;
}

// 상세 조회
export async function getDiscussionDetail(groupId: number, postId: number) {
  const res = await api.get(`/studygroup/discuss/${groupId}/${postId}`);
  return res.data;
}

// 게시글 등록
export async function createDiscussion(
  groupId: number,
  payload: {
    title: string;
    contents: string;
    privatePost: boolean;
  }
) {
  const res = await api.post(`/studygroup/discuss/${groupId}`, payload);
  return res.data;
}

// 게시글 수정
export async function updateDiscussion(
  groupId: number,
  postId: number,
  payload: {
    title: string;
    contents: string;
    privatePost: boolean;
  }
) {
  const res = await api.put(
    `/studygroup/discuss/${groupId}/${postId}`,
    payload
  );
  return res.data;
}

// 게시글 삭제
export async function deleteDiscussion(groupId: number, postId: number) {
  const res = await api.delete(`/studygroup/discuss/${groupId}/${postId}`);
  return res.data;
}

// 좋아요
export async function likeDiscussion(
  groupId: number,
  postId: number
): Promise<LikeDiscussionResponse> {
  const res = await api.post(`/studygroup/discuss/${groupId}/${postId}/like`);
  return res.data as LikeDiscussionResponse;
}

// 첨부파일 업로드
export async function uploadDiscussionAttachment(
  groupId: number,
  postId: number,
  formData: FormData
) {
  const res = await api.post(
    `/studygroup/discuss/${groupId}/${postId}/attach`,
    formData
  );
  return res.data;
}

// 검색
export async function searchDiscussion(groupId: number, keyword: string) {
  const res = await api.get(`/studygroup/discuss/${groupId}/search`, {
    params: { keyword },
  });
  return res.data as DiscussionListItem[];
}

// 투표 생성
export async function createVote(
  groupId: number,
  postId: number,
  payload: any
) {
  const res = await api.post(
    `/studygroup/discuss/${groupId}/${postId}/poll`,
    payload
  );
  return res.data;
}

// 투표 조회
export async function getVote(groupId: number, postId: number) {
  const res = await api.get(`/studygroup/discuss/${groupId}/${postId}/poll`);
  return res.data;
}

// 투표 참여
export async function votePoll(
  groupId: number,
  pollId: number,
  optionIds: number[]
) {
  const res = await api.post(`/studygroup/${groupId}/poll/${pollId}/vote`, {
    optionIds,
  });
  return res.data;
}

// 댓글 타입
export interface DiscussionCommentItem {
  comment_id: number;
  author: string;
  contents: string;
  anonymity: boolean;
  like_count: number;
  create_time: string;
}

// 댓글 조회 응답
export interface DiscussionCommentListAPI {
  post_id: number;
  comments: DiscussionCommentItem[];
}

// 댓글 조회
export async function getDiscussionComments(groupId: number, postId: number) {
  const res = await api.get(
    `/studygroup/${groupId}/discuss/${postId}/comments`
  );
  return res.data as DiscussionCommentListAPI;
}

// 댓글 등록
export async function createDiscussionComment(
  groupId: number,
  postId: number,
  payload: {
    contents: string;
  }
) {
  const res = await api.post(
    `/studygroup/${groupId}/discuss/${postId}/comments`,
    {
      ...payload,
      anonymity: false,
    }
  );
  return res.data;
}

// 댓글 수정
export async function updateDiscussionComment(
  groupId: number,
  commentId: number,
  payload: {
    contents: string;
  }
) {
  const res = await api.put(
    `/studygroup/${groupId}/discuss/comment/${commentId}`,
    {
      ...payload,
      anonymity: false,
    }
  );
  return res.data;
}

// 댓글 삭제
export async function deleteDiscussionComment(
  groupId: number,
  commentId: number
) {
  const res = await api.delete(
    `/studygroup/${groupId}/discuss/comment/${commentId}`
  );
  return res.data;
}

// 댓글 좋아요
export async function likeDiscussionComment(
  groupId: number,
  commentId: number
) {
  const res = await api.post(
    `/studygroup/${groupId}/discuss/comment/${commentId}/like`
  );
  return res.data;
}

import { api } from "./axios";
export interface PollOption {
  optionId: number;
  label: string; // "1", "2", ...
  content: string; // 보기 내용
  voteCount: number; // 현재 득표 수
}
export interface CreatePollRequest {
  title: string;
  question: string;
  end_time: string; // ISO 날짜
  is_private: boolean;
  allows_multi: boolean;
  option1: string;
  option2: string;
  option3?: string;
  option4?: string;
}

export interface CreatePollResponse {
  message: string;
  pollId: number;
  postId: number;
  question: string | null;
  options: string[] | null;
  totalVotes: number;
  alreadyVoted: boolean;
  createdAt: string;
  label: number;
}
export interface PollDetailResponse {
  message: string | null;
  pollId: number;
  postId: number;
  question: string;
  options: PollOption[];
  totalVotes: number;
  alreadyVoted: boolean;
  createdAt: string;
  label: number;
}

export interface VotePollRequest {
  label: number;
}

export interface VotePollResponse {
  message: string;
  pollId: number;
  voted?: number;
  optionId?: number;
  votedAt: string;
  label: number;
}
function getBoardPrefix(isDiscuss: boolean): string {
  return isDiscuss ? "/dis_board" : "/qna_board";
}
// ✅ 투표 생성 함수
export async function createPoll(
  postId: number,
  payload: CreatePollRequest,
  isDiscuss: boolean
): Promise<CreatePollResponse> {
  const prefix = getBoardPrefix(isDiscuss);

  const res = await api.post<CreatePollResponse>(
    `${prefix}/${postId}/poll`,
    payload
  );

  return res.data;
}

export async function fetchPoll(
  postId: number,
  isDiscuss: boolean
): Promise<PollDetailResponse> {
  const prefix = getBoardPrefix(isDiscuss);

  const res = await api.get<PollDetailResponse>(`${prefix}/${postId}/poll`);

  return res.data;
}
export async function votePoll(
  postId: number,
  pollId: number,
  label: number,
  isDiscuss: boolean
): Promise<VotePollResponse> {
  const prefix = getBoardPrefix(isDiscuss);

  const body: VotePollRequest = { label };

  const res = await api.post<VotePollResponse>(
    `${prefix}/${postId}/poll/${pollId}/vote`,
    body
  );

  return res.data;
}

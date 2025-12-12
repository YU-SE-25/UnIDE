import { api } from "./axios";

// 리스트 DTO
export interface ProblemListItemDto {
  problemId: number;
  title: string;
  tags: string[];
  difficulty: "EASY" | "MEDIUM" | "HARD";
  viewCount: number;
  createdAt: string;
  createdByNickname: string;
  userStatus: "CORRECT" | "INCORRECT" | "NOT_SOLVED";

  summary: string;
  solverCount: number;
  correctRate: number;
}

// 상세 DTO
export interface ProblemDetailDto {
  problemId: number;
  createdByNickname: string;
  title: string;
  description: string;
  summary: string | null;
  inputOutputExample: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  timeLimit: number;
  memoryLimit: number;
  visibility: "PUBLIC" | "PRIVATE";
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  hint: string;
  source: string;

  totalSubmissions: number;
  acceptedSubmissions: number;
  acceptanceRate: number;

  canEdit: boolean;
  allowedLanguages: string[];
}

// 문제 등록용 DTO
export interface ProblemRegisterPayload {
  title: string;
  description: string;
  inputOutputExample: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  timeLimit: number;
  memoryLimit: number;

  status: "PENDING" | "APPROVED" | "REJECTED";

  tags: string[];
  hint: string;
  source: string;

  testcaseFile: string;
}

// UI에서 사용하는 통합 타입
export interface IProblem {
  problemId: number;
  title: string;
  tags: string[];
  difficulty: string;
  viewCount: number;
  createdAt: string;
  status?: string;

  summary?: string;
  solvedCount?: number;
  successRate?: string;

  userStatus?: "SOLVED" | "ATTEMPTED" | "NOT_SOLVED";

  description?: string;
  inputOutputExample?: string;
  author?: string;
  timeLimit?: number;
  memoryLimit?: number;
  visibility?: "PUBLIC" | "PRIVATE" | undefined;
  hint?: string;
  source?: string;
  canEdit?: boolean;
  allowedLanguages?: string[];
}

// 리스트 DTO → UI 변환
export function mapListDtoToProblem(dto: ProblemListItemDto): IProblem {
  // 백엔드(CORRECT/INCORRECT/NOT_SOLVED) → 프런트(SOLVED/ATTEMPTED/NOT_SOLVED)
  const mappedStatus =
    dto.userStatus === "CORRECT"
      ? "SOLVED"
      : dto.userStatus === "INCORRECT"
      ? "ATTEMPTED"
      : "NOT_SOLVED";

  const successRate =
    dto.correctRate === null ||
    dto.correctRate === undefined ||
    isNaN(dto.correctRate)
      ? "-"
      : Math.round(dto.correctRate * 100) + "%";

  return {
    problemId: dto.problemId,
    title: dto.title,
    tags: dto.tags,
    difficulty: dto.difficulty,
    viewCount: dto.viewCount,
    createdAt: dto.createdAt.slice(0, 10),

    summary: dto.summary,
    solvedCount: dto.solverCount,
    successRate,

    userStatus: mappedStatus,
  };
}

// 상세 DTO → UI 변환
export function mapDetailDtoToProblem(dto: ProblemDetailDto): IProblem {
  return {
    problemId: dto.problemId,
    title: dto.title,
    tags: dto.tags?.map((t) => TAG_LABEL_MAP[t] ?? t),
    difficulty: dto.difficulty,
    viewCount: dto.viewCount,
    createdAt: dto.createdAt.slice(0, 10),

    description: dto.description,
    inputOutputExample: dto.inputOutputExample,
    author: dto.createdByNickname,
    timeLimit: dto.timeLimit,
    memoryLimit: dto.memoryLimit,
    visibility: dto.visibility,
    hint: dto.hint,
    source: dto.source,
    summary: dto.summary ?? undefined,
    solvedCount: dto.acceptedSubmissions,
    successRate: dto.acceptanceRate + "%",

    canEdit: dto.canEdit,
    userStatus: "NOT_SOLVED",
    allowedLanguages: dto.allowedLanguages,
  };
}

// 스터디 그룹 문제 목록 생성 시 사용되는 타입
export interface SimpleProblem {
  problemId: number;
  problemTitle: string;
}

// 태그 label map
export const TAG_LABEL_MAP: Record<string, string> = {
  IMPLEMENTATION: "구현",
  SORTING: "정렬",
  PRIORITY_QUEUE: "우선순위 큐",
  GRAPH: "그래프",
  DFS: "DFS",
  BFS: "BFS",
  DP: "DP",
  GREEDY: "그리디",
  BINARY_SEARCH: "이진탐색",
  TWO_POINTER: "투 포인터",
  SLIDING_WINDOW: "슬라이딩 윈도우",
  STACK: "스택",
  QUEUE: "큐",
  HASH: "해시",
  STRING: "문자열",
  MATH: "수학",
  SIMULATION: "시뮬레이션",
  BRUTE_FORCE: "브루트 포스",
  BACKTRACKING: "백트래킹",
  TREE: "트리",
};

export const TAG_REVERSE_MAP: Record<string, string> = {
  구현: "IMPLEMENTATION",
  기초: "BASIC",
  "이진 탐색": "BINARY_SEARCH",
  탐색: "SEARCH",
  문자열: "STRING",
  "투 포인터": "TWO_POINTER",
  "중심 확장": "CENTER_EXPANSION",
  스택: "STACK",
  시뮬레이션: "SIMULATION",
  자료구조: "DATA_STRUCTURE",
  "다이나믹 프로그래밍": "DP",
  카데인: "KADANE",
  배열: "ARRAY",
  그리디: "GREEDY",
  정렬: "SORTING",
  "우선순위 큐": "PRIORITY_QUEUE",
  그래프: "GRAPH",
  BFS: "BFS",
  DFS: "DFS",
};

//페이지 목록용
interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

// 태그 목록 조회
export async function fetchAvailableTags(): Promise<string[]> {
  try {
    const res = await api.get("/problems/tags");

    if (!Array.isArray(res.data)) return [];

    return res.data.filter((t: any) => typeof t === "string");
  } catch (err) {
    console.error(err);
    return [];
  }
}

// 문제 목록 조회
export async function fetchProblems(): Promise<IProblem[]> {
  const res = await api.get<PageResponse<ProblemListItemDto>>(
    "/problems/list?page=0&size=2000"
  );

  return res.data.content.map(mapListDtoToProblem);
}

// 문제 상세 조회 (풀이 화면용)
export async function fetchProblemDetail(problemId: number): Promise<IProblem> {
  const res = await api.get<ProblemDetailDto>(`/problems/detail/${problemId}`);
  return mapDetailDtoToProblem(res.data);
}

// 스터디 그룹용 Simple 문제 목록
export async function fetchSimpleProblems(): Promise<SimpleProblem[]> {
  const res = await api.get<{
    content: { problemId: number; title: string }[];
  }>("/problems/list");

  return res.data.content.map((p) => ({
    problemId: p.problemId,
    problemTitle: p.title,
  }));
}

/* -----------------------------
   문제 수정/등록용 API들
------------------------------ */

export interface ProblemEditDetail {
  problemId: number;
  title: string;
  summary: string;
  description: string;
  inputOutputExample: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  timeLimit: number;
  memoryLimit: number;
  status: string;
  tags: string[];
  hint?: string;
  source?: string;
  testcaseFile?: string;
}

interface ProblemCreateResponse {
  message: string;
  problemId: number;
  timestamp: string;
}

// 문제 상세 조회 (수정 페이지용)
export async function fetchProblemDetailForEdit(
  problemId: number
): Promise<ProblemEditDetail> {
  const res = await api.get<ProblemEditDetail>(`/problems/detail/${problemId}`);
  return res.data;
}

// 문제 수정
export async function updateProblem(
  problemId: number,
  formData: FormData
): Promise<number> {
  const res = await api.patch<ProblemCreateResponse>(
    `/problems/${problemId}`,
    formData
  );
  return res.data.problemId;
}

// 문제 등록
export async function registerProblem(formData: FormData): Promise<number> {
  const res = await api.post<ProblemCreateResponse>(
    "/problems/register",
    formData
  );
  return res.data.problemId;
}

//문제 삭제

// 문제 삭제 API
export interface ProblemDeleteResponse {
  message: string;
}

export async function deleteProblem(
  problemId: number
): Promise<ProblemDeleteResponse> {
  const res = await api.delete<ProblemDeleteResponse>(`/problems/${problemId}`);
  return res.data;
}

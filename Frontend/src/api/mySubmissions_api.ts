import { api } from "./axios";

export type SubmissionStatus =
  | "PENDING"
  | "GRADING"
  | "CA"
  | "WA"
  | "CE"
  | "RE"
  | "TLE"
  | "MLE"
  | "DRAFT";
export type SubmissionLanguage = "JAVA" | "PYTHON" | "C" | "CPP" | "JAVASCRIPT";

export interface SubmissionListResponse {
  totalPages: number;
  totalElements: number;
  currentPage: number;
  submissions: Submission[];
}

export type SubmissionDto = {
  submissionId: number;
  problemId: number;
  problemTitle: string;
  status: SubmissionStatus; // ✅ 여기 반영
  language: SubmissionLanguage;
  runtime: number;
  memory: number;
  submittedAt: string;
};

export type SubmissionPageDto = {
  totalPages: number;
  totalElements: number;
  currentPage: number;
  submissions: SubmissionDto[];
};
export type Submission = {
  submissionId: number;
  problemId: number;
  problemTitle: string;
  status: SubmissionStatus; // ✅ 여기 반영
  language: SubmissionLanguage;
  runtime: number;
  memory: number;
  submittedAt: string;
};

export type SubmissionPage = {
  totalPages: number;
  totalElements: number;
  currentPage: number;
  items: Submission[];
};

// 상세 조회 DTO (백엔드 응답 그대로)
export type SubmissionDetailDto = {
  submissionId: number;
  problemId: number;
  problemTitle: string;
  code: string;
  language: SubmissionLanguage;
  status: SubmissionStatus;
  runtime: number;
  memory: number;
  submittedAt: string; // ISO datetime
  records: SubmissionRecord[];
  shared: boolean; // Swagger 기준 key
};

// 프론트에서 쓸 모델 (필요하면 더 가공 가능)
export type SubmissionRecord = {
  testCaseIndex: number;
  status: SubmissionStatus;
  runtime: number;
  memory: number;
};

export type SubmissionDetail = {
  submissionId: number;
  problemId: number;
  problemTitle: string;
  code: string;
  language: SubmissionLanguage;
  status: SubmissionStatus;
  runtime: number;
  memory: number;
  submittedAt: string; // ISO datetime
  records: SubmissionRecord[];
  shared: boolean; // ✅ Swagger 기준 key는 isShared가 아니라 shared
};
export type UpdateShareRequest = {
  isShared: boolean;
};

export type UpdateShareResponse = {
  message: string;
};
export function mapSubmissionDto(dto: SubmissionDto): Submission {
  return {
    submissionId: dto.submissionId,
    problemId: dto.problemId,
    problemTitle: dto.problemTitle,
    status: dto.status,
    language: dto.language,
    runtime: dto.runtime,
    memory: dto.memory,
    submittedAt: dto.submittedAt,
  };
}

export function mapSubmissionDetailDto(
  dto: SubmissionDetailDto
): SubmissionDetail {
  return {
    submissionId: dto.submissionId,
    problemId: dto.problemId,
    problemTitle: dto.problemTitle,
    code: dto.code,
    language: dto.language,
    status: dto.status,
    runtime: dto.runtime,
    memory: dto.memory,
    submittedAt: dto.submittedAt,
    records: dto.records,
    shared: dto.shared,
  };
}

export function mapSubmissionPageDto(dto: SubmissionPageDto): SubmissionPage {
  return {
    totalPages: dto.totalPages,
    totalElements: dto.totalElements,
    currentPage: dto.currentPage,
    items: dto.submissions.map(mapSubmissionDto),
  };
}
// 내 제출 목록 조회
export async function fetchMySubmissions(options?: {
  problemId?: number;
  page?: number;
  size?: number;
  sort?: string;
}): Promise<SubmissionPage> {
  const { problemId, page = 0, size = 20, sort } = options ?? {};

  const params: Record<string, any> = { page, size };
  if (problemId != null) params.problemId = problemId;
  if (sort) params.sort = sort;

  const res = await api.get<SubmissionPageDto>("/submissions", { params });
  return mapSubmissionPageDto(res.data);
}
// 내 제출 상세 조회
export async function fetchSubmissionDetail(
  submissionId: number
): Promise<SubmissionDetail> {
  const res = await api.get<SubmissionDetailDto>(
    `/submissions/${submissionId}/details`
  );
  return mapSubmissionDetailDto(res.data);
}
// 🔹 PATCH /api/submissions/{submissionId}/share
export async function updateSubmissionShare(
  submissionId: number,
  isShared: boolean
): Promise<UpdateShareResponse> {
  const body: UpdateShareRequest = { isShared };
  const res = await api.patch<UpdateShareResponse>(
    `/submissions/${submissionId}/share`,
    body
  );
  return res.data;
}

// src/api/manage_api.ts
import { api } from "./axios";

export interface ProblemListItem {
  problemId: number;
  title: string;
  tags: string[];
  difficulty: "EASY" | "MEDIUM" | "HARD";
  viewCount: number;
  createdAt: string;
  isSolved: boolean;
  createdByNickname: string;
}

export interface SortInfo {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface PageableInfo {
  pageSize: number;
  pageNumber: number;
  paged: boolean;
  unpaged: boolean;
  offset: number;
  sort: SortInfo;
}

export interface ProblemListResponse {
  totalElements: number;
  totalPages: number;
  numberOfElements: number;
  pageable: PageableInfo;
  first: boolean;
  last: boolean;
  size: number;
  content: ProblemListItem[];
  number: number;
  sort: SortInfo;
  empty: boolean;
}

export type Role = "LEARNER" | "INSTRUCTOR" | "MANAGER";

export interface UpdateUserRoleRequest {
  newRole: Role;
}

export interface UpdateUserRoleResponse {
  userId: number;
  oldRole: Role;
  newRole: Role;
  message: string;
}

export interface MessageResponseDto {
  message: string;
}
export async function fetchPendingProblemList(params: {
  title?: string;
  difficulty?: string;
  page?: number;
  size?: number;
  sort?: string;
}) {
  const res = await api.get<ProblemListResponse>("/problems/list/pending", {
    params,
  });
  return res.data;
}

export async function approveProblem(
  problemId: number
): Promise<MessageResponseDto> {
  const res = await api.put<MessageResponseDto>(
    `/problems/${problemId}/approve`
  );
  return res.data;
}

export async function fetchMyProblems(
  page = 0,
  size = 100,
  sort = "createdAt,desc"
) {
  const res = await api.get("/problems/list/me", {
    params: {
      page,
      size,
      sort,
    },
  });
  return res.data;
}
export interface InstructorApplicationDto {
  applicationId: number;
  name: string;
  email: string;
  submittedAt: string; // ISO String
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export interface InstructorApplicationPageResponse {
  totalCount: number;
  currentPage: number;
  pageSize: number;
  applications: InstructorApplicationDto[];
}

export interface PageableRequest {
  page: number;
  size: number;
  sort?: string; // 예: "submittedAt,desc"
}
export interface InstructorApplicationDetail {
  applicationId: number;
  userId: number;
  name: string;
  email: string;
  phone: string;
  submittedAt: string; // ISO string
  status: "PENDING" | "APPROVED" | "REJECTED";
  portfolioFileUrl: string | null;
  portfolioLinks: string | null;
  rejectionReason: string | null;
  processedAt: string | null;
  processorId: number | null;
  processorName: string | null;
}
// 문제 반려
export async function rejectProblem(
  problemId: number
): Promise<MessageResponseDto> {
  const res = await api.put<MessageResponseDto>(
    `/problems/${problemId}/reject`
  );
  return res.data;
}

export async function fetchInstructorApplicationDetail(
  applicationId: number
): Promise<InstructorApplicationDetail> {
  const res = await api.get<InstructorApplicationDetail>(
    `/admin/instructor/applications/${applicationId}`
  );
  return res.data;
}
export async function fetchInstructorApplications(
  pageable: PageableRequest
): Promise<InstructorApplicationPageResponse> {
  const res = await api.get<InstructorApplicationPageResponse>(
    "/admin/instructor/applications",
    {
      params: {
        page: pageable.page,
        size: pageable.size,
      },
    }
  );

  return res.data;
}

export async function fetchUserList() {
  const res = await api.get("/admin/users");
  return res.data;
}

export async function updateUserRole(
  userId: number,
  newRole: Role
): Promise<UpdateUserRoleResponse> {
  const body: UpdateUserRoleRequest = { newRole };

  const res = await api.patch<UpdateUserRoleResponse>(
    `/admin/users/${userId}/role`,
    body
  );
  return res.data;
}

export interface CreateBlacklistRequest {
  email: string;
  phone: string;
  name: string;
  reason: string;
}

export interface CreateBlacklistResponse {
  blacklistId: number;
  message: string;
  bannedAt: string;
}

export interface BlacklistItem {
  blacklistId: number;
  name: string;
  email: string;
  phone: string;
  reason: string;
  bannedAt: string;
}

export interface FetchBlacklistResponse {
  totalElements: number;
  totalPages: number;
  currentPage: number;
  blacklist: BlacklistItem[];
}

// POST /api/admin/blacklist
export async function addToBlacklist(
  payload: CreateBlacklistRequest
): Promise<CreateBlacklistResponse> {
  const res = await api.post<CreateBlacklistResponse>(
    "/admin/blacklist",
    payload
  );
  return res.data;
}
export async function fetchBlacklist(params: {
  page: number;
  size: number;
  sort?: string[];
}): Promise<FetchBlacklistResponse> {
  const res = await api.get<FetchBlacklistResponse>("/admin/blacklist", {
    params,
  });
  return res.data;
}

export interface AdminReportDetailDto {
  id: number;
  reporterName: string;
  targetName: string;
  type: string;
  reason: string;
  status: string;
  reportedAt: string;
  resolvedAt: string | null;
}

export interface AdminReportDto {
  id: number;
  reporterName: string;
  targetName: string;
  reason: string;
  type: string;
  status: string;
  reportedAt: string;
}

export interface ResolveReportRequest {
  status: string; // "APPROVED" | "REJECTED" | etc
  adminAction: string; // 예: "블랙리스트 등록", "경고"
  adminReason: string; // 사유
}

export interface ResolveReportResponse {
  message: string; // 백엔드가 주는 메시지
}

export async function fetchAdminReports(): Promise<AdminReportDto[]> {
  const res = await api.get<AdminReportDto[]>("reports");
  return res.data;
}
export async function fetchAdminReportDetail(
  reportId: number
): Promise<AdminReportDetailDto> {
  const res = await api.get<AdminReportDetailDto>(`reports/${reportId}`);
  return res.data;
}
export async function resolveReport(
  reportId: number,
  payload: ResolveReportRequest
): Promise<ResolveReportResponse> {
  const res = await api.patch<ResolveReportResponse>(
    `reports/${reportId}/resolve`,
    payload
  );
  return res.data;
}

//블랙리스트 해제
export async function removeFromBlacklist(
  blacklistId: number
): Promise<MessageResponseDto> {
  const res = await api.delete<MessageResponseDto>(
    `/admin/blacklist/${blacklistId}`
  );
  return res.data;
}

//강사 포토폴리오 다운로드
export async function downloadPortfolioFile(fileKey: string): Promise<Blob> {
  const res = await api.get(`/admin/instructor/download/portfolio/${fileKey}`, {
    responseType: "blob",
  });
  return res.data;
}

//강사 이메일 발송
export async function sendApproveInstructorEmail(userId: number) {
  const res = await api.post("/admin/approve-instructor-email", {
    userId,
  });
  return res.data;
}

//테스트케이스 다운로드
export const downloadTestcaseFile = (id: number) =>
  api.get(`/problems/${id}/testcase/download`, {
    responseType: "blob",
  });

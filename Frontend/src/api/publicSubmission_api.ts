import { api } from "./axios";
import type { SubmissionLanguage, SubmissionStatus } from "./mySubmissions_api";
export type SharedSolutionDto = {
  submissionId: number;
  userId: number;
  nickname: string;
  language: SubmissionLanguage;
  status: SubmissionStatus;
  runtime: number | null;
  memory: number | null;
  efficiencyRank: number;
  efficiencyScore: number;
  submittedAt: string; // ISO datetime
  totalVotes: number;
};

export type SharedSolutionPageDto = {
  currentPage: number;
  solutions: SharedSolutionDto[];
  totalElements: number;
  totalPages: number;
};

export type SharedSolution = SharedSolutionDto;

export type SharedSolutionPage = {
  currentPage: number;
  items: SharedSolution[];
  totalElements: number;
  totalPages: number;
};

export function mapSharedSolutionPageDto(
  dto: SharedSolutionPageDto
): SharedSolutionPage {
  return {
    currentPage: dto.currentPage,
    totalElements: dto.totalElements,
    totalPages: dto.totalPages,
    items: dto.solutions,
  };
}

export async function fetchSharedSolutionsByProblem(
  problemId: number,
  options?: {
    page?: number;
    size?: number;
    sort?: string;
  }
): Promise<SharedSolutionPage> {
  const { page = 0, size, sort } = options ?? {};

  const params: Record<string, any> = { page };
  if (size != null) params.size = size;
  if (sort) params.sort = sort;

  const res = await api.get<SharedSolutionPageDto>(
    `/submissions/${problemId}/solutions`,
    { params }
  );

  return mapSharedSolutionPageDto(res.data);
}

import type { SubmissionStatus } from "./mySubmissions_api";
import { api } from "./axios";

// 코드 실행 API 응답 타입: /api/code/run
export interface ICodeRunResult {
  output: string;
  compileError: string | null;
  compileTimeMs: number;
}

// 코드 임시 저장 API 요청/응답 타입: /api/submissions/draft
export interface ICodeDraftRequest {
  problemId: number;
  code: string;
  language: string;
}
export interface ICodeDraftLoadResult {
  code: string;
  language: string;
}

// 코드 제출 API 요청/응답 타입: /api/submissions
export interface ICodeSubmitRequest {
  problemId: number;
  code: string;
  language: string;
}
export interface ICodeSubmitResult {
  submissionId: number;
  status: SubmissionStatus; // "PENDING" | "GRADING" | "WA" | ...
  runtime: number | null;
  memory: number | null;
  passedTestCases: number | null;
  totalTestCases: number | null;
  compileOutput: string | null;
  message: string | null;
}

// 제출 상태 및 결과 조회 API 응답 타입: /api/submissions/{submissionId}/status
export interface ISubmissionStatusResult {
  status: SubmissionStatus;
  currentTestCase?: number;
  totalTestCases: number;

  // 채점 완료 시 추가
  runtime?: number;
  memory?: number;
  passedTestCases?: number;
  failedTestCase?: number;
}

/* --------------------------
    실제 백엔드 연동 API
--------------------------- */

// 1) 코드 실행
export async function runCode(req: {
  code: string;
  language: string;
  input: string;
}): Promise<ICodeRunResult> {
  const res = await api.post<ICodeRunResult>("/code/run", req);
  return res.data;
}

// 2) 임시 저장
export async function saveDraft(
  req: ICodeDraftRequest
): Promise<{ message: string; draftSubmissionId: number }> {
  const res = await api.patch<{ message: string; draftSubmissionId: number }>(
    "/submissions/draft",
    req
  );
  return res.data;
}

// 3) 임시 저장 불러오기
export async function loadDraft(
  problemId: number
): Promise<ICodeDraftLoadResult> {
  const res = await api.get<ICodeDraftLoadResult>(
    `/submissions/draft?problemId=${problemId}`
  );
  return res.data;
}

// 4) 제출하기
export async function submitCode(
  req: ICodeSubmitRequest
): Promise<ICodeSubmitResult> {
  const res = await api.post<ICodeSubmitResult>("/submissions", req);
  return res.data;
}

// 5) 제출 상태 조회 (채점 상태 폴링)
export async function getSubmissionStatus(
  req: ICodeSubmitRequest
): Promise<ICodeSubmitResult> {
  const res = await api.post(`/submissions`, req);
  return res.data;
}

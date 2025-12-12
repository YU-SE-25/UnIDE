import { api } from "./axios";
import type { RefreshResponse } from "../atoms";

// 회원가입 요청 타입
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  nickname: string;
  phone: string;
  role: "LEARNER" | "INSTRUCTOR" | "MANAGER";
  agreedTerms: string[];
  portfolioFileUrl: string | null;
  originalFileName: string | null;
  fileSize: number | null;
  portfolioLinks: string[];
}

//비밀번호 타입
export interface SendResetCodeResponse {
  message: string;
}

export interface VerifyResetCodeResponse {
  resetToken: string;
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
}

// Auth 관련 모든 요청을 한 곳에서 관리
export const AuthAPI = {
  // 0. 블랙리스트 체크
  checkBlacklist: (name: string, email: string, phone: string) =>
    api.post<{ blacklisted: boolean; message: string }>(
      "/auth/check/blacklist",
      { name, email, phone }
    ),

  // 1. 이메일 중복 확인
  checkEmail: (email: string) =>
    api.post<{ available: boolean; message: string }>("/auth/check/email", {
      email,
    }),

  // 2. 닉네임 중복 확인
  checkNickname: (nickname: string) =>
    api.post<{ available: boolean; message: string }>("/auth/check/nickname", {
      nickname,
    }),

  // 3. 전화번호 중복 확인
  checkPhone: (phone: string) =>
    api.post<{ available: boolean; message: string }>("/auth/check/phone", {
      phone,
    }),

  /*
  // 4. 동일 인물 계정 확인
  checkDuplicateAccount: (name: string, phone: string) =>
    api.post<{ duplicate: boolean; message: string }>(
      "/auth/check/duplicate-account",
      { name, phoneNumber: phone }
    ),
*/

  // 5. 회원가입 요청
  register: (data: RegisterRequest) => api.post("/auth/register", data),

  // 6. 이메일 인증 링크 발송
  sendEmailVerify: (email: string) =>
    api.post("/auth/email/send-link", { email }),

  // 7. 환영 이메일 발송
  sendWelcomeEmail: (email: string) =>
    api.post("/auth/email/send-welcome", { email }),

  // 토큰 재발급
  refresh: async (refreshToken: string): Promise<RefreshResponse> => {
    return api
      .post<RefreshResponse>("/auth/refresh", { refreshToken })
      .then((res) => res.data);
  },

  // 비밀번호 재설정 관련

  // 1) 이메일로 인증번호 발송
  sendResetCode: async (email: string): Promise<SendResetCodeResponse> => {
    const res = await api.post<SendResetCodeResponse>(
      "/auth/password/send-reset-code",
      { email }
    );
    return res.data;
  },

  // 2) 인증번호 검증 → resetToken 반환
  verifyResetCode: async (
    email: string,
    code: string
  ): Promise<VerifyResetCodeResponse> => {
    const res = await api.post<VerifyResetCodeResponse>(
      "/auth/password/verify-reset-code",
      { email, code }
    );
    return res.data;
  },

  // 3) 최종 비밀번호 재설정
  resetPassword: async (
    token: string,
    pw: string,
    pwConfirm: string
  ): Promise<ResetPasswordResponse> => {
    const res = await api.put<ResetPasswordResponse>("/auth/password/reset", {
      resetToken: token,
      newPassword: pw,
      newPasswordConfirm: pwConfirm,
    });
    return res.data;
  },
};

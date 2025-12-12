import axios from "axios";
import { getDefaultStore } from "jotai";
import { refreshTokenAtom, refreshActionAtom } from "../atoms";
import { AuthAPI } from "../api/auth_api";

const store = getDefaultStore();

export const api = axios.create({
  baseURL: "/api",
});

//요청 인터셉터 (AccessToken 붙이기)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // 로컬스토리지에서 읽음
    if (token) {
      config.headers = config.headers ?? {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 (AccessToken 만료 → 자동 재발급)
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // 로그인/리프레시 요청 자체는 제외
    if (original?.url === "/auth/login") return Promise.reject(error);
    if (original?.url === "/auth/refresh") return Promise.reject(error);

    // AccessToken 만료 → refresh 시도
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      const refreshToken = store.get(refreshTokenAtom);
      if (!localStorage.getItem("refreshToken")) {
        if (error.response?.status === 401) {
          forceLogout();
          return;
        }
        return Promise.reject(error);
      }

      if (!refreshToken) {
        forceLogout();
        return;
      }

      try {
        const refreshResponse = await AuthAPI.refresh(refreshToken);

        // jotai state + localStorage 갱신
        store.set(refreshActionAtom, refreshResponse);
        localStorage.setItem("accessToken", refreshResponse.accessToken);

        // 원래 요청 재시도
        return api({
          ...original,
          headers: {
            ...original.headers,
            Authorization: `Bearer ${refreshResponse.accessToken}`,
          },
        });
      } catch (e) {
        // refresh 실패 → 완전 강제 로그아웃
        forceLogout();
        return;
      }
    }

    return Promise.reject(error);
  }
);

// 로그아웃 함수
function forceLogout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userProfile");

  // jotai 초기화
  store.set(refreshActionAtom, null);
  store.set(refreshTokenAtom, null);

  window.location.href = "/login";
}

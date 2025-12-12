//상태 저장 + 로그인 유지 + 토큰 갱신 정보 관리
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const getInitialIsDark = () => {
  if (typeof window === "undefined") return false;
  const saved = localStorage.getItem("theme:isDark");
  if (saved === "true") return true;
  if (saved === "false") return false;
  return false;
};

export const isDarkAtom = atom<boolean>(getInitialIsDark());

// 🔥 여기 다시 추가해야 함!!
export const toggleThemeActionAtom = atom(null, (_, set) => {
  set(isDarkAtom, (prev) => !prev);
});

// 사용자 프로필 정보
export interface UserProfile {
  userId: number;
  nickname: string;
  role: "MANAGER" | "INSTRUCTOR" | "LEARNER";
}

// 로그인 응답
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserProfile;
}

// refresh 응답
export interface RefreshResponse {
  accessToken: string;
  expiresIn: number;
}

// 🔥 JSON.stringify 되지 않는 custom storage
const stringStorage = {
  getItem: (key: string) => {
    if (typeof localStorage === "undefined") return null;
    const value = localStorage.getItem(key);
    return value ?? null; // 그대로 반환
  },
  setItem: (key: string, value: string | null) => {
    if (typeof localStorage === "undefined") return;
    if (value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, value); // string 그대로 저장
    }
  },
  removeItem: (key: string) => {
    if (typeof localStorage === "undefined") return;
    localStorage.removeItem(key);
  },
};

// ----------------------
// 🔥 여기에 customStorage를 적용하면
// localStorage에 "토큰" 형태로 저장되는 문제 완전히 해결됨
// ----------------------

export const accessTokenAtom = atomWithStorage<string | null>(
  "accessToken",
  null,
  stringStorage
);

export const accessTokenExpiresInAtom = atom<number | null>(null);

export const refreshTokenAtom = atomWithStorage<string | null>(
  "refreshToken",
  null,
  stringStorage
);

export const userProfileAtom = atomWithStorage<UserProfile | null>(
  "userProfile",
  null
);

// 로그인 여부
export const isLoggedInAtom = atom((get) => {
  return !!get(accessTokenAtom) && !!get(userProfileAtom);
});

// 로그인 액션
export const loginActionAtom = atom(null, (_, set, data: LoginResponse) => {
  set(accessTokenAtom, data.accessToken);
  set(refreshTokenAtom, data.refreshToken);
  set(accessTokenExpiresInAtom, data.expiresIn);
  set(userProfileAtom, data.user);
});

// 로그아웃
export const logoutActionAtom = atom(null, (_, set) => {
  set(accessTokenAtom, null);
  set(refreshTokenAtom, null);
  set(accessTokenExpiresInAtom, null);
  set(userProfileAtom, null);
});

// refresh
export const refreshActionAtom = atom(
  null,
  (_, set, data: RefreshResponse | null) => {
    if (!data) return;

    set(accessTokenAtom, data.accessToken);
    set(accessTokenExpiresInAtom, data.expiresIn);
  }
);

// **********************************************
isDarkAtom.debugLabel = "Is Dark Mode";
toggleThemeActionAtom.debugLabel = "Toggle Theme Action";

accessTokenAtom.debugLabel = "Access Token";
refreshTokenAtom.debugLabel = "Refresh Token";
accessTokenExpiresInAtom.debugLabel = "Access Token ExpiresIn";

userProfileAtom.debugLabel = "User Profile";
isLoggedInAtom.debugLabel = "Is Logged In";

loginActionAtom.debugLabel = "Login Action";
logoutActionAtom.debugLabel = "Logout Action";
refreshActionAtom.debugLabel = "Refresh Action";

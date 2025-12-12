import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetAtom } from "jotai";
import { loginActionAtom } from "../atoms";
import type { LoginResponse } from "../atoms";

export default function OAuthCallback() {
  const nav = useNavigate();
  const runLoginAction = useSetAtom(loginActionAtom);
  const didRun = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    const params = new URLSearchParams(window.location.search);

    // 쿼리에서 가져온 토큰 값
    const rawAccessToken = params.get("accessToken") ?? "";
    const rawRefreshToken = params.get("refreshToken") ?? "";

    // 양쪽 따옴표 제거
    const accessToken = rawAccessToken.replace(/"/g, "");
    const refreshToken = rawRefreshToken.replace(/"/g, "");

    const nickname = params.get("nickname") ?? "";
    const role =
      (params.get("role") as "MANAGER" | "INSTRUCTOR" | "LEARNER") ?? "LEARNER";
    const userId = Number(params.get("userId")) || 0;

    if (!accessToken || !refreshToken || !userId) {
      setError("로그인 정보를 확인할 수 없습니다.");
      return;
    }

    const loginData: LoginResponse = {
      accessToken,
      refreshToken,
      expiresIn: 3600,
      user: { userId, nickname, role },
    };

    runLoginAction(loginData);
    nav("/", { replace: true });
  }, [nav, runLoginAction]);

  if (error) return <div>{error}</div>;
  return <div>로그인 처리 중...</div>;
}

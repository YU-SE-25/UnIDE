import { Outlet } from "react-router-dom";
//import { DevTools } from "jotai-devtools";
import Topbar, { TOPBAR_HEIGHT } from "./components/Topbar";
import styled, { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./theme/theme";

import { useEffect } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { isDarkAtom, refreshTokenAtom, refreshActionAtom } from "./atoms";
import {
  userProfileAtom,
  type RefreshResponse,
  // type UserProfile,
} from "./atoms";
import { api } from "./api/axios";

const Container = styled.div`
  margin-top: ${TOPBAR_HEIGHT}px;
  min-height: calc(100vh - ${TOPBAR_HEIGHT}px);
  width: 100%;
  background-color: ${(props) => props.theme.bgColor} !important;
`;

export default function App() {
  const isDark = useAtomValue(isDarkAtom);
  const storedRefreshToken = useAtomValue(refreshTokenAtom);
  const runRefreshAction = useSetAtom(refreshActionAtom);
  const setUserProfile = useSetAtom(userProfileAtom);

  const [, setIsDark] = useAtom(isDarkAtom);

  // 테마 변경시 로컬스토리지에 저장된 테마 읽기
  useEffect(() => {
    const saved = localStorage.getItem("theme:isDark");

    if (saved === "true") {
      setIsDark(true);
    } else if (saved === "false") {
      setIsDark(false);
    }
    // 그 외 (null, "undefined", 기타 이상한 값) → 무시
  }, [setIsDark]);

  // 테마 변경 시 로컬스토리지에 저장
  useEffect(() => {
    localStorage.setItem("theme:isDark", JSON.stringify(isDark));
  }, [isDark]);

  // 앱 시작 시 refreshToken 있으면 accessToken + userProfile 복구
  useEffect(() => {
    if (!storedRefreshToken) return;

    const restoreSession = async () => {
      try {
        const refreshRes = await api.post<RefreshResponse>("/auth/refresh", {
          refreshToken: storedRefreshToken,
        });
        runRefreshAction(refreshRes.data);

        //userProfile 재조회
        //const meRes = await api.get<UserProfile>("/api/mypage");
        //setUserProfile(meRes.data);
      } catch (err) {
        console.error("세션 복구 실패:", err);
      }
    };

    restoreSession();
  }, [storedRefreshToken, runRefreshAction, setUserProfile]);

  return (
    <>
      {/* 디버그 코드!!!!*/}
      {/* <DevTools /> */}

      {/* 테마설정 */}
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <Topbar />
        <Container>
          <Outlet />
        </Container>
      </ThemeProvider>
    </>
  );
}

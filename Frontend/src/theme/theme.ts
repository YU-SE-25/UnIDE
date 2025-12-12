import type { DefaultTheme } from "styled-components";

//전역 색상 테마 정의
/***************  추가해야할 색상 ***************
 *
 "WA" | "TLE" | "MLE" | "RE" 각각의 색상, AC는 로고색상과 동일
로고 2번째 색상 추가해두면 좋을듯

**************************************************/
export const darkTheme: DefaultTheme = {
  mode: "dark",
  bgColor: "#191919",
  textColor: "#fefefe",
  focusColor: "#ffcb6b",
  logoColor: "#4ade80",
  headerBgColor: "#000000",
  authHoverBgColor: "#333333",
  authHoverTextColor: "#fefefe",
  authActiveBgColor: "#555555",
  bgCardColor: "#242424",
  cardColor: "#f0f0f0",
  muteColor: "#6B7280",
};

export const lightTheme: DefaultTheme = {
  mode: "light",
  textColor: "#191919",
  bgColor: "#fefefe",
  focusColor: "#ffcb6b",
  logoColor: "#4ade80",
  headerBgColor: "#ffffff",
  authHoverBgColor: "#c4c4c4",
  authHoverTextColor: "#fefefe",
  authActiveBgColor: "#555555",
  bgCardColor: "#f7f7f7",
  cardColor: "#1e1e1e",
  muteColor: "#9ca3af",
};

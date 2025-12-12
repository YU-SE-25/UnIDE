import "styled-components";
declare module "styled-components" {
  export interface DefaultTheme {
    mode: "light" | "dark";
    bgColor: string;
    textColor: string;
    focusColor: string;
    logoColor: string;
    headerBgColor: string;
    authHoverBgColor: string;
    authHoverTextColor: string;
    authActiveBgColor: string;
    bgCardColor: string;
    cardColor: string;
    muteColor: string;
  }
}

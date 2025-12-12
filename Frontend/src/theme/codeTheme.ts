import {
  atomDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

// 다크 테마 커스텀
export const atomDarkForIDE = {
  ...atomDark,
  'code[class*="language-"]': {
    ...(atomDark['code[class*="language-"]'] || {}),
    background: "transparent",
  },
  'pre[class*="language-"]': {
    ...(atomDark['pre[class*="language-"]'] || {}),
    background: "transparent",
    margin: 0,
    padding: 0,
  },
};

// 라이트 테마 커스텀
export const oneLightForIDE = {
  ...oneLight,
  'code[class*="language-"]': {
    ...(oneLight['code[class*="language-"]'] || {}),
    background: "transparent",
  },
  'pre[class*="language-"]': {
    ...(oneLight['pre[class*="language-"]'] || {}),
    background: "transparent",
    margin: 0,
    padding: 0,
  },
};

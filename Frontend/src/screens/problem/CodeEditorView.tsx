import { useState } from "react";
import Editor, { type Monaco } from "@monaco-editor/react";
import { useAtom } from "jotai";
import { isDarkAtom } from "../../atoms";

import type { IProblem } from "../../api/problem_api";

import {
  ViewContentWrapper,
  LanguageDisplay,
  LanguageSelect,
  LanguageSelectWrapper,
  FontSizeSelect,
  EditorWrapper,
  ActionRow,
  ActionButton,
} from "../../theme/ProblemSolve.Style";

import styled from "styled-components";

//실행 결과 UI용 박스 스타일
const OutputBox = styled.pre`
  width: 100%;
  max-width: 100%;
  overflow-x: auto; // 길어질 때 가로 스크롤 허용
  white-space: pre-wrap;
  word-break: break-word; // 너무 긴 단어가 있어도 줄바꿈
  min-height: 120px;
  margin-top: 14px;
  padding: 14px;
  background: ${(p) => p.theme.bgColor};
  color: ${(p) => p.theme.textColor};
  border: 1px solid ${(p) => p.theme.textColor}33;
  border-radius: 10px;
  font-size: 14px;
`;

interface IDEProblem extends Partial<IProblem> {
  allowedLanguages?: string[];
}

interface CodeEditorViewProps {
  problem?: IDEProblem;
  code: string;
  onCodeChange: (value: string) => void;
  onSaveTemp: () => void;
  onLoadTemp: () => void;
  onSubmit: () => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  isSubmitting?: boolean;
  hideSubmit?: boolean;

  // IDE 실행 기능
  onExecute?: () => Promise<string>;
}

const JAVA_LANG_ID = "java-simple";
const CPP_LANG_ID = "cpp-simple";
const PY_LANG_ID = "python-simple";

//언어 토큰 규칙 등록
const setupLanguages = (monaco: Monaco) => {
  const already = monaco.languages.getLanguages().map((l) => l.id);

  if (!already.includes(JAVA_LANG_ID)) {
    monaco.languages.register({ id: JAVA_LANG_ID });
    monaco.languages.setMonarchTokensProvider(JAVA_LANG_ID, {
      tokenizer: {
        root: [
          [
            /\b(class|public|private|protected|static|void|int|long|double|float|boolean|if|else|for|while|return|new|try|catch|finally|import|package|extends|implements|this|super)\b/,
            "keyword",
          ],
          [/\/\/.*$/, "comment"],
          [/\/\*.*\*\//, "comment"],
          [/".*?"/, "string"],
          [/'.*?'/, "string"],
          [/\b\d+(\.\d+)?\b/, "number"],
        ],
      },
    });
  }

  if (!already.includes(CPP_LANG_ID)) {
    monaco.languages.register({ id: CPP_LANG_ID });
    monaco.languages.setMonarchTokensProvider(CPP_LANG_ID, {
      tokenizer: {
        root: [
          [
            /\b(int|long|double|float|char|void|bool|if|else|for|while|return|class|struct|namespace|using|std|include|new|delete|public|private|protected)\b/,
            "keyword",
          ],
          [/\/\/.*$/, "comment"],
          [/\/\*.*\*\//, "comment"],
          [/".*?"/, "string"],
          [/'.*?'/, "string"],
          [/\b\d+(\.\d+)?\b/, "number"],
        ],
      },
    });
  }

  if (!already.includes(PY_LANG_ID)) {
    monaco.languages.register({ id: PY_LANG_ID });
    monaco.languages.setMonarchTokensProvider(PY_LANG_ID, {
      tokenizer: {
        root: [
          [
            /\b(def|class|return|if|elif|else|for|while|import|from|as|try|except|finally|with|lambda|yield|pass|break|continue|True|False|None)\b/,
            "keyword",
          ],
          [/#.*$/, "comment"],
          [/""".*?"""/, "string"],
          [/'''.*?'''/, "string"],
          [/".*?"/, "string"],
          [/'.*?'/, "string"],
          [/\b\d+(\.\d+)?\b/, "number"],
        ],
      },
    });
  }
};

export default function CodeEditorView({
  problem,
  code,
  onCodeChange,
  onSaveTemp,
  onLoadTemp,
  onSubmit,
  onExecute,
  language,
  onLanguageChange,
  hideSubmit,
}: CodeEditorViewProps) {
  const [isDark] = useAtom(isDarkAtom);

  const [fontSize, setFontSize] = useState(20);

  const [selectedLanguage, setSelectedLanguage] = useState(
    language || "Python"
  );

  const availableLanguages = problem?.allowedLanguages?.length
    ? problem.allowedLanguages
    : ["Python", "C++", "Java"];

  const monacoLangMap: Record<string, string> = {
    C: CPP_LANG_ID,
    "C++": CPP_LANG_ID,
    Java: JAVA_LANG_ID,
    Python: PY_LANG_ID,
    Python3: PY_LANG_ID,
  };

  const monacoLanguage = monacoLangMap[selectedLanguage] || "plaintext";

  const [output, setOutput] = useState("");

  return (
    <ViewContentWrapper>
      <LanguageDisplay>
        사용 언어 :
        <LanguageSelectWrapper>
          <LanguageSelect
            value={selectedLanguage}
            onChange={(e) => {
              setSelectedLanguage(e.target.value);
              onLanguageChange(e.target.value);
            }}
          >
            {availableLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </LanguageSelect>
        </LanguageSelectWrapper>
        <FontSizeSelect
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
        >
          {[14, 16, 18, 20, 22, 24, 28].map((size) => (
            <option key={size} value={size}>
              {size}px
            </option>
          ))}
        </FontSizeSelect>
      </LanguageDisplay>

      <EditorWrapper>
        <Editor
          height="100%"
          language={monacoLanguage}
          value={code}
          theme={isDark ? "vs-dark" : "vs-light"}
          beforeMount={setupLanguages}
          onChange={(value) => onCodeChange(value || "")}
          options={{
            minimap: { enabled: false },
            fontSize: fontSize,
            scrollBeyondLastLine: false,
            padding: { top: 10 },
            wordWrap: "on",
          }}
        />
      </EditorWrapper>

      <ActionRow>
        <ActionButton onClick={onLoadTemp}>불러오기</ActionButton>
        <ActionButton onClick={onSaveTemp}>임시저장</ActionButton>

        {onExecute && (
          <ActionButton
            onClick={async () => {
              const result = await onExecute(); // ProblemSolvePage에서 받은 실행 로직 실행
              if (result) setOutput(result); // 결과를 에디터 하단 OutputBox에 표시
            }}
          >
            실행
          </ActionButton>
        )}

        {!hideSubmit && (
          <ActionButton onClick={onSubmit}>제출하기</ActionButton>
        )}
      </ActionRow>

      {output && <OutputBox>{output}</OutputBox>}
    </ViewContentWrapper>
  );
}

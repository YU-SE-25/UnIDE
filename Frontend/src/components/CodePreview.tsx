import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import styled from "styled-components";
import { useAtomValue } from "jotai";
import { isDarkAtom } from "../atoms";
import {
  atomDarkForIDE as atomDark,
  oneLightForIDE as oneLight,
} from "../theme/codeTheme";

// ================== Styled ==================

const PreviewBox = styled.div`
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  background: ${({ theme }) => theme.bgColor};
  border: 1px solid ${({ theme }) => theme.textColor}33;
  overflow-x: auto;
  font-size: 14px;
`;

const LineRow = styled.div<{ $hovered: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 4px 8px;
  border-radius: 6px;
  position: relative;
  background: ${({ theme, $hovered }) =>
    $hovered ? `${theme.textColor}14` : "transparent"};
`;

const LineNumber = styled.div`
  width: 32px;
  text-align: right;
  opacity: 0.5;
  user-select: none;
  font-family: "Consolas", monospace;
`;

const CodeCell = styled.div`
  flex: 1;
  min-width: 0;
`;

// ================== Types ==================

interface CodePreviewProps {
  code: string;
  language: string;
}

// ================== CodePreview ==================

export default function CodePreview({ code, language }: CodePreviewProps) {
  const isDark = useAtomValue(isDarkAtom);
  const style = isDark ? atomDark : oneLight;
  const lines = code.split("\n");

  const [hoveredLine, setHoveredLine] = useState<number | null>(null);

  return (
    <PreviewBox>
      {lines.map((line, index) => {
        const lineNumber = index + 1;
        const isHovered = hoveredLine === lineNumber;

        return (
          <LineRow
            key={index}
            $hovered={isHovered}
            onMouseEnter={() => setHoveredLine(lineNumber)}
            onMouseLeave={() =>
              setHoveredLine((prev) => (prev === lineNumber ? null : prev))
            }
          >
            <LineNumber>{lineNumber}</LineNumber>

            <CodeCell>
              <SyntaxHighlighter
                language={language}
                style={style}
                PreTag="span"
                customStyle={{
                  background: "transparent",
                  margin: 0,
                  padding: 0,
                  display: "inline",
                }}
                codeTagProps={{
                  style: {
                    background: "transparent",
                    margin: 0,
                    padding: 0,
                    display: "inline",
                  },
                }}
              >
                {line || " "}
              </SyntaxHighlighter>
            </CodeCell>
          </LineRow>
        );
      })}
    </PreviewBox>
  );
}

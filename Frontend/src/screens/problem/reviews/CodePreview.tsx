import { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import styled from "styled-components";
import { useAtomValue } from "jotai";
import { isDarkAtom } from "../../../atoms";
import {
  atomDarkForIDE as atomDark,
  oneLightForIDE as oneLight,
} from "../../../theme/codeTheme";

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

const PlusButton = styled.button<{ $visible: boolean }>`
  border: none;
  background: transparent;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  padding: 0 4px;
  color: ${({ theme }) => theme.textColor};
  transition: opacity 0.15s ease;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  pointer-events: ${({ $visible }) => ($visible ? "auto" : "none")};
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
`;

const Modal = styled.div`
  width: 420px;
  background: ${({ theme }) => theme.bgColor};
  color: ${({ theme }) => theme.textColor};
  padding: 22px;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.textColor}33;
  box-shadow: 0 6px 28px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 20px;
  color: ${({ theme }) => theme.textColor};
`;

const Label = styled.label`
  font-size: 14px;
  color: ${({ theme }) => theme.textColor};
`;

const StyledTextarea = styled.textarea`
  padding: 10px;
  height: 120px;
  resize: none;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.textColor}44;
  background: ${({ theme }) => theme.bgColor};
  color: ${({ theme }) => theme.textColor};
`;

const CodePreviewBox = styled.pre`
  max-height: 90px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.textColor}33;
  background: ${({ theme }) => theme.headerBgColor}33;
  font-size: 12px;
  font-family: "Consolas", monospace;
  white-space: pre-wrap;
  overflow: auto;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const CancelBtn = styled.button`
  padding: 8px 14px;
  border-radius: 8px;
  background: ${({ theme }) => theme.headerBgColor};
  color: ${({ theme }) => theme.textColor};
  border: 1px solid ${({ theme }) => theme.textColor}44;

  &:hover {
    opacity: 0.8;
  }
`;

const SubmitBtn = styled.button`
  padding: 8px 14px;
  border-radius: 8px;
  background: ${({ theme }) => theme.focusColor};
  color: #000;
  border: none;

  &:hover {
    filter: brightness(0.93);
  }
`;

// ================== Types ==================

interface CodePreviewProps {
  code: string;
  language: string;
  onAddReview?: (data: {
    lineNumber: number;
    lineCode: string;
    content: string;
  }) => void;
  editReviewTarget?: {
    lineNumber: number;
    lineCode: string;
    content: string;
  } | null;
  onEditReview?: (data: {
    lineNumber: number;
    lineCode: string;
    content: string;
  }) => void;
}

interface ReviewTarget {
  lineNumber: number;
  lineCode: string;
  initialContent?: string;
  mode: "add" | "edit";
}

interface ReviewModalProps {
  target: ReviewTarget;
  onClose: () => void;
  onSubmit: (content: string) => void;
}

// ================== ReviewModal ==================

function ReviewModal({ target, onClose, onSubmit }: ReviewModalProps) {
  const [content, setContent] = useState(target.initialContent ?? "");

  useEffect(() => {
    setContent(target.initialContent ?? "");
  }, [target]);

  const handleSubmit = () => {
    if (!content.trim()) {
      alert("리뷰 내용을 입력해주세요.");
      return;
    }
    onSubmit(content);
    onClose();
  };

  return (
    <Overlay>
      <Modal>
        <Title>코드 리뷰 {target.mode === "edit" ? "수정" : "작성"}</Title>

        <Label>대상 줄: {target.lineNumber}번째 줄</Label>
        <CodePreviewBox>{target.lineCode || "(빈 줄)"}</CodePreviewBox>

        <Label>리뷰 내용</Label>
        <StyledTextarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="이 줄에 대한 의견이나 개선점을 작성해주세요."
        />

        <ButtonRow>
          <CancelBtn onClick={onClose}>취소</CancelBtn>
          <SubmitBtn onClick={handleSubmit}>
            {target.mode === "edit" ? "수정하기" : "등록하기"}
          </SubmitBtn>
        </ButtonRow>
      </Modal>
    </Overlay>
  );
}

// ================== CodePreview ==================

export default function CodePreview({
  code,
  language,
  onAddReview,
  editReviewTarget,
  onEditReview,
}: CodePreviewProps) {
  const isDark = useAtomValue(isDarkAtom);
  const style = isDark ? atomDark : oneLight;
  const lines = code.split("\n");

  const [hoveredLine, setHoveredLine] = useState<number | null>(null);
  const [reviewTarget, setReviewTarget] = useState<ReviewTarget | null>(null);

  useEffect(() => {
    if (!editReviewTarget) return;

    setReviewTarget({
      lineNumber: editReviewTarget.lineNumber,
      lineCode: editReviewTarget.lineCode,
      initialContent: editReviewTarget.content,
      mode: "edit",
    });
  }, [editReviewTarget]);

  return (
    <>
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

              <PlusButton
                type="button"
                $visible={isHovered}
                onClick={() =>
                  setReviewTarget({
                    lineNumber,
                    lineCode: line,
                    mode: "add",
                  })
                }
              >
                +
              </PlusButton>
            </LineRow>
          );
        })}
      </PreviewBox>

      {reviewTarget && (
        <ReviewModal
          target={reviewTarget}
          onClose={() => setReviewTarget(null)}
          onSubmit={(content) => {
            if (reviewTarget.mode === "edit") {
              onEditReview?.({
                lineNumber: reviewTarget.lineNumber,
                lineCode: reviewTarget.lineCode,
                content,
              });
            } else {
              onAddReview?.({
                lineNumber: reviewTarget.lineNumber,
                lineCode: reviewTarget.lineCode,
                content,
              });
            }
          }}
        />
      )}
    </>
  );
}

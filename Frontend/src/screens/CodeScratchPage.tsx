import { useState, useEffect } from "react";
import styled from "styled-components";
import CodeEditorView from "../screens/problem/CodeEditorView";
import { api } from "../api/axios";
import { IDEAPI } from "../api/ide_api";
import {
  ProblemTitle,
  ProblemDescriptionBox,
  ProblemDetailText,
  ExampleBox,
  ProblemInfoContainer,
  ProblemSolveWrapper,
  EditorPanelContainer,
  ActionButton,
  ScratchInput,
} from "../theme/ProblemSolve.Style";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { userProfileAtom } from "../atoms";

// ---------------- 스타일 ----------------
export const RunInputBox = styled.textarea`
  width: 100%;
  height: 80px;
  margin-top: 8px;
  border-radius: 6px;
  padding: 8px;
  resize: vertical;

  background: ${({ theme }) => theme.bgColor};
  color: ${({ theme }) => theme.textColor};
  border: 1px solid ${({ theme }) => theme.textColor}55;

  &::placeholder {
    color: ${({ theme }) => theme.textColor}88;
  }
`;


const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SmallButton = styled.button`
  padding: 6px 10px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background: #ff4f4f;
  color: white;
  font-size: 14px;

  &:hover {
    opacity: 0.9;
  }
`;

const LoadBox = styled.div`
  margin-top: 15px;
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
`;

// ---------------- API DTO ----------------
interface ProblemDetailResponse {
  problemId: number;
  title: string;
  description: string;
  inputOutputExample: string;
}

async function fetchProblemDetail(problemId: number) {
  const res = await api.get(`/problems/detail/${problemId}`);
  const dto = res.data as ProblemDetailResponse;

  return {
    problemId: dto.problemId,
    title: dto.title,
    description: dto.description,
    inputOutputExample: dto.inputOutputExample ?? "",
  };
}

// ----------------------------------------------------------

export default function CodeScratchPage() {
  const [problemIdInput, setProblemIdInput] = useState("");
  const [problem, setProblem] = useState<any | null>(null);

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("Python");
  const [runInput, setRunInput] = useState("");

  const [userProfile] = useAtom(userProfileAtom);
  const navigate = useNavigate();

  const languageMap: Record<string, string> = {
    Python: "PYTHON",
    "C++": "CPP",
    Java: "JAVA",
  };

  const reverseMap: Record<string, string> = {
    PYTHON: "Python",
    CPP: "C++",
    JAVA: "Java",
  };

  const codeKey = problem ? `scratch-${problem.problemId}` : "scratch-null";

  // 문제 바뀔 때 로컬 코드 불러오기
  useEffect(() => {
    if (!problem) return;
    const saved = localStorage.getItem(codeKey);
    setCode(saved || "");
  }, [problem]);

  // ---------------- 문제 불러오기 ----------------
  const loadProblem = async () => {
    if (!problemIdInput.trim()) return alert("문제 번호를 입력해주세요.");

    const id = Number(problemIdInput.trim());
    if (isNaN(id)) return alert("올바른 숫자를 입력해주세요.");

    // 기존 코드 저장 여부
    if (code.trim()) {
      const ok = window.confirm("현재 코드가 있습니다. 저장할까요?");
      if (ok) localStorage.setItem(codeKey, code);
    }

    try {
      const data = await fetchProblemDetail(id);
      setProblem(data);
      setRunInput("");
    } catch {
      alert("문제를 찾을 수 없습니다.");
    }
  };

  // ---------------- 문제 제거 ----------------
  const clearProblem = () => {
    const ok = window.confirm("현재 문제를 제거할까요?");
    if (ok) {
      localStorage.setItem(codeKey, code);
      setProblem(null);
      setCode("");
      setRunInput("");
    }
  };

  // ---------------- 코드 실행 ----------------
  const executeCode = async () => {
    const result = await IDEAPI.run({
      code,
      language: languageMap[language],
      input: runInput,
    });

    return `
[ 표준 출력(stdout) ]
${result.output}

[ 표준 에러(stderr) ]
${result.compileError ?? result.error ?? "(없음)"}

[ 실행 시간 ]
${result.executionTimeMs ?? "(없음)"} ms
`.trim();
  };

  // ---------------- 임시 저장 ----------------
  const saveCode = async () => {
    if (!problem) return alert("먼저 문제를 선택하세요!");

    const numericId = Number(problem.problemId);
    if (isNaN(numericId)) return alert("문제ID 오류!");

    await IDEAPI.saveDraft({
      problemId: problem.problemId,
      code,
      language: languageMap[language],
    });

    alert("임시 저장 완료!");
  };

  // ---------------- 임시 저장 불러오기 ----------------
  const loadSaved = async () => {
    if (!problem) return alert("먼저 문제를 선택하세요!");

    const saved = await IDEAPI.loadDraft(problem.problemId);

    setCode(saved.code);
    setLanguage(reverseMap[saved.language] ?? "Python");

    alert("불러오기 완료!");
  };

  //  제출하기 (문제풀이와 동일 로직)
  const handleSubmit = async () => {
  if (!problem) {
    alert("먼저 문제를 선택하세요!");
    return;
  }

  if (!code.trim()) {
    alert("코드를 입력해주세요!");
    return;
  }

  if (!runInput.trim()) {
    const ok = window.confirm(
      "입력값이 비어있습니다. 입력 없이 제출할까요?"
    );
    if (!ok) return;
  }

  const numericId = Number(problem.problemId);
  if (isNaN(numericId)) {
    alert("문제 ID 오류로 제출이 불가능합니다.");
    return;
  }

  try {
    await IDEAPI.submit({
      problemId: numericId,
      code,
      language: languageMap[language],
    });

    navigate(
      `/problems/${userProfile?.nickname}/submitted?id=${numericId}&showResult=true`
    );

  } catch (e) {
    alert("제출 중 오류가 발생했습니다.");
  }
};


  // ---------------- 렌더 ----------------

  return (
    <ProblemSolveWrapper>
      <ProblemInfoContainer>
        {/* 상단 제목 + 삭제 버튼 */}
        <TopRow>
          <ProblemTitle>{problem ? problem.title : "코드 연습장"}</ProblemTitle>

          {problem && (
            <SmallButton onClick={clearProblem}>문제 제거</SmallButton>
          )}
        </TopRow>

        {/* 문제 불러오기 */}
        <LoadBox>
          <ScratchInput
            type="number"
            placeholder="문제 번호 입력"
            value={problemIdInput}
            onChange={(e) => setProblemIdInput(e.target.value)}
          />

          <ActionButton onClick={loadProblem} $main>
            문제 불러오기
          </ActionButton>

        </LoadBox>

        {/* 문제 정보 */}
        {problem ? (
          <>
            <ProblemDescriptionBox>{problem.description}</ProblemDescriptionBox>

            {/* 입출력 예시 전체 출력 */}
            {problem.inputOutputExample && (
              <div style={{ marginTop: "20px" }}>
                <h3>입출력 예시</h3>
                <ExampleBox>{problem.inputOutputExample}</ExampleBox>
              </div>
            )}
          </>
        ) : (
          <ProblemDetailText>
            문제를 선택하면 설명이 표시돼요!
          </ProblemDetailText>
        )}

        {/* 실행 input */}
        <div style={{ marginTop: "20px" }}>
          <h3>실행 입력값</h3>
          <RunInputBox
            value={runInput}
            onChange={(e) => setRunInput(e.target.value)}
            placeholder="여기에 input을 입력하세요."
          />
        </div>
      </ProblemInfoContainer>

      {/* 오른쪽 코드 에디터 */}
      <EditorPanelContainer>
        <CodeEditorView
          problem={problem}
          code={code}
          onCodeChange={setCode}
          onExecute={executeCode}
          onSaveTemp={saveCode}
          onLoadTemp={loadSaved}
          onSubmit={handleSubmit}
          hideSubmit={!problem}
          language={language}
          onLanguageChange={setLanguage}
        />
      </EditorPanelContainer>
    </ProblemSolveWrapper>
  );
}

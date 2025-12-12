import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import type { IProblem } from "../../api/problem_api";
import { fetchProblemDetail } from "../../api/problem_api";

import { IDEAPI } from "../../api/ide_api";
import CodeEditorView from "./CodeEditorView";

import {
  ProblemSolveWrapper,
  ProblemInfoContainer,
  ProblemTitle,
  ProblemDetailText,
  ProblemDescriptionBox,
  EditorPanelContainer,
  ExampleBox,
  RunInputBox,
} from "../../theme/ProblemSolve.Style";

import { userProfileAtom } from "../../atoms";
import { useAtom } from "jotai";

const languageMap: Record<string, string> = {
  Python: "PYTHON",
  "C++": "CPP",
  Java: "JAVA",
};

const reverseLanguageMap: Record<string, string> = {
  PYTHON: "Python",
  CPP: "C++",
  JAVA: "Java",
};

export default function ProblemSolvePage() {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [problemData, setProblemData] = useState<IProblem | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile] = useAtom(userProfileAtom);
  const [runInput, setRunInput] = useState("");

  // language / code 초기값
  const [language, setLanguage] = useState(
    location.state?.language ?? "Python"
  );
  const [code, setCode] = useState(location.state?.initialCode ?? "");

  const token = localStorage.getItem("accessToken");

  // 로그인 체크
  useEffect(() => {
    if (!token) {
      alert("로그인 후 이용해주세요!");
      navigate("/login");
    }
  }, [token, navigate]);

  // 문제 상세 로딩
  useEffect(() => {
    if (!problemId) return;
    const numericId = Number(problemId);
    if (isNaN(numericId)) {
      alert("유효하지 않은 문제 ID입니다.");
      return;
    }

    let mounted = true;

    const load = async () => {
      setLoading(true);

      try {
        const real = await fetchProblemDetail(numericId);
        if (!mounted) return;

        setProblemData(real);

        // 언어 설정
        if (real.allowedLanguages?.length) {
          const preferred = ["Python", "C++", "Java"];
          setLanguage(
            preferred.find((l) => real.allowedLanguages!.includes(l)) ??
              real.allowedLanguages[0]
          );
        }
      } catch (e) {
        console.error("문제 상세 API 실패", e);
        if (mounted) setProblemData(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [problemId]);

  // 코드 실행
  const handleRun = async () => {
    const numericId = Number(problemId);
    if (isNaN(numericId)) return "문제 ID 없음";

    const result = await IDEAPI.run({
      code,
      language: languageMap[language],
      input: runInput, // 사용자 Input 적용!
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

  // 임시 저장
  const handleSaveDraft = async () => {
    const numericId = Number(problemId);
    if (isNaN(numericId)) return alert("문제 ID 오류로 저장 불가!");

    await IDEAPI.saveDraft({
      problemId: numericId,
      code,
      language: languageMap[language],
    });

    alert("임시 저장 완료!");
  };

  // 임시 저장 불러오기
  const handleLoadDraft = async () => {
    const numericId = Number(problemId);
    if (isNaN(numericId)) return alert("문제 ID 오류로 불러오기 불가!");

    const saved = await IDEAPI.loadDraft(numericId);

    setCode(saved.code);
    setLanguage(reverseLanguageMap[saved.language] ?? "Python");

    alert("불러오기 완료!");
  };

  // 제출
  const handleSubmit = async () => {
    const numericId = Number(problemId);
    if (isNaN(numericId)) return alert("문제 ID 오류로 제출 불가!");
    const data = await IDEAPI.submit({
      problemId: numericId,
      code,
      language: languageMap[language],
    });
    const submissionId = data.submissionId;

    navigate(
      `/problems/${userProfile?.nickname}/submitted?id=${submissionId}&showResult=true`,
      {
        state: {
          submitResult: data,
          problemId: numericId,
        },
      }
    );
  };

  if (loading) {
    return <ProblemSolveWrapper>로딩 중...</ProblemSolveWrapper>;
  }

  if (!problemData) {
    return <ProblemSolveWrapper>문제를 찾을 수 없습니다.</ProblemSolveWrapper>;
  }

  return (
    <ProblemSolveWrapper>
      <ProblemInfoContainer>
        <ProblemTitle>{problemData.title}</ProblemTitle>

        <ProblemDescriptionBox>{problemData.description}</ProblemDescriptionBox>

        <ProblemDetailText>
          제한: {problemData.timeLimit}초 / {problemData.memoryLimit}MB
        </ProblemDetailText>

        {problemData.inputOutputExample && (
          <div style={{ marginTop: "20px" }}>
            <h3>입출력 예시</h3>
            <ExampleBox>{problemData.inputOutputExample}</ExampleBox>
          </div>
        )}

        <div style={{ marginTop: "25px" }}>
          <h3>실행 입력값</h3>
          <RunInputBox
            value={runInput}
            onChange={(e) => setRunInput(e.target.value)}
            placeholder="여기에 실행 input을 입력하세요"
          />

        </div>
      </ProblemInfoContainer>

      <EditorPanelContainer>
        <CodeEditorView
          problem={problemData}
          code={code}
          onCodeChange={setCode}
          onExecute={handleRun}
          onSaveTemp={handleSaveDraft}
          onLoadTemp={handleLoadDraft}
          onSubmit={handleSubmit}
          language={language}
          onLanguageChange={setLanguage}
        />
      </EditorPanelContainer>
    </ProblemSolveWrapper>
  );
}

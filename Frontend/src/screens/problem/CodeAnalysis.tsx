import { useRef, useState, useEffect } from "react";
import { useAtom } from "jotai";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { isDarkAtom } from "../../atoms";

import {
  Container,
  LeftPanel,
  ProblemInfo,
  Toolbar,
  CodeBox,
  Accordion,
  Resizer,
  RightPanel,
  Tabs,
  TabButton,
  Content,
  FontSizeSelect,
} from "../../theme/CodeAnalysis.Style";

// 오른쪽 탭 컴포넌트
import CodeProfiling from "./CodeProfiling";
import CodeFlowchart from "./CodeFlowchart";

// API
import { fetchSubmissionDetail } from "../../api/mySubmissions_api";
import { fetchProblemDetail } from "../../api/problem_api";
import {
  fetchComplexityAnalysis,
  fetchFlowchartAnalysis,
} from "../../api/ide_api";
import type { SubmissionDetail } from "../../api/mySubmissions_api";

function timeConverter(iso: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function CodeAnalysis() {
  const { problemId, submissionId } = useParams();

  const [fontSize, setFontSize] = useState(16);
  const [isDark] = useAtom(isDarkAtom);

  const [panelWidth, setPanelWidth] = useState(380);
  const [activeTab, setActiveTab] = useState("performance");

  const dragging = useRef(false);

  const [openMeta, setOpenMeta] = useState(false);
  const [openTest, setOpenTest] = useState(false);

  const [submissionDetail, setSubmissionDetail] =
    useState<SubmissionDetail | null>(null);

  // 제출 코드 + 언어
  const [code, setCode] = useState("");
  const [rawLang, setRawLang] = useState("");

  // 문제 제목만
  const [problemTitle, setProblemTitle] = useState("");

  // 분석 데이터
  const [complexityData, setComplexityData] = useState(null);
  const [flowchartData, setFlowchartData] = useState(null);

  const handleMouseDown = () => (dragging.current = true);
  const handleMouseUp = () => (dragging.current = false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return;
    const newWidth = window.innerWidth - e.clientX;
    if (newWidth > 240 && newWidth < 700) setPanelWidth(newWidth);
  };

  // 제출 코드 + 문제 제목 로딩
  useEffect(() => {
    if (!submissionId) return;

    const run = async () => {
      try {
        const detail = await fetchSubmissionDetail(Number(submissionId));

        setSubmissionDetail(detail);

        setCode(detail.code ?? "");
        setRawLang(detail.language ?? "Python");

        const p = await fetchProblemDetail(detail.problemId);
        setProblemTitle(p.title ?? "");
      } catch (err) {
        console.error("로드 오류:", err);
      }
    };

    run();
  }, [submissionId]);

  // API 호출
  useEffect(() => {
    if (!submissionId) return;

    if (activeTab === "profiling") {
      fetchComplexityAnalysis(Number(submissionId))
        .then(setComplexityData)
        .catch(console.error);
    }

    if (activeTab === "flowchart") {
      fetchFlowchartAnalysis(Number(submissionId))
        .then((data) => setFlowchartData(data.mermaidCode))
        .catch(console.error);
    }
  }, [activeTab, submissionId]);

  return (
    <Container onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      <LeftPanel>
        <ProblemInfo>
          {problemTitle ? (
            <span>
              문제 {problemId} · {problemTitle}
            </span>
          ) : (
            <span>문제 정보를 불러오는 중...</span>
          )}
        </ProblemInfo>

        <Toolbar>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>사용 언어 : {rawLang || "로드 중..."}</span>

            <FontSizeSelect
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
            >
              {[14, 16, 18, 20, 22, 24, 28].map((v) => (
                <option key={v} value={v}>
                  {v}px
                </option>
              ))}
            </FontSizeSelect>
          </div>
        </Toolbar>

        {/* 코드 표시 */}
        <CodeBox>
          <Editor
            height="100%"
            value={code}
            defaultLanguage="javascript"
            theme={isDark ? "vs-dark" : "light"}
            options={{
              readOnly: true,
              fontSize,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
            }}
          />
        </CodeBox>

        {/* 제출 정보 */}
        <Accordion onClick={() => setOpenMeta((v) => !v)}>
          <strong>제출 정보</strong>

          {openMeta && submissionDetail && (
            <div style={{ marginTop: "10px" }}>
              <p>제출 시각: {timeConverter(submissionDetail.submittedAt)}</p>
              <p>언어: {submissionDetail.language}</p>
              <p>실행 시간: {submissionDetail.runtime}ms</p>
              <p>메모리 사용량: {submissionDetail.memory}MB</p>
              <p>공유 여부: {submissionDetail.shared ? "공유됨" : "비공유"}</p>
            </div>
          )}
        </Accordion>

        <Accordion onClick={() => setOpenTest((v) => !v)}>
          <strong>테스트 케이스 결과</strong>

          {openTest && <div style={{ marginTop: "10px" }}>추후 추가 예정</div>}
        </Accordion>
      </LeftPanel>

      <Resizer onMouseDown={handleMouseDown} />

      <RightPanel width={panelWidth}>
        <Tabs>
          <TabButton
            active={activeTab === "profiling"}
            onClick={() => setActiveTab("profiling")}
          >
            복잡도 분석
          </TabButton>

          <TabButton
            active={activeTab === "flowchart"}
            onClick={() => setActiveTab("flowchart")}
          >
            플로우차트
          </TabButton>
        </Tabs>

        <Content>
          {activeTab === "profiling" && <CodeProfiling data={complexityData} />}
          {activeTab === "flowchart" && (
            <CodeFlowchart mermaidCode={flowchartData} />
          )}
        </Content>
      </RightPanel>
    </Container>
  );
}

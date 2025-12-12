import { useEffect, useRef } from "react";
import mermaid from "mermaid";

interface CodeFlowchartProps {
  mermaidCode: string | null;
}

export default function CodeFlowchart({ mermaidCode }: CodeFlowchartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mermaidCode) return;

    const run = async () => {
      try {
        mermaid.initialize({ startOnLoad: false });

        // ✔ Promise 기반 mermaid.render() 사용
        const { svg } = await mermaid.render("flowchart-svg", mermaidCode);

        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err) {
        console.error("Mermaid 렌더링 오류:", err);

        if (containerRef.current) {
          containerRef.current.innerHTML =
            "<p>플로우차트를 렌더링하는 중 오류가 발생했습니다.</p>";
        }
      }
    };

    run();
  }, [mermaidCode]);

  if (!mermaidCode) return <p>플로우차트를 불러오는 중…</p>;

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        overflowX: "auto",
        padding: "10px",
      }}
    />
  );
}

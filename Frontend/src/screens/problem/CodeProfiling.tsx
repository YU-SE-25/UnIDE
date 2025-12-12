interface ComplexityAnalysis {
  timeComplexity: string;
  timeReason: string;
  spaceComplexity: string;
  spaceReason: string;
}

interface CodeProfilingProps {
  data: ComplexityAnalysis | null;
}

export default function CodeProfiling({ data }: CodeProfilingProps) {
  if (!data) return <p>복잡도 분석 중...</p>;

  return (
    <div>
      <h3>시간 복잡도</h3>
      <p>{data.timeComplexity}</p>
      <p>{data.timeReason}</p>

      <h3>공간 복잡도</h3>
      <p>{data.spaceComplexity}</p>
      <p>{data.spaceReason}</p>
    </div>
  );
}

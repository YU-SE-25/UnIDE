import { useEffect, useState } from "react";
import styled from "styled-components";
import { api } from "../../api/axios";
import { fetchMySubmissions } from "../../api/mySubmissions_api";

const Card = styled.div`
  border: 1px solid ${({ theme }) => `${theme.textColor}20`};
  border-radius: 16px;
  padding: 24px 28px;
  padding: 24px 28px;
  background: ${({ theme }) => theme.headerBgColor};

  width: 100%;

  width: 100%;
  max-width: 800px;
  min-width: 400px;
  margin: 40px auto;

  line-height: 1.6;

  & > * + * {
    margin-top: 8px;
  }
  min-width: 400px;
  margin: 40px auto;

  line-height: 1.6;

  & > * + * {
    margin-top: 8px;
  }
`;

interface CodingHabitsResponse {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export default function CodingStylePage() {
  const [canAnalyze, setCanAnalyze] = useState<boolean>(false);
  const [data, setData] = useState<CodingHabitsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // 1) 정답이 10개 이상인지 여부만 판단
  useEffect(() => {
    fetchMySubmissions({ size: 9999 });
    fetchMySubmissions({ size: 9999 })
      .then((res) => {
        const correct = res.items.filter((sub) => sub.status === "CA").length;
        setCanAnalyze(correct >= 10);
      })
      .catch(() => setCanAnalyze(false));
  }, []);

  // 2) 분석 API는 정답 수 상관없이 실행 (백엔드에서 최신 분석 반환)
  useEffect(() => {
    api
      .get("/analysis/habits")
      .then((res) => setData(res.data))
      .catch((err) => console.error("성향 분석 오류:", err))
      .finally(() => setLoading(false));
  }, []);

  // 10개 미만이면 -> 숫자 없이 안내만
  if (!canAnalyze) {
    return (
      <Card>
        <h2>코딩 성향 분석</h2>
        <p>분석을 이용하려면 일정 기준을 만족해야 합니다.</p>
        <p style={{ opacity: 0.7 }}>(분석은 10회 단위로 새롭게 제공됩니다.)</p>
      </Card>
    );
  }

  // 10개 이상 → 분석 결과 UI
  if (loading && !data) {
    return <Card>분석 중입니다...</Card>;
  }

  if (!data) {
    return <Card>분석 결과를 불러오지 못했습니다.</Card>;
  }

  return (
    <Card>
      <h2>코딩 성향 분석</h2>

      <p>{data.summary}</p>

      <h3>강점</h3>
      <ul>
        {data.strengths.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>

      <h3>약점</h3>
      <ul>
        {data.weaknesses.map((w) => (
          <li key={w}>{w}</li>
        ))}
      </ul>

      <h3>개선 제안</h3>
      <ul>
        {data.suggestions.map((sg) => (
          <li key={sg}>{sg}</li>
        ))}
      </ul>

      <p style={{ marginTop: "20px", opacity: 0.7 }}>
        (분석은 10회 단위로 자동 업데이트됩니다.)
      </p>
    </Card>
  );
}

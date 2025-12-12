// ProblemMeta.tsx
import { Link } from "react-router-dom";
import type { IProblem } from "../api/problem_api";
import {
  MetaInfoSection,
  MetaRow,
  MetaLabel,
  MetaValue,
} from "../theme/ProblemDetail.Style";

type ProblemMetaProps = {
  problem: IProblem;
};

export default function ProblemMeta({ problem }: ProblemMetaProps) {
  const formattedDate = problem.createdAt ? problem.createdAt.slice(0, 10) : "";

  return (
    <MetaInfoSection>
      <MetaRow>
        <MetaValue>#{problem.problemId}</MetaValue>
        <MetaValue style={{ fontSize: "24px", fontWeight: "bold" }}>
          {problem.title}
        </MetaValue>
      </MetaRow>

      <MetaRow>
        <MetaLabel>난이도:</MetaLabel>
        <MetaValue>{problem.difficulty}</MetaValue>

        <MetaLabel>조회수:</MetaLabel>
        <MetaValue>{problem.viewCount}</MetaValue>

        <MetaLabel>등록일:</MetaLabel>
        <MetaValue>{formattedDate}</MetaValue>

        <MetaLabel>작성자:</MetaLabel>
        <MetaValue>
          <Link to={`/mypage/${problem.author}`}>{problem.author}</Link>
        </MetaValue>
      </MetaRow>

      <MetaRow>
        <MetaLabel>푼 사람:</MetaLabel>
        <MetaValue>{problem.solvedCount}</MetaValue>

        <MetaLabel>정답률:</MetaLabel>
        <MetaValue>{problem.successRate}</MetaValue>

        <MetaLabel>시간 제한:</MetaLabel>
        <MetaValue>{problem.timeLimit}ms</MetaValue>

        <MetaLabel>메모리 제한:</MetaLabel>
        <MetaValue>{problem.memoryLimit}MB</MetaValue>
      </MetaRow>
    </MetaInfoSection>
  );
}

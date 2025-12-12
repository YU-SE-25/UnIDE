import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProblemDetail } from "../../api/problem_api";
import type { IProblem } from "../../api/problem_api";

import {
  ProblemWrapper,
  MainContent,
  DescriptionSection,
  SectionHeader,
  InlineTagList,
  HintSpoiler,
  ActionSection,
  SolveButton,
  ViewCodeButton,
  TagLink,
} from "../../theme/ProblemDetail.Style";

import { useAtomValue } from "jotai";
import { userProfileAtom } from "../../atoms";
import ProblemMeta from "../../components/ProblemMeta";
import { fetchMySubmissions } from "../../api/mySubmissions_api";

export default function ProblemDetail() {
  const navigate = useNavigate();
  const { problemId } = useParams<{ problemId: string }>();

  const [problem, setProblem] = useState<IProblem | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasSubmission, setHasSubmission] = useState(false);

  const user = useAtomValue(userProfileAtom);
  const userRole = user?.role;
  const isLoggedIn = !!user;

  // 문제 상세 조회
  useEffect(() => {
    if (!problemId) return;

    let mounted = true;

    const load = async () => {
      setLoading(true);

      try {
        const real = await fetchProblemDetail(Number(problemId));
        if (mounted) setProblem(real);
      } catch (err) {
        console.error("문제 상세 조회 실패:", err);
        if (mounted) setProblem(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [problemId]);

  const handleSolveProblem = () => {
    if (!isLoggedIn) {
      alert("로그인 후 이용 가능합니다.");
      return;
    }
    navigate(`/problems/${problemId}/solve`);
  };

  const handleViewMyCode = () => {
    if (!problem) return;
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }

    navigate(`/problems/${user.nickname}/submitted?search=${problemId}`);
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    fetchMySubmissions({ problemId: Number(problemId), size: 1 })
      .then((page) => {
        const has = page.items.length > 0;
        setHasSubmission(has);
      })
      .catch(() => setHasSubmission(false));
  }, [isLoggedIn, problemId]);

  if (loading) return <ProblemWrapper>로딩 중...</ProblemWrapper>;
  if (!problem)
    return <ProblemWrapper>문제를 찾을 수 없습니다.</ProblemWrapper>;

  return (
    <ProblemWrapper>
      <MainContent>
        <ProblemMeta problem={problem} />

        <ActionSection>
          <div className="left">
            {hasSubmission && (
              <ViewCodeButton onClick={handleViewMyCode}>
                제출한 기록 보기
              </ViewCodeButton>
            )}

            <ViewCodeButton onClick={() => navigate(`/qna?id=${problemId}`)}>
              QnA
            </ViewCodeButton>

            <ViewCodeButton
              onClick={() => navigate(`/problem-detail/${problemId}/solved`)}
            >
              공유된 풀이 보기
            </ViewCodeButton>
          </div>

          <div className="right">
            <SolveButton onClick={handleSolveProblem}>문제 풀기</SolveButton>

            {(userRole === "MANAGER" || userRole === "INSTRUCTOR") &&
              problem.canEdit && (
                <ViewCodeButton
                  onClick={() => navigate(`/problem-edit/${problemId}`)}
                >
                  문제 수정
                </ViewCodeButton>
              )}
          </div>
        </ActionSection>

        <DescriptionSection>
          <SectionHeader>
            <h3>문제 설명</h3>
            <InlineTagList>
              {problem.tags.map((tag) => (
                <TagLink
                  key={tag}
                  to={`/problem-list?tag=${encodeURIComponent(tag)}`}
                >
                  {tag}
                </TagLink>
              ))}
            </InlineTagList>
          </SectionHeader>

          <p style={{ whiteSpace: "pre-wrap" }}>{problem.description}</p>
        </DescriptionSection>

        <DescriptionSection>
          <h3>입출력 예제</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {problem.inputOutputExample}
          </pre>
        </DescriptionSection>

        {problem.hint && (
          <DescriptionSection>
            <h3>힌트</h3>
            <HintSpoiler>
              <p>{problem.hint}</p>
            </HintSpoiler>
          </DescriptionSection>
        )}

        {problem.source && (
          <DescriptionSection>
            <h3>출처</h3>
            <p>{problem.source}</p>
          </DescriptionSection>
        )}
      </MainContent>
    </ProblemWrapper>
  );
}

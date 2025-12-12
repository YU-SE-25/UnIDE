import { useEffect, useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";

import {
  TabContentHeader,
  ProblemListAddButton,
  ProblemAccordionContainer,
  ProblemAccordionItem,
  AccordionHeader,
  ProblemSummary,
  ProblemSummarySmall,
  ProblemListInfo,
  ProblemDetailList,
  ProblemDetailItem,
  ProblemTitleLink,
  StatusBadge,
  ProblemListInfoContainer,
} from "../../theme/StudyGroupDetail.Style";

import type { AssignedProblemList, GroupRole } from "../../api/studygroup_api";
import {
  fetchAssignedProblemLists,
  fetchAssignedProblemListDetail,
} from "../../api/studygroup_api";

import { api } from "../../api/axios"; // 제출 API 불러오기 위함
import CreateProblemList from "./CreateProblemList";
import { useNavigate } from "react-router-dom";

export default function ProblemListTab() {
  const { groupId, role } = useOutletContext<{
    groupId: number;
    role: GroupRole;
  }>();

  const [lists, setLists] = useState<AssignedProblemList[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [solvedSet, setSolvedSet] = useState<Set<number>>(new Set()); // 제출된 문제 ID 저장
  const navigate = useNavigate();

  // 제출 이력 전체 불러오기
  interface SubmissionsResponse {
    submissions: {
      submissionId: number;
      problemId: number;
      problemTitle: string;
      status: string;
      submittedAt: string;
    }[];
  }

  const loadSubmissions = useCallback(async () => {
    try {
      const res = await api.get<SubmissionsResponse>("/submissions", {
        params: { size: 1000 },
      });

      const setData = new Set<number>(
        res.data.submissions.map((s) => s.problemId)
      );

      setSolvedSet(setData);
    } catch (e) {
      console.error("제출 기록 불러오기 실패", e);
    }
  }, []);

  //전체 문제 리스트 불러오기
  const loadLists = useCallback(async () => {
    const data = await fetchAssignedProblemLists(groupId);
    setLists(data);
  }, [groupId]);

  // 최초 로딩: 문제 + 제출 이력 모두
  useEffect(() => {
    loadLists();
    loadSubmissions();
  }, [loadLists, loadSubmissions]);

  // 펼칠 때 문제 상세 데이터 가져오기
  const toggleExpand = async (problemListId: number) => {
    if (expanded === problemListId) {
      setExpanded(null);
      return;
    }

    const detail = await fetchAssignedProblemListDetail(groupId, problemListId);

    if (!detail) return;

    setLists((prev) =>
      prev.map((list) => (list.problemListId === problemListId ? detail : list))
    );

    setExpanded(problemListId);
  };

  const handleAddProblemList = () => {
    if (role !== "LEADER") {
      alert("그룹장만 문제를 지정할 수 있습니다.");
      return;
    }
    setShowCreateModal(true);
  };

  return (
    <>
      <TabContentHeader>
        <h3>지정된 문제 목록</h3>

        {role === "LEADER" && (
          <ProblemListAddButton onClick={handleAddProblemList}>
            + 문제 리스트 추가
          </ProblemListAddButton>
        )}
      </TabContentHeader>

      <ProblemAccordionContainer>
        {lists.map((list) => {
          const isOpen = expanded === list.problemListId;

          //제출된 문제 수 계산: 프런트 계산 기반
          const submittedCount = list.problems.filter((p) =>
            solvedSet.has(p.problemId)
          ).length;

          return (
            <ProblemAccordionItem key={list.problemListId} $isExpanded={isOpen}>
              <AccordionHeader onClick={() => toggleExpand(list.problemListId)}>
                <ProblemSummary>{list.listTitle}</ProblemSummary>

                <ProblemListInfo>
                  <ProblemSummarySmall>
                    {submittedCount}/{list.problems.length}
                  </ProblemSummarySmall>

                  <ProblemSummarySmall>
                    마감: {list.dueDate}
                  </ProblemSummarySmall>
                </ProblemListInfo>
              </AccordionHeader>

              {isOpen && (
                <ProblemDetailList>
                  {list.problems.map((p) => {
                    const isSolved = solvedSet.has(p.problemId);

                    return (
                      <ProblemDetailItem key={p.problemId}>
                        <ProblemListInfoContainer>
                          {/* 문제 상세 이동 */}
                          <ProblemTitleLink
                            onClick={() =>
                              navigate(`/problem-detail/${p.problemId}`)
                            }
                          >
                            {p.problemTitle}
                          </ProblemTitleLink>
                        </ProblemListInfoContainer>

                        {/* 제출 여부 표시 */}
                        <StatusBadge $status={isSolved ? "ok" : "none"}>
                          {isSolved ? "제출완료" : "미제출"}
                        </StatusBadge>
                      </ProblemDetailItem>
                    );
                  })}
                </ProblemDetailList>
              )}
            </ProblemAccordionItem>
          );
        })}
      </ProblemAccordionContainer>

      {lists.length === 0 && (
        <p style={{ opacity: 0.7 }}>지정된 문제가 없습니다.</p>
      )}

      {showCreateModal && (
        <CreateProblemList
          mode="create"
          groupId={groupId}
          onClose={() => setShowCreateModal(false)}
          onFinished={() => {
            loadLists();
            loadSubmissions();
          }}
        />
      )}
    </>
  );
}

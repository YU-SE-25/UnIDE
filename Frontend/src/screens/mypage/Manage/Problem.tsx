import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { userProfileAtom } from "../../../atoms";
import { useAtomValue } from "jotai";
import {
  approveProblem,
  fetchMyProblems,
  fetchPendingProblemList,
  rejectProblem,
  downloadTestcaseFile,
} from "../../../api/manage_api";
import type { ProblemListItem as ProblemItem } from "../../../api/manage_api";
import {
  fetchProblemDetail,
  fetchProblems,
  deleteProblem,
  type IProblem,
} from "../../../api/problem_api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

/* -----------------------------------------------------
   타입
----------------------------------------------------- */

type Difficulty = "EASY" | "MEDIUM" | "HARD";

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  EASY: "쉬움",
  MEDIUM: "보통",
  HARD: "어려움",
};

// 한 페이지에 10개
const PAGE_SIZE = 10;

/* -----------------------------------------------------
   styled-components
----------------------------------------------------- */

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 30px;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 15px;

  background: ${({ theme }) => theme.bgColor};
  border: 1px solid ${({ theme }) => theme.muteColor};

  color: ${({ theme }) => theme.textColor};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button<{ disabled?: boolean }>`
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};

  background: ${({ theme, disabled }) =>
    disabled ? theme.muteColor : theme.focusColor};
  color: ${({ theme }) => theme.bgColor};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  transition: 0.2s ease;

  &:hover {
    opacity: ${({ disabled }) => (disabled ? 0.4 : 0.8)};
  }
`;
/*
const SectionTitle = styled.h3`
  margin: 10px 0 4px;
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.textColor};
`;
*/

const TableWrap = styled.div`
  border: 1px solid ${({ theme }) => theme.bgCardColor};
  border-radius: 12px;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.bgCardColor};
`;

const Thead = styled.thead`
  background: ${({ theme }) => theme.bgCardColor};
`;

const Th = styled.th`
  text-align: left;
  padding: 12px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.textColor};
`;

const Tr = styled.tr<{ selected?: boolean }>`
  cursor: pointer;
  background: ${({ selected, theme }) =>
    selected ? theme.focusColor + "33" : theme.bgColor};

  &:hover {
    background: ${({ selected, theme }) =>
      selected ? theme.focusColor + "33" : theme.bgCardColor};
  }
`;

const Td = styled.td`
  padding: 12px;
  border-top: 1px solid ${({ theme }) => theme.bgCardColor};
  color: ${({ theme }) => theme.textColor};
`;

// 문제 상세 확인용 아코디언
const DetailRow = styled.tr`
  background: ${({ theme }) => theme.bgColor};
`;

const DetailBox = styled.td`
  padding: 20px 24px;
  border-top: 1px solid ${({ theme }) => theme.muteColor};
  background: ${({ theme }) => theme.bgCardColor};
  color: ${({ theme }) => theme.textColor};
  font-size: 16px;
  line-height: 1.6; /* 줄 간격 */

  & > div {
    margin-bottom: 10px; /* 각 항목 간 간격 */
  }
`;

// 페이지네이션 바
const PaginationBar = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  font-size: 13px;
`;

const PageButton = styled.button<{ disabled?: boolean }>`
  border: none;
  background: transparent;
  padding: 4px 6px;
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  color: ${({ theme, disabled }) =>
    disabled ? theme.muteColor : theme.textColor};

  &:hover {
    text-decoration: ${({ disabled }) => (disabled ? "none" : "underline")};
  }
`;

const SectionHeader = styled.div`
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  margin: 10px 0 4px;
  color: ${({ theme }) => theme.textColor};

  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    opacity: 0.8;
  }
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center; /* 가운데 정렬 */
  margin-top: 8px;
`;

/* -----------------------------------------------------
   Component Logic
----------------------------------------------------- */

export default function ProblemManagementScreen() {
  const [problems, setProblems] = useState<ProblemItem[]>([]); // 제출된 문제
  const [search, setSearch] = useState("");
  const [selectedPendingId, setSelectedPendingId] = useState<number | null>(
    null
  );
  const [selectedMyId, setSelectedMyId] = useState<number | null>(null);
  const [selectedAllId, setSelectedAllId] = useState<number | null>(null);

  const [openedPendingDetailId, setOpenedPendingDetailId] = useState<
    number | null
  >(null);
  const [openedMyDetailId, setOpenedMyDetailId] = useState<number | null>(null);
  const [openedAllDetailId, setOpenedAllDetailId] = useState<number | null>(
    null
  );

  const [allProblems, setAllProblems] = useState<IProblem[]>([]); // 전체 문제
  const [loading, setLoading] = useState(true);

  // 각 섹션 페이지 번호
  const [pendingPage, setPendingPage] = useState(0);
  const [minePage, setMinePage] = useState(0);
  const [allPage, setAllPage] = useState(0);

  //각 섹션 펼치고 접히게
  const [openPendingSection, setOpenPendingSection] = useState(true);
  const [openMineSection, setOpenMineSection] = useState(true);
  const [openAllSection, setOpenAllSection] = useState(true);

  const difficultyLabelMap: Record<Difficulty, string> = {
    EASY: "쉬움",
    MEDIUM: "보통",
    HARD: "어려움",
  };

  const userProfile = useAtomValue(userProfileAtom) ?? {
    nickname: "guest",
    role: "GUEST",
    userId: "0",
  };
  const isManager = userProfile.role === "MANAGER";

  const queryClient = useQueryClient();

  // 제출된 문제 목록
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPendingProblemList({ page: 0, size: 100 });
        setProblems(data.content);
      } catch (e) {
        console.error(e);
        alert("문제 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 전체 문제 목록
  useEffect(() => {
    (async () => {
      try {
        const all = await fetchProblems();
        setAllProblems(all);
      } catch (e) {
        console.error(e);
        alert("전체 문제 목록을 불러오지 못했습니다.");
      }
    })();
  }, []);

  // 제출된 문제 검색 필터
  const filtered = useMemo(() => {
    if (!search.trim()) return problems;
    const q = search.toLowerCase();
    return problems.filter((p) => {
      const author = p.createdByNickname ?? "";
      return (
        p.title.toLowerCase().includes(q) ||
        author.toLowerCase().includes(q) ||
        DIFFICULTY_LABEL[p.difficulty].toLowerCase().includes(q)
      );
    });
  }, [problems, search]);

  // 내가 제출한 문제 (react-query)
  const { data: myProblemsPage } = useQuery({
    queryKey: ["myProblems"],
    queryFn: () => fetchMyProblems(0, 100),
  });

  const filteredMine: IProblem[] = myProblemsPage?.content ?? [];

  // 페이지네이션 계산
  const pendingTotalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE) || 1
  );
  const mineTotalPages = Math.max(
    1,
    Math.ceil(filteredMine.length / PAGE_SIZE) || 1
  );
  const allTotalPages = Math.max(
    1,
    Math.ceil(allProblems.length / PAGE_SIZE) || 1
  );

  const pagedPending = useMemo(() => {
    const start = pendingPage * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, pendingPage]);

  const pagedMine = useMemo(() => {
    const start = minePage * PAGE_SIZE;
    return filteredMine.slice(start, start + PAGE_SIZE);
  }, [filteredMine, minePage]);

  const pagedAll = useMemo(() => {
    const start = allPage * PAGE_SIZE;
    return allProblems.slice(start, start + PAGE_SIZE);
  }, [allProblems, allPage]);

  // 아이템 개수 줄어들면 현재 페이지 클램프
  useEffect(() => {
    setPendingPage((prev) => {
      const max = Math.max(0, Math.ceil(filtered.length / PAGE_SIZE) - 1);
      return Math.min(prev, max);
    });
  }, [filtered.length]);

  useEffect(() => {
    setMinePage((prev) => {
      const max = Math.max(0, Math.ceil(filteredMine.length / PAGE_SIZE) - 1);
      return Math.min(prev, max);
    });
  }, [filteredMine.length]);

  useEffect(() => {
    setAllPage((prev) => {
      const max = Math.max(0, Math.ceil(allProblems.length / PAGE_SIZE) - 1);
      return Math.min(prev, max);
    });
  }, [allProblems.length]);

  // 선택된 문제들
  const selectedPending = useMemo(
    () => filtered.find((p) => p.problemId === selectedPendingId) ?? null,
    [filtered, selectedPendingId]
  );

  const selectedMine = useMemo(
    () => filteredMine.find((p) => p.problemId === selectedMyId) ?? null,
    [filteredMine, selectedMyId]
  );

  const selectedAll = useMemo(
    () => allProblems.find((p) => p.problemId === selectedAllId) ?? null,
    [allProblems, selectedAllId]
  );

  // 최종 "선택된 문제" (상단 버튼들이 이것 기준)
  const selectedProblem: { problemId: number; title: string } | null =
    (selectedPending as any) ??
    (selectedMine as any) ??
    (selectedAll as any) ??
    null;

  // 상세 조회 (공통)
  const { data: selectedProblemDetail } = useQuery({
    queryKey: ["problemDetail", selectedProblem?.problemId],
    queryFn: () => fetchProblemDetail(selectedProblem!.problemId),
    enabled: !!selectedProblem?.problemId,
  });

  const hasSelection = !!selectedProblem;

  // 검색 변경
  const handleChange = (value: string) => {
    setSearch(value);
    setSelectedPendingId(null);
    setSelectedMyId(null);
    setSelectedAllId(null);
    setOpenedPendingDetailId(null);
    setOpenedMyDetailId(null);
    setOpenedAllDetailId(null);
    setPendingPage(0);
  };

  // 각 목록에서 행 선택
  const handleSelectPending = (problemId: number) => {
    setSelectedPendingId((prev) => (prev === problemId ? null : problemId));
    setSelectedMyId(null);
    setSelectedAllId(null);
    setOpenedMyDetailId(null);
    setOpenedAllDetailId(null);
  };

  const handleSelectMine = (problemId: number) => {
    setSelectedMyId((prev) => (prev === problemId ? null : problemId));
    setSelectedPendingId(null);
    setSelectedAllId(null);
    setOpenedPendingDetailId(null);
    setOpenedAllDetailId(null);
  };

  const handleSelectAll = (problemId: number) => {
    setSelectedAllId((prev) => (prev === problemId ? null : problemId));
    setSelectedPendingId(null);
    setSelectedMyId(null);
    setOpenedPendingDetailId(null);
    setOpenedMyDetailId(null);
  };

  // 상단: 문제 상세 보기 버튼 → 아코디언 토글
  const handleViewDetail = () => {
    if (!selectedProblem) return;

    if (selectedPending) {
      setOpenedPendingDetailId((prev) =>
        prev === selectedPending.problemId ? null : selectedPending.problemId
      );
      setOpenedMyDetailId(null);
      setOpenedAllDetailId(null);
      return;
    }

    if (selectedMine) {
      setOpenedMyDetailId((prev) =>
        prev === selectedMine.problemId ? null : selectedMine.problemId
      );
      setOpenedPendingDetailId(null);
      setOpenedAllDetailId(null);
      return;
    }

    if (selectedAll) {
      setOpenedAllDetailId((prev) =>
        prev === selectedAll.problemId ? null : selectedAll.problemId
      );
      setOpenedPendingDetailId(null);
      setOpenedMyDetailId(null);
    }
  };

  const handleDownloadTestcase = async () => {
    if (!selectedProblem) return;

    try {
      const response = await downloadTestcaseFile(selectedProblem.problemId);

      const blob = response.data;
      const url = window.URL.createObjectURL(blob);

      const filename = `testcase_${selectedProblem.problemId}.txt`;

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();

      setTimeout(() => URL.revokeObjectURL(url), 500);
    } catch (err) {
      console.error(err);
      alert("테스트 케이스 다운로드에 실패했습니다.");
    }
  };

  // 문제 승인 (제출된 문제 관리에서만)
  const canManageSelected = !!selectedPending && userProfile.role === "MANAGER";

  const handleRegisterProblem = async () => {
    if (!selectedPending) return;

    if (!window.confirm("이 문제를 승인하시겠습니까?")) return;

    try {
      const res = await approveProblem(selectedPending.problemId);

      alert(res.message);

      // 제출된 문제 목록에서 제거
      setProblems((prev) =>
        prev.filter((p) => p.problemId !== selectedPending.problemId)
      );
      setSelectedPendingId(null);
      setOpenedPendingDetailId(null);
    } catch (e) {
      console.error("문제 승인 실패:", e);
      alert("문제 승인 중 오류가 발생했습니다.");
    }
  };

  // 반려 / 삭제 버튼 라벨 & 권한
  const deleteButtonLabel = selectedPending ? "문제 반려" : "문제 삭제";

  const canDeleteOrReject =
    !!selectedProblem &&
    ((selectedPending && isManager) ||
      selectedMine ||
      (selectedAll && isManager));

  // 반려 or 삭제 로직
  const handleDeleteOrReject = async () => {
    if (!selectedProblem) return;

    // 1) 제출된 문제 → 반려 API
    if (selectedPending) {
      if (
        !window.confirm(`"${selectedPending.title}" 문제를 반려하시겠습니까?`)
      )
        return;

      try {
        const res = await rejectProblem(selectedPending.problemId);
        alert(res.message || "문제가 반려되었습니다.");

        setProblems((prev) =>
          prev.filter((p) => p.problemId !== selectedPending.problemId)
        );
        setSelectedPendingId(null);
        setOpenedPendingDetailId(null);
      } catch (e) {
        console.error("문제 반려 실패:", e);
        alert("문제 반려 중 오류가 발생했습니다.");
      }
      return;
    }

    // 2) 내가 작성한 문제 or 전체 문제 → 삭제 API
    const target = selectedMine ?? selectedAll;
    if (!target) return;

    if (!window.confirm(`"${target.title}" 문제를 삭제하시겠습니까?`)) return;

    try {
      const res = await deleteProblem(target.problemId);
      alert(res.message || "문제가 삭제되었습니다.");

      // 내가 작성한 문제 목록 invalidate
      queryClient.invalidateQueries({ queryKey: ["myProblems"] });

      // 전체 문제 목록에서 제거
      setAllProblems((prev) =>
        prev.filter((p) => p.problemId !== target.problemId)
      );

      setSelectedMyId(null);
      setSelectedAllId(null);
      setOpenedMyDetailId(null);
      setOpenedAllDetailId(null);
    } catch (e) {
      console.error("문제 삭제 실패:", e);
      alert("문제 삭제 중 오류가 발생했습니다.");
    }
  };

  // 페이지 이동 핸들러
  const handlePendingPrevPage = () => {
    setPendingPage((prev) => Math.max(0, prev - 1));
    setSelectedPendingId(null);
    setOpenedPendingDetailId(null);
  };

  const handlePendingNextPage = () => {
    setPendingPage((prev) => Math.min(pendingTotalPages - 1, prev + 1));
    setSelectedPendingId(null);
    setOpenedPendingDetailId(null);
  };

  const handleMinePrevPage = () => {
    setMinePage((prev) => Math.max(0, prev - 1));
    setSelectedMyId(null);
    setOpenedMyDetailId(null);
  };

  const handleMineNextPage = () => {
    setMinePage((prev) => Math.min(mineTotalPages - 1, prev + 1));
    setSelectedMyId(null);
    setOpenedMyDetailId(null);
  };

  const handleAllPrevPage = () => {
    setAllPage((prev) => Math.max(0, prev - 1));
    setSelectedAllId(null);
    setOpenedAllDetailId(null);
  };

  const handleAllNextPage = () => {
    setAllPage((prev) => Math.min(allTotalPages - 1, prev + 1));
    setSelectedAllId(null);
    setOpenedAllDetailId(null);
  };

  if (loading) {
    return (
      <Wrap>
        <div style={{ padding: 16 }}>문제 목록을 불러오는 중입니다...</div>
      </Wrap>
    );
  }

  return (
    <Wrap>
      <TopBar>
        <SearchInput
          value={search}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="문제 제목 / 난이도 / 작성자 검색"
        />

        <ButtonGroup>
          <ActionButton onClick={handleViewDetail} disabled={!hasSelection}>
            문제 상세 보기
          </ActionButton>
          <ActionButton
            onClick={handleDownloadTestcase}
            disabled={!selectedProblem}
          >
            테스트 케이스 다운로드
          </ActionButton>

          <ActionButton
            onClick={handleRegisterProblem}
            disabled={!canManageSelected}
            title={
              !canManageSelected
                ? "문제 등록은 관리자 권한이 필요합니다."
                : undefined
            }
          >
            문제 등록
          </ActionButton>
          <ActionButton
            onClick={handleDeleteOrReject}
            disabled={!canDeleteOrReject}
            title={
              !canDeleteOrReject
                ? "제출된 문제는 관리자만 반려/삭제할 수 있습니다."
                : undefined
            }
          >
            {deleteButtonLabel}
          </ActionButton>
        </ButtonGroup>
      </TopBar>

      {userProfile.role === "MANAGER" && (
        <>
          <SectionHeader onClick={() => setOpenPendingSection((prev) => !prev)}>
            {openPendingSection} 승인 대기중인 문제
          </SectionHeader>
          {openPendingSection && (
            <>
              <TableWrap>
                <Table>
                  <Thead>
                    <tr>
                      <Th>문제 제목</Th>
                      <Th>난이도</Th>
                      <Th>작성자</Th>
                      <Th>작성일</Th>
                    </tr>
                  </Thead>

                  <tbody>
                    {filtered.length === 0 && (
                      <tr>
                        <Td
                          colSpan={4}
                          style={{ textAlign: "center", opacity: 0.5 }}
                        >
                          문제 목록이 없습니다.
                        </Td>
                      </tr>
                    )}

                    {pagedPending.map((p) => (
                      <>
                        <Tr
                          key={p.problemId}
                          selected={selectedPendingId === p.problemId}
                          onClick={() => handleSelectPending(p.problemId)}
                        >
                          <Td>{p.title}</Td>
                          <Td>{DIFFICULTY_LABEL[p.difficulty]}</Td>
                          <Td>{p.createdByNickname ?? "-"}</Td>
                          <Td>{p.createdAt.split("T")[0]}</Td>
                        </Tr>

                        {openedPendingDetailId === p.problemId &&
                          selectedProblemDetail && (
                            <DetailRow>
                              <DetailBox colSpan={4}>
                                <div>
                                  <strong>문제 ID:</strong>{" "}
                                  {selectedProblemDetail.problemId}
                                </div>
                                <div>
                                  <strong>제목:</strong>{" "}
                                  {selectedProblemDetail.title}
                                </div>
                                <div>
                                  <strong>태그:</strong>{" "}
                                  {selectedProblemDetail.tags.join(", ")}
                                </div>
                                <div>
                                  <strong>난이도:</strong>{" "}
                                  {
                                    DIFFICULTY_LABEL[
                                      selectedProblemDetail.difficulty as Difficulty
                                    ]
                                  }
                                </div>
                                <div>
                                  <strong>조회수:</strong>{" "}
                                  {selectedProblemDetail.viewCount}
                                </div>
                                <div>
                                  <strong>작성자:</strong>{" "}
                                  {selectedProblemDetail.author}
                                </div>
                                <div>
                                  <strong>작성일:</strong>{" "}
                                  {selectedProblemDetail.createdAt}
                                </div>
                                <div>
                                  <strong>설명:</strong>
                                  <div>{selectedProblemDetail.description}</div>
                                </div>
                                <div>
                                  <strong>입출력 예시:</strong>
                                  <div>
                                    {selectedProblemDetail.inputOutputExample}
                                  </div>
                                </div>
                                <div>
                                  <strong>요약:</strong>{" "}
                                  {selectedProblemDetail.summary || "없음"}
                                </div>
                                <div>
                                  <strong>힌트:</strong>{" "}
                                  {selectedProblemDetail.hint || "없음"}
                                </div>
                                <div>
                                  <strong>출처:</strong>{" "}
                                  {selectedProblemDetail.source || "없음"}
                                </div>
                                <div>
                                  <strong>시간 제한:</strong>{" "}
                                  {selectedProblemDetail.timeLimit}ms
                                </div>
                                <div>
                                  <strong>메모리 제한:</strong>{" "}
                                  {selectedProblemDetail.memoryLimit}MB
                                </div>
                                <div>
                                  <strong>수정 가능 여부(canEdit):</strong>{" "}
                                  {selectedProblemDetail.canEdit
                                    ? "가능"
                                    : "불가능"}
                                </div>
                                <div>
                                  <strong>허용 언어:</strong>{" "}
                                  {selectedProblemDetail.allowedLanguages
                                    ?.length
                                    ? selectedProblemDetail.allowedLanguages.join(
                                        ", "
                                      )
                                    : "없음"}
                                </div>
                              </DetailBox>
                            </DetailRow>
                          )}
                      </>
                    ))}
                  </tbody>
                </Table>
              </TableWrap>

              {filtered.length > 0 && (
                <PaginationWrapper>
                  <PaginationBar>
                    <PageButton
                      onClick={handlePendingPrevPage}
                      disabled={pendingPage === 0}
                    >
                      {"< 이전"}
                    </PageButton>
                    <span>
                      {" | "}
                      {pendingPage + 1} / {pendingTotalPages}
                      {" | "}
                    </span>
                    <PageButton
                      onClick={handlePendingNextPage}
                      disabled={pendingPage >= pendingTotalPages - 1}
                    >
                      {"다음 >"}
                    </PageButton>
                  </PaginationBar>
                </PaginationWrapper>
              )}
            </>
          )}
        </>
      )}

      {/* 2) 내가 작성한 문제 */}
      <SectionHeader onClick={() => setOpenMineSection((prev) => !prev)}>
        {openMineSection} 내가 작성한 문제
      </SectionHeader>
      {openMineSection && (
        <>
          <TableWrap>
            <Table>
              <Thead>
                <tr>
                  <Th>문제 제목</Th>
                  <Th>난이도</Th>
                  <Th>작성일</Th>
                </tr>
              </Thead>

              <tbody>
                {filteredMine.length === 0 && (
                  <tr>
                    <Td
                      colSpan={4}
                      style={{ textAlign: "center", opacity: 0.5 }}
                    >
                      내가 제출한 문제가 없습니다.
                    </Td>
                  </tr>
                )}

                {pagedMine.map((p) => (
                  <>
                    <Tr
                      key={p.problemId}
                      selected={selectedMyId === p.problemId}
                      onClick={() => handleSelectMine(p.problemId)}
                    >
                      <Td>{p.title}</Td>
                      <Td>{difficultyLabelMap[p.difficulty as Difficulty]}</Td>
                      <Td>
                        {typeof p.createdAt === "string"
                          ? p.createdAt.split("T")[0]
                          : ""}
                      </Td>
                    </Tr>

                    {openedMyDetailId === p.problemId &&
                      selectedProblemDetail && (
                        <DetailRow>
                          <DetailBox colSpan={4}>
                            <div>
                              <strong>문제 ID:</strong>{" "}
                              {selectedProblemDetail.problemId}
                            </div>
                            <div>
                              <strong>제목:</strong>{" "}
                              {selectedProblemDetail.title}
                            </div>
                            <div>
                              <strong>태그:</strong>{" "}
                              {selectedProblemDetail.tags.join(", ")}
                            </div>
                            <div>
                              <strong>난이도:</strong>{" "}
                              {
                                DIFFICULTY_LABEL[
                                  selectedProblemDetail.difficulty as Difficulty
                                ]
                              }
                            </div>
                            <div>
                              <strong>조회수:</strong>{" "}
                              {selectedProblemDetail.viewCount}
                            </div>
                            <div>
                              <strong>작성자:</strong>{" "}
                              {selectedProblemDetail.author}
                            </div>
                            <div>
                              <strong>작성일:</strong>{" "}
                              {selectedProblemDetail.createdAt}
                            </div>
                            <div>
                              <strong>설명:</strong>
                              <div>{selectedProblemDetail.description}</div>
                            </div>
                            <div>
                              <strong>입출력 예시:</strong>
                              <div>
                                {selectedProblemDetail.inputOutputExample}
                              </div>
                            </div>
                            <div>
                              <strong>요약:</strong>{" "}
                              {selectedProblemDetail.summary || "없음"}
                            </div>
                            <div>
                              <strong>힌트:</strong>{" "}
                              {selectedProblemDetail.hint || "없음"}
                            </div>
                            <div>
                              <strong>출처:</strong>{" "}
                              {selectedProblemDetail.source || "없음"}
                            </div>
                            <div>
                              <strong>시간 제한:</strong>{" "}
                              {selectedProblemDetail.timeLimit}ms
                            </div>
                            <div>
                              <strong>메모리 제한:</strong>{" "}
                              {selectedProblemDetail.memoryLimit}MB
                            </div>
                            <div>
                              <strong>수정 가능 여부(canEdit):</strong>{" "}
                              {selectedProblemDetail.canEdit
                                ? "가능"
                                : "불가능"}
                            </div>
                            <div>
                              <strong>허용 언어:</strong>{" "}
                              {selectedProblemDetail.allowedLanguages?.length
                                ? selectedProblemDetail.allowedLanguages.join(
                                    ", "
                                  )
                                : "없음"}
                            </div>
                          </DetailBox>
                        </DetailRow>
                      )}
                  </>
                ))}
              </tbody>
            </Table>
          </TableWrap>

          {filteredMine.length > 0 && (
            <PaginationWrapper>
              <PaginationBar>
                <PageButton
                  onClick={handleMinePrevPage}
                  disabled={minePage === 0}
                >
                  {"< 이전"}
                </PageButton>
                <span>
                  {" | "}
                  {minePage + 1} / {mineTotalPages}
                  {" | "}
                </span>
                <PageButton
                  onClick={handleMineNextPage}
                  disabled={minePage >= mineTotalPages - 1}
                >
                  {"다음 >"}
                </PageButton>
              </PaginationBar>
            </PaginationWrapper>
          )}
        </>
      )}

      {/* 3) 전체 문제 관리 */}
      <SectionHeader onClick={() => setOpenAllSection((prev) => !prev)}>
        {openAllSection} 전체 문제 관리
      </SectionHeader>

      {openAllSection && (
        <>
          <TableWrap>
            <Table>
              <Thead>
                <tr>
                  <Th>문제 제목</Th>
                  <Th>난이도</Th>
                  <Th>작성일</Th>
                </tr>
              </Thead>

              <tbody>
                {allProblems.length === 0 && (
                  <tr>
                    <Td
                      colSpan={4}
                      style={{ textAlign: "center", opacity: 0.5 }}
                    >
                      전체 문제가 없습니다.
                    </Td>
                  </tr>
                )}

                {pagedAll.map((p) => (
                  <>
                    <Tr
                      key={p.problemId}
                      selected={selectedAllId === p.problemId}
                      onClick={() => handleSelectAll(p.problemId)}
                    >
                      <Td>{p.title}</Td>
                      <Td>{difficultyLabelMap[p.difficulty as Difficulty]}</Td>
                      <Td>
                        {typeof p.createdAt === "string"
                          ? p.createdAt.split("T")[0]
                          : ""}
                      </Td>
                    </Tr>

                    {openedAllDetailId === p.problemId &&
                      selectedProblemDetail && (
                        <DetailRow>
                          <DetailBox colSpan={4}>
                            <div>
                              <strong>문제 ID:</strong>{" "}
                              {selectedProblemDetail.problemId}
                            </div>
                            <div>
                              <strong>제목:</strong>{" "}
                              {selectedProblemDetail.title}
                            </div>
                            <div>
                              <strong>태그:</strong>{" "}
                              {selectedProblemDetail.tags.join(", ")}
                            </div>
                            <div>
                              <strong>난이도:</strong>{" "}
                              {
                                DIFFICULTY_LABEL[
                                  selectedProblemDetail.difficulty as Difficulty
                                ]
                              }
                            </div>
                            <div>
                              <strong>조회수:</strong>{" "}
                              {selectedProblemDetail.viewCount}
                            </div>
                            <div>
                              <strong>작성자:</strong>{" "}
                              {selectedProblemDetail.author}
                            </div>
                            <div>
                              <strong>작성일:</strong>{" "}
                              {selectedProblemDetail.createdAt}
                            </div>
                            <div>
                              <strong>설명:</strong>
                              <div>{selectedProblemDetail.description}</div>
                            </div>
                            <div>
                              <strong>입출력 예시:</strong>
                              <div>
                                {selectedProblemDetail.inputOutputExample}
                              </div>
                            </div>
                            <div>
                              <strong>요약:</strong>{" "}
                              {selectedProblemDetail.summary || "없음"}
                            </div>
                            <div>
                              <strong>힌트:</strong>{" "}
                              {selectedProblemDetail.hint || "없음"}
                            </div>
                            <div>
                              <strong>출처:</strong>{" "}
                              {selectedProblemDetail.source || "없음"}
                            </div>
                            <div>
                              <strong>시간 제한:</strong>{" "}
                              {selectedProblemDetail.timeLimit}ms
                            </div>
                            <div>
                              <strong>메모리 제한:</strong>{" "}
                              {selectedProblemDetail.memoryLimit}MB
                            </div>
                            <div>
                              <strong>수정 가능 여부(canEdit):</strong>{" "}
                              {selectedProblemDetail.canEdit
                                ? "가능"
                                : "불가능"}
                            </div>
                            <div>
                              <strong>허용 언어:</strong>{" "}
                              {selectedProblemDetail.allowedLanguages?.length
                                ? selectedProblemDetail.allowedLanguages.join(
                                    ", "
                                  )
                                : "없음"}
                            </div>
                          </DetailBox>
                        </DetailRow>
                      )}
                  </>
                ))}
              </tbody>
            </Table>
          </TableWrap>

          {allProblems.length > 0 && (
            <PaginationWrapper>
              <PaginationBar>
                <PageButton
                  onClick={handleAllPrevPage}
                  disabled={allPage === 0}
                >
                  {"< 이전"}
                </PageButton>
                <span>
                  {" | "}
                  {allPage + 1} / {allTotalPages}
                  {" | "}
                </span>
                <PageButton
                  onClick={handleAllNextPage}
                  disabled={allPage >= allTotalPages - 1}
                >
                  {"다음 >"}
                </PageButton>
              </PaginationBar>
            </PaginationWrapper>
          )}
        </>
      )}
    </Wrap>
  );
}

import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  ProblemListWrapper,
  PageTitle,
  ControlBar,
  SearchContainer,
  SearchInput,
  SearchButton,
  SortSelect,
  ProblemTable,
  TableHead,
  HeaderCell,
  TableRow,
  TableCell,
  EmptyCell,
  TitleCell,
  SummaryRow,
  SummaryBox,
  TitleContainer,
  ActionInSummaryButton,
  PaginationContainer,
  PageLink,
  DetailsButton,
  ButtonContainer,
  PageTitleContainer,
  AddButton,
  TagDisplayContainer,
  TagChip,
  ProblemTagChip,
  TagChipForList,
} from "../../theme/ProblemList.Style";

import type { UserProblemStatus } from "../../theme/ProblemList.Style";
import type { IProblem } from "../../api/problem_api";

import {
  fetchProblems,
  fetchAvailableTags,
  TAG_LABEL_MAP,
} from "../../api/problem_api";

import { useAtomValue } from "jotai";
import { userProfileAtom } from "../../atoms";

export default function ProblemList() {
  const navigate = useNavigate();

  // 로그인 정보
  const user = useAtomValue(userProfileAtom);
  const isLoggedIn = !!user;

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("latest");
  const [expandedProblemId, setExpandedProblemId] = useState<number | null>(
    null
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [filter, setFilter] = useState<
    "off" | "SOLVED" | "ATTEMPTED" | "tried"
  >("off");

  const [problems, setProblems] = useState<IProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initialTags = searchParams.get("tag") ? [searchParams.get("tag")!] : [];
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);

  // 태그 로딩
  useEffect(() => {
    const loadAvailableTags = async () => {
      try {
        const tags = await fetchAvailableTags();
        setAvailableTags(Array.isArray(tags) ? tags : []);
      } catch {
        console.error("태그 불러오기 실패");
        setAvailableTags([]);
      }
    };
    loadAvailableTags();
  }, []);

  // 문제 목록 로딩
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const real = await fetchProblems(); // 1) 문제 목록 가져오기

        // 백엔드 상태 → 프런트 상태로 변환
        const mapped = real.map((p) => {
          const raw = p.userStatus as
            | "CORRECT"
            | "INCORRECT"
            | "NOT_SOLVED"
            | undefined;

          const mappedStatus: UserProblemStatus =
            raw === "CORRECT"
              ? "SOLVED"
              : raw === "INCORRECT"
              ? "ATTEMPTED"
              : "NOT_SOLVED";

          return {
            ...p,
            userStatus: mappedStatus,
          };
        });

        if (mounted) setProblems(mapped); // 3) 변환된 상태로 저장
      } catch (e) {
        console.error("문제 목록 로딩 실패:", e);
        setError("문제 목록을 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [sortType, selectedTags, isLoggedIn]);

  // 태그 클릭 시
  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      let newTags;

      if (prev.includes(tag)) {
        newTags = prev.filter((t) => t !== tag);
      } else {
        newTags = [...prev, tag];
      }

      // URL 동기화
      if (newTags.length > 0) {
        setSearchParams({ tag: newTags[0] });
      } else {
        setSearchParams({});
      }

      setCurrentPage(1);
      return newTags;
    });
  };

  // 검색
  const handleSearch = () => {
    if (searchTerm.trim().length === 0) {
      alert("검색어를 입력해 주세요.");
      return;
    }
    if (searchTerm.trim().length < 2) {
      alert("두 글자 이상 입력해 주세요.");
      return;
    }
    setCurrentPage(1);
  };

  // 요약 토글
  const handleToggleSummary = (problemId: number) => {
    setExpandedProblemId((curr) => (curr === problemId ? null : problemId));
  };

  // 바로 해결
  const handleDirectSolve = (problemId: number) => {
    if (!isLoggedIn) return alert("로그인 후 이용 가능합니다.");
    navigate(`/problems/${problemId}/solve`);
  };

  // 상세 보기
  const handleViewDetails = (problemId: number) => {
    navigate(`/problem-detail/${problemId}`);
  };

  // 기록 필터
  // 태그 + 기록 필터 함께 적용
  // 난이도 정렬을 위한 순위 매핑
  const difficultyRank = (d: string) => {
    if (d === "EASY") return 1;
    if (d === "MEDIUM") return 2;
    if (d === "HARD") return 3;
    return 999;
  };

  // 필터 적용
  const filteredProblems = problems.filter((problem) => {
    // 1) 태그 필터
    if (selectedTags.length > 0) {
      if (
        !problem.tags ||
        !problem.tags.some((t) => selectedTags.includes(t))
      ) {
        return false;
      }
    }

    // 2) 기록 필터
    if (filter === "off") return true;

    if (filter === "tried") {
      return (
        problem.userStatus === "SOLVED" || problem.userStatus === "ATTEMPTED"
      );
    }

    if (filter === "SOLVED") return problem.userStatus === "SOLVED";
    if (filter === "ATTEMPTED") return problem.userStatus === "ATTEMPTED";

    return true;
  });

  // 🔥 정렬 적용 (프런트에서 직접 정렬)
  if (sortType === "latest") {
    // createdAt 내림차순 (최신순)
    filteredProblems.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
  } else if (sortType === "low_difficulty") {
    filteredProblems.sort(
      (a, b) => difficultyRank(a.difficulty) - difficultyRank(b.difficulty)
    );
  } else if (sortType === "high_difficulty") {
    filteredProblems.sort(
      (a, b) => difficultyRank(b.difficulty) - difficultyRank(a.difficulty)
    );
  } else if (sortType === "views") {
    filteredProblems.sort((a, b) => b.viewCount - a.viewCount);
  } else if (sortType === "id") {
    filteredProblems.sort((a, b) => a.problemId - b.problemId);
  }

  // 페이지네이션 계산
  const totalItems = filteredProblems.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // 화면에 보여줄 문제 리스트
  const currentProblems = filteredProblems.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (number: number) => {
    if (number >= 1 && number <= totalPages) setCurrentPage(number);
  };

  return (
    <ProblemListWrapper>
      <PageTitleContainer>
        <PageTitle>문제 목록</PageTitle>

        {(user?.role === "INSTRUCTOR" || user?.role === "MANAGER") && (
          <AddButton onClick={() => navigate("/problem-add")}>
            문제 추가
          </AddButton>
        )}
      </PageTitleContainer>

      <ControlBar>
        {/* 검색 */}
        <SearchContainer>
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="문제 ID 또는 제목 검색 (2자 이상)"
          />
          <SearchButton onClick={handleSearch}>검색</SearchButton>
        </SearchContainer>

        {/* 정렬 */}
        <SortSelect
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
        >
          <option value="latest">최신순</option>
          <option value="low_difficulty">난이도 낮은 순</option>
          <option value="high_difficulty">난이도 높은 순</option>
          <option value="views">조회수 순</option>
          <option value="id">문제번호 순</option>
        </SortSelect>

        {/* 기록 필터 */}
        {isLoggedIn && (
          <SortSelect
            value={filter}
            onChange={(e) =>
              setFilter(
                e.target.value as "off" | "SOLVED" | "ATTEMPTED" | "tried"
              )
            }
            style={{ marginRight: "10px" }}
          >
            <option value="off">기록 필터</option>
            <option value="tried">전체 시도 문제</option>
            <option value="SOLVED">맞은 문제</option>
            <option value="ATTEMPTED">시도 문제</option>
          </SortSelect>
        )}
      </ControlBar>

      {/* 태그 목록 */}
      {availableTags.length > 0 && (
        <TagDisplayContainer
          style={{ maxWidth: "1200px", margin: "10px auto" }}
        >
          {availableTags.map((tag) => (
            <TagChip
              key={tag}
              $active={selectedTags.includes(tag)}
              onClick={() => handleToggleTag(tag)}
            >
              {TAG_LABEL_MAP[tag] ?? tag}
            </TagChip>
          ))}
        </TagDisplayContainer>
      )}

      {/* 로딩 & 에러 */}
      {loading && <p>문제 목록을 불러오는 중...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* 문제 테이블 */}
      <ProblemTable>
        <TableHead>
          <tr>
            <HeaderCell width="8%">번호</HeaderCell>
            <HeaderCell width="30%">문제 제목</HeaderCell>
            <HeaderCell width="25%">태그</HeaderCell>
            <HeaderCell width="10%">난이도</HeaderCell>
            <HeaderCell width="13%">조회수</HeaderCell>
            <HeaderCell width="14%">등록일</HeaderCell>
            {isLoggedIn && <HeaderCell width="10%">기록</HeaderCell>}
          </tr>
        </TableHead>

        <tbody>
          {currentProblems.length > 0 ? (
            currentProblems.map((problem) => (
              <React.Fragment key={problem.problemId}>
                <TableRow $userStatus={problem.userStatus as UserProblemStatus}>
                  <TableCell>{problem.problemId}</TableCell>

                  <TitleCell>
                    <TitleContainer>
                      <span
                        style={{ cursor: "pointer", fontWeight: 600 }}
                        onClick={() => handleToggleSummary(problem.problemId)}
                      >
                        {problem.title}
                      </span>
                    </TitleContainer>
                  </TitleCell>

                  <TableCell>
                    {problem.tags?.map((t) => (
                      <TagChipForList key={t}>
                        {TAG_LABEL_MAP[t] ?? t}
                      </TagChipForList>
                    ))}
                  </TableCell>

                  <TableCell>{problem.difficulty}</TableCell>
                  <TableCell>{problem.viewCount}</TableCell>
                  <TableCell>{problem.createdAt}</TableCell>

                  {isLoggedIn && (
                    <TableCell>
                      <ProblemTagChip $status={problem.userStatus}>
                        {problem.userStatus === "SOLVED"
                          ? "맞음"
                          : problem.userStatus === "ATTEMPTED"
                          ? "시도"
                          : ""}
                      </ProblemTagChip>
                    </TableCell>
                  )}
                </TableRow>

                {/* Summary Section */}
                {expandedProblemId === problem.problemId && (
                  <SummaryRow>
                    <TableCell colSpan={isLoggedIn ? 7 : 6}>
                      <SummaryBox>
                        <div>
                          <p>
                            <strong>요약:</strong> {problem.summary}
                          </p>
                          <p>
                            <strong>푼 사람:</strong> {problem.solvedCount} |
                            <strong> 정답률:</strong> {problem.successRate}
                          </p>
                        </div>

                        <ButtonContainer>
                          <DetailsButton
                            onClick={() => handleViewDetails(problem.problemId)}
                          >
                            상세보기
                          </DetailsButton>

                          {isLoggedIn && (
                            <ActionInSummaryButton
                              onClick={() =>
                                handleDirectSolve(problem.problemId)
                              }
                            >
                              바로 코드 작성
                            </ActionInSummaryButton>
                          )}
                        </ButtonContainer>
                      </SummaryBox>
                    </TableCell>
                  </SummaryRow>
                )}
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <EmptyCell colSpan={7}>문제가 없습니다.</EmptyCell>
            </TableRow>
          )}
        </tbody>
      </ProblemTable>

      {/* 페이지네이션 */}
      <PaginationContainer>
        <PageLink
          onClick={() => handlePageChange(currentPage - 1)}
          isDisabled={currentPage === 1}
        >
          &lt; 이전
        </PageLink>

        {Array.from({ length: totalPages }, (_, idx) => (
          <PageLink
            key={idx}
            onClick={() => handlePageChange(idx + 1)}
            isActive={currentPage === idx + 1}
          >
            {idx + 1}
          </PageLink>
        ))}

        <PageLink
          onClick={() => handlePageChange(currentPage + 1)}
          isDisabled={currentPage === totalPages}
        >
          다음 &gt;
        </PageLink>
      </PaginationContainer>
    </ProblemListWrapper>
  );
}

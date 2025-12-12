import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ProblemWrapper,
  MainContent,
  DescriptionSection,
  SectionHeader,
} from "../../../theme/ProblemDetail.Style";

import {
  ProblemListWrapper,
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
  PaginationContainer,
  PageLink,
  ButtonContainer,
} from "../../../theme/ProblemList.Style";

import styled from "styled-components";
import { useAtomValue } from "jotai";
import { userProfileAtom } from "../../../atoms";

import ProblemMeta from "../../../components/ProblemMeta";
import type { IProblem } from "../../../api/problem_api";
import { fetchProblemDetail } from "../../../api/problem_api";

import {
  fetchSharedSolutionsByProblem,
  type SharedSolution,
} from "../../../api/publicSubmission_api";

const DetailsButton = styled.button`
  padding: 8px 14px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.logoColor ?? theme.textColor + "40"};
  background: transparent;
  color: ${({ theme }) => theme.textColor};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  line-height: 1;

  &:hover {
    background: ${({ theme }) => theme.logoColor ?? theme.textColor + "20"};
  }

  &:active {
    transform: translateY(1px);
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
    transform: none;
  }
`;

export default function SolvedProblemListPage() {
  const navigate = useNavigate();
  const { problemId } = useParams<{ problemId: string }>();

  const user = useAtomValue(userProfileAtom);
  const isLoggedIn = !!user;

  const [problem, setProblem] = useState<IProblem | null>(null);
  const [solutions, setSolutions] = useState<SharedSolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState<"latest" | "memory" | "time">(
    "latest"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!problemId) return;

    const numericId = Number(problemId);
    if (Number.isNaN(numericId)) {
      setError("잘못된 문제 ID입니다.");
      setLoading(false);
      return;
    }

    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        // 문제 정보 + 공유된 풀이 목록을 병렬로 가져오기
        const [problemDto, sharedPage] = await Promise.all([
          fetchProblemDetail(numericId),
          fetchSharedSolutionsByProblem(numericId),
        ]);

        if (!mounted) return;

        setProblem(problemDto ? problemDto : null);
        setSolutions(sharedPage.items ?? []);
      } catch (e) {
        console.error("공유 풀이 목록 로드 오류:", e);
        if (mounted) {
          setError("공유된 풀이 목록을 불러올 수 없습니다.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [problemId]);

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const filteredSolutions = solutions
    .filter((s) => {
      const keyword = searchTerm.trim().toLowerCase();
      if (!keyword) return true;
      return (
        s.language.toLowerCase().includes(keyword) ||
        s.nickname.toLowerCase().includes(keyword)
      );
    })
    .sort((a, b) => {
      if (sortType === "latest") {
        return b.submittedAt.localeCompare(a.submittedAt);
      }
      if (sortType === "memory") {
        const memA = a.memory ?? Number.MAX_SAFE_INTEGER;
        const memB = b.memory ?? Number.MAX_SAFE_INTEGER;
        return memA - memB;
      }
      if (sortType === "time") {
        const runA = a.runtime ?? Number.MAX_SAFE_INTEGER;
        const runB = b.runtime ?? Number.MAX_SAFE_INTEGER;
        return runA - runB;
      }
      return 0;
    });

  const totalItems = filteredSolutions.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSolutions = filteredSolutions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleViewSolutionDetail = (submissionId: number) => {
    if (!isLoggedIn) {
      alert("로그인 후 이용 가능합니다.");
      return;
    }
    // /problems/:problemId/solutions/:submissionId 이런 라우트라고 가정
    navigate(`${submissionId}`);
  };

  if (loading && !problem) {
    return <ProblemWrapper>로딩 중...</ProblemWrapper>;
  }

  if (error && !problem) {
    return <ProblemWrapper>{error}</ProblemWrapper>;
  }

  return (
    <ProblemWrapper>
      <MainContent>
        {problem && <ProblemMeta problem={problem} />}

        <DescriptionSection>
          <SectionHeader>
            <h3>공유된 풀이 목록</h3>
          </SectionHeader>

          <ProblemListWrapper>
            <ControlBar>
              <SearchContainer>
                <SearchInput
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="작성자 또는 언어로 검색"
                  onKeyPress={handleKeyPress}
                />
                <SearchButton onClick={handleSearch}>검색</SearchButton>
              </SearchContainer>

              <SortSelect
                value={sortType}
                onChange={(e) =>
                  setSortType(e.target.value as "latest" | "memory" | "time")
                }
              >
                <option value="latest">최신순</option>
                <option value="memory">메모리 적은순</option>
                <option value="time">실행시간 빠른순</option>
              </SortSelect>
            </ControlBar>

            {loading && <p>공유된 풀이를 불러오는 중...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <ProblemTable>
              <TableHead>
                <tr>
                  <HeaderCell width="7%">번호</HeaderCell>
                  <HeaderCell width="20%">작성자</HeaderCell>
                  <HeaderCell width="16%">언어</HeaderCell>
                  <HeaderCell width="10%">메모리</HeaderCell>
                  <HeaderCell width="10%">실행시간</HeaderCell>
                  <HeaderCell width="22%">제출일</HeaderCell>
                  <HeaderCell width="15%">보기</HeaderCell>
                </tr>
              </TableHead>

              <tbody>
                {currentSolutions.length > 0 ? (
                  currentSolutions.map((s, idx) => (
                    <TableRow key={s.submissionId}>
                      <TableCell>{indexOfFirstItem + idx + 1}</TableCell>
                      <TableCell>{s.nickname}</TableCell>
                      <TableCell>{s.language}</TableCell>
                      <TableCell>
                        {s.memory != null ? `${s.memory} MB` : "-"}
                      </TableCell>
                      <TableCell>
                        {s.runtime != null ? `${s.runtime} ms` : "-"}
                      </TableCell>
                      <TableCell>
                        {new Date(s.submittedAt).toLocaleString("ko-KR")}
                      </TableCell>
                      <TableCell>
                        <ButtonContainer>
                          <DetailsButton
                            onClick={() =>
                              handleViewSolutionDetail(s.submissionId)
                            }
                          >
                            코드 보기
                          </DetailsButton>
                        </ButtonContainer>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <EmptyCell colSpan={7}>
                      공유된 풀이가 아직 없습니다.
                    </EmptyCell>
                  </TableRow>
                )}
              </tbody>
            </ProblemTable>

            <PaginationContainer>
              <PageLink
                onClick={() => handlePageChange(currentPage - 1)}
                isDisabled={currentPage === 1}
              >
                &lt; 이전
              </PageLink>

              {Array.from({ length: totalPages }, (_, index) => (
                <PageLink
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
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
        </DescriptionSection>
      </MainContent>
    </ProblemWrapper>
  );
}

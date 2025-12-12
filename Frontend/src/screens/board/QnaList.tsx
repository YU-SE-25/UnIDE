// src/pages/qna/QnaList.tsx
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import {
  ProblemListWrapper as BoardListWrapper,
  PageTitle,
  ControlBar,
  SearchContainer,
  SearchInput,
  SearchButton,
  SortSelect,
  ProblemTable as BoardTable,
  TableHead,
  HeaderCell,
  TableRow,
  TableCell,
  EmptyCell,
  TitleCell,
  PaginationContainer,
  PageLink,
  PageTitleContainer,
  AddButton,
} from "../../theme/ProblemList.Style";
import QnaDetail from "./QnaDetail";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchqnaList } from "../../api/qna_api";
import { isOwner } from "../../utils/isOwner";
import { myRole } from "../../utils/myRole";
import type { BoardContent } from "../board/BoardList";

export interface QnaContent extends BoardContent {
  problem_id: number;
  problem_title?: string;
  problem_difficulty?: "EASY" | "MEDIUM" | "HARD";
}

const PostTitle = styled.span`
  font-size: 16px;
  color: ${(props) => props.theme.textColor};
`;

export default function QnaList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState<"latest" | "id">("id");
  const [currentPage, setCurrentPage] = useState(1);

  const [posts, setPosts] = useState<QnaContent[]>([]);

  // URL에서 ?no=, ?id= 읽기
  const selectedPostId = searchParams.get("no");
  const problemIdParam = searchParams.get("id");
  const problemIdNum = problemIdParam ? Number(problemIdParam) : null;
  // 🔥 서버에서 QnA 목록 가져오기 (페이지 기반)
  const {
    data: qnaPage,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["qnaList", currentPage],
    queryFn: () => fetchqnaList(currentPage), // Discuss와 동일 패턴
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    setPosts((qnaPage?.content as QnaContent[]) ?? []);
  }, [currentPage, qnaPage]);

  // 선택된 게시글
  const selectedPost = useMemo(() => {
    if (!selectedPostId) return null;
    const idNum = Number(selectedPostId);
    if (Number.isNaN(idNum)) return null;
    return posts.find((p) => p.post_id === idNum) ?? null;
  }, [selectedPostId, posts]);

  // 검색 버튼 클릭
  const handleSearch = () => {
    // QnA는 2자 제한 안 걸고 그냥 검색 허용 (원하면 2자 이상으로 바꿀 수 있음)
    setCurrentPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  // 상세 보기
  const handleViewDetails = (post: QnaContent) => {
    if (post.is_private) {
      const canView =
        isOwner({
          author: post.author,
          anonymity: post.anonymity,
        }) || myRole() === "MANAGER";

      if (!canView) {
        alert("비공개 질문은 작성자 또는 관리자만 열람할 수 있습니다.");
        return;
      }
    }

    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("no", String(post.post_id));
        return next;
      },
      { replace: true }
    );
    window.scrollTo(0, 0);
  };

  // 글 쓰기
  const handleWritePost = () => {
    navigate(`/qna/write`);
  };

  // 게시글 필터링 + 정렬
  const filteredAndSortedPosts = useMemo(() => {
    let result = posts;

    // 문제 번호 필터 (?id=)
    if (problemIdNum !== null && !Number.isNaN(problemIdNum)) {
      result = result.filter((post) => post.problem_id === problemIdNum);
    }

    const keyword = searchTerm.trim().toLowerCase();
    if (keyword.length > 0) {
      result = result.filter((post) => {
        const titleMatch = post.post_title.toLowerCase().includes(keyword);
        const problemMatch = post.problem_id
          ?.toString()
          .toLowerCase()
          .includes(keyword);
        return titleMatch || problemMatch;
      });
    }

    result = [...result].sort((a, b) => {
      if (sortType === "latest") {
        return b.create_time.localeCompare(a.create_time);
      }
      if (sortType === "id") {
        return a.post_id - b.post_id;
      }
      return 0;
    });

    return result;
  }, [posts, searchTerm, sortType, problemIdNum]);

  const totalPages = qnaPage?.totalPages ?? 1;
  const currentPosts = filteredAndSortedPosts;

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo(0, 0);
    }
  };

  return (
    <BoardListWrapper>
      <PageTitleContainer
        style={{ flexDirection: "column", alignItems: "flex-start", gap: 8 }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <PageTitle>Q&A 게시판</PageTitle>
          <AddButton onClick={handleWritePost}>질문 쓰기</AddButton>
        </div>
      </PageTitleContainer>

      {selectedPost && (
        <QnaDetail
          post={selectedPost}
          onClose={() =>
            setSearchParams(
              (prev) => {
                const next = new URLSearchParams(prev);
                next.delete("no");
                return next;
              },
              { replace: true }
            )
          }
        />
      )}

      <ControlBar>
        <SearchContainer>
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="제목 / 문제 번호 검색"
            onKeyPress={handleKeyPress}
          />
          <SearchButton onClick={handleSearch}>검색</SearchButton>
        </SearchContainer>

        <SortSelect
          value={sortType}
          onChange={(e) => setSortType(e.target.value as "latest" | "id")}
        >
          <option value="latest">최신순</option>
          <option value="id">번호순</option>
        </SortSelect>
      </ControlBar>

      <BoardTable>
        <TableHead>
          <tr>
            <HeaderCell width="8%">번호</HeaderCell>
            <HeaderCell width="12%">문제번호</HeaderCell>
            <HeaderCell width="45%">제목</HeaderCell>
            <HeaderCell width="10%">댓글</HeaderCell>
            <HeaderCell width="10%">작성자</HeaderCell>
            <HeaderCell width="15%">작성일</HeaderCell>
          </tr>
        </TableHead>

        <tbody>
          {isLoading && posts.length === 0 ? (
            <TableRow>
              <EmptyCell colSpan={5}>게시글을 불러오는 중입니다…</EmptyCell>
            </TableRow>
          ) : currentPosts.length > 0 ? (
            currentPosts.map((post) => (
              <TableRow
                key={post.post_id}
                onClick={() => handleViewDetails(post)}
                style={{ cursor: "pointer" }}
              >
                <TableCell>{post.post_id}</TableCell>
                <TableCell>#{post.problem_id}</TableCell>
                <TitleCell>
                  {post.is_private ? (
                    <PostTitle>🔒 비공개 질문입니다</PostTitle>
                  ) : (
                    <PostTitle>{post.post_title}</PostTitle>
                  )}
                </TitleCell>
                <TableCell>{post.comment_count}</TableCell>
                <TableCell>{post.anonymity ? "익명" : post.author}</TableCell>
                <TableCell>{post.create_time.slice(0, 10)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <EmptyCell colSpan={5}>
                {searchTerm
                  ? "검색된 게시글이 없습니다."
                  : "게시글이 없습니다."}
              </EmptyCell>
            </TableRow>
          )}
        </tbody>
      </BoardTable>

      <PaginationContainer>
        <PageLink
          onClick={() => handlePageChange(currentPage - 1)}
          isDisabled={currentPage === 1}
          aria-disabled={currentPage === 1}
        >
          &lt; 이전
        </PageLink>

        {Array.from({ length: totalPages }, (_, index) => (
          <PageLink
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            isActive={currentPage === index + 1}
          >
            {index + 1}
          </PageLink>
        ))}

        <PageLink
          onClick={() => handlePageChange(currentPage + 1)}
          isDisabled={currentPage === totalPages}
          aria-disabled={currentPage === totalPages}
        >
          다음 &gt;
        </PageLink>
      </PaginationContainer>

      {isFetching && (
        <div style={{ marginTop: 8, fontSize: 12, opacity: 0.6 }}>
          새 게시글을 불러오는 중…
        </div>
      )}
    </BoardListWrapper>
  );
}

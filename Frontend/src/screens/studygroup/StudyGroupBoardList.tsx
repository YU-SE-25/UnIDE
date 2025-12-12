import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getDiscussionList,
  type DiscussionListItem,
} from "../../api/studygroupdiscussion_api";

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

import { useOutletContext } from "react-router-dom";

export default function StudyGroupBoardList() {
  const { groupId } = useOutletContext<{ groupId: number; role: string }>();

  const navigate = useNavigate();

  const [posts, setPosts] = useState<DiscussionListItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState<"latest" | "views" | "id">("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 리스트 API 연결
  useEffect(() => {
    async function load() {
      const res = await getDiscussionList(groupId);

      // 의도치 않은 케이스 방어
      if (!Array.isArray(res)) {
        console.error("API 응답이 배열이 아님:", res);
        setPosts([]);
        return;
      }

      setPosts(res);
    }

    load();
  }, [groupId]);

  const handleSearch = () => {
    if (searchTerm.trim().length < 2) {
      alert("두 글자 이상 입력해 주세요!");
      return;
    }
    setCurrentPage(1);
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleWritePost = () => {
    navigate(`/studygroup/${groupId}/discussion/write`);
  };

  const handleViewDetails = (postId: number) => {
    navigate(`/studygroup/${groupId}/discussion/${postId}`);
  };
  // 필터 + 정렬
  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortType === "latest")
      return (b as any).createdAt?.localeCompare((a as any).createdAt);
    if (sortType === "views") return b.likeCount - a.likeCount;
    if (sortType === "id") return a.postId - b.postId;
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / itemsPerPage) || 1;
  const currentPosts = sorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (num: number) => {
    if (num >= 1 && num <= totalPages) setCurrentPage(num);
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
          <PageTitle>스터디그룹 게시판</PageTitle>
          <AddButton onClick={handleWritePost}>글 쓰기</AddButton>
        </div>
      </PageTitleContainer>

      <ControlBar>
        <SearchContainer>
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="제목 검색 (2자 이상)"
            onKeyPress={handleKeyPress}
          />
          <SearchButton onClick={handleSearch}>검색</SearchButton>
        </SearchContainer>

        <SortSelect
          value={sortType}
          onChange={(e) =>
            setSortType(e.target.value as "latest" | "views" | "id")
          }
        >
          <option value="latest">최신순</option>
          <option value="views">좋아요순</option>
          <option value="id">번호순</option>
        </SortSelect>
      </ControlBar>

      <BoardTable>
        <TableHead>
          <tr>
            <HeaderCell width="8%">번호</HeaderCell>
            <HeaderCell width="55%">제목</HeaderCell>
            <HeaderCell width="12%">작성자ID</HeaderCell>
            <HeaderCell width="10%">좋아요</HeaderCell>
            <HeaderCell width="15%">댓글수</HeaderCell>
          </tr>
        </TableHead>
        <tbody>
          {currentPosts.length > 0 ? (
            currentPosts.map((post) => (
              <TableRow
                key={post.postId}
                onClick={() => handleViewDetails(post.postId)}
                style={{ cursor: "pointer" }}
              >
                <TableCell>{post.postId}</TableCell>
                <TitleCell>{post.title}</TitleCell>
                <TableCell>{post.authorName}</TableCell>
                <TableCell>{post.likeCount}</TableCell>
                <TableCell>{post.commentCount ?? 0}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <EmptyCell colSpan={5}>
                {searchTerm ? "검색 결과 없음" : "게시글 없음"}
              </EmptyCell>
            </TableRow>
          )}
        </tbody>
      </BoardTable>

      <PaginationContainer>
        <PageLink
          onClick={() => handlePageChange(currentPage - 1)}
          isDisabled={currentPage === 1}
        >
          &lt; 이전
        </PageLink>

        {Array.from({ length: totalPages }, (_, i) => (
          <PageLink
            key={i}
            onClick={() => handlePageChange(i + 1)}
            isActive={i + 1 === currentPage}
          >
            {i + 1}
          </PageLink>
        ))}

        <PageLink
          onClick={() => handlePageChange(currentPage + 1)}
          isDisabled={currentPage === totalPages}
        >
          다음 &gt;
        </PageLink>
      </PaginationContainer>
    </BoardListWrapper>
  );
}

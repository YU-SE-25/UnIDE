import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  addToBlacklist,
  fetchUserList,
  updateUserRole,
  fetchInstructorApplications,
  fetchInstructorApplicationDetail,
  downloadPortfolioFile,
  sendApproveInstructorEmail,
} from "../../../api/manage_api";

type Role = "LEARNER" | "INSTRUCTOR" | "MANAGER";

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 30px;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.textColor};
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

const Tr = styled.tr<{ selected?: boolean; noHover?: boolean }>`
  cursor: ${({ noHover }) => (noHover ? "default" : "pointer")};
  background: ${({ selected, theme }) =>
    selected ? theme.focusColor + "33" : theme.bgColor};

  &:hover {
    background: ${({ noHover, selected, theme }) =>
      noHover
        ? theme.bgColor
        : selected
        ? theme.focusColor + "33"
        : theme.bgCardColor};
  }
`;

const Td = styled.td`
  padding: 12px;
  border-top: 1px solid ${({ theme }) => theme.bgCardColor};
  color: ${({ theme }) => theme.textColor};
`;
//유저용 아코디언
const UserDetailRow = styled.tr`
  background: ${({ theme }) => theme.bgColor};
`;

const UserDetailBox = styled.td`
  padding: 16px 20px;
  border-top: 1px solid ${({ theme }) => theme.muteColor};
  background: ${({ theme }) => theme.bgCardColor};
  color: ${({ theme }) => theme.textColor};
  font-size: 18px;
`;

//강사 포토폴리오용
const InstructorDetailRow = styled.tr`
  background: ${({ theme }) => theme.bgColor};
`;

const InstructorDetailBox = styled.td`
  padding: 16px 20px;
  border-top: 1px solid ${({ theme }) => theme.muteColor};
  background: ${({ theme }) => theme.bgCardColor};
  color: ${({ theme }) => theme.textColor};
  font-size: 18px;
`;

//탑바 나누는 class
const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
`;

// 페이지네이션 UI
const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center; /* 가운데 정렬 */
  margin-top: 8px;
`;

const PaginationBar = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  font-size: 13px;
`;

const PageButton = styled.button<{ disabled?: boolean; active?: boolean }>`
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

export default function UserManagementScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [openedUserAccordionId, setOpenedUserAccordionId] = useState<
    number | null
  >(null);
  const [openedInstructorAccordionId, setOpenedInstructorAccordionId] =
    useState<number | null>(null);

  const [instructors, setInstructors] = useState<any[]>([]);
  const [instructorSearch, setInstructorSearch] = useState("");
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    number | null
  >(null);
  const [selectedApplicationDetail, setSelectedApplicationDetail] = useState<
    any | null
  >(null);

  //페이지네이션용
  const [userPage, setUserPage] = useState(0);
  const [instructorPage, setInstructorPage] = useState(0);
  const PAGE_SIZE = 10;

  const ROLE_LABEL: Record<string, string> = {
    LEARNER: "회원",
    INSTRUCTOR: "강사",
    MANAGER: "관리자",
  };

  const STATUS_LABEL: Record<string, string> = {
    PENDING: "대기",
    APPROVED: "승인됨",
    REJECTED: "반려됨",
  };

  //날짜 포멧
  const formatDate = (isoString: string) => {
    if (!isoString) return "-";
    // ISO → "2025-12-05 20:16" 로 변환
    return isoString.replace("T", " ").slice(0, 16);
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();

    return users.filter(
      (u) =>
        String(u.userId).toLowerCase().includes(q) ||
        u.nickname.toLowerCase().includes(q)
    );
  }, [search, users]);

  const filteredInstructors = useMemo(() => {
    if (!instructorSearch.trim()) return instructors;
    const q = instructorSearch.toLowerCase();

    return instructors.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        String(a.applicationId).toLowerCase().includes(q)
    );
  }, [instructorSearch, instructors]);

  //페이지네이션용
  const pagedUsers = filtered.slice(
    userPage * PAGE_SIZE,
    (userPage + 1) * PAGE_SIZE
  );

  const totalUserPages = Math.ceil(filtered.length / PAGE_SIZE);

  const pagedInstructors = filteredInstructors.slice(
    instructorPage * PAGE_SIZE,
    (instructorPage + 1) * PAGE_SIZE
  );

  const totalInstructorPages = Math.ceil(
    filteredInstructors.length / PAGE_SIZE
  );

  const selectedUser = useMemo(
    () => users.find((u) => u.userId === selectedId) ?? null,
    [users, selectedId]
  );

  const selectedApplication = useMemo(
    () =>
      instructors.find((a) => a.applicationId === selectedApplicationId) ??
      null,
    [instructors, selectedApplicationId]
  );

  const isDisabledUser = !selectedUser;
  const isDisabledInstructor = !selectedApplication;

  useEffect(() => {
    async function load() {
      const result = await fetchUserList();
      setUsers(result.users ?? []);

      const instructorResult = await fetchInstructorApplications({
        page: 0,
        size: 50,
        sort: "submittedAt,desc",
      });
      setInstructors(instructorResult.applications ?? []);
    }
    load();
  }, []);

  const handleChange = (value: string) => {
    setSearch(value);
    setSelectedId(null);
  };

  const handleInstructorSearch = (value: string) => {
    setInstructorSearch(value);
    setSelectedApplicationId(null);
    setSelectedApplicationDetail(null);
  };

  const handleSelectApplication = (applicationId: number) => {
    setSelectedApplicationId((prev) =>
      prev === applicationId ? null : applicationId
    );
    setSelectedApplicationDetail(null);
  };

  const toggleUserAccordion = () => {
    if (!selectedUser) return;

    setOpenedUserAccordionId((prev) =>
      prev === selectedUser.userId ? null : selectedUser.userId
    );
  };

  const toggleInstructorAccordion = async () => {
    if (!selectedApplicationId) return;

    let detail = selectedApplicationDetail;

    if (!detail || detail.applicationId !== selectedApplicationId) {
      detail = await fetchInstructorApplicationDetail(selectedApplicationId);
      setSelectedApplicationDetail(detail);
    }

    setOpenedInstructorAccordionId((prev) =>
      prev === selectedApplicationId ? null : selectedApplicationId
    );
  };

  const downloadPortfolio = async () => {
    if (!selectedApplication) return;

    try {
      let detail = selectedApplicationDetail;

      // 아직 상세정보를 안 불러왔으면 한번 가져오기
      if (
        !detail ||
        detail.applicationId !== selectedApplication.applicationId
      ) {
        detail = await fetchInstructorApplicationDetail(
          selectedApplication.applicationId
        );
        setSelectedApplicationDetail(detail);
      }

      const fileToken: string | undefined = detail?.portfolioFileUrl;
      if (!fileToken) {
        alert("포트폴리오 파일 정보가 없습니다.");
        return;
      }

      // 🔥 토큰 붙는 axios 인스턴스로 blob 받아오기
      const blob = await downloadPortfolioFile(fileToken);

      // 🔥 브라우저에서 다운로드 트리거
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      // 백엔드에서 원래 파일명도 줬다면 그걸 쓰고, 없으면 토큰 그대로 사용
      const downloadName =
        detail.portfolioOriginalName || detail.originalFileName || fileToken;
      a.download = downloadName;

      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("포트폴리오 파일을 다운로드하는 중 오류가 발생했습니다.");
    }
  };
  /*
  const openPortfolioLink = async () => {
    if (!selectedApplication) return;

    let detail = selectedApplicationDetail;

    if (!detail || detail.applicationId !== selectedApplication.applicationId) {
      detail = await fetchInstructorApplicationDetail(
        selectedApplication.applicationId
      );
      setSelectedApplicationDetail(detail);
    }

    const link = detail?.portfolioLink;
    if (!link) {
      alert("포트폴리오 링크가 없습니다.");
      return;
    }

    window.open(link, "_blank");
  };
  */

  const blacklistUser = async () => {
    if (!selectedUser) return;

    if (
      !window.confirm(
        `${selectedUser.nickname} (${selectedUser.userId}) 을 블랙리스트에 추가하고 제거할까요?`
      )
    )
      return;

    const reason = window.prompt(
      "블랙리스트 사유를 입력하세요.",
      "운영정책 위반"
    );
    if (!reason) return;

    try {
      await addToBlacklist({
        email: selectedUser.email,
        phone: selectedUser.phone,
        name: selectedUser.name ?? selectedUser.nickname,
        reason,
      });

      setUsers((prev) => prev.filter((u) => u.userId !== selectedUser.userId));
      setSelectedId(null);

      alert("블랙리스트에 추가되었습니다.");
    } catch (err) {
      console.error(err);
      alert("블랙리스트 추가 중 오류가 발생했습니다.");
    }
  };
  /*
  const removeUser = () => {
    if (!selectedUser) return;
    if (!window.confirm("정말 제거하시겠습니까?")) return;

    setUsers((prev) => prev.filter((u) => u.userId !== selectedUser.userId));
    setSelectedId(null);
  };
  */

  const changeRoleTo = async (nextRole: Role) => {
    if (!selectedUser) return;
    if (!window.confirm(`역할을 '${ROLE_LABEL[nextRole]}'로 변경할까요?`))
      return;

    try {
      await updateUserRole(selectedUser.userId, nextRole);

      setUsers((prev) =>
        prev.map((u) =>
          u.userId === selectedUser.userId ? { ...u, role: nextRole } : u
        )
      );

      alert(`역할이 '${ROLE_LABEL[nextRole]}'로 변경되었습니다.`);
    } catch {
      alert("역할 변경 오류 발생");
    }
  };

  //강사 승인
  const approveInstructor = async (applicationId: number) => {
    if (!window.confirm("승인하시겠습니까?")) return;

    try {
      // 1) 상세 정보가 없으면 불러오기 (userId 필요!)
      let detail = selectedApplicationDetail;
      if (!detail || detail.applicationId !== applicationId) {
        detail = await fetchInstructorApplicationDetail(applicationId);
        setSelectedApplicationDetail(detail);
      }

      const userId = detail.userId;

      // 2) 역할 변경
      await updateUserRole(userId, "INSTRUCTOR");

      // 3) 이메일 발송
      await sendApproveInstructorEmail(userId);

      alert("강사 승인 + 이메일 발송 완료!");

      // 4) 목록에서 제거
      setInstructors((prev) =>
        prev.filter((a) => a.applicationId !== applicationId)
      );

      setOpenedInstructorAccordionId(null);
    } catch (err) {
      console.error(err);
      alert("승인 중 오류가 발생했습니다.");
    }
  };

  //강사 거절
  const rejectInstructor = async (applicationId: number) => {
    if (!window.confirm("거절하시겠습니까?")) return;

    alert("강사 신청이 거절되었습니다.");

    // 그냥 목록 삭제만 하면 됨
    setInstructors((prev) =>
      prev.filter((a) => a.applicationId !== applicationId)
    );

    setOpenedInstructorAccordionId(null);
  };

  return (
    <Wrap>
      <SectionTitle>유저 목록</SectionTitle>
      <TopBar>
        <Row>
          <SearchInput
            value={search}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="아이디 / 닉네임 검색"
          />

          <ButtonGroup>
            <ActionButton
              onClick={toggleUserAccordion}
              disabled={isDisabledUser}
            >
              유저 정보보기
            </ActionButton>
            <ActionButton onClick={blacklistUser} disabled={isDisabledUser}>
              블랙리스트
            </ActionButton>
            <ActionButton disabled title="추후 구현 예정...">
              유저 제거
            </ActionButton>
          </ButtonGroup>
        </Row>
        <Row>
          <span style={{ fontWeight: 600 }}>역할 변경:</span>
          <ButtonGroup>
            <ActionButton onClick={() => changeRoleTo("LEARNER")}>
              회원
            </ActionButton>
            <ActionButton onClick={() => changeRoleTo("INSTRUCTOR")}>
              강사
            </ActionButton>
            <ActionButton onClick={() => changeRoleTo("MANAGER")}>
              관리자
            </ActionButton>
          </ButtonGroup>
        </Row>
      </TopBar>

      <TableWrap>
        <Table>
          <Thead>
            <tr>
              <Th>유저 아이디</Th>
              <Th>유저 닉네임</Th>
              <Th>유저 역할</Th>
              <Th>가입 일자</Th>
            </tr>
          </Thead>

          <tbody>
            {pagedUsers.length === 0 && (
              <tr>
                <Td colSpan={4} style={{ textAlign: "center", opacity: 0.5 }}>
                  검색 결과 없음
                </Td>
              </tr>
            )}

            {pagedUsers.map((u) => (
              <>
                <Tr
                  key={u.userId}
                  selected={selectedId === u.userId}
                  onClick={() => setSelectedId(u.userId)}
                >
                  <Td>{u.userId}</Td>
                  <Td>{u.nickname}</Td>
                  <Td>{ROLE_LABEL[u.role]}</Td>
                  <Td>{formatDate(u.createdAt)}</Td>
                </Tr>

                {openedUserAccordionId === u.userId && (
                  <UserDetailRow>
                    <UserDetailBox colSpan={4}>
                      <div style={{ marginBottom: "8px" }}>
                        <strong>이름:</strong> {u.name}
                      </div>
                      <div style={{ marginBottom: "8px" }}>
                        <strong>이메일:</strong> {u.email}
                      </div>
                      <div style={{ marginBottom: "8px" }}>
                        <strong>전화번호:</strong> {u.phone}
                      </div>
                      <div style={{ marginBottom: "8px" }}>
                        <strong>닉네임:</strong> {u.nickname}
                      </div>
                      <div style={{ marginBottom: "8px" }}>
                        <strong>역할:</strong> {ROLE_LABEL[u.role]}
                      </div>
                      <div>
                        <strong>가입일:</strong> {formatDate(u.createdAt)}
                      </div>
                    </UserDetailBox>
                  </UserDetailRow>
                )}
              </>
            ))}
          </tbody>
        </Table>
      </TableWrap>
      <PaginationWrapper>
        <PaginationBar>
          <PageButton
            onClick={() => setUserPage((p) => Math.max(0, p - 1))}
            disabled={userPage === 0}
          >
            〈
          </PageButton>

          {Array.from({ length: totalUserPages }).map((_, i) => (
            <PageButton
              key={i}
              active={i === userPage}
              onClick={() => setUserPage(i)}
            >
              {i + 1}
            </PageButton>
          ))}

          <PageButton
            onClick={() =>
              setUserPage((p) => Math.min(totalUserPages - 1, p + 1))
            }
            disabled={userPage >= totalUserPages - 1}
          >
            〉
          </PageButton>
        </PaginationBar>
      </PaginationWrapper>

      <SectionTitle>강사 신청 목록</SectionTitle>
      <TopBar>
        <SearchInput
          value={instructorSearch}
          onChange={(e) => handleInstructorSearch(e.target.value)}
          placeholder="신청 ID / 이름 / 이메일 검색"
        />
        <ButtonGroup>
          <ActionButton
            onClick={toggleInstructorAccordion}
            disabled={isDisabledInstructor}
          >
            강사 정보보기
          </ActionButton>

          <ActionButton
            onClick={() => approveInstructor(selectedApplicationId!)}
            disabled={isDisabledInstructor}
          >
            강사 승인
          </ActionButton>

          <ActionButton
            onClick={() => rejectInstructor(selectedApplicationId!)}
            disabled={isDisabledInstructor}
          >
            강사 거절
          </ActionButton>
        </ButtonGroup>
      </TopBar>

      <TableWrap>
        <Table>
          <Thead>
            <tr>
              <Th>신청 ID</Th>
              <Th>이름</Th>
              <Th>이메일</Th>
              <Th>신청 일자</Th>
              <Th>상태</Th>
            </tr>
          </Thead>
          <tbody>
            {pagedInstructors.length === 0 && (
              <tr>
                <Td colSpan={5} style={{ textAlign: "center", opacity: 0.5 }}>
                  강사 신청 내역 없음
                </Td>
              </tr>
            )}

            {pagedInstructors.map((a) => (
              <>
                <Tr
                  key={a.applicationId}
                  selected={selectedApplicationId === a.applicationId}
                  onClick={() => handleSelectApplication(a.applicationId)}
                >
                  <Td>{a.applicationId}</Td>
                  <Td>{a.name}</Td>
                  <Td>{a.email}</Td>
                  <Td>{formatDate(a.submittedAt)}</Td>
                  <Td>{STATUS_LABEL[a.status] ?? a.status}</Td>
                </Tr>

                {openedInstructorAccordionId === a.applicationId &&
                  selectedApplicationDetail && (
                    <InstructorDetailRow>
                      <InstructorDetailBox colSpan={5}>
                        <div style={{ marginBottom: "8px" }}>
                          <strong>신청 ID:</strong>{" "}
                          {selectedApplicationDetail.applicationId}
                        </div>
                        <div style={{ marginBottom: "8px" }}>
                          <strong>유저 ID:</strong>{" "}
                          {selectedApplicationDetail.userId}
                        </div>
                        <div style={{ marginBottom: "8px" }}>
                          <strong>이름:</strong>{" "}
                          {selectedApplicationDetail.name}
                        </div>
                        <div style={{ marginBottom: "8px" }}>
                          <strong>이메일:</strong>{" "}
                          {selectedApplicationDetail.email}
                        </div>
                        <div style={{ marginBottom: "8px" }}>
                          <strong>전화번호:</strong>{" "}
                          {selectedApplicationDetail.phone}
                        </div>
                        <div style={{ marginBottom: "8px" }}>
                          <strong>신청 일자:</strong>{" "}
                          {formatDate(selectedApplicationDetail.submittedAt)}
                        </div>
                        <div style={{ marginBottom: "8px" }}>
                          <strong>상태:</strong>{" "}
                          {selectedApplicationDetail.status}
                        </div>

                        <div style={{ margin: "12px 0" }}>
                          <strong>포트폴리오 파일:</strong>{" "}
                          {selectedApplicationDetail.portfolioFileUrl ?? "없음"}
                          {selectedApplicationDetail.portfolioFileUrl && (
                            <ActionButton
                              style={{ marginLeft: "12px" }}
                              onClick={downloadPortfolio}
                            >
                              파일 다운로드
                            </ActionButton>
                          )}
                        </div>

                        <div style={{ margin: "12px 0" }}>
                          <strong>포트폴리오 링크:</strong>{" "}
                          {selectedApplicationDetail.portfolioLinks ?? "없음"}
                        </div>
                      </InstructorDetailBox>
                    </InstructorDetailRow>
                  )}
              </>
            ))}
          </tbody>
        </Table>
      </TableWrap>
      <PaginationWrapper>
        <PaginationBar>
          <PageButton
            onClick={() => setInstructorPage((p) => Math.max(0, p - 1))}
            disabled={instructorPage === 0}
          >
            〈
          </PageButton>

          {Array.from({ length: totalInstructorPages }).map((_, i) => (
            <PageButton
              key={i}
              active={i === instructorPage}
              onClick={() => setInstructorPage(i)}
            >
              {i + 1}
            </PageButton>
          ))}

          <PageButton
            onClick={() =>
              setInstructorPage((p) =>
                Math.min(totalInstructorPages - 1, p + 1)
              )
            }
            disabled={instructorPage >= totalInstructorPages - 1}
          >
            〉
          </PageButton>
        </PaginationBar>
      </PaginationWrapper>
    </Wrap>
  );
}

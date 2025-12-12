import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { getUserProfile } from "../../api/mypage_api";
import UserManagementScreen from "./Manage/User";
import ReportManageScreen from "./Manage/Report";
import ProblemManagementScreen from "./Manage/Problem";
import { useAtomValue } from "jotai";
import { userProfileAtom } from "../../atoms";

const Wrapper = styled.div`
  flex: 1;
  margin-left: 32px;
  padding: 24px 16px;
  color: ${(props) => props.theme.textColor};
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 24px;
  color: ${(props) => props.theme.textColor};
`;
const NavigateBar = styled.div`
  width: auto;
  height: wrap-content;
  padding-bottom: 8px;
  border-bottom: 1px solid ${(props) => props.theme.textColor}30;
  display: flex;
  gap: 12px;
  flex-wrap: nowrap; /* 줄바꿈 금지 */
  flex-shrink: 0;
`;

const NavigateItem = styled.div<{ $active: boolean }>`
  font-size: 20px;
  color: ${(props) =>
    props.$active ? props.theme.focusColor : props.theme.textColor};
  transform: ${(props) => (props.$active ? "scale(1.05)" : "scale(1.0)")};
  border-bottom: ${(props) =>
    props.$active ? `2px solid ${props.theme.focusColor}` : "none"};
  text-decoration: none;
  padding: 6px 10px;
  outline: none;
  cursor: pointer;
  transition: color 0.15 ease;
  /* 줄바꿈 금지 */
  white-space: nowrap;
  &:hover {
    color: ${(props) => props.theme.focusColor};
    transform: scale(1.05);
  }
  &:active {
    color: ${(props) => props.theme.focusColor};
    transform: scale(0.95);
  }
  &:focus-visible {
    outline: 2px solid ${(props) => props.theme.focusColor};
    outline-offset: 2px;
  }
`;

const LoadingText = styled.div`
  padding: 40px 0;
`;

const ErrorText = styled.div`
  padding: 40px 0;
  color: #ef4444;
`;
const DebugDiv = styled.div`
  height: 100vh;
`;

function ManageScreen({ index, role }: { index: number; role: string }) {
  if (role === "INSTRUCTOR") {
    return <ProblemManagementScreen />;
  }

  switch (index) {
    case 0:
      return <UserManagementScreen />;
    case 1:
      return <ReportManageScreen />;
    case 2:
      return <ProblemManagementScreen />;
    default:
      return (
        <div>
          <h3>error</h3>
        </div>
      );
  }
}

export default function ManagePage() {
  const { username } = useParams<{ username: string }>();

  // ✅ 현재 로그인한 유저 정보 (권한 체크용)
  const loginUser = useAtomValue(userProfileAtom);

  // ✅ 프로필 데이터는 그대로 필요하면 유지 (예: 상단에 관리자 정보 보여줄 용도)
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: async () => await getUserProfile(username ?? ""),
    staleTime: 5 * 60 * 1000,
    enabled: !!username,
  });

  const [navigateState, setNavigateState] = useState<number>(0);

  if (isLoading)
    return <LoadingText>프로필 정보를 불러오는 중입니다…</LoadingText>;
  if (isError || !user)
    return <ErrorText>프로필 정보를 불러오는 데 실패했어요.</ErrorText>;

  // ✅ 권한은 로그인 유저 기준으로 판단
  const role = loginUser?.role ?? "USER";
  const isManager = role === "MANAGER";
  const isInstructor = role === "INSTRUCTOR";

  if (!isManager && !isInstructor) {
    return (
      <ErrorText>관리자 또는 강사만 접근할 수 있는 페이지입니다.</ErrorText>
    );
  }

  const menuItems = isManager
    ? ["유저 관리", "신고 관리", "문제 관리"]
    : ["문제 관리"];

  const handleNavigateClick = (index: number) => {
    setNavigateState(index);
  };

  return (
    <Wrapper>
      <Title>관리자 페이지</Title>
      <NavigateBar>
        {menuItems.map((label, index) => (
          <NavigateItem
            key={label}
            onClick={() => handleNavigateClick(index)}
            $active={navigateState === index}
          >
            {label}
          </NavigateItem>
        ))}
      </NavigateBar>

      <ManageScreen index={navigateState} role={role} />
      <DebugDiv />
    </Wrapper>
  );
}

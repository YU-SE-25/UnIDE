// Sidebar.tsx
import { Link, useSearchParams } from "react-router-dom";
import styled from "styled-components";

const SidebarWrap = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px 16px;
  border-radius: 16px;
  background: ${({ theme }) => theme.headerBgColor};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  min-width: 220px;
  height: fit-content;
  position: sticky;
  top: 200px;
`;

const Title = styled.h2`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 12px;
  letter-spacing: -0.2px;
`;

const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const NavItem = styled.button<{ $active?: boolean }>`
  all: unset;
  display: flex;
  align-items: center;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ $active, theme }) =>
    $active ? theme.focusColor : theme.textColor};
  background: ${({ $active, theme }) =>
    $active ? `${theme.focusColor}10` : "transparent"};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ theme }) => `${theme.focusColor}10`};
    color: ${({ theme }) => theme.focusColor};
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  display: flex;
  align-items: center;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 14px;
  color: ${({ theme }) => theme.textColor};
  transition: all 0.15s ease;

  &:hover {
    background: ${({ theme }) => `${theme.focusColor}10`};
    color: ${({ theme }) => theme.focusColor};
  }
`;

export default function Mypage_sidebar({
  isMyPage,
  role,
}: {
  isMyPage: boolean;
  role?: string;
}) {
  const [sp, setSp] = useSearchParams();
  const active = sp.get("tab") ?? "activity";

  const go = (tab: string) => {
    const next = new URLSearchParams(sp);
    next.set("tab", tab);
    setSp(next, { replace: true });
  };

  return (
    <SidebarWrap>
      <Title>마이페이지</Title>
      <NavList>
        <NavItem onClick={() => go("activity")} $active={active === "activity"}>
          - 나의 활동
        </NavItem>

        {isMyPage && (
          <NavItem
            onClick={() => go("profile-edit")}
            $active={active === "profile-edit"}
          >
            - 내 정보 수정
          </NavItem>
        )}
        {isMyPage && (role === "MANAGER" || role === "INSTRUCTOR") && (
          <NavItem
            onClick={() => go("manage-page")}
            $active={active === "manage-page"}
          >
            - 관리자 페이지
          </NavItem>
        )}
        {isMyPage && <NavLink to="/studygroup-main">- 내 스터디그룹</NavLink>}
      </NavList>
      {isMyPage && (
        <NavItem
          onClick={() => go("coding-style")}
          $active={active === "coding-style"}
        >
          - 코딩 성향 분석
        </NavItem>
      )}
    </SidebarWrap>
  );
}

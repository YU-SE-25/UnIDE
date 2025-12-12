import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import styled, { keyframes, css } from "styled-components";
import axios from "axios";
import { useAtom, useSetAtom } from "jotai";
import { isLoggedInAtom, logoutActionAtom, userProfileAtom } from "../atoms";
import { useQueryClient } from "@tanstack/react-query";
import LogoImageFile from "../../res/Logo.png";

export const TOPBAR_HEIGHT = 50;

const TopbarContainer = styled.header`
  height: ${TOPBAR_HEIGHT}px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  justify-content: flex-start;

  background-color: ${(props) => props.theme.headerBgColor};
  color: ${(props) => props.theme.textColor};
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const TopbarContent = styled.nav`
  position: relative;
  width: 100%;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
`;

const Logo = styled(Link)`
  font-size: 20px;
  font-weight: 800;
  color: inherit;
  text-decoration: none;
  outline: none;
  &:focus-visible {
    outline: 2px solid ${(props) => props.theme.focusColor};
    outline-offset: 2px;
  }
`;

const Menu = styled.ul`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 24px;
  list-style: none;
  margin: 0;
  padding: 0;
  @media (max-width: 620px) {
    display: none;
  }
`;

const MenuItem = styled.li`
  position: relative;
  display: flex;
  align-items: center;
`;

const MenuLink = styled(NavLink)`
  margin: auto;
  font-size: 16px;
  color: ${(props) => props.theme.textColor};
  line-height: 1;
  text-decoration: none;
  outline: none;

  &:hover {
    color: ${(props) => props.theme.focusColor};
  }

  &.active {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${(props) => props.theme.focusColor};
    outline-offset: 2px;
  }
`;

const BoardMenuButton = styled.button`
  margin: auto;
  font-size: 16px;
  font: inherit;
  line-height: 1;
  display: inline-block;
  background: none;
  border: none;
  padding: 0;
  color: ${(props) => props.theme.textColor};
  cursor: pointer;
  outline: none;

  &:hover {
    color: ${(props) => props.theme.focusColor};
  }

  &:focus-visible {
    outline: 2px solid ${(props) => props.theme.focusColor};
    outline-offset: 2px;
  }
`;

const dropdownOpen = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const dropdownClose = keyframes`
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(-6px); }
`;

const BoardDropdown = styled.ul<{ $open: boolean }>`
  position: absolute;
  top: 120%;
  left: -50px;

  background-color: ${(props) => props.theme.bgColor};
  border-radius: 0 0 10px 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  padding: 6px 0;
  list-style: none;
  min-width: 140px;
  z-index: 200;

  animation: ${({ $open }) =>
    $open
      ? css`
          ${dropdownOpen} 0.16s ease-out forwards
        `
      : css`
          ${dropdownClose} 0.16s ease-in forwards
        `};

  pointer-events: ${({ $open }) => ($open ? "auto" : "none")};
`;

const BoardDropdownItem = styled(Link)`
  display: block;
  padding: 8px 14px;
  font-size: 14px;
  color: ${(props) => props.theme.textColor};
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    background: ${(props) => props.theme.authHoverBgColor};
    color: ${(props) => props.theme.authHoverTextColor};
  }
`;

const Auth = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: nowrap;
  flex-shrink: 0;
`;

const AuthLink = styled(Link)`
  font-size: 14px;
  color: ${(props) => props.theme.textColor};
  text-decoration: none;
  padding: 6px 10px;
  border-radius: 10px;
  white-space: nowrap;

  &:hover {
    background: ${(props) => props.theme.authHoverBgColor};
    color: ${(props) => props.theme.authHoverTextColor};
    transform: scale(1.05);
  }

  &:active {
    background: ${(props) => props.theme.authActiveBgColor};
    color: ${(props) => props.theme.authHoverTextColor};
    transform: scale(0.95);
  }

  &:focus-visible {
    outline: 2px solid ${(props) => props.theme.focusColor};
    outline-offset: 2px;
  }
`;

// **************************************************************

export default function Topbar() {
  const navigate = useNavigate();
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const [userProfile] = useAtom(userProfileAtom);
  const runLogoutAction = useSetAtom(logoutActionAtom);
  const queryClient = useQueryClient();

  const [isBoardOpen, setIsBoardOpen] = useState(false);
  //const userName = userProfile?.nickname || "guest";

  // 게시판 메뉴 이동
  const handleSelectBoard = (path: string) => {
    setIsBoardOpen(false);
    navigate(path);
  };

  // 로그아웃 처리
  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      await axios.post("/api/auth/logout", { refreshToken });
    } catch (err) {
      console.error("Logout failed:", err);
    }

    runLogoutAction();
    queryClient.clear();

    window.location.href = "/";
  };

  return (
    <TopbarContainer>
      <TopbarContent aria-label="Top navigation">
        <Logo to="/">
          <img
            src={LogoImageFile}
            alt="Logo"
            style={{ height: "50px", verticalAlign: "middle" }}
          />
        </Logo>

        <Menu>
          <MenuItem>
            <MenuLink to="/problem-list">문제</MenuLink>
          </MenuItem>

          <MenuItem
            onMouseEnter={() => setIsBoardOpen(true)}
            onMouseLeave={() => setIsBoardOpen(false)}
          >
            <BoardMenuButton type="button">게시판</BoardMenuButton>

            <BoardDropdown $open={isBoardOpen}>
              <li>
                <BoardDropdownItem
                  to="/board/default"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelectBoard("/board/default");
                  }}
                >
                  토론게시판
                </BoardDropdownItem>
              </li>

              <li>
                <BoardDropdownItem
                  to="/qna"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelectBoard("/qna");
                  }}
                >
                  Q&A 게시판
                </BoardDropdownItem>
              </li>
            </BoardDropdown>
          </MenuItem>

          <MenuItem>
            <MenuLink
              to={isLoggedIn ? "/studygroup-main" : "/login"}
              onClick={(e) => {
                if (!isLoggedIn) {
                  e.preventDefault();
                  alert("로그인이 필요한 기능입니다.");
                  navigate("/login");
                }
              }}
            >
              스터디 그룹
            </MenuLink>
          </MenuItem>

          <MenuItem>
            <MenuLink
              to={isLoggedIn ? "/scratch" : "/login"}
              onClick={(e) => {
                if (!isLoggedIn) {
                  e.preventDefault();
                  alert("로그인이 필요한 기능입니다.");
                  navigate("/login");
                }
              }}
            >
              IDE
            </MenuLink>
          </MenuItem>
        </Menu>

        <RightSection>
          <Auth>
            {isLoggedIn ? (
              <>
                <AuthLink
                  to={`/mypage/${encodeURIComponent(
                    userProfile?.nickname ?? ""
                  )}?tab=activity`}
                >
                  마이페이지
                </AuthLink>
                <AuthLink to="/" onClick={handleLogout}>
                  로그아웃
                </AuthLink>
              </>
            ) : (
              <>
                <AuthLink to="/login">로그인</AuthLink>
                <AuthLink to="/register">회원가입</AuthLink>
              </>
            )}
          </Auth>
        </RightSection>
      </TopbarContent>
    </TopbarContainer>
  );
}

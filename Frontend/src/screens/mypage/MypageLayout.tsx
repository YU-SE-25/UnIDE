/*******************나중에 할 것*****************
실제 API로 교체


*************************************************/
import { Outlet, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { getMyProfile, getUserProfile } from "../../api/mypage_api";
import {
  SiPython,
  SiCplusplus,
  SiJavascript,
  SiCoffeescript,
} from "react-icons/si";
import Sidebar from "../../components/mypage_sidebar";
import { useAtomValue } from "jotai";
import { userProfileAtom } from "../../atoms";

//css styles
const Page = styled.div`
  max-width: 2080px;
  margin: 0 auto;
  padding: 24px;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const Head = styled.header`
  color: ${(props) => props.theme.textColor};
  display: flex;
  align-items: top;
  justify-content: left;
  margin-top: 40px;
`;

const UserImg = styled.img`
  width: 250px;
  height: 250px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 20px;
`;

const UserInfo = styled.div`
  margin-left: 20px;
  display: flex;
  flex-direction: column;
`;
const Username = styled.h1`
  font-size: 60px;
  font-weight: bold;
  color: ${(props) => props.theme.textColor};
`;
const Bio = styled.p`
  font-size: 20px;
  margin-top: 15px;
  color: ${(props) => props.theme.textColor};
`;
const Chips = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 10px;
`;
const LangIcon = (tone: string) => {
  switch (tone) {
    case "Python":
      return <SiPython size={16} />;
    case "Java":
      return <SiCoffeescript size={16} />;
    case "C++":
      return <SiCplusplus size={16} />;
    case "JavaScript":
      return <SiJavascript size={16} />;
    default:
      return null;
  }
};
const LangChip = styled.div<{ tone?: string }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  border-radius: 999px;
  background: ${({ tone }) => {
    switch (tone) {
      case "Python":
        return "#3776AB";
      case "Java":
        return "#E11E1E";
      case "C++":
        return "#00599C";
      case "JavaScript":
        return "#F7DF1E";
      case "more":
        return "#555555";
      default:
        return "#888";
    }
  }};
  span {
    margin-left: 6px;
    color: white;
  }
  svg {
    fill: ${({ tone }) => {
      switch (tone) {
        case "Python":
          return "#FFD43B";
        case "Java":
          return "#FFFFFF";
        case "C++":
          return "#FFFFFF";
        case "JavaScript":
          return "#000000";
        default:
          return "#FFFFFF";
      }
    }};
  }
`;

const Body = styled.div`
  max-width: 1200px;
  margin-top: 30px;
  width: 100%;
  height: auto;
  display: flex;
`;

export default function MyPageLayout() {
  const { username } = useParams<{ username: string }>();

  if (!username) {
    return <div>잘못된 접근입니다.</div>;
  }

  const loginUser = useAtomValue(userProfileAtom) ?? {
    nickname: "guest",
    role: "GUEST",
    userId: "0",
  };

  const isMyPage = loginUser.nickname === username;

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: isMyPage ? ["myProfile"] : ["userProfile", username],

    enabled: !!username,

    queryFn: async () => {
      if (isMyPage) {
        // ⭐ 내 페이지 → /mypage/me
        return await getMyProfile();
      }

      // ⭐ 다른 사람 페이지 → /mypage/:username
      return await getUserProfile(username);
    },

    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <div>불러오는 중…</div>;
  if (isError || !user) return <div>에러가 발생했어요.</div>;

  const isPublic = user.isPublic !== false;
  const canViewPrivate = isPublic || isMyPage || loginUser.role === "MANAGER";

  return (
    <Page>
      <Head>
        <UserImg src={user.avatarUrl} alt="User Profile" />
        <UserInfo>
          <Username>{user.username}</Username>

          {canViewPrivate ? (
            <>
              <Bio>{user.bio}</Bio>
              <Chips>
                {user.preferred_language?.slice(0, 5).map((lang) => (
                  <LangChip key={lang} tone={lang}>
                    {LangIcon(lang)}
                    <span>{lang}</span>
                  </LangChip>
                ))}
                {(user.preferred_language?.length ?? 0) > 5 && (
                  <LangChip tone="more">
                    + {(user.preferred_language?.length ?? 0) - 5}..
                  </LangChip>
                )}
              </Chips>
            </>
          ) : (
            <Bio>이 프로필은 비공개입니다.</Bio>
          )}
        </UserInfo>
      </Head>

      <Body>
        {canViewPrivate ? (
          <>
            <Sidebar isMyPage={isMyPage} role={loginUser.role} />
            <Outlet />
          </>
        ) : (
          <div
            style={{ width: "100%", textAlign: "center", padding: "40px 0" }}
          />
        )}
      </Body>
    </Page>
  );
}

// src/screens/MyPageRedirect.tsx
import { Navigate } from "react-router-dom";
import { useAtomValue } from "jotai";
import { userProfileAtom } from "../../atoms";

export default function MyPageRedirect() {
  const userProfile = useAtomValue(userProfileAtom);
  const username = userProfile?.nickname;

  if (!username) {
    // 로그인 정보가 없으면 로그인 페이지로 이동
    return <Navigate to="/login" replace />;
  }
  // 로그인되어 있으면 해당 유저의 마이페이지로 이동
  return <Navigate to={`/mypage/${encodeURIComponent(username)}`} replace />;
}

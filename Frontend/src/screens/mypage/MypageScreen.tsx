// mypage/MyPageScreen.tsx
import { useSearchParams } from "react-router-dom";

import EditAlert from "./EditAlert";
import ManagePage from "./ManagePage";
import ActivityPage from "./Activitypage";
import CodingStylePage from "./CodingStylePage";

export default function MyPageScreen() {
  const [sp] = useSearchParams();
  const tab = sp.get("tab") ?? "activity";

  if (tab === "activity") return <ActivityPage />;
  else if (tab === "profile-edit") return <EditAlert />;
  else if (tab === "manage-page") return <ManagePage />;
  else if (tab === "coding-style") return <CodingStylePage />;

  return <div style={{ padding: 16 }}>준비 중: {tab}</div>;
}

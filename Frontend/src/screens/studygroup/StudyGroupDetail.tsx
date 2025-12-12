import { useEffect, useState } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import { userProfileAtom } from "../../atoms";
import { useAtom } from "jotai";

import {
  Wrapper,
  PageLayout,
  SidebarContainer,
  MainContentContainer,
  TabNav,
  TabButton,
  TabContent,
  SidebarWrapper,
  GroupHeader,
  GroupName,
  GroupDescription,
  //GroupLeader,
  MemberListContainer,
  MemberItem,
  SmallButton,
} from "../../theme/StudyGroupDetail.Style";

import CommonModal from "./CommomModal";
import StudyGroupManage from "./StudyGroupManage";

import type { StudyGroupDetail, GroupRole } from "../../api/studygroup_api";
import {
  fetchStudyGroupDetail,
  leaveStudyGroup,
} from "../../api/studygroup_api";

export default function StudyGroupDetailPage() {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const numericId = Number(groupId);
  const [userProfile] = useAtom(userProfileAtom);

  // 그룹 상세 데이터
  const [group, setGroup] = useState<StudyGroupDetail | null>(null);
  const [role, setRole] = useState<GroupRole>("NONE");

  // 모달 상태
  const [showManageModal, setShowManageModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // 그룹 상세 정보 불러오기
  const loadGroupDetail = async () => {
    const detail = await fetchStudyGroupDetail(numericId);
    setGroup(detail);
    setRole(detail.myRole);
  };

  useEffect(() => {
    loadGroupDetail();
  }, [numericId]);

  // 탈퇴 처리
  const handleLeaveGroup = async () => {
    await leaveStudyGroup(numericId);
    alert("그룹에서 탈퇴했습니다.");
    navigate("/studygroup");
  };

  // 로딩 단계 (아직 fetch 중)
  if (group === null) {
    return <div>Loading...</div>;
  }

  // API 실패 + fallback 실패 시
  if (!group) {
    return <div>데이터를 불러오지 못했습니다.</div>;
  }

  // members 필드가 없는 경우 (이론상 거의 안 일어남)
  if (!group.members) {
    return <div>그룹 멤버 정보가 없습니다.</div>;
  }

  return (
    <Wrapper>
      <PageLayout>
        {/* 왼쪽 사이드바 */}
        <SidebarContainer>
          <SidebarWrapper>
            <GroupHeader>
              <GroupName>{group.groupName}</GroupName>
            </GroupHeader>

            <GroupDescription>{group.groupDescription}</GroupDescription>

            {/* 멤버들 */}
            <MemberListContainer>
              <h3>
                멤버 ({group.currentMembers}/{group.maxMembers})
              </h3>

              {group.members.map((m) => (
                <MemberItem
                  key={m.groupMemberId}
                  isLeader={m.role?.toUpperCase() === "LEADER"}
                  isSelf={m.userName === userProfile?.nickname}
                  onClick={() => {
                    const target = m.userName;
                    const myName = userProfile?.nickname;

                    // 자기 자신이면 내 마이페이지 이동
                    if (target === myName) {
                      navigate(`/mypage/${myName}`);
                    }
                    // 아니면 해당 유저 마이페이지로 이동
                    else {
                      navigate(`/mypage/${target}`);
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {m.role?.toUpperCase() === "LEADER"
                    ? `그룹장: ${m.userName}`
                    : m.userName}
                </MemberItem>
              ))}
            </MemberListContainer>

            {/* 리더 전용 */}
            {role === "LEADER" && (
              <SmallButton onClick={() => setShowManageModal(true)}>
                그룹 관리
              </SmallButton>
            )}

            {/* 멤버 전용 */}
            {role === "MEMBER" && (
              <SmallButton $isDanger onClick={() => setShowLeaveModal(true)}>
                그룹 탈퇴
              </SmallButton>
            )}
          </SidebarWrapper>
        </SidebarContainer>

        {/* 오른쪽 콘텐츠 영역 */}
        <MainContentContainer>
          <TabNav>
            <TabButton onClick={() => navigate("problem")}>문제 목록</TabButton>
            <TabButton onClick={() => navigate("discussion")}>
              토론 게시판
            </TabButton>
            <TabButton onClick={() => navigate("activity")}>
              활동 기록
            </TabButton>
          </TabNav>

          <TabContent>
            <Outlet context={{ groupId: group.groupId, role }} />
          </TabContent>
        </MainContentContainer>
      </PageLayout>

      {/* 그룹장 관리 모달 */}
      {role === "LEADER" && showManageModal && (
        <StudyGroupManage
          group={group}
          onClose={() => setShowManageModal(false)}
          onUpdated={loadGroupDetail}
        />
      )}

      {/* 멤버 탈퇴 모달 */}
      {role === "MEMBER" && showLeaveModal && (
        <CommonModal
          title="정말 그룹에서 탈퇴하시겠습니까?"
          message="탈퇴하면 다시 가입해야 합니다."
          dangerText="탈퇴하기"
          cancelText="취소"
          onConfirm={handleLeaveGroup}
          onCancel={() => setShowLeaveModal(false)}
        />
      )}
    </Wrapper>
  );
}

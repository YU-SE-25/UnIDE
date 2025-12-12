import { api } from "./axios";

// 타입 정의
export type GroupRole = "LEADER" | "MEMBER" | "NONE";

export interface StudyGroup {
  groupId: number;
  groupName: string;
  groupDescription: string;
  maxMembers: number;
  currentMembers: number;
  leaderName: string;
  myRole: GroupRole;
}

export interface StudyGroupDetail {
  groupId: number;
  groupName: string;
  groupDescription: string;
  maxMembers: number;
  currentMembers: number;

  leader: {
    userId: number;
    leaderName: string;
  };

  members: {
    groupMemberId: number;
    userId: number;
    userName: string;
    role: "LEADER" | "MEMBER";
  }[];

  myRole: GroupRole;
}

export interface AssignedProblem {
  problemId: number;
  problemTitle: string;
  userStatus: "SUBMITTED" | "NOT_SUBMITTED";
}

export interface AssignedProblemList {
  problemListId: number;
  listTitle: string;
  dueDate: string;
  problems: AssignedProblem[];
}

export interface ActivityLog {
  activityId: number;
  type: string;
  userId: number;
  userName: string;
  description: string;
  createdAt: string;
}

export interface ActivityResponse {
  content: ActivityLog[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export interface CreateStudyGroupResponse {
  message: string;
  groupId?: number;
}

export interface UpdateStudyGroupResponse {
  message: string;
  groupId: number;
}

export interface CreateProblemListResponse {
  problemListId: number;
  listTitle: string;
  dueDate: string;
}

export interface UpdateProblemListResponse {
  problemListId: number;
  listTitle: string;
  dueDate: string;
}

export interface DeleteProblemListResponse {
  message: string;
}

// 그룹 목록 조회
export async function fetchStudyGroups(
  pageSize: number = 10
): Promise<StudyGroup[]> {
  const res = await api.get<StudyGroup[]>("/studygroup", {
    params: { pageSize },
  });

  return res.data.map((g: any) => ({
    ...g,
    leaderName:
      g.leaderName ?? g.leader?.leaderName ?? g.leader?.userName ?? "미정",
    myRole: g.myRole as GroupRole,
  }));
}

// 그룹 상세 조회
export async function fetchStudyGroupDetail(
  groupId: number
): Promise<StudyGroupDetail> {
  const res = await api.get<StudyGroupDetail>(`/studygroup/list/${groupId}`);
  return res.data;
}

// 그룹 생성
export async function createStudyGroup(data: {
  groupName: string;
  groupDescription: string;
  maxMembers: number;
}): Promise<CreateStudyGroupResponse> {
  const res = await api.post<CreateStudyGroupResponse>("/studygroup", data);
  return res.data;
}

// 그룹 수정
export async function updateStudyGroup(
  groupId: number,
  data: {
    groupName?: string;
    groupDescription?: string;
    maxMembers?: number;
    groupMemberIds?: number[];
  }
): Promise<UpdateStudyGroupResponse> {
  const res = await api.patch<UpdateStudyGroupResponse>(
    `/studygroup/list/${groupId}`,
    data
  );
  return res.data;
}

// 그룹 삭제
export async function deleteStudyGroup(
  groupId: number
): Promise<{ message: string }> {
  const res = await api.delete<{ message: string }>(
    `/studygroup/list/${groupId}`
  );
  return res.data;
}

// 그룹 가입
export async function joinStudyGroup(groupId: number): Promise<{
  groupId: number;
  userId: number;
  role: string;
  status: string;
  capacity: { max: number; current: number; waitlisted: number };
  joinedAt: string;
}> {
  const res = await api.post<{
    groupId: number;
    userId: number;
    role: string;
    status: string;
    capacity: { max: number; current: number; waitlisted: number };
    joinedAt: string;
  }>(`/studygroup/${groupId}/membership`);

  return res.data;
}

// 그룹 탈퇴
export async function leaveStudyGroup(
  groupId: number
): Promise<{ groupId: number; userId: number; status: string }> {
  const res = await api.delete<{
    groupId: number;
    userId: number;
    status: string;
  }>(`/studygroup/${groupId}/members/me`);
  return res.data;
}

// 멤버 강퇴
export async function kickMember(
  groupId: number,
  memberId: number
): Promise<{
  groupId: number;
  groupMemberId: number;
  kickedUserId: number;
  kickedUserName: string;
  status: string;
}> {
  const res = await api.delete<{
    groupId: number;
    groupMemberId: number;
    kickedUserId: number;
    kickedUserName: string;
    status: string;
  }>(`/studygroup/${groupId}/members/${memberId}`);

  return res.data;
}

// 문제 리스트 생성
export async function createProblemList(
  groupId: number,
  data: {
    listTitle: string;
    dueDate: string;
    problems: number[];
  }
): Promise<CreateProblemListResponse> {
  const res = await api.post<CreateProblemListResponse>(
    `/studygroup/${groupId}/problem/lists`,
    data
  );
  return res.data;
}

// 문제 리스트 전체 조회
export async function fetchAssignedProblemLists(
  groupId: number
): Promise<AssignedProblemList[]> {
  const res = await api.get<AssignedProblemList[]>(
    `/studygroup/${groupId}/problem/lists`
  );
  return res.data;
}

// 특정 문제 리스트 상세 조회
export async function fetchAssignedProblemListDetail(
  groupId: number,
  problemListId: number
): Promise<AssignedProblemList> {
  const res = await api.get<AssignedProblemList>(
    `/studygroup/${groupId}/problem/lists/${problemListId}`
  );
  return res.data;
}

// 문제 리스트 수정
export async function updateProblemList(
  groupId: number,
  problemListId: number,
  data: {
    listTitle: string;
    dueDate: string;
    problems: number[];
  }
): Promise<UpdateProblemListResponse> {
  const res = await api.put<UpdateProblemListResponse>(
    `/studygroup/${groupId}/problem/lists/${problemListId}`,
    data
  );
  return res.data;
}

// 문제 리스트 삭제
export async function deleteProblemList(
  groupId: number,
  problemListId: number
): Promise<DeleteProblemListResponse> {
  const res = await api.delete<DeleteProblemListResponse>(
    `/studygroup/${groupId}/problem/lists/${problemListId}`
  );
  return res.data;
}

// 활동 기록 조회
export async function fetchActivityLogs(
  groupId: number
): Promise<ActivityResponse> {
  const res = await api.get<ActivityResponse>(
    `/studygroup/${groupId}/activities`
  );
  return res.data;
}

// 내 스터디그룹 조회
export async function fetchMyStudyGroups(): Promise<StudyGroup[]> {
  const res = await api.get<StudyGroup[]>("/studygroup/my");
  return res.data.map((g) => ({
    ...g,
    myRole: g.myRole as GroupRole,
  }));
}

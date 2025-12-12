import axios from "axios";
import type { EditableProfile } from "../screens/mypage/EditPage";
import { api } from "./axios";
export type Submission = {
  id: number;
  submissionId: number;
  problemId: number;
  verdict: "AC" | "WA" | "TLE" | "MLE" | "RE";
  language: string;
  runtimeMs: number;
  submittedAt: string;
};

export type Achievement = {
  id: string;
  title: string;
  icon: string;
  earnedAt: string;
};
export type UserProfile = {
  userId: number;
  username: string;
  avatarUrl: string;
  bio: string;
  joinedAt: string;
  solvedProblems: number[];
  bookmarkedProblems: number[];
  recentSubmissions: Submission[];
  preferred_language?: string[];
  role: string;
  isPublic?: boolean;
  stats: {
    totalSolved: number;
    totalSubmitted: number;
    acceptanceRate: number;
    streakDays: number;
    rank: number;
    rating: number;
  };
  goals?: {
    // 1. 언어별 학습 시간 설정 (예: { javascript: 120, python: 90 })
    studyTimeByLanguage?: Record<string, number>; // 단위: 분(minutes)

    // 2. 하루 최소 학습 시간 설정
    dailyMinimumStudyMinutes?: number;

    // 3. 주간 학습 목표 (총 학습 시간)
    weeklyStudyGoalMinutes?: number;

    // 4. 학습 알림 / 리마인더 시간 목록
    reminderTimes?: string[]; // "18:00", "21:30" 같은 HH:mm 형식
    // 5. 리마인더 활성화 여부
    isReminderEnabled?: boolean;
  };
  achievements?: Achievement[]; //확장 가능성 고려
  reminders?: Reminder[];
  isDarkMode?: boolean;
  isStudyAlarm?: boolean;
};

export type Reminder = {
  day: number;
  times: string[];
};

export type UserProfileDto = {
  userId: number;
  nickname: string;
  avatarUrl: string;
  bio: string | null;
  preferredLanguage: string[];
  role: string;
  joinedAt: string;
  updatedAt: string;
  isPublic: boolean;
  solvedProblems: number[];
  bookmarkedProblems: number[];
  recentSubmissions: Submission[];
  stats: {
    totalSolved: number;
    totalSubmitted: number;
    acceptanceRate: number;
    streakDays: number;
    ranking: number;
    rating: number;
  };
  goals: {
    studyTimeByLanguage: Record<string, number> | null;
    dailyMinimumStudyMinutes: number;
    weeklyStudyGoalMinutes: number;
    reminderTimes: string[];
    isReminderEnabled: boolean;
  } | null;
  isStudyAlarm: boolean;
  isDarkMode: boolean;
  reminders: { day: number; times: string[] }[];
};

// PATCH /api/mypage 요청 전용 DTO
export type UpdateMyProfileDto = {
  nickname?: string;
  bio?: string | null;
  preferredLanguage?: string[];
  isPublic?: boolean;

  userGoals?: {
    studyTimeByLanguage?: Record<string, number>;
    dailyMinimumStudyMinutes?: number;
    weeklyStudyGoalMinutes?: number;
  };

  reminders?: {
    day: number;
    times: string[];
  }[];

  isDarkMode?: boolean;
  isStudyAlarm?: boolean;

  avatarImageFile?: File;
};

export function mapEditFormToUpdateDto(
  form: EditableProfile
): UpdateMyProfileDto {
  return {
    nickname: form.username,
    bio: form.bio || null,
    preferredLanguage: form.preferred_language,
    isPublic: !form.hideMyPage,

    userGoals: {
      // 🔹 문자열로 관리되던 걸 number로 변환해서 서버로 보냄
      studyTimeByLanguage:
        form.studyTimeByLanguage &&
        Object.keys(form.studyTimeByLanguage).length > 0
          ? Object.fromEntries(
              Object.entries(form.studyTimeByLanguage).map(([lang, value]) => [
                lang,
                Number(value),
              ])
            )
          : undefined,

      dailyMinimumStudyMinutes:
        form.dailyMinimumStudyMinutes === ""
          ? undefined
          : Number(form.dailyMinimumStudyMinutes),

      weeklyStudyGoalMinutes:
        form.weeklyStudyGoalMinutes === ""
          ? undefined
          : Number(form.weeklyStudyGoalMinutes),
    },
    reminders: form.reminders ?? [],

    isDarkMode: form.isDarkMode,
    isStudyAlarm: form.enableStudyReminder,

    avatarImageFile: form.avatarImageFile ?? undefined,
  };
}

export function mapUserProfileDto(dto: UserProfileDto): UserProfile {
  return {
    userId: dto.userId,
    username: dto.nickname,
    avatarUrl: dto.avatarUrl,
    bio: dto.bio ?? "",
    joinedAt: dto.joinedAt,
    solvedProblems: dto.solvedProblems ?? [],
    bookmarkedProblems: dto.bookmarkedProblems ?? [],
    recentSubmissions: dto.recentSubmissions ?? [],
    preferred_language: dto.preferredLanguage ?? [],
    role: dto.role,
    isPublic: dto.isPublic,
    stats: {
      totalSolved: dto.stats.totalSolved,
      totalSubmitted: dto.stats.totalSubmitted,
      acceptanceRate: dto.stats.acceptanceRate,
      streakDays: dto.stats.streakDays,
      rank: dto.stats.ranking,
      rating: dto.stats.rating,
    },
    goals: dto.goals
      ? {
          studyTimeByLanguage: dto.goals.studyTimeByLanguage ?? undefined,
          dailyMinimumStudyMinutes:
            dto.goals.dailyMinimumStudyMinutes ?? undefined,
          weeklyStudyGoalMinutes: dto.goals.weeklyStudyGoalMinutes ?? undefined,
          reminderTimes:
            dto.goals.reminderTimes && dto.goals.reminderTimes.length > 0
              ? dto.goals.reminderTimes
              : undefined,
          isReminderEnabled: dto.goals.isReminderEnabled,
        }
      : undefined,

    achievements: [],
    isStudyAlarm: dto.isStudyAlarm,
    isDarkMode: dto.isDarkMode,
    reminders: dto.reminders ?? [],
  };
}
export function getDummyUserProfile(): UserProfile {
  return {
    userId: 0,
    username: "",
    avatarUrl: "",
    bio: "",
    joinedAt: "",
    solvedProblems: [],
    bookmarkedProblems: [],
    recentSubmissions: [],
    preferred_language: [],
    role: "LEARNER",

    isPublic: false,

    stats: {
      totalSolved: 0,
      totalSubmitted: 0,
      acceptanceRate: 0,
      streakDays: 0,
      rank: 0,
      rating: 0,
    },

    goals: {
      studyTimeByLanguage: undefined,
      dailyMinimumStudyMinutes: undefined,
      weeklyStudyGoalMinutes: undefined,
      reminderTimes: undefined,
      isReminderEnabled: false,
    },

    achievements: [],

    // 학습 알림 / 다크모드 (서버측 기본값 예상)
    isStudyAlarm: false,
    isDarkMode: false,

    reminders: [],
  };
}

export async function getUserProfile(nickname: string): Promise<UserProfile> {
  try {
    const safe = encodeURIComponent(nickname);
    const res = await api.get<UserProfileDto>(`/mypage/${safe}`);
    return mapUserProfileDto(res.data);
  } catch (err: any) {
    const status = err?.response?.status;

    if (status === 403) {
      // 403이 진짜 비공개인 경우에만 처리
      const dummy = getDummyUserProfile();
      return {
        ...dummy,
        username: "비공계 계정",
        isPublic: false,
      };
    }

    alert("이름을 불러오는데 실패했습니다");

    const dummy = getDummyUserProfile();
    return {
      ...dummy,
      username: "Err",
      isPublic: false,
    };
  }
}

export async function getMyProfile(): Promise<UserProfile> {
  try {
    const res = await api.get<UserProfileDto>("/mypage");
    return mapUserProfileDto(res.data);
  } catch (err: any) {
    // 1차 시도 실패: 프로필이 없는 경우(404) → 생성 시도 후 다시 GET
    if (err) {
      try {
        await api.post("/mypage/initialize");
        const retryRes = await api.get<UserProfileDto>("/mypage");
        return mapUserProfileDto(retryRes.data);
      } catch (retryErr) {
        //console.log("❌ getMyProfile: 프로필 생성 또는 재조회 실패:", retryErr);
      }
    }

    return getDummyUserProfile();
  }
}

// 내 프로필 업데이트 (PATCH /api/mypage)

export async function updateMyProfile(payload: UpdateMyProfileDto | FormData) {
  try {
    const res = await api.patch("/mypage", payload);
    return res.data;
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;

      if (status === 413) {
        alert("파일이 너무 큽니다! (최대 업로드 용량을 초과했습니다)");
        throw err;
      }
    }

    // 그 외 에러는 그대로 던지기
    throw err;
  }
}

//마이페이지용 코딩 성향 분석
export const fetchCodingHabits = async () => {
  const res = await api.get("/analysis/habits");
  return res.data;
};

// 회원 탈퇴
export const withdrawAccount = async (password?: string) => {
  const body = password ? { password } : {}; // 비었으면 소셜 → {}
  const res = await api.delete("/auth/withdraw", { data: body });
  return res.data;
};

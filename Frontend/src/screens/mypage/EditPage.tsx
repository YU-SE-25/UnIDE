import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import { getMyProfile, updateMyProfile } from "../../api/mypage_api";
import { useAtom, useSetAtom } from "jotai";
import {
  isDarkAtom,
  toggleThemeActionAtom,
  userProfileAtom,
} from "../../atoms";
import { AuthAPI } from "../../api/auth_api";
import { withdrawAccount } from "../../api/mypage_api";
import type { UserProfile } from "../../atoms";

const Wrapper = styled.div`
  flex: 1;
  margin-left: 32px;
  padding: 24px 16px;
  color: ${(props) => props.theme.textColor};
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 24px;
  color: ${(props) => props.theme.textColor};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 640px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InputRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const CheckButton = styled.button`
  white-space: nowrap;
  padding: 10px 14px;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme.focusColor};
  color: white;
  font-size: 14px;
  cursor: pointer;

  &:disabled {
    background: #aaaaaa;
    cursor: not-allowed;
  }
`;

const SuccessText = styled.p`
  margin-top: 8px;
  color: #3cb371;
  font-size: 14px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
`;

const Hint = styled.span`
  font-size: 12px;
  opacity: 0.7;
  color: ${(props) => props.theme.textColor};
`;

const Input = styled.input`
  margin-top: 10px;
  width: 80%;
  padding: 10px;
  border: 1px solid ${(props) => props.theme.authHoverBgColor};
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 16px;
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.bgColor};
`;

const TextArea = styled.textarea`
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme.authHoverBgColor};
  background: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
  font-size: 14px;
  outline: none;
  resize: vertical;
  min-height: 120px;

  &:focus {
    border-color: ${(props) => props.theme.textColor};
  }
`;

const AvatarOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.15s ease;
`;

const AvatarWrapper = styled.div`
  position: relative;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid ${(props) => props.theme.authHoverBgColor};
  cursor: pointer;

  &:hover ${AvatarOverlay} {
    opacity: 1;
  }
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const LangChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const LangChip = styled.button<{ $selected?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid
    ${({ $selected, theme }) =>
      $selected ? theme.focusColor : "rgba(0, 0, 0, 0.16)"};
  background: ${({ $selected, theme }) =>
    $selected ? theme.focusColor : "transparent"};
  color: ${({ $selected, theme }) =>
    $selected ? theme.bgColor : theme.textColor};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
`;

const GoalRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 10px;
`;

const GoalBox = styled.div`
  padding: 12px 14px;
  border-radius: 14px;
  background-color: ${({ theme }) => theme.bgCardColor};
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const GoalLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.textColor};
`;

const GoalInputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const GoalUnit = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.textColor};
`;

// 언어별 학습시간 섹션용
const StudyTimeSection = styled.div`
  margin-top: 12px;
  padding: 12px 14px;
  border-radius: 14px;
  background-color: ${({ theme }) => theme.bgCardColor};
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StudyTimeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StudyTimeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AddStudyTimeButton = styled.button`
  align-self: flex-start;
  margin-top: 4px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px dashed ${({ theme }) => theme.focusColor};
  background: transparent;
  color: ${({ theme }) => theme.focusColor};
  font-size: 12px;
  cursor: pointer;
`;

// 설정 섹션
const SettingsList = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SettingItem = styled.div`
  padding: 10px 12px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.bgCardColor};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const SettingTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const SettingTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.textColor};
`;

const SettingDescription = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.muteColor};
`;

// 토글 버튼
const ToggleButton = styled.div<{ $enable: boolean }>`
  width: 44px;
  height: 24px;
  background-color: ${(props) =>
    props.$enable ? props.theme.focusColor : props.theme.authHoverBgColor};
  border-radius: 12px;
  position: relative;
  transition: background-color 0.3s;
`;

// 스위치 핸들 (동그란 부분)
const ToggleThumb = styled.div<{ $enable: boolean }>`
  width: 18px;
  height: 18px;
  background-color: ${(props) => props.theme.bgColor};
  border-radius: 50%;
  position: absolute;
  top: 3px;
  left: ${(props) => (props.$enable ? "23px" : "3px")};
  transition: left 0.3s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`;

const ButtonRow = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 12px;
`;

const PrimaryButton = styled.button`
  padding: 10px 18px;
  border-radius: 12px;
  border: 1px solid transparent;
  background: ${(props) => props.theme.focusColor};
  color: ${(props) => props.theme.bgColor};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const GhostButton = styled.button`
  padding: 10px 18px;
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.muteColor};
  background: transparent;
  color: ${(props) => props.theme.textColor};
  font-size: 14px;
  cursor: pointer;
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

//탈퇴버튼
const DangerButton = styled.button`
  padding: 10px 18px;
  border-radius: 12px;
  background: #e63946; /* 빨간색 */
  color: white;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;

  &:hover {
    filter: brightness(0.9);
  }
`;

export type ReminderForm = {
  day: number;
  times: string[];
};

export type EditableProfile = {
  username: string;
  bio: string;
  preferred_language: string[];

  hideMyPage: boolean;

  dailyMinimumStudyMinutes: string;
  weeklyStudyGoalMinutes: string;

  studyTimeByLanguage: { language: string; minutes: string }[];
  enableStudyReminder: boolean;
  reminders: ReminderForm[];
  isDarkMode: boolean;

  avatarUrl: string | null;
  avatarImageFile: File | null;
};

const ALL_LANGS = ["Python", "Java", "C++", "JavaScript"];

export default function EditPage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDark] = useAtom(isDarkAtom);
  const runToggleTheme = useSetAtom(toggleThemeActionAtom);
  const didInit = useRef(false);
  const queryClient = useQueryClient();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  //탈퇴용
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawPassword, setWithdrawPassword] = useState("");
  const [withdrawError, setWithdrawError] = useState("");
  const setUserProfile = useSetAtom(userProfileAtom);
  const [form, setForm] = useState<EditableProfile>({
    avatarUrl: "",
    avatarImageFile: null,
    username: "",
    bio: "",
    preferred_language: [],
    hideMyPage: false,
    dailyMinimumStudyMinutes: "",
    weeklyStudyGoalMinutes: "",
    studyTimeByLanguage: [],
    enableStudyReminder: false,
    reminders: [],
    isDarkMode: isDark,
  });

  // 추가 언어 입력은 폼 타입 말고 별도 state로 관리
  const [extraLanguageInput, setExtraLanguageInput] = useState("");

  // 리마인더 UI용 로컬 state
  const [reminderDayOfWeek, setReminderDayOfWeek] = useState<
    "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN"
  >("MON");
  const [reminderAmPm, setReminderAmPm] = useState<"AM" | "PM">("AM");
  const [reminderHour12, setReminderHour12] = useState<number>(9);

  const [showExtraLang, setShowExtraLang] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [valid, setValid] = useState<boolean | null>(null);

  //const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["myProfileEdit"],
    queryFn: async () => {
      return await getMyProfile();
    },
    staleTime: 5 * 60 * 1000,
  });

  async function checkDuplicate() {
    if (!form.username.trim()) {
      alert("닉네임을 입력하세요.");
      return;
    }

    setIsChecking(true);
    try {
      const res = await AuthAPI.checkNickname(form.username);
      if (res.data.available) {
        setValid(true);
      } else {
        setValid(false);
      }
    } catch (err) {
      console.error(err);
      setValid(false);
    }
    setIsChecking(false);
  }

  // 요일 텍스트 → 숫자
  function mapDayOfWeek(day: string): number {
    switch (day) {
      case "MON":
        return 1;
      case "TUE":
        return 2;
      case "WED":
        return 3;
      case "THU":
        return 4;
      case "FRI":
        return 5;
      case "SAT":
        return 6;
      case "SUN":
        return 7;
      default:
        return 1;
    }
  }

  function to24Hour(amPm: "AM" | "PM", hour12: number | string): number {
    const h = Number(hour12);
    if (amPm === "AM") {
      return h === 12 ? 0 : h;
    } else {
      return h === 12 ? 12 : h + 12;
    }
  }

  const dayReverseMap: Record<
    number,
    "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN"
  > = {
    1: "MON",
    2: "TUE",
    3: "WED",
    4: "THU",
    5: "FRI",
    6: "SAT",
    7: "SUN",
  };
  /*
  const DAY_MAP: Record<
    number,
    "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN"
  > = {
    1: "MON",
    2: "TUE",
    3: "WED",
    4: "THU",
    5: "FRI",
    6: "SAT",
    7: "SUN",
  };
*/
  useEffect(() => {
    if (!user || didInit.current) return;
    didInit.current = true;

    const allSet = new Set(ALL_LANGS);
    const allPreferred = user.preferred_language ?? [];
    const baseLangs = allPreferred.filter((l: string) => allSet.has(l));
    const extraLangs = allPreferred.filter((l: string) => !allSet.has(l));

    const firstReminder: ReminderForm | undefined =
      user.reminders && user.reminders.length > 0
        ? user.reminders[0]
        : undefined;

    if (firstReminder) {
      setReminderDayOfWeek(dayReverseMap[firstReminder.day]);

      if (firstReminder.times && firstReminder.times[0]) {
        const [hh] = firstReminder.times[0].split(":");
        const hourNum = Number(hh);

        if (hourNum === 0) {
          setReminderAmPm("AM");
          setReminderHour12(12);
        } else if (hourNum < 12) {
          setReminderAmPm("AM");
          setReminderHour12(hourNum);
        } else if (hourNum === 12) {
          setReminderAmPm("PM");
          setReminderHour12(12);
        } else {
          setReminderAmPm("PM");
          setReminderHour12(hourNum - 12);
        }
      }
    }

    setForm({
      avatarUrl: user.avatarUrl ?? "",
      avatarImageFile: null,
      username: user.username ?? "",
      bio: user.bio ?? "",
      preferred_language: baseLangs,
      hideMyPage: user.isPublic === false,
      dailyMinimumStudyMinutes:
        user.goals?.dailyMinimumStudyMinutes?.toString() ?? "",
      weeklyStudyGoalMinutes:
        user.goals?.weeklyStudyGoalMinutes?.toString() ?? "",
      studyTimeByLanguage: user.goals?.studyTimeByLanguage
        ? Object.entries(user.goals.studyTimeByLanguage).map(
            ([lang, time]) => ({
              language: lang,
              minutes: String(time),
            })
          )
        : [],
      enableStudyReminder: user.isStudyAlarm ?? false,
      reminders: user.reminders ?? [],
      isDarkMode: user.isDarkMode ?? isDark,
    });

    setExtraLanguageInput(extraLangs.join(", "));
  }, [user, isDark]);

  const toggleLang = (lang: string) => {
    setForm((prev) => {
      const has = prev.preferred_language.includes(lang);
      return {
        ...prev,
        preferred_language: has
          ? prev.preferred_language.filter((l) => l !== lang)
          : [...prev.preferred_language, lang],
      };
    });
  };

  const handleStudyTimeRowChange = (
    index: number,
    field: "language" | "minutes",
    value: string
  ) => {
    setForm((prev) => {
      const next = [...prev.studyTimeByLanguage];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, studyTimeByLanguage: next };
    });
  };

  const handleAddStudyTimeRow = () => {
    setForm((prev) => {
      if (prev.studyTimeByLanguage.length >= 3) return prev;
      return {
        ...prev,
        studyTimeByLanguage: [
          ...prev.studyTimeByLanguage,
          { language: "", minutes: "" },
        ],
      };
    });
  };

  const handleChange =
    (field: keyof EditableProfile) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async () => {
    try {
      const extraList = extraLanguageInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const finalPreferred = Array.from(
        new Set([...form.preferred_language, ...extraList])
      );

      const reminderHour24 = to24Hour(reminderAmPm, reminderHour12);
      const reminderTimeStr = `${reminderHour24
        .toString()
        .padStart(2, "0")}:00`;

      const studyTimeByLanguage = Object.fromEntries(
        form.studyTimeByLanguage
          .filter(
            (row) => row.language.trim() !== "" && row.minutes.trim() !== ""
          )
          .map((row) => [row.language, Number(row.minutes)])
      );

      const profilePayload = {
        nickname: form.username,
        bio: form.bio || null,
        preferredLanguage: finalPreferred,
        isPublic: !form.hideMyPage,
        userGoals: {
          studyTimeByLanguage,
          dailyMinimumStudyMinutes:
            form.dailyMinimumStudyMinutes === ""
              ? undefined
              : Number(form.dailyMinimumStudyMinutes),
          weeklyStudyGoalMinutes:
            form.weeklyStudyGoalMinutes === ""
              ? undefined
              : Number(form.weeklyStudyGoalMinutes),
        },
        reminders: form.enableStudyReminder
          ? [
              {
                day: mapDayOfWeek(reminderDayOfWeek),
                times: [reminderTimeStr],
              },
            ]
          : [],
        isDarkMode: form.isDarkMode,
        isStudyAlarm: form.enableStudyReminder,
      };

      const fd = new FormData();
      fd.append(
        "data",
        new Blob([JSON.stringify(profilePayload)], {
          type: "application/json",
        })
      );
      if (avatarFile) fd.append("avatarImageFile", avatarFile);

      await updateMyProfile(fd);

      await queryClient.invalidateQueries({
        queryKey: ["userProfileActivity"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["userProfileActivity", form.username],
      });

      setUserProfile((prev) => {
        if (!prev) return prev;

        const updated: UserProfile = {
          ...prev,
          nickname: form.username,
        };
        localStorage.setItem("userProfile", JSON.stringify(updated));

        return updated;
      });

      alert("프로필이 성공적으로 업데이트되었습니다!");
      navigate(`/mypage/${encodeURIComponent(form.username)}?tab=activity`, {
        replace: true,
      });
      setTimeout(() => {
        window.location.reload();
      }, 0);
    } catch (err) {
      console.error(err);
      alert("프로필 수정 중 오류가 발생했습니다.");
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    setForm((prev) => ({ ...prev, avatarUrl: url }));
    setAvatarFile(file);
  };

  const handleReset = () => {
    if (!user) return;

    const allSet = new Set(ALL_LANGS);
    const allPreferred = user.preferred_language ?? [];
    const baseLangs = allPreferred.filter((l: string) => allSet.has(l));
    const extraLangs = allPreferred.filter((l: string) => !allSet.has(l));

    const firstReminder: ReminderForm | undefined =
      user.reminders && user.reminders.length > 0
        ? user.reminders[0]
        : undefined;

    if (firstReminder) {
      setReminderDayOfWeek("MON"); // TODO: day 역매핑
      if (firstReminder.times && firstReminder.times[0]) {
        const [hh] = firstReminder.times[0].split(":");
        const hourNum = Number(hh);
        if (hourNum === 0) {
          setReminderAmPm("AM");
          setReminderHour12(12);
        } else if (hourNum < 12) {
          setReminderAmPm("AM");
          setReminderHour12(hourNum);
        } else if (hourNum === 12) {
          setReminderAmPm("PM");
          setReminderHour12(12);
        } else {
          setReminderAmPm("PM");
          setReminderHour12(hourNum - 12);
        }
      }
    }

    setForm({
      avatarUrl: user.avatarUrl ?? "",
      avatarImageFile: null,
      username: user.username ?? "",
      bio: user.bio ?? "",
      preferred_language: baseLangs,
      hideMyPage: user.isPublic === false,
      dailyMinimumStudyMinutes:
        user.goals?.dailyMinimumStudyMinutes?.toString() ?? "",
      weeklyStudyGoalMinutes:
        user.goals?.weeklyStudyGoalMinutes?.toString() ?? "",
      studyTimeByLanguage: user.goals?.studyTimeByLanguage
        ? Object.entries(user.goals.studyTimeByLanguage).map(
            ([lang, time]) => ({
              language: lang,
              minutes: String(time),
            })
          )
        : [],
      enableStudyReminder: user.isStudyAlarm ?? false,
      reminders: user.reminders ?? [],
      isDarkMode: user.isDarkMode ?? isDark,
    });

    setExtraLanguageInput(extraLangs.join(", "));
  };

  if (!username) {
    return <ErrorText>잘못된 접근입니다. (username 없음)</ErrorText>;
  }

  if (isLoading) {
    return <LoadingText>프로필 정보를 불러오는 중입니다…</LoadingText>;
  }

  if (isError || !user) {
    return <ErrorText>프로필 정보를 불러오는 데 실패했어요.</ErrorText>;
  }

  //탈퇴 요청
  const handleWithdraw = async () => {
    try {
      await withdrawAccount(withdrawPassword.trim() || undefined);

      alert("회원 탈퇴가 완료되었습니다.");

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      window.location.href = "/";
    } catch (err) {
      // 일반 로그인인데 비밀번호 틀렸을 때만 이 에러 뜸
      if (withdrawPassword.trim()) {
        setWithdrawError("비밀번호가 올바르지 않습니다.");
      } else {
        setWithdrawError("탈퇴에 실패했어요.");
      }
    }
  };

  return (
    <Wrapper>
      <Title>프로필 수정</Title>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <FieldGroup>
          <Label>프로필 이미지</Label>
          <Hint>이미지를 클릭하면 새로운 이미지를 업로드 할 수 있습니다.</Hint>
          <AvatarRow>
            <AvatarWrapper onClick={handleAvatarClick}>
              <AvatarImage
                src={form.avatarUrl || user.avatarUrl}
                alt="프로필 이미지"
              />
              <AvatarOverlay>수정</AvatarOverlay>
            </AvatarWrapper>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAvatarChange}
            />
          </AvatarRow>
        </FieldGroup>

        <FieldGroup>
          <Label>닉네임</Label>
          <Hint>서비스 내에서 표시되는 이름입니다.</Hint>
          <InputRow>
            <Input
              type="text"
              value={form.username}
              onChange={(e) => {
                handleChange("username")(e);
                setValid(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  checkDuplicate();
                }
              }}
              placeholder="닉네임을 입력하세요"
            />

            <CheckButton
              type="button"
              onClick={checkDuplicate}
              disabled={isChecking}
            >
              {isChecking ? "확인 중…" : "중복 확인"}
            </CheckButton>
          </InputRow>

          {valid === true && (
            <SuccessText>사용 가능한 닉네임입니다!</SuccessText>
          )}
          {valid === false && (
            <ErrorText>이미 존재하는 닉네임입니다.</ErrorText>
          )}
        </FieldGroup>

        <FieldGroup>
          <Label>소개</Label>
          <Hint>자기소개, 관심 분야, 현재 공부 중인 내용을 적어보세요.</Hint>
          <TextArea
            value={form.bio}
            onChange={handleChange("bio")}
            placeholder="안녕하세요! 👋 현재 알고리즘과 웹 개발을 공부하고 있어요."
          />
        </FieldGroup>

        <FieldGroup>
          <Label>선호 언어</Label>
          <Hint>
            자주 사용하는 언어를 선택하세요. 여러 개 선택할 수 있습니다.
          </Hint>
          <LangChipRow>
            {ALL_LANGS.map((lang) => (
              <LangChip
                key={lang}
                type="button"
                $selected={form.preferred_language.includes(lang)}
                onClick={() => toggleLang(lang)}
              >
                {lang}
              </LangChip>
            ))}
            <LangChip
              type="button"
              $selected={showExtraLang}
              onClick={() => setShowExtraLang((prev) => !prev)}
            >
              more..
            </LangChip>
          </LangChipRow>
          {showExtraLang && (
            <div>
              <Hint>
                구분자(,)를 이용해 프로필에 표시할 언어를 추가로 작성할 수
                있습니다.
              </Hint>
              <Input
                type="text"
                value={extraLanguageInput}
                onChange={(e) => setExtraLanguageInput(e.target.value)}
                placeholder="추가로 선호하는 언어를 입력하세요 (쉼표로 구분 가능)"
                style={{ marginTop: "8px" }}
              />
            </div>
          )}
        </FieldGroup>

        <FieldGroup>
          <Label>학습 목표</Label>
          <Hint>
            하루 / 주간 학습 시간을 설정하면 대시보드에서 진척도를 확인할 수
            있어요.
          </Hint>

          <GoalRow>
            <GoalBox>
              <GoalLabel>하루 최소 학습 시간</GoalLabel>
              <GoalInputRow>
                <Input
                  type="number"
                  min={0}
                  value={form.dailyMinimumStudyMinutes ?? ""}
                  onChange={handleChange("dailyMinimumStudyMinutes")}
                  placeholder="예: 30"
                />
                <GoalUnit>분</GoalUnit>
              </GoalInputRow>
            </GoalBox>

            <GoalBox>
              <GoalLabel>주간 학습 목표</GoalLabel>
              <GoalInputRow>
                <Input
                  type="number"
                  min={0}
                  value={form.weeklyStudyGoalMinutes ?? ""}
                  onChange={handleChange("weeklyStudyGoalMinutes")}
                  placeholder="예: 600"
                />
                <GoalUnit>분</GoalUnit>
              </GoalInputRow>
            </GoalBox>
          </GoalRow>

          {/* 언어별 학습시간 섹션 */}
          <StudyTimeSection>
            <GoalLabel>언어별 학습 시간</GoalLabel>
            <Hint>주요 언어별로 목표 공부 시간을 설정할 수 있어요.</Hint>

            <StudyTimeList>
              {form.studyTimeByLanguage.map((row, idx) => (
                <StudyTimeRow key={idx}>
                  <Input
                    type="text"
                    placeholder="언어 (예: Python)"
                    value={row.language}
                    onChange={(e) =>
                      handleStudyTimeRowChange(idx, "language", e.target.value)
                    }
                    style={{ flex: 1 }}
                  />
                  <Input
                    type="number"
                    min={0}
                    placeholder="예: 60"
                    value={row.minutes}
                    onChange={(e) =>
                      handleStudyTimeRowChange(idx, "minutes", e.target.value)
                    }
                    style={{ width: "120px" }}
                  />
                  <GoalUnit>분</GoalUnit>
                </StudyTimeRow>
              ))}
            </StudyTimeList>

            {form.studyTimeByLanguage.length < 3 && (
              <AddStudyTimeButton type="button" onClick={handleAddStudyTimeRow}>
                + 언어별 학습 시간 추가
              </AddStudyTimeButton>
            )}
          </StudyTimeSection>
        </FieldGroup>

        <FieldGroup>
          <Label>설정</Label>
          <Hint>계정과 마이페이지에 대한 기본 설정입니다.</Hint>

          <SettingsList>
            <SettingItem>
              <SettingTextGroup>
                <SettingTitle>학습 알림</SettingTitle>
                <SettingDescription>
                  설정한 시간에 학습 알림을 받아요.
                </SettingDescription>
              </SettingTextGroup>
              <ToggleButton
                $enable={form.enableStudyReminder}
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    enableStudyReminder: !prev.enableStudyReminder,
                  }))
                }
              >
                <ToggleThumb $enable={form.enableStudyReminder} />
              </ToggleButton>
            </SettingItem>

            {form.enableStudyReminder && (
              <SettingItem>
                <SettingTextGroup>
                  <SettingDescription>
                    매주
                    <select
                      value={reminderDayOfWeek}
                      onChange={(e) =>
                        setReminderDayOfWeek(
                          e.target.value as
                            | "MON"
                            | "TUE"
                            | "WED"
                            | "THU"
                            | "FRI"
                            | "SAT"
                            | "SUN"
                        )
                      }
                    >
                      <option value="MON">월</option>
                      <option value="TUE">화</option>
                      <option value="WED">수</option>
                      <option value="THU">목</option>
                      <option value="FRI">금</option>
                      <option value="SAT">토</option>
                      <option value="SUN">일</option>
                    </select>
                    <select
                      value={reminderAmPm}
                      onChange={(e) =>
                        setReminderAmPm(e.target.value as "AM" | "PM")
                      }
                    >
                      <option value="AM">오전</option>
                      <option value="PM">오후</option>
                    </select>
                    <select
                      value={reminderHour12}
                      onChange={(e) =>
                        setReminderHour12(Number(e.target.value))
                      }
                    >
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                    시에 메일로 알려드릴게요
                  </SettingDescription>
                </SettingTextGroup>
              </SettingItem>
            )}

            <SettingItem>
              <SettingTextGroup>
                <SettingTitle>다크 모드 사용</SettingTitle>
                <SettingDescription>
                  기본 테마를 다크 모드로 사용할지 설정해요.
                </SettingDescription>
              </SettingTextGroup>
              <ToggleButton
                $enable={isDark}
                onClick={() => {
                  runToggleTheme();
                  setForm((prev) => ({
                    ...prev,
                    isDarkMode: !prev.isDarkMode,
                  }));
                }}
              >
                <ToggleThumb $enable={isDark} />
              </ToggleButton>
            </SettingItem>

            <SettingItem>
              <SettingTextGroup>
                <SettingTitle>마이페이지 비공개</SettingTitle>
                <SettingDescription>
                  다른 사용자에게 마이페이지를 공개하지 않아요.
                </SettingDescription>
              </SettingTextGroup>
              <ToggleButton
                $enable={form.hideMyPage}
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    hideMyPage: !prev.hideMyPage,
                  }))
                }
              >
                <ToggleThumb $enable={form.hideMyPage} />
              </ToggleButton>
            </SettingItem>
          </SettingsList>
        </FieldGroup>
        <DangerButton type="button" onClick={() => setShowWithdrawModal(true)}>
          회원 탈퇴
        </DangerButton>
        <hr style={{ margin: "24px 0", opacity: 0.2 }} />
        <ButtonRow>
          <PrimaryButton type="button" onClick={handleSubmit}>
            저장
          </PrimaryButton>
          <GhostButton type="button" onClick={handleReset}>
            변경사항 초기화
          </GhostButton>
        </ButtonRow>
      </Form>
      {showWithdrawModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "24px",
              borderRadius: "12px",
              width: "360px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <h3>정말 탈퇴하시겠어요?</h3>
            <p style={{ fontSize: "14px", opacity: 0.8 }}>
              탈퇴를 위해 비밀번호를 입력해주세요. 소셜 회원은 입력란을
              비워두세요.
            </p>

            <input
              type="password"
              placeholder="비밀번호 입력"
              value={withdrawPassword}
              onChange={(e) => setWithdrawPassword(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />

            {withdrawError && (
              <div style={{ color: "red", fontSize: "13px" }}>
                {withdrawError}
              </div>
            )}

            <button
              onClick={handleWithdraw}
              style={{
                padding: "10px",
                borderRadius: "8px",
                background: "#e63946",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              탈퇴하기
            </button>

            <button
              onClick={() => {
                setShowWithdrawModal(false);
                setWithdrawPassword("");
                setWithdrawError("");
              }}
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #aaa",
                cursor: "pointer",
              }}
            >
              취소
            </button>
          </div>
        </div>
      )}

      <DebugDiv />
    </Wrapper>
  );
}

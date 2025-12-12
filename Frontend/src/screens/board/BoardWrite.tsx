// src/pages/board/BoardWrite.tsx
import { useAtomValue } from "jotai";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import styled from "styled-components";
import { userProfileAtom } from "../../atoms";
import {
  attachDiscussImageUrl as attachDiscussFile,
  createDiscussPost,
  updateDiscussPost,
} from "../../api/board_api";
import { updatePostTags } from "../../api/board_api";
import { createPoll, type CreatePollRequest } from "../../api/poll_api";
import { PollEditor } from "../../components/poll";

export type BoardCategory = "daily" | "lecture" | "promotion" | "typo";

// 셀렉트에서 쓸 값: ""(placeholder) + 기존 카테고리
type CategorySelectValue = "" | BoardCategory;

const CATEGORY_LABEL: Record<BoardCategory, string> = {
  daily: "일반",
  lecture: "강의",
  promotion: "홍보",
  typo: "오타",
};

// 카테고리 → 태그 ID 매핑 (distag 테이블 id에 맞게 수정)
const TAG_ID_BY_CATEGORY: Record<BoardCategory, number> = {
  daily: 1,
  lecture: 2,
  promotion: 3,
  typo: 4,
};

const Page = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 60px 16px 40px;
  background: ${({ theme }) => theme.bgColor};
`;

const Wrapper = styled.div`
  width: 100%;
  max-width: 900px;
  background: ${({ theme }) => theme.bgCardColor ?? theme.bgColor};
  border-radius: 16px;
  padding: 24px 24px 28px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.textColor};
`;

const FieldRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.textColor}CC;
`;

const RequiredDot = styled.span`
  color: #ff4d4f;
  margin-left: 3px;
`;

const TextInput = styled.input`
  width: auto;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.textColor};
  background: ${({ theme }) => theme.bgColor};
  color: ${({ theme }) => theme.textColor};
  font-size: 14px;
  outline: none;
  &:focus {
    border-color: ${({ theme }) => theme.focusColor ?? "#4c6fff"};
  }
`;

const Select = styled.select`
  width: 220px;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.textColor};
  background: ${({ theme }) => theme.bgColor};
  color: ${({ theme }) => theme.textColor};
  font-size: 14px;
  outline: none;
  &:focus {
    border-color: ${({ theme }) => theme.focusColor ?? "#4c6fff"};
  }
`;

const TextArea = styled.textarea`
  width: auto;
  min-height: 260px;
  resize: vertical;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.textColor};
  background: ${({ theme }) => theme.bgColor};
  color: ${({ theme }) => theme.textColor};
  font-size: 14px;
  line-height: 1.5;
  outline: none;
  &:focus {
    border-color: ${({ theme }) => theme.focusColor ?? "#4c6fff"};
  }
`;

const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  gap: 12px;
`;

const LeftOptions = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 13px;
  color: ${({ theme }) => theme.muteColor};
`;

const CheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 13px;
  color: ${({ theme }) => theme.textColor};
`;

const Checkbox = styled.input`
  cursor: pointer;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const PrimaryButton = styled.button`
  padding: 8px 16px;
  border-radius: 999px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  background: ${({ theme }) => theme.focusColor};
  color: white;
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

const GhostButton = styled.button`
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.textColor};
  background: transparent;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  color: ${({ theme }) => theme.textColor};
`;
const MuteSpan = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.muteColor};
`;

const ErrorText = styled.p`
  margin: 0;
  font-size: 13px;
  color: #ff4d4f;
`;

//----- 스터디그룹 코드 -----
interface BoardWriteProps {
  mode?: "board" | "study";
  groupId?: number;
}

// 수정 모드에서 받을 게시글 형태(필요한 최소 필드만)
interface EditPostState {
  id: number;
  category: BoardCategory;
  title: string;
  content: string;
  isAnonymous: boolean;
  isPrivate: boolean;
  groupId?: number;
}

interface LocationState {
  post?: EditPostState;
}

export default function BoardWrite({
  mode = "board",
  groupId,
}: BoardWriteProps) {
  const navigate = useNavigate();
  const params = useParams();
  const { category: routeCategory } = useParams();
  const location = useLocation();
  const user = useAtomValue(userProfileAtom);

  const effectiveGroupId = Number(params.groupId ?? groupId);
  const isStudy = mode === "study";

  const editPost = (location.state as LocationState | null)?.post;
  const isEditMode = !!editPost;

  // 🔹 기본 선택값: 수정 모드면 그 카테고리, 아니면 라우트 카테고리, 그 외엔 ""(placeholder)
  const initialCategory: CategorySelectValue =
    editPost?.category ??
    (routeCategory === "daily" ||
    routeCategory === "lecture" ||
    routeCategory === "promotion" ||
    routeCategory === "typo"
      ? (routeCategory as BoardCategory)
      : "");

  const initialTitle = editPost?.title ?? "";
  const initialContent = editPost?.content ?? "";
  const initialIsAnonymous = editPost?.isAnonymous ?? false;
  const initialIsPrivate = editPost?.isPrivate ?? false;

  const [imageUrl, setImageUrl] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<CategorySelectValue>(initialCategory);
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(initialIsAnonymous);
  const [isPrivate, setIsPrivate] = useState(initialIsPrivate);

  // 🔹 투표 관련 상태 (작성 화면에서 미리 입력 → 글 저장 시 함께 전송)
  const [showPollEditor, setShowPollEditor] = useState(false);
  const [pollDraft, setPollDraft] = useState<CreatePollRequest | null>(null);

  const isValid =
    title.trim().length > 0 &&
    content.trim().length > 0 &&
    // 태그(카테고리) 선택해야만 유효
    selectedCategory !== "";

  const isDirty =
    title !== initialTitle ||
    content !== initialContent ||
    isAnonymous !== initialIsAnonymous ||
    isPrivate !== initialIsPrivate ||
    selectedCategory !== initialCategory ||
    pollDraft !== null ||
    imageUrl.trim().length > 0;

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // 스터디 모드일 때 기본값 고정
  useEffect(() => {
    if (isStudy) {
      setSelectedCategory("daily");
      setIsPrivate(false);
    }
  }, [isStudy]);

  useEffect(() => {
    if (!isDirty) return;

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const handleCancel = () => {
    if (isDirty) {
      const ok = window.confirm(
        "작성 중인 내용이 저장되지 않았습니다. 나가시겠습니까?"
      );
      if (!ok) return;
    }
    navigate(-1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 모두 입력해 주세요.");
      return;
    }
    if (selectedCategory === "") {
      setError("태그(카테고리)를 선택해 주세요.");
      return;
    }

    const ok = window.confirm(
      isEditMode ? "게시글을 수정하시겠습니까?" : "게시글을 등록하시겠습니까?"
    );
    if (!ok) return;

    setError(null);

    try {
      setIsSubmitting(true);

      if (isStudy) {
        /*
        const studyPayload = {
          post_title: title.trim(),
          contents: content.trim(),
          tag: "discussion",
          anonymity: isAnonymous,
          is_private: false,
        };
        */

        if (isEditMode && editPost) {
          alert("스터디그룹 글 수정 완료! (더미)");
        } else {
          alert("스터디그룹 글 작성 완료! (더미)");
        }

        if (effectiveGroupId) {
          navigate(`/studygroup/${effectiveGroupId}`);
        } else {
          navigate("/studygroup");
        }
        return;
      }

      const payload = {
        anonymous: isAnonymous,
        title: title.trim(),
        contents: content.trim(),
        privatePost: isPrivate,
        attachmentUrl: null,
      };

      // 선택된 카테고리 → 태그 ID
      const tagId = TAG_ID_BY_CATEGORY[selectedCategory as BoardCategory];

      if (isEditMode && editPost) {
        // 🔥 수정
        await updateDiscussPost(editPost.id, payload);
        // 태그 재설정
        await updatePostTags(editPost.id, [tagId]);

        // 🔥 이미지 URL 있으면 첨부 API 호출
        if (imageUrl.trim()) {
          try {
            await attachDiscussFile(editPost.id, imageUrl.trim());
          } catch (err) {
            console.error("이미지 URL 첨부 실패:", err);
          }
        }

        navigate(-1);
      } else {
        // 🔥 새 글 작성
        const res: any = await createDiscussPost(payload);

        // 백엔드 응답에서 postId 가져오기 (postId 또는 post_id 둘 다 대응)
        const newPostId: number | undefined =
          res?.postId ?? res?.post_id ?? res?.id;

        if (!newPostId) {
          console.warn(
            "새 게시글 ID를 찾을 수 없어 태그/투표/첨부를 설정하지 못했습니다.",
            res
          );
        } else {
          // 태그 설정
          await updatePostTags(newPostId, [tagId]);

          // ✅ 투표 초안이 있으면, 여기서 postId를 써서 함께 생성
          if (pollDraft) {
            try {
              await createPoll(newPostId, pollDraft, true); // true = discuss
            } catch (err) {
              console.error("투표 생성 실패:", err);
            }
          }

          // 🔥 이미지 URL 있으면 첨부 API 호출
          if (imageUrl.trim()) {
            try {
              await attachDiscussFile(newPostId, imageUrl.trim());
            } catch (err) {
              console.error("이미지 URL 첨부 실패:", err);
            }
          }
        }

        navigate("/board/" + selectedCategory);
      }
    } catch (e) {
      console.error("게시글 저장 오류:", e);
      setError("글 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Page>
      <Wrapper as="form" onSubmit={handleSubmit}>
        <Title>{isEditMode ? "게시글 수정" : "게시글 작성"}</Title>

        {!isStudy && (
          <FieldRow>
            <Label>
              태그(카테고리)
              <RequiredDot>*</RequiredDot>
            </Label>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <Select
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(e.target.value as CategorySelectValue)
                }
                disabled={isEditMode} // 수정 시 카테고리 변경 막을 거면 유지
              >
                {/* 🔹 placeholder 옵션 */}
                <option value="">-- 태그를 선택하세요 --</option>
                {(Object.keys(CATEGORY_LABEL) as BoardCategory[]).map((key) => (
                  <option key={key} value={key}>
                    {CATEGORY_LABEL[key]}
                  </option>
                ))}
              </Select>

              <CheckboxLabel>
                <Checkbox
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                />
                익명 작성
              </CheckboxLabel>

              {!isStudy && (
                <CheckboxLabel>
                  <Checkbox
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                  />
                  비밀글
                </CheckboxLabel>
              )}
              {isAnonymous && (
                <MuteSpan>익명 작성 시 수정이 불가합니다.</MuteSpan>
              )}
            </div>
          </FieldRow>
        )}

        <FieldRow>
          <Label>
            제목
            <RequiredDot>*</RequiredDot>
          </Label>
          <TextInput
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력해 주세요."
          />
        </FieldRow>

        <FieldRow>
          <Label>
            내용
            <RequiredDot>*</RequiredDot>
          </Label>
          <TextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력해 주세요."
          />
        </FieldRow>

        {/* 🔹 투표 생성 섹션 */}
        {!isStudy && (
          <FieldRow>
            <Label>투표</Label>
            <div style={{ width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  marginBottom: "8px",
                  gap: "8px",
                  alignItems: "center",
                }}
              >
                <GhostButton
                  type="button"
                  onClick={() => setShowPollEditor((prev) => !prev)}
                >
                  {showPollEditor ? "투표 닫기" : "투표 생성"}
                </GhostButton>
                {pollDraft && (
                  <MuteSpan>
                    글 등록 시 이 설정으로 함께 투표가 생성됩니다.
                  </MuteSpan>
                )}
              </div>

              {/* ✏ 새 글 작성 모드: postId가 없으므로, PollEditor에서 draft만 위로 올림 */}
              {showPollEditor && !isEditMode && (
                <PollEditor
                  isDiscuss={true}
                  mode="deferred"
                  onChangeDraft={setPollDraft}
                />
              )}

              {/* ✏ 수정 모드: 이미 postId가 있으므로, 바로 API로 생성하고 싶으면 immediate 모드 사용 */}
              {showPollEditor && isEditMode && editPost && (
                <PollEditor
                  isDiscuss={true}
                  mode="immediate"
                  postId={editPost.id}
                />
              )}
            </div>
          </FieldRow>
        )}

        {error && <ErrorText>{error}</ErrorText>}

        <BottomRow>
          <LeftOptions>
            <FieldRow>
              <Label>이미지 URL</Label>
              <TextInput
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https:// 로 시작하는 이미지 주소를 입력하세요."
              />
            </FieldRow>
          </LeftOptions>

          <ButtonRow>
            <GhostButton type="button" onClick={handleCancel}>
              취소
            </GhostButton>
            <PrimaryButton type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting
                ? isEditMode
                  ? "수정 중..."
                  : "작성 중..."
                : isEditMode
                ? "수정 완료"
                : "등록"}
            </PrimaryButton>
          </ButtonRow>
        </BottomRow>
      </Wrapper>
    </Page>
  );
}

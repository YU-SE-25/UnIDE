import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";
import { useAtomValue } from "jotai";
import { userProfileAtom } from "../../atoms";

import {
  createDiscussion,
  updateDiscussion,
} from "../../api/studygroupdiscussion_api";

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
`;
const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  gap: 12px;
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
`;
const GhostButton = styled.button`
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.textColor};
  background: transparent;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
`;
/*
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
*/
const ErrorText = styled.p`
  font-size: 13px;
  color: #ff4d4f;
`;

interface EditPostState {
  postId: number;
  title: string;
  contents: string;
}

export default function StudyGroupBoardWrite() {
  const navigate = useNavigate();
  const user = useAtomValue(userProfileAtom);

  // groupId는 OutletContext에서 받는다!
  const { groupId } = useOutletContext<{ groupId: number; role: string }>();

  // postId는 edit일 때만 params에서 들어옴
  //const { postId } = useParams();

  const location = useLocation();
  const editPost = (location.state as { post?: EditPostState })?.post;
  const isEdit = !!editPost;

  const [title, setTitle] = useState(editPost?.title ?? "");
  const [contents, setContents] = useState(editPost?.contents ?? "");
  const [error, setError] = useState<string | null>(null);

  const isValid = title.trim() !== "" && contents.trim() !== "";

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      setError("제목과 내용을 입력해주세요!");
      return;
    }
    setError(null);

    const payload = {
      title: title.trim(),
      contents: contents.trim(),
      privatePost: false,
    };

    try {
      if (isEdit) {
        await updateDiscussion(Number(groupId), editPost!.postId, payload);
        alert("게시글이 수정되었어요!");
      } else {
        await createDiscussion(Number(groupId), payload);
        alert("게시글이 작성되었어요!");
      }
    } catch {
      alert("오류가 발생했습니다!");
    }

    navigate("..", { relative: "path" });
  };

  return (
    <Page>
      <Wrapper as="form" onSubmit={handleSubmit}>
        <Title>{isEdit ? "게시글 수정" : "게시글 작성"}</Title>

        <FieldRow>
          <Label>
            제목<RequiredDot>*</RequiredDot>
          </Label>
          <TextInput
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
          />
        </FieldRow>

        <FieldRow>
          <Label>
            내용<RequiredDot>*</RequiredDot>
          </Label>
          <TextArea
            value={contents}
            onChange={(e) => setContents(e.target.value)}
            placeholder="내용을 입력하세요"
          />
        </FieldRow>

        {error && <ErrorText>{error}</ErrorText>}

        <BottomRow>
          <ButtonRow>
            <GhostButton type="button" onClick={() => navigate(-1)}>
              취소
            </GhostButton>
            <PrimaryButton type="submit">
              {isEdit ? "수정 완료" : "등록"}
            </PrimaryButton>
          </ButtonRow>
        </BottomRow>
      </Wrapper>
    </Page>
  );
}

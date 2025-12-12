// src/components/Poll.tsx
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchPoll,
  votePoll,
  createPoll,
  type PollDetailResponse,
  type CreatePollRequest,
} from "../api/poll_api";

const PollBox = styled.div`
  padding: 16px;
  border-radius: 8px;
  background: ${({ theme }) => theme.bgCardColor ?? theme.bgColor};
  border: 1px solid ${({ theme }) => theme.textColor};
  font-size: 14px;
`;

const PollTitle = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
  color: ${({ theme }) => theme.textColor};
`;

const PollQuestion = styled.div`
  margin-bottom: 12px;
`;

const PollOptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
`;

const PollOptionRow = styled.button<{ $selected: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  color: ${({ theme }) => theme.textColor};

  border-radius: 6px;

  border: 1px solid
    ${({ theme, $selected }) =>
      $selected ? theme.focusColor ?? "#4f46e5" : theme.textColor ?? "#ddd"};

  background: ${({ theme, $selected }) =>
    $selected ? theme.logoColor : theme.bgColor};

  cursor: pointer;
`;

const SmallText = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.logoColor};
`;

const PollEditorBox = styled(PollBox)`
  margin-top: 16px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.textColor};
`;

const Input = styled.input`
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.textColor ?? "#ddd"};
  background: ${({ theme }) => theme.bgColor};
  font-size: 13px;
  color: ${({ theme }) => theme.textColor};
`;

const TextArea = styled.textarea`
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.textColor ?? "#ddd"};
  background: ${({ theme }) => theme.bgColor};
  font-size: 13px;
  resize: vertical;
  min-height: 60px;
  color: ${({ theme }) => theme.textColor};
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
`;

const Button = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  font-size: 13px;
  cursor: pointer;
  background: ${({ theme }) => theme.focusColor ?? "#4f46e5"};
  color: white;
`;

// 투표 보기 + 투표하기
type PollViewProps = {
  postId: number;
  isDiscuss: boolean;
};

export function PollView({ postId, isDiscuss }: PollViewProps) {
  const queryClient = useQueryClient();

  const {
    data: poll,
    isLoading,
    isError,
  } = useQuery<PollDetailResponse>({
    queryKey: ["poll", isDiscuss ? "discuss" : "qna", postId],
    queryFn: () => fetchPoll(postId, isDiscuss),
    enabled: !!postId,
    retry: false,
  });

  const voteMutation = useMutation({
    mutationFn: (label: number) =>
      votePoll(postId, poll!.pollId, label, isDiscuss),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["poll", isDiscuss ? "discuss" : "qna", postId],
      });
    },
  });

  if (isLoading || isError || !poll) return null;

  // ⭐ 서버 옵션 중 이미 투표한 옵션 찾아서 selected로 표시
  const votedOption = poll.options.find(
    (opt) => (opt as any).voted || (opt as any).viewerVoted
  );
  const alreadySelected = votedOption ? Number(votedOption.label) : null;

  const handleVote = (label: number) => {
    if (poll.alreadyVoted) return; // ⭐ 이미 투표했으면 클릭 막기
    voteMutation.mutate(label);
  };

  return (
    <PollBox style={{ marginBottom: 16 }}>
      <PollTitle>{poll.question || "투표"}</PollTitle>
      <PollQuestion>{poll.message}</PollQuestion>

      <PollOptionList>
        {poll.options.map((opt) => {
          const numericLabel = Number(opt.label);

          return (
            <PollOptionRow
              key={opt.optionId}
              type="button"
              onClick={() => handleVote(numericLabel)}
              disabled={poll.alreadyVoted || voteMutation.isPending}
              $selected={alreadySelected === numericLabel} // ⭐ 표시 OK
            >
              <span>{opt.content}</span>
              <SmallText>{opt.voteCount}표</SmallText>
            </PollOptionRow>
          );
        })}
      </PollOptionList>

      <SmallText>
        총 {poll.totalVotes}표 ·{" "}
        {poll.alreadyVoted ? "투표 완료" : "클릭해서 투표하세요"}
      </SmallText>
    </PollBox>
  );
}

// 투표 작성창

// 투표 작성창

type PollEditorMode = "immediate" | "deferred";

type PollEditorProps = {
  isDiscuss: boolean;
  mode?: PollEditorMode;
  postId?: number;
  initialValue?: CreatePollRequest | null;
  onCreated?: () => void;
  onChangeDraft?: (draft: CreatePollRequest | null) => void;
};

export function PollEditor({
  isDiscuss,
  mode = "immediate",
  postId,
  initialValue = null,
  onCreated,
  onChangeDraft,
}: PollEditorProps) {
  const [title, setTitle] = useState(initialValue?.title ?? "");
  const [question, setQuestion] = useState(initialValue?.question ?? "");
  const [endTime, setEndTime] = useState(initialValue?.end_time ?? "");
  const [option1, setOption1] = useState(initialValue?.option1 ?? "");
  const [option2, setOption2] = useState(initialValue?.option2 ?? "");
  const [option3, setOption3] = useState(initialValue?.option3 ?? "");
  const [option4, setOption4] = useState(initialValue?.option4 ?? "");
  const [isPrivate, setIsPrivate] = useState(initialValue?.is_private ?? false);

  // ⭐ 복수 선택 기능 제거 — 항상 false
  //const allowsMulti = false;

  const createMutation = useMutation({
    mutationFn: (payload: CreatePollRequest) =>
      createPoll(postId!, payload, isDiscuss),
    onSuccess: () => {
      if (onCreated) onCreated();
    },
  });

  const buildPayload = (): CreatePollRequest => ({
    title,
    question,
    end_time: endTime,
    is_private: isPrivate,
    allows_multi: false, // ⭐ 항상 단일 선택
    option1,
    option2,
    option3: option3 || undefined,
    option4: option4 || undefined,
  });

  useEffect(() => {
    if (mode === "deferred" && onChangeDraft) {
      const hasRequired =
        title.trim() && question.trim() && option1.trim() && option2.trim();
      if (!hasRequired) {
        onChangeDraft(null);
        return;
      }
      onChangeDraft(buildPayload());
    }
  }, [
    mode,
    title,
    question,
    endTime,
    option1,
    option2,
    option3,
    option4,
    isPrivate,
    onChangeDraft,
  ]);

  const handleSubmitImmediate = () => {
    if (!postId) return;
    const payload = buildPayload();
    createMutation.mutate(payload);
  };

  return (
    <PollEditorBox>
      <Row>
        <Label>투표 제목</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="예: 이 문제 풀이 형식 투표"
        />
      </Row>

      <Row>
        <Label>질문</Label>
        <TextArea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="질문 내용을 입력하세요"
        />
      </Row>

      <Row>
        <Label>마감 시간</Label>
        <Input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </Row>

      <Row>
        <Label>옵션 1</Label>
        <Input
          value={option1}
          onChange={(e) => setOption1(e.target.value)}
          placeholder="옵션 1"
        />
      </Row>

      <Row>
        <Label>옵션 2</Label>
        <Input
          value={option2}
          onChange={(e) => setOption2(e.target.value)}
          placeholder="옵션 2"
        />
      </Row>

      <Row>
        <Label>옵션 3 (선택)</Label>
        <Input
          value={option3}
          onChange={(e) => setOption3(e.target.value)}
          placeholder="옵션 3"
        />
      </Row>

      <Row>
        <Label>옵션 4 (선택)</Label>
        <Input
          value={option4}
          onChange={(e) => setOption4(e.target.value)}
          placeholder="옵션 4"
        />
      </Row>

      <Row>
        <Label>
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
          />{" "}
          비공개 투표
        </Label>

        {/* ⭐ 복수 선택 허용 UI 유지(주석만), 실제론 동작 안함 */}
        {/*
        <Label>
          <input
            type="checkbox"
            checked={false}
            disabled
          />{" "}
          복수 선택 허용 (현재 비활성화됨)
        </Label>
        */}
      </Row>

      {mode === "immediate" && (
        <ButtonRow>
          <Button
            type="button"
            onClick={handleSubmitImmediate}
            disabled={createMutation.isPending}
          >
            투표 생성
          </Button>
        </ButtonRow>
      )}
    </PollEditorBox>
  );
}

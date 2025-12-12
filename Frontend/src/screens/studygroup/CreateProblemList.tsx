import { useEffect, useState } from "react";
import {
  ModalOverlay,
  ModalContent,
  ModalTitle,
  InputField,
  ButtonContainer,
  PrimaryButton,
  SecondaryButton,
  ProblemListAddButton,
} from "../../theme/StudyGroupMain.Style";

import {
  PLWrapper,
  PLRow,
  PLLabel,
  ProblemListBox,
  ProblemItem,
  RemoveButton,
} from "../../theme/StudyGroupDetail.Style";

import {
  createProblemList,
  updateProblemList,
  fetchAssignedProblemListDetail,
} from "../../api/studygroup_api";

import ProblemSearchModal from "./ProblemSearch";
import type { SimpleProblem } from "../../api/problem_api";

/* 
  mode: "create" | "edit"
  problemListId: edit 모드에서만 필요
*/

export default function CreateProblemList({
  mode,
  groupId,
  problemListId,
  onClose,
  onFinished,
}: {
  mode: "create" | "edit";
  groupId: number;
  problemListId?: number;
  onClose: () => void;
  onFinished: () => void;
}) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [problems, setProblems] = useState<SimpleProblem[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  // ✨ edit 모드일 때 기존 데이터 불러오기
  useEffect(() => {
    if (mode !== "edit" || !problemListId) return;

    const load = async () => {
      const data = await fetchAssignedProblemListDetail(groupId, problemListId);

      setTitle(data.listTitle);
      setDueDate(data.dueDate);
      setProblems(
        data.problems.map((p) => ({
          problemId: p.problemId,
          problemTitle: p.problemTitle,
        }))
      );
    };

    load();
  }, [mode, problemListId, groupId]);

  const handleSubmit = async () => {
    if (!title.trim()) return alert("목록명을 입력하세요");
    if (!dueDate.trim()) return alert("마감일을 선택하세요");
    if (problems.length === 0) return alert("문제를 하나 이상 선택하세요");

    if (mode === "create") {
      await createProblemList(groupId, {
        listTitle: title,
        dueDate,
        problems: problems.map((p) => p.problemId),
      });
      alert("문제 리스트가 생성되었습니다!");
    } else {
      await updateProblemList(groupId, problemListId!, {
        listTitle: title,
        dueDate,
        problems: problems.map((p) => p.problemId),
      });
      alert("문제 리스트가 수정되었습니다!");
    }

    onFinished();
    onClose();
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>
          {mode === "create" ? "문제 리스트 생성" : "문제 리스트 수정"}
        </ModalTitle>

        <PLWrapper>
          <PLRow>
            <PLLabel>목록명</PLLabel>
            <InputField
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </PLRow>

          <PLRow>
            <PLLabel>문제 추가</PLLabel>
            <ProblemListAddButton onClick={() => setShowSearch(true)}>
              문제 찾기
            </ProblemListAddButton>
          </PLRow>

          {problems.length > 0 && (
            <PLRow>
              <PLLabel>선택한 문제들</PLLabel>
              <ProblemListBox>
                {problems.map((p) => (
                  <ProblemItem key={p.problemId}>
                    {p.problemTitle}
                    <RemoveButton
                      onClick={() =>
                        setProblems((prev) =>
                          prev.filter((x) => x.problemId !== p.problemId)
                        )
                      }
                    >
                      X
                    </RemoveButton>
                  </ProblemItem>
                ))}
              </ProblemListBox>
            </PLRow>
          )}

          <PLRow>
            <PLLabel>마감일</PLLabel>
            <InputField
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </PLRow>

          <ButtonContainer>
            <SecondaryButton onClick={onClose}>닫기</SecondaryButton>
            <PrimaryButton onClick={handleSubmit}>
              {mode === "create" ? "생성하기" : "저장하기"}
            </PrimaryButton>
          </ButtonContainer>
        </PLWrapper>

        {showSearch && (
          <ProblemSearchModal
            onClose={() => setShowSearch(false)}
            onSelectProblem={(p) => {
              if (problems.some((x) => x.problemId === p.problemId)) {
                alert("이미 선택된 문제입니다!");
                return;
              }
              setProblems((prev) => [...prev, p]);
              setShowSearch(false);
            }}
            exclude={problems.map((p) => p.problemId)}
          />
        )}
      </ModalContent>
    </ModalOverlay>
  );
}

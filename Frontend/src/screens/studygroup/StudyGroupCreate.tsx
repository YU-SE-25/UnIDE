import { useState, useEffect } from "react";
import {
  ModalOverlay,
  ModalContent,
  CloseButton,
  FormRow,
  Label,
  InputField,
  TextAreaField,
  ButtonContainer,
  AddButton,
  CancelButton,
} from "../../theme/StudyGroupMain.Style";

import { createStudyGroup, fetchStudyGroups } from "../../api/studygroup_api";

import type { StudyGroup } from "../../api/studygroup_api";

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateStudyGroup({ onClose, onCreated }: Props) {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [maxMembers, setMaxMembers] = useState(10);
  const [error, setError] = useState("");

  // 전체 그룹 받아오기
  const [allGroups, setAllGroups] = useState<StudyGroup[]>([]);

  useEffect(() => {
    const load = async () => {
      const list = await fetchStudyGroups(); // 지금은 더미, 나중엔 API, 따로 바꿀거없음
      setAllGroups(list);
    };
    load();
  }, []);

  // 중복 검사
  const isDuplicateName = (name: string) => {
    return allGroups.some((g) => g.groupName.trim() === name.trim());
  };

  // 생성 처리
  const handleSubmit = async () => {
    setError("");

    if (!groupName.trim()) {
      setError("그룹명을 입력해주세요.");
      return;
    }

    if (isDuplicateName(groupName)) {
      setError("이미 존재하는 그룹명입니다.");
      return;
    }

    const payload = {
      groupName: groupName.trim(),
      groupDescription: groupDescription.trim(),
      maxMembers,
    };

    await createStudyGroup(payload);

    alert("스터디 그룹이 성공적으로 생성되었습니다!");
    onCreated();
    onClose();
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>×</CloseButton>

        <h2>스터디 그룹 생성</h2>

        <FormRow>
          <Label>그룹명</Label>
          <InputField
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="예: 알고리즘 스터디"
          />
        </FormRow>

        <FormRow>
          <Label>그룹 설명</Label>
          <TextAreaField
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
            placeholder="그룹에 대한 소개를 입력하세요."
          />
        </FormRow>

        <FormRow>
          <Label>최대 인원</Label>
          <InputField
            type="number"
            min={1}
            max={50}
            value={maxMembers}
            onChange={(e) => setMaxMembers(Number(e.target.value))}
          />
        </FormRow>

        {error && (
          <p style={{ color: "red", marginTop: -10, marginBottom: 10 }}>
            {error}
          </p>
        )}

        <ButtonContainer>
          <CancelButton onClick={onClose}>취소</CancelButton>
          <AddButton onClick={handleSubmit}>생성하기</AddButton>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
}

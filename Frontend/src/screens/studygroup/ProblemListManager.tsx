import { useEffect, useState } from "react";
import {
  fetchAssignedProblemLists,
  deleteProblemList,
} from "../../api/studygroup_api";
import {
  ModalOverlay,
  ModalContent,
  ModalTitle,
} from "../../theme/StudyGroupMain.Style";
import ProblemListModal from "./CreateProblemList";
import type { AssignedProblemList } from "../../api/studygroup_api";

// 🌟 공통 버튼 스타일
const buttonStyleBase = {
  padding: "6px 14px",
  borderRadius: "6px",
  border: "none",
  fontSize: "14px",
  cursor: "pointer",
  color: "white",
};

const editBtnStyle = {
  ...buttonStyleBase,
  backgroundColor: "#4CAF50",
};

const deleteBtnStyle = {
  ...buttonStyleBase,
  backgroundColor: "#E74C3C",
  marginLeft: "8px",
};

const closeBtnStyle = {
  ...buttonStyleBase,
  backgroundColor: "#95A5A6",
  marginTop: "20px",
  width: "100%",
};

export default function ProblemListManageModal({
  groupId,
  onClose,
}: {
  groupId: number;
  onClose: () => void;
}) {
  const [lists, setLists] = useState<AssignedProblemList[]>([]);
  const [selectedListId, setSelectedListId] = useState<number | null>(null);

  const loadLists = async () => {
    const data = await fetchAssignedProblemLists(groupId);
    setLists(data);
  };

  useEffect(() => {
    loadLists();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제할까요?")) return;
    await deleteProblemList(groupId, id);
    alert("삭제되었습니다!");
    loadLists();
  };

  return (
    <ModalOverlay>
      <ModalContent style={{ maxWidth: 600 }}>
        <ModalTitle>문제 리스트 관리</ModalTitle>

        {lists.length === 0 && <p>등록된 문제 리스트가 없습니다.</p>}

        {lists.map((list) => (
          <div
            key={list.problemListId}
            style={{
              padding: "12px 0",
              borderBottom: "1px solid #ddd",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <b>{list.listTitle}</b>
            <div>마감일: {list.dueDate}</div>

            {/* 버튼 정렬 */}
            <div style={{ display: "flex", marginTop: 8 }}>
              <button
                style={editBtnStyle}
                onClick={() => setSelectedListId(list.problemListId)}
              >
                수정
              </button>

              <button
                style={deleteBtnStyle}
                onClick={() => handleDelete(list.problemListId)}
              >
                삭제
              </button>
            </div>
          </div>
        ))}

        {/* 닫기 버튼 */}
        <button style={closeBtnStyle} onClick={onClose}>
          닫기
        </button>

        {selectedListId && (
          <ProblemListModal
            mode="edit"
            groupId={groupId}
            problemListId={selectedListId}
            onClose={() => setSelectedListId(null)}
            onFinished={loadLists}
          />
        )}
      </ModalContent>
    </ModalOverlay>
  );
}

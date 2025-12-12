import styled from "styled-components";

type EditButtonProps = {
  onEdit: () => void;
  onDelete: () => void;
  confirmMessage?: string;
};

export default function EditButton({
  onEdit,
  onDelete,
  confirmMessage = "정말로 삭제하시겠습니까?",
}: EditButtonProps) {
  const handleEdit = () => {
    onEdit();
  };

  const handleDelete = () => {
    const yes = window.confirm(confirmMessage);
    if (!yes) return;
    onDelete();
  };

  return (
    <>
      <Btn onClick={handleEdit}>수정</Btn>
      <Span>|</Span>
      <Btn onClick={handleDelete}>삭제</Btn>
    </>
  );
}

const Btn = styled.span`
  background: none;
  border: none;
  color: ${({ theme }) => theme.muteColor};
  cursor: pointer;
  font-size: 13px;
  padding: 0 4px;

  &:hover {
    opacity: 0.8;
    text-decoration: underline;
  }
`;

const Span = styled.span`
  color: ${({ theme }) => theme.muteColor};
  font-size: 13px;
  padding: 0 4px;
  border: none;
  background: none;
  cursor: default;
`;

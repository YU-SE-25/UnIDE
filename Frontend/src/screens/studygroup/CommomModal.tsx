import { useEffect } from "react";
import styled from "styled-components";
import {
  SecondaryButton,
  DangerButton,
} from "../../theme/StudyGroupMain.Style";

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
`;

const ModalBox = styled.div`
  background: ${({ theme }) => theme.bgColor};
  color: ${({ theme }) => theme.textColor};
  padding: 30px;
  border-radius: 14px;
  width: 90%;
  max-width: 420px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);

  h2 {
    margin: 0 0 12px;
    font-size: 22px;
    font-weight: 700;
  }

  p {
    opacity: 0.85;
    font-size: 16px;
    margin-bottom: 25px;
    line-height: 1.5;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

interface Props {
  title: string;
  message: React.ReactNode;
  dangerText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function CommonModal({
  title,
  message,
  dangerText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
}: Props) {
  // ESC 키로 닫기
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onCancel]);

  return (
    <ModalOverlay onClick={onCancel}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <div>{message}</div>

        <ButtonRow>
          <SecondaryButton onClick={onCancel}>{cancelText}</SecondaryButton>
          <DangerButton onClick={onConfirm}>{dangerText}</DangerButton>
        </ButtonRow>
      </ModalBox>
    </ModalOverlay>
  );
}

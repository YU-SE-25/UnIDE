import { useState } from "react";
import styled from "styled-components";
import { createReport, type ReportTargetType } from "../api/report_api";

interface Props {
  targetContentId: number;
  targetContentType: ReportTargetType;
  onClose: () => void;
  extraId?: number;
}

const REPORT_TYPES = ["욕설/비방", "광고/도배", "저작권 침해", "기타"] as const;

export default function ReportModal({
  targetContentId,
  targetContentType,
  onClose,
  extraId,
}: Props) {
  const [reportType, setReportType] = useState<string>("");
  const [customReason, setCustomReason] = useState("");
  const [loading, setLoading] = useState(false);

  const isCustom = reportType === "기타";

  const handleSubmit = async () => {
    if (!reportType) {
      alert("신고 유형을 선택해주세요.");
      return;
    }

    let finalReason = "";

    if (isCustom) {
      if (!customReason.trim()) {
        alert("기타 사유를 입력해주세요.");
        return;
      }
      finalReason = `기타: ${customReason.trim()}`;
    } else {
      finalReason = reportType; // 기본 사유 그대로
    }

    try {
      setLoading(true);

      await createReport({
        targetContentType,
        targetContentId,
        reason: finalReason,
        extraId,
      });

      alert("신고가 접수되었습니다.");
      onClose();
    } catch (error) {
      console.error(error);
      alert("신고 전송 실패. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay>
      <Modal>
        <Title>컨텐츠 신고</Title>

        <Label>신고 유형</Label>
        <StyledSelect
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
        >
          <option value="">선택해주세요</option>
          {REPORT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </StyledSelect>

        {isCustom && (
          <>
            <Label>상세 사유</Label>
            <StyledTextarea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="사유를 입력해주세요."
            />
          </>
        )}

        <ButtonRow>
          <CancelBtn onClick={onClose} disabled={loading}>
            취소
          </CancelBtn>
          <SubmitBtn onClick={handleSubmit} disabled={loading}>
            {loading ? "전송 중..." : "신고하기"}
          </SubmitBtn>
        </ButtonRow>
      </Modal>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
`;

const Modal = styled.div`
  width: 380px;
  background: ${({ theme }) => theme.bgColor};
  color: ${({ theme }) => theme.textColor};
  padding: 22px;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.textColor}33;
  box-shadow: 0 6px 28px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 20px;
`;

const Label = styled.label`
  font-size: 14px;
`;

const StyledSelect = styled.select`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.textColor}44;
  background: ${({ theme }) => theme.bgColor};
  color: ${({ theme }) => theme.textColor};
`;

const StyledTextarea = styled.textarea`
  padding: 10px;
  height: 120px;
  resize: none;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.textColor}44;
  background: ${({ theme }) => theme.bgColor};
  color: ${({ theme }) => theme.textColor};
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const CancelBtn = styled.button`
  padding: 8px 14px;
  border-radius: 8px;
  background: ${({ theme }) => theme.headerBgColor};
  color: ${({ theme }) => theme.textColor};
  border: 1px solid ${({ theme }) => theme.textColor}44;
`;

const SubmitBtn = styled.button`
  padding: 8px 14px;
  border-radius: 8px;
  background: ${({ theme }) => theme.focusColor};
  color: #000;
  border: none;
`;

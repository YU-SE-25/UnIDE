import { useState } from "react";
import styled from "styled-components";
import ReportModal from "../screens/ReportModal";
import type { ReportTargetType } from "../api/report_api";

interface Props {
  targetContentId: number;
  targetContentType: ReportTargetType;
}

export default function ReportButton({
  targetContentId,
  targetContentType,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Btn type="button" onClick={() => setOpen(true)}>
        🚨신고
      </Btn>

      {open && (
        <ReportModal
          targetContentId={targetContentId}
          targetContentType={targetContentType}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

const Btn = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.focusColor};
  cursor: pointer;
  font-size: 13px;
  padding: 0 4px;

  &:hover {
    opacity: 0.8;
  }
`;

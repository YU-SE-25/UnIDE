import styled from "styled-components";

/* 전체 컨테이너 */
export const ManageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

/* 박스 레이아웃 */
export const SectionBox = styled.div`
  background-color: ${({ theme }) => theme.headerBgColor};
  border: 1px solid ${({ theme }) => theme.authHoverBgColor};
  padding: 20px;
  border-radius: 12px;
`;

/* 제목 */
export const SectionTitle = styled.h3`
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 15px;
  color: ${({ theme }) => theme.textColor};
`;

/* 입력 라벨 */
export const ManageLabel = styled.label`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.textColor};
  margin-top: 10px;
`;

/* 입력창 */
export const InputField = styled.input`
  margin-top: 5px;
  padding: 10px 12px;
  background-color: ${({ theme }) => theme.bgColor};
  border: 1px solid ${({ theme }) => theme.authHoverBgColor};
  border-radius: 8px;
  color: ${({ theme }) => theme.textColor};
  font-size: 16px;
`;

/* 큰 버튼 (저장 버튼) */
export const ManageButton = styled.button`
  width: 100%;
  margin-top: 20px;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background-color: ${({ theme }) => theme.logoColor};
  color: ${({ theme }) => theme.bgColor};
  font-weight: 700;
  font-size: 18px;
  cursor: pointer;
`;

/* 멤버 행 */
export const MemberKickRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  background-color: ${({ theme }) => theme.bgColor};
  border: 1px solid ${({ theme }) => theme.authHoverBgColor};
  padding: 12px;
  border-radius: 8px;
`;

/* 강퇴 버튼 */
export const KickButton = styled.button`
  padding: 8px 12px;
  border-radius: 8px;
  background-color: #e45757;
  color: #fff;
  border: none;
  cursor: pointer;
`;

/* 삭제 버튼 */
export const DangerButton = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  background-color: #e45757;
  color: white;
  font-weight: 700;
  border: none;
  cursor: pointer;
`;

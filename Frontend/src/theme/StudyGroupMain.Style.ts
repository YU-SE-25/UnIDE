import styled from "styled-components";

export const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px 40px 20px;
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
`;

export const HeaderContainer = styled.div`
  margin-bottom: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${(props) => props.theme.authHoverBgColor};
  color: ${(props) => props.theme.textColor};
  padding-bottom: 15px;

  h1 {
    font-size: 30px;
    font-weight: 700;
    color: ${(props) => props.theme.textColor};
  }
  p {
    font-size: 18px;
    margin-top: 5px;
    opacity: 0.8;
    color: ${(props) => props.theme.textColor};
  }
`;

export const SectionContainer = styled.div`
  margin-bottom: 50px;
  h2 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 25px;
    padding-bottom: 8px;
    border-bottom: 1px dashed ${(props) => props.theme.authHoverBgColor};
    color: ${(props) => props.theme.textColor};
  }
`;

export const MyGroupSection = styled(SectionContainer)`
  background-color: ${(props) => props.theme.authHoverBgColor};
  padding: 20px;
  border-radius: 10px;
`;

export const AddButton = styled.button`
  padding: 12px 30px;
  background-color: ${(props) => props.theme.logoColor};
  color: ${(props) => props.theme.authHoverTextColor};
  border: none;
  border-radius: 5px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
`;

export const SearchInput = styled.input`
  padding: 10px 15px;
  border: 1px solid ${(props) => props.theme.authHoverBgColor};
  border-radius: 4px;
  width: 300px;
  font-size: 18px;
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.headerBgColor};
`;

// 그룹 카드 레이아웃
export const GroupGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const BaseCard = styled.div`
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: ${(props) => props.theme.textColor};
  h3 {
    font-size: 28px;
    font-weight: 700;
    margin: 0;
    color: ${(props) => props.theme.textColor};
  }
  p {
    font-size: 18px;
    opacity: 1;
    color: ${(props) => props.theme.textColor};
  }
`;

export const MyGroupCard = styled(BaseCard)`
  background-color: ${(props) => props.theme.bgColor};
  border: 2px solid ${(props) => props.theme.logoColor};
`;

export const GroupCard = styled(BaseCard)`
  background-color: ${({ theme }) => theme.headerBgColor};
  border: 1px solid ${({ theme }) => theme.authHoverBgColor};

  & p,
  & strong {
    color: ${({ theme }) => theme.textColor} !important;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const GroupLeader = styled.p`
  font-size: 14px;
  color: ${(props) => props.theme.logoColor};
  margin: 2px 0 5px 0;
`;

export const CardTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  span {
    color: ${(props) => props.theme.authHoverBgColor};
    background-color: ${(props) => props.theme.focusColor};
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 18px;
  }
`;

export const JoinButton = styled.button`
  margin-top: 10px;
  padding: 10px 15px;
  background-color: ${(props) => props.theme.logoColor};
  color: ${(props) => props.theme.authHoverTextColor};
  border: none;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
`;

export const EmptyMessage = styled.p`
  font-size: 16px;
  opacity: 0.7;
`;

export const ControlBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
`;
//태그
export const TagDisplayContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
`;

export const TagChip = styled.span<{ active?: boolean }>`
  display: inline-flex;
  align-items: center;
  background-color: ${(props) =>
    props.active ? props.theme.focusColor : props.theme.authHoverBgColor};
  color: ${(props) => props.theme.textColor};
  padding: 4px 9px;
  border-radius: 13px;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

//스터디 그룹 생성

//모달 배경 오버레이
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

//모달 내용 컨테이너
export const ModalContent = styled.div`
  position: relative;
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
  padding: 30px;
  border-radius: 12px;

  width: 90%;
  max-width: 750px;
  max-height: 90vh;
  overflow-y: auto;

  h2 {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 30px;
    color: ${(props) => props.theme.textColor};
  }
`;

//폼 각 행
export const FormRow = styled.div`
  margin-bottom: 30px;
`;

export const Label = styled.label`
  display: block;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
  color: ${(props) => props.theme.textColor};
`;

//버튼 컨테이너
export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
`;

//취소 버튼
export const CancelButton = styled(AddButton)`
  background-color: ${(props) => props.theme.authHoverBgColor};
  color: ${(props) => props.theme.textColor};
  &:hover {
    background-color: ${(props) => props.theme.authHoverBgColor};
    opacity: 0.8;
  }
`;
// 태그 전체 묶음 (인라인 스타일 제거용)
export const TagWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
`;

//폼 구조 및 입력 요소
export const StyledInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid ${(props) => props.theme.authHoverBgColor};
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 15px;
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.bgColor};
`;
export const StyledTextArea = styled.textarea`
  width: 100%;
  min-height: 150px;
  padding: 10px;
  border: 1px solid ${(props) => props.theme.authHoverBgColor};
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 15px;
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.bgColor};
  resize: vertical;
`;
//X버튼
export const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 28px;
  font-weight: bold;
  background: none;
  border: none;
  color: ${(props) => props.theme.textColor};
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`;

export const CardText = styled.p`
  color: ${({ theme }) => theme.textColor};
  margin: 6px 0;
`;

export const CardStrong = styled.strong`
  color: ${({ theme }) => theme.textColor};
`;

//변경사항 저장
export const SaveButton = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;

  background-color: ${({ theme }) => theme.logoColor};
  color: ${({ theme }) => theme.bgColor};

  transition: background-color 0.15s ease;
`;

//입력 필드 스타일
export const InputField = StyledInput;

//텍스트 영역 필드
export const TextAreaField = styled.textarea`
  width: 100%;
  min-height: 140px;
  padding: 12px;
  border: 1px solid ${(props) => props.theme.authHoverBgColor};
  border-radius: 6px;
  font-size: 16px;
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.bgColor};
  resize: vertical;
  box-sizing: border-box;
`;

// 버튼 공통 베이스
export const BaseButton = styled.button`
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

// 기본(주황/포커스색 등) - "저장", "생성하기" 같은 애들
export const PrimaryButton = styled(BaseButton)`
  background: ${({ theme }) => theme.focusColor};
  color: ${({ theme }) => theme.bgColor};
`;

// 중립(회색) - "닫기", "취소"
export const SecondaryButton = styled(BaseButton)`
  background: ${({ theme }) => theme.authHoverBgColor};
  color: ${({ theme }) => theme.textColor};
`;

// 위험(빨강) - "강퇴하기", "그룹 삭제", 진짜 위험한 애들
export const DangerButton = styled(BaseButton)`
  background: #e45757;
  color: white;
  font-weight: 600;
`;

// 문제 리스트 추가 버튼도 크기만 같게, 색은 알아서
export const ProblemListAddButton = styled(BaseButton)`
  background: ${({ theme }) => theme.authHoverBgColor};
  color: ${({ theme }) => theme.textColor};
`;

//제목
export const ModalTitle = styled.h2`
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 25px;
  color: ${({ theme }) => theme.textColor};
`;

//서브타이틀
export const ModalSubTitle = styled.h3`
  margin-top: 28px;
  margin-bottom: 15px;
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.textColor};
`;

//맴버리스트
export const MemberRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 10px 0;
  border-bottom: 1px solid ${({ theme }) => theme.authHoverBgColor};
  color: ${({ theme }) => theme.textColor};
  span {
    color: ${({ theme }) => theme.textColor};
  }
`;

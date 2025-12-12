import { useState, useMemo, useEffect } from "react";
import styled from "styled-components";

import { fetchSimpleProblems, type SimpleProblem } from "../../api/problem_api";

interface Props {
  onClose: () => void;
  onSelectProblem: (problem: SimpleProblem) => void;
  exclude?: number[];
}

export default function ProblemSearchModal({
  onClose,
  onSelectProblem,
  exclude = [],
}: Props) {
  const [keyword, setKeyword] = useState("");

  // 실제 문제 목록 상태
  const [problems, setProblems] = useState<SimpleProblem[]>([]);

  // API로 문제 목록 불러오기
  useEffect(() => {
    const load = async () => {
      const list = await fetchSimpleProblems(); // <-- SimpleProblem[] 반환됨
      setProblems(list);
    };

    load();
  }, []);

  //검색
  const filtered = useMemo(() => {
    const lower = keyword.toLowerCase();
    return problems.filter((p) => p.problemTitle.toLowerCase().includes(lower));
  }, [keyword, problems]);

  return (
    <Overlay>
      <Modal>
        <Header>
          <h2>문제 찾기</h2>
          <Close onClick={onClose}>×</Close>
        </Header>

        <SearchInput
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="문제 제목 검색"
        />

        <List>
          {filtered.map((p) => {
            const isDisabled = exclude.includes(p.problemId);

            return (
              <Item
                key={p.problemId}
                disabled={isDisabled}
                onClick={() => {
                  if (isDisabled) return;
                  onSelectProblem(p);
                }}
              >
                {p.problemId}. {p.problemTitle}
              </Item>
            );
          })}
        </List>
      </Modal>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
`;

const Modal = styled.div`
  background: ${({ theme }) => theme.bgColor};
  color: ${({ theme }) => theme.textColor};
  padding: 25px;
  border-radius: 14px;
  width: 90%;
  max-width: 450px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Close = styled.button`
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  margin: 15px 0;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.authHoverBgColor};
`;

const List = styled.div`
  max-height: 350px;
  overflow-y: auto;
  color: ${({ theme }) => theme.textColor};
`;

const Item = styled.div<{ disabled?: boolean }>`
  padding: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.authHoverBgColor};
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  color: ${({ theme }) => theme.textColor};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};

  &:hover {
    background: ${({ theme, disabled }) =>
      disabled ? "transparent" : theme.authHoverBgColor};
  }
`;

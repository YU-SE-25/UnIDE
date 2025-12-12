import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  getDiscussionDetail,
  getDiscussionComments,
  createDiscussionComment,
  updateDiscussionComment,
  deleteDiscussionComment,
  likeDiscussion,
  likeDiscussionComment,
  deleteDiscussion,
} from "../../api/studygroupdiscussion_api";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";

import { useAtomValue } from "jotai";
import { userProfileAtom } from "../../atoms";

// 댓글 타입 (프론트에서 일관되게 사용할 형태)
interface SGComment {
  commentId: number;
  author: string;
  contents: string;
  likeCount: number;
  createTime: string;
  viewerLiked?: boolean;
}

export default function StudyGroupBoardDetail() {
  const { postId } = useParams();
  const { groupId } = useOutletContext<{ groupId: number; role: string }>();
  const nav = useNavigate();

  const user = useAtomValue(userProfileAtom);

  const [post, setPost] = useState<any | null>(null);
  const [comments, setComments] = useState<SGComment[]>([]);
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  // 상세 조회
  useEffect(() => {
    if (!groupId || !postId) return;

    (async () => {
      const detail = await getDiscussionDetail(Number(groupId), Number(postId));
      setPost(detail); // 끝!
      window.scrollTo(0, 0);
    })();
  }, [groupId, postId]);

  // 댓글 조회
  useEffect(() => {
    if (!groupId || !postId) return;
    loadComments();
  }, [groupId, postId]);

  async function loadComments() {
    const res = await getDiscussionComments(Number(groupId), Number(postId));

    // 1) res가 배열인지 체크
    const raw = Array.isArray(res) ? res : [];

    const mapped: SGComment[] = raw.map((c: any) => ({
      commentId: c.comment_id,
      author: c.author_name, // author_name
      contents: c.content, // content
      likeCount: c.like_count ?? 0, // 없으면 0 처리
      createTime: c.create_time, // create_time
      viewerLiked: c.viewerLiked ?? false,
    }));

    setComments(mapped);
  }

  // 좋아요 (게시글)
  const handleLike = async () => {
    const res = await likeDiscussion(Number(groupId), Number(postId));
    setPost((p: any) => ({
      ...p,
      likeCount: res.likeCount,
      viewerLiked: res.viewerLiked,
    }));
  };

  // 글 삭제
  const handleDeletePost = async () => {
    const ok = window.confirm("정말 삭제할까요?");
    if (!ok) return;

    await deleteDiscussion(Number(groupId), Number(postId));

    alert("삭제되었습니다.");
    nav(`/studygroup/${groupId}`);
  };

  // 댓글 작성 / 수정
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;

    // 수정 모드
    if (editingId !== null) {
      await updateDiscussionComment(Number(groupId), editingId, {
        contents: text,
      });
      setEditingId(null);
      setDraft("");
      await loadComments();
      return;
    }

    // 새 댓글 작성
    await createDiscussionComment(Number(groupId), Number(postId), {
      contents: text,
    });

    setDraft("");
    await loadComments();
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: number) => {
    const ok = window.confirm("댓글을 삭제할까요?");
    if (!ok) return;

    await deleteDiscussionComment(Number(groupId), commentId);
    await loadComments();
  };

  // 댓글 좋아요
  const handleLikeComment = async (commentId: number) => {
    if (!groupId) return;

    await likeDiscussionComment(Number(groupId), Number(commentId));
    await loadComments();
  };

  if (!post) return <p>Loading...</p>;

  return (
    <DetailWrapper>
      <DetailCard>
        <DetailHeader>
          <TitleBlock>
            <DetailTitle>{post.title}</DetailTitle>

            <MetaRow>
              <span>
                <strong>작성자:</strong> {post.authorName}
              </span>
            </MetaRow>
          </TitleBlock>

          <HeaderActions>
            {user?.userId === post.authorId ? (
              <>
                <TextButton
                  onClick={() =>
                    nav(`/studygroup/${groupId}/discussion/${postId}/edit`, {
                      state: { post },
                    })
                  }
                >
                  수정
                </TextButton>

                <Divider>|</Divider>

                <TextButton onClick={handleDeletePost}>삭제</TextButton>

                <CloseButton
                  onClick={() => nav(`/studygroup/${groupId}/discussion`)}
                >
                  닫기
                </CloseButton>
              </>
            ) : (
              <CloseButton
                onClick={() => nav(`/studygroup/${groupId}/discussion`)}
              >
                닫기
              </CloseButton>
            )}
          </HeaderActions>
        </DetailHeader>

        <DetailBody>
          <DetailMain>
            <ContentArea>{post.contents}</ContentArea>

            <StatsRow>
              <span style={{ cursor: "pointer" }} onClick={handleLike}>
                ❤️ {post.likeCount}
              </span>
              <span>💬 {comments.length}</span>
            </StatsRow>

            <CommentsSection>
              <CommentsHeader>
                <CommentCount>댓글 {comments.length}</CommentCount>
              </CommentsHeader>

              {comments.length === 0 ? (
                <EmptyText>첫 댓글을 작성해보세요!</EmptyText>
              ) : (
                <CommentList>
                  {(comments ?? []).map((c) => (
                    <CommentItem key={c.commentId}>
                      <CommentMeta>
                        <strong>{c.author}</strong> ·{" "}
                        {(c.createTime ?? "").slice(0, 10)}
                        <CommentActionButton
                          onClick={() => handleLikeComment(c.commentId)}
                        >
                          ❤️ {c.likeCount}
                        </CommentActionButton>
                        {user?.nickname === c.author && (
                          <>
                            <TextButton
                              onClick={() => {
                                setEditingId(c.commentId);
                                setDraft(c.contents);
                              }}
                            >
                              수정
                            </TextButton>

                            <Divider>|</Divider>

                            <TextButton
                              onClick={() => handleDeleteComment(c.commentId)}
                              style={{ color: "#ff4d4f" }} // 삭제는 약하게 빨간 느낌
                            >
                              삭제
                            </TextButton>
                          </>
                        )}
                      </CommentMeta>
                      <CommentContent>{c.contents}</CommentContent>
                    </CommentItem>
                  ))}
                </CommentList>
              )}

              {/* 댓글 입력 */}
              <CommentForm onSubmit={handleSubmitComment}>
                <CommentTextarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="댓글을 입력하세요"
                />

                <CommentSubmitRow>
                  <CommentButton type="submit">
                    {editingId ? "댓글 수정" : "댓글 작성"}
                  </CommentButton>
                </CommentSubmitRow>
              </CommentForm>
            </CommentsSection>
          </DetailMain>
        </DetailBody>
      </DetailCard>
    </DetailWrapper>
  );
}

const DetailWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const DetailCard = styled.section`
  width: 100%;
  max-width: 960px;
  margin: 20px auto 24px;
  padding: 20px 24px;
  border-radius: 12px;

  background: ${({ theme }) => theme.bgColor};
  border: 1px solid rgba(0, 0, 0, 0.16);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);

  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const DetailHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const DetailTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  color: ${({ theme }) => theme.textColor};
`;

const MetaRow = styled.div<{
  isDisabled?: boolean;
}>`
  font-size: 13px;
  color: ${({ theme }) => theme.textColor}60;

  span + span::before {
    content: " | ";
    margin: 0 4px;
  }
  p,
  span,
  strong {
    transition: none;

    color: inherit;
  }
  //Metarow의 첫번째 자식
  & > span:first-child {
    color: ${({ theme }) => theme.textColor};
    cursor: pointer;

    ${(props) =>
      props.isDisabled &&
      `
    color: ${props.theme.textColor}60; 
    cursor: not-allowed;
    pointer-events: none; /* 클릭 이벤트 자체를 막음 */
  `}

    /* 호버 효과 (비활성화 아닐 때만) */
  &:not([aria-disabled="true"]):hover {
      text-decoration: underline;
    }
  }
`;

/*

const VotePanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 12px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.textColor}20;
  background: ${({ theme }) => theme.bgCardColor};
`;

const VoteButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid
    ${({ theme }) => theme.textColor ?? "rgba(255,255,255,0.15)"};
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  cursor: pointer;
  color: ${({ theme }) => theme.textColor};

  &:hover {
    background: ${({ theme }) => theme.bgColor}60;
  }
`;

const VoteCount = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.textColor};
`;

*/
const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  padding: 4px 10px;
  font-size: 13px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.6);
  background: transparent;
  color: ${({ theme }) => theme.textColor};
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: rgba(148, 163, 184, 0.18);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.focusColor};
    outline-offset: 2px;
  }
`;

const ContentArea = styled.div`
  font-size: 15px;
  line-height: 1.7;
  color: ${({ theme }) => theme.textColor};
  text-align: left;
  white-space: pre-wrap;

  img {
    max-width: 100%;
    display: block;
    margin: 16px auto;
    border-radius: 8px;
  }
`;
const DetailBody = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 24px;
  margin-top: 16px;
`;

const DetailMain = styled.div`
  flex: 1;
  min-width: 0;
`;

const StatsRow = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.textColor}70;
  display: flex;
  gap: 12px;

  span {
    color: ${({ theme }) => theme.textColor};
  }
`;

const CommentsSection = styled.section`
  margin-top: 4px;
  padding-top: 12px;
  border-top: 1px solid rgba(148, 163, 184, 0.35);
`;

const CommentsHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
`;

const CommentCount = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.textColor};
`;

const CommentList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;
const CommentActionButton = styled.button<{ $danger?: boolean }>`
  margin-left: 8px;
  font-size: 12px;
  border: none;
  background: none;
  cursor: pointer;
  color: ${({ theme, $danger }) => ($danger ? "#ff4d4f" : theme.muteColor)};

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.focusColor};
    outline-offset: 2px;
  }
`;

const CommentItem = styled.li`
  padding: 8px 0;
  border-top: 1px solid rgba(148, 163, 184, 0.25);
  color: ${({ theme }) => theme.textColor};

  &:first-child {
    border-top: none;
  }
`;

const CommentMeta = styled.div<{
  isDisabled?: boolean;
}>`
  font-size: 12px;
  color: ${({ theme }) => theme.textColor}70;
  margin-bottom: 2px;

  strong {
    color: ${({ theme }) => theme.textColor};
    font-weight: 600;
    cursor: pointer;
    ${(props) =>
      props.isDisabled &&
      `
    color: ${props.theme.textColor}60; 
    cursor: not-allowed;
    pointer-events: none; /* 클릭 이벤트 자체를 막음 */
  `}

    /* 호버 효과 (비활성화 아닐 때만) */
  &:not([aria-disabled="true"]):hover {
      text-decoration: underline;
    }
  }
`;

const CommentContent = styled.div`
  font-size: 14px;
  white-space: pre-wrap;
  color: ${({ theme }) => theme.textColor};
`;

const CommentForm = styled.form`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CommentTextarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  resize: vertical;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid rgba(148, 163, 184, 0.6);

  font-size: 14px;
  font-family: inherit;
  background-color: ${({ theme }) => theme.bgColor};
  color: ${({ theme }) => theme.textColor};

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.focusColor};
    outline-offset: 2px;
  }
`;

const CommentSubmitRow = styled.div`
  display: flex;
  justify-content: flex-end;
  & > label > span {
    font-size: 13px;
    color: ${({ theme }) => theme.textColor};
  }
`;

const CommentButton = styled.button`
  font-size: 14px;
  padding: 6px 16px;
  border-radius: 999px;
  border: none;
  cursor: pointer;

  background: ${({ theme }) => theme.focusColor};
  color: ${({ theme }) => theme.bgColor};

  &:hover {
    filter: brightness(0.95);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.focusColor};
    outline-offset: 2px;
  }
`;

const EmptyText = styled.p`
  margin: 4px 0 0;
  font-size: 13px;
  color: ${({ theme }) => theme.textColor}70;
  text-align: left;
`;

const TextButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  font-size: 14px;
  cursor: pointer;
  color: ${({ theme }) => theme.textColor}99; /* 은은한 색 */

  &:hover {
    color: ${({ theme }) => theme.textColor};
    text-decoration: underline;
  }
`;

const Divider = styled.span`
  margin: 0 8px;
  color: ${({ theme }) => theme.textColor}40;
`;

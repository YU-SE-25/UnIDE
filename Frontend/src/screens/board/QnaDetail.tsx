// src/screens/board/QnaDetail.tsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ReportButton from "../../components/ReportButton";
import { useNavigate } from "react-router-dom";
import type { QnaContent } from "./QnaList";
import EditButton from "../../components/EditButton";
import { isOwner } from "../../utils/isOwner";
import {
  fetchqnaPost,
  fetchCommentsByPostId,
  createComment as apiCreateComment,
  updateComment as apiUpdateComment,
  deleteComment as apiDeleteComment,
  deleteqnaPost,
  likeComment,
  likeqnaPost, // ✅ 댓글 좋아요 API
} from "../../api/qna_api";
import { useQuery } from "@tanstack/react-query";
import type { BoardComment } from "./BoardList";
import { PollView } from "../../components/poll"; // ✅ 추가
import { LikeCount, LikePanel } from "./BoardDetail";

interface QnaDetailProps {
  post: QnaContent;
  onClose?: () => void;
}

const DetailCard = styled.section`
  position: relative;
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

const ProblemTitle = styled.span`
  margin-right: 8px;
  font-size: 24px;
  font-weight: 800;
  color: ${({ theme }) => theme.textColor};
  display: inline;

  &:hover {
    text-decoration: underline;
    color: ${({ theme }) => theme.focusColor};
    cursor: pointer;
  }
`;

const MetaRow = styled.div<{ isDisabled?: boolean }>`
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

  & > span:first-child {
    color: ${({ theme }) => theme.textColor};
    cursor: pointer;

    ${({ isDisabled, theme }) =>
      isDisabled &&
      `
        color: ${theme.textColor}60;
        cursor: not-allowed;
        pointer-events: none;
      `}

    &:not([aria-disabled="true"]):hover {
      text-decoration: underline;
    }
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
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

const CommentMeta = styled.div<{ isDisabled?: boolean }>`
  font-size: 12px;
  color: ${({ theme }) => theme.textColor}70;
  margin-bottom: 2px;

  strong {
    color: ${({ theme }) => theme.textColor};
    font-weight: 600;
    cursor: pointer;

    ${({ isDisabled, theme }) =>
      isDisabled &&
      `
        color: ${theme.textColor}60;
        cursor: not-allowed;
        pointer-events: none;
      `}

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
const ReplyList = styled.ul`
  list-style: none;
  margin: 4px 0 0;
  padding-left: 16px;
  border-left: 2px solid ${({ theme }) => theme.textColor}33;
`;

const ReplyItem = styled.li`
  padding: 6px 0;
  font-size: 13px;
  color: ${({ theme }) => theme.textColor};
`;

const EmptyText = styled.p`
  margin: 4px 0 0;
  font-size: 13px;
  color: ${({ theme }) => theme.textColor}70;
  text-align: left;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  backdrop-filter: blur(6px);
  background: rgba(0, 0, 0, 0.15);

  display: flex;
  justify-content: center;
  align-items: center;

  pointer-events: auto;
  z-index: 10;
`;

export default function QnaDetail({ post }: QnaDetailProps) {
  const nav = useNavigate();
  const postId = post.post_id;

  const { data: postData, isFetching: isPostFetching } = useQuery<QnaContent>({
    queryKey: ["qnaPostDetail", postId],
    queryFn: () => fetchqnaPost(postId),
    staleTime: 0,
    refetchOnMount: "always",
  });

  const { data: commentsData, isFetching: isCommentsFetching } = useQuery<
    BoardComment[]
  >({
    queryKey: ["qnaPostComments", postId],
    queryFn: async () => {
      const res = await fetchCommentsByPostId(postId);
      return res;
    },
    staleTime: 0,
    refetchOnMount: "always",
  });

  const [stablePost, setStablePost] = useState<QnaContent>(post);
  const [localComments, setLocalComments] = useState<BoardComment[]>(
    post.comments ?? []
  );

  const [like, setLike] = useState(post.like_count);
  const [likeState, setLikeState] = useState<"up" | null>(() =>
    post.viewer_liked ? "up" : null
  );
  const isLikeActive = likeState === "up";

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [anonymity, setAnonymity] = useState(false);

  const [hasScrolledForPost, setHasScrolledForPost] = useState(false);
  const [replyParentId, setReplyParentId] = useState<number | null>(null);
  const isLoadingAll = isPostFetching || isCommentsFetching;

  useEffect(() => {
    if (postData) {
      setStablePost(postData);
      setLike(postData.like_count);
      setLikeState(postData.viewer_liked ? "up" : null);
    }
  }, [postData]);

  useEffect(() => {
    if (commentsData) {
      setLocalComments(commentsData);
    }
  }, [commentsData]);

  useEffect(() => {
    setHasScrolledForPost(false);
  }, [postId]);

  useEffect(() => {
    if (!hasScrolledForPost && !isPostFetching && !isCommentsFetching) {
      window.scrollTo(0, 0);
      setHasScrolledForPost(true);
    }
  }, [hasScrolledForPost, isPostFetching, isCommentsFetching, postId]);

  const displayAuthor = stablePost.anonymity ? "익명" : stablePost.author;
  const attachmentUrl =
    (stablePost as any).attachmentUrl ??
    (stablePost as any).attachment_url ??
    null;
  const handleNavigateMypage = (username: string) => () => {
    if (!username || username === "익명") return;
    nav(`/mypage/${username}`);
  };

  const handleNavigateProblem = (problemId: number) => () => {
    nav(`/problem-detail/${problemId}`);
  };

  const handleEditQna = () => {
    nav(`/qna/write`, {
      state: {
        post: {
          state: "edit",
          id: stablePost.post_id,
          title: stablePost.post_title,
          content: stablePost.contents,
          isAnonymous: stablePost.anonymity,
          isPrivate: stablePost.is_private,
          problemId: stablePost.problem_id,
        },
      },
    });
  };

  const handleDeleteQna = async () => {
    const ok = window.confirm("정말로 게시글을 삭제하시겠습니까?");
    if (!ok) return;

    try {
      await deleteqnaPost(stablePost.post_id);
      alert("삭제되었습니다.");
      window.location.reload();
    } catch (e) {
      console.error("QnA 게시글 삭제 실패:", e);
      alert("게시글 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleEditComment = (comment: BoardComment) => {
    setDraft(comment.content);
    setAnonymity(comment.anonymity);
    setEditingCommentId(comment.comment_id);
    setReplyParentId(comment.parent_id || null);
  };

  const handleDeleteComment = async (commentId: number) => {
    const ok = window.confirm("삭제하시겠습니까?");
    if (!ok) return;

    try {
      await apiDeleteComment(commentId);
      setLocalComments((prev) =>
        prev.filter((c) => c.comment_id !== commentId)
      );

      if (editingCommentId === commentId) {
        setEditingCommentId(null);
        setDraft("");
      }
      if (replyParentId === commentId) {
        setReplyParentId(null);
      }
    } catch (e) {
      console.error("댓글 삭제 실패:", e);
      alert("댓글 삭제 중 오류가 발생했습니다.");
    }
  };

  const renderCommentLikeButton = (c: BoardComment) => {
    const likeCount = Number(c.like_count ?? 0);
    const isLiked = !!(c as any).viewer_liked || !!(c as any).viewerLiked;

    const handleClick = async () => {
      try {
        await likeComment(c.comment_id);

        setLocalComments((prev) =>
          prev.map((item) => {
            if (item.comment_id !== c.comment_id) return item;

            const prevLiked =
              !!(item as any).viewer_liked || !!(item as any).viewerLiked;
            const prevCount = Number(item.like_count ?? 0);

            const nextLiked = !prevLiked;
            const nextCount = prevCount + (nextLiked ? 1 : -1);

            return {
              ...item,
              viewer_liked: nextLiked,
              like_count: nextCount < 0 ? 0 : nextCount,
            };
          })
        );
      } catch (e) {
        console.error("댓글 좋아요 실패:", e);
      }
    };

    return (
      <button
        type="button"
        onClick={handleClick}
        style={{
          marginLeft: "8px",
          padding: "2px 8px",
          borderRadius: "999px",
          border: "1px solid rgba(148, 163, 184, 0.3)",
          background: isLiked ? "#facc15" : "transparent",
          color: isLiked ? "#000" : "inherit",
          fontSize: "12px",
          cursor: "pointer",
        }}
      >
        👍 {likeCount}
      </button>
    );
  };

  const handleLikeToggle = async () => {
    if (likeState === "up") {
      setLikeState(null);
      setLike((v) => v - 1);

      try {
        await likeqnaPost(stablePost.post_id);
      } catch (e) {
        console.error("좋아요 취소 실패:", e);
      }
      return;
    }

    setLikeState("up");
    setLike((v) => v + 1);

    try {
      await likeqnaPost(stablePost.post_id);
    } catch (e) {
      console.error("좋아요 실패:", e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;

    try {
      const targetParentId = replyParentId ?? 0;

      if (editingCommentId !== null) {
        const payload = {
          contents: text,
          anonymity,
          is_private: stablePost.is_private ?? false,
        };

        await apiUpdateComment(editingCommentId, payload);

        setLocalComments((prev) =>
          prev.map((c) =>
            c.comment_id === editingCommentId
              ? { ...c, content: text, anonymity }
              : c
          )
        );
        setEditingCommentId(null);
        setDraft("");
        setReplyParentId(null);
        return;
      }

      const payload = {
        contents: text,
        anonymity,
        is_private: stablePost.is_private ?? false,
        parent_id: targetParentId,
      };

      const newComment = await apiCreateComment(stablePost.post_id, payload);

      setLocalComments((prev) => [...prev, newComment]);
      setDraft("");
      setReplyParentId(null);
    } catch (e) {
      console.error("댓글 저장 실패:", e);
      alert("댓글 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <DetailCard>
      {(isPostFetching || isCommentsFetching) && (
        <LoadingOverlay>
          <div style={{ color: "white", fontSize: 16 }}>로딩중...</div>
        </LoadingOverlay>
      )}

      <DetailHeader>
        <TitleBlock>
          <DetailTitle>
            <ProblemTitle
              onClick={handleNavigateProblem(stablePost.problem_id)}
            >
              #{stablePost.problem_id}번 문제
            </ProblemTitle>
            | {stablePost.post_title}
          </DetailTitle>

          <MetaRow isDisabled={stablePost.anonymity}>
            <span onClick={handleNavigateMypage(displayAuthor)}>
              <strong>작성자:</strong> {displayAuthor}
            </span>
            <span>
              <strong>작성일:</strong> {stablePost.create_time.slice(0, 10)}
            </span>
            <span>
              <strong>추천수:</strong> {like}
            </span>
            {isLoadingAll && (
              <span style={{ fontSize: 12, opacity: 0.6 }}>업데이트 중…</span>
            )}
          </MetaRow>
        </TitleBlock>

        <HeaderActions>
          {isOwner({
            author: stablePost.author,
            anonymous: stablePost.anonymity,
          }) && (
            <EditButton onEdit={handleEditQna} onDelete={handleDeleteQna} />
          )}

          <ReportButton
            targetContentId={stablePost.post_id}
            targetContentType="QNA_POST"
          />
        </HeaderActions>
      </DetailHeader>

      <DetailBody>
        <DetailMain>
          <PollView postId={stablePost.post_id} isDiscuss={false} />

          <ContentArea>
            {attachmentUrl && (
              <img src={attachmentUrl} alt="질문 첨부 이미지" />
            )}
            {stablePost.contents}
          </ContentArea>

          <StatsRow>
            <span>👍 {like}</span>
            <span>💬 {localComments.length}</span>
          </StatsRow>

          <CommentsSection>
            <CommentsHeader>
              <CommentCount>댓글 {localComments.length}</CommentCount>
            </CommentsHeader>

            {localComments.length === 0 ? (
              <EmptyText>
                {isLoadingAll
                  ? "댓글을 불러오는 중입니다…"
                  : "첫 번째 댓글을 남겨보세요."}
              </EmptyText>
            ) : (
              <CommentList>
                {localComments
                  .filter((c) => !c.parent_id || c.parent_id === 0)
                  .map((c) => {
                    const commentAuthor = c.anonymity ? "익명" : c.author_name;
                    const date = c.created_at.slice(0, 10);
                    const replies = localComments.filter(
                      (child) => child.parent_id === c.comment_id
                    );

                    return (
                      <CommentItem key={c.comment_id}>
                        <CommentMeta isDisabled={c.anonymity}>
                          <strong onClick={handleNavigateMypage(commentAuthor)}>
                            {commentAuthor}
                          </strong>{" "}
                          · {date}
                          {renderCommentLikeButton(c)}
                          <ReportButton
                            targetContentId={c.comment_id}
                            targetContentType="QNA_COMMENT"
                          />
                          {isOwner({
                            author: c.author_name,
                            anonymity: c.anonymity,
                          }) && (
                            <>
                              <CommentActionButton
                                type="button"
                                onClick={() => handleEditComment(c)}
                              >
                                수정
                              </CommentActionButton>

                              <CommentActionButton
                                type="button"
                                $danger
                                onClick={() =>
                                  handleDeleteComment(c.comment_id)
                                }
                              >
                                삭제
                              </CommentActionButton>
                            </>
                          )}
                          <CommentActionButton
                            type="button"
                            onClick={() => {
                              setReplyParentId(c.comment_id);
                              setEditingCommentId(null);
                              setDraft("");
                            }}
                          >
                            ㄴ 답글
                          </CommentActionButton>
                        </CommentMeta>

                        <CommentContent>{c.content}</CommentContent>

                        {replies.length > 0 && (
                          <ReplyList>
                            {replies.map((r) => {
                              const rAuthor = r.anonymity
                                ? "익명"
                                : r.author_name;
                              const rDate = r.created_at.slice(0, 10);

                              return (
                                <ReplyItem key={r.comment_id}>
                                  <CommentMeta isDisabled={r.anonymity}>
                                    <strong
                                      onClick={handleNavigateMypage(rAuthor)}
                                    >
                                      {rAuthor}
                                    </strong>{" "}
                                    · {rDate}
                                    {renderCommentLikeButton(r)} · {rDate}
                                    <ReportButton
                                      targetContentId={r.comment_id}
                                      targetContentType="QNA_COMMENT"
                                    />
                                    {isOwner({
                                      author: r.author_name,
                                      anonymity: r.anonymity,
                                    }) && (
                                      <>
                                        <CommentActionButton
                                          type="button"
                                          onClick={() => handleEditComment(r)}
                                        >
                                          수정
                                        </CommentActionButton>
                                        <CommentActionButton
                                          type="button"
                                          $danger
                                          onClick={() =>
                                            handleDeleteComment(r.comment_id)
                                          }
                                        >
                                          삭제
                                        </CommentActionButton>
                                      </>
                                    )}
                                  </CommentMeta>
                                  <CommentContent>{r.content}</CommentContent>
                                </ReplyItem>
                              );
                            })}
                          </ReplyList>
                        )}
                      </CommentItem>
                    );
                  })}
              </CommentList>
            )}

            <CommentForm onSubmit={handleSubmit}>
              {replyParentId && (
                <div
                  style={{
                    fontSize: 12,
                    color: "#facc15",
                    marginBottom: 4,
                  }}
                >
                  ↳ 답글 작성 중입니다.
                </div>
              )}

              <CommentTextarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="댓글을 입력하세요."
              />

              <CommentSubmitRow>
                <label
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <span>익명</span>
                  <input
                    type="checkbox"
                    checked={anonymity}
                    onChange={(e) => setAnonymity(e.target.checked)}
                  />
                </label>

                <CommentButton type="submit">
                  {editingCommentId !== null ? "댓글 수정" : "댓글 작성"}
                </CommentButton>
              </CommentSubmitRow>
            </CommentForm>
          </CommentsSection>
        </DetailMain>

        <LikePanel onClick={handleLikeToggle} $active={isLikeActive}>
          <span style={{ fontSize: 11, lineHeight: 1 }}>▲</span>
          <LikeCount>{like}</LikeCount>
        </LikePanel>
      </DetailBody>
    </DetailCard>
  );
}

//-----------------------------------------------------------
//  전역 isOwner 통합 함수
//  - QnA 게시글(authorId 기반)
//  - QnA 댓글(author 닉네임 기반)
//  - 토론 게시글(author 닉네임 기반)
//  - 코드 리뷰(review.owner 또는 reviewer 기반)
//  - 코드 리뷰 댓글(commenter 기반)
//  - 익명(anonymity/anonymous) 처리까지 통합
//-----------------------------------------------------------

import { getDefaultStore } from "jotai";
import { userProfileAtom } from "../atoms";

const store = getDefaultStore();

/**
 * 통합 isOwner 함수
 *
 * @param params {
 *   owner?: boolean,       // 서버에서 직접 owner 여부 제공하는 케이스(코드 리뷰)
 *   anonymous?: boolean,   // 게시글 익명 여부
 *   anonymity?: boolean,   // 댓글 익명 여부
 *   authorId?: number,     // QnA 게시글: 숫자 ID 기반
 *   author?: string,       // 토론 게시글 / QnA 댓글: 닉네임 기반
 *   reviewer?: string,     // 코드 리뷰 작성자
 *   commenter?: string,    // 코드 리뷰 댓글 작성자
 *  username?:string,
 * }
 */
export const isOwner = (params: {
  owner?: boolean;
  anonymous?: boolean;
  anonymity?: boolean;
  authorId?: number;
  author?: string;
  reviewer?: string;
  commenter?: string;
  username?: string;
}) => {
  const user = store.get(userProfileAtom);
  if (!user) return false;

  // (1) 서버가 직접 owner(참/거짓)를 준 경우 → 그대로 신뢰하고 끝!
  if (params.owner !== undefined) {
    return params.owner;
  }

  // (2) 익명 글/댓글이면 → 본인 여부 판단 못 하므로 false
  if (params.anonymous || params.anonymity) {
    return false;
  }

  // (3) authorId 비교(QnA 게시글)
  if (params.authorId !== undefined) {
    return user.userId === params.authorId;
  }

  // (4) author 닉네임 비교 (토론 게시글 / QnA 댓글)
  if (params.author) {
    return user.nickname === params.author;
  }

  // (5) reviewer 비교(코드 리뷰)
  if (params.reviewer) {
    return user.nickname === params.reviewer;
  }

  // (6) commenter 비교(코드 리뷰 댓글)
  if (params.commenter) {
    return user.nickname === params.commenter;
  }

  if (params.username) {
    return user.nickname === params.username;
  }

  // (7) 모든 조건에서 해당 사항 없으면 false
  return false;
};

// -----------------------------------------------------------
//  사용 예시 (복붙 가능)
// -----------------------------------------------------------
//
// 1) QnA 게시글
// isOwner({ authorId: post.authorId, anonymous: post.anonymous })
//
// 2) QnA 댓글
// isOwner({ author: comment.author, anonymity: comment.anonymity })
//
// 3) 토론 게시글
// isOwner({ author: post.author, anonymity: post.anonymity })
//
// 4) 코드 리뷰(리뷰 목록)
// isOwner({ owner: review.owner })
//
// 5) 코드 리뷰 댓글
// isOwner({ commenter: comment.commenter })
//
// -----------------------------------------------------------

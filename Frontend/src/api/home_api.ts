import { api } from "./axios";

// ⭐ 어제 날짜 생성
const getYesterday = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
};

// ⭐ 문제 조회수 랭킹 — date=어제로 고정
export const getProblemRanking = async () => {
  const date = getYesterday();
  const res = await api.get("/UNIDE/rank/problem/views", {
    params: { date },
  });
  return res.data;
};

// ⭐ 유저 평판 랭킹
export const getReputationRanking = async () => {
  const res = await api.get("/UNIDE/rank/user/reputation", {
    params: { size: 10 },
  });
  return res.data;
};

// ⭐ 코드 리뷰 랭킹
export const getReviewRanking = async () => {
  const res = await api.get("/UNIDE/rank/reviews", {
    params: { size: 5 },
  });
  return res.data;
};

import { createBrowserRouter } from "react-router-dom";
import App from "./App";

// 공통 / 메인 페이지
import Home from "./screens/Home";
import NotFound from "./screens/NotFound";
import CodeScratchPage from "./screens/CodeScratchPage";

// 인증 / 계정 관련
import Login from "./screens/Login";
import OAuthCallback from "./screens/OAuthCallback";
import ForgetPassword from "./screens/ForgetPassword";
import ResetPassword from "./screens/ResetPassword";
import Register from "./screens/Register";
import RegisterSuccess from "./screens/RegisterSuccess";
import VerifySuccess from "./screens/VerifySuccess";

// 마이페이지
import MypageLayout from "./screens/mypage/MypageLayout";
import MyPageScreen from "./screens/mypage/MypageScreen";
import MyPageRedirect from "./screens/mypage/MypageRedirect";

// 문제 관련
import ProblemList from "./screens/problem/ProblemList";
import ProblemDetail from "./screens/problem/ProblemDetail";
import ProblemSolve from "./screens/problem/ProblemSolve";
import CodeResult from "./screens/problem/SolveResult";
import MySolvedProblem from "./screens/problem/MySubmissionsList";
import ProblemAdd from "./screens/problem/ProblemAdd";
import CodeAnalysis from "./screens/problem/CodeAnalysis";
import SolvedProblemList from "./screens/problem/reviews/SolvedProblemList";

// 게시판 / QnA
import Board from "./screens/board/BoardList";
import BoardWrite from "./screens/board/BoardWrite";
import QnaList from "./screens/board/QnaList";
import QnaWrite from "./screens/board/QnaWrite";

// 스터디 그룹
import StudyGroupMain from "./screens/studygroup/StudyGroupMain";
import StudyGroupBoardList from "./screens/studygroup/StudyGroupBoardList";
import ActivityTab from "./screens/studygroup/ActivityTab";
import ProblemListTab from "./screens/studygroup/ProblemListTab";
import StudyGroupDetail from "./screens/studygroup/StudyGroupDetail";
import StudyGroupBoardDetail from "./screens/studygroup/StudyGroupBoardDetail";
import StudyGroupBoardWrite from "./screens/studygroup/StudyGroupBoardWrite";

import SolvedProblemShow from "./screens/problem/reviews/SolvedProblemShow";
import MySubmissionsDetail from "./screens/problem/MySubmissionsDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "problem-list", element: <ProblemList /> },
      { path: "problem-detail/:problemId", element: <ProblemDetail /> },
      { path: "problem-add", element: <ProblemAdd /> },
      { path: "problem-edit/:problemId", element: <ProblemAdd /> },
      { path: "problems/:problemId/solve", element: <ProblemSolve /> },
      { path: "problems/result", element: <CodeResult /> }, //debrecated
      { path: "problems/:username/submitted", element: <MySolvedProblem /> },
      {
        path: "problem-detail/:problemId/solved",
        element: <SolvedProblemList />,
      },
      {
        path: "problems/:username/submitted/codeView/:solutionId",
        element: <MySubmissionsDetail />,
      },

      {
        path: "problem-detail/:problemId/solved/:solutionId",
        element: <SolvedProblemShow />,
      },

      //문제분석용 임시 라우터(그대로 써도되긴함)
      {
        path: "problems/:problemId/analysis/:submissionId",
        element: <CodeAnalysis />,
      },

      { path: "board/:category", element: <Board /> },
      {
        path: "board/:category/write",
        element: <BoardWrite mode="board" />,
      },

      { path: "qna", element: <QnaList /> },
      {
        path: "qna/write",
        element: <QnaWrite />,
      },

      { path: "studygroup-main", element: <StudyGroupMain /> },
      {
        path: "studygroup/:groupId",
        element: <StudyGroupDetail />,
        children: [
          { index: true, element: <ProblemListTab /> },

          { path: "problem", element: <ProblemListTab /> },
          { path: "discussion", element: <StudyGroupBoardList /> },
          { path: "activity", element: <ActivityTab /> },

          { path: "discussion/write", element: <StudyGroupBoardWrite /> },
          { path: "discussion/:postId", element: <StudyGroupBoardDetail /> },
          {
            path: "discussion/:postId/edit",
            element: <StudyGroupBoardWrite />,
          },
        ],
      },

      {
        path: "/scratch",
        element: <CodeScratchPage />,
      },

      { path: "login", element: <Login /> },
      { path: "oauth/callback", element: <OAuthCallback /> },
      { path: "forget-password", element: <ForgetPassword /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "register", element: <Register /> },
      { path: "register-success", element: <RegisterSuccess /> },

      {
        path: "auth/verify-success",
        element: <VerifySuccess />,
      },
      {
        path: "mypage",
        element: <MyPageRedirect />,
      },
      {
        path: "mypage/:username",
        element: <MypageLayout />,
        children: [{ index: true, element: <MyPageScreen /> }],
      },
    ],
    errorElement: <NotFound />,
  },
]);

export default router;

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  ResetPageWrapper,
  LoginBox,
  ResetTitle,
  InputGroup,
  Label,
  StyledInput,
  MainButton,
  ErrorMessage,
} from "../theme/ResetPassword.Style";

import { AuthAPI } from "../api/auth_api"; // ★ 추가됨

// 비밀번호 규칙 검사
const validatePassword = (password: string) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  const isValid = regex.test(password);

  let message = "";
  if (password.length > 0 && password.length < 8) {
    message = "최소 8자 이상이어야 합니다.";
  } else if (!/(?=.*[a-z])/.test(password) && password.length >= 8) {
    message = "소문자를 포함해야 합니다.";
  } else if (!/(?=.*[A-Z])/.test(password) && password.length >= 8) {
    message = "대문자를 포함해야 합니다.";
  } else if (!/(?=.*\d)/.test(password) && password.length >= 8) {
    message = "숫자를 포함해야 합니다.";
  }

  return { isValid, message };
};

export default function NewPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const resetToken = location.state?.resetToken || "";
  const userEmail = location.state?.email || "사용자 이메일 정보 없음";

  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const passwordValidationResult = validatePassword(newPassword);

  const isNewPasswordValid =
    passwordValidationResult.isValid && newPassword === newPasswordConfirm;

  // 3. 비밀번호 최종 업데이트
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!isNewPasswordValid) {
      setErrorMessage("비밀번호가 일치하지 않거나 규칙을 위반했습니다.");
      return;
    }

    try {
      const result = await AuthAPI.resetPassword(
        resetToken,
        newPassword,
        newPasswordConfirm
      ); // API 연결

      alert(result.message);
      navigate("/login");
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message ||
        "비밀번호 저장 중 알 수 없는 오류가 발생했습니다.";
      setErrorMessage(errorMsg);
    }
  };

  return (
    <ResetPageWrapper>
      <LoginBox>
        <ResetTitle>새 비밀번호 설정</ResetTitle>

        <p style={{ marginBottom: "20px", color: "green" }}>
          인증 완료: {userEmail}
        </p>

        <form onSubmit={handlePasswordReset}>
          <InputGroup>
            <Label htmlFor="new-pw">새 비밀번호 :</Label>
            <StyledInput
              type="password"
              id="new-pw"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="최소 8자, 대/소문자 숫자 포함"
            />
          </InputGroup>

          {newPassword.length > 0 && !passwordValidationResult.isValid && (
            <ErrorMessage>{passwordValidationResult.message}</ErrorMessage>
          )}

          <InputGroup>
            <Label htmlFor="confirm-pw">비밀번호 확인 :</Label>
            <StyledInput
              type="password"
              id="confirm-pw"
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
            />
          </InputGroup>

          {newPasswordConfirm.length > 0 &&
            newPassword !== newPasswordConfirm && (
              <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>
            )}

          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

          <MainButton type="submit" disabled={!isNewPasswordValid}>
            변경하기
          </MainButton>
        </form>
      </LoginBox>
    </ResetPageWrapper>
  );
}

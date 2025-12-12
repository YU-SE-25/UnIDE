import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  RegisterPageWrapper,
  RegisterBox,
  Title,
  InputGroup,
  Label,
  StyledInput,
  FullWidthButton,
  ErrorMessage,
  TermsGroup,
  CheckboxLabel,
  ModalContentBox,
  CloseButton,
  ModalBackdrop,
  RoleSelectWrapper,
  RoleOption,
} from "../theme/Register.Style.ts";

import { TERMS_OF_SERVICE } from "./terms/TermsOfService";
import { PRIVACY_POLICY } from "./terms/PrivacyPolicy";
import { AuthAPI } from "../api/auth_api";
import {
  uploadPortfolio,
  type PortfolioUploadResponse,
} from "../api/uploadPortfolio_api";

//비밀번호
const validatePassword = (password: string) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  const isValid = regex.test(password);

  let message = "";
  if (password.length < 8) {
    message = "최소 8자 이상이어야 합니다.";
  } else if (!/(?=.*[a-z])/.test(password)) {
    message = "소문자를 포함해야 합니다.";
  } else if (!/(?=.*[A-Z])/.test(password)) {
    message = "대문자를 포함해야 합니다.";
  } else if (!/(?=.*\d)/.test(password)) {
    message = "숫자를 포함해야 합니다.";
  }

  return { isValid, message };
};

export default function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState<"LEARNER" | "INSTRUCTOR">("LEARNER");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");

  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(false);

  const [portfolioLinks, setPortfolioLinks] = useState<string[]>([]);
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValidEmailFormat = email.includes("@") && email.includes(".");
  const passwordValidationResult = validatePassword(password);
  const passwordsMatch = password === passwordConfirm;
  const isValidPhone = phoneNumber.replace(/[^0-9]/g, "").length === 11;
  const isValidNicknameLength = nickname.length >= 2 && nickname.length < 10;

  const [modalContent, setModalContent] = useState<"terms" | "privacy" | null>(
    null
  );
  const isInstructorValid =
    role === "LEARNER" || portfolioLinks.length > 0 || portfolioFile !== null;

  const isFormValid = useMemo(() => {
    return (
      isTermsChecked &&
      isPrivacyChecked &&
      passwordsMatch &&
      password.length >= 8 &&
      passwordValidationResult.isValid &&
      isValidEmailFormat &&
      isValidPhone &&
      isValidNicknameLength &&
      isInstructorValid
    );
  }, [
    isTermsChecked,
    isPrivacyChecked,
    passwordsMatch,
    password.length,
    passwordValidationResult.isValid,
    isValidEmailFormat,
    isValidPhone,
    isValidNicknameLength,
    isInstructorValid,
  ]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/[^0-9]/g, "").slice(0, 11);

    let formattedNumber = cleaned;

    if (cleaned.length > 3 && cleaned.length <= 7) {
      formattedNumber = `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    } else if (cleaned.length > 7) {
      formattedNumber = `${cleaned.slice(0, 3)}-${cleaned.slice(
        3,
        7
      )}-${cleaned.slice(7, 11)}`;
    }
    setPhoneNumber(formattedNumber);
  };

  //api쪽
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    // 0. 블랙리스트 체크
    try {
      const response = await AuthAPI.checkBlacklist(name, email, phoneNumber);
      if (response.data.blacklisted === true) {
        alert("회원가입이 제한된 사용자입니다.");
        setIsSubmitting(false);
        return;
      }
    } catch {
      alert("블랙리스트 확인 중 오류가 발생했습니다.");
      setIsSubmitting(false);
      return;
    }

    // 1. 이메일 중복 체크
    const emailCheck = await AuthAPI.checkEmail(email);
    if (!emailCheck.data.available) {
      alert("이미 사용 중인 이메일입니다. 1인 1계정만 생성 가능합니다.");
      setIsSubmitting(false);
      return;
    }

    // 2. 닉네임 중복 체크
    const nickCheck = await AuthAPI.checkNickname(nickname);
    if (!nickCheck.data.available) {
      alert("이미 사용 중인 닉네임입니다.");
      setIsSubmitting(false);
      return;
    }

    // 3. 전화번호 중복 체크
    const phoneCheck = await AuthAPI.checkPhone(phoneNumber);
    if (!phoneCheck.data.available) {
      alert("이미 등록된 전화번호입니다. 1인 1계정만 생성 가능합니다.");
      setIsSubmitting(false);
      return;
    }

    let fileUploadResult: PortfolioUploadResponse | null = null;

    // 4. 파일 업로드
    if (role === "INSTRUCTOR" && portfolioFile) {
      try {
        fileUploadResult = await uploadPortfolio(portfolioFile);
      } catch {
        alert("포트폴리오 파일 업로드에 실패했습니다.");
        setIsSubmitting(false);
        return;
      }
    }

    const registerData = {
      email,
      password,
      name,
      nickname,
      phone: phoneNumber,
      role,
      agreedTerms: ["TERMS_OF_SERVICE", "PRIVACY_POLICY"],
      portfolioFileUrl:
        role === "INSTRUCTOR" ? fileUploadResult?.fileUrl ?? null : null,
      originalFileName:
        role === "INSTRUCTOR"
          ? fileUploadResult?.originalFileName ?? null
          : null,
      fileSize:
        role === "INSTRUCTOR" ? fileUploadResult?.fileSize ?? null : null,
      portfolioLinks: role === "INSTRUCTOR" ? portfolioLinks : [],
    };

    // 5. 최종 회원가입
    try {
      const registerRes = (await AuthAPI.register(registerData)) as {
        data: { userId: number };
      };

      localStorage.setItem("regUserId", registerRes.data.userId.toString());
      localStorage.setItem("regEmail", email);

      await AuthAPI.sendEmailVerify(email);

      navigate("/register-success");
    } catch {
      alert("서버 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenTerms = (type: "terms" | "privacy") => {
    setModalContent(type);
  };

  const handleCloseModal = () => {
    setModalContent(null);
  };

  return (
    <RegisterPageWrapper>
      <RegisterBox>
        <Title>회원가입</Title>

        <Label>회원 유형 :</Label>
        <RoleSelectWrapper>
          <RoleOption
            $checked={role === "LEARNER"}
            onClick={() => setRole("LEARNER")}
          >
            <input
              type="radio"
              name="role"
              value="LEARNER"
              checked={role === "LEARNER"}
              onChange={() => setRole("LEARNER")}
            />
            학습자
          </RoleOption>

          <RoleOption
            $checked={role === "INSTRUCTOR"}
            onClick={() => setRole("INSTRUCTOR")}
          >
            <input
              type="radio"
              name="role"
              value="INSTRUCTOR"
              checked={role === "INSTRUCTOR"}
              onChange={() => setRole("INSTRUCTOR")}
            />
            강사
          </RoleOption>
        </RoleSelectWrapper>

        <form onSubmit={handleRegister}>
          <InputGroup>
            <Label>이메일 :</Label>
            <StyledInput
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </InputGroup>

          <InputGroup>
            <Label>비밀번호 :</Label>
            <StyledInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="최소 8자, 대/소문자 숫자 포함"
            />
          </InputGroup>

          {password.length > 0 && !passwordValidationResult.isValid && (
            <ErrorMessage>비밀번호 규정을 따라주세요.</ErrorMessage>
          )}

          <InputGroup>
            <Label>비밀번호 확인 :</Label>
            <StyledInput
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </InputGroup>

          {!passwordsMatch && (
            <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>
          )}

          <InputGroup>
            <Label>전화번호 :</Label>
            <StyledInput
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder="010-XXXX-XXXX"
              maxLength={13}
            />
          </InputGroup>

          <InputGroup>
            <Label>이름 :</Label>
            <StyledInput
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </InputGroup>

          <InputGroup>
            <Label>닉네임 :</Label>
            <StyledInput
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={9}
              placeholder="2글자 이상, 10글자 미만"
            />
          </InputGroup>

          {role === "INSTRUCTOR" && (
            <>
              <InputGroup>
                <Label>포트폴리오 URL :</Label>
                <StyledInput
                  type="text"
                  placeholder="예: https://github.com/yourname"
                  onChange={(e) => setPortfolioLinks([e.target.value])}
                />
              </InputGroup>

              <InputGroup>
                <Label>포트폴리오 파일 :</Label>
                <StyledInput
                  type="file"
                  onChange={(e) =>
                    setPortfolioFile(e.target.files?.[0] || null)
                  }
                />
              </InputGroup>

              <p style={{ fontSize: "14px", color: "#999" }}>
                ※ URL 또는 파일 중 하나 이상 필수 제출
              </p>
            </>
          )}

          <TermsGroup>
            <CheckboxLabel>
              <input
                type="checkbox"
                checked={isTermsChecked}
                onChange={(e) => setIsTermsChecked(e.target.checked)}
              />
              <span
                onClick={() => handleOpenTerms("terms")}
                style={{ cursor: "pointer", textDecoration: "underline" }}
              >
                사용자의 약관 동의 및 개인정보 처리방침 동의
              </span>
              (필수)
            </CheckboxLabel>

            <CheckboxLabel>
              <input
                type="checkbox"
                checked={isPrivacyChecked}
                onChange={(e) => setIsPrivacyChecked(e.target.checked)}
              />
              <span
                onClick={() => handleOpenTerms("privacy")}
                style={{ cursor: "pointer", textDecoration: "underline" }}
              >
                개인정보 수집 및 이용 동의
              </span>
              (필수)
            </CheckboxLabel>
          </TermsGroup>

          <FullWidthButton
            type="submit"
            $main
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? "가입 중..." : "가입하기"}
          </FullWidthButton>
        </form>
      </RegisterBox>

      {modalContent && (
        <ModalBackdrop onClick={handleCloseModal}>
          <ModalContentBox onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
            <h3>
              {modalContent === "terms" ? "이용 약관" : "개인정보 처리방침"}
            </h3>
            <p style={{ whiteSpace: "pre-wrap" }}>
              {modalContent === "terms" ? TERMS_OF_SERVICE : PRIVACY_POLICY}
            </p>
          </ModalContentBox>
        </ModalBackdrop>
      )}
    </RegisterPageWrapper>
  );
}

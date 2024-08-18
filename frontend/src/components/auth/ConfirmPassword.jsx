import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Container from "../Container";
import Title from "../form/Title";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import FormContainer from "../form/FormContainer";
import { commonModalClasses } from "../../utils/Theme";
import { ImSpinner3 } from "react-icons/im";
import { verifyPasswordResetToken } from "../../api/auth";
import { useNotification } from "../../hooks";

export default function ConfirmPassword() {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const id = searchParams.get("id");

  const { updateNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    isValidToken();
  }, []);

  const isValidToken = async () => {
    const { error, valid } = await verifyPasswordResetToken(token, id);
    setIsVerifying(false);
    if (error) return updateNotification("error", error);

    if (!valid) {
      setIsValid(false);
      return navigate("/auth/reset-password", { replace: true });
    }
    setIsValid(true);
  };

  if (!isValid)
    return (
      <FormContainer>
        <Container>
          <h1 className="dark:text-white text-primary text-2xl font-semibold">
            Sorry the token is Invalid!
          </h1>
        </Container>
      </FormContainer>
    );

  if (isVerifying)
    return (
      <FormContainer>
        <Container>
          <div className="flex space-x-2 items-center">
            <h1 className="dark:text-white text-primary text-2xl font-semibold">
              Please wait while we are verifying your token!
            </h1>
            <ImSpinner3 className="animate-spin text-2xl dark:text-white text-primary" />
          </div>
        </Container>
      </FormContainer>
    );

  return (
    <FormContainer>
      <Container>
        <form className={commonModalClasses}>
          <Title>Enter New Password</Title>
          <FormInput
            label="New Password"
            placeholder="********"
            name="password"
            type="password"
          ></FormInput>
          <FormInput
            label="Confirm Password"
            placeholder="********"
            name="confirmPassword"
            type="password"
          ></FormInput>
          <Submit value="Confirm Password" />
        </form>
      </Container>
    </FormContainer>
  );
}

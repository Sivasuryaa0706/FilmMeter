import React, { useState } from "react";
import Container from "../Container";
import Title from "../form/Title";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import CustomLink from "../CustomLink";
import { commonModalClasses } from "../../utils/Theme";
import FormContainer from "../form/FormContainer";
import { useAuth, useNotification } from "../../hooks";

const validateUserInfo = ({ email, password }) => {
  const isValidEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (!email.trim()) return { ok: false, error: "Email is missing!" };
  if (!isValidEmail.test(email)) return { ok: false, error: "Invalid Email!" };

  if (!password.trim()) return { ok: false, error: "Password is missing!" };
  if (password.length < 8)
    return { ok: false, error: "Password must be 8 characters long!" };

  return { ok: true };
};

export default function Signin() {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const { updateNotification } = useNotification();
  const { handleLogin, authInfo } = useAuth();
  console.log(authInfo);

  const handleChange = ({ target }) => {
    const { value, name } = target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { ok, error } = validateUserInfo(userInfo);
    if (!ok) return updateNotification("error", error);

    //need to login
    handleLogin(userInfo.email, userInfo.password);
  };

  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClasses}>
          <Title>Sign In</Title>
          <FormInput
            value={userInfo.email}
            onChange={handleChange}
            label="Email"
            placeholder="john@email.com"
            name="email"
          ></FormInput>
          <FormInput
            value={userInfo.password}
            onChange={handleChange}
            label="Password"
            placeholder="********"
            name="password"
            type="password"
          ></FormInput>
          <Submit value="Sign in" />
          <div className="flex justify-between">
            <CustomLink to="/auth/forget-password">Forget Password?</CustomLink>
            <CustomLink to="/auth/signup">Sign Up</CustomLink>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}

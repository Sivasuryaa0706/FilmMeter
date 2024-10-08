import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../Container";
import Title from "../form/Title";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import CustomLink from "../CustomLink";
import { commonModalClasses } from "../../utils/Theme";
import FormContainer from "../form/FormContainer";
import { createUser } from "../../api/auth";
import { useAuth, useNotification } from "../../hooks";
import { isValidEmail } from "../../utils/helper";

const validateUserInfo = ({ name, email, password }) => {
  const isValidName = /^[a-z A-Z]+$/;

  if (!name.trim()) return { ok: false, error: "Name is missing!" };
  if (!isValidName.test(name)) return { ok: false, error: "Invalid Name!" };

  if (!email.trim()) return { ok: false, error: "Email is missing!" };
  if (!isValidEmail(email)) return { ok: false, error: "Invalid Email!" };

  if (!password.trim()) return { ok: false, error: "Password is missing!" };
  if (password.length < 8)
    return { ok: false, error: "Password must be 8 characters long!" };

  return { ok: true };
};

export default function Signup() {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const { updateNotification } = useNotification();

  const { authInfo } = useAuth();
  const { isLoggedIn } = authInfo;

  const { name, email, password } = userInfo;

  const handleChange = ({ target }) => {
    const { value, name } = target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { ok, error } = validateUserInfo(userInfo);
    if (!ok) return updateNotification("error", error);

    const response = await createUser(userInfo);
    if (response.error) return console.log(response.error);
    navigate("/auth/verification", {
      state: { user: response.user },
      replace: true, //Cannot go to previous screen
    });
    console.log(response.user);
  };

  useEffect(() => {
    //we want to move our user to somewhere else
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn]);

  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClasses}>
          <Title>Sign Up</Title>
          <FormInput
            value={name}
            onChange={handleChange}
            label="Name"
            placeholder="John"
            name="name"
          ></FormInput>
          <FormInput
            value={email}
            onChange={handleChange}
            label="Email"
            placeholder="john@email.com"
            name="email"
          ></FormInput>
          <FormInput
            value={password}
            onChange={handleChange}
            label="Password"
            placeholder="********"
            name="password"
            type="password"
          ></FormInput>
          <Submit value="Sign up" />
          <div className="flex justify-between">
            <CustomLink to="/auth/signin">Already Registered?</CustomLink>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}

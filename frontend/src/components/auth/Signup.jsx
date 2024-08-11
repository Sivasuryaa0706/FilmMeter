import React, { useState } from "react";
import Container from "../Container";
import Title from "../form/Title";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import CustomLink from "../CustomLink";
import { commonModalClasses } from "../../utils/Theme";
import FormContainer from "../form/FormContainer";

export default function Signup() {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = userInfo;

  const handleChange = ({ target }) => {
    const { value, name } = target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

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

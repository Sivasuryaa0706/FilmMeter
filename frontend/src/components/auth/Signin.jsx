import React from "react";
import Container from "../Container";
import Title from "../form/Title";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import CustomLink from "../CustomLink";

export default function Signin() {
  return (
    <div className="fixed inset-0 dark:bg-primary bg-white -z-10 flex justify-center items-center">
      <Container>
        <form className="dark:bg-secondary bg-white drop-shadow-lg rounded p-6 space-y-6">
          <Title>Sign In</Title>
          <FormInput
            label="Email"
            placeholder="john@email.com"
            name="email"
          ></FormInput>
          <FormInput
            label="Password"
            placeholder="********"
            name="password"
          ></FormInput>
          <Submit value="Sign in" />
          <div className="flex justify-between">
            <CustomLink to="/auth/forget-password">Forget Password?</CustomLink>
            <CustomLink to="/auth/signup">Sign Up</CustomLink>
          </div>
        </form>
      </Container>
    </div>
  );
}

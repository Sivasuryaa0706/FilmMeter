import React from "react";
import Container from "../Container";
import Title from "../form/Title";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";

export default function Signup() {
  return (
    <div className="fixed inset-0 bg-primary -z-10 flex justify-center items-center">
      <Container>
        <form className="bg-secondary rounded p-6 space-y-6">
          <Title>Sign Up</Title>
          <FormInput label="Name" placeholder="John" name="name"></FormInput>
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
          <Submit value="Sign up" />
          <div className="flex justify-between">
            <a className="text-dark-subtle hover:text-white" href="#">
              Forget password
            </a>
            <a className="text-dark-subtle hover:text-white" href="#">
              Sign in
            </a>
          </div>
        </form>
      </Container>
    </div>
  );
}

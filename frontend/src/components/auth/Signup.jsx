import React from "react";
import Container from "../Container";
import Title from "../form/Title";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import CustomLink from "../CustomLink";
import { commonModalClasses } from "../../utils/Theme";
import FormContainer from "../form/FormContainer";

export default function Signup() {
  return (
    <FormContainer>
      <Container>
        <form className={commonModalClasses}>
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
            <CustomLink to="/auth/signin">Already Registered?</CustomLink>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}

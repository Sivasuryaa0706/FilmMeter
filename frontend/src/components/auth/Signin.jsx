import React from "react";
import Container from "../Container";

export default function Signin() {
  return (
    <div className="fixed inset-0 bg-primary -z-10 flex justify-center items-center">
      <Container>
        <form className="bg-secondary rounded p-6 w-99">
          <h1 className="text-xl text-white font-semibold text-center">
            Sign in
          </h1>
          <div className="flex flex-col-reverse">
            <input
              type="text"
              id="email"
              className="bg-transparent rounded border-2 border-dark-subtle
              text-lg w-full outline-none focus:border-white p-1 text-white peer transition"
              placeholder="john@gmail.com"
            />
            <label
              className="font-semibold text-dark-subtle peer-focus:text-white self-start"
              htmlFor="email"
            >
              Email
            </label>
          </div>
        </form>
      </Container>
    </div>
  );
}

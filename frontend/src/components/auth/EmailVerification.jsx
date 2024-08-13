import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "../Container";
import Title from "../form/Title";
import Submit from "../form/Submit";
import FormContainer from "../form/FormContainer";
import { commonModalClasses } from "../../utils/Theme";
import { verifyUserEmail } from "../../api/auth";

const OTP_LENGTH = 6;
const isValidOTP = (otp) => {
  let valid = false;

  for (let val of otp) {
    //All 6 must be integer
    valid = !isNaN(parseInt(val));
    if (!valid) break;
  }

  return valid;
};

export default function EmailVerification() {
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);

  const inputRef = useRef();

  const { state } = useLocation();
  const user = state?.user;

  const navigate = useNavigate();

  const focusNextInputField = (index) => {
    setActiveOtpIndex(index + 1);
  };

  const focusPreviousInputField = (index) => {
    let nextIndex;
    const diff = index - 1;
    nextIndex = diff !== 0 ? diff : 0;
    setActiveOtpIndex(nextIndex);
  };

  const handleOtpChange = ({ target }, index) => {
    const { value } = target;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1, value.length);
    if (!value) focusPreviousInputField(index);
    else focusNextInputField(index);
    setOtp([...newOtp]);
  };

  const handleKeyDown = ({ key }, index) => {
    if (key == "Backspace") focusPreviousInputField(index);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidOTP(otp)) return console.log("Invalid OTP!");

    //Submit Otp
    const { error, message } = await verifyUserEmail({
      OTP: otp.join(""),
      userId: user.id,
    });
    if (error) return console.log(error);
    console.log(message);
  };
  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  //If no user then not-found
  useEffect(() => {
    if (!user) navigate("/not-found");
  }, [user]);

  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClasses}>
          <div>
            <Title>Please Enter the OTP to verify your account</Title>
            <p className="text-center dark:text-dark-subtle text-secondary">
              OTP has been sent to your email
            </p>
          </div>
          <div className="flex justify-center items-center space-x-4">
            {otp.map((_, index) => {
              return (
                <input
                  ref={activeOtpIndex == index ? inputRef : null}
                  key={index}
                  type="number"
                  value={otp[index] || ""}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 border-2 dark:border-dark-subtle border-light-subtle dark:focus:border-white 
              focus:border-primary rounded bg-transparent text-center font-semibold dark:text-white text-primary text-xl spin-button-none"
                />
              );
            })}
          </div>
          <Submit value="Verify Account" />
        </form>
      </Container>
    </FormContainer>
  );
}

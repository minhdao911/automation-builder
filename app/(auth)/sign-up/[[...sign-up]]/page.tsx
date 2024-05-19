import { SignUp } from "@clerk/nextjs";
import { FunctionComponent } from "react";

interface SignUpProps {}

const SignUpPage: FunctionComponent<SignUpProps> = () => {
  return <SignUp path="/sign-up" />;
};

export default SignUpPage;

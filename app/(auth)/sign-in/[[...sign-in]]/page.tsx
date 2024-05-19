import { SignIn } from "@clerk/nextjs";
import { FunctionComponent } from "react";

interface SignInProps {}

const SignInPage: FunctionComponent<SignInProps> = () => {
  return <SignIn path="/sign-in" />;
};

export default SignInPage;

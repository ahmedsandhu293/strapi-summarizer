import { NextRequest } from "next/server";
import dynamic from "next/dynamic";

const SignupForm = dynamic(
  async () => {
    const module = await import("@/components/forms/SignupForm");
    return Promise.resolve(module.default);
  },
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

export default function SingInRoute() {
  return <SignupForm />;
}
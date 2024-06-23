import { NextRequest } from "next/server";
import dynamic from "next/dynamic";

const SigninForm = dynamic(
  async () => {
    const module = await import("@/components/forms/SigninForm");
    return Promise.resolve(module.default);
  },
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

export default function SingInRoute() {
  return <SigninForm />;
}
import AuthForm from "@/components/auth-form";
import H1 from "@/components/h1";
import Link from "next/link";

export default function Page() {
  return (
    <main>
      <H1 className="mb-5 text-center">Log In</H1>
      <AuthForm type="login" />
      <p className="mt-6 text-sm text-zinc-500">
        No Account yet?{" "}
        <Link href="/signup" className="font-medium">
          Sign Up
        </Link>
      </p>
    </main>
  );
}

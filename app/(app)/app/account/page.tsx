import ContentBlock from "@/components/content-block";
import H1 from "@/components/h1";
import SignOutBtn from "@/components/sign-out-btn";
import { checkAuth } from "@/lib/server-util";

export default async function Page() {
  // authenticate check
  const session = await checkAuth();

  return (
    <main>
      <H1 className="my-4">Your Account</H1>
      <ContentBlock className="h-[500px] flex flex-col gap-3 justify-center items-center">
        <p>Logged in as {session.user.email}</p>
        <SignOutBtn />
      </ContentBlock>
    </main>
  );
}

"use client";

import { createPaymentSession } from "@/actions/actions";
import H1 from "@/components/h1";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [isPending, startTransition] = useTransition();
  const { data: session, update, status } = useSession();
  const router = useRouter();

  return (
    <main className="flex flex-col items-center space-y-3">
      <H1>PefSoft access requires payment</H1>

      {searchParams.success && (
        <Button
          disabled={status === "loading" || session?.user.hasAccess}
          onClick={async () => {
            await update(true);
            router.push("/app/dashboard");
          }}
        >
          Access PetSoft
        </Button>
      )}

      {!searchParams.success && (
        <Button
          disabled={isPending}
          onClick={async () => {
            startTransition(async () => {
              await createPaymentSession();
            });
          }}
        >
          Buy lifetime access for $286
        </Button>
      )}

      {searchParams.success && (
        <p className="text-sm text-green-700">Payment sussessful!</p>
      )}

      {searchParams.cancelled && (
        <p className="text-sm text-red-700">
          Payment cancelled! You can try agagin.
        </p>
      )}
    </main>
  );
}

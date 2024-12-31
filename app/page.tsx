"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();
  const [statusStatus, setStatusStatus] = useState("");

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  useEffect(() => {
    if (status === "loading") {
      // return <p>Loading...</p>;
      setStatusStatus("Loading");
    } else if (status === "authenticated") {
      setStatusStatus("Authenticated");
      return;
    } else if (status === "unauthenticated") {
      setStatusStatus("Unauthenticated");
      return;
    }
  }, [status]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <p>{statusStatus}</p>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h2>Home page</h2>

        {session ? (
          <>
            <h4>Welcome </h4> <p>Email: {session.user?.email}</p>
            <Button onClick={handleSignOut}>Sign Out</Button>
          </>
        ) : (
          <>
            <Link href="/signIn">
              <Button>Sign In</Button>
            </Link>
            <Link href="/signUp">
              <Button>Sign Up</Button>
            </Link>
          </>
        )}
      </main>
    </div>
  );
}

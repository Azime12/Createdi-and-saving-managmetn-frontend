"use client";

import { useSession } from "next-auth/react";

export default function UserProfile() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>Please sign in to continue.</p>;
  }

  return (
    <div>
      <h2>Welcome, {session.user?.name}!</h2>
      <p>Email: {session.user?.email}</p>
      <img src={session.user?.image ?? "/default-profile.png"} alt="Profile" width={50} height={50} />
    </div>
  );
}

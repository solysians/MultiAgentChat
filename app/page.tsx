"use client";

import { Analytics } from "@vercel/analytics/react";
import { Home } from "./components/home";
import { getServerSideConfig } from "./config/server";
import { useSession, signIn, signOut } from "next-auth/react";
import UserLogin from "./login/UserLoginPage";

const serverConfig = getServerSideConfig();

const App = () => {
  const { data: session } = useSession();

  return (
    <>
      <Home />
      {!session ? (
        <UserLogin />
      ) : (
        <div>
          <p>Welcome, {session.user.email}</p>
          <button onClick={() => signOut()}>Logout</button>
        </div>
      )}
      {serverConfig?.isVercel && (
        <>
          <Analytics />
        </>
      )}
    </>
  );
};

export default App;

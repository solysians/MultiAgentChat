"use client";

import { Analytics } from "@vercel/analytics/react";
import { Home } from "./components/home";
import { getServerSideConfig } from "./config/server";
import { useSession } from "next-auth/react";

const serverConfig = getServerSideConfig();

const App = () => {
  const { data: session } = useSession();

  return (
    <>
      <Home />

      {serverConfig?.isVercel && (
        <>
          <Analytics />
        </>
      )}
    </>
  );
};

export default App;

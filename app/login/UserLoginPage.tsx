// app/login/UserLoginPage.tsx
import { signIn } from "next-auth/react";

const UserLogin = () => {
  const handleGoogleLogin = () => signIn("google");
  const handleEmailLogin = () => signIn("email");

  return (
    <div>
      <h1>User Login</h1>
      <button onClick={handleGoogleLogin}>Login with Google</button>
      <button onClick={handleEmailLogin}>Login with Email</button>
    </div>
  );
};

export default UserLogin;

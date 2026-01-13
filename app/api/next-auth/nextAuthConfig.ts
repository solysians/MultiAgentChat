import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";

const configureNextAuth = () => {
  return NextAuth({
    providers: [
      GoogleProvider({
        clientId: process.env.NEXTAUTH_GOOGLE_CLIENT_ID,
        clientSecret: process.env.NEXTAUTH_GOOGLE_CLIENT_SECRET,
      }),
      EmailProvider({
        server: process.env.NEXTAUTH_EMAIL_SERVER,
        from: process.env.NEXTAUTH_EMAIL_FROM,
      }),
    ],
    session: {
      strategy: "jwt",
    },
    pages: {
      signIn: '/login', // Custom login page
    },
    callbacks: {
      async session({ session, token }) {
        session.user.id = token.sub; // Add user ID to session
        return session;
      },
    },
  });
};

export { configureNextAuth };

import NextAuth from "next-auth";
import { configureNextAuth } from "./nextAuthConfig";

const authOptions = configureNextAuth();

export default (req, res) => NextAuth(req, res, authOptions);

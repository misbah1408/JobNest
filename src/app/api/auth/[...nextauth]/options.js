import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials)  {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error("No user found");
          }
          if (!user.isVerified) {
            throw new Error("Please verify your email");
          }
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isValid) {
            return user;
          } else {
            throw new Error("Incorrect password");
          }
        } catch (error) {
          throw new Error("Error in authorize", error);
        }
      },
    }),
  ],
  callbacks:{
    async jwt({token, user}) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.username = user.username;
      }
      return token;
    },
    async session({session, token}) {
        if (token) {
            session.user._id = token._id;
            session.user.isVerified = token.isVerified;
            session.user.username = token.username;
        }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session:{
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
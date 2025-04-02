import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier.toLowerCase() },
              { username: credentials.identifier.toLowerCase() },
            ],
          });

          if (!user) throw new Error("No user found");
          if (!user.isVerified) throw new Error("Please verify your email");

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) throw new Error("Incorrect password");

          return {
            _id: user._id.toString(),
            username: user.username,
            email: user.email,
            isVerified: user.isVerified,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  
  callbacks: {
    async signIn({ account, profile }) {
      await dbConnect();

      if (account.provider === "google") {
        let user = await UserModel.findOne({ email: profile.email });

        if (!user) {
          user = await UserModel.create({
            name: profile.name,
            username: profile.email.split("@")[0],
            email: profile.email,
            provider: "google",
            isVerified: true,
          });
        }

        return true;
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.username = user.username;
        token.email = user.email;
        token.isVerified = user.isVerified;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          _id: token._id,
          username: token.username,
          email: token.email,
          isVerified: token.isVerified,
        };
      }
      return session;
    },
  },

  pages: {
    signIn: "/sign-in",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);

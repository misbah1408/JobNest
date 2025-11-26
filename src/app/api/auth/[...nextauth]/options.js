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
          // console.log(user);

          if (!user) throw new Error("No user found");
          if (!user.isVerified) throw new Error("Please verify your email");

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isValid) throw new Error("Incorrect password");

          return {
            _id: user._id.toString(),
            username: user.username,
            email: user.email,
            isVerified: user.isVerified,
            role: user.role,
            name: user.name,
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
      // console.log("account", account);

      if (account.provider === "google") {
        let user = await UserModel.findOne({ email: profile.email });
        // console.log(profile);

        if (!user) {
          user = await UserModel.create({
            name: profile.name,
            username: profile.email.split("@")[0],
            email: profile.email,
            provider: "google",
            isVerified: true,
            role: "job_seeker",
            image: profile.picture,
          });
        }

        return true;
      }

      return true;
    },

    async jwt({ token, user }) {
      // console.log("token", token);

      if (user) {
        token._id = user._id;
        token.username = user.username;
        token.email = user.email;
        token.isVerified = user.isVerified;
        token.role = user.role;
        token.name = user.name;
        token.resumeUrl = user.resumeUrl;
      } else {
        const dbUser = await UserModel.findOne({ email: token.email });
        // console.log(dbUser);

        if (dbUser) {
          token._id = dbUser._id.toString();
          token.username = dbUser.username;
          token.isVerified = dbUser.isVerified;
          token.role = dbUser.role;
          token.name = dbUser.name;
          token.image = dbUser.image;
          token.resumeUrl = dbUser.resumeUrl;
        }
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
          role: token.role,
          name: token.name,
          image: token.image,
          resumeUrl: token.resumeUrl,
        };
      }
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "none",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      },
    },
  },
  pages: {
    signIn: "/sign-in",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);

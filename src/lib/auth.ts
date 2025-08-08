import { UserModel } from "@/models/User";
import { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import db from "./db";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      await db();
      try {
        if (!user?.email) {
          return false;
        }

        const existingUser = await UserModel.findOne({
          email: user.email,
        });

        if (existingUser) {
          return true;
        }

        await UserModel.create({
          email: user.email,
          name: user.name!,
          image:user.image!
        });

        return true;
      } catch (error) {
        console.error("Error during signIn callback:", error);
        return false;
      }
    },
  },
};

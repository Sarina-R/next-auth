import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        console.log(user);
        if (!user) throw new Error("Invalid email or password");

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        console.log(isPasswordValid);

        if (!isPasswordValid) throw new Error("Invalid email or password");
        console.log({ id: user.id, name: user.name, email: user.email });
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          //   id: token.id,
          name: token.name,
          email: token.email,
        };
      }
      return session;
    },
  },

  //   pages: {
  //     signIn: "/",
  //     signOut: "/",
  //   },
});

export { handler as GET, handler as POST };

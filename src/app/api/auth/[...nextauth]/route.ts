import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";


declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
    };
  }
  interface User {
    role?: string | null;
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser {
    role?: string | null;
  }
}

const prisma = new PrismaClient();

// Export authOptions for use in API routes
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) {
          console.error("No user found for email:", credentials.email);
          return null;
        }
        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) {
          console.error("Invalid password for user:", credentials.email);
          return null;
        }
        // Ensure all required fields are strings
        return {
          id: user.id.toString(),
          name: user.name || "",
          email: user.email || "",
          role: user.role || null,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: import("next-auth").Session; token: import("next-auth/jwt").JWT }) {
      if (session?.user) {
        session.user.role = typeof token.role === "string" ? token.role : null;
      }
      return session;
    },
    async jwt({ token, user }: { token: import("next-auth/jwt").JWT; user?: import("next-auth").User }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login", // Change to your actual login page if needed
    error: "/login",  // Redirect errors to login page
  },
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET || "changeme-secret", // Add secret for production
};

// NextAuth handler
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

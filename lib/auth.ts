import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production"
      }
    }
  },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Tài khoản", type: "text" },
        password: { label: "Mật khẩu", type: "password" }
      },
      async authorize(credentials) {
        const username = credentials?.username?.trim();
        const password = credentials?.password || "";
        if (!username || !password) return null;
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { username: { equals: username, mode: "insensitive" } },
              { student: { mssv: username.toUpperCase() } }
            ]
          },
          include: { teacher: true, student: true }
        });
        if (!user || !user.active) return null;
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;
        if (user.role === "TEACHER" && user.teacher && !user.teacher.active) return null;
        return {
          id: user.id,
          name: user.name,
          email: user.username,
          role: user.role,
          teacherId: user.teacher?.id ?? null,
          studentId: user.student?.id ?? null
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.teacherId = user.teacherId ?? null;
        token.studentId = user.studentId ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || "";
        session.user.role = token.role || "";
        session.user.teacherId = token.teacherId ?? null;
        session.user.studentId = token.studentId ?? null;
      }
      return session;
    }
  }
};

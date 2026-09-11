import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

function isBcryptHash(value: string) {
  return /^\$2[aby]\$\d{2}\$/.test(value);
}

async function passwordMatches(plain: string, stored: string) {
  if (!stored) return false;
  if (isBcryptHash(stored)) {
    try {
      return await bcrypt.compare(plain, stored);
    } catch {
      return false;
    }
  }
  return stored === plain;
}

async function findLoginUser(raw: string) {
  const username = raw.trim();
  const lower = username.toLowerCase();
  const mssv = username.toUpperCase();
  return prisma.user.findFirst({
    where: {
      OR: [
        { username: lower },
        { username },
        { student: { is: { mssv } } }
      ]
    },
    include: { teacher: true, student: true }
  });
}

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
        const user = await findLoginUser(username);
        if (!user || !user.active) return null;
        const ok = await passwordMatches(password, user.passwordHash);
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

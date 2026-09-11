"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PasswordField from "@/app/components/PasswordField";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const res = await signIn("credentials", { username, password, redirect: false });
    if (res?.ok) router.replace("/");
    else setErr("Tài khoản hoặc mật khẩu không đúng");
  }

  return (
    <section className="login-wrap">
      <div className="login-card">
        <div className="login-art">
          <div>
            <img className="brand-logo" src="/logo.svg" alt="Logo" />
            <h1>Hệ thống quản lý lớp học</h1>
            <p>Quản lý lớp chủ nhiệm, theo dõi sinh viên trên nền tảng Next.js + PostgreSQL.</p>
          </div>
        </div>
        <form className="login-form" onSubmit={onSubmit}>
          <h2>Đăng nhập</h2>
          <p className="sub">Hệ thống tự nhận vai trò từ tài khoản đã cấp.</p>
          {err ? <p className="form-error show">{err}</p> : null}
          <div className="field">
            <label>Tài khoản / MSSV</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
          </div>
          <div className="field">
            <label>Mật khẩu</label>
            <PasswordField
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <button className="btn btn-primary full" type="submit">Đăng nhập</button>
        </form>
      </div>
    </section>
  );
}

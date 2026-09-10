"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";

const NAV = {
  TEACHER: [
    ["Lớp & sinh viên", [["/dash", "Tổng quan"], ["/classes", "Lớp chủ nhiệm"], ["/students", "Sinh viên"]]],
    ["Theo dõi", [["/attendance", "Điểm danh"], ["/leaves", "Nghỉ phép"], ["/reports", "Báo cáo tuần"], ["/tasks", "Công việc"]]]
  ],
  ADMIN: [
    ["Quản trị", [["/admin", "Tổng quan"], ["/admin/audit", "Nhật ký"], ["/admin/config", "Cấu hình"], ["/students", "Sinh viên"], ["/classes", "Lớp"]]]
  ],
  STUDENT: [
    ["Cổng sinh viên", [["/portal", "Thông tin"], ["/portal/leave", "Nghỉ phép"], ["/portal/week", "Báo cáo tuần"]]]
  ]
} as const;

export default function Shell({
  name, role, year, term, week, children
}: {
  name: string; role: string; year: string; term: string; week: number; children: React.ReactNode;
}) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const groups = NAV[role as keyof typeof NAV] || NAV.TEACHER;
  const brand = role === "STUDENT" ? "Hệ thống quản lý lớp học hỗ trợ sinh viên" : "Hệ thống quản lý lớp học";
  return (
    <div className="shell">
      <div className="mobile-bar">
        <button className="icon-btn" type="button" onClick={() => setOpen((v) => !v)}>☰</button>
        <b>{role === "ADMIN" ? "Quản trị" : role === "STUDENT" ? "Hỗ trợ sinh viên" : "Quản lý lớp học"}</b>
        <span style={{ width: 36 }} />
      </div>
      <div className={`backdrop ${open ? "show" : ""}`} onClick={() => setOpen(false)} />
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="side-brand">
          <img className="logo-img" src="/logo.svg" alt="" />
          <div><b>{brand}</b><span>{role === "ADMIN" ? "Quản trị" : role === "STUDENT" ? "Cổng sinh viên" : "Giáo viên chủ nhiệm"}</span></div>
        </div>
        <div className="nav">
          {groups.map(([label, items]) => (
            <div key={label}>
              <div className="nav-label">{label}</div>
              {items.map(([href, lb]) => (
                <Link key={href} href={href} className={path === href ? "active" : ""} onClick={() => setOpen(false)}>
                  {lb}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="side-user">
          <div className="avatar">{name.slice(0, 1)}</div>
          <div style={{ flex: 1 }}>
            <b style={{ fontSize: 13, color: "#fff" }}>{name}</b>
            <div className="muted" style={{ color: "#dcfce7" }}>{role}</div>
          </div>
          <button className="btn btn-sm btn-ghost" type="button" onClick={() => signOut({ callbackUrl: "/login" })}>Thoát</button>
        </div>
      </aside>
      <main className="main">
        <div className="chips" style={{ marginBottom: 12 }}>
          <div className="chip">Năm học: <strong>{year}</strong></div>
          <div className="chip">Kỳ: <strong>{term}</strong></div>
          <div className="chip">Tuần: <strong>{week}</strong></div>
        </div>
        {children}
      </main>
    </div>
  );
}

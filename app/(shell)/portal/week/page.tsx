"use client";
import { useState } from "react";

export default function WeekReportPage() {
  const [msg, setMsg] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const answers = Object.fromEntries(fd.entries());
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answers)
    });
    setMsg(res.ok ? "Đã nộp báo cáo tuần" : "Không gửi được (có thể đã nộp tuần này)");
  }
  return (
    <form className="card report-sheet" onSubmit={submit}>
      <div className="report-head">
        <div className="org">BÁO CÁO TUẦN</div>
        <h3>Phản hồi học tập</h3>
      </div>
      <div className="field"><label>Số buổi nghỉ</label><input name="ABSENT" type="number" min={0} defaultValue={0} /></div>
      <div className="field"><label>Số buổi trễ</label><input name="LATE" type="number" min={0} defaultValue={0} /></div>
      <div className="field"><label>Cần hỗ trợ</label>
        <select name="SUPPORT"><option>Không</option><option>Có</option></select>
      </div>
      <div className="field"><label>Chi tiết hỗ trợ</label><input name="SUPPORT_DETAIL" /></div>
      <button className="btn btn-primary" type="submit">Nộp báo cáo</button>
      {msg ? <p className="muted" style={{ marginTop: 8 }}>{msg}</p> : null}
    </form>
  );
}

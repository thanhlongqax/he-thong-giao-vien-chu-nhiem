"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LeaveForm() {
  const [reason, setReason] = useState("");
  const [fromDate, setFrom] = useState("");
  const [toDate, setTo] = useState("");
  const router = useRouter();
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/leaves", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromDate, toDate, reason, session: "Cả ngày" })
    });
    setReason("");
    router.refresh();
  }
  return (
    <form className="card" onSubmit={submit}>
      <div className="form-grid">
        <div className="field"><label>Từ ngày</label><input type="date" value={fromDate} onChange={(e) => setFrom(e.target.value)} required /></div>
        <div className="field"><label>Đến ngày</label><input type="date" value={toDate} onChange={(e) => setTo(e.target.value)} required /></div>
        <div className="field span-2"><label>Lý do</label><input value={reason} onChange={(e) => setReason(e.target.value)} required /></div>
      </div>
      <button className="btn btn-primary" type="submit">Gửi đơn</button>
    </form>
  );
}

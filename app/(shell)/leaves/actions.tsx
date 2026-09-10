"use client";
import { useRouter } from "next/navigation";

export default function LeaveActions({ id }: { id: string }) {
  const router = useRouter();
  async function decide(status: "Approved" | "Rejected") {
    await fetch(`/api/leaves/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    router.refresh();
  }
  return (
    <div className="leave-actions">
      <button className="btn btn-sm btn-primary" type="button" onClick={() => decide("Approved")}>Duyệt</button>
      <button className="btn btn-sm btn-outline" type="button" onClick={() => decide("Rejected")}>Từ chối</button>
    </div>
  );
}

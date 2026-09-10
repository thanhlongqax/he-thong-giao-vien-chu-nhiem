import { prisma } from "@/lib/prisma";

export default async function AttendancePage() {
  const slots = await prisma.schedule.findMany({ include: { subject: true, class: true } });
  return (
    <>
      <div className="topbar"><h2>Điểm danh theo tiết</h2></div>
      <div className="card">
        <p className="muted">Chọn tiết lịch học. Ghi điểm danh qua API <code>/api/attendance</code> (scheduleId).</p>
        {slots.map((s) => (
          <div className="assign-card" key={s.id}>
            <b>{s.day} {s.start}–{s.end}</b>
            <div className="muted">{s.subject.name} · {s.class.name}</div>
          </div>
        ))}
      </div>
    </>
  );
}

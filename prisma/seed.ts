/**
 * Seed từ cấu trúc JSON localStorage gvcn_system_v3.
 * Mật khẩu mặc định 123456 được hash bcrypt.
 */
import { PrismaClient, Role, IssueStatus, IssueSource, LeaveStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("123456", 12);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.auditLog.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.leaveRequest.deleteMany();
  await prisma.weeklyReport.deleteMany();
  await prisma.issue.deleteMany();
  await prisma.task.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.assignmentTeacher.deleteMany();
  await prisma.assignmentClass.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.student.deleteMany();
  await prisma.class.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.faculty.deleteMany();
  await prisma.user.deleteMany();
  await prisma.academicConfig.deleteMany();

  await prisma.academicConfig.create({
    data: {
      id: "current",
      year: "2025-2026",
      term: "Học kỳ 1",
      week: 8,
      yearStart: new Date("2025-09-01"),
      weeksPerTerm: 22
    }
  });

  const admin = await prisma.user.create({
    data: { username: "admin", passwordHash: hash, name: "Quản trị hệ thống", role: Role.ADMIN }
  });

  const k1 = await prisma.faculty.create({ data: { name: "Kinh tế" } });
  const k2 = await prisma.faculty.create({ data: { name: "Công nghệ thông tin" } });
  await prisma.faculty.create({ data: { name: "Cơ khí" } });

  const gvUser = await prisma.user.create({
    data: { username: "gv", passwordHash: hash, name: "Nguyễn Thị Hồng", role: Role.TEACHER }
  });
  const gv1 = await prisma.teacher.create({
    data: {
      userId: gvUser.id,
      facultyId: k1.id,
      dob: new Date("1988-05-12"),
      position: "Giảng viên",
      title: "Giáo viên chủ nhiệm",
      active: true
    }
  });

  const c1 = await prisma.class.create({
    data: { name: "DHKT01", level: "daihoc", year: "2025-2026", note: "Kinh tế — Đại học", homeroomTeacherId: gv1.id }
  });
  const c2 = await prisma.class.create({
    data: { name: "CDCN02", level: "caodang", year: "2025-2026", note: "Công nghệ — Cao đẳng", homeroomTeacherId: gv1.id }
  });
  const c3 = await prisma.class.create({
    data: { name: "TCCN01", level: "trungcap", year: "2025-2026", note: "Công nghệ — Trung cấp", homeroomTeacherId: gv1.id }
  });

  const rawStudents = [
    ["SV001", "Nguyễn Minh Anh", "Nữ", "2005-03-12", c1.id, "0912345001", "Nguyễn Văn A", "0901111001", "Trần Thị B", "0901111002", "12 Nguyễn Huệ, Q.1", "KTX A, P.101", "Đang học", "Lớp trưởng"],
    ["SV002", "Trần Quốc Bảo", "Nam", "2005-07-21", c1.id, "0912345002", "Trần Văn C", "0901111003", "Lê Thị D", "0901111004", "45 Lê Lợi, Q.3", "KTX A, P.102", "Đang học", "Không"],
    ["SV003", "Lê Gia Hân", "Nữ", "2005-01-09", c1.id, "0912345003", "Lê Văn E", "0901111005", "Phạm Thị F", "0901111006", "8 Pasteur, Q.1", "Nhà trọ Q. Tân Bình", "Cần quan tâm", "Không"],
    ["SV004", "Phạm Đức Huy", "Nam", "2004-11-02", c1.id, "0912345004", "Phạm Văn G", "0901111007", "Võ Thị H", "0901111008", "22 Cách Mạng Tháng 8", "KTX B", "Đang học", "Không"],
    ["SV005", "Võ Ngọc Lan", "Nữ", "2005-05-18", c2.id, "0912345005", "Võ Văn I", "0901111009", "Đặng Thị K", "0901111010", "3 Hoàng Diệu", "KTX C", "Cần theo dõi", "Lớp trưởng"],
    ["SV006", "Đặng Nhật Nam", "Nam", "2006-02-14", c2.id, "0912345006", "Đặng Văn L", "0901111011", "Bùi Thị M", "0901111012", "19 Nguyễn Trãi", "Nhà riêng", "Đang học", "Không"],
    ["SV007", "Bùi Thanh Tâm", "Nữ", "2006-09-30", c2.id, "0912345007", "Bùi Văn N", "0901111013", "Ngô Thị O", "0901111014", "77 Điện Biên Phủ", "KTX C", "Đang học", "Không"],
    ["SV008", "Ngô Hoàng Phúc", "Nam", "2007-04-05", c3.id, "0912345008", "Ngô Văn P", "0901111015", "Lý Thị Q", "0901111016", "5 Hai Bà Trưng", "KTX D", "Đang học", "Lớp trưởng"],
    ["SV009", "Lý Mai Chi", "Nữ", "2007-08-19", c3.id, "0912345009", "Lý Văn R", "0901111017", "Tạ Thị S", "0901111018", "31 Võ Văn Tần", "KTX D", "Cần quan tâm", "Không"],
    ["SV010", "Tạ Minh Khoa", "Nam", "2007-12-01", c3.id, "0912345010", "Tạ Văn T", "0901111019", "Hồ Thị U", "0901111020", "9 Nguyễn Đình Chiểu", "Nhà trọ", "Đang học", "Không"]
  ] as const;

  const students = [];
  for (const r of rawStudents) {
    const user = await prisma.user.create({
      data: { username: r[0].toLowerCase(), passwordHash: hash, name: r[1], role: Role.STUDENT }
    });
    const st = await prisma.student.create({
      data: {
        userId: user.id,
        mssv: r[0],
        classId: r[4],
        gender: r[2],
        dob: new Date(r[3]),
        phone: r[5],
        father: r[6],
        fatherPhone: r[7],
        mother: r[8],
        motherPhone: r[9],
        addrThuongTru: r[10],
        addrCuTru: r[11],
        status: r[12],
        officer: r[13]
      }
    });
    await prisma.enrollment.create({
      data: { studentId: st.id, classId: r[4], year: "2025-2026", term: "Học kỳ 1" }
    });
    students.push(st);
  }

  const m1 = await prisma.subject.create({ data: { name: "Toán cao cấp", code: "MATH101", credit: 3 } });
  const m2 = await prisma.subject.create({ data: { name: "Tin học đại cương", code: "IT101", credit: 3 } });
  await prisma.subject.create({ data: { name: "Triết học", code: "PHIL101", credit: 2 } });
  const m4 = await prisma.subject.create({ data: { name: "Kỹ năng mềm", code: "SS101", credit: 2 } });
  const m5 = await prisma.subject.create({ data: { name: "Anh văn 1", code: "ENG101", credit: 3 } });

  async function assign(subjectId: string, classIds: string[]) {
    const a = await prisma.assignment.create({
      data: { subjectId, year: "2025-2026", term: "Học kỳ 1" }
    });
    await prisma.assignmentTeacher.create({ data: { assignmentId: a.id, teacherId: gv1.id } });
    for (const classId of classIds) {
      await prisma.assignmentClass.create({ data: { assignmentId: a.id, classId } });
    }
  }
  await assign(m1.id, [c1.id]);
  await assign(m2.id, [c1.id, c2.id]);
  await assign(m5.id, [c1.id]);
  await assign(m4.id, [c2.id, c3.id]);

  const sch1 = await prisma.schedule.create({ data: { day: "Thứ 2", start: "07:30", end: "09:15", subjectId: m1.id, classId: c1.id } });
  await prisma.schedule.create({ data: { day: "Thứ 3", start: "09:20", end: "11:00", subjectId: m2.id, classId: c1.id } });
  const sch3 = await prisma.schedule.create({ data: { day: "Thứ 3", start: "09:20", end: "11:00", subjectId: m2.id, classId: c2.id } });
  await prisma.schedule.create({ data: { day: "Thứ 4", start: "13:00", end: "14:40", subjectId: m5.id, classId: c1.id } });
  await prisma.schedule.create({ data: { day: "Thứ 5", start: "07:30", end: "09:15", subjectId: m4.id, classId: c2.id } });
  await prisma.schedule.create({ data: { day: "Thứ 5", start: "07:30", end: "09:15", subjectId: m4.id, classId: c3.id } });
  await prisma.schedule.create({ data: { day: "Thứ 6", start: "09:20", end: "11:00", subjectId: m2.id, classId: c2.id } });

  await prisma.attendance.createMany({
    data: [
      { studentId: students[2].id, scheduleId: sch1.id, subjectId: m1.id, date: today, status: "Vắng", note: "Không phép", year: "2025-2026", term: "Học kỳ 1", week: 8 },
      { studentId: students[1].id, scheduleId: sch1.id, subjectId: m1.id, date: today, status: "Trễ", note: "15 phút", year: "2025-2026", term: "Học kỳ 1", week: 8 },
      { studentId: students[4].id, scheduleId: sch3.id, subjectId: m2.id, date: today, status: "Vắng", note: "Có phép", year: "2025-2026", term: "Học kỳ 1", week: 8 }
    ]
  });

  await prisma.leaveRequest.create({
    data: {
      studentId: students[2].id,
      fromDate: today,
      toDate: today,
      reason: "Ốm, khám bệnh",
      status: LeaveStatus.Pending,
      source: "Form"
    }
  });

  await prisma.weeklyReport.create({
    data: {
      studentId: students[0].id,
      week: 8,
      year: "2025-2026",
      term: "Học kỳ 1",
      answers: { ABSENT: "0", LATE: "0", LEARNING: "Tốt", DIFFICULTY: "Không", SUPPORT: "Không", MOTIVATION: "Ổn định" }
    }
  });

  await prisma.issue.createMany({
    data: [
      { studentId: students[2].id, type: "Nghiêm trọng", text: "Nghỉ không phép 2 buổi liên tiếp", week: 8, year: "2025-2026", term: "Học kỳ 1", source: IssueSource.teacher, status: IssueStatus.Pending, reported: false, date: today },
      { studentId: students[4].id, type: "Cần hỗ trợ", text: "Gia đình khó khăn, hay đi trễ", week: 8, year: "2025-2026", term: "Học kỳ 1", source: IssueSource.teacher, status: IssueStatus.InProgress, reported: true, date: today }
    ]
  });

  await prisma.task.createMany({
    data: [
      { teacherId: gv1.id, title: "Họp lớp đầu tuần", date: today, type: "Hôm nay", done: false },
      { teacherId: gv1.id, title: "Duyệt đơn nghỉ phép", date: today, type: "Hôm nay", done: false },
      { teacherId: gv1.id, title: "Nhập điểm danh môn Toán", date: today, type: "Tuần này", done: false },
      { teacherId: gv1.id, title: "Nộp báo cáo tuần lên khoa", date: today, type: "Tuần này", done: false }
    ]
  });

  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      actorRole: "ADMIN",
      actorName: admin.name,
      action: "seed",
      entity: "system",
      detail: "Seed từ JSON localStorage v3"
    }
  });

  console.log("Seed xong. Tài khoản: admin / gv / sv001  — mật khẩu 123456");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

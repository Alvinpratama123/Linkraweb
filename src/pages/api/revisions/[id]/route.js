// =====================================================================
// File       : pages/api/revisions/[id]/route.js
// Fungsi     : Detail satu laporan revisi (GET, PATCH, DELETE)
//              Menggunakan gaya App Router Next.js (export fungsi terpisah)
// Alur Umum  :
//   - GET    → ambil laporan + semua komentar (urut asc)
//              → resolve data sentBy, targetUser, & author komentar
//                dari auth_db
//   - PATCH  → update field laporan (progress, approval, approvalNote,
//              attachment) → resolve sentBy dari auth_db
//   - DELETE → hapus semua komentar (cascade) → hapus laporan
//
// Catatan    :
//   - Fungsi resolveUsers(): mengambil data user dari auth_db
//     berdasarkan array ID, mengembalikan map { id → userData }
//   - attachmentData hanya disimpan di non-production (development)
//   - Komentar diurutkan berdasarkan createdAt secara ascending
// =====================================================================

import { NextResponse } from "next/server";
import { prismaMonitoring as prisma } from "@/lib/prismaMonitoring";
import { prismaAuth } from "@/lib/prismaAuth";

async function resolveUsers(ids) {
  const unique = [...new Set(ids.filter(Boolean))];
  if (unique.length === 0) return {};
  const users = await prismaAuth.user.findMany({
    where: { id: { in: unique } },
    select: { id: true, name: true, role: true, email: true, position: true },
  });
  return Object.fromEntries(users.map(u => [u.id, u]));
}

// GET /api/revisions/:id
export async function GET(_req, { params }) {
  try {
    const report = await prisma.revisionReport.findUnique({
      where: { id: params.id },
      include: {
        comments: { orderBy: { createdAt: "asc" } },
      },
    });
    if (!report)
      return NextResponse.json({ error: "Laporan tidak ditemukan" }, { status: 404 });

    const authorIds = [
      report.sentById,
      report.targetUserId,
      ...report.comments.map(c => c.authorId),
    ];
    const usersMap = await resolveUsers(authorIds);

    const enriched = {
      ...report,
      sentBy: usersMap[report.sentById] || null,
      targetUser: usersMap[report.targetUserId] || null,
      comments: report.comments.map(c => ({
        ...c,
        author: usersMap[c.authorId] || null,
      })),
    };

    return NextResponse.json({ data: enriched });
  } catch (error) {
    console.error("[GET /api/revisions/:id]", error);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}

// PATCH /api/revisions/:id
export async function PATCH(req, { params }) {
  try {
    const body = await req.json();
    const { progress, approval, approvalNote, attachmentName, attachmentUrl, attachmentData } = body;

    const existing = await prisma.revisionReport.findUnique({ where: { id: params.id } });
    if (!existing)
      return NextResponse.json({ error: "Laporan tidak ditemukan" }, { status: 404 });

    const updated = await prisma.revisionReport.update({
      where: { id: params.id },
      data: {
        ...(progress     !== undefined && { progress }),
        ...(approval     !== undefined && { approval }),
        ...(approvalNote !== undefined && { approvalNote }),
        ...(attachmentName !== undefined && { attachmentName }),
        ...(attachmentUrl  !== undefined && { attachmentUrl }),
        ...(attachmentData !== undefined &&
            process.env.NODE_ENV !== "production" && { attachmentData }),
      },
    });

    const usersMap = await resolveUsers([updated.sentById]);
    const enriched = {
      ...updated,
      sentBy: usersMap[updated.sentById] || null,
    };

    return NextResponse.json({ data: enriched });
  } catch (error) {
    console.error("[PATCH /api/revisions/:id]", error);
    return NextResponse.json({ error: "Gagal memperbarui laporan" }, { status: 500 });
  }
}

// DELETE /api/revisions/:id
export async function DELETE(_req, { params }) {
  try {
    const existing = await prisma.revisionReport.findUnique({ where: { id: params.id } });
    if (!existing)
      return NextResponse.json({ error: "Laporan tidak ditemukan" }, { status: 404 });

    await prisma.revisionComment.deleteMany({ where: { reportId: params.id } });
    await prisma.revisionReport.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/revisions/:id]", error);
    return NextResponse.json({ error: "Gagal menghapus laporan" }, { status: 500 });
  }
}
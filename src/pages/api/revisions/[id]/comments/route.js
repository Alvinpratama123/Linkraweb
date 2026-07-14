// =====================================================================
// File       : pages/api/revisions/[id]/comments/route.js
// Fungsi     : Komentar pada laporan revisi (GET, POST)
//              Menggunakan gaya App Router Next.js (export fungsi terpisah)
// Alur Umum  :
//   - GET    → ambil semua komentar untuk laporan tertentu (urut asc)
//              → resolve data author dari auth_db
//   - POST   → validasi konten komentar tidak kosong
//              → pastikan laporan revisi ada di database
//              → buat komentar baru → kembalikan beserta data author
//
// Catatan    :
//   - Komentar disimpan di monitoring_db (tabel revisionComment)
//   - Author info diambil dari auth_db (bukan dari monitoring_db)
//   - ID laporan (reportId) diambil dari URL parameter
// =====================================================================

import { NextResponse } from "next/server";
import { prismaMonitoring as prisma } from "@/lib/prismaMonitoring";
import { prismaAuth } from "@/lib/prismaAuth";

export async function GET(_req, { params }) {
  try {
    const comments = await prisma.revisionComment.findMany({
      where: { reportId: params.id },
      orderBy: { createdAt: "asc" },
    });

    const authorIds = comments.map(c => c.authorId).filter(Boolean);
    let usersMap = {};
    if (authorIds.length > 0) {
      const users = await prismaAuth.user.findMany({
        where: { id: { in: [...new Set(authorIds)] } },
        select: { id: true, name: true, role: true },
      });
      usersMap = Object.fromEntries(users.map(u => [u.id, u]));
    }

    const enriched = comments.map(c => ({
      ...c,
      author: usersMap[c.authorId] || null,
    }));

    return NextResponse.json({ data: enriched });
  } catch (error) {
    console.error("[GET comments]", error);
    return NextResponse.json({ error: "Gagal mengambil komentar" }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const { content, authorId } = await req.json();

    if (!content?.trim())
      return NextResponse.json({ error: "Komentar tidak boleh kosong" }, { status: 400 });
    if (!authorId)
      return NextResponse.json({ error: "Author wajib diisi" }, { status: 400 });

    const report = await prisma.revisionReport.findUnique({ where: { id: params.id } });
    if (!report)
      return NextResponse.json({ error: "Laporan tidak ditemukan" }, { status: 404 });

    const comment = await prisma.revisionComment.create({
      data: { content: content.trim(), authorId, reportId: params.id },
    });

    const author = await prismaAuth.user.findUnique({
      where: { id: authorId },
      select: { id: true, name: true, role: true },
    });

    return NextResponse.json({ data: { ...comment, author } }, { status: 201 });
  } catch (error) {
    console.error("[POST comments]", error);
    return NextResponse.json({ error: "Gagal menambahkan komentar" }, { status: 500 });
  }
}
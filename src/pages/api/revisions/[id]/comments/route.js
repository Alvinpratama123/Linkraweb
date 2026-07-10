import { NextResponse } from "next/server";
import { prismaMonitoring as prisma } from "@/lib/prismaMonitoring";

export async function GET(_req, { params }) {
  try {
    const comments = await prisma.revisionComment.findMany({
      where: { reportId: params.id },
      orderBy: { createdAt: "asc" },
      include: { author: { select: { id: true, name: true, role: true } } },
    });
    return NextResponse.json({ data: comments });
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
      include: { author: { select: { id: true, name: true, role: true } } },
    });

    return NextResponse.json({ data: comment }, { status: 201 });
  } catch (error) {
    console.error("[POST comments]", error);
    return NextResponse.json({ error: "Gagal menambahkan komentar" }, { status: 500 });
  }
}
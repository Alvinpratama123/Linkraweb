import { NextResponse } from "next/server";
import { prismaMonitoring as prisma } from "@/lib/prismaMonitoring";

// GET /api/revisions/:id
export async function GET(_req, { params }) {
  try {
    const report = await prisma.revisionReport.findUnique({
      where: { id: params.id },
      include: {
        sentBy:   { select: { id: true, name: true, role: true } },
        comments: {
          orderBy: { createdAt: "asc" },
          include: { author: { select: { id: true, name: true, role: true } } },
        },
      },
    });
    if (!report)
      return NextResponse.json({ error: "Laporan tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ data: report });
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
      include: { sentBy: { select: { id: true, name: true, role: true } } },
    });

    return NextResponse.json({ data: updated });
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
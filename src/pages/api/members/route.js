// app/api/members/route.js
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const members = await prisma.user.findMany({
      where: { role: { not: "admin" } },
      select: {
        id: true,
        name: true,
        email: true,
        position: true,
        role: true,
        profile: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      members: members,
    }, { status: 200 });

  } catch (error) {
    console.error("❌ GET members error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { name, email, password, position, profile } = await request.json();

    if (!name || !email || !password || !position) {
      return NextResponse.json(
        { success: false, message: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: emailLower },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newMember = await prisma.user.create({
      data: {
        name: name.trim(),
        email: emailLower,
        password: hashedPassword,
        position: position, // Simpan position
        role: "member",
        profile: profile || null,
        isVerified: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Member berhasil ditambahkan dengan posisi: ${position}`,
      member: {
        id: newMember.id,
        name: newMember.name,
        email: newMember.email,
        position: newMember.position,
        role: newMember.role,
        profile: newMember.profile,
      },
    }, { status: 201 });

  } catch (error) {
    console.error("❌ POST member error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID member diperlukan" },
        { status: 400 }
      );
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Member berhasil dihapus",
    }, { status: 200 });

  } catch (error) {
    console.error("❌ DELETE member error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
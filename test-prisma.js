const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const where = { targetRole: 'QA' };
    const page = 1;
    const limit = 10;
    const [reports, total] = await Promise.all([
      prisma.revisionReport.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        include: {
          sentBy: { select: { id: true, name: true, role: true } },
          _count: { select: { comments: true } },
        },
      }),
      prisma.revisionReport.count({ where }),
    ]);
    console.log("Success:", { total, reports: reports.length });
  } catch (e) {
    console.error("Prisma Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}
main();

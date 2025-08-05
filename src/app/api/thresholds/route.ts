import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // ปรับ path ตามโครงสร้างโปรเจกต์

export async function GET() {
  const thresholds = await prisma.thresholds.findMany();
  return NextResponse.json(thresholds);
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const { partNumber, standard, limitHigh, limitLow } = data;
  try {
    const newThreshold = await prisma.thresholds.create({
      data: {
        partNumber,
        standard,
        limitHigh,
        limitLow,
      },
    });
    return NextResponse.json(newThreshold);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  const data = await request.json();
  const { id, partNumber, standard, limitHigh, limitLow } = data;
  try {
    const updated = await prisma.thresholds.update({
      where: { id },
      data: { partNumber, standard, limitHigh, limitLow },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get('id'));
  try {
    await prisma.thresholds.delete({ where: { id } });
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

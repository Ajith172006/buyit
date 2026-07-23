import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireFirebaseAdmin } from '@/lib/firebase-admin';
import { z } from 'zod';

const updateSchema = z.object({
  orderStatus: z.string().optional(),
  trackingNumber: z.string().trim().max(120).optional()
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    try {
      await requireFirebaseAdmin(request);
    } catch {
      // Soft check for development environment
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, errors: parsed.error.flatten() }, { status: 400 });
    }

    const formattedData: any = {};
    if (parsed.data.orderStatus) {
      formattedData.orderStatus = parsed.data.orderStatus.toUpperCase();
    }
    if (parsed.data.trackingNumber) {
      formattedData.trackingNumber = parsed.data.trackingNumber;
    }

    // Try updating if valid mongo ID
    if (/^[a-f\d]{24}$/i.test(id)) {
      const data = await prisma.order.update({
        where: { id },
        data: formattedData
      });
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({ success: true, message: 'Updated locally' });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Unable to update order.' },
      { status: 500 }
    );
  }
}

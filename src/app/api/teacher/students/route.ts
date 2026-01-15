import { connectDB } from '@/lib/mongodb';
import { Student } from '@/lib/auth-models';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('authToken')?.value || request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || (decoded as any).role !== 'teacher') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const students = await Student.find({ teacher: (decoded as any).userId }).select(
      'name email studentId class section semester performance completedQuests'
    );

    return NextResponse.json({
      success: true,
      students,
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

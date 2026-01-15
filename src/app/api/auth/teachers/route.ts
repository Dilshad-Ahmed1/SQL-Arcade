import { connectDB } from '@/lib/mongodb';
import { Teacher } from '@/lib/auth-models';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const teachers = await Teacher.find({}, { password: 0 }).select('name teacherId email institution');

    return NextResponse.json({
      success: true,
      teachers,
    });
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

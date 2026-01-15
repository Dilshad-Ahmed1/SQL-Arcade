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

    const students = await Student.find({ teacher: (decoded as any).userId });

    // Calculate analytics
    let totalQuestsSolved = 0;
    const difficultyStats = {
      beginner: { total: 0, count: 0 },
      intermediate: { total: 0, count: 0 },
      advanced: { total: 0, count: 0 },
    };

    students.forEach((student) => {
      totalQuestsSolved += student.performance.totalQuestsSolved;
      difficultyStats.beginner.total += student.performance.questsSolvedByDifficulty.beginner;
      difficultyStats.beginner.count++;
      difficultyStats.intermediate.total += student.performance.questsSolvedByDifficulty.intermediate;
      difficultyStats.intermediate.count++;
      difficultyStats.advanced.total += student.performance.questsSolvedByDifficulty.advanced;
      difficultyStats.advanced.count++;
    });

    const analytics = {
      totalStudents: students.length,
      totalQuestsSolvedByAll: totalQuestsSolved,
      averageQuestsSolvedPerStudent: students.length > 0 ? totalQuestsSolved / students.length : 0,
      avgQuestsByDifficulty: {
        beginner: students.length > 0 ? difficultyStats.beginner.total / students.length : 0,
        intermediate: students.length > 0 ? difficultyStats.intermediate.total / students.length : 0,
        advanced: students.length > 0 ? difficultyStats.advanced.total / students.length : 0,
      },
    };

    return NextResponse.json({
      success: true,
      analytics,
    });
  } catch (error) {
    console.error('Error calculating analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

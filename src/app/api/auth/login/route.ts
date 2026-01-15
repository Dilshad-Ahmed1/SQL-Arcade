import { connectDB } from '@/lib/mongodb';
import { Teacher, Student } from '@/lib/auth-models';
import { hashPassword, comparePasswords, generateToken } from '@/lib/auth-utils';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json();

    if (!email || !password || !role) {
      return NextResponse.json(
        { error: 'Email, password, and role are required' },
        { status: 400 }
      );
    }

    await connectDB();

    let user;
    if (role === 'teacher') {
      user = await Teacher.findOne({ email: email.toLowerCase() });
    } else if (role === 'student') {
      user = await Student.findOne({ email: email.toLowerCase() });
    } else {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found. Please sign up first.' },
        { status: 401 }
      );
    }

    const passwordMatch = await comparePasswords(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    const token = generateToken(user._id.toString(), user.email, role);

    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role,
        ...(role === 'teacher' && { teacherId: user.teacherId }),
        ...(role === 'student' && { studentId: user.studentId, teacherId: user.teacherId }),
      },
    });

    response.cookies.set('authToken', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

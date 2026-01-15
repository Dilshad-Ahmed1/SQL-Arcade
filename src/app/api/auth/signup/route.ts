import { connectDB } from '@/lib/mongodb';
import { Teacher, Student } from '@/lib/auth-models';
import { hashPassword, generateToken } from '@/lib/auth-utils';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role, teacherId, class: userClass, section, semester } = await request.json();

    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'Email, password, name, and role are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = role === 'teacher'
      ? await Teacher.findOne({ email: email.toLowerCase() })
      : await Student.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    let user;
    if (role === 'teacher') {
      user = new Teacher({
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        class: userClass,
        section,
        semester,
      });
    } else if (role === 'student') {
      if (!teacherId) {
        return NextResponse.json(
          { error: 'Teacher ID is required for students' },
          { status: 400 }
        );
      }

      // Verify teacher exists
      const teacher = await Teacher.findOne({ teacherId });
      if (!teacher) {
        return NextResponse.json(
          { error: 'Teacher not found with this ID' },
          { status: 404 }
        );
      }

      user = new Student({
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        teacherId,
        teacher: teacher._id,
        class: userClass,
        section,
        semester,
      });

      // Add student to teacher's students list
      await Teacher.findByIdAndUpdate(
        teacher._id,
        { $push: { students: user._id } },
        { new: true }
      );
    } else {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    await user.save();

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
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

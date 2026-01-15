import mongoose from 'mongoose';

// Teacher Schema
const teacherSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    teacherId: {
      type: String,
      unique: true,
      default: () => 'T' + Date.now() + Math.random().toString(36).substr(2, 9),
    },
    class: String,
    section: String,
    semester: String,
    subject: String,
    department: String,
    institution: String,
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Student Schema
const studentSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    studentId: {
      type: String,
      unique: true,
      default: () => 'S' + Date.now() + Math.random().toString(36).substr(2, 9),
    },
    rollNumber: String,
    class: String,
    section: String,
    semester: String,
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },
    teacherId: {
      type: String,
      required: true,
    },
    performance: {
      totalQuestsSolved: {
        type: Number,
        default: 0,
      },
      questsSolvedByDifficulty: {
        beginner: {
          type: Number,
          default: 0,
        },
        intermediate: {
          type: Number,
          default: 0,
        },
        advanced: {
          type: Number,
          default: 0,
        },
      },
      averageCompletionTime: Number,
      totalTimeSolving: {
        type: Number,
        default: 0,
      },
    },
    completedQuests: [
      {
        questId: String,
        questTitle: String,
        difficulty: String,
        completedAt: Date,
        timeTaken: Number, // in seconds
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Teacher = mongoose.models.Teacher || mongoose.model('Teacher', teacherSchema);
export const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);

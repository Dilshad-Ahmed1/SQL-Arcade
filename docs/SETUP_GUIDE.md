# SQLArcade Authentication & Teacher Dashboard Setup Guide

## Overview
This guide will help you set up the authentication system and teacher dashboard for SQLArcade.

---

## Part 1: MongoDB Setup

### Option A: MongoDB Atlas (Cloud) - RECOMMENDED for Production

**Steps:**

1. **Create MongoDB Atlas Account**
   - Visit https://www.mongodb.com/cloud/atlas
   - Sign up with your email
   - Create a free account (includes 512 MB storage)

2. **Create a Cluster**
   - Click "Build a Database"
   - Select the free tier (M0)
   - Choose your preferred cloud provider and region (closest to your users)
   - Click "Create Cluster" and wait 3-5 minutes

3. **Create Database User**
   - In the Atlas dashboard, click "Database Access"
   - Click "Add New Database User"
   - Create a username and password (save these!)
   - Choose "Atlas admin" role
   - Click "Add User"

4. **Whitelist IP Address**
   - Click "Network Access"
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" for development (0.0.0.0/0)
   - For production, add specific IP addresses only

5. **Get Connection String**
   - Click "Connect" on your cluster
   - Select "Connect your application"
   - Choose "Node.js" driver
   - Copy the connection string
   - It should look like: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority`

6. **Update Environment Variables**
   - Copy `.env.example` to `.env.local`
   - Replace the MONGODB_URI with your connection string
   - Replace `<username>` and `<password>` with your database user credentials
   - Replace `<dbname>` with `sqlarcade` (or your preferred name)

### Option B: Local MongoDB Installation

**For Development/Testing:**

1. **Install MongoDB Community Edition**
   - Windows: Download from https://www.mongodb.com/try/download/community
   - Run the installer and follow prompts
   - Choose "Install MongoDB as a Service"

2. **Verify Installation**
   - Open PowerShell and run: `mongosh`
   - You should see a MongoDB shell prompt

3. **Update .env.local**
   ```
   MONGODB_URI=mongodb://localhost:27017/sqlarcade
   ```

4. **Start MongoDB Service**
   - MongoDB should auto-start, but you can manually start it:
   ```powershell
   net start MongoDB
   ```

---

## Part 2: Environment Variables

1. **Copy the template file**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local` with your values:**
   ```env
   # MongoDB Configuration
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sqlarcade?retryWrites=true&w=majority
   
   # JWT Secret (use a random string)
   JWT_SECRET=your-very-secret-random-string-here
   
   # MySQL Configuration (existing)
   MYSQL_HOST=localhost
   MYSQL_USER=root
   MYSQL_PASSWORD=your-mysql-password
   ```

3. **Generate a random JWT_SECRET**
   - Run in PowerShell:
   ```powershell
   -join ([char[]]'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' | Get-Random -Count 32)
   ```

---

## Part 3: Install Dependencies

1. **Update package.json**
   - Run in your project directory:
   ```bash
   npm install
   ```

2. **New packages installed:**
   - `mongoose` - MongoDB ODM
   - `bcrypt` - Password hashing
   - `jsonwebtoken` - JWT token generation
   - `next-auth` - Authentication framework

---

## Part 4: Database Schema

The system creates two main collections automatically:

### Teachers Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  teacherId: String (unique),
  class: String,
  section: String,
  semester: String,
  subject: String,
  department: String,
  institution: String,
  students: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Students Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  studentId: String (unique),
  rollNumber: String,
  class: String,
  section: String,
  semester: String,
  teacher: ObjectId,
  teacherId: String,
  performance: {
    totalQuestsSolved: Number,
    questsSolvedByDifficulty: {
      beginner: Number,
      intermediate: Number,
      advanced: Number
    },
    averageCompletionTime: Number,
    totalTimeSolving: Number
  },
  completedQuests: [{
    questId: String,
    questTitle: String,
    difficulty: String,
    completedAt: Date,
    timeTaken: Number
  }],
  createdAt: Date,
  updatedAt: Date
}
```

---

## Part 5: Running the Application

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Access the application:**
   - Open http://localhost:9002
   - You'll be redirected to the home page
   - Click "Sign up" to create your first account

---

## Part 6: User Flow

### For Teachers:
1. **Sign up**: Click "Sign up" → Select "Teacher" → Fill in details
2. **Login**: Use your email and password to log in
3. **Dashboard**: View your assigned students, their performance metrics, and analytics
4. **Share Teacher ID**: Give your Teacher ID to students so they can register

### For Students:
1. **Sign up**: Click "Sign up" → Select "Student" → Enter your details
2. **Select Teacher**: Choose your teacher from the dropdown (uses Teacher ID)
3. **Complete quests**: Solve SQL quests on the main platform
4. **Performance tracking**: Your teacher can see your progress in real-time

---

## Part 7: API Endpoints

### Authentication Endpoints
- **POST /api/auth/signup** - Create new account
- **POST /api/auth/login** - User login
- **GET /api/auth/teachers** - Get list of all teachers

### Teacher Endpoints (Protected)
- **GET /api/teacher/students** - Get assigned students
- **GET /api/teacher/analytics** - Get class analytics

### Student Endpoints (Protected)
- **POST /api/student/performance** - Update quest completion
- **GET /api/student/performance** - Get student's progress

---

## Part 8: Features Implemented

### Authentication
✅ Teacher and Student sign up
✅ Email-based login
✅ Password hashing with bcrypt
✅ JWT token-based session management
✅ Role-based access control

### Teacher Dashboard
✅ View assigned students
✅ Performance analytics by difficulty level
✅ Student progress comparison charts
✅ Average statistics across all students
✅ Teacher ID sharing feature

### Student Features
✅ Register with teacher ID
✅ Quest completion tracking
✅ Performance metrics storage
✅ Real-time synchronization

### UI/UX
✅ Beautiful gradient backgrounds
✅ Responsive design
✅ Interactive charts and analytics
✅ Colorful badges and cards
✅ User-friendly forms

---

## Part 9: Troubleshooting

### MongoDB Connection Issues
- **Error: "connection refused"**
  - Check if MongoDB is running: `net start MongoDB`
  - Verify MONGODB_URI in .env.local

- **Error: "authentication failed"**
  - Check username and password
  - Ensure database user has correct permissions
  - Whitelist your IP in MongoDB Atlas

### Authentication Issues
- **Token errors**: Clear localStorage and log in again
- **404 on API routes**: Ensure API files are in `/src/app/api/` directory
- **CORS errors**: Add headers to API routes if calling from frontend

### Performance Issues
- **Slow MongoDB queries**: Add indexes to frequently queried fields
- **Memory leaks**: Ensure database connections are properly closed
- **Timeout errors**: Increase timeout values in production

---

## Part 10: Security Best Practices

1. **Change JWT_SECRET in production**
   ```env
   JWT_SECRET=generate-a-cryptographically-secure-random-string
   ```

2. **Use MongoDB Atlas with:**
   - Specific IP whitelisting (not 0.0.0.0/0)
   - Strong passwords
   - SSL/TLS encryption

3. **Environment Variables**
   - Never commit `.env.local` to git
   - Use `.env.example` as template only
   - Add `.env.local` to `.gitignore`

4. **HTTPS**
   - Use HTTPS in production
   - Set secure cookie flags

5. **Rate Limiting**
   - Implement rate limiting on login endpoint
   - Add CAPTCHA for repeated failed attempts

---

## Next Steps

1. **Deploy to Production:**
   - Use MongoDB Atlas (not local)
   - Deploy Next.js app to Vercel, Netlify, or your server
   - Update environment variables for production

2. **Extend Features:**
   - Add email verification
   - Implement password reset
   - Add student achievement badges
   - Create custom quests for specific teachers
   - Add progress reports export

3. **Monitoring:**
   - Set up error logging (Sentry, LogRocket)
   - Monitor database performance
   - Track user engagement metrics

---

## Support

For issues or questions:
1. Check MongoDB documentation: https://docs.mongodb.com/
2. Review Next.js documentation: https://nextjs.org/docs
3. Check Mongoose documentation: https://mongoosejs.com/docs/

---

**Setup Complete!** 🎉

Your SQLArcade platform is now ready with authentication and analytics.
Start by signing up as a teacher and inviting your students!

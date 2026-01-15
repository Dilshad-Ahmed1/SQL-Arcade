# MongoDB Setup - Step by Step Guide

## ✅ Choose Your Setup Method

### Method 1: MongoDB Atlas (Cloud) - RECOMMENDED ⭐

Best for: Production, learning, no local setup needed

**Advantages:**
- Free tier includes 512MB storage
- No server maintenance
- Automatic backups
- Easy scaling
- Access from anywhere
- Best for deployment

**Disadvantages:**
- Requires internet connection
- Rate-limited free tier

---

## 🌐 Option 1: MongoDB Atlas Setup (Cloud)

### Step 1: Create Atlas Account

1. **Visit MongoDB Atlas**
   - Go to https://www.mongodb.com/cloud/atlas
   - Click "Try Free"

2. **Sign Up**
   - Enter your email
   - Create a password (at least 8 characters)
   - Click "Sign Up"
   - Verify your email address

3. **Create Organization**
   - Enter organization name (e.g., "SQLArcade")
   - Click "Create Organization"

### Step 2: Create a Project

1. **New Project**
   - Click "New Project"
   - Name it "SQLArcade" (or your choice)
   - Click "Create Project"

### Step 3: Create a Cluster

1. **Build a Database**
   - Click "Build a Database"
   - Click on "Free" tier (M0)

2. **Choose Cloud Provider**
   - Select your provider (AWS/Google Cloud/Azure)
   - Choose the region closest to you
   - Click "Create Cluster"
   - Wait 3-5 minutes for setup

### Step 4: Create Database User

1. **In the Atlas Dashboard**
   - Click "Database Access" (left sidebar)
   - Click "Add New Database User"

2. **Create User**
   - **Authentication Method**: Password
   - **Username**: `sqlarcade_user` (or your choice)
   - **Password**: Generate secure password or enter custom
   - **Copy the password** and save it somewhere safe!

3. **Set Permissions**
   - Select Role: **Atlas Admin** (for development)
   - Click "Add User"

### Step 5: Whitelist IP Address

1. **Network Access**
   - Click "Network Access" (left sidebar)
   - Click "Add IP Address"

2. **Choose Options**
   - **For Development**: Select "Allow Access from Anywhere"
     - IP: 0.0.0.0/0
     - Click "Confirm"
   
   - **For Production**: Add specific IPs only
     - Click "Add IP Address"
     - Enter your server IP
     - Click "Confirm"

### Step 6: Get Connection String

1. **Connect to Cluster**
   - Click "Clusters" in left sidebar
   - Click "Connect" on your cluster

2. **Connection Method**
   - Select "Connect your application"
   - Driver: Node.js
   - Version: 4.x or higher

3. **Copy Connection String**
   - You'll see a string like:
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
   ```

4. **Replace Placeholders**
   ```
   mongodb+srv://sqlarcade_user:YOUR_PASSWORD@cluster0.mongodb.net/sqlarcade?retryWrites=true&w=majority
   ```
   - `<username>` → `sqlarcade_user`
   - `<password>` → Your password (URL encode special chars)
   - `<cluster>` → Your cluster name (e.g., cluster0)
   - `<dbname>` → `sqlarcade`

### Step 7: Update Environment Variables

1. **Open `.env.local`** in your project:
   ```bash
   MONGODB_URI=mongodb+srv://sqlarcade_user:your-password@cluster0.mongodb.net/sqlarcade?retryWrites=true&w=majority
   JWT_SECRET=your-random-secret-key
   ```

2. **URL Encode Special Characters**
   - If password has special chars, encode them:
   - `@` → `%40`
   - `!` → `%21`
   - `#` → `%23`
   - Example: `pass@word` → `pass%40word`

3. **Save the file**

✅ **MongoDB Atlas is now ready!**

---

## 💻 Option 2: Local MongoDB Installation

Best for: Development, testing, offline work

**Advantages:**
- No internet needed
- Faster for local development
- Full control

**Disadvantages:**
- Requires local installation
- Only accessible locally
- Manual backup management

### Step 1: Download MongoDB

1. **Visit MongoDB Download**
   - Go to https://www.mongodb.com/try/download/community
   - Operating System: **Windows** (select your version)
   - Version: Latest stable (e.g., 7.0.x)
   - Download: **MSI (MongoDB Installer)**

2. **Download the file** (usually ~500MB)

### Step 2: Install MongoDB

1. **Run the Installer**
   - Double-click the `.msi` file
   - Click "Next"

2. **Installation Type**
   - Select "Complete"
   - Click "Next"

3. **Service Configuration**
   - ✅ Check "Install MongoDB as a Windows Service"
   - Service Name: `MongoDB`
   - Click "Next"

4. **MongoDB Compass** (Optional)
   - ✅ Check "Install MongoDB Compass"
   - This is a GUI for managing databases
   - Click "Next"

5. **Install**
   - Click "Install"
   - Wait for completion
   - Click "Finish"

### Step 3: Verify Installation

1. **Open PowerShell** as Administrator
   - Click Windows Start
   - Type "PowerShell"
   - Right-click "Windows PowerShell"
   - Click "Run as administrator"

2. **Check MongoDB Status**
   ```powershell
   Get-Service MongoDB
   ```
   - You should see: `Running`

3. **Start MongoDB Service** (if not running)
   ```powershell
   Start-Service MongoDB
   ```

### Step 4: Connect to MongoDB

1. **Open MongoDB Shell**
   ```powershell
   mongosh
   ```
   - You'll see: `test>`
   - This means you're connected!

2. **Create Database**
   ```javascript
   use sqlarcade
   ```

3. **Exit Shell**
   ```javascript
   exit
   ```

### Step 5: Update Environment Variables

1. **Open `.env.local`**:
   ```env
   MONGODB_URI=mongodb://localhost:27017/sqlarcade
   JWT_SECRET=your-random-secret-key
   ```

2. **Save the file**

✅ **Local MongoDB is now ready!**

---

## 🔧 Using MongoDB Compass (Optional)

MongoDB Compass is a GUI tool to manage your databases visually.

### For Local MongoDB:

1. **Open MongoDB Compass**
   - Should be installed automatically
   - Search for "MongoDB Compass" in Windows

2. **Connect**
   - Connection String: `mongodb://localhost:27017`
   - Click "Connect"

3. **Create Database**
   - Click "Create Database"
   - Database: `sqlarcade`
   - Collection: `teachers`
   - Click "Create Database"

4. **View Data**
   - You'll see teachers, students, and other collections
   - Double-click to explore

### For MongoDB Atlas:

1. **In MongoDB Compass**
   - Click "New Connection"
   - Select "Advanced Connection String"
   - Paste your Atlas connection string
   - Click "Connect"

2. **Explore Data**
   - All databases appear in the left panel
   - Click collections to view documents

---

## ✅ Testing Your MongoDB Connection

### Method 1: Using Node.js

1. **Create test file: `test-mongo.js`**
   ```javascript
   const mongoose = require('mongoose');
   
   const MONGODB_URI = 'mongodb+srv://sqlarcade_user:password@cluster0.mongodb.net/sqlarcade?retryWrites=true&w=majority';
   
   mongoose.connect(MONGODB_URI)
     .then(() => {
       console.log('✅ MongoDB connected successfully!');
       mongoose.connection.close();
       process.exit(0);
     })
     .catch(err => {
       console.log('❌ Connection failed:', err.message);
       process.exit(1);
     });
   ```

2. **Run the test**
   ```bash
   node test-mongo.js
   ```

3. **Expected output**
   ```
   ✅ MongoDB connected successfully!
   ```

### Method 2: Using MongoDB Shell

1. **Connect with Atlas**
   ```powershell
   mongosh "mongodb+srv://sqlarcade_user:password@cluster0.mongodb.net/sqlarcade"
   ```

2. **Or Local**
   ```powershell
   mongosh mongodb://localhost:27017/sqlarcade
   ```

3. **Verify with commands**
   ```javascript
   db
   // Returns: "sqlarcade"
   
   show collections
   // Shows all collections
   
   exit
   ```

---

## 🐛 Common Connection Issues & Fixes

| Issue | Cause | Solution |
|-------|-------|----------|
| `connect ECONNREFUSED` | MongoDB not running | Start service: `net start MongoDB` |
| `authentication failed` | Wrong password | Check credentials in connection string |
| `IP not whitelisted` | Atlas IP restriction | Add IP in Network Access settings |
| `name resolution failed` | Typo in host | Check cluster name spelling |
| `ENOTFOUND` | No internet (Atlas only) | Check internet connection |

### Fix MongoDB Connection Issues:

**Local MongoDB:**
```powershell
# Check if running
Get-Service MongoDB

# Start service
Start-Service MongoDB

# Restart service
Restart-Service MongoDB

# Stop service
Stop-Service MongoDB
```

**Atlas Connection:**
```
1. Check MONGODB_URI in .env.local
2. Verify username and password
3. Check IP whitelisting
4. Test connection string in mongosh
5. Check internet connection
```

---

## 🔒 Security Best Practices

### For Development:
```env
MONGODB_URI=mongodb://localhost:27017/sqlarcade
# Local only - no password needed
```

### For Production (Atlas):
```env
MONGODB_URI=mongodb+srv://username:strong-password@cluster.mongodb.net/sqlarcade
# Always use strong passwords
# Use MongoDB Atlas with:
# ✅ Strong, random password
# ✅ Specific IP whitelisting (not 0.0.0.0/0)
# ✅ IP rotation when needed
# ✅ Regular password changes
```

### Password Security:
- ✅ Use strong passwords (12+ characters)
- ✅ Include uppercase, lowercase, numbers, symbols
- ✅ Never commit credentials to git
- ✅ Use `.env.local` and `.gitignore`
- ✅ Rotate passwords periodically

---

## 📊 Checking Your Database

### View All Collections:
```javascript
db.getCollectionNames()
// Output: ['teachers', 'students']
```

### Count Documents:
```javascript
db.teachers.countDocuments()
// Shows number of teachers
```

### View Sample Data:
```javascript
db.teachers.findOne()
// Shows first teacher document
```

### View All Students:
```javascript
db.students.find().pretty()
// Shows all students with formatting
```

---

## 🚀 Next Steps After Setup

1. **Run your application**
   ```bash
   npm install
   npm run dev
   ```

2. **Test authentication**
   - Go to http://localhost:9002/signup
   - Create a teacher account
   - Verify in MongoDB

3. **Monitor your database**
   - Use MongoDB Compass
   - Or Atlas dashboard

4. **Check logs**
   - Watch server output in terminal
   - Check browser console

---

## 📞 Troubleshooting Commands

### Test MongoDB Connection:
```powershell
# Test local connection
mongosh mongodb://localhost:27017/sqlarcade

# Test Atlas connection
mongosh "mongodb+srv://username:password@cluster.mongodb.net/sqlarcade"
```

### Check Service Status:
```powershell
Get-Service MongoDB | Select Status
```

### View Logs:
```powershell
# Check Windows Event Viewer
eventvwr
# Look for MongoDB events
```

---

## 📚 Additional Resources

- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **MongoDB Community**: https://www.mongodb.com/try/download/community
- **Mongoose Docs**: https://mongoosejs.com/docs/
- **Connection String**: https://docs.mongodb.com/drivers/node/
- **Compass Guide**: https://docs.mongodb.com/compass/

---

## ✨ Congratulations!

You've successfully set up MongoDB for SQLArcade!

**What's Next:**
1. ✅ Install dependencies: `npm install`
2. ✅ Start app: `npm run dev`
3. ✅ Sign up at http://localhost:9002/signup
4. ✅ Invite students with your Teacher ID
5. ✅ Watch real-time analytics

**Happy learning!** 🚀

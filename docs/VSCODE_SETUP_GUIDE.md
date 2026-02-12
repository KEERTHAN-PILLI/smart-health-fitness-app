# VS Code Setup Guide - Complete Installation & Configuration

## Your Supabase Project Credentials

**Project Name:** smart-health-fitness
**Project URL:** https://uendtfofpeoknlakoptn.supabase.co
**Publishable Key:** sb_publishable_i$3bVqoYrKUCpImGr8XfjA_Xh0wxDh5
**Database Password:** [Auto-generated during setup]

⚠️ **IMPORTANT:** Save your Supabase URL and Keys securely. Never commit them to git!

---

## Step 1: Install Node.js and npm

Check if Node.js is installed:
```bash
node --version
npm --version
```

If not installed, download from: https://nodejs.org/ (LTS version recommended)

---

## Step 2: Clone the Repository

```bash
# Navigate to your desired folder
cd /path/to/your/projects

# Clone the repository
git clone https://github.com/KEERTHAN-PILLI/smart-health-fitness-app.git

# Navigate to project
cd smart-health-fitness-app
```

---

## Step 3: Backend Setup (Express + Node.js)

### 3.1 Navigate to Backend Directory
```bash
cd backend
```

### 3.2 Install Dependencies
```bash
npm install
```

### 3.3 Install Additional Supabase Packages
```bash
npm install @supabase/supabase-js bcrypt jsonwebtoken nodemailer
```

### 3.4 Create .env File
```bash
# Create .env file
echo "" > .env
```

Now open `.env` in VS Code and add:
```env
# Supabase Configuration
SUPABASE_URL=https://uendtfofpeoknlakoptn.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# JWT Configuration
JWT_SECRET=your-32-character-secret-key-here-minimum
JWT_EXPIRY=1d

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 3.5 Test Backend
```bash
npm run dev
```

You should see: `Server running on port 5000`

To stop the server: Press `Ctrl + C`

---

## Step 4: Frontend Setup (React + Vite)

### 4.1 Navigate to Frontend Directory (Open NEW Terminal)
```bash
cd frontend
```

### 4.2 Install Dependencies
```bash
npm install
```

### 4.3 Install Supabase Package
```bash
npm install @supabase/supabase-js
```

### 4.4 Create .env File
```bash
# Create .env file
echo "" > .env
```

Add to `.env`:
```env
VITE_SUPABASE_URL=https://uendtfofpeoknlakoptn.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_i$3bVqoYrKUCpImGr8XfjA_Xh0wxDh5
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Smart Health Fitness
```

### 4.5 Test Frontend
```bash
npm run dev
```

You should see output with: `http://localhost:5173`

Open this URL in your browser to see your app!

To stop: Press `Ctrl + C`

---

## Step 5: Open Project in VS Code

### 5.1 Open VS Code
```bash
# From project root
code .
```

Or:
- Open VS Code
- File > Open Folder
- Select your `smart-health-fitness-app` folder

### 5.2 Recommended VS Code Extensions

Install these extensions in VS Code:

1. **ES7+ React/Redux/React-Native snippets**
   - Search: "ES7+ React/Redux/React-Native snippets"
   - Author: dsznajder.es7-react-js-snippets

2. **Prettier - Code formatter**
   - Search: "Prettier - Code formatter"
   - Auto-format code on save

3. **ESLint**
   - Search: "ESLint"
   - Find errors in your code

4. **Thunder Client** (for API testing)
   - Search: "Thunder Client"
   - Test your API endpoints

5. **Supabase**
   - Search: "Supabase"
   - Official Supabase extension

To install extensions:
- Press `Ctrl + Shift + X` (Extensions sidebar)
- Search for extension name
- Click "Install"

### 5.3 Configure VS Code Settings

Press `Ctrl + ,` to open Settings, then search for and enable:

- **Format On Save**: Enable
- **Default Formatter**: Choose "Prettier"
- **Tab Size**: Set to 2

---

## Step 6: Running Both Frontend & Backend Simultaneously

### Option A: Using VS Code Terminals

1. Open terminal: `Ctrl + `"`
2. Split terminal: Click the split icon
3. In first terminal (Backend):
   ```bash
   cd backend
   npm run dev
   ```
4. In second terminal (Frontend):
   ```bash
   cd frontend
   npm run dev
   ```

### Option B: Using Separate Command Prompts

**Terminal 1:**
```bash
cd backend
npm run dev
```

**Terminal 2:**
```bash
cd frontend
npm run dev
```

---

## Step 7: Configure Supabase Database

### 7.1 Go to Supabase Dashboard

https://app.supabase.com → Select your project

### 7.2 Open SQL Editor

Go to: SQL Editor (left sidebar)

### 7.3 Run This SQL Query

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  reset_code VARCHAR(6),
  reset_code_expiry BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (auth.uid()::text = id::text);
```

Click "Run" to execute the query.

---

## Step 8: Test the Application

### 8.1 Backend Test

Use Thunder Client (in VS Code) or Postman:

**Test forgot password:**
- Method: POST
- URL: `http://localhost:5000/auth/forgot-password`
- Body (JSON):
  ```json
  {
    "email": "test@example.com"
  }
  ```

### 8.2 Frontend Test

1. Open: `http://localhost:5173`
2. Navigate to: `/forgot-password`
3. Test the 3-step password reset flow

---

## Useful Commands Cheat Sheet

```bash
# Check Node.js version
node -v

# Check npm version
npm -v

# Install all dependencies (backend)
cd backend && npm install

# Install all dependencies (frontend)
cd frontend && npm install

# Start backend dev server
cd backend && npm run dev

# Start frontend dev server
cd frontend && npm run dev

# Build frontend for production
cd frontend && npm run build

# Clear npm cache (if having issues)
npm cache clean --force

# Update all packages
npm update

# Check for outdated packages
npm outdated
```

---

## Troubleshooting

### Problem: Port 5000 already in use
**Solution:**
```bash
# Linux/Mac: Find process using port 5000
lsof -i :5000
# Kill it
kill -9 <PID>

# Windows: Find process using port 5000
netstat -ano | findstr :5000
# Kill it
taskkill /PID <PID> /F
```

### Problem: npm install fails
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Problem: Cannot find module
**Solution:**
```bash
# Make sure you're in correct directory
cd backend  # or frontend

# Reinstall dependencies
npm install
```

### Problem: Supabase connection fails
**Solution:**
- Verify SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env
- Check internet connection
- Verify project isn't paused in Supabase dashboard

---

## File Structure After Setup

```
smart-health-fitness-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── supabase.js
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.js
│   ├── .env (CREATED BY YOU)
│   ├── package.json
│   └── node_modules/ (auto-generated)
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── api/
│   │   └── styles/
│   ├── .env (CREATED BY YOU)
│   ├── package.json
│   ├── vite.config.js
│   └── node_modules/ (auto-generated)
│
└── docs/
    ├── SUPABASE_FORGOT_PASSWORD_SETUP.md
    ├── ENV_SETUP.md
    ├── IMPLEMENTATION_SUMMARY.md
    └── VSCODE_SETUP_GUIDE.md (THIS FILE)
```

---

## Next Steps

1. ✅ Set up Supabase project (DONE)
2. ✅ Clone repository (NEXT)
3. ✅ Install backend dependencies
4. ✅ Install frontend dependencies
5. ✅ Create .env files
6. ✅ Open in VS Code
7. ✅ Run backend and frontend
8. ✅ Test the application
9. Deploy to production

---

## Need Help?

Check these documentation files:
- `SUPABASE_FORGOT_PASSWORD_SETUP.md` - Detailed Supabase setup
- `ENV_SETUP.md` - Environment variables guide
- `IMPLEMENTATION_SUMMARY.md` - Feature implementation details

Good luck with your Smart Health Fitness app! 🚀

# Environment Setup Guide for Supabase + Forgot Password

This guide covers setting up all required environment variables for the forgot password feature with Supabase integration.

## Backend Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
# ============================================
# SUPABASE CONFIGURATION
# ============================================

# Supabase Project URL
# Get this from: Supabase Dashboard > Project Settings > API
SUPABASE_URL=https://your-project.supabase.co

# Supabase Anon Key (for client-side operations)
# Get this from: Supabase Dashboard > Project Settings > API
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase Service Role Key (for server-side operations - KEEP SECRET!)
# Get this from: Supabase Dashboard > Project Settings > API
# WARNING: Never share this key or commit it to git
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ============================================
# DATABASE CONFIGURATION
# ============================================

# MySQL Database URL (if using traditional DB alongside Supabase)
# Format: mysql://username:password@host:port/database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=your_password
DB_NAME=fitness_db

# ============================================
# EMAIL CONFIGURATION
# ============================================

# Option 1: Gmail SMTP Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
# Get App Password from: Google Account > Security > App Passwords
# Enable 2FA first if not already enabled

# Option 2: Resend Email Service
# Sign up at https://resend.com
RESEND_API_KEY=re_abc123def456...

# Option 3: SendGrid Email Service
# Sign up at https://sendgrid.com
SENDGRID_API_KEY=SG.abc123def456...
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# ============================================
# JWT CONFIGURATION
# ============================================

# Secret key for JWT token signing (generate a strong random key)
# Generate using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your-super-secret-jwt-key-here-min-32-chars

# JWT token expiry time
JWT_EXPIRY=1d

# ============================================
# SERVER CONFIGURATION
# ============================================

# Port number for the Express server
PORT=5000

# Environment: development, staging, production
NODE_ENV=development

# ============================================
# CORS CONFIGURATION
# ============================================

# Frontend URL for CORS (in production, use your actual domain)
CLIENT_URL=http://localhost:5173
CLIENT_URL_PROD=https://yourdomain.com

# ============================================
# OPTIONAL: RATE LIMITING
# ============================================

# Rate limit window in milliseconds
RATE_LIMIT_WINDOW_MS=900000

# Maximum requests per window
RATE_LIMIT_MAX_REQUESTS=5
```

## Frontend Environment Variables

Create a `.env` file in the `frontend/` directory with the following variables:

```env
# ============================================
# SUPABASE CONFIGURATION (Client-side)
# ============================================

# Supabase Project URL
VITE_SUPABASE_URL=https://your-project.supabase.co

# Supabase Anon Key (safe to expose in browser)
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ============================================
# API CONFIGURATION
# ============================================

# Backend API URL
VITE_API_URL=http://localhost:5000

# Backend API URL for production
VITE_API_URL_PROD=https://api.yourdomain.com

# ============================================
# APP CONFIGURATION
# ============================================

# App name (used in emails, etc.)
VITE_APP_NAME=Smart Health Fitness

# App environment
VITE_ENV=development
```

## Step-by-Step Setup Instructions

### Step 1: Get Supabase Credentials

1. Log in to [Supabase Console](https://app.supabase.com)
2. Select your project (or create a new one)
3. Go to **Project Settings** > **API**
4. Copy the following:
   - **Project URL** → `SUPABASE_URL`
   - **Anon public key** → `SUPABASE_ANON_KEY` and `VITE_SUPABASE_ANON_KEY`
   - **Service role key** → `SUPABASE_SERVICE_ROLE_KEY` (Backend only)

### Step 2: Setup Gmail SMTP (Recommended)

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable "2-Step Verification" if not already enabled
3. Go to "App passwords" and select "Mail" and "Windows Computer"
4. Google will generate a 16-character password
5. Use this as your `EMAIL_PASS`
6. Set `EMAIL_USER` to your Gmail address

### Step 3: Generate JWT Secret

Run this command in your terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and set it as your `JWT_SECRET`

### Step 4: Database Setup

If using MySQL alongside Supabase:

```bash
# Install MySQL
mysql --version

# Create database
mysql -u root -p -e "CREATE DATABASE fitness_db;"

# Run migrations
mysql -u root -p fitness_db < backend/migrations/schema.sql
```

### Step 5: Verify Setup

Test your configuration:

```bash
# Backend
cd backend
npm install
npm run dev
# Check if server starts without errors

# Frontend
cd frontend
npm install
npm run dev
# Check if frontend loads and API connection works
```

## Environment Variables Checklist

### Backend
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `EMAIL_USER` and `EMAIL_PASS` (or RESEND_API_KEY)
- [ ] `JWT_SECRET` (minimum 32 characters)
- [ ] `JWT_EXPIRY`
- [ ] `PORT`
- [ ] `NODE_ENV`

### Frontend
- [ ] `VITE_SUPABASE_URL`
- [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] `VITE_API_URL`

## Troubleshooting

### Email Not Sending

**Issue:** Emails are not being sent

**Solutions:**
- Verify email credentials in `.env`
- Check Gmail App Passwords are set correctly
- Verify Resend API key if using Resend
- Check spam/junk folder
- Check backend logs for email errors

### Connection Refused

**Issue:** Cannot connect to Supabase

**Solutions:**
- Verify `SUPABASE_URL` is correct
- Check `SUPABASE_SERVICE_ROLE_KEY` is valid
- Ensure Supabase project is not paused
- Check network connectivity

### JWT Errors

**Issue:** JWT token validation fails

**Solutions:**
- Verify `JWT_SECRET` matches between requests
- Check token hasn't expired
- Ensure secret is at least 32 characters

### CORS Errors

**Issue:** Frontend cannot reach backend API

**Solutions:**
- Update `VITE_API_URL` to correct backend URL
- Add frontend URL to backend CORS configuration
- Check `CLIENT_URL` environment variable

## Security Best Practices

1. **Never commit `.env` files** to git
2. **Use `.env.example`** template without secrets
3. **Rotate keys regularly** in production
4. **Use different credentials** for development and production
5. **Keep secrets minimum 32 characters** for JWT
6. **Use environment variables** for all sensitive data
7. **Enable HTTPS** in production
8. **Implement rate limiting** on password reset endpoints

## Production Deployment

When deploying to production:

1. **Use environment variables** on your hosting platform
2. **Never hardcode secrets** in code
3. **Use separate Supabase project** for production
4. **Enable HTTPS** and verify SSL certificates
5. **Rotate JWT secret** after deployment
6. **Monitor logs** for suspicious activity
7. **Enable email verification** for password resets
8. **Implement rate limiting** on all auth endpoints

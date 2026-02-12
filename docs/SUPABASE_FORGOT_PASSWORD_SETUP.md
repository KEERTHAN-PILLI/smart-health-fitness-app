# Supabase Forgot Password Implementation Guide

This guide provides complete setup instructions for implementing forgot password functionality using Supabase Authentication and Email services in your React + Node.js application.

## Overview

The forgot password flow consists of three steps:
1. User enters email and receives an OTP via email
2. User verifies the OTP
3. User sets a new password

## Prerequisites

- Supabase account (https://supabase.com)
- Node.js backend (Express.js)
- React frontend
- npm/yarn package manager

## Step 1: Supabase Project Setup

### 1.1 Create Supabase Project

1. Go to [Supabase Console](https://app.supabase.com)
2. Click "New Project"
3. Enter project name, database password, and region
4. Wait for project to initialize

### 1.2 Get Supabase Credentials

1. Go to Project Settings > API
2. Copy the following:
   - **Supabase URL**: `https://your-project.supabase.co`
   - **Anon Public Key**: Used for client-side auth
   - **Service Role Key**: Used for server-side operations (KEEP SECRET)

### 1.3 Create Database Tables

Run the following SQL in Supabase SQL Editor:

```sql
-- Users table with password reset fields
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

-- Enable RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (auth.uid()::text = id::text);
```

### 1.4 Configure Email Authentication

In Supabase Console:

1. Go to Authentication > Providers
2. Enable "Email" provider
3. Configure email settings:
   - Go to Authentication > Email Templates
   - Customize if needed

### 1.5 Setup Resend Email Service (Alternative to Supabase Emails)

For better email delivery, use Resend:

1. Sign up at [Resend](https://resend.com)
2. Get your API key from the dashboard
3. Add to your environment variables

## Step 2: Backend Setup

### 2.1 Install Dependencies

```bash
cd backend
npm install
# Additional dependencies needed:
npm install @supabase/supabase-js nodemailer dotenv
```

### 2.2 Environment Configuration

Update `.env` file in backend:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Email Configuration (Gmail SMTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Email Configuration (Resend Alternative)
RESEND_API_KEY=your-resend-api-key

# JWT Configuration
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRY=1d

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 2.3 Update Backend Files

Create/Update the following files as shown in the implementation section below.

## Step 3: Frontend Setup

### 3.1 Install Dependencies

```bash
cd frontend
npm install
# Additional dependencies:
npm install @supabase/supabase-js axios
```

### 3.2 Environment Configuration

Create `.env` in frontend:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:5000
```

### 3.3 Create Supabase Client

Create `frontend/src/api/supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
```

## Step 4: Implementation Details

See the implementation files in this repository for:
- Backend API endpoints
- Frontend React components
- Database models
- Email templates

## Step 5: Testing the Implementation

### Backend Testing

```bash
# Start backend server
cd backend
npm run dev

# Test forgot password endpoint
curl -X POST http://localhost:5000/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

### Frontend Testing

```bash
# Start frontend
cd frontend
npm run dev

# Navigate to forgot password page
# Fill in email and follow the flow
```

## Troubleshooting

### Emails Not Sending
- Verify email credentials in `.env`
- Check Gmail: Enable "Less Secure Apps" or use App Password
- Verify Resend API key if using Resend
- Check spam/junk folder

### Database Connection Issues
- Verify Supabase URL and keys
- Check Supabase project is active
- Ensure tables are created correctly

### OTP Verification Failing
- Verify OTP hasn't expired (10-minute window)
- Check OTP format matches
- Clear browser cache

### JWT Token Issues
- Verify JWT_SECRET in backend `.env`
- Check token expiry settings
- Ensure tokens are being sent in Authorization header

## Security Best Practices

1. **Keep Keys Secret**: Never commit `.env` files to git
2. **OTP Expiry**: Set appropriate expiry time (10 minutes recommended)
3. **Rate Limiting**: Implement rate limiting on password reset endpoints
4. **HTTPS Only**: Always use HTTPS in production
5. **Email Verification**: Consider email verification before allowing password reset
6. **Audit Logging**: Log all password reset attempts

## Production Deployment

### Backend Deployment (Render/Railway)

1. Set environment variables in hosting platform
2. Ensure database credentials are secure
3. Enable CORS for your frontend domain
4. Test thoroughly before deploying

### Frontend Deployment (Vercel/Netlify)

1. Add environment variables in deployment settings
2. Build and deploy
3. Test all authentication flows

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth API](https://supabase.com/docs/reference/javascript/auth-api)
- [Nodemailer Guide](https://nodemailer.com/about/)
- [Resend Documentation](https://resend.com/docs)

## Support

For issues or questions, refer to:
- Supabase Discord: https://discord.supabase.io
- GitHub Issues in this repository
- Documentation in `/docs` folder

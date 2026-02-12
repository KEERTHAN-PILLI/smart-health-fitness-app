import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import supabase from '../config/supabase.js';
import sendEmail from '../utils/sendEmail.js';

/**
 * FORGOT PASSWORD - Send OTP via Email using Supabase
 */
export const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user exists in Supabase
    const { data: userData, error: queryError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (queryError || !userData) {
      return res.status(404).json({ message: 'Email not found' });
    }

    // Generate OTP (6-digit random code)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryTime = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Update user with reset code and expiry
    const { error: updateError } = await supabase
      .from('users')
      .update({
        reset_code: otp,
        reset_code_expiry: expiryTime,
        updated_at: new Date(),
      })
      .eq('email', email);

    if (updateError) {
      console.error('Database update error:', updateError);
      return res.status(500).json({ message: 'Failed to process forgot password request' });
    }

    // Send email with OTP
    try {
      await sendEmail({
        to: email,
        subject: 'Password Reset Code - Smart Health Fitness',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Password Reset Request</h2>
            <p>We received a request to reset your password. Use the code below to proceed:</p>
            <div style="background: #f0f0f0; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
              <h1 style="margin: 0; color: #007bff; letter-spacing: 5px;">${otp}</h1>
            </div>
            <p style="color: #666;">This code will expire in 10 minutes.</p>
            <p style="color: #999; font-size: 12px;">
              If you did not request this, please ignore this email or contact our support team.
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      return res.status(500).json({ message: 'Failed to send reset code email' });
    }

    res.json({
      message: 'OTP sent to your email. Please check your inbox.',
      email: email, // For testing purposes
    });
  } catch (error) {
    console.error('FORGOT PASSWORD ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * VERIFY OTP
 */
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Get user and verify OTP
    const { data: userData, error: queryError } = await supabase
      .from('users')
      .select('reset_code, reset_code_expiry')
      .eq('email', email)
      .single();

    if (queryError || !userData) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    // Check if OTP matches
    if (userData.reset_code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Check if OTP has expired
    if (Date.now() > userData.reset_code_expiry) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('VERIFY OTP ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * RESET PASSWORD
 */
export const resetPassword = async (req, res) => {
  try {
    const { email, password, otp } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Verify OTP one more time for security
    const { data: userData, error: queryError } = await supabase
      .from('users')
      .select('reset_code, reset_code_expiry')
      .eq('email', email)
      .single();

    if (queryError || !userData) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    if (otp && userData.reset_code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (Date.now() > userData.reset_code_expiry) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear reset code
    const { error: updateError } = await supabase
      .from('users')
      .update({
        password: hashedPassword,
        reset_code: null,
        reset_code_expiry: null,
        updated_at: new Date(),
      })
      .eq('email', email);

    if (updateError) {
      console.error('Password update error:', updateError);
      return res.status(500).json({ message: 'Failed to reset password' });
    }

    // Send confirmation email
    try {
      await sendEmail({
        to: email,
        subject: 'Password Reset Successful - Smart Health Fitness',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #28a745;">Password Reset Successful</h2>
            <p>Your password has been successfully reset.</p>
            <p>You can now log in with your new password.</p>
            <p style="color: #999; font-size: 12px;">
              If you did not make this change, please contact our support team immediately.
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Confirmation email error:', emailError);
      // Don't return error here as password was already reset
    }

    res.json({ message: 'Password reset successful. Please login with your new password.' });
  } catch (error) {
    console.error('RESET PASSWORD ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * REGISTER - Enhanced for Supabase
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{
        name,
        email,
        password: hashedPassword,
        role: role || 'user',
        created_at: new Date(),
        updated_at: new Date(),
      }])
      .select()
      .single();

    if (insertError) {
      console.error('Registration error:', insertError);
      return res.status(500).json({ message: 'Registration failed' });
    }

    // Send welcome email
    try {
      await sendEmail({
        to: email,
        subject: 'Welcome to Smart Health Fitness',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome to Smart Health Fitness!</h2>
            <p>Hi ${name},</p>
            <p>Your account has been successfully created. You can now log in and start your fitness journey.</p>
            <p>If you have any questions, please contact our support team.</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Welcome email error:', emailError);
      // Don't return error as registration was successful
    }

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('REGISTER ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * LOGIN - Enhanced for Supabase
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Get user from database
    const { data: user, error: queryError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (queryError || !user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('LOGIN ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default {
  register,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
}

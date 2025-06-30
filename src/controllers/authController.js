// controllers/authController.js

import prisma from '../models/prismaClient.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { logToFile } from '../../utils/logger.js';

// REGISTER
export const register = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, password } = req.body;

    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return res.status(400).json({ error: "This email has already been taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Fetch role_id dynamically or hardcode for now
    const adminRole = await prisma.role.findUnique({
      where: { name: 'admin' },
    });

    await prisma.user.create({
      data: {
        first_name,
        last_name,
        email,
        phone,
        password: hashedPassword,
        role_id: adminRole?.id || null,
      },
    });

    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    logToFile(`[Auth Register] ${error}`);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 1000,
      })
      .json({ success: true, message: "Logged in successfully" });
  } catch (error) {
    logToFile(`[Auth Login] ${error}`);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// LOGOUT
export const logout = async (req, res) => {
  res
    .clearCookie("token")
    .json({ success: true, message: "Logged out successfully" });
};

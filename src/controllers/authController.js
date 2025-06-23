const prisma = require("../models/prismaClient");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { logToFile } = require("../../utils/logger");
const e = require("express");

exports.register = async (req, res) => {
  // try {
  //   const { first_name, last_name, email, phone, password } = req.body;

  //   const existingEmail = await prisma.user.findUnique({
  //     where: { email },
  //   });

  //   if (existingEmail) {
  //     return res.status(400).json({ error: "This email already been taken" });
  //   }

  //   const hashedPassword = await bcrypt.hash(password, 10);

  //   await prisma.user.create({
  //     data: {
  //       first_name,
  //       last_name,
  //       email,
  //       phone,
  //       password: hashedPassword,
  //       role_id: adminRole.id,
  //     },
  //   });
  // } catch (error) {}
};

exports.login = async (req, res) => {
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
    logToFile(`[Auth Login]${error}`);
    res.json({
      success: false,
      message: "something went wrong",
    });
  }
};

exports.logout = async (req, res) => {
  res
    .clearCookie("token")
    .json({ success: true, message: "Logged out successfully" });
};

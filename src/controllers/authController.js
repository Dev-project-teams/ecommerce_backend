const prisma = require('../models/prismaClient');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res) => {
  const { first_name, last_name, email, phone, password, role } = req.body;

  
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

 
};

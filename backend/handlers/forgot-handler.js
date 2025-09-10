// Verify a single security answer and allow password reset
async function verifySecurityAnswer(req, res) {
  const { email, question, answer, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.securityQuestions || user.securityQuestions.length < 3) {
    return res.status(404).send({ error: 'User or security questions not found.' });
  }
  // Find the question index
  const idx = user.securityQuestions.findIndex(q => q.question === question);
  if (idx === -1) {
    return res.status(400).send({ error: 'Security question not found.' });
  }
  // Normalize user input before comparison
  const normalizedAnswer = answer.trim().toLowerCase();
  const match = await bcrypt.compare(normalizedAnswer, user.securityQuestions[idx].answerHash);
  if (!match) {
    return res.status(401).send({ error: 'Security answer incorrect.' });
  }
  // If answer matches, update password
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.send({ message: 'Password reset successful.' });
}
const User = require('./../db/user');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const RESET_EXPIRY = 60 * 60; // 1 hour

async function sendResetEmail(email, token) {
  // Configure your SMTP transport here
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/reset-password?token=${token}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Request',
    html: `<p>You requested a password reset.</p><p>Click <a href="${resetUrl}">here</a> to reset your password. This link will expire in 1 hour.</p>`
  };
  await transporter.sendMail(mailOptions);
}

async function forgotPassword(req, res) {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.send({ message: 'If this email is registered, a reset link will be sent.' });
  }
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: RESET_EXPIRY });
  await sendResetEmail(email, token);
  res.send({ message: 'If this email is registered, a reset link will be sent.' });
}

async function resetPassword(req, res) {
  const { token, password } = req.body;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).send({ error: 'Invalid token or user.' });
    const bcrypt = require('bcrypt');
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    res.send({ message: 'Password reset successful.' });
  } catch (err) {
    res.status(400).send({ error: 'Invalid or expired token.' });
  }
}

const bcrypt = require('bcrypt');

// Get security questions for a user by email
async function getSecurityQuestions(req, res) {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.securityQuestions || user.securityQuestions.length < 3) {
    return res.status(404).send({ error: 'User or security questions not found.' });
  }
  // Only send the questions, not the answers
  res.send({
    questions: user.securityQuestions.map(q => q.question)
  });
}

// Verify security answers and allow password reset
async function verifySecurityAnswers(req, res) {
  const { email, answers, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.securityQuestions || user.securityQuestions.length < 3) {
    return res.status(404).send({ error: 'User or security questions not found.' });
  }
  // answers: array of 3 answers
  let allMatch = true;
  for (let i = 0; i < 3; i++) {
    const match = await bcrypt.compare(answers[i], user.securityQuestions[i].answerHash);
    if (!match) {
      allMatch = false;
      break;
    }
  }
  if (!allMatch) {
    return res.status(401).send({ error: 'Security answers incorrect.' });
  }
  // If all answers match, update password
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.send({ message: 'Password reset successful.' });
}

module.exports = { forgotPassword, resetPassword, getSecurityQuestions, verifySecurityAnswers, verifySecurityAnswer };

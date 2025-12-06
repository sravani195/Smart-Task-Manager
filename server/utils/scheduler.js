const nodemailer = require('nodemailer');
const { Op } = require('sequelize');
const Task = require('../models/task');
const User = require('../models/user');

async function sendEmail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
  await transporter.sendMail({ from: process.env.SMTP_USER, to, subject, text });
}

function startReminderScheduler() {
  setInterval(async () => {
    const now = new Date();
    const tasks = await Task.findAll({
      where: { reminderAt: { [Op.lte]: now }, completed: false }
    });
    for (const task of tasks) {
      const user = await User.findByPk(task.userId);
      if (user) {
        await sendEmail(
          user.email,
          `Reminder: ${task.title}`,
          `Don't forget your task: ${task.title}\nDue on: ${task.dueDate}`
        );
      }
      task.reminderAt = null;
      await task.save();
    }
  }, 60000);
}

module.exports = { startReminderScheduler };

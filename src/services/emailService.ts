import nodemailer from 'nodemailer';

type MailData = {
  email: string;
  subject: string;
  html: string;
};

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: +(process.env.SMTP_PORT as string),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendMail = (mailData: MailData) => {
  const { email, subject, html } = mailData;

  return transporter.sendMail({
    to: email,
    subject,
    html,
  });
};

const sendActivationLink = (email: string, token: string) => {
  const link = `${process.env.CLIENT_URL}/activation/${token}`;

  const html = `
    <h1>Account activation</h1>
    <a href="${link}">${link}</a>
  `;

  return sendMail({
    email,
    subject: 'Blog account activation',
    html,
  });
};

export const emailService = {
  sendMail,
  sendActivationLink,
};

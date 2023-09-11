import nodemailer, { Transporter } from 'nodemailer';

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

const sendEmail = async (options: EmailOptions): Promise<void> => {
  // 1) Create transporter (service that will send email like "gmail","Mailgun", "mialtrap", sendGrid)
  const transporter: Transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    host: process.env.EMAIL_HOST || '',
    port: Number(process.env.EMAIL_PORT) || 587, // if secure false port = 587, if true port= 465
    auth: {
      user: process.env.EMAIL_USER || '',
      pass: process.env.EMAIL_PASSWORD || '',
    },
  });

  // 2) Define email options (like from, to, subject, email content)
  const mailOpts = {
    from: 'Kortobaa-Task',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Send email
  await transporter.sendMail(mailOpts);
};

export default sendEmail;

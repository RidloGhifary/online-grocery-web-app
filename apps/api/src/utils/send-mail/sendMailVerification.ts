import { transporter } from './nodemailer';

const domain = process.env.NEXT_PUBLIC_APP_URL;

export async function sendVerificationEmail({
  email,
  key,
}: {
  email: string;
  key: string;
}) {
  const confirmLink = `${domain}/verify-account?key=${key}`;

  await transporter.sendMail({
    from: "'OGro' <ogro@gmail.com>",
    to: email,
    subject: 'Verify your email',
    text: `Confirm your email`,
    html: `<h1 style="text-align: center; color: #16a34a; margin-top: 0;">Welcome to OGro</h1>
    <p style="text-align: center; color: #666; margin-top: 0;">Click the link below to verify your email.</p>
    <div style="text-align: center; margin-top: 20px;">
      <a href="${confirmLink}" style="display: inline-block; padding: 10px 20px; background-color: #16a34a; color: #fff; text-decoration: none; border-radius: 4px;">Verify Email</a>
    </div>`,
  });
}

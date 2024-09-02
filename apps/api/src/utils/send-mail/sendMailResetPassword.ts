import { transporter } from './nodemailer';

const domain = process.env.NEXT_PUBLIC_APP_URL;

export async function sendResetPasswordEmail({
  email,
  key,
  path,
}: {
  email: string;
  key: string;
  path: string;
}) {
  const confirmLink = `${domain}/${path}?key=${key}`;

  await transporter.sendMail({
    from: "'OGro' <ogro@gmail.com>",
    to: email,
    subject: 'Reset your password',
    text: `Reset your password`,
    html: `<h1 style="text-align: center; color: #16a34a; margin-top: 0;">Reset your password</h1>
    <p style="text-align: center; color: #666; margin-top: 0;">Click the link below to reset your password.</p>
    <div style="text-align: center; margin-top: 20px;">
      <a href="${confirmLink}" style="display: inline-block; padding: 10px 20px; background-color: #16a34a; color: #fff; text-decoration: none; border-radius: 4px;">Reset password</a>
    </div>
    <p style="text-align: center; color: #888; margin-top: 0;">If you did not make this request, please ignore this email.</p>
    `,
  });
}

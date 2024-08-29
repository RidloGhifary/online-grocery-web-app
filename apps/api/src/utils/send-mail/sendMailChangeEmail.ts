import { transporter } from './nodemailer';

const domain = process.env.NEXT_PUBLIC_APP_URL;

export async function sendMailChangeEmail({
  email,
  key,
}: {
  email: string;
  key: string;
}) {
  const confirmLink = `${domain}/change-email-redirect?key=${key}`;

  await transporter.sendMail({
    from: "'OGro' <ogro@gmail.com>",
    to: email,
    subject: 'Verify your new email',
    text: `Confirm your email`,
    html: `<h1 style="text-align: center; color: #16a34a; margin-top: 0;">Change your email</h1>
    <p style="text-align: center; color: #666; margin-top: 0;">Click the button below to verify your new email. This link will expire in an hour.</p>
    <div style="text-align: center; margin-top: 20px;">
    <a href="${confirmLink}" style="display: inline-block; padding: 10px 20px; background-color: #16a34a; color: #fff; text-decoration: none; border-radius: 4px;">Verify Email</a>
    </div>
    <p style="text-align: center; color: #888; margin-top: 0;">If you did not make this request, please ignore this email.</p>
    `,
  });
}

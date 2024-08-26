import prisma from '@/prisma';
import createReferralCode from './createReferralCode';
import getUserByEmail from './getUserByEmail';

interface LoginWithGoogleProps {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  image: string | null;
}

export default async function loginWithGoogle({
  first_name,
  last_name,
  username,
  email,
  image,
}: LoginWithGoogleProps) {
  try {
    const user = await getUserByEmail(email);

    if (user && user.validated_at) {
      const updatedUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          first_name,
          last_name,
          username,
          image,
          validated_at: new Date(),
          is_google_linked: true,
        },
      });

      return updatedUser;
    }

    const referral = createReferralCode(first_name);

    // TODO: ADDED USER TO DATABASE
    const newUser = await prisma.user.create({
      data: {
        first_name,
        last_name,
        username,
        email,
        image,
        referral,
        is_google_linked: true,
        validated_at: new Date(),
      },
    });

    return newUser;
  } catch {
    throw new Error('Failed to log in with Google');
  }
}

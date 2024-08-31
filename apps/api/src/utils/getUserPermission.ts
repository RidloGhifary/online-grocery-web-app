import prisma from '@/prisma';

interface getUserPermissionProps {
  user_id: number | undefined;
  role: string;
  permission: string;
}

export default async function getUserPermission({
  user_id,
  role,
  permission,
}: getUserPermissionProps) {
  const userRole = await prisma.role.findFirst({
    where: {
      name: role,
    },
  });

  if (!userRole) {
    return { ok: false, message: `${role} role not found` };
  }

  const userHasRole = await prisma.userHasRole.findFirst({
    where: {
      user_id: user_id,
      role_id: userRole?.id,
    },
  });

  if (!userHasRole) {
    return { ok: false, message: 'Unauthorized' };
  }

  const rolePermission = await prisma.permission.findFirst({
    where: {
      name: permission,
    },
  });

  if (!rolePermission) {
    return { ok: false, message: `${permission} permission not found` };
  }

  const userHasPermission = await prisma.rolesHasPermission.findFirst({
    where: {
      permission_id: Number(rolePermission?.id),
    },
  });

  if (!userHasPermission) {
    return { ok: false, message: 'Unauthorized' };
  }

  return { ok: true, message: 'Authorized' };
}

import { Prisma } from "@prisma/client";

const userWithRoleAndPermissionEntityInclude = {
  omit: {
    password: true,
  },
  include: {
    role: {
      include: {
        role: {
          include: {
            roles_permissions: { include: { permission: true } },
          },
        },
      },
    },
    store_admins : true
  },
} satisfies Prisma.UserDefaultArgs;

export type UserWithRoleAndPermissionEntity = Prisma.UserGetPayload<
  typeof userWithRoleAndPermissionEntityInclude
>;
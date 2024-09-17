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


const adminWithRoleAndPermissionEntityInclude = {
  omit :{
    password : true
  },
  include: {
    role :{
      include :{
        role: {
          include: {
            roles_permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      }
    },
  },
} satisfies Prisma.UserDefaultArgs;

export type AdminWithRoleAndPermissionEntity = Prisma.UserGetPayload<
  typeof adminWithRoleAndPermissionEntityInclude
>;

const customerEntity = {
  omit: {
    password: true,
  },
  
} satisfies Prisma.UserDefaultArgs;

export type CustomerEntity = Prisma.UserGetPayload<
  typeof customerEntity
>;
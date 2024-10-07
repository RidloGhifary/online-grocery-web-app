import bcrypt from 'bcryptjs'
import crypto from 'crypto';
import CommonPaginatedResultInterface from '@/interfaces/CommonPaginatedResultInterface';
import CommonResultInterface from '@/interfaces/CommonResultInterface';
import { UserInputInterface } from '@/interfaces/UserInterface';
import prisma from '@/prisma';
import {
  AdminWithRoleAndPermissionEntity,
  CustomerEntity,
} from '@/types/UserType';
import { getAllUserWhereInput } from '@/utils/admin/adminGetWhereInput';
import paginate, { numberization } from '@/utils/paginate';
import { Prisma, User } from '@prisma/client';

class AdminRepository {
  async getAllAdmin({
    search,
    order = 'asc',
    orderField = 'name',
    limitNumber = 20,
    pageNumber = 1,
  }: {
    search?: string;
    order?: 'asc' | 'desc';
    orderField?: 'name' | 'category';
    pageNumber?: number;
    limitNumber?: number;
  }): Promise<
    CommonPaginatedResultInterface<AdminWithRoleAndPermissionEntity[]>
  > {
    let result: CommonPaginatedResultInterface<
      AdminWithRoleAndPermissionEntity[]
    > = {
      ok: false,
      data: {
        data: null,
        pagination: null,
      },
    };
    try {
      const count = await prisma.user.count({
        where: {
          role: {
            some: {
              role: { isNot: null },
            },
          },
          deleted_at: null,
        },
      });
      const safePageNumber = numberization(pageNumber);
      const safeLimitNumber = numberization(limitNumber);
      const adminData = await prisma.user.findMany({
        omit: {
          password: true,
        },
        skip: (safePageNumber - 1) * safeLimitNumber,
        take: safeLimitNumber,
        where: {
          ...(await getAllUserWhereInput({ search: search })),
          role: {
            some: {
              role: { isNot: null },
            },
          },
          deleted_at: null,
        },
        include: {
          role: {
            include: {
              role: {
                include: {
                  roles_permissions: {
                    include: {
                      permission: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      if (count <= 0) {
        throw new Error('Not found 404');
      }
      if (!adminData) throw new Error('404');
      result.ok = true;
      result.data.data = adminData;
      result.data.pagination = paginate({
        pageNumber: safePageNumber,
        limitNumber: safeLimitNumber,
        totalData: count,
      });
      result.message = 'Admin data exist';
    } catch (error) {
      let errorMessage = (error as Error).message;
      switch (errorMessage) {
        case '404':
          result.error = '404';
          result.message = 'Data not found';
          break;

        default:
          result.error = error;
          break;
      }
    }
    return result;
  }

  async getAllCustomer({
    search,
    order = 'asc',
    orderField = 'name',
    limitNumber = 20,
    pageNumber = 1,
  }: {
    search?: string;
    order?: 'asc' | 'desc';
    orderField?: 'name' | 'category';
    pageNumber?: number;
    limitNumber?: number;
  }): Promise<CommonPaginatedResultInterface<CustomerEntity[]>> {
    let result: CommonPaginatedResultInterface<CustomerEntity[]> = {
      ok: false,
      data: {
        data: null,
        pagination: null,
      },
    };
    try {
      const count = await prisma.user.count({
        where: {
          ...(await getAllUserWhereInput({ search: search })),
          role: {
            none: {},
          },
          deleted_at: null,
        },
      });
      const safePageNumber = numberization(pageNumber);
      const safeLimitNumber = numberization(limitNumber);
      const customerData = await prisma.user.findMany({
        skip: (safePageNumber - 1) * safeLimitNumber,
        take: safeLimitNumber,
        omit: { password: true },
        where: {
          role: {
            none: {},
          },

          deleted_at: null,
        },
      });
      if (count <= 0) {
        throw new Error('Not found 404');
      }
      if (!customerData) throw new Error('404');
      result.ok = true;
      result.data.data = customerData;
      result.data.pagination = paginate({
        pageNumber: safePageNumber,
        limitNumber: safeLimitNumber,
        totalData: count,
      });
      result.message = 'Customers data exist';
    } catch (error) {
      let errorMessage = (error as Error).message;
      switch (errorMessage) {
        case '404':
          result.error = '404';
          result.message = 'Data not found';
          break;
        default:
          result.error = error;
          break;
      }
    }
    return result;
  }

  async isUserHasRelatedPermission(
    userId?: number,
    permission?: string,
  ): Promise<CommonResultInterface<boolean>> {
    let result: CommonResultInterface<boolean> = {
      ok: false,
    };
    if (!userId || !permission) {
      result.message = 'Neither user id or permission are not provided';
      result.error = '400 Bad Request';
      return result;
    }
    try {
      const ress = await prisma.userHasRole.findFirst({
        where: {
          AND: {
            id: userId,
          },
        },
        include: {
          role: {
            include: {
              roles_permissions: {
                include: { permission: true },
              },
            },
          },
        },
      });
      // !!();
      if (!ress) {
        result.message = "You don't have any permission";
        result.error = '403 Forbidden Request';
        return result;
      }
      if (
        !ress.role?.roles_permissions.filter(
          (e) =>
            e.permission.name.includes('super') ||
            e.permission.name.includes(permission) ||
            ress?.role?.name.includes('super'),
        )
      ) {
        result.message = "You don't have the related permission";
        result.error = '403 Forbidden Request';
      }
    } catch (error) {
      result.message = 'An error occurred while checking permissions';
      result.error = '500 Internal Server Error';
    }
    return result;
  }

  async createAdmin(
    admin: UserInputInterface,
  ): Promise<CommonResultInterface<boolean>> {
    let result: CommonResultInterface<boolean> = {
      ok: false,
      data: false
    };
    try {
      const roleId = admin.role_id;
      admin.referral = crypto.randomBytes(5).toString('hex').toUpperCase()
      delete admin.role_id;
      if (admin.id) {
        delete admin.id;
      }
      let hashedPassword :string
      if (admin.password) {
        hashedPassword = await bcrypt.hash(admin.password, await bcrypt.genSalt());
        admin.password = hashedPassword
      }
      const [newData] = await prisma.$transaction([
        prisma.user.create({
          data: { ...admin, role: { create: { role_id: roleId } }, validated_at: new Date },
        }),
      ]);
      if (newData) {
        result.data = true;
        result.ok = true;
      }
      result.message = 'Success adding data';
    } catch (error) {
      result.error = error;
      return result;
    }
    return result;
  }

  async updateAdmin(
    admin: UserInputInterface,
  ): Promise<CommonResultInterface<User>> {
    let result: CommonResultInterface<User> = {
      ok: false,
    };
    try {
      const adminId = admin.id;
      const roleId = admin.role_id;
      let hashedPassword :string
      // console.log('admin passswwwworrdd');
      
      // console.log(admin.password);
      
      if (admin.password) {
        hashedPassword = await bcrypt.hash(admin.password, 10);
        admin.password = hashedPassword
      } else {
        admin.password = undefined
      }
      delete admin.role_id;
      delete admin.id;
      // const prepData = {...admin, }
      const roleUpdate = {role: {
        updateMany: {
          where: { user_id: adminId },
          data: { role_id: roleId },
        },
      },} 
      const [updatedData] = await prisma.$transaction([
        prisma.user.update({
          where: {
            id: adminId,
            deleted_at: null,
          },
          data: {
            ...admin,
            ...(roleId?roleUpdate:{})
          },
        }),
      ]);
      if (!updatedData) {
        throw new Error('404 not found');
      }
      result.data = updatedData;
      result.ok = true;
      result.message = 'Success update data';
    } catch (error) {
      result.error = error;
      return result;
    }
    return result;
  }

  async deleteAdmin(adminId: number): Promise<CommonResultInterface<boolean>> {
    let result: CommonResultInterface<boolean> = {
      ok: false,
    };
    try {
      const [deletedData] = await prisma.$transaction([
        prisma.user.delete({ where: { id: adminId } }),
      ]);
      if (!deletedData) {
        throw new Error('404 not found');
      }
      result.ok = true;
      result.data = true;
      result.message = 'Success delete data';
    } catch (error) {
      result.error = error;
      return result;
    }
    return result;
  }

  async isUsernameExist(data?:string, excludeId?:number):Promise<boolean> {
    return !!(await prisma.user.findFirst({where:{id: { not: excludeId },username:data, deleted_at:null}}))
  }
  async isEmailExist(data?:string, excludeId?:number):Promise<boolean> {
    return !!(await prisma.user.findFirst({where:{id: { not: excludeId },email:data, deleted_at:null}}))
  }
  async isPhoneExist(data?:string, excludeId?:number):Promise<boolean> {
    return !!(await prisma.user.findFirst({where:{id: { not: excludeId },phone_number:data, deleted_at:null}}))
  }
  async isAdminIDExist(adminId?:number):Promise<boolean> {
    return !!(await prisma.user.findFirst({where:{id: adminId, deleted_at:null}}))
  }
}

export const adminRepository = new AdminRepository();

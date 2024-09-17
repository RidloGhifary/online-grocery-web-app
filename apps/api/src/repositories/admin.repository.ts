import CommonResultInterface from '@/interfaces/CommonResultInterface';
import prisma from '@/prisma';
import {
  AdminWithRoleAndPermissionEntity,
  CustomerEntity,
} from '@/types/UserType';

class AdminRepository {
  async getAllAdmin(): Promise<
    CommonResultInterface<AdminWithRoleAndPermissionEntity[]>
  > {
    let result: CommonResultInterface<AdminWithRoleAndPermissionEntity[]> = {
      ok: false,
    };
    try {
      const adminData = await prisma.user.findMany({
        omit: {
          password: true,
        },
        where: {
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
      if (!adminData) throw new Error('404');
      result.ok = true;
      result.data = adminData;
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
  async getAllCustomer(): Promise<CommonResultInterface<CustomerEntity[]>> {
    let result: CommonResultInterface<CustomerEntity[]> = {
      ok: false,
    };
    try {
      const customerData = await prisma.user.findMany({
        omit: { password: true },
        where: {
          role: {
            none: {},
          },
        },
      });
      if (!customerData) throw new Error('404');
      result.ok = true;
      result.data = customerData;
      result.message = 'Cuatomers data exist';
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
}

export const adminRepository = new AdminRepository();

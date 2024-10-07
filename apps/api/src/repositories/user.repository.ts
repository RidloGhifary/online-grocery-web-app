import CommonResultInterface from '@/interfaces/CommonResultInterface';
import prisma from '@/prisma';
import { UserWithRoleAndPermissionEntity } from '@/types/UserType';
import tokenValidation from '@/utils/tokenValidation';

class UserRepository {
  async getUserWithRoleAndPermission(
    token?: string,
  ): Promise<CommonResultInterface<UserWithRoleAndPermissionEntity>> {
    let result: CommonResultInterface<UserWithRoleAndPermissionEntity> = {
      ok: false,
    };
    try {
      // console.log(tokenValidation(token).data!);
      const { id, email } = tokenValidation(token).data!;

      const userDataWithRoleAndPermission = await prisma.user.findFirst({
        where: {
          AND: {
            id: id,
            email: email,
            deleted_at: null,
          },
        },
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
          store_admins: true,
        },
      });
      if (!userDataWithRoleAndPermission) throw new Error('404');
      result.ok = true;
      result.data = userDataWithRoleAndPermission;
      result.message = 'User data exist';
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
          (e: any) =>
            e.permission.name.includes('super') ||
            e.permission.name.includes(permission) ||
            ress.role?.name.includes('super'),
        )
      ) {
        result.message = "You don't have the related permission";
        result.error = '403 Forbidden Request';
      }
      // console.log(ress);
      result.ok = true;
      result.data = true;
    } catch (error) {
      result.message = 'An error occurred while checking permissions';
      result.error = '500 Internal Server Error';
    }
    return result;
  }
}

export const userRepository = new UserRepository();

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
      const {id, email} = tokenValidation(token).data!
      
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
          store_admins : true
        },
      });
      if (!userDataWithRoleAndPermission) throw new Error("404");
      result.ok = true
      result.data = userDataWithRoleAndPermission
      result.message = 'User data exist'
    } catch (error) {
      let errorMessage = (error as Error).message
      switch (errorMessage) {
        case '404':
          result.error = '404'
          result.message = 'Data not found'
          break;
      
        default:
          result.error = error
          break;
      }
    }
    return result;
  }
}

export const userRepository = new UserRepository();

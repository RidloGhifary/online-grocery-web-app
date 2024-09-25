import { ENV } from '@/config';
import CommonResultInterface from '@/interfaces/CommonResultInterface';
import jwt, { JwtPayload } from 'jsonwebtoken';


export default function tokenValidation(
  token: string | undefined,
): CommonResultInterface<{
  id: number;
  email: string;
}> {
  let result: CommonResultInterface<{
    id: number;
    email: string;
  }> = {
    ok: false,
  };
  try {
    const theToken = token?.replace('Bearer ', '');
    // console.log(theToken);
    
    if (!token) throw new Error('400');
    const verifiedToken =  jwt.verify(
      theToken!,
      ENV.JWT_SECRET!,
    ) as JwtPayload & {
      id: number;
      email: string;
    };
    
    if (!verifiedToken) throw new Error('422');
    result.ok = true;
    result.data = {...verifiedToken}
  } catch (error: any) {
    let errorMessage = (error as Error).message
    
    switch (errorMessage) {
      case '400':
        result.error = '400';
        result.message = 'Token is missing or have typo';
        break;
      case '422':
        result.error = '422';
        result.message = 'Token invalid or tempered';
        break;
      default:
        result.error = error;
        break;
    }
  }
// export default async function tokenValidation(
//   token: string | undefined,
// ): Promise<CommonResultInterface<UserWithRoleAndPermissionEntity>> {
//   let result: CommonResultInterface<UserWithRoleAndPermissionEntity> = {
//     ok: false,
//   };
//   try {
//     const theToken = token?.replace('Bearer ', '');
//     if (!token) throw new Error('400');
//     const verifiedToken = jwt.verify(
//       theToken!,
//       ENV.JWT_SECRECTS!,
//     ) as JwtPayload & {
//       id: number;
//       email: string;
//     };
//     if (!verifiedToken) throw new Error('422');
//     result.ok = true;
//     const userDataWithRoleAndPermission = await userRepository.getUserWithRoleAndPermission({
//       email: verifiedToken.email,
//       id : verifiedToken.id
//     })
//     result.data = userDataWithRoleAndPermission!;
//   } catch (error: any) {
//     switch (error as string) {
//       case '400':
//         result.error = 'Token is missing or have typo';
//         break;
//       case '422':
//         result.error = 'Token invalid or tempered';
//         break;
//       default:
//         result.error = 'Unknown error or server error';
//         break;
//     }
//   }
  return result;
}

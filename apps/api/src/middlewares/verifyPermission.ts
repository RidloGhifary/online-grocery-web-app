import CommonResultInterface from '@/interfaces/CommonResultInterface';
import { userRepository } from '@/repositories/user.repository';
import { Request, Response, NextFunction } from 'express';

export default async function verifyPermission(
  req: Request,
  res: Response,
  next: NextFunction,
  permission: string,
): Promise<void | Response> {
  let validation: CommonResultInterface<string> = {
    ok: false,
  };
  if (!req.currentUser) {
    validation.message = 'Credential not provided';
    validation.error = '400 Bad Request';
    return res.status(400).send(validation);
  }
  const { id } = req.currentUser;
  try {
    const permissionIsValid = await userRepository.isUserHasRelatedPermission(
      id,
      permission,
    );
    if (!permissionIsValid) {
      return res.status(400).send(permissionIsValid);
    }
  } catch (error) {}

  next();
}

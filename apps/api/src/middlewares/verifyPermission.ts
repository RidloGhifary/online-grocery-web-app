import CommonResultInterface from '@/interfaces/CommonResultInterface';
import { userRepository } from '@/repositories/user.repository';
import { Request, Response, NextFunction } from 'express';

// Factory function that returns the middleware
export const verifyPermission = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
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
      const permissionIsValid = await userRepository.isUserHasRelatedPermission(id, permission);
      if (!permissionIsValid) {
        validation.message = "You don't have the required permission";
        validation.error = '403 Forbidden';
        return res.status(403).send(validation);
      }
    } catch (error) {
      validation.message = 'Permission verification failed';
      validation.error = '500 Internal Server Error';
      return res.status(500).send(validation);
    }

    next();
  };
};

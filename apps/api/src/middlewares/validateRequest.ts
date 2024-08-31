import { Request, Response, NextFunction } from 'express';

const validateRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validatedRequest = schema.safeParse(req.body);

    if (!validatedRequest.success) {
      return res.status(400).json({
        ok: false,
        message: validatedRequest.error.issues[0].message,
      });
    }

    req.body = validatedRequest.data;
    next();
  };
};

export default validateRequest;

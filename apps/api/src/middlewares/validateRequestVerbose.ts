import { Request, Response, NextFunction } from 'express';
import { ZodSchema, z } from 'zod'; // Import Zod and ZodSchema

// Generic middleware function that works with any Zod schema
const validateRequestVerbose = <T extends ZodSchema> (schema: T) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (typeof req.body.image === 'string') {
      try {
        req.body.image = JSON.parse(req.body.image);
      } catch (error) {
        return res.status(400).json({
          ok: false,
          error: 'Invalid JSON format for image field',
        });
      }
    }
    const validatedRequest = await schema.safeParseAsync(req.body);

    if (!validatedRequest.success) {
      return res.status(400).json({
        ok: false,
        error: validatedRequest.error.issues,
      });
    }

    // Ensure that req.body has the correct type after validation
    req.body = validatedRequest.data as z.infer<T>;
    next();
  };
};

export default validateRequestVerbose;

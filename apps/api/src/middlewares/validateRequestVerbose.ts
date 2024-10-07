import { Request, Response, NextFunction } from 'express';
import { ZodSchema, z } from 'zod'; // Import Zod and ZodSchema

// Generic middleware function that works with any Zod schema
const validateRequestVerbose = <T extends ZodSchema>(
  schema: T,
  requestType: 'body' | 'params' | 'query' | 'all' | undefined = 'body',
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // console.log('params : ');

    // console.log(req.params);

    // console.log('body : ');

    // console.log(req.body);

    if (
      req.originalUrl.includes('products') &&
      typeof req.body.image === 'string'
    ) {
      try {
        req.body.image = JSON.parse(req.body.image);
      } catch (error) {
        return res.status(400).json({
          ok: false,
          error: 'Invalid JSON format for image field',
        });
      }
    }

    if (requestType === 'body' || requestType === 'all') {
      const validatedRequest = await schema.safeParseAsync(req.body);
      if (!validatedRequest.success) {
        return res.status(400).json({
          ok: false,
          error: validatedRequest.error.issues,
        });
      }
      // Ensure that req.body has the correct type after validation
      req.body = validatedRequest.data as z.infer<T>;
    }
    if (requestType === 'params' || requestType === 'all') {
      const validatedRequest = await schema.safeParseAsync(req.params);
      if (!validatedRequest.success) {
        return res.status(400).json({
          ok: false,
          error: validatedRequest.error.issues,
        });
      }
      // Ensure that req.body has the correct type after validation
      req.params = validatedRequest.data as z.infer<T>;
    }

    if (requestType === 'query' || requestType === 'all') {
      const validatedRequest = await schema.safeParseAsync(req.query);
      if (!validatedRequest.success) {
        return res.status(400).json({
          ok: false,
          error: validatedRequest.error.issues,
        });
      }
      // Ensure that req.body has the correct type after validation
      req.query = validatedRequest.data as z.infer<T>;
    }
    next();
  };
};

export default validateRequestVerbose;

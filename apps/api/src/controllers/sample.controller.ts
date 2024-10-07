import prisma from '@/prisma';
import { Request, Response } from 'express';

export class SampleController {
  async getSampleData(req: Request, res: Response) {
    return res.status(200);
  }
 
  async getSampleDataById(req: Request, res: Response) {
    const ress = await prisma.productCategory.findFirst()
    return res.status(200);
  }

  async createSampleData(req: Request, res: Response) {
    return res.status(201);
  }
}

import { Request, Response } from 'express';

export class SampleController {
  async getSampleData(req: Request, res: Response) {
    return res.status(200);
  }
}

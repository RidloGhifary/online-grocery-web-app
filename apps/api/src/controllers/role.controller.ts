import { roleRepository } from '@/repositories/role.repository';
import { Request, Response } from 'express';

export class RoleController {
  async getRoleList(req: Request, res: Response) {
    const { search, order, order_field } = req.query;
    const { page = 1, limit = 20 } = req.query;
    const data = await roleRepository.getRoleList({
      search: search as string,
      order: order as 'asc' | 'desc',
      orderField: order_field as 'name' | 'display_name',
      pageNumber : page as number,
      limitNumber : limit as number
    })
    return res.status(200).send(data);
  }
}

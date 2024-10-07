
import { CategoryController } from '@/controllers/category.controller';
import validateRequestVerbose from '@/middlewares/validateRequestVerbose';
import { verifyPermission } from '@/middlewares/verifyPermission';
import { verifyToken } from '@/middlewares/verifyToken';
import { createProductCategorySchema, deleteProductCategorySchema, updateProductCategorySchema } from '@/validations/category';
import { Router } from 'express';

export class CategoryRouter {
  private router: Router;
  private categoryController: CategoryController;

  constructor() {
    this.categoryController = new CategoryController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.categoryController.getCategoryList);

    this.router.post(
      '/',
      verifyToken,
      verifyPermission('admin_product_category_create'),
      validateRequestVerbose(createProductCategorySchema),
      this.categoryController.createCategory,
    );
    this.router.patch(
      '/update',
      verifyToken,
      verifyPermission('admin_product_category_update'),
      validateRequestVerbose(updateProductCategorySchema),
      this.categoryController.updateCategory,
    );
    this.router.delete(
      '/delete/:id',
      verifyToken,
      verifyPermission('admin_product_category_delete'),
      validateRequestVerbose(deleteProductCategorySchema,'params'),
      this.categoryController.deleteCategory,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}

import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { CategoryController } from '../controllers/category.controller';

export const categoryRoutes = (categoryController: CategoryController) => {
    const router = Router();

    // All category routes require authentication
    router.post('/categories', authenticate, categoryController.createCategory);

    /*
    router.get('/categories', authenticate, categoryController.getCategories);
    router.get('/categories/:id', authenticate, categoryController.getCategoryById);
    router.put('/categories/:id', authenticate, categoryController.updateCategory);
    router.delete('/categories/:id', authenticate, categoryController.deleteCategory);
    */
   return router;
}
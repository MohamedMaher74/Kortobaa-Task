import { Request, Response, NextFunction } from 'express';
import ProductService from '../services/productService';
import CustomRequest from '../interfaces/customRequest';
import response from '../utils/response';
import {
  GetAllMineProducts,
  createProduct,
  updateProduct,
} from '../interfaces/productInterface';

class ProductController {
  async createProduct(
    req: Request,
    request: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (req.file) {
        req.body.imageUrl = req.file.path;
      }

      const userId = request.userId;

      const product = await ProductService.createProduct(req.body, `${userId}`);

      response(res, 201, {
        status: true,
        message: 'Your Product created successfully.',
        data: { product },
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await ProductService.getAllProducts();

      response(res, 200, {
        status: true,
        message: `no. of all products: ${products.length}`,
        data: { products },
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllMineProducts(
    req: Request,
    request: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = request.userId;

      const obj: GetAllMineProducts = {
        userId: `${userId}`,
      };

      const products = await ProductService.getAllMineProducts(obj);

      response(res, 200, {
        status: true,
        message: `no. of your products: ${products.length}`,
        data: { products },
      });
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = parseInt(req.params.id);

      const product = await ProductService.getProductById(productId);

      response(res, 200, {
        status: true,
        message: `Your target product is found.`,
        data: { product },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(
    req: Request,
    request: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const productId = parseInt(req.params.id);
      const { title, imageUrl, price } = req.body;
      const userId = request.userId;

      const obj: updateProduct = {
        title,
        imageUrl,
        price,
      };

      const product = await ProductService.updateProduct(
        obj,
        `${userId}`,
        productId,
      );

      response(res, 200, {
        status: true,
        message: `Your product updated successfully.`,
        data: { product },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(
    req: Request,
    request: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const productId = parseInt(req.params.id);
      const userId = request.userId;

      await ProductService.deleteProduct(`${userId}`, productId);

      response(res, 204, {
        status: true,
        message: 'Your product deleted successfully.',
      });
    } catch (error) {
      next(error);
    }
  }
}

const productController = new ProductController();
export default productController;

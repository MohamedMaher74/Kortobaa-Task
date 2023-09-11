import { PrismaClient } from '@prisma/client';
import ApiError from '../utils/ApiError';
import {
  GetAllMineProducts,
  createProduct,
  updateProduct,
} from '../interfaces/productInterface';
import { error } from 'console';

const prisma = new PrismaClient();

class ProductService {
  async createProduct(data: createProduct, userId: string) {
    try {
      const { title, price, imageUrl } = data;

      const product = await prisma.product.create({
        data: {
          title,
          price,
          imageUrl,
          user: {
            connect: { id: +userId },
          },
        },
      });

      return product;
    } catch (error) {
      throw error;
    }
  }

  async getAllProducts() {
    try {
      const products = await prisma.product.findMany();

      return products;
    } catch (error) {
      throw error;
    }
  }

  async getAllMineProducts(data: GetAllMineProducts) {
    try {
      const { userId } = data;

      const products = await prisma.product.findMany({
        where: {
          userId: +userId,
        },
      });

      return products;
    } catch (error) {
      throw error;
    }
  }

  async getProductById(productId: number) {
    try {
      const product = await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

      if (!product) {
        throw new ApiError(
          `There is no product with this id: ${productId}`,
          404,
        );
      }

      return product;
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(data: updateProduct, userId: string, productId: number) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new ApiError(
          `There is no product with this id: ${productId}`,
          404,
        );
      }

      const user = await prisma.user.findUnique({ where: { id: +userId } });

      if (!user) {
        throw new ApiError(`There is no user with this id ${userId}`, 404);
      }

      if (user.role === 'user') {
        if (product.userId !== +userId) {
          throw new ApiError(
            'You are not allowed to do this action, you are not prodcut owner',
            403,
          );
        }

        const updatedProduct = await prisma.product.update({
          where: {
            id: productId,
            userId: +userId,
          },
          data,
        });

        return updatedProduct;
      }

      //todo) role -> admin
      const updatedProduct = await prisma.product.update({
        where: {
          id: productId,
        },
        data,
      });

      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(userId: string, productId: number) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new ApiError(
          `There is no product with this id: ${productId}`,
          404,
        );
      }

      const user = await prisma.user.findUnique({ where: { id: +userId } });

      if (!user) {
        throw new ApiError(`There is no user with this id ${userId}`, 404);
      }

      if (user.role === 'user') {
        if (product.userId !== +userId) {
          throw new ApiError(
            'You are not allowed to do this action, you are not prodcut owner',
            403,
          );
        }

        await prisma.product.delete({
          where: {
            id: productId,
            userId: +userId,
          },
        });
      }

      //todo) role -> admin
      await prisma.product.delete({
        where: {
          id: productId,
          userId: +userId,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}

export default new ProductService();

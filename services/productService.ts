import { PrismaClient } from '@prisma/client';
import ApiError from '../utils/ApiError';
import { createProduct, updateProduct } from '../interfaces/productInterface';

const prisma = new PrismaClient();

class ProductService {
  async createProduct(data: createProduct, userId: number) {
    try {
      const { title, price, imageUrl } = data;

      const product = await prisma.product.create({
        data: {
          title,
          price: +price,
          imageUrl,
          userId,
        },
      });

      return product;
    } catch (error) {
      throw error;
    }
  }

  async getAllProducts({
    search,
    sort,
    limit,
    skip,
  }: {
    search?: string;
    sort?: string;
    limit?: number;
    skip?: number;
  }) {
    try {
      const products = await prisma.product.findMany({
        where: {
          title: {
            contains: search || undefined,
          },
        },
        orderBy: {
          [sort || 'createdAt']: 'desc',
        },
        take: limit || undefined,
        skip: skip || undefined,
        include: {
          user: {
            select: {
              id: true,
              fullname: true,
              email: true,
            },
          },
        },
      });

      return products;
    } catch (error) {
      throw error;
    }
  }

  async getAllMineProducts(userId: number) {
    try {
      const products = await prisma.product.findMany({
        where: {
          userId: +userId,
        },
        include: {
          user: {
            select: {
              id: true,
              fullname: true,
              email: true,
            },
          },
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
        include: {
          user: {
            select: {
              id: true,
              fullname: true,
              email: true,
            },
          },
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

  async updateProduct(data: updateProduct, userId: number, productId: number) {
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

      const { price } = data;

      if (price) {
        data.price = +data.price!;
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

  async deleteProduct(userId: number, productId: number) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: +productId },
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
        if (+product.userId !== +userId) {
          throw new ApiError(
            'You are not allowed to do this action, you are not prodcut owner',
            403,
          );
        }

        await prisma.product.delete({
          where: {
            id: +productId,
          },
        });
      }

      //todo) role -> admin
      await prisma.product.delete({
        where: {
          id: +productId,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}

export default new ProductService();

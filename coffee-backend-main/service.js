import { PrismaClient } from '@prisma/client';
import argon from 'argon2';
import jwt from 'jsonwebtoken';

export class coffeeService {
  prisma = new PrismaClient();

  async login(login, password, res) {
    const user = await this.prisma.user.findUnique({
      where: {
        login,
      },
    });

    if (!user) {
      res.status(404);
    }

    if (await argon.verify(user.password, password)) {
      const token = this.generateToken(user.login, user.id);
      res
        .cookie('coffee-token', token, {
          maxAge: 1000 * 60 * 1440 * 7,
        })
        .send('cookie set');
    } else {
      res.status(406).json({ error: 'Неверный пароль' });
    }
  }

  async signup(login, password, name, surname, phone, address, res) {
    const passwordHash = await argon.hash(password);
    let user;
    try {
      user = await this.prisma.user.create({
        data: {
          login,
          password: passwordHash,
          name,
          surname,
          phone,
          address,
        },
      });
    } catch (e) {
      console.log(e);
      res.status(409).json({ error: 'Пользователь уже существует' });
    }

    if (user) {
      const token = this.generateToken(user.login, user.id);
      res
        .cookie('coffee-token', token, {
          maxAge: 1000 * 60 * 1440 * 7,
        })
        .send('cookie set');
    }
  }

  async getAllProducts(req) {
    const token = req.cookies['coffee-token'];
    const userId = this.getUserIdFromToken(token);

    const products = await this.prisma.product.findMany({
      include: {
        basket: {
          where: { isDeleted: false, userId },
        },
      },
    });

    for (const item of products) {
      if (item.basket.length) {
        item.inBasket = true;
      } else {
        item.inBasket = false;
      }
      delete item.basket;
    }

    return products;
  }

  async controlBasket(productId, value, req) {
    const token = req.cookies['coffee-token'];
    const userId = this.getUserIdFromToken(token);
    await this.prisma.basket.upsert({
      where: {
        UserIdToProductIdUnique: {
          userId,
          productId,
        },
      },
      update: {
        isDeleted: value,
      },
      create: {
        userId,
        productId,
        isDeleted: value,
      },
    });
  }

  async getBasket(req) {
    const token = req.cookies['coffee-token'];
    const userId = this.getUserIdFromToken(token);
    const basket = await this.prisma.basket.findMany({
      where: {
        userId,
        isDeleted: false,
      },
      include: {
        product: true,
      },
    });

    let products = [];

    for (const item of basket) {
      products.push(item.product);
    }

    return products;
  }

  async getDetailedProduct(productId) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: parseInt(productId),
      },
      include: {
        basket: {
          select: {
            id: true,
          },
          where: {
            isDeleted: false,
          },
        },
        productToOrder: {
          select: {
            id: true,
          },
        },
      },
    });

    return product;
  }

  async createOrder(req, productIds, name, surname, phone, address) {
    const token = req.cookies['coffee-token'];
    const userId = this.getUserIdFromToken(token);

    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    let totalPrice = 0;

    for (const item of products) {
      totalPrice = totalPrice + item.price;
    }

    const order = await this.prisma.order.create({
      data: {
        userId,
        name,
        surname,
        phone,
        address,
        price: totalPrice,
      },
    });

    let productToOrderItems = [];
    for (const id of productIds) {
      productToOrderItems.push({ orderId: order.id, productId: id });
    }

    await this.prisma.productToOrder.createMany({
      data: productToOrderItems,
    });

    await this.prisma.basket.updateMany({
      where: {
        userId,
        isDeleted: false,
      },
      data: {
        isDeleted: true,
      },
    });
  }

  async getProfile(req) {
    const token = req.cookies['coffee-token'];
    const userId = this.getUserIdFromToken(token);

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        basket: {
          where: {
            isDeleted: false,
          },
        },
      },
    });

    const order = await this.prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        productToOrder: {
          select: {
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return { user, order };
  }

  async getReport() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        login: true,
        createdAt: true,
      },
    });

    const orders = await this.prisma.order.findMany({
      include: {
        productToOrder: {
          select: {
            product: {
              select: {
                name: true,
              },
            },
          },
        },
        user: {
          select: {
            login: true,
          },
        },
      },
    });

    let products = await this.prisma.productToOrder.groupBy({
      by: ['productId'],
      _count: true,
    });

    products = products.sort((a, b) => b._count - a._count)[0];

    const popularProduct = await this.prisma.product.findUnique({
      where: {
        id: products.productId
      }
    });

    popularProduct.countSales = products._count

    return { users, orders, popularProduct };
  }

  generateToken(login, userId) {
    return jwt.sign({ login, userId }, process.env.SECRET, { expiresIn: '7d' });
  }

  getUserIdFromToken(token) {
    const decodedToken = jwt.verify(token, process.env.SECRET);

    const userId = decodedToken.userId;

    return userId;
  }
}

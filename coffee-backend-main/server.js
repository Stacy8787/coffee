import express from 'express';
import { verifyToken } from './helpers.js';
import { coffeeService } from './service.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import _ from 'lodash';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
const port = 3000;
const service = new coffeeService();

app.post('/login', async (req, res) => {
  const { login, password } = req.body;
  if (_.isEmpty(login) || _.isEmpty(password)) {
    res.status(403).json({ error: 'Заполните все поля' });
    return;
  }

  return await service.login(login, password, res);
});

app.post('/signup', async (req, res) => {
  const { login, password, name, surname, phone, address } = req.body;
  if (
    _.isEmpty(login) ||
    _.isEmpty(password) ||
    _.isEmpty(name) ||
    _.isEmpty(surname) ||
    _.isEmpty(phone) ||
    _.isEmpty(address)
  ) {
    res.status(403).json({ error: 'Заполните все поля' });
    return;
  }
  return await service.signup(login, password, name, surname, phone, address, res);
});

app.get('/catalog', verifyToken, async (req, res) => {
  const products = await service.getAllProducts(req);
  return res.json({
    products,
  });
});

app.post('/control-basket', verifyToken, async (req, res) => {
  const { productId, value } = req.body;

  await service.controlBasket(productId, value, req);

  res.send('ok');
});

app.get('/basket', verifyToken, async (req, res) => {
  const products = await service.getBasket(req);
  res.json({ products });
});

app.post('/create-order', verifyToken, async (req, res) => {
  const { productIds, name, surname, phone, address } = req.body;
  if (
    _.isEmpty(productIds) ||
    _.isEmpty(name) ||
    _.isEmpty(surname) ||
    _.isEmpty(phone) ||
    _.isEmpty(address)
  ) {
    res.status(403).json({ error: 'Заполните все поля' });
    return;
  }
  await service.createOrder(req, productIds, name, surname, phone, address);
  res.send('Заказ создан');
});

app.get('/profile', verifyToken, async (req, res) => {
  const info = await service.getProfile(req);
  res.json(info);
});

app.post('/detailed-product', verifyToken, async (req, res) => {
  const { productId } = req.body;
  const product = await service.getDetailedProduct(productId)
  res.json(product);
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});

const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');
const authentication = require('../middleware/is-auth');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', authentication, shopController.getCart);

router.post('/cart', authentication, shopController.postCart);

router.post('/cart-delete-item', authentication, shopController.postCartDeleteProduct);

router.post('/create-order', authentication, shopController.postOrder);

router.get('/orders', authentication, shopController.getOrders);

module.exports = router;

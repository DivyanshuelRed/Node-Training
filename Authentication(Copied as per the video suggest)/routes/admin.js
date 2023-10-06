const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');
const authentication = require('../middleware/is-auth');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', authentication, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', authentication, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', authentication, adminController.postAddProduct);

router.get('/edit-product/:productId', authentication, adminController.getEditProduct);

router.post('/edit-product', authentication, adminController.postEditProduct);

router.post('/delete-product', authentication, adminController.postDeleteProduct);

module.exports = router;

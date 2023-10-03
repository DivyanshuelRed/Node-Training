const path = require('path');
const express = require('express');
const rootDir = require('../util/path');
const productsController = require("../controllers/products")
const router = express.Router();
const products =[];

router.get('/add-product', productsController.getAddProduct);

router.post('/add-product', productsController.postAddProduct);

module.exports = router;

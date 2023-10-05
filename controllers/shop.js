const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res) => { 
  Product.fetchAll().then(prod => {
      res.render('shop/product-list', { prods: prod, pageTitle: 'All Products', path: '/products'});
    })
    .catch(e => console.log(e));
};

exports.getProduct = (req, res) => {
  const prodId = req.params.productId;
  Product.findById(prodId).then(prod => { res.render('shop/product-detail', { product: prod,pageTitle: prod.title, path: '/products'});
  }).catch(err => console.log(err));
};

exports.getIndex = (req, res) => {
  Product.fetchAll().then(prod => { res.render('shop/index', { prods: prod,pageTitle: 'Shop',path: '/' });
    }).catch(err => console.log(err));
};

exports.getCart = (req, res) => { req.user.getCart().then(products => {
      res.render('shop/cart', { path: '/cart',pageTitle: 'Your Cart',products: products});
    }).catch(err => console.log(err));
};

// exports.postCart = (req, res) => {
//   const prodId = req.body.productId;
//   Product.findById(prodId, product => Cart.addProduct(prodId, product.price));
//   res.redirect('/cart');
// };

// exports.postCartDeleteProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   Product.findById(prodId, product => { Cart.deleteProduct(prodId, product.price);
//     res.redirect('/cart');
//   });
// };


exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user.getCart().then(cart => { fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    }).then(products => { let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findById(prodId);
    }).then(product => { return fetchedCart.addProduct(product, { through: { quantity: newQuantity }});
    }).then(() => res.redirect('/cart'))
    .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => { const prodId = req.body.productId;
  req.user.getCart().then(cart => { return cart.getProducts({ where: { id: prodId } })})
    .then(products => { const product = products[0]; 
      return product.cartItem.destroy();
    }).then(result => res.redirect('/cart'))
      .catch(err => console.log(err));
};

exports.postOrder = (req, res) => {
  let fetchedCart;
  req.user.getCart().then(cart => { fetchedCart = cart;
      return cart.getProducts();
    }).then(prod => { return req.user.createOrder().then(order => {
          return order.addProducts(
            prod.map(product => { product.orderItem = { quantity: product.cartItem.quantity };
              return product;}));
        }).catch(err => console.log(err));
    }).then(() => { return fetchedCart.setProducts(null) })
    .then(() =>  res.redirect('/orders')) .catch(err => console.log(err));
};

exports.getOrders = (req, res) => { res.render('shop/orders', { path: '/orders', pageTitle: 'Your Orders' })};

exports.getCheckout = (req, res) => { res.render('shop/checkout', { path: '/checkout', pageTitle: 'Checkout' })};

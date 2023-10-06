const Product = require("../models/product")

// exports.getAddProduct = (req, res, next) => {

//     res.render('add-product', {
//       pageTitle: 'Add Product',
//       path: '/admin/add-product',
//       formsCSS: true,
//       productCSS: true,
//       activeAddProduct: true
//     });
//     //res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
//   };

//   exports.postAddProduct = (req, res, next) => {
//     const product = new Product(req.body.title);
//     product.save();
//     res.redirect('/');
//   }

//   exports.getProducts = (req, res, next) => {
//     const products = Product.fetchAll((products)=>{
//         res.render('shop', {
//             prods: products,
//             pageTitle: 'Shop',
//             path: '/',
//             hasProducts: products.length > 0,
//             activeShop: true,
//             productCSS: true
//           });
//     });
//     //res.render('shop',{prods: products,docTitle:"Shop"});
    
//   }



const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title,price,description, imageUrl);
  product.save().then(result => res.redirect("/admin/products"))
  
};

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;

  Product.findById(prodId).then(prod=> {
    if (!prod) { return res.redirect('/') }
    res.render('admin/edit-product', { pageTitle: 'Edit Product', path: '/admin/edit-product', editing: editMode, product: prod});
  }).catch(e => console.log(e));
};

exports.postEditProduct = (req, res) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  const updatedProduct = new Product(updatedTitle,updatedDesc,updatedImageUrl,new ObjectId(prodId));
  updatedProduct.save().then(()=> res.redirect('/admin/products'));
};

exports.getProducts = (req, res) => { Product.fetchAll(prod => {
   res.render('admin/products', { prods: prod, pageTitle: 'Admin Products', path: '/admin/products' });
  });
};

exports.postDeleteProduct = (req, res) => {  const prodId = req.body.productId;
  Product.deleteById(prodId).then(() => res.redirect('/admin/products'))
  .catch(e => console.log(e));
};
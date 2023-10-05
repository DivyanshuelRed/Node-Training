//const products =[];
// const fs = require("fs");
// const path = require("path");
// const Cart = require("./cart")


// module.exports = class Product {
//     constructor(title) {
//         this.title = title;
//     }
//     save() {
//         //products.push(this);
//         const p = path.join(path.dirname(process.mainModule.filename),"data","products.json");
//         fs.readFile(p,(err,fileContent)=>{
//             let products = [];
//             if(!err){
//                 products = JSON.parse(fileContent);
//             }
//             products.push(this);
//             fs.writeFile(p,JSON.stringify(products),(err)=>{
//                 console.log(err);
//             });
//         });
//     }
//     static fetchAll(cb) {
//         fs.readFile(p,(err, fileContent)=>{
//             if(err){
//                 cb([]);
//             }
//            cb(JSON.parse(fileContent));
//         })
//         return products;
//     }
// }

// const p = path.join(
//     path.dirname(process.mainModule.filename),
//     'data',
//     'products.json'
//   );
  
//   const getProductsFromFile = cb => {
//     fs.readFile(p, (err, fileContent) => {
//       if (err) {
//         cb([]);
//       } else {
//         cb(JSON.parse(fileContent));
//       }
//     });
//   };
  
//   module.exports = class Product {
//     constructor(title, imageUrl, description, price) {
//       this.title = title;
//       this.imageUrl = imageUrl;
//       this.description = description;
//       this.price = price;
//     }
  
//     save() {
//       this.id = Math.random().toString();
//       getProductsFromFile(products => {
//         // products.push(this);
//         // fs.writeFile(p, JSON.stringify(products), err => {
//         //   console.log(err);
//         // });

//         if (this.id) { const existingProductIndex = products.findIndex( prod => prod.id === this.id);
//           const updatedProducts = [...products];
//           updatedProducts[existingProductIndex] = this;
//           fs.writeFile(p, JSON.stringify(updatedProducts), err => console.log(err));
//         } else {
//           this.id = Math.random().toString();
//           products.push(this);
//           fs.writeFile(p, JSON.stringify(products), err => console.log(err));
//         }})
//     }
  
//     static fetchAll(cb) {
//       getProductsFromFile(cb);
//     }

//     static findById(id, cb) {
//       getProductsFromFile(products => {
//         const product = products.find(p => p.id === id);
//         cb(product);
//       });
//     }


//     static deleteById(id) {
//       getProductsFromFile(products => {
//         const product = products.find(prod => prod.id === id);
//         const updatedProducts = products.filter(prod => prod.id !== id);
//         fs.writeFile(p, JSON.stringify(updatedProducts), err => {
//           if (!err) { Cart.deleteProduct(id, product.price) }
//         })
//       })
//     }

//   };



const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;
class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) { dbOp = db.collection('products').updateOne({ _id: this._id }, { $set: this });
    } else { dbOp = db.collection('products').insertOne(this); }
    return dbOp.then(res => console.log(res)).catch(e => console.log(e));
  }

  static fetchAll() {
    const db = getDb();
    return db.collection('products').find().toArray().then(p => {return p}).catch(err => console.log(err));
  }

  static findById(prodId) {
    const db = getDb();
    return db.collection('products').find({ _id: new mongodb.ObjectId(prodId) }).next().then(prod => { return prod }).catch(e => console.log(e));
  }

  static deleteById(prodId) {
    const db = getDb();
    return db.collection('products').deleteOne({ _id: new mongodb.ObjectId(prodId) }).then(result => console.log(result)).catch(e => console.log(e) );
  }
}

module.exports = Product;
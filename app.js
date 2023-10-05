const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const expressHbs = require("express-handlebars");
const errorController = require("./controllers/error");
//app.engine('hbs',expressHbs({layoutsDir: 'views/layouts/',defaultLayout:"main-layout"}));
const mongoConnect = require("./util/database").mongoConnect;
const User = require('./models/user');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
    User.findById('651e9a68de513f1c86c3c902').then(user => { req.user = new User(user.name, user.email, user.cart, user._id); next();
      }).catch(err => console.log(err));
  });

app.use(errorController.get404);

mongoConnect(() => app.listen(3000))

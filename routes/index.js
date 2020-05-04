var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Product = require('../models/product');
var Category = require('../models/category');
var mid = require('../middleware');
var ObjectId = require('mongodb').ObjectId

// POST /admin/add/category
router.post('/admin/add/category', mid.isAdmin, function (req, res, next) {
  if (req.body.title) {

    // create category
    var categoryData = {
      title: req.body.title,
    };

    // use schema's create method
    Category.create(categoryData, function(error, user) {
      if (error) {
        return next(error);
      } else {
        return res.redirect('/shop');
      }
    });

  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})

// GET /admin/add/category
router.get('/admin/add/category', mid.isAdmin, function (req, res, next) {
  return res.render('admin/add/category', {title: 'Add a CATegory'});
})

// POST /admin/add/product
router.post('/admin/add/product', mid.isAdmin, function (req, res, next) {
  if (req.body.title &&
    req.body.description &&
    req.body.price) {

    // create product
    var productData = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price
    };

    // use schema's create method
    Product.create(productData, function(error, user) {
      if (error) {
        return next(error);
      } else {
        return res.redirect('/shop');
      }
    });


  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})

// GET /admin/add/product
router.get('/admin/add/product', mid.isAdmin, function (req, res, next) {
  Category.find({})
      .exec(function (error, categories) {
        if (error) {
          return next(error);
        } else {
          return res.render('admin/add/product', {title: 'Add a toy, meow', categories: categories});
        }
      });
})

// GET /shop/product_id
router.get('/shop/:_id', function (req, res, next) {
  var id = ObjectId(req.params._id);
  Product.findById(id)
          .exec(function (err, product) {
            if (err) {
              return next(err);
            } else {
              return res.render('shop/product', { title: product.title, product: product})
            }
          })
})

// GET /shop
router.get('/shop', function (req, res, next) {
  Product.find({})
      .exec(function (error, products) {
        if (error) {
          return next(error);
        } else {
          return res.render('shop', { title: 'Shop', products: products });
        }
      });
})

// GET /logout
router.get('/logout', function(req, res, next) {
  if (req.session) {
    req.session.destroy(function(err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    })
  }
})

// GET /profile
router.get('/profile', mid.requiresLogin, function(req, res, next) {
  User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
          return res.render('profile', { title: 'Profile', login: user.login });
        }
      });
});

// GET /login
router.get('/login', mid.loggedOut, function(req, res, next) {
  return res.render('login', {title: 'Log In'});
});

//POST /login
router.post('/login', function(req, res, next) {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function(error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  } else {
    var err = new Error('Email and password are required');
    err.status = 401;
    return next(err);
  }
})

// GET /register
router.get('/register', mid.loggedOut, function(req, res, next) {
  return res.render('register', { title: 'Sign Up'});
});

// POST /register
router.post('/register', function(req, res, next) {
  if (req.body.login &&
    req.body.email &&
    req.body.password &&
    req.body.confirmPassword) {

    // confirm password match
    if (req.body.password !== req.body.confirmPassword) {
      var err = new Error('Passwords do not match.');
      err.status = 400;
      return next(err);
    }

    // create user
    var userData = {
      login: req.body.login,
      email: req.body.email,
      password: req.body.password
    };

    // use schema's create method
    User.create(userData, function(error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });


  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})

// GET /
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Home' });
});

// // GET /about
// router.get('/about', function(req, res, next) {
//   return res.render('about', { title: 'About' });
// });

// // GET /contact
// router.get('/contact', function(req, res, next) {
//   return res.render('contact', { title: 'Contact' });
// });

module.exports = router;

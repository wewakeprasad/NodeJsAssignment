const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/user');

// Load Emp Model
const Employee = require('../models/employee');
const { forwardAuthenticated } = require('../config/auth');
var path=require('path');

//router.set('views', path.join(__dirname, 'views'));

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

// added

//Router Controller for UPDATE request
router.post('/addBand', (req,res) => {
  console.log(req.body._id)
  if (req.body._id == '')
  insertIntoMongoDB(req, res);
  else
  updateIntoMongoDB(req, res);
  });
   
  //Creating function to insert data into MongoDB
  function insertIntoMongoDB(req,res) {
  var musicBand = new musicBand();
  musicBand.name = req.body.name;
  musicBand.gerne = req.body.gerne;
  
  musicBand.save((err, doc) => {
  if (!err)
  res.redirect('/list');
  else
  console.log('Error during record insertion : ' + err);
  });
  console.log('Data Inserted');
  }
   
  //Creating a function to update data in MongoDB
  function updateIntoMongoDB(req, res) {
  Employee.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
  if (!err) { res.render("/list"); }
  else {
  if (err.name == 'ValidationError') {
  handleValidationError(err, req.body);
  res.render("/dashboard", {
  //Retaining value to be displayed in the child view
  viewTitle: 'Update Band Details',
  employee: req.body
  });
  }
  else
  console.log('Error during updating the record: ' + err);
  }
  })
  console.log('Data Updated');
  }
   
  //Router to retrieve the complete list of available courses
  router.get('/list', (req,res) => {
  Employee.find((err, docs) => {
  if(!err){
  res.render("/list", {
  list: docs
  });
  }
  else {
  console.log('Failed to retrieve the Band List: '+ err);
  }
  });
  });
   
  //Creating a function to implement input validations
  function handleValidationError(err, body) {
  for (field in err.errors) {
  switch (err.errors[field].path) {
  case 'employeeName':
  body['employeeNameError'] = err.errors[field].message;
  break;
  default:
  break;
  }
  }
  }
   
  //Router to update a employee using it's ID
  router.get('/:id', (req, res) => {
  Employee.findById(req.params.id, (err, doc) => {
  if (!err) {
  res.render("/dashboard", {
  viewTitle: "Update Band Details",
  employee: doc
  });
  }
  });
  });
   
  //Router Controller for DELETE request
  router.get('/delete/:id', (req, res) => {
  Employee.findByIdAndRemove(req.params.id, (err, doc) => {
  if (!err) {
  res.redirect('/list');
  }
  else { console.log('Failed to Delete  Details: ' + err); }
  });
  });

module.exports = router;

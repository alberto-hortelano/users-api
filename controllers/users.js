var User = require('../models/user');
var express = require('express');
var router = express.Router();

express().use('/', router);

// GET /users
// Get a list of users
router.get('/', function(req, res) {
  console.log('router.get');
  User.find({}, function(err, users) {
    if (err) {
      return res.status(500).json({
        error: "Error listing users: " + err
      });
    }

    res.json(users);
  });
});

// GET /users/:id
// Get a user by ID
router.get('/:id', function(req, res) {
  User.findOne({
    _id: req.params.id
  }, function(err, user) {
    if (err) {
      return res.status(500).json({
        error: "Error reading user: " + err
      });
    }

    if (!user) {
      return res.status(404).end();
    }

    res.json(user);
  });
});

// POST /users
// Create new user
router.post('/', function(req, res) {
  console.log('Start User creation');
  var newUser = new User(req.body);
  User.create(newUser, function (err, user) {
    console.log(err);
    if (err) {
      return res.status(500).json({
        error: "Error reading user: " + err
      });
    }

    if (!user) {
      //return res.status(404).end();
    }
    res.json(user);
  });
});

// PUT /users/:id
// Update an existing user
router.put('/:id', function(req, res) {
  var newProps = {};
  var allowedProperies = [
    'gender',
    'name',
    'location',
    'email',
    'username',
    'password',
    'phone',
    'cell',
    'PPS',
    'picture'
  ];
  for (var porp in req.body) {
    if (allowedProperies.indexOf(porp) >= 0) {
      newProps[porp] = req.body[porp];
    }
  }
  User.update({_id: req.params.id}, newProps, function(err, user) {
    if (err) {
      console.log(err);
      return res.status(500).json({
        error: "Error reading user: " + err
      });
    }

    if (!user) {
      return res.status(404).end();
    }

    console.log('Pre Update User ',user);
    return res.status(200).end();
  });
});

// DELETE /users
// Delete an existing users
router.delete('/:id', function(req, res) {
  console.log('Deleting User',req.params.id);
  User.remove({
    _id: req.params.id
  }, function(err, user) {
    if (err) {
      return res.status(500).json({
        error: "Error reading user: " + err
      });
    }
    if (!user) {
      return res.status(404).end();
    }
    console.log('Deleted!');
    res.json(user);
  });
});

module.exports = router;

var User = require('../models/user');
var express = require('express');
var router = express.Router();


// GET /users
// Get a list of users
router.get('/', function(req, res) {
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
  console.log(req.body);
  User.create(req.body, function (err, user) {
    console.log(err);
    if (err) {
      return res.status(500).json({
        error: "Error reading user: " + err
      });
    }

    if (!user) {
      //return res.status(404).end();
    }

    console.log('create User :)');
    console.log(JSON.stringify(user));
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
      console.log(user);

    if (!user) {
      //return res.status(404).end();
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


/*

  "gender": "female",
  "name": {
    "title": "miss",
    "first": "allie",
    "last": "willis"
  },
  "location": {
    "street": "7135 the crescent",
    "city": "Leixlip",
    "state": "colorado",
    "zip": 37191
  },
  "email": "allie.willis@example.com",
  "username": "crazybear293",
  "password": "3232",
  "salt": "UVMKO1Tj",
  "md5": "b7441c556f250fe6ebb3367ba708d4b6",
  "sha1": "fc79c95d01ca351efdf283331f39f2384db1dd78",
  "sha256": "999afe92c680c6d74412ff438c8d0901028805caf66aeff536e0eed52e758d55",
  "registered": 1216343814,
  "dob": 253933290,
  "phone": "041-379-5675",
  "cell": "081-471-3648",
  "PPS": "9408385T",
  "picture": {
    "large": "https://randomuser.me/api/portraits/women/19.jpg",
    "medium": "https://randomuser.me/api/portraits/med/women/19.jpg",
    "thumbnail": "https://randomuser.me/api/portraits/thumb/women/19.jpg"
  }
 */

var express = require('express');
var mongoose = require('mongoose');
var cors = require('cors');
var morgan = require('morgan');
var path = require('path');
var marked = require('marked');
var fs = require('fs');
var logger = require('winston');
var userController = require('./controllers/users');
var bodyParser = require('body-parser');
var app = express();
var router = express.Router();

app.use('/', router);

// Add middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
console.log(path.join(__dirname, 'users-api-key.pem'));

app.get('/', function(req, res, err) { // eslint-disable-line no-unused-vars
  var md = function(filename) {
    var path = __dirname + "/" + filename;
    var include = fs.readFileSync(path, 'utf8');
    var html = marked(include);

    return html;
  };

  return res.render('index.ejs', {
    "md": md
  });
});

// See the User Controller for `/users` routes
app.use('/users', userController);


// Some switches for acceptance tests
if (require.main === module) {
  // Only require https if app.js is run


  // Only connect to MongoDB if app.js is run
  // If require'd (e.g. in tests), let these tests establish a DB connection themselves
  mongoose.connect('mongodb://localhost/users');

  var db = mongoose.connection;
  // Listen for errors on connection
  db.on('error', console.error.bind(console, 'connection error:'));
  // Start Listening on connection ok

  db.once('open', function() {
    // Only listen when app.js is run - acceptance tests will listen on another port
    // HTTP server
    app.listen(8000, function() {
      logger.info('Listening at http://localhost:8000 - see here for API docs');
    });
    // HTTPS server, ready for usage with the correct certificates
    /*
    var http = express();
    var https = require('https');

    // CORS
    http.get('*',function(req,res){
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");

    });
    https.createServer({
      key: fs.readFileSync(path.join(__dirname, 'users-api-key.pem')),
      cert: fs.readFileSync(path.join(__dirname, 'users-api-cert.pem'))
    }, app).listen(8000, function() {
      logger.info('Listening at https://localhost:8000 - see here for API docs');
    });
    */
  });
  module.exports = app;
}else{
  // Export app for tests
  module.exports = app;
}

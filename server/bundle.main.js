/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 13);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var mongoose = __webpack_require__(1);
var Schema = mongoose.Schema;
var passportLocalMongoose = __webpack_require__(14);

/** 
 * @function Schema(Schema)
 * @desc New Account Schema
 * @param {object} Schema - represents a user's schema with username and password. 
 */
var Account = new Schema({
  username: String,
  password: String
});

/** Registers the passport-mongoose plugin with our Schema with built in salting and hashing of password! :) */
Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("passport");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var express = __webpack_require__(0);
var passport = __webpack_require__(3);
var Account = __webpack_require__(2);
var api = __webpack_require__(11);

var router = express.Router();

/**
 * this will be the entry level of our API from which all requests branch.
 */
router.use('/api', api);

router.get('/', function (req, res) {
    res.render('index', { user: req.user });
});

/**
 * a helper to get the currently logged user via our Vue Application.
 */
router.get('/user', function (req, res) {
    if (req.user) {
        res.send({ user: req.user.username });
    }
});

router.get('/register', function (req, res) {
    res.render('register', {});
});

router.post('/register', function (req, res) {
    Account.register(new Account({ username: req.body.username }), req.body.password, function (err, account) {
        if (err) {
            return res.render('register', { account: account });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

router.get('/login', function (req, res) {
    res.render('login', { user: req.user });
});

router.post('/login', passport.authenticate('local'), function (req, res) {
    res.redirect('/');
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("express-session");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("passport-local");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var mongoose = __webpack_require__(1);

// Define our TODOs schema to make use of the powerful databinding offered by mongoose.
var todo = new mongoose.Schema({
    title: String,
    description: String,
    completed: Boolean,
    user: String
});

module.exports = mongoose.model('Todo', todo);

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var express = __webpack_require__(0);
var api = express.Router();

var todo = __webpack_require__(12);

// Define routing on an API level

api.use('/todo', todo);

module.exports = api;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var express = __webpack_require__(0);
var model = __webpack_require__(10);

// allows us to define routes on the todo level specifically.
var todo = express.Router();

todo.route('/:user')
// List all todos
.get(function (req, res) {
    model.find({ 'user': req.params.user }, function (err, todos) {
        if (err) res.send(err);
        res.json(todos);
    });
})

// create a todo
.post(function (req, res) {
    var newtodo = new model({
        title: req.body.title,
        description: req.body.description,
        completed: req.body.completed,
        user: req.body.user
    });

    newtodo.save(function (err) {
        if (err) res.send(err);
        res.json({ message: 'todo Created!' });
    });
});

todo.route('/:user/:todoId')
// get a specific todo based on ID
.get(function (req, res) {
    model.find({ '_id': req.params.todoId, 'user': req.params.user }, function (err, todo) {
        if (err) res.send(err);
        res.json(todo);
    });
})

// modify a specific todo
.put(function (req, res) {
    var newtodo = model.findById(req.params.todoId, function (err, todo) {
        if (err) res.send(err);
        todo.title = req.body.title;
        todo.description = req.body.description;
        todo.completed = req.body.completed;

        todo.save(function (err) {
            if (err) res.send(err);
            res.json({ message: "todo Modified!" });
        });
    });
})

// delete a specific todo
.delete(function (req, res) {
    model.remove({
        _id: req.params.todoId
    }, function (err) {
        if (err) res.send(err);
        res.json({ message: 'Successfully Removed todo.' });
    });
});

module.exports = todo;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {

var path = __webpack_require__(9);
var http = __webpack_require__(7);

var routes = __webpack_require__(4);

/** Authetication using Passport js */
var passport = __webpack_require__(3);
var LocalStrategy = __webpack_require__(8).Strategy;

/**
 * very useful for a robust DB schema when using a noSQL database.
 */
var mongoose = __webpack_require__(1);
var express = __webpack_require__(0);
/**
 * for the parsing of API requests body.
 */
var bodyParser = __webpack_require__(5);

/**
 * Connection URL
 */
var url = 'mongodb://tester:tester@ds135820.mlab.com:35820/track';

/**
 * Use connect method to connect to the Server
 */
mongoose.connect(url);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(__webpack_require__(6)({
  secret: 'todo challenge',
  resave: false,
  saveUninitialized: false
}));

/** Config express to use passport as middleware */
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: false }));

/** Setup routing */
app.use('/', routes);

// passport config
var Account = __webpack_require__(2);
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

/**
 * using express' built in middleware to serve static frontend assets.
 */
app.use(express.static(path.join(__dirname, '../dist')));

var port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, function () {
  return console.log('API running on localhost:' + port);
});
/* WEBPACK VAR INJECTION */}.call(exports, "server"))

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("passport-local-mongoose");

/***/ })
/******/ ]);
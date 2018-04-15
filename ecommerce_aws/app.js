var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var { checkAdmin } = require('./services/auth');

var index = require('./routes/index');
var auth = require('./routes/auth');
var admin = require('./routes/admin/index');
var users = require('./routes/admin/users');
var products = require('./routes/admin/products');
var logs = require('./routes/admin/logs');
var cart = require('./routes/cart');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'very secret',
  resave: true,
  saveUninitialized: false
}));

// Routes
app.all("/admin", checkAdmin);
app.all("/admin/*", checkAdmin);
app.use('/', index);
app.use('/', auth);
app.use('/admin', admin);
app.use('/admin/users', users);
app.use('/admin/products', products);
app.use('/admin/logs', logs);
app.use('/cart', cart);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Página não encontrada!');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { title: 'Erro ' + err.status, session: req.session });
});

module.exports = app;

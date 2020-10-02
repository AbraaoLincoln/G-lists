var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//Code add

//Object needed to do the authetication.
require("dotenv").config();
const mongoose = require('mongoose');

//Connecting to the database
mongoose.connect(process.env.DATABASE, {useNewUrlParser: true});

//========

//Requering routes
var indexRouter = require('./routes/index');
var users = require('./routes/users');
var loginRouter = require('./routes/login/login');
var authRouter = require('./routes/authetication/authUser');
var createAcountRouter = require('./routes/createAcount/createAcount');
var taskManagerRouter = require('./routes/taskManager/taskManagerRouter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//Temporario.
app.use(express.static(path.join(__dirname, 'views/static/')));


app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/authenticateUser', authRouter);
app.use('/dashboard', users);
app.use('/taskManager', taskManagerRouter);
app.use('/createAcount', createAcountRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

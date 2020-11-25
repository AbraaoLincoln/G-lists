var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//Object needed to do the authetication.
require("dotenv").config();
const mongoose = require('mongoose');

//Connecting to the database
mongoose.connect(process.env.DATABASE, {useNewUrlParser: true, useUnifiedTopology: true });

//========

//Requering routes
var usersDashboard = require('./routes/userDashboard/users');
var loginRouter = require('./routes/login/login');
var logoutRouter = require('./routes/logout/logout');
var authRouter = require('./routes/authetication/authUser');
var createAcountRouter = require('./routes/createAcount/createAcount');
var taskManagerRouter = require('./routes/taskManager/taskManagerRouter');
// var apiRouter = require('./routes/api/apiRouter');
var userRouter = require('./routes/user/user');
var listRouter = require('./routes/list/list');
var taskRouter = require('./routes/task/task');
var newTaskManagerRouter = require('./routes/newTaskManager/newTaskManager');

var app = express();
// view engine setup
// app.set('views', path.join(__dirname, 'views'));

//Middleawares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//Temporario.
app.use(express.static(path.join(__dirname, 'views/pages/')));

//Route handles made by me.
app.use('/login', loginRouter);
app.use('/authenticateUser', authRouter);
app.use('/dashboard', usersDashboard);
app.use('/taskManager', taskManagerRouter);
app.use('/createAcount', createAcountRouter);
app.use('/logout', logoutRouter);
app.use('/user', userRouter);
// app.use('/api', apiRouter);
app.use('/list', listRouter);
app.use('/task', taskRouter);
app.use('/newTaskManager', newTaskManagerRouter);

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
  // res.render('error');
  res.end()
});

module.exports = app;

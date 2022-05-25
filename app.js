require('dotenv').config()
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const db = require('./models/db')
const hbs = require('hbs')
const session = require('express-session')

const adminRouter = require('./routes/admin');
const usersRouter = require('./routes/users');
const walletRouter = require('./routes/wallet')

const app = express();
var sess = {
  secret: 'secret key',
}


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper("inc", function(value, options){
  return parseInt(value) + 1;
});

app.use(session(sess))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next){
  res.locals.flash = req.session.flash
  delete req.session.flash
  next()
})

app.use('/admin', adminRouter);
app.use('/users', usersRouter);
app.use('/walletRouter', walletRouter);

app.get('/logout', (req, res) => {
  // req.session.username = null
  req.session.destroy(function(err) {
    if(err){
      return res.render('error', {message: err.message})
    }else{
      return res.redirect('/users/login')
    }
  })
})

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

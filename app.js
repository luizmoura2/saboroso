var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var formidable = require('formidable');
//================================
var http = require('http');
// passa o http-server par ao socketio
var socket = require('socket.io');
//================================
const redis = require('redis');
const session = require('express-session');
let RedisStore = require('connect-redis')(session)

let redisClient = redis.createClient({
  host: 'localhost',
  port: 6379,
  password: 'p@ssw0rd',
  db: 1
});

redisClient.unref()
redisClient.on('error', console.log)
//let store = new RedisStore({ client: redisClient })

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
const { copyFileSync } = require('fs');

var app = express();

var http =http.Server(app);
var io = socket(http)
// sempre que o socketio receber uma conexão vai devoltar realizar o broadcast dela
io.on('connection', function(socket){
  console.log('novo usuario conectado');
  /*socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });*/
});

app.use( (req, res, next)=>{ 
    if (['put', 'PUT', 'POST', 'post'].indexOf(req.method) > -1) {
      var form = formidable.IncomingForm({
        uploadDir:path.join(__dirname, '/public/images'),
        keepExtensions: true,
        multiples: true
      });

      form.parse(req, function(err, fields, files){
        req.fields = fields;
        req.files = files;
        next();
      });     
  }else{
    next();
  }  
  
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(
  session({
    store: new RedisStore({client: redisClient}),
    secret: 'p@ssw0rd',
    resave: true,
    saveUninitialized: true
  })
);

app.use(logger('dev'));
app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin', adminRouter);

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

// inicia o servidor na porta informada, no caso vamo iniciar na porta 3000
http.listen(3000, function(){
  console.log('Servidor rodando em: http://localhost:3000');
});

//module.exports = app;

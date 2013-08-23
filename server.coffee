#require internal libraries
myMiddleware = require "./business-layer/common/middleware"
myErrorHandler = require "./business-layer/common/errorHandler"
myAuthentication = require "./business-layer/common/authentication"
myRoutes = require "./business-layer/common/routes"
mySocketRoutes = require "./business-layer/common/socketroutes"

#require external libraries
express = require "express"
http = require "http"
winston = require "winston"
socket_io = require "socket.io"
lingua = require "lingua"
mongodb = require "connect-mongodb"
winstonMongoDB = require('winston-mongodb').MongoDB
myAuthentication.passport = require "passport"
myAuthentication.facebookStrategy = require "passport-facebook"
Event = require('events').EventEmitter

#process environment variables
mongodb_username = process.env.mongodb_username || "admin"
mongodb_password = process.env.mongodb_password || "whoislikingyou"
mongodb_port = process.env.mongodb_port || 10072
mongodb_host = process.env.mongodb_host || "alex.mongohq.com"
mongodb_database = process.env.mongodb_database || "whoislikingyou"
mongodbURL = "mongodb://"+ mongodb_username + ":" + mongodb_password + "@" + mongodb_host + ":" + mongodb_port + "/" + mongodb_database
port = process.env.PORT || 5000

#add custom event register
winston.add(winstonMongoDB, {db:mongodb_username, host:mongodb_host, port:mongodb_port, username:mongodb_username, password:mongodb_password})

#add passport
myAuthentication.boot()

#add Event Emitter
events = new Event()

#configure application
app = express()

app.set 'views', "./user-interface/views"
app.set 'view engine', 'toffee'
app.set 'db', mongodbURL
app.set 'port', port

app.locals.layout = './user-interface/views/layout.toffee'

if app.get("env") is "development"
	app.use express.logger('dev')

if app.get("env") is "production"
	winston.remove(winston.transports.Console)

app.use express.favicon('./public/images/favicon.ico')
app.use myMiddleware.type('multipart/form-data', express.limit('20mb'))

app.use lingua app, {defaultLocale: 'pt-PT', path: './user-interface/locales'}
app.use express.bodyParser({keepExtensions: true, uploadDir: "./public/uploads"})

#session support
session_store = new mongodb({url:mongodbURL})
app.use express.cookieParser('whoislikingyou') 
app.use express.session({key: 'sid', cookie: {maxAge: 3600000}, store: session_store })

app.use myAuthentication.passport.initialize()
app.use myAuthentication.passport.session()

app.use express.compress({level:9, memLevel:9})
app.use express.static('./public')

app.use app.router

if app.get("env") is "development"
	app.use express.errorHandler({dumpExceptions:true, showStack:true})
	app.disable('view cache')
else
	app.use myErrorHandler.logErrors
	app.use myErrorHandler.clientErrorHandler
	app.use myErrorHandler.errorHandler

myRoutes app, myAuthentication, events

server = http.createServer(app)

io = socket_io.listen(server)

if app.get("env") is "development"
	io.set("log level", 3)
else
	io.set("log level", false)

mySocketRoutes app, myAuthentication, io, session_store, events

server.listen app.get('port'), ->
	winston.log('info', 'Server up-and-running on port ' + server.address().port + ", in " +  app.get("env"))

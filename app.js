
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , init = require('./routes/init')
  , http = require('http')
  , path = require('path')
  , redis = require('redis')
  , client;

app = express();
client = redis.createClient();
client.on('error', function (err) {
    //console.log("Error " + err);
	throw err;
});
client.on('connect', function () {
	app.set('redis', client)
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/init', init.index);
app.get('/time', init.time);
app.get('/code', init.code);
app.get('/log', function(req, res){
	// Send no context to client
	res.send(204)
})
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

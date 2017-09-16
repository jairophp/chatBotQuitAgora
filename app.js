/**
 * Module dependencies.
 */

var express = require('express'),
routes = require('./routes'),
user = require('./routes/user'),
http = require('http'),
path = require('path'),
fs = require('fs');

var app = express();

var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var multipart = require('connect-multiparty')
var multipartMiddleware = multipart();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/style', express.static(path.join(__dirname, '/views/style')));

// development only
if ('development' == app.get('env')) {
	app.use(errorHandler());
}
var cloudant = require('cloudant')('https://00875567-fecf-466b-8992-bc616a7a698a-bluemix:933c2d8d3d11473e408cc5ee864814a9834ab32b398ac22deeec663e5d49e09e@00875567-fecf-466b-8992-bc616a7a698a-bluemix.cloudant.com');
cloudant = cloudant.db.use('vaidb');

var watson = require('watson-developer-cloud');

var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

app.get('/', routes.index);

var conversation = watson.conversation({
  username:'913884ff-9b39-4934-aeb9-93c9be622320',
  password:'4iNbdhk2BNis',
  version: 'v1',
  version_date: '2016-07-11'
});


var workspace = '8733526b-7ac5-4a8b-bc9b-6537b0510659';


app.post('/converse', function(req, res, next) {
  var payload = {
    workspace_id: workspace,
    context: {},
    input: {}
  };
  
  if (req.body) {
    if (req.body.input) {
      payload.input = {text: req.body.input};
    }
    if (req.body.context) {
      payload.context = req.body.context;
    }
  }else{
    payload = {};
      }
  conversation.message(payload, function(err, data){
    if ( err ) {
      console.log(err);
    }else{

      // if(!data.output.text[0]){
      //   data.output.text[0] = resposta[data.intents[0].intent];
      // }
      return res.json(data);
    }
  });

});


http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
	console.log('Express server listening on port ' + app.get('port'));
});


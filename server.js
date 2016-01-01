'use strict';

var app = require('express')(),
    serveStatic = require('serve-static'),
    bodyParser = require('body-parser'),
    go = require('./backend/GlobalObject'),
    logger = require('morgan'),
    wechatRouter = require('./backend/router/WeChatRouter');

app.use(logger('short'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(serveStatic('public'));
app.enable('view cache');

app.use('/wechat', wechatRouter);

// Welcome
app.get('/', function(req, res) {
    res.status(200).send('Welcome to Anywhere Node Server!');
});

app.listen(18080, function() {
    console.log('Server is running on 18080!');
});
process.env.NODE_ENV = 'production';

//go.updateMenu();
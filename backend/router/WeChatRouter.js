var express = require("express"),
  wechat = require('wechat'),
  go = require('../GlobalObject');

var router = express.Router({});

var eventArray = [
    'subscribe',
    'unsubscribe',
    'SCAN',
    'LOCATION',
    'CLICK',
    'VIEW',
    'scancode_push',
    'scancode_waitmsg',
    'pic_sysphoto',
    'pic_photo_or_album',
    'pic_weixin',
    'location_select'
  ];

router.post('/oauth', function(req, res) {
  console.log("go to oauth!");

  var code = req.body.code;

  go.wechatOAuth.getAccessToken(code, function(err, baseUserInfo){
    if(err) {
      console.error(err);
      res.send(500, err);
      return;
    } else{
      var query = {openid : baseUserInfo.data.openid};
      //var query = {openid : "oQ7SJt08meDJyOXyUwrZ3_b4FTNc"};
      go.collection.customer.find(query, function(err, userData){
        if(err) {
          res.send(500, err);
          return;
        }

        var resData = {};

        if(userData.length > 0){
          resData.isLogin = true;
        }else{
          resData.isLogin = false;
        }
        go.wechatOAuth.getUser(query, function(err, wechatUserInfo){
          if(err) {
            res.send(500, err);
            return;
          }
          resData.userinfo = wechatUserInfo;
          res.send(200,resData);
          return;
        });
      });
    }
  });
});

router.use('/*', wechat(go.config.base).text(function (message, req, res, next) {
  console.log('=== text message received ===');
  console.log(message);
  try{
    res.reply("Got your text message, test!");
  }catch(e){
    console.error(e);
  }
}).image(function (message, req, res, next) {
  console.log('=== image message received ===');
  console.log(message);
  var MediaId = message.MediaId;
  var picurl = message.PicUrl;
  try{
    res.reply("Got your image message, image url: " + picurl);
  }catch(e){
    console.error(e);
}
}).location(function (message, req, res, next) {

  console.log('=== location message received ===');
  console.log(message);

  var label = message.Label;
  try{
    res.reply("Got your location message : "+label);
  }catch(e){
    console.error(e);
  }
}).event(function (message, req, res, next) {

  console.log('=== event message received ===');
  console.log(message);

  if (message.Event === 'subscribe') {
    res.reply("Got your text message, test!");
  } else if (message.Event === 'unsubscribe') {
    res.reply("Got your text message, test!");
  } else {
    console.log("Got your event message, your event type:" + message.Event);
  }
}).voice(function (message, req, res, next) {
  console.warn('voice not implemented');
}).video(function (message, req, res, next) {
  console.warn('video not implemented');
}).link(function (message, req, res, next) {
  console.warn('link not implemented');
}).middlewarify());

module.exports = router;
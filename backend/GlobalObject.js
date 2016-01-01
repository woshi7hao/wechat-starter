'use strict';

var wechat = require('wechat'),
    wechatAPI = require('wechat-api'),
    wechatOAuth = require('wechat-oauth'),
    config = require('./Config');

var ns = {};

//config
ns.config = config;

//wechat init
ns.wechatOAuth =new wechatOAuth(config.base.appid, config.secret);
ns.wechatAPI =new wechatAPI(config.base.appid, config.secret);

ns.fixUrl = function(url) {
    return config.rootServer + url;
};

//get format authorize url
ns.getWeChatAuthorizeUrl = function(redirect, needAuth) {
  var scope = 'snsapi_base';
  if(needAuth){
    scope = 'snsapi_userinfo';
  }
    return ns.wechatOAuth.getAuthorizeURL(ns.fixUrl(redirect), 1, scope);
};

//update menus
ns.updateMenu = function() {
  var menu = require('./wechat-menu');
  ns.wechatAPI.createMenu(menu, function(err){
    if (err){
      console.error('createMenu failed'+err);
    }
    else{
      console.log('createMenu success');
    }
  });
};

console.log('Load globalObject once!');

module.exports = ns;

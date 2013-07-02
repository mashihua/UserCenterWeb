var speakeasy = require('speakeasy');

function format(tmpl, code, result){
	res.format({
	  text: function(){
	    res.send(code, JSON.stringify(result));
	  },
  
	  html: function(){
	    res.render(tmpl, result);
	  },
  
	  json: function(){
	    res.send(code, result);
	  }
	});
}


exports.index = function(req, res){
	var mac = req.param('mac'),
		time = req.param('time'),
		format = req.param('format') || 'html';
	if(!/^[0-9a-fA-F]{2}:[0-9a-fA-F]{2}:[0-9a-fA-F]{2}:[0-9a-fA-F]{2}:[0-9a-fA-F]{2}:[0-9a-fA-F]{2}$/.test(mac) 
		|| !/^[0-9]{13,}$/.test(time)){
			return res.jsonp(500, {code:500, error:{errorcode: 2, desc: "参数错误"}});
	}
	var key = speakeasy.generate_key({length: 32}),
		time = +new Date();
	app.get('redis').set(mac, key.hex, function(err,result){
		if(err || result !== 'OK'){
			return res.jsonp(500, {code:500, error:{errorcode: 1, desc: "数据库操作失败"}});
		}
		var r = {code:200, time: time, seed: key.base32}
		if ('development' == app.get('env')) {
			r['dynamic'] = speakeasy.time({key:  key.base32 , encoding: 'base32'}) //speakeasy.totp({key:  key.base32 , time: time})
		}
		res.jsonp(r);
	});

};

exports.code = function(req, res){
	var code = req.param('code') || 'MZEHSNLBGUYDKKLLFERUWJDIGAXU4ILOEFDSQ3KVGBWE2JS6OE3A'
	time = new Date()
	var k = speakeasy.time({key:  code , encoding: 'base32'})
	res.jsonp({key : k , time: time, code : code});
}
exports.time = function(req, res){
	var format = req.param('format') || 'html';
	res.jsonp({time:+new Date()});
};

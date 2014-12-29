var fileQuery = require("./fileQuery");
var file2js = require("./file2js");
var js2file = require("./js2file");
var fs = require('fs');

var files = fileQuery(".","trx", function(err, files){
	if(err){
		console.log(err);
		return;
	}
	file2js(files[0], function(err, jsobj){
		if(err){
			console.log(err);
			return;
		}
		fs.writeFile("out.json", JSON.stringify(jsobj, null, " "));
		js2file(jsobj, "out.trx", function(err){
			if(err){
				console.log(err);
				return;
			}
		});
	});	
});
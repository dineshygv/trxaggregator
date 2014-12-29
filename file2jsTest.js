var fileQuery = require("./fileQuery");
var file2js = require("./file2js");

var files = fileQuery(".","xml", function(err, files){
	if(err){
		console.log(err);
		return;
	}
	file2js(files[0], function(err, jsobj){
		if(err){
			console.log(err);
			return;
		}
		console.log(JSON.stringify(jsobj));
	});	
});
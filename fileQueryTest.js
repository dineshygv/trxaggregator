var fileQuery = require("./fileQuery");

var files = fileQuery(".","js", function(err, files){
	if(err){
		console.log(err);
		return;
	}
	
	console.log(JSON.stringify(files));
});
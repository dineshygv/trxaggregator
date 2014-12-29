var fs = require('fs');
var xml2js = require('xml2js');

var parser = new xml2js.Parser();

function file2js(filePath, callback){
	fs.exists(filePath, function(exists){
		if(exists){
			fs.readFile(filePath, function(err, fileData) {
				if(err){
					callback(err);
				}
				parser.parseString(fileData, function (err, parsedObj) {
					callback(null, parsedObj);
				});
			});
		}
	});	
}

module.exports = file2js;



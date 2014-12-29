var fs = require('fs');
var xml2js = require('xml2js');
var getFileName = require("./fileNameGenerator");

var builder = new xml2js.Builder();

function js2file(jsobj, fileName, callback){
	var xml = builder.buildObject(jsobj);	

	getFileName(fileName, function(fileNameToUse){
		fs.writeFile(fileNameToUse, xml, function(err){
			if(err){
				callback(err);
			}
		}); 
	}); 
}


module.exports = js2file;


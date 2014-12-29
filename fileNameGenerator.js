var fs = require("fs");

function getFileName(fileName, callback){
	var fileNameWithoutExtension = getFileNameWithoutExtension(fileName);
	var extension = getExtension(fileName);
	getNonexistingFileName(fileNameWithoutExtension, extension, function(fileNameToUse, extensionToUse){
		callback(fileNameToUse + "." + extensionToUse);
	});
}

function getNonexistingFileName(fileName, extension, callback){
	fs.exists(fileName + "." + extension, function(exists){
		if(!exists){
			callback(fileName, extension);
		}else{
			getNonexistingFileName(fileName + "_n", extension, callback);
		}
	});
}

function getFileNameWithoutExtension(fileName){
	return fileName.substring(0, fileName.lastIndexOf("."));
}

function getExtension(fileName){
	return fileName.substring(fileName.lastIndexOf(".") + 1);
}

module.exports = getFileName;

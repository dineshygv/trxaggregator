var fs = require('fs');
var path = require('path');

function fileQuery(dirPath, ext, callback){
	fs.readdir(dirPath, function(err, files){
		if(err){
			callback(err);
		}
		var out = [];
		for(var index in files){
			var file = files[index];
			if(path.extname(file) == "." + ext){
				out.push(file);
			}
		}
		callback(null, out);
	});
}

module.exports = fileQuery;
var fileQuery = require("./fileQuery");
var file2js = require("./file2js");
var js2file = require("./js2file");
var aggregate = require("./aggregator");
var getFileName  = require("./fileNameGenerator");
var fs = require('fs');

var ids = {
	TestDefinitions:[],
	TestEntries:[],
	Results:[]
};

var files = fileQuery(".","trx", function(err, files){
	if(err){
		console.log(err);
		return;
	}
	file2js(files[0], function(err, jsobj1){
		if(err){
			console.log(err);
			return;
		}
		
		file2js(files[1], function(err, jsobj2){
			if(err){
				console.log(err);
				return;
			}		

			
			var aggregatedObj = aggregate(jsobj1, jsobj2, ids);
						
			js2file(aggregatedObj, "out.trx", function(err){
				if(err){
					console.log(err);
					return;
				}
			});
		});	

	});	
});
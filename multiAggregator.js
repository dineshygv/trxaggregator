var fileQuery = require("./fileQuery");
var file2js = require("./file2js");
var js2file = require("./js2file");
var aggregate = require("./aggregator");

var dirToSearch = process.argv[2] ? process.argv[2] : ".";
var outputFileName = process.argv[3] ? process.argv[3] : "out.trx";

var ids = {
	TestDefinitions:{},
	TestEntries:{},
	Results:{}
};

fileQuery(dirToSearch,"trx", function(err, files){
	if(err){
		console.log(err);
		return;
	}
	if(files.length < 2){
		console.log("less than 2 files found");
		return;
	}else{
		console.log(files.length + " files found");
	}
	
	file2js(dirToSearch + "/" + files[0], function(err, jsobj1){
		if(err){
			console.log(err);
			return;
		}
		
		addIdsOfFirstTest(jsobj1);
		aggregateTrx(jsobj1, files, 1);
	});	
});

function addIdsOfFirstTest(jsobj1){
	for(var index in jsobj1.TestRun.TestDefinitions[0].UnitTest){
		ids["TestDefinitions"][jsobj1.TestRun.TestDefinitions[0].UnitTest[index].$.id] = true;
	}
	for(var index in jsobj1.TestRun.TestEntries[0].TestEntry){
		ids["TestEntries"][jsobj1.TestRun.TestEntries[0].TestEntry[index].$.testId] = true;
	}
	for(var index in jsobj1.TestRun.Results[0].UnitTestResult){
		ids["Results"][jsobj1.TestRun.Results[0].UnitTestResult[index].$.testId] = true;
	}
}


function aggregateTrx(prevObj, files, indexToAggregate){
	if(files.length == indexToAggregate){
		js2file(prevObj, outputFileName, function(err){
			if(err){
				console.log(err);
				return;
			}
		});
		return;
	}

	file2js(dirToSearch + "/" + files[indexToAggregate], function(err, newObj){
		if(err){
			console.log(err);
			return;
		}		
		
		var aggregatedObj = aggregate(prevObj, newObj, ids);
		
		aggregateTrx(aggregatedObj, files, indexToAggregate+1);				
	});	
}
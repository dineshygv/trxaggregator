var moment = require('moment');

function aggregate(jsobj1, jsobj2, ids){
	var run1 = jsobj1.TestRun;
	var run2 = jsobj2.TestRun;
	
	if(!run1 || !run2){
		return;
	}
		
	aggregateTimes(run1, run2);
	aggregateResultSummary(run1, run2);
	merge(run1, run2, "TestDefinitions", "UnitTest", ids);
	merge(run1, run2, "TestEntries", "TestEntry", ids);
	merge(run1, run2, "Results", "UnitTestResult", ids);
	
	return jsobj1;
}

function shouldAddTest(run, outerTag, ids, index){
	var id;	
	switch(outerTag){
		case "TestDefinitions":
			id = run.TestDefinitions[0].UnitTest[index].$.id;
			break;
		case "TestEntries":
			id = run.TestEntries[0].TestEntry[index].$.testId;
			break;
		case "Results":
			id = run.Results[0].UnitTestResult[index].$.testId;
			break;
	}
	if(ids[outerTag][id]){
		console.log(outerTag + "-" + id);
		return false;
	}else{
		ids[outerTag][id] = true;
		return true;
	}
}

function merge(run1, run2, outerTag, innerTag, ids){
	if(!(run1[outerTag] && run1[outerTag].length)){
		run1[outerTag] = [];
		var element = {};
		element[innerTag] = [];
		run1[outerTag].push(element);
	}
	
	if(!(run1[outerTag][0][innerTag] && run1[outerTag][0][innerTag].length)){
		run1[outerTag][0][innerTag] = [];
	}
	
	if(run2[outerTag] && run2[outerTag].length && run2[outerTag][0][innerTag] && run2[outerTag][0][innerTag].length){
		for(var index in run2[outerTag][0][innerTag]){
			if(shouldAddTest(run2, outerTag, ids, index)){
				run1[outerTag][0][innerTag].push(run2[outerTag][0][innerTag][index]);
			}
		}
	}
}

function aggregateTimes(run1, run2){
	var times1 = run1.Times[0].$;
	var times2 = run2.Times[0].$;
	for(var key in times1){
		var date1 = new Date(times1[key]);
		var date2 = new Date(times2[key]);
		var aggregatedDate = aggreateDate(date1, date2, (key == "finish"));
		times1[key] = (new moment(aggregatedDate)).format();
	}
}

function aggreateDate(date1, date2, max){
	return (((date1.getTime() - date2.getTime()) > 0) && max) ? date1 : date2;
}

function aggregateResultSummary(run1, run2){
	if(!(run1.ResultSummary && 
		run1.ResultSummary.length &&
		run1.ResultSummary[0].Counters &&
		run1.ResultSummary[0].Counters.length &&
		run2.ResultSummary && 
		run2.ResultSummary.length &&
		run2.ResultSummary[0].Counters &&
		run2.ResultSummary[0].Counters.length)){
		return;
	}

	var outcome1 = run1.ResultSummary[0].$ ? run1.ResultSummary[0].$.outcome : null;
	var outcome2 = run2.ResultSummary[0].$ ? run2.ResultSummary[0].$.outcome : null;
	
	if(outcome1 == "Passed")
	{
		if(outcome2 == "Failed"){
			run1.ResultSummary[0].$.outcome = "Failed";
		}
	}
	
	var counters1 = run1.ResultSummary[0].Counters[0].$;
	var counters2 = run2.ResultSummary[0].Counters[0].$;
	
	for(var key in counters1){
		var value1 = parseInt(counters1[key]) || 0;
		var value2 = parseInt(counters2[key]) || 0;
		counters1[key] = (value1 + value2).toString();
	}
}

module.exports = aggregate;
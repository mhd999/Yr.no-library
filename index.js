var  	fs 		= require('fs'),
		request = require('request'),
		parser 	= require('xml2json'),
		_ 		= require('lodash'),
		moment	= require('moment');

exports.LocationForecast = function(lat, lon, time, callback) {
	request('http://api.met.no/weatherapi/locationforecast/1.9/?lat='+lat+';lon='+lon, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			fs.writeFile(__dirname + '/foo.xml', body, 'utf8');
			xmlParsing(time, function(data) {
				callback(data);
			});
			
		}
	})
}


function xmlParsing(time, callback) {
	var filterdData
	fs.readFile(__dirname + '/foo.xml', function(err, data) {
	    var jsonData = parser.toJson(data);


	    // var dNumber = 0;
	    // var doperation;
	    // _.forEach(utcd, function(char) {
	    // 	if(char === '+' || char === '-') {
	    // 		doperation = char;
	    // 	} else {
	    // 		dNumber = Number(dNumber) + Number(char);
	    // 	}
	    // });
	    // if(doperation === '+') {
	    // 	var time = moment.utc().add(dNumber, 'h').startOf('hour').format();
	    // 	console.log('add', time);
	    // } else {
	    // 	console.log(dNumber);
	    // 	var time = moment.utc().subtract(dNumber, 'h').startOf('hour').format();
	    // 	console.log('sub', time);
	    // }
	    
	    var time = moment(time).utc().format();
    	time = time.substring(0, 13);

	    fs.writeFile(__dirname + '/weatherjson.json', jsonData);
	    fs.readFile(__dirname + '/weatherjson.json', 'utf8', function(err, data) {
	    	var parsedData = JSON.parse(data);

		    filterdData = _.remove(parsedData.weatherdata.product.time, function(n) {
		    	return n.from.substring(0,13) && n.to.substring(0,13) === time;
	
		    });
		    callback(filterdData);
	    })

	});
	
}
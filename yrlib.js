var  	fs 		= require('fs'),
		request = require('request'),
		parser 	= require('xml2json'),
		_ 		= require('lodash'),
		moment	= require('moment');


exports.LocationForecast = function(lat, lon, callback) {
	request('http://api.met.no/weatherapi/locationforecast/1.9/?lat='+lat+';lon='+lon, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			fs.writeFile(__dirname + '/foo.xml', body, 'utf8');
			xmlParsing(function(data) {
				callback(data);
			});
			
		}
	})
}


function xmlParsing(callback) {
	var filterdData
	fs.readFile(__dirname + '/foo.xml', function(err, data) {
	    var jsonData = parser.toJson(data);

	    var time = moment.utc().format();
	    time = time.substring(0, 10);

	    fs.writeFile(__dirname + '/weatherjson.json', jsonData);
	    fs.readFile(__dirname + '/weatherjson.json', 'utf8', function(err, data) {
	    	var parsedData = JSON.parse(data);

		    filterdData = _.remove(parsedData.weatherdata.product.time, function(n) {
		    	return n.from.substring(0,10) && n.to.substring(0,10) === time;
	
		    });
		    callback(filterdData);
	    })

	});
	
}
var  	fs 		= require('fs'),
		request = require('request'),
		parser 	= require('xml2json'),
		_ 		= require('lodash'),
		moment	= require('moment');

exports.LocationForecast = function(lat, lon, callback) {
	request('http://api.met.no/weatherapi/locationforecast/1.9/?lat='+lat+';lon='+lon, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			fs.writeFile(__dirname + '/foo.xml', body, 'utf8');
			xmlParsing(null, function(data) {
				callback(data);
			});
			
		}
	})
}

exports.CurrentLocationForecast = function(lat, lon, local_time, callback) {
	request('http://api.met.no/weatherapi/locationforecast/1.9/?lat='+lat+';lon='+lon, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			fs.writeFile(__dirname + '/foo.xml', body, 'utf8');
			xmlParsing(local_time, function(data) {
				callback(data);
			});
			
		}
	})
}


function xmlParsing(local_time, callback) {
	var filterdData
	fs.readFile(__dirname + '/foo.xml', function(err, data) {
	    var jsonData = parser.toJson(data);
	    
	    

	    fs.writeFile(__dirname + '/weatherjson.json', jsonData);
	    fs.readFile(__dirname + '/weatherjson.json', 'utf8', function(err, data) {
	    	var parsedData = JSON.parse(data);

	    	if(local_time != null) {
	    		var time = moment(local_time).utc().add(1, 'h').startOf('hour').format();
    				time = time.substring(0, 13);

	    		filterdData = _.remove(parsedData.weatherdata.product.time, function(n) {
		    	return n.from.substring(0,13) && n.to.substring(0,13) === time;
	
			    });
			    callback(filterdData);
	    	} else {
	    		callback(parsedData.weatherdata.product.time);	
	    	}
		    
	    })

	});
	
}
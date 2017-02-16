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
			
		} else {
			callback(body);
		}
	})
}

exports.CurrentLocationForecast = function(lat, lon, local_time, callback) {
	request('http://api.met.no/weatherapi/locationforecast/1.9/?lat='+lat+';lon='+lon, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			xmlParsing(body, local_time, function(data) {
				callback(data);
			});
			
		}else {
			callback(body);
		}
	})
}


function xmlParsing(xml_data, local_time, callback) {
	var filterdData;
    var jsonData = parser.toJson(xml_data);  
	var parsedData;

	try {
		parsedData = JSON.parse(jsonData);
		if(local_time != null) {
		var time = moment(local_time).utc().add(1, 'h').startOf('hour').format();
			time = time.substring(0, 13);
		var initFrom = parsedData.weatherdata.meta.model.from.substring(0, 13);

		if(time < initFrom) {
			time = initFrom;
		}

		filterdData = _.remove(parsedData.weatherdata.product.time, function(n) {
    	return n.from.substring(0,13) && n.to.substring(0,13) === time;

	    });
	    
	    callback(filterdData);

		} else {
			callback(parsedData.weatherdata.product.time);	
		}

	} catch(err) {
		callback({"Error": "unable to parse the json weather data"});
	}	    		

	

	
}
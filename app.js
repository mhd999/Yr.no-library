var  fs = require('fs'),
request = require('request'),
parser 	= require('xml2json'),
_ 		= require('lodash'),
moment	= require('moment');


exports.LocationForecast = function(lat, lon) {
	request('http://api.met.no/weatherapi/locationforecast/1.9/?lat=59.8346;lon=10.4366', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			fs.writeFile(__dirname + '/foo.xml', body, 'utf8');
			xmlParsing();
		}
	})
}


function xmlParsing() {
	fs.readFile(__dirname + '/foo.xml', function(err, data) {
	    var jsonData = parser.toJson(data);

	    var time = moment.utc().format();
	    time = time.substring(0, 10);

	    fs.writeFile(__dirname + '/weatherjson.json', jsonData);
	    fs.readFile(__dirname + '/weatherjson.json', 'utf8', function(err, data) {
	    	var parsedData = JSON.parse(data);

		    var filterdData = _.remove(parsedData.weatherdata.product.time, function(n) {
		    	return n.from.substring(0,10) === time;
	
		    });
		    console.log('### returned stats', filterdData);
	    })

	});
}
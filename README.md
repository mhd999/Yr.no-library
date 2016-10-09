# Yr.no library  

A simple library to call the Yr.no XML based api and return response in JSON


### Installation

```sh
$ cd root project
$ npm install yr-lib
```

### Usage
#### ES5
```sh
var LocationForecast = require('yr-lib').LocationForecast;
LocationForecast(lat, lon, local_time,function(data) {
	//do something with data  
});

```
#### ES6
```sh
import { LocationForecast } from 'yr-lib';
LocationForecast(lat, lon, local_time, data => {
	//do something with data      
});
```
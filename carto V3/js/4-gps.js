// =================================================================
// GPS
// =================================================================

// -----------------------------------------------------------------
// Number < 10 on 2 digits : ex "01"
// -----------------------------------------------------------------
const format_xxDigits = function(number) {
	if (number === 0) return "00";
	else 	if (number < 10) return "0" + number;
			else return number;
}

// -----------------------------------------------------------------
// Date like : 29/04/2020 12:23:45
// -----------------------------------------------------------------
const format_dateString = function(date) {
	return format_xxDigits(date.getDate()) 
	+ "/" 
	+ format_xxDigits(date.getMonth() + 1) 
	+ "/" 
	+ date.getFullYear()
	+ " " 
	+ format_xxDigits(date.getHours()) 
	+ ":" 
	+ format_xxDigits(date.getMinutes()) 
	+ ":" 
	+ format_xxDigits(date.getSeconds());
}

// -----------------------------------------------------------------
// format_coords
// -----------------------------------------------------------------
const format_coords = {
	
	"DDD.xxxxxx" : function(coord) {
		return Math.round(coord * 1000000)/1000000 + "°";
	},
	
	"DDD° MM.xxxx'" : function(coord) {
		const DDD = Math.floor(coord);
		let minutes = (coord - DDD) * 60;
		const MM = Math.round(minutes * 1000)/1000;
		return DDD + "° " + MM + "'";
	},
	
	"DDD° MM' SS\"" : function(coord) {
		const DDD = Math.floor(coord);
		let minutes = (coord - DDD) * 60;
		const MM = Math.floor(minutes);
		let seconds = (minutes - MM) * 60;
		const SS = Math.round(seconds);
		return DDD + "° " + MM + "' " + SS + '"';
	},
}

// -----------------------------------------------------------------
// Calculus functions
// -----------------------------------------------------------------

// Converts from degrees to radians --------------------------------
function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
};
 
// Converts from radians to degrees --------------------------------
function gradiansToDegrees(radians) {
  return radians * 180 / Math.PI;
}

// Calculates bearing in degres ------------------------------------
function bearing(p1, p2){
  p1[0] = degreesToRadians(p1[0]);
  p1[1] = degreesToRadians(p1[1]);
  p2[0] = degreesToRadians(p2[0]);
  p2[1] = degreesToRadians(p2[1]);

  const y = Math.sin(p2[1] - p1[1]) * Math.cos(p2[0]);
  const x = Math.cos(p1[0]) * Math.sin(p2[0]) -
        Math.sin(p1[0]) * Math.cos(p2[0]) * Math.cos(p2[1] - p1[1]);
  let brng = Math.atan2(y, x);
  brng = gradiansToDegrees(brng);
  return (brng + 360) % 360;
}

// Calculates distance in meters ------------------------------------
function distance(p1, p2) {
	p1[0] = degreesToRadians(p1[0]);
	p1[1] = degreesToRadians(p1[1]);
	p2[0] = degreesToRadians(p2[0]);
	p2[1] = degreesToRadians(p2[1]);
	const R = 6378137; // Earth’s mean radius in meter
	return R * (Math.acos(Math.sin(p1[0]) * Math.sin(p2[0]) + Math.cos(p1[0]) * Math.cos(p2[0]) * Math.cos(p1[1] - p2[1])));
	
	/*
	// avec tranformation en radian intégrée
	const R = 6378137; // Earth’s mean radius in meter
  const dLat = degreesToRadians(p2[0] - p1[0]);
  const dLong = degreesToRadians(p2[1] - p1[1]);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(p1[0])) * Math.cos(degreesToRadians(p2[0])) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d; // returns the distance in meter
*/
  
};

const gps = {
	
	// -------------------------------------------------------------
	// setCurrentPosition
	// -------------------------------------------------------------	
	setAndDisplayCurrentPosition : function() {
		that = this;
		window.navigator.geolocation.getCurrentPosition(
			function(position) {
				app.currentPosition.coords = [position.coords.latitude,position.coords.longitude];
				app.currentPosition.timestamp = position.timestamp;
				app.currentPosition.label = format_dateString(new Date(position.timestamp));
				that.refreshCurrentPosition();
				console.log("Position actuelle rafraîchie");
			}, 
			function(error) {
				alert("Erreur GPS : " + error.message);
			}
		);
	},
	
	// -------------------------------------------------------------
	// setAndDisplayWaypoint
	// -------------------------------------------------------------	
	setAndDisplayWaypoint : function() {
		that = this;
		window.navigator.geolocation.getCurrentPosition(
			function(position) {
				/*
				app.currentPosition.coords = [position.coords.latitude,position.coords.longitude];
				app.currentPosition.timestamp = position.timestamp;
				app.currentPosition.label = format_dateString(new Date(position.timestamp));
				that.refreshCurrentPosition();
				*/
				let waypoint = new Waypoint({
					coords : [position.coords.latitude,position.coords.longitude],
					timestamp : position.timestamp,
					label : format_dateString(new Date(position.timestamp))
				});
				
				waypoints.list.unshift(waypoint);
				waypoints.generateHtml();
				waypoints.refreshMap();
				console.log("waypoint set");
			}, 
			function(error) {
				alert("Erreur GPS : " + error.message);
			}
		);
	},
	
	refreshCurrentPosition : function () {
		// If appHasFocus only -----------------------------------------
		if (app.hasFocus) {
			// Refresh current position's marker and name on the map
			app.currentPosition.refreshMap();
			
			// Center map optionnally on current position --------------
			if (app.options.mapIsCenteredOnGpsPosition) {
				app.myMap.flyTo(app.currentPosition.coords,app.zoomLevel);
			}
			
			// Display current position information --------------------
			if (app.currentPosition) {
				$("#date").html(app.currentPosition.label);
				$("#latitude").html(format_coords[app.options.coordinatesFormat](app.currentPosition.coords[0]));
				$("#longitude").html(format_coords[app.options.coordinatesFormat](app.currentPosition.coords[1]));
				$("#altitude").html(Math.round(app.currentPosition.altitude));
				$(".zone_noCurrentWayPoint").hide();
				$(".zone_currentWayPointDisplayed").show();
			}
			else {
				$(".zone_currentWayPointDisplayed").hide();
				$(".zone_noCurrentWayPoint").show();
			}
			
			// Display bearing and speed -------------------------------
			if (app.gpsTraceIsOn)	{
				$(".zone_traceInactive").hide();
				$(".zone_traceActive").show();
			}
			else {
				$(".zone_traceActive").hide();
				$(".zone_traceInactive").show();
			}
			
			// Displays target informations if available ---------------
			if (waypoints.target()) {
				$("#targetName").html(waypoints.target().label);
				$("#targetBearing").html(Math.round(bearing(app.currentPosition.coords,waypoints.target().coords)));
				$("#distance").html(Math.round(distance(app.currentPosition.coords,waypoints.target().coords)/1000));
				// $("#targetWaypointInfo").show();
				$(".zone_noTargetWayPoint").hide();
				$("#zone_targetWayPointDisplayed").show();
			}
			else {
				$("#zone_targetWayPointDisplayed").hide();
				$(".zone_noTargetWayPoint").show();
			}
		}
	}
	
	
	
}
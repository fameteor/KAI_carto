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
		let sign = "";
		if (coord < 0) {
			sign = "-";
			coord = -coord;
		}
		const DDD = Math.trunc(coord);
		let minutes = (coord - DDD) * 60;
		const MM = Math.round(minutes * 1000)/1000;
		return sign + DDD + "° " + MM + "'";
	},
	
	"DDD° MM' SS\"" : function(coord) {
		let sign = "";
		if (coord < 0) {
			sign = "-";
			coord = -coord;
		}
		const DDD = Math.trunc(coord);
		let minutes = (coord - DDD) * 60;
		const MM = Math.trunc(minutes);
		let seconds = (minutes - MM) * 60;
		const SS = Math.round(seconds);
		return sign + DDD + "° " + MM + "' " + SS + '"';
	},
}

const gps = {
	
	// -------------------------------------------------------------
	// Converts from degrees to radians
	// -------------------------------------------------------------
	degreesToRadians : function(degrees) {
		return degrees * Math.PI / 180;
	},
 
	// -------------------------------------------------------------
	// Converts from radians to degrees
	// -------------------------------------------------------------
	gradiansToDegrees : function(radians) {
		return radians * 180 / Math.PI;
	},
	
	// -------------------------------------------------------------
	// Converts from radians to degrees
	// -------------------------------------------------------------
	initialBearing : function(p1, p2){
		var φ1 = this.degreesToRadians(p1[0]), φ2 = this.degreesToRadians(p2[0]);
		var Δλ = this.degreesToRadians((p2[1]-p1[1]));
		var y = Math.sin(Δλ) * Math.cos(φ2);
		var x = Math.cos(φ1)*Math.sin(φ2) -
				Math.sin(φ1)*Math.cos(φ2)*Math.cos(Δλ);
		var θ = Math.atan2(y, x);
		return (this.gradiansToDegrees(θ)+360) % 360;
	},

	// -------------------------------------------------------------
	// Converts from radians to degrees
	// -------------------------------------------------------------
	distance : function(p1, p2) {
		var R = 6371e3;
		var φ1 = this.degreesToRadians(p1[0]),  λ1 = this.degreesToRadians(p1[1]);
		var φ2 = this.degreesToRadians(p2[0]), λ2 = this.degreesToRadians(p2[1]);
		var Δφ = φ2 - φ1;
		var Δλ = λ2 - λ1;
		var a = Math.sin(Δφ/2) * Math.sin(Δφ/2)
			  + Math.cos(φ1) * Math.cos(φ2)
			  * Math.sin(Δλ/2) * Math.sin(Δλ/2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		var d = R * c;
		return d;
	},
	
	// -------------------------------------------------------------
	// setCurrentPosition
	// -------------------------------------------------------------	
	setAndDisplayCurrentPosition : function() {
		toastr.info("Attente de la réponse GPS...");
		that = this;
		window.navigator.geolocation.getCurrentPosition(
			function(position) {
				console.log(position);
				app.currentPosition.coords = [position.coords.latitude,position.coords.longitude];
				app.currentPosition.altitude = position.coords.altitude;
				app.currentPosition.timestamp = position.timestamp;
				app.currentPosition.label = format_dateString(new Date(position.timestamp));
				that.refreshCurrentPosition();
				toastr.info("Position actuelle rafraîchie");
			}, 
			function(error) {
				toastr.warning("Erreur GPS : " + error.message);
			}
		);
	},
	
	// -------------------------------------------------------------
	// setAndDisplayWaypoint
	// -------------------------------------------------------------	
	setAndDisplayWaypoint : function() {
		toastr.info("Attente de la réponse GPS...");
		that = this;
		window.navigator.geolocation.getCurrentPosition(
			function(position) {
				console.log(position);
				// Refresh current position -------------------------
				app.currentPosition.coords = [position.coords.latitude,position.coords.longitude];
				app.currentPosition.altitude = position.coords.altitude;
				app.currentPosition.timestamp = position.timestamp;
				app.currentPosition.label = format_dateString(new Date(position.timestamp));
				that.refreshCurrentPosition();
				// Add new waypoint ---------------------------------
				let waypoint = new Waypoint({
					coords : 	[position.coords.latitude,position.coords.longitude],
					altitude : 	position.coords.altitude,
					timestamp : position.timestamp,
					label : 	format_dateString(new Date(position.timestamp))
				});
				
				waypoints.list.unshift(waypoint);
				// We select the new waypoint
				waypoints.currentIndex = 0;
				waypoints.generateHtml();
				waypoints.refreshMap();
				toastr.info("Point enregistré");
				// We write the waypoint to SD
				waypoints.currentItem().writeToSD();
			}, 
			function(error) {
				toastr.warning("Erreur GPS : " + error.message);
			}
		);
	},
	
	// -------------------------------------------------------------
	// refreshCurrentPosition
	// -------------------------------------------------------------
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
			if (app.currentPosition.coords) {
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
				$("#targetBearing").html(Math.round(this.initialBearing(app.currentPosition.coords,waypoints.target().coords)));
				// Distance in km initially
				let distance = this.distance(app.currentPosition.coords,waypoints.target().coords)/1000;
				let unit = "";
				switch(app.options.units) {
					case "Métriques" :
						unit = "km";
						break;
					case "Nautiques" :
						unit = "NM";
						distance = distance / 1.852;
						break;
				}
				if (distance > 100) 		$("#distance").html(Math.round(distance) + " " + unit);
				else if (distance > 10) 	$("#distance").html(Math.round(distance*10)/10  + " " + unit);
					else if (distance > 1) 	$("#distance").html(Math.round(distance*100)/100  + " " + unit);
						else 					$("#distance").html(Math.round(distance*1000)/1000  + " " + unit);
				$(".zone_noTargetWayPoint").hide();
				$("#zone_targetWayPointDisplayed").show();
			}
			else {
				$("#zone_targetWayPointDisplayed").hide();
				$(".zone_noTargetWayPoint").show();
			}
			
			// Update Speed, bearing and EAT if available
			if ((app.gpsWatchHandler != null) && (app.currentTrack.coords.length > 1)) {
				// currentSpeed, currentBearing and ETA calculus
				const lastPointCoords = app.currentTrack.coords[app.currentTrack.coords.length - 1];
				const pointBeforeLastPointCoords = app.currentTrack.coords[app.currentTrack.coords.length - 2];
				const distanceInKm = this.distance(pointBeforeLastPointCoords,lastPointCoords) / 1000;
				console.log("distanceInKm : " + distanceInKm)
				const lastPointTimestamp = app.currentTrack.timestamps[app.currentTrack.coords.length - 1];
				const pointBeforeLastPointTimestamp = app.currentTrack.timestamps[app.currentTrack.coords.length - 2];
				console.log("lastPointTimestamp : " + lastPointTimestamp)
				console.log("pointBeforeLastPointTimestamp : " + pointBeforeLastPointTimestamp)
				const deltaTimeInHour = (lastPointTimestamp - pointBeforeLastPointTimestamp) / (1000 * 3600);
				console.log("deltaTimeInHour : " + deltaTimeInHour)
				const speed = distanceInKm / deltaTimeInHour;
				const currentBearing = this.initialBearing(pointBeforeLastPointCoords,lastPointCoords);
				// Speed display
				let unit = "";
				switch(app.options.units) {
					case "Métriques" :
						unit = "km/h";
						break;
					case "Nautiques" :
						unit = "noeuds";
						speed = speed / 1.852;
						break;
				}
				if (speed > 100) 		$("#currentSpeed").html(Math.round(speed) + " " + unit);
				else if (speed > 10) 	$("#currentSpeed").html(Math.round(speed*10)/10  + " " + unit);
					else if (speed > 1) $("#currentSpeed").html(Math.round(speed*100)/100  + " " + unit);
						else 			$("#currentSpeed").html(Math.round(speed*1000)/1000  + " " + unit);
				// Bearing display
				$("#currentBearing").html(Math.round(currentBearing));
				$(".zone_traceInactive").hide();
				$(".zone_traceActive").show();				
			}
			else {
				$(".zone_traceActive").hide();
				$(".zone_traceInactive").show();
			}
		}
	},
	
	// -----------------------------------------------------------------
	// gpsWatchStart and gpsWatchStop
	// To lock the GPS ressource when screen off or applis in background
	// -----------------------------------------------------------------
	watchStart : function() {
		let that = this;
		let gpsPoints = [];

		const gpsWatchOnSuccess = function(position) {
			// Only if different GPS point ---------------------------------
			if (!(position.coords.latitude === app.currentPosition.coords[0] && position.coords.longitude === app.currentPosition.coords[1])) {
				console.log(position);
				if (!app.options.gpsPostProcessingisOn) {
					// Set current position --------------------------------
					app.currentPosition.coords = [
						position.coords.latitude,
						position.coords.longitude
					];
					app.currentPosition.altitude = position.coords.altitude;
					app.currentPosition.timestamp = position.timestamp;
					app.currentPosition.label = format_dateString(new Date(position.timestamp));
					// We add to the track and update the display ----------
					app.currentTrack.coords.push([
						position.coords && position.coords.latitude,
						position.coords && position.coords.longitude
					]);
					app.currentTrack.altitudes.push(position.coords.altitude);
					app.currentTrack.timestamps.push(position.timestamp);
					// We display the flashing tracing led -----------------
					$("#tracing_green").show();
					setTimeout(function(){ $("#tracing_green").hide(); }, 500);
					// We refresh the position informations and map --------
					that.refreshCurrentPosition();
					app.currentTrack.refreshMap();
				}
				else {
					if ((position.timestamp % 5000) === 0) {
						gpsPoints.push(position);
						// Average position calculation --------------------
						let latitude = 0;
						let longitude = 0;
						let altitude = 0;
						let timestamp = 0;
						gpsPoints.forEach(function(point,index){
							latitude += point.coords.latitude;
							longitude += point.coords.longitude;
							altitude += point.coords.altitude;
							timestamp += point.timestamp;
						});
						latitude = latitude / gpsPoints.length;
						longitude = longitude / gpsPoints.length;
						altitude = altitude / gpsPoints.length;
						timestamp = timestamp / gpsPoints.length;
						// Set current position ----------------------------
						app.currentPosition.coords = [
							latitude,
							longitude
						];
						app.currentPosition.altitude = altitude;
						app.currentPosition.timestamp = timestamp;
						app.currentPosition.label = format_dateString(new Date(timestamp));
						// Reset the averaging array -----------------------
						gpsPoints = [];
						// Push in the track list --------------------------
						app.currentTrack.coords.push([latitude,longitude]);
						app.currentTrack.altitudes.push(altitude);
						app.currentTrack.timestamps.push(timestamp);
						// We display the flashing tracing led -------------
						$("#tracing_green").show();
						setTimeout(function(){ $("#tracing_green").hide(); }, 500);
						// We refresh the position informations and map ----
						that.refreshCurrentPosition();
						app.currentTrack.refreshMap();
					}
					else {
						// Push in the averaging array ---------------------
						gpsPoints.push(position);
						// We display the flashing tracing led -------------
						$("#tracing_orange").show();
						setTimeout(function(){ $("#tracing_orange").hide(); }, 500);
					}
				}
			}
			// GPS point is identical to the previous one ------------------
			else {
				$("#tracing_red").show();
				setTimeout(function(){ $("#tracing_red").hide(); }, 500);
			}
		};
		
		const gpsWatchOnError = function(error) {
			toastr.warning("Erreur GPS : " + error.message);
		};

		const gpsWatchOptions = {
			enableHighAccuracy: false,
			timeout: 5000,
			maximumAge: 0
		};

		// Only for Nokia phone, not on PC firefox, lock GPS ressource when screen off or applis in background
		if (window.navigator.requestWakeLock) app.gpsLockHandler = window.navigator.requestWakeLock('gps');
		app.gpsWatchHandler = navigator.geolocation.watchPosition(gpsWatchOnSuccess, gpsWatchOnError, gpsWatchOptions);
		console.log("GPS watch ON");
		// refreshTracksDisplay();
	},

	watchStop : function() {
		navigator.geolocation.clearWatch(app.gpsWatchHandler);
		app.gpsWatchHandler = null;
		if (app.gpsLockHandler) {
			app.gpsLockHandler.unlock();
			app.gpsLockHandler = null;
		}
		console.log("GPS watch OFF");
		// DO not display Speed, Bearing and ETA if available
		that.refreshCurrentPosition();
	}

}
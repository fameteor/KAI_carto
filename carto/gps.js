// =================================================================
// GPS management
// =================================================================

// -----------------------------------------------------------------
// Global variables
// -----------------------------------------------------------------
let targetWaypoint = [46.589187,15.0133661];
let gpsWatchHandler = null;
let lockHandler = null;
let appHasFocus = true;

// Options (Settings in app) ---------------------------------------
let mapIsCenteredOnGpsPosition = 	true;
let waypointsNameAreDisplayed = 	false;
let currentLocationIsDisplayed = 	true;
let gpsPostProcessing = 			true;

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
// -----------------------------------------------------------------
// refreshCurrentPosition :
// Refresh the map/infos when the current position has changed
// Only if appHasFocus !
// -----------------------------------------------------------------
function refreshCurrentPosition() {
	// If appHasFocus only -----------------------------------------
	if (appHasFocus) {
		// Displays optionnally current position marker ------------
		if (currentLocationIsDisplayed) {
			// Remove currentPosition marker if exists
			if (currentPositionMarker) myMap.removeLayer(currentPositionMarker);
			// Add currentPosition marker
			currentPositionMarker = L.marker(
				[currentPosition.latitude,currentPosition.longitude],
				{icon:redIcon}
			).addTo(myMap);
			// Display optionnally markers names -------------------
			if (waypointsNameAreDisplayed) {
				currentPositionMarker.bindTooltip(format_dateString(new Date(currentPosition.timestamp)),{direction: "center"}).openTooltip();
			}
		}
		else {
			// Remove currentPosition marker if exists
			if (currentPositionMarker) myMap.removeLayer(currentPositionMarker);
		}
		
		// Center map optionnally on current position --------------
		if (mapIsCenteredOnGpsPosition) {
			myMap.flyTo([currentPosition.latitude,currentPosition.longitude],zoomLevel);
		}
		
		// Display current position information --------------------
		if (currentPosition) {
			$("#date").html(format_dateString(new Date(currentPosition.timestamp)));
			$("#latitude").html(Math.round(currentPosition.latitude * 1000000)/1000000);
			$("#longitude").html(Math.round(currentPosition.longitude * 1000000)/1000000);
			$("#altitude").html(Math.round(currentPosition.altitude));
			$(".zone_noCurrentWayPoint").hide();
			$(".zone_currentWayPointDisplayed").show();
		}
		else {
			$(".zone_currentWayPointDisplayed").hide();
			$(".zone_noCurrentWayPoint").show();
		}
		
		// Display bearing and speed -------------------------------
		if (gpsModeIsAuto)	{
			$(".zone_traceInactive").hide();
			$(".zone_traceActive").show();
		}
		else {
			$(".zone_traceActive").hide();
			$(".zone_traceInactive").show();
		}
		
		// Displays target informations if available ---------------
		if (targetWaypoint) {
			$("#targetBearing").html(Math.round(bearing([currentPosition.latitude,currentPosition.longitude],targetWaypoint)));
			$("#distance").html(Math.round(distance([currentPosition.latitude,currentPosition.longitude],targetWaypoint)/1000));
			$("#targetWaypointInfo").show();
			$(".zone_noTargetWayPoint").hide();
			$(".zone_targetWayPointDisplayed").show();
		}
		else {
			$(".zone_targetWayPointDisplayed").hide();
			$(".zone_noTargetWayPoint").show();
		}
	}
}
	
// -----------------------------------------------------------------
// getGpsCurrentPosition :
// Get the current position
// and refresh the map/infos
// -----------------------------------------------------------------
const getGpsCurrentPosition = function() {
	window.navigator.geolocation.getCurrentPosition(
		function(position) {
			currentPosition = position.coords;
			currentPosition.timestamp = position.timestamp;
			refreshCurrentPosition();
			toastr.info("Position actuelle rafraîchie");
		}, 
		function(error) {
			toastr.warning("Erreur GPS : " + error.message);
		}
	);	
}

// -----------------------------------------------------------------
// markGpsCurrentPosition :
// Add a marker for current position
// Reset current position
// and refresh the map/infos
// -----------------------------------------------------------------
const markGpsCurrentPosition = function() {
	window.navigator.geolocation.getCurrentPosition(
		function(position) {
			currentPosition = position.coords;
			currentPosition.timestamp = position.timestamp;
			// Mark waypoint
			const currentDate = new Date();
			let currentDateString = format_dateString(currentDate);
			const waypoint = {label:currentDateString,date:currentDate.getTime(),coords:[position.coords.latitude,position.coords.longitude],displayed:true};
			// We add the marker on the top of the list and have focus on it
			waypoints.list.unshift(waypoint);
			waypoints.currentIndex = 0;
			// We refresh the markers list
			waypoints.generateHtml();
			state.current(menuStateCalculation());
			displayDisplayedWaypointsMarker();
			// Display GPS infos
			refreshCurrentPosition();
			toastr.info("Point GPS ajouté.");
		}, function(error) {
			toastr.warning("Erreur GPS : " + error.message);
		}
	);	
}

// -----------------------------------------------------------------
// gpsWatchHandler
// -----------------------------------------------------------------
let gpsPointsCoordinates = [];

function gpsWatchOnSuccess(position) {
	// Only if different GPS point ---------------------------------
	if (!(position.coords.latitude === currentPosition.latitude && position.coords.longitude === currentPosition.longitude)) {
		console.log(position);
		if (!gpsPostProcessing) {
			currentPosition = position.coords;
			currentPosition.timestamp = position.timestamp;
			tracks.list[4].points.push([position.coords && position.coords.latitude,position.coords && position.coords.longitude]);
			$("#tracing_green").show();
			setTimeout(function(){ $("#tracing_green").hide(); }, 500);
			refreshTracksDisplay();
			refreshCurrentPosition();
		}
		else {
			if ((position.timestamp % 5000) === 0) {
				gpsPointsCoordinates.push(position.coords);
				// Average position calculation --------------------
				let latitude = 0;
				let longitude = 0;
				let altitude = 0;
				gpsPointsCoordinates.forEach(function(pos,index){
					latitude += pos.latitude;
					longitude += pos.longitude;
					altitude += pos.altitude;
				});
				latitude = latitude / gpsPointsCoordinates.length;
				longitude = longitude / gpsPointsCoordinates.length;
				altitude = altitude / gpsPointsCoordinates.length;
				// Get current position ----------------------------
				currentPosition = {
					latitude:latitude,
					longitude:longitude,
					altitude:altitude,
					timestamp:position.timestamp
				};
				// Reset the averaging array -----------------------
				gpsPointsCoordinates = [];
				// Push in the track list --------------------------
				tracks.list[4].points.push([currentPosition.latitude,currentPosition.longitude]);
				$("#tracing_green").show();
				setTimeout(function(){ $("#tracing_green").hide(); }, 500);
				// Refresh track and position ----------------------
				refreshTracksDisplay();
				refreshCurrentPosition();
				
			}
			else {
				// Push in the averaging array ---------------------
				gpsPointsCoordinates.push(position.coords);
				currentPosition = position.coords;
				currentPosition.timestamp = position.timestamp;
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
}

// -----------------------------------------------------------------
// gpsWatchStart and gpsWatchStop
// To lock the GPS ressource when screen off or applis in background
// -----------------------------------------------------------------

function gpsWatchOnError(error) {
	toastr.warning("Erreur GPS : " + error.message);
}

const gpsWatchOptions = {
	enableHighAccuracy: false,
	timeout: 5000,
	maximumAge: 0
};

function gpsWatchStart() {
	// Only for Nokia phone, not on PC firefox, lock GPS ressource when screen off or applis in background
	if (window.navigator.requestWakeLock) lockHandler = window.navigator.requestWakeLock('gps');
	gpsWatchHandler = navigator.geolocation.watchPosition(gpsWatchOnSuccess, gpsWatchOnError, gpsWatchOptions);
	console.log("GPS watch ON");
	refreshTracksDisplay();
}

function gpsWatchStop() {
	navigator.geolocation.clearWatch(gpsWatchHandler);
	if (lockHandler) lockHandler.unlock();
	console.log("GPS watch OFF");
}
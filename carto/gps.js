// =================================================================
// GPS management
// =================================================================


// -----------------------------------------------------------------
// Global variables
// -----------------------------------------------------------------
let gpsWatchHandler = null;
let lockHandler = null;
let appHasFocus = true;

// Options (Settings in app) ---------------------------------------
let mapIsCenteredOnGpsPosition = 	true;
let waypointsNameAreDisplayed = 	false;
let currentLocationIsDisplayed = 	true;
let gpsPostProcessing = 			true;

// -----------------------------------------------------------------
// refreshCurrentPosition :
// Refresh the map/infos when the current position has changed
// Only if appHasFocus !
// -----------------------------------------------------------------
function refreshCurrentPosition() {
	// If appHasFocus only -----------------------------------------
	if (appHasFocus) {
		// Displays optionnally current position marker ----------------
		if (currentLocationIsDisplayed) {
			// Remove currentPosition marker if exists
			if (currentPositionMarker) myMap.removeLayer(currentPositionMarker);
			// Add currentPosition marker
			currentPositionMarker = L.marker(
				[currentPosition.latitude,currentPosition.longitude],
				{icon:redIcon}
			).addTo(myMap);
			// Display optionnally markers names ------------------------
			if (waypointsNameAreDisplayed) currentPositionMarker.bindTooltip("Point actuel",{direction: "center"}).openTooltip();
		}
		else {
			// Remove currentPosition marker if exists
			if (currentPositionMarker) myMap.removeLayer(currentPositionMarker);
		}
		
		// Center map optionnally on current position ------------------
		if (mapIsCenteredOnGpsPosition) {
			myMap.flyTo([currentPosition.latitude,currentPosition.longitude],zoomLevel);
		}
		
		// Display current position information ------------------------
		$("#latitude").html(Math.round(currentPosition.latitude * 1000000)/1000000);
		$("#longitude").html(Math.round(currentPosition.longitude * 1000000)/1000000);
		$("#altitude").html(Math.round(currentPosition.altitude));
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
			refreshCurrentPosition();
			toastr.info("Position actuelle raffraîchie");
		}, 
		function(error) {
			toastr.info("Erreur GPS : " + error.message);
		}
	);	
}

const xxFormat = function(number) {
	if (number === 0) return "00";
	else 	if (number < 10) return "0" + number;
			else return number;
}

const markGpsCurrentPosition = function() {
	window.navigator.geolocation.getCurrentPosition(
		function(position) {
			currentPosition = position.coords;
			// If mapIsCenteredOnGpsPosition, center map on new position
			if (mapIsCenteredOnGpsPosition) {
				mapCenter = [position.coords.latitude,position.coords.longitude];
				myMap.flyTo(mapCenter,zoomLevel);
			}
			// Display currentPosition marker
			refreshCurrentPosition();
			// Mark waypoint
			const currentDate = new Date();
			let currentDateString = currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear();
			currentDateString += " " + xxFormat(currentDate.getHours()) + ":" + xxFormat(currentDate.getMinutes()) + ":" + xxFormat(currentDate.getSeconds());
			const waypoint = {label:currentDateString,date:currentDate.getTime(),coords:[position.coords.latitude,position.coords.longitude],displayed:true};
			waypoints.list.unshift(waypoint);
			waypoints.currentIndex = waypoints.list.length - 1;
			waypoints.generateHtml();
			state.current(menuStateCalculation());
			displayDisplayedWaypointsMarker();
			// Display GPS infos
			refreshCurrentPosition();
			toastr.info("Point GPS ajouté.");
		}, function(error) {
			toastr.info("Erreur GPS : " + error.message);
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
			tracks.list[4].points.push([position.coords && position.coords.latitude,position.coords && position.coords.longitude]);
			$("#tracing_green").show();
			setTimeout(function(){ $("#tracing_green").hide(); }, 500);
			refreshTracksDisplay();
			refreshCurrentPosition();
		}
		else {
			if ((position.timestamp % 5000) === 0) {
				gpsPointsCoordinates.push(position.coords);
				// Average calculation
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
				
				currentPosition = {
					latitude:latitude,
					longitude:longitude,
					altitude:altitude
				};
				// Reset the averaging array
				gpsPointsCoordinates = [];
				tracks.list[4].points.push([currentPosition.latitude,currentPosition.longitude]);
				$("#tracing_green").show();
				setTimeout(function(){ $("#tracing_green").hide(); }, 500);
				refreshTracksDisplay();
				refreshCurrentPosition();
				
			}
			else {
				// Push
				gpsPointsCoordinates.push(position.coords);
				currentPosition = position.coords;
				$("#tracing_orange").show();
				setTimeout(function(){ $("#tracing_orange").hide(); }, 500);
			}
		}
	}
	else {
		$("#tracing_red").show();
		setTimeout(function(){ $("#tracing_red").hide(); }, 500);
	}
}

function gpsWatchOnError(error) {
	toastr.info("Erreur GPS : " + error.message);
}

const gpsWatchOptions = {
	enableHighAccuracy: false,
	timeout: 5000,
	maximumAge: 0
};

function gpsWatchStart() {
	tracks.list[4].points = [];
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
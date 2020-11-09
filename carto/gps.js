// -----------------------------------------------------------------
// Global variables
// -----------------------------------------------------------------
let gpsWatchHandler = null;
let lockHandler = null;

// -----------------------------------------------------------------
// GPS management
// -----------------------------------------------------------------
const displayGpsInfos = function() {
	$("#latitude").html(Math.round(currentPosition.latitude * 1000000)/1000000);
	$("#longitude").html(Math.round(currentPosition.longitude * 1000000)/1000000);
	$("#altitude").html(currentPosition.altitude);
	$("#heading").html(currentPosition.heading);
	$("#speed").html(currentPosition.speed);
}

function refreshCurrentPosition() {
	if (currentLocationIsDisplayed) {
		// Remove currentPosition marker if exists
		if (currentPositionMarker) myMap.removeLayer(currentPositionMarker);
		// Add currentPosition marker
		currentPositionMarker = L.marker(
			[currentPosition.latitude,currentPosition.longitude],
			{icon:redIcon}
		).addTo(myMap);
	}
}
	
	
const getGpsCurrentPosition = function() {
	window.navigator.geolocation.getCurrentPosition(
		function(position) {
			currentPosition = position.coords;
			// If mapIsCenteredOnGpsPosition, center map on new position
			if (mapIsCenteredOnGpsPosition) {
				mapCenter = [position.coords.latitude,position.coords.longitude];
				myMap.flyTo(mapCenter,zoomLevel);
			}
			// Display currentPosition marker
			if (currentLocationIsDisplayed) {
				// Remove currentPosition marker if exists
				if (currentPositionMarker) myMap.removeLayer(currentPositionMarker);
				// Add currentPosition marker
				currentPositionMarker = L.marker(
					[currentPosition.latitude,currentPosition.longitude],
					{icon:redIcon}
				).addTo(myMap);
			}
			// Display GPS infos
			displayGpsInfos();
			toastr.info("Point GPS ok.");
		}, function(error) {
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
			waypoints.list.push(waypoint);
			waypoints.currentIndex = waypoints.list.length - 1;
			waypoints.generateHtml();
			state.current(menuStateCalculation());
			displayDisplayedWaypointsMarker();
			// Display GPS infos
			displayGpsInfos();
			toastr.info("Point GPS marqué.");
		}, function(error) {
			toastr.info("Erreur GPS : " + error.message);
		}
	);	
}

// -----------------------------------------------------------------
// gpsWatchHandler
// -----------------------------------------------------------------

function gpsWatchOnSuccess(position) {
	// Only if different GPS point ---------------------------------
	if (!(position.coords.latitude === currentPosition.latitude && position.coords.longitude === currentPosition.longitude)) {
		currentPosition = position.coords;
		console.log(position);
		tracks.list[4].points.push([position.coords && position.coords.latitude,position.coords && position.coords.longitude]);
		refreshTracksDisplay();
		refreshCurrentPosition();
		toastr.info("Nouveau point GPS.");
	}
	else toastr.info("Même point GPS.");
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
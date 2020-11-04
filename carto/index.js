// -----------------------------------------------------------------
// Default parameters
// -----------------------------------------------------------------
let myMap = null;
let zoomLevel = 13;
let center = [46.589187,15.0133661];
let state = "MAP";
let currentPosition = null;
// Functions -------------------------------------------------------
let init = function() {
	$("#menu").hide();
	// Map instance initialisation ---------------------------------
	myMap = L.map(
		'mapid', 
		{
			center:center,
			zoom:zoomLevel,
			zoomControl: false
		}
	);
	// We add the background ---------------------------------------
	L.tileLayer(
		'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png', 
		{
			attribution:  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			maxZoom: 	19,
			minZoom:	2,
			id: 		'openStreetMap'
		}
	).addTo(myMap);
	// We add the drau radweg --------------------------------------
	L.polyline(drauRadweg,{color:'red'}).addTo(myMap);
	L.polyline(drauSlovenia,{color:'orange'}).addTo(myMap);
	L.polyline(murCroatia,{color:'blue'}).addTo(myMap);
	L.polyline(mur,{color:'green'}).addTo(myMap);
	// We get the current geolocation ------------------------------
	window.navigator.geolocation.getCurrentPosition(
		function(position) {
			currentPosition = position.coords;
			center = [position.coords.latitude,position.coords.longitude];
			myMap.flyTo(center,zoomLevel);
			
		}, function(error) {
			
			//????????????????????????????????????
			// Handle error in toastr
			//document.getElementById("geoloc").innerHTML = error.message;
			//console.log("Erreur de géoloc N°"+error.code+" : "+error.message);
			// ??????????????????????????????????
		}
	);
}

let displayGpsInfo = function() {
	$("#latitude").html(Math.round(currentPosition.latitude * 1000000)/1000000);
	$("#longitude").html(Math.round(currentPosition.longitude * 1000000)/1000000);
	$("#altitude").html(currentPosition.altitude);
	$("#heading").html(currentPosition.heading);
	$("#speed").html(currentPosition.speed);	
}

// Keyboard management ---------------------------------------------
document.addEventListener("keydown", event => {
	switch(event.key) {
		case "SoftLeft":
		// For emulation on Firefox PC 
		case "PageDown":
			event.preventDefault();
			if (zoomLevel > 0) {
				zoomLevel = zoomLevel - 1;
				myMap.setZoom(zoomLevel);
			}
			break;
		case "SoftRight":
		// For emulation on Firefox PC 
		case "PageUp":
			event.preventDefault();
			if (zoomLevel < 19) {
				zoomLevel = zoomLevel + 1;
				myMap.setZoom(zoomLevel);
			}
			break;
		case "ArrowLeft":
			event.preventDefault();
			myMap.panBy([-100,0]);
			event.stopPropagation();
			break;
		case "ArrowRight":
			event.preventDefault();
			myMap.panBy([100,0]);
			event.stopPropagation();
			break;
		// To scroll down
		case "ArrowDown":
			event.preventDefault();
			myMap.panBy([0,100]);
			event.stopPropagation();
			break;
		// To scroll up
		case "ArrowUp":
			event.preventDefault();
			myMap.panBy([0,-100]);
			event.stopPropagation();
			break;
		// Enter
		case "Enter":
			event.preventDefault();
			switch(state) {
				case "MAP":
					state = "MENU";
					$("#map").hide();
					$("#menu").show();
					displayGpsInfo();
					break;
				case "MENU":
					state = "MAP";
					$("#menu").hide();
					$("#map").show();
					break;
			};
			break;
	}
});
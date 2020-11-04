// -----------------------------------------------------------------
// Default parameters
// -----------------------------------------------------------------
let myMap = null;
let zoomLevel = 13;
let center = [46.589187,15.0133661];
let state = "MAP";
let currentPosition = null;

const menuItems = ["INFO_GPS","WAYPOINTS","TRACKS","OTHERS"];
let currentMenuIndex = 0;

const activateMenu = function(currentMenuIndex) {
	menuItems.map(function(item, index) {
		if (index === currentMenuIndex) {
			$("#" + item).addClass("active");
			$("#TARGET_" + item).show();
		}
		else {
			$("#" + item).removeClass("active");
				$("#TARGET_" + item).hide();
		}
	});
}


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
			attribution:  '',
			maxZoom: 	19,
			minZoom:	2,
			id: 		'openStreetMap'
		}
	).addTo(myMap);
	// We add the scale --------------------------------------------
	L.control.scale({
		metric:true,
		imperial:false,
		position:'bottomleft'
	}).addTo(myMap);
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
			switch(state) {
				case "MAP":
					if (zoomLevel > 0) {
						zoomLevel = zoomLevel - 1;
						myMap.setZoom(zoomLevel);
					}
					break;
				case "MENU":
					break;
			};
			break;
		case "SoftRight":
		// For emulation on Firefox PC 
		case "PageUp":
			event.preventDefault();
			switch(state) {
				case "MAP":
					if (zoomLevel < 19) {
						zoomLevel = zoomLevel + 1;
						myMap.setZoom(zoomLevel);
					}
					break;
				case "MENU":
					break;
			};
			break;
		case "ArrowLeft":
			event.preventDefault();
			switch(state) {
				case "MAP":
					myMap.panBy([-100,0]);
					break;
				case "MENU":
					if (currentMenuIndex != 0) 	currentMenuIndex -= 1;
					else 						currentMenuIndex = menuItems.length - 1;
					activateMenu(currentMenuIndex);
					break;
			};
			event.stopPropagation();
			break;
		case "ArrowRight":
			event.preventDefault();
			switch(state) {
				case "MAP":
					myMap.panBy([100,0]);
					break;
				case "MENU":
					if (currentMenuIndex < menuItems.length - 1) currentMenuIndex += 1;
					else 									currentMenuIndex = 0;
					activateMenu(currentMenuIndex);
					break;
			};
			event.stopPropagation();
			break;
		// To scroll down
		case "ArrowDown":
			event.preventDefault();
			switch(state) {
				case "MAP":
					myMap.panBy([0,100]);
					break;
				case "MENU":
					break;
			};
			event.stopPropagation();
			break;
		// To scroll up
		case "ArrowUp":
			event.preventDefault();
			switch(state) {
				case "MAP":
					myMap.panBy([0,-100]);
					break;
				case "MENU":
					break;
			};
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
					activateMenu(currentMenuIndex);
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
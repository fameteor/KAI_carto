// -----------------------------------------------------------------
// Default parameters
// -----------------------------------------------------------------
let myMap = null;
let zoomLevel = 13;
let center = [46.589187,15.0133661];
let state = "MAP";
let currentPosition = null;

const menuItems = ["INFO_GPS","WAYPOINTS","TRACKS","MAP_BACKGROUNDS"];
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

// ??????????????????????????????????????????????

let waypointsList = [
	{label:"essai1",coords:[45,12]},
	{label:"essai2",coords:[47,12]},
	{label:"essai3",coords:[49,12]},
	{label:"essai1",coords:[45,12]},
	{label:"essai2",coords:[47,12]},
	{label:"essai3",coords:[49,12]}
];

// Function to generate dynamix HTML for waypoints list
// this = waypoints Iterable
const waypointsGenerateHtml = function() {
	let html = "";
	const that = this;
	this.list.forEach(function(waypoint,index) {
		html += '<div id="waypoint' + index + '" class="list"><label><i class="fas fa-map-marker"></i> ' + waypoint.label + '</label><input type="checkbox" checked/><div class="info">Latitude : ' + waypoint.coords[0] + '<br/>Longitude : ' + waypoint.coords[1] + '</div></div>';
	});
	$("#waypoints_list").html(html);
	this.refreshSelection();
}

// this = mapBackgrounds Iterable
const waypointsOptions = {
	"selectedDomElementPrefix" : "#waypoint"	
}

const waypoints = new Iterable(waypointsList,waypointsGenerateHtml,waypointsOptions);



let selectedWayPointIndex = 0;


// ?????????????????????????????????????????????

// Only one map background should be be active
let mapBackgroundsList = [
	{label:"web : photos IGN",url:"https://wxs.ign.fr/pratique/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIXSET=PM&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}&STYLE=normal&FORMAT=image/jpeg",active:false},
	{label:"web : carte IGN",url:"https://wxs.ign.fr/pratique/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.MAPS&TILEMATRIXSET=PM&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}&STYLE=normal&FORMAT=image/jpeg",active:true},
	{label:"web : OpenStreetMap",url:"https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",active:false},
	{label:"local : carte IGN",url:"cartes_IGN/{z}/{x}/{y}.jpg",active:false}
];

// Function to generate dynamix HTML for map backgrounds list
// this = mapBackgrounds Iterable
const mapBackgroundsGenerateHtml = function() {
	let html = "";
	const that = this;
	this.list.forEach(function(mapBackground,index) {
		html += '<div id="mapBackground' + index + '" class="list"><label><i class="fas fa-globe"></i> ' + mapBackground.label + '</label><input type="checkbox" ' + (mapBackground.active ? "checked" : "") + '/></div>';
	});
	$("#mapBackground_list").html(html);
}

// this = mapBackgrounds Iterable
const mapBackgroundsOptions = {
	"selectedDomElementPrefix" : "#mapBackground",
	"initialSelectionIndex" : function() {
		let initialSelectionIndex = 0;
		mapBackgroundsList.forEach((mapBackground,index) => {
			if (mapBackground.active) initialSelectionIndex = index;
		});
		return initialSelectionIndex;
	},
	
}

const mapBackgrounds = new Iterable(mapBackgroundsList,mapBackgroundsGenerateHtml,mapBackgroundsOptions);

const getActiveMapBackground = function() {
	return mapBackgroundsList.find(mapBackground => {
		return mapBackground.active;
	});
}

let leafletBackgroundLayer = {};

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
	leafletBackgroundLayer = L.tileLayer(
		getActiveMapBackground().url, 
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
	waypoints.generateHtml();
	mapBackgrounds.generateHtml();
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
		case "Backspace":
			switch(state) {
				case "MAP":
					// Nothing is done : quit the application
					break;
				case "MENU":
					event.preventDefault();
					state = "MAP";
					$("#menu").hide();
					$("#map").show();
					break;
			};
			break;
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
					if (currentMenuIndex === 1) {
						waypoints.next();
					};
					if (currentMenuIndex === 3) {
						mapBackgrounds.next();
					};
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
					if (currentMenuIndex === 1) {
						waypoints.previous();
					};
					if (currentMenuIndex === 3) {
						mapBackgrounds.previous();
					};
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
					if (currentMenuIndex === 3) {
						mapBackgrounds.list.forEach(function(mapBackground,index) {
							if (index === mapBackgrounds.currentIndex) 	mapBackground.active = true;
							else										mapBackground.active = false;
						});
						mapBackgrounds.generateHtml();
						
						myMap.removeLayer(leafletBackgroundLayer);
						leafletBackgroundLayer = L.tileLayer(
							mapBackgrounds.currentItem().url, 
							{
								attribution:  '',
								maxZoom: 	19,
								minZoom:	2,
								id: 		'openStreetMap'
							}
						).addTo(myMap);
					}
					break;
			};
			break;
	}
});
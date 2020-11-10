// -----------------------------------------------------------------
// Settings
// -----------------------------------------------------------------
const lang = "fr";
let myMap = null;
let leafletBackgroundLayer = null;
let zoomLevel = 13;
let mapCenter = [46.589187,15.0133661];
let currentPosition = null;
let currentPositionMarker = null;
let gpsModeIsAuto = false;
let displayedWaypointsMarkerList = [];
let displayedTracksMarkerList = [];

let menuItems = [
	{label:"Infos",statePrefix:"INFOS_GPS"},
	{label:"Points",statePrefix:"WAYPOINTS"},
	{label:"Traces",statePrefix:"TRACKS"},
	{label:"Fonds de carte",statePrefix:"MAP_BACKGROUNDS"},
	{label:"Options",statePrefix:"OPTIONS"},
];

let waypointsList = [
	{label:"A voir",coords:[47.208058,-1.578184],displayed:false},
];

// Only one map background should be be active
let mapBackgroundsList = [
	{label:"web : photos IGN",url:"https://wxs.ign.fr/pratique/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIXSET=PM&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}&STYLE=normal&FORMAT=image/jpeg",active:false},
	{label:"web : carte IGN",url:"https://wxs.ign.fr/pratique/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.MAPS&TILEMATRIXSET=PM&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}&STYLE=normal&FORMAT=image/jpeg",active:false},
	{label:"web : OpenStreetMap",url:"https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",active:true},
	{label:"local : carte IGN",url:"cartes_IGN/{z}/{x}/{y}.jpg",active:false}
];

let tracksList = [
	{label:"Drau radweg Autriche",points:drauRadweg,color:'red',displayed:false,onDisk:false},
	{label:"Drav radweg Slovénie",points:drauSlovenia,color:'orange',displayed:false,onDisk:false},
	{label:"Mur radweg Slovénie",points:murCroatia,color:'blue',displayed:false,onDisk:false},
	{label:"Mur radweg Autriche",points:mur,color:'green',displayed:false,onDisk:false},
	{label:"Enregistrement actuel",points:[],color:'purple',displayed:true,onDisk:false}
];

var redIcon = new L.Icon({
	iconUrl: 'icons/marker-icon-red.png',
	shadowUrl: 'icons/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var blueIcon = new L.Icon({
	iconUrl: 'icons/marker-icon-blue.png',
	shadowUrl: 'icons/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

// -----------------------------------------------------------------
// MENU
// -----------------------------------------------------------------
const menuGenerateHtml = function() {
	let html = '<div class="tab">';
	const that = this;
	this.list.forEach(function(menuItem,index) {
		html += '<span id="menu' + index + '">' + menuItem.label + '</span>';
	});
	html += '</div>';
	$("#menuHeader").html(html);
};

const menuOptions = {
	"selectedDomElementPrefix" :	"#menu",
	"showDomElementPrefix":			"#menuTarget_"
};

const menu = new Iterable(menuItems,menuGenerateHtml,menuOptions);

const menuStateCalculation = function() {
	switch (menu.currentItem().statePrefix) {
		case "INFOS_GPS":
			if (gpsModeIsAuto) 	return "MAP.INFOS_GPS_AUTO";
			else 				return "MAP.INFOS_GPS_MANUAL";
			break;
		case "WAYPOINTS":
			if (waypoints.currentItem().displayed) 	return "MAP.WAYPOINTS_DISPLAYED";
			else 									return "MAP.WAYPOINTS_NOTDISPLAYED";
			break;
		case "TRACKS":
			if (tracks.currentItem().displayed) 	return "MAP.TRACKS_DISPLAYED";
			else 									return "MAP.TRACKS_NOTDISPLAYED";
			break;
		case "MAP_BACKGROUNDS":
			if (mapBackgrounds.currentItem().active) 	return "MAP.MAP_BACKGROUNDS_ACTIVE";
			else 										return "MAP.MAP_BACKGROUNDS_NOTACTIVE";
			break;
		case "OPTIONS":
			if (options.currentItem().target()) 		return "MAP.OPTIONS_ACTIVE";
			else 										return "MAP.OPTIONS_NOTACTIVE";
			break;
	}
}

// -----------------------------------------------------------------
// WAYPOINTS
// -----------------------------------------------------------------
// Function to generate dynamix HTML for waypoints list
// this = waypoints Iterable
const waypointsGenerateHtml = function() {
	let html = "";
	const that = this;
	this.list.forEach(function(waypoint,index) {
		html += '<div id="waypoint' + index + '" class="list"><label><i class="fas fa-map-marker" style="color:#2bcccb;"></i> ' + waypoint.label + '</label><input type="checkbox" ' + (waypoint.displayed ? "checked" : "") + '/><div class="info">Latitude : ' + Math.round(waypoint.coords[0] * 1000000)/1000000 + '<br/>Longitude : ' + Math.round(waypoint.coords[1] * 1000000)/1000000 + '</div></div>';
	});
	$("#waypoints_list").html(html);
	this.refreshSelection();
}

// this = mapBackgrounds Iterable
const waypointsOptions = {
	"selectedDomElementPrefix" : "#waypoint"	
}

const waypoints = new Iterable(waypointsList,waypointsGenerateHtml,waypointsOptions);

const displayDisplayedWaypointsMarker = function() {
	// Remove displayedWaypoints markers if exists
	displayedWaypointsMarkerList.forEach(function(marker) {
		myMap.removeLayer(marker);
	});
	displayedWaypointsMarkerList = [];
	// Add displayedWaypoints markers
	waypoints.list.forEach(function(waypoint) {
		if (waypoint.displayed) {
			const marker = L.marker(
				waypoint.coords,
				{icon:blueIcon}
			).addTo(myMap);
			displayedWaypointsMarkerList.push(marker);
			// Display optionnaly markers names
			if (waypointsNameAreDisplayed) marker.bindTooltip(waypoint.label,{direction: "center"}).openTooltip();
		}
	});
	
};

// -----------------------------------------------------------------
// Tracks
// -----------------------------------------------------------------
// Function to generate dynamix HTML for waypoints list
// this = waypoints Iterable
const tracksGenerateHtml = function() {
	let html = "";
	const that = this;
	this.list.forEach(function(track,index) {
		html += '<div id="track' + index + '" class="list"><label><i class="fas fa-feather" style="color:' + track.color + ';"></i> ' + track.label + '</label><input type="checkbox" ' + (track.displayed ? "checked" : "") + '/><div class="info">' + track.points.length + ' points</div></div>';
	});
	$("#tracks_list").html(html);
	this.refreshSelection();
}

// this = mapBackgrounds Iterable
const tracksOptions = {
	"selectedDomElementPrefix" : "#track"	
}

const tracks = new Iterable(tracksList,tracksGenerateHtml,tracksOptions);

const refreshTracksDisplay = function() {
	// Remove displayedTracks polyline if exists
	displayedTracksMarkerList.forEach(function(polyline) {
		myMap.removeLayer(polyline);
	});
	displayedTracksMarkerList = [];
	// Add displayedTracks polyline
	tracks.list.forEach(function(track) {
		if (track.displayed) {
			const polyline = L.polyline(track.points,{color:track.color}).addTo(myMap);
			displayedTracksMarkerList.push(polyline);
		}
	});
};

// -----------------------------------------------------------------
// MAP BACKGROUNDS
// -----------------------------------------------------------------
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

// -----------------------------------------------------------------
// OPTIONS
// -----------------------------------------------------------------

let optionsList = [
	{label:"Centrer la carte sur la position actuelle",target:function(value) {
		if (value === true || value === false) {
			//Setter
			mapIsCenteredOnGpsPosition = value;
		}
		else {
			//Getter
			return mapIsCenteredOnGpsPosition;
		}
	}},
	{label:"Afficher la position courante",target:function(value) {
		if (value === true || value === false) {
			//Setter
			currentLocationIsDisplayed = value;
		}
		else {
			//Getter
			return currentLocationIsDisplayed;
		}
	}},
	{label:"Moyenner les positions GPS (5s)",target:function(value) {
		if (value === true || value === false) {
			//Setter
			gpsPostProcessing = value;
		}
		else {
			//Getter
			return gpsPostProcessing;
		}
	}},
	{label:"Afficher le nom des points",target:function(value) {
		if (value === true || value === false) {
			//Setter
			waypointsNameAreDisplayed = value;
		}
		else {
			//Getter
			return waypointsNameAreDisplayed;
		}
	}},
];

// Function to generate dynamix HTML for waypoints list
// this = waypoints Iterable
const optionsGenerateHtml = function() {
	let html = "";
	const that = this;
	this.list.forEach(function(option,index) {
		html += '<div id="option' + index + '" class="list"><label><i class="fas fa-cog"></i> ' + option.label + '</label><input type="checkbox" ' + (option.target() ? "checked" : "") + '/><div class="info">Autres infos</div></div>';
	});
	$("#options_list").html(html);
	this.refreshSelection();
}

// this = mapBackgrounds Iterable
const optionsOptions = {
	"selectedDomElementPrefix" : "#option"	
}

const options = new Iterable(optionsList,optionsGenerateHtml,optionsOptions);
					

const displaySoftKeysLabels = function(state) {
	if (softKeysLabels[lang]) {
		if (softKeysLabels[lang][state]) {
			if ("SoftLeft" in softKeysLabels[lang][state]) {
				$("#left").html(softKeysLabels[lang][state].SoftLeft);
			}
			else console.log('There is no softKeysLabels["' + lang + '"]["' + state + '"].SoftLeft property.');
			if ("Center" in softKeysLabels[lang][state]) {
				$("#center").html(softKeysLabels[lang][state].Center);
			}
			else console.log('There is no softKeysLabels["' + lang + '"]["' + state + '"].Center property.');
			if ("SoftRight" in  softKeysLabels[lang][state]) {
				$("#right").html(softKeysLabels[lang][state].SoftRight);
			}
			else console.log('There is no softKeysLabels["' + lang + '"]["' + state + '"].SoftRight property.');
		}
		else console.log('There is no softKeysLabels["' + lang + '"]["' + state + '"] property.');
	}
	else console.log('There is no softKeysLabels["' + lang + '"] property.');
}


// Functions -------------------------------------------------------
let init = function() {
	$("#tracing_green").hide();
	$("#tracing_orange").hide();
	$("#tracing_red").hide();
	state.current("MAP");
	// App visibility check ----------------------------------------
	document.addEventListener("visibilitychange", function () {
		if (document.hidden) {
			appHasFocus = false;
		} 
		else {
			appHasFocus = true;
			refreshCurrentPosition();
		} 
	});
	// Dynamic HTML generation -------------------------------------
	menu.generateHtml();
	waypoints.generateHtml();
	tracks.generateHtml();
	mapBackgrounds.generateHtml();
	options.generateHtml();
	
	$("#menu").hide();
	// Map instance initialisation ---------------------------------
	myMap = L.map(
		'mapid', 
		{
			center:mapCenter,
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
	// We get the current geolocation ------------------------------
	getGpsCurrentPosition();
	// We display the dispayed waypoints markers and tracks --------
	displayDisplayedWaypointsMarker();
	refreshTracksDisplay();	
}


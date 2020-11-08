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
let mapIsCenteredOnGpsPosition = true;
let currentLocationIsDisplayed = true;
let displayedWaypointsMarkerList = [];
let displayedTracksMarkerList = [];

let menuItems = [
	{label:"Infos GPS",statePrefix:"INFOS_GPS"},
	{label:"Waypoints",statePrefix:"WAYPOINTS"},
	{label:"Tracks",statePrefix:"TRACKS"},
	{label:"Fonds de carte",statePrefix:"MAP_BACKGROUNDS"},
];

let waypointsList = [
	{label:"essai1",coords:[45,12],displayed:false},
];

// Only one map background should be be active
let mapBackgroundsList = [
	{label:"web : photos IGN",url:"https://wxs.ign.fr/pratique/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIXSET=PM&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}&STYLE=normal&FORMAT=image/jpeg",active:false},
	{label:"web : carte IGN",url:"https://wxs.ign.fr/pratique/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.MAPS&TILEMATRIXSET=PM&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}&STYLE=normal&FORMAT=image/jpeg",active:false},
	{label:"web : OpenStreetMap",url:"https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",active:true},
	{label:"local : carte IGN",url:"cartes_IGN/{z}/{x}/{y}.jpg",active:false}
];

let tracksList = [
	{label:"Drau radweg Autriche",points:drauRadweg,color:'red',displayed:false},
	{label:"Drav radweg Slovénie",points:drauSlovenia,color:'orange',displayed:false},
	{label:"Mur radweg Slovénie",points:murCroatia,color:'blue',displayed:false},
	{label:"Mur radweg Autriche",points:mur,color:'green',displayed:false},
	{label:"Enregistrement actuel",points:[],color:'purple',displayed:true}
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
		html += '<div id="track' + index + '" class="list"><label><i class="fas fa-feather" style="color:' + track.color + ';"></i> ' + track.label + '</label><input type="checkbox" ' + (track.displayed ? "checked" : "") + '/></div>';
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

/*
Le appState est une arboresecence qui permet de gérer :
- l'affichage des softkeys (left, right, center)
- la gestion des softkeys, backspace et 

Etats impactant l'affichage et l'action des touches :
Pour event :
	ArrowLeft
	ArrowRight
	ArrowUp
	ArrowDown
	Center
	SoftRight
	SoftLeft
	Backspace

Pour affichage :
	Center
	SoftRight
	SoftLeft
*/
// Soft Keys labels --------------------------------------------
// Depending on states, in unknown states, nothing is displayed
const softKeysLabels = {
	"fr" : {
		"MAP" : {
			SoftLeft :	'<i class="fas fa-search-minus"></i>',
			Center : 	"MENU",
			SoftRight :	'<i class="fas fa-search-plus"></i>'
		},
		"MAP.INFOS_GPS_MANUAL" : {
			SoftLeft :	"",
			Center : 	"RAFRAICHIR",
			SoftRight :	"GPS Auto"
		},
		"MAP.INFOS_GPS_AUTO" : {
			SoftLeft :	"",
			Center : 	"",
			SoftRight :	"GPS manuel"
		},
		"MAP.WAYPOINTS_DISPLAYED" : {
			SoftLeft :	"Ajouter",
			Center : 	"CACHER",
			SoftRight :	"Options"
		},
		"MAP.WAYPOINTS_NOTDISPLAYED" : {
			SoftLeft :	"Ajouter",
			Center : 	"AFFICHER",
			SoftRight :	"Options"
		},
		"MAP.WAYPOINTS.ADD" : {
			SoftLeft :	"Annuler",
			Center : 	"ENREGISTRER",
			SoftRight :	""
		},
		"MAP.TRACKS_DISPLAYED" : {
			SoftLeft :	"",
			Center : 	"CACHER",
			SoftRight :	""
		},
		"MAP.TRACKS_NOTDISPLAYED" : {
			SoftLeft :	"",
			Center : 	"AFFICHER",
			SoftRight :	""
		},
		"MAP.SETTING.DISPLAY_MARKER_CURRENT_POSITION.activated" : {
			SoftLeft :	"",
			Center : 	"DESACTIVER",
			SoftRight :	""
		},
			"MAP.SETTING.DISPLAY_MARKER_CURRENT_POSITION.desactivated" : {
			SoftLeft :	"",
			Center : 	"ACTIVER",
			SoftRight :	""
		},
		"MAP.SETTING.CENTER_MAP_ON_CURRENT_POSITION.activated" : {
			SoftLeft :	"",
			Center : 	"DESACTIVER",
			SoftRight :	""
		},
		"MAP.SETTING.CENTER_MAP_ON_CURRENT_POSITION.desactivated" : {
			SoftLeft :	"",
			Center : 	"DESACTIVER",
			SoftRight :	""
		},
		"MAP.MAP_BACKGROUNDS_ACTIVE" : {
			SoftLeft :	"",
			Center : 	"",
			SoftRight :	""
		},
		"MAP.MAP_BACKGROUNDS_NOTACTIVE" : {
			SoftLeft :	"",
			Center : 	"UTILISER",
			SoftRight :	""
		}
	}
}									

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

const keysActions = {
		/*
		"MAP" : {
			ArrowLeft: function(event) {
				alert("ArrowLeft");
			},
			ArrowRight: function(event) {
				alert("ArrowRight");
			},
			ArrowUp: function(event) {
				alert("ArrowUp");
			},
			ArrowDown: function(event) {
				alert("ArrowDown");
			},
			SoftLeft: function(event) {
				alert("SoftLeft");
			},
			Enter: function(event) {
				alert("Enter");
			},
			SoftRight: function(event) {
				alert("SoftRight");
			},
			Backspace: function(event) {
				alert("Backspace");
			}
		},
		*/
		"MAP" : {
			ArrowLeft: function(event) {
				event.preventDefault();
				myMap.panBy([-100,0]);
				event.stopPropagation();
			},
			ArrowRight: function(event) {
				event.preventDefault();
				myMap.panBy([100,0]);
				event.stopPropagation();
			},
			ArrowUp: function(event) {
				event.preventDefault();
				myMap.panBy([0,-100]);
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				myMap.panBy([0,100]);
				event.stopPropagation();
			},
			SoftLeft: function(event) {
				event.preventDefault();
				if (zoomLevel > 0) {
					zoomLevel = zoomLevel - 1;
					myMap.setZoom(zoomLevel);
				}
			},
			Enter: function(event) {
				event.preventDefault();
				$("#map").hide();
				$("#menu").show();
				state.current(menuStateCalculation());
			},
			SoftRight: function(event) {
				event.preventDefault();
				if (zoomLevel < 19) {
					zoomLevel = zoomLevel + 1;
					myMap.setZoom(zoomLevel);
				}
			}
		},
		"MAP.INFOS_GPS_MANUAL" : {
			ArrowLeft: function(event) {
				event.preventDefault();
				menu.previous();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowRight: function(event) {
				event.preventDefault();
				menu.next();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			Enter: function(event) {
				// Refresh GPS
				event.preventDefault();
				getGpsCurrentPosition();
			},
			SoftRight: function(event) {
				event.preventDefault();
				gpsModeIsAuto = true;
				gpsWatchStart();
				state.current(menuStateCalculation());
			},
			Backspace: function(event) {
				event.preventDefault();
				$("#menu").hide();
				$("#map").show();
				state.pop();
			}
		},
		"MAP.INFOS_GPS_AUTO" : {
			ArrowLeft: function(event) {
				event.preventDefault();
				menu.previous();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowRight: function(event) {
				event.preventDefault();
				menu.next();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			SoftRight: function(event) {
				event.preventDefault();
				gpsModeIsAuto = false;
				gpsWatchStop();
				state.current(menuStateCalculation());
			},
			Backspace: function(event) {
				event.preventDefault();
				$("#menu").hide();
				$("#map").show();
				state.pop();
			}
		},
		"MAP.WAYPOINTS_DISPLAYED" : {
			ArrowUp: function(event) {
				event.preventDefault();
				waypoints.previous();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				waypoints.next();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowLeft: function(event) {
				event.preventDefault();
				menu.previous();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowRight: function(event) {
				event.preventDefault();
				menu.next();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			SoftLeft: function(event) {
				event.preventDefault();
				markGpsCurrentPosition();
			},
			Enter: function(event) {
				// Toggle displayed state
				event.preventDefault();
				waypoints.currentItem().displayed = !waypoints.currentItem().displayed;
				waypoints.generateHtml();
				displayDisplayedWaypointsMarker();
				state.current(menuStateCalculation());
			},
			Backspace: function(event) {
				event.preventDefault();
				$("#menu").hide();
				$("#map").show();
				state.pop();
			}
		},
		"MAP.WAYPOINTS_NOTDISPLAYED" : {
			ArrowUp: function(event) {
				event.preventDefault();
				waypoints.previous();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				waypoints.next();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowLeft: function(event) {
				event.preventDefault();
				menu.previous();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowRight: function(event) {
				event.preventDefault();
				menu.next();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			SoftLeft: function(event) {
				event.preventDefault();
				markGpsCurrentPosition();
				event.stopPropagation();
			},
			Enter: function(event) {
				// Toggle displayed state
				event.preventDefault();
				waypoints.currentItem().displayed = !waypoints.currentItem().displayed;
				waypoints.generateHtml();
				displayDisplayedWaypointsMarker();
				state.current(menuStateCalculation());
			},
			Backspace: function(event) {
				event.preventDefault();
				$("#menu").hide();
				$("#map").show();
				state.pop();
			}
		},
		"MAP.WAYPOINTS.ADD" : {
			SoftLeft :	"Annuler",
			Center : 	"ENREGISTRER",
			SoftRight :	""
		},
		"MAP.TRACKS_DISPLAYED" : {
			ArrowUp: function(event) {
				event.preventDefault();
				tracks.previous();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				tracks.next();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowLeft: function(event) {
				event.preventDefault();
				menu.previous();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowRight: function(event) {
				event.preventDefault();
				menu.next();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			Enter: function(event) {
				// Toggle displayed state
				event.preventDefault();
				tracks.currentItem().displayed = !tracks.currentItem().displayed;
				tracks.generateHtml();
				refreshTracksDisplay();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			Backspace: function(event) {
				event.preventDefault();
				$("#menu").hide();
				$("#map").show();
				state.pop();
			}
		},
		"MAP.TRACKS_NOTDISPLAYED" : {
			ArrowUp: function(event) {
				event.preventDefault();
				tracks.previous();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				tracks.next();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowLeft: function(event) {
				event.preventDefault();
				menu.previous();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowRight: function(event) {
				event.preventDefault();
				menu.next();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			Enter: function(event) {
				// Toggle displayed state
				event.preventDefault();
				tracks.currentItem().displayed = !tracks.currentItem().displayed;
				tracks.generateHtml();
				refreshTracksDisplay();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			Backspace: function(event) {
				event.preventDefault();
				$("#menu").hide();
				$("#map").show();
				state.pop();
			}
		},
		"MAP.SETTING.DISPLAY_MARKER_CURRENT_POSITION.activated" : {
			SoftLeft :	"",
			Center : 	"DESACTIVER",
			SoftRight :	""
		},
		"MAP.SETTING.DISPLAY_MARKER_CURRENT_POSITION.desactivated" : {
			SoftLeft :	"",
			Center : 	"ACTIVER",
			SoftRight :	""
		},
		"MAP.SETTING.CENTER_MAP_ON_CURRENT_POSITION.activated" : {
			SoftLeft :	"",
			Center : 	"DESACTIVER",
			SoftRight :	""
		},
		"MAP.SETTING.CENTER_MAP_ON_CURRENT_POSITION.desactivated" : {
			SoftLeft :	"",
			Center : 	"DESACTIVER",
			SoftRight :	""
		},
		"MAP.MAP_BACKGROUNDS_ACTIVE" : {
			ArrowUp: function(event) {
				event.preventDefault();
				mapBackgrounds.previous();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				mapBackgrounds.next();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowLeft: function(event) {
				event.preventDefault();
				menu.previous();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowRight: function(event) {
				event.preventDefault();
				menu.next();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			Backspace: function(event) {
				event.preventDefault();
				$("#menu").hide();
				$("#map").show();
				state.pop();
			}
		},
		"MAP.MAP_BACKGROUNDS_NOTACTIVE" : {
			ArrowUp: function(event) {
				event.preventDefault();
				mapBackgrounds.previous();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowDown: function(event) {
				event.preventDefault();
				mapBackgrounds.next();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowLeft: function(event) {
				event.preventDefault();
				menu.previous();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			ArrowRight: function(event) {
				event.preventDefault();
				menu.next();
				state.current(menuStateCalculation());
				event.stopPropagation();
			},
			Enter: function(event) {
				// Toggle displayed state
				event.preventDefault();
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
				displayDisplayedWaypointsMarker();
				state.current(menuStateCalculation());
			},
			Backspace: function(event) {
				event.preventDefault();
				$("#menu").hide();
				$("#map").show();
				state.pop();
			}
		}
}		

// Firefox PC compatibility : -------------------------------------- 
// - PageDown replaces SoftLeft
// - PageUp replaces SoftRight
Object.keys(keysActions).forEach(function(state) {
	if (keysActions[state].SoftLeft) keysActions[state].PageDown = keysActions[state].SoftLeft;
	if (keysActions[state].SoftRight) keysActions[state].PageUp = keysActions[state].SoftRight;
});
// -----------------------------------------------------------------



// Functions -------------------------------------------------------
let init = function() {
	state.current("MAP");
	// Dynamic HTML generation -------------------------------------
	menu.generateHtml();
	waypoints.generateHtml();
	tracks.generateHtml();
	mapBackgrounds.generateHtml();
	
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


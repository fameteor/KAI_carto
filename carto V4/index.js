// -----------------------------------------------------------------
// App object
// -----------------------------------------------------------------
let app = {
	lang : 						"fr",
	hasFocus : 					true,
	// Map ------------------------------------------------------
	mapId : 					"myMap",
	myMap : 					null,		// Leaflet map handler
	myMapBackgroundLayer:		null,		// Leaflet background Layer handler
	myMapLayer:					null,		// Leaflet Layer handler
	zoomLevel :					13,
	mapCenter:					[47,0], 	// [46.589187,15.0133661],
	// GPS ------------------------------------------------------
	gpsWatchHandler:			null,
	gpsLockHandler:				null,		// To lock GPS resource when focus is off
	// Current poistion -----------------------------------------
	currentPosition :			new Waypoint({
		coords :				null,
		markerIcon : 			"redIcon",
		label:					"Position actuelle",
		markerIsDisplayedOnTheMap:true
	}),
	screenWidthScroll:			0,
	// Current track --------------------------------------------
	currentTrack : 				new Track({}),
	
	
	
	onFocus : function() {
		
	},
	options : {
		mapIsCenteredOnGpsPosition: true,
		waypointsNameAreDisplayed: 	false,
		gpsPostProcessingisOn: 		true,
		recordRawCoords:			true,
		itineraryProfile:			"cycling-regular",
		coordinatesFormat:			"DDD.xxxxxx",
		units:						"Métriques"
	}
}

// -----------------------------------------------------------------
let menuItems = [
	{
		label:"Infos",
		statePrefix:"INFOS_GPS",
		onSelected : function() {
			// We force to "info" view
			/*
			state.infosOptions = false;
			state.infosOptionsValue = "",
			
			
			$("#infosOptions").hide();
			*/
			infos_startTracking_question = false;
			$("#infos").show();
		}
	},
	{
		label:"Points",
		statePrefix:"WAYPOINTS",
		onSelected : function() {
			// We force to "waypoint" view
			state.waypoints_options = false;
			state.waypoints_options_rename = false;
			state.waypoints_options_delete = false;
			displaySoftKeysLabels();
			waypoints.generateHtml();
		}
	},
	{
		label:"Traces",
		statePrefix:"TRACKS",
		onSelected : function() {
			// We force to "track" view
			state.tracks_actions = false;
			displaySoftKeysLabels();
			tracks.generateHtml();
			tracks.refreshMap();
		}
	},
	{
		label:"Fonds de carte",
		statePrefix:"MAP_BACKGROUNDS"
	},
	{
		label:"Options",
		statePrefix:"OPTIONS",
		onSelected : function() {
			options.refreshSelection();
		}
	},
	{
		label:"Fichiers",
		statePrefix:"FILES",
		onSelected : function() {
			state.files_actions = false;
			files.getAndDisplayFilesFromSD();
			displaySoftKeysLabels();
		}
	},
	{
		label:"Calques",
		statePrefix:"LAYERS"
	},
	{
		label:"Chercher",
		statePrefix:"SEARCH",
		onSelected : function() {
			// If results are available, display results
			if (	search.resultRotator &&
					search.resultRotator.list &&
					search.resultRotator.list.length > 0) {
				// we go to the state result
				search.resultRotator.generateHtml();
				state.search_state = "result";
				displaySoftKeysLabels();
			}
			// Otherwise display input
			else {
				search.displayInput();
			}
		}
	},
];

const menuOptions = {
	"selectedItemIdPrefix" :	"menuItem",
	"showDomElementPrefix":		"#menuTarget_"
};

const menu = new Menu(menuItems,menuOptions);

// -----------------------------------------------------------------
// Options
// -----------------------------------------------------------------
let optionsList = [
	{	
		label:"Centrer la carte sur la position GPS",
		rotatorType:"BOOLEAN",
		rotatorIcon:"fas fa-cog",
		rotatorValue:function(value) {
			if (value != undefined) {
				// Setter
				app.options.mapIsCenteredOnGpsPosition = value;
			}
			else {
				// Getter
				return app.options.mapIsCenteredOnGpsPosition;
			}
		}
	},
	{	
		label:"Afficher la position actuelle sur la carte",
		rotatorType:"BOOLEAN",
		rotatorIcon:"fas fa-cog",
		rotatorValue:function(value) {
			if (value != undefined) {
				// Setter
				app.currentPosition.markerIsDisplayedOnTheMap = value;
				app.currentPosition.refreshMap();
			}
			else {
				// Getter
				return app.currentPosition.markerIsDisplayedOnTheMap;
			}
		}
	},
	{	
		label:"Afficher la trace actuelle sur la carte",
		rotatorType:"BOOLEAN",
		rotatorIcon:"fas fa-cog",
		rotatorValue:function(value) {
			if (value != undefined) {
				// Setter
				app.currentTrack.trackIsDisplayedOnTheMap = value;
				app.currentTrack.refreshMap();
			}
			else {
				// Getter
				return app.currentTrack.trackIsDisplayedOnTheMap;
			}
		}
	},
	{	
		label:"Afficher le nom des points sur la carte",
		rotatorType:"BOOLEAN",
		rotatorIcon:"fas fa-cog",
		rotatorValue:function(value) {
			if (value != undefined) {
				// Setter
				app.options.waypointsNameAreDisplayed = value;
			}
			else {
				// Getter
				return app.options.waypointsNameAreDisplayed;
			}
		}
	},
	{	
		label:"Filtrage GPS",
		rotatorType:"BOOLEAN",
		rotatorIcon:"fas fa-cog",
		rotatorValue:function(value) {
			if (value != undefined) {
				// Setter
				app.options.gpsPostProcessingisOn = value;
			}
			else {
				// Getter
				return app.options.gpsPostProcessingisOn;
			}
		},
		rotatorInfos: function() {
			return "1 position/s moyennées toutes les 10s (accuracy < 50)";
		}
	},
	{	
		label:"Enregistrement de la trace non filtée en plus",
		rotatorType:"BOOLEAN",
		rotatorIcon:"fas fa-cog",
		rotatorValue:function(value) {
			if (value != undefined) {
				// Setter
				app.options.recordRawCoords = value;
			}
			else {
				// Getter
				return app.options.recordRawCoords;
			}
		}
	},
	{	
		label:"Format des coordonnées",
		value:"coordinatesFormat",
		rotatorType:"SELECT",
		rotatorIcon:"fas fa-cog",
		rotatorValue:function(value) {
			if (value != undefined) {
				// Setter
				app.options.coordinatesFormat = value;
			}
			else {
				// Getter
				return app.options.coordinatesFormat;
			}
		},
		rotatorInfos: function() {
			return app.options.coordinatesFormat;
		}
	},
	{	
		label:"Unités",
		value:"units",
		rotatorType:"SELECT",
		rotatorIcon:"fas fa-cog",
		rotatorValue:function(value) {
			if (value != undefined) {
				// Setter
				app.options.units = value;
			}
			else {
				// Getter
				return app.options.units
			}
		},
		rotatorInfos: function() {
			return app.options.units;
		}
	},
	{	
		label:"Mode de transport (itinéraires)",
		value:"itineraryProfile",
		rotatorType:"SELECT",
		rotatorIcon:"fas fa-cog",
		rotatorValue:function(value) {
			if (value != undefined) {
				// Setter
				app.options.itineraryProfile = value;
			}
			else {
				// Getter
				return app.options.itineraryProfile
			}
		},
		rotatorInfos: function() {
			return app.options.itineraryProfile;
		}
	}
];

const optionsOptions = {
	"selectedItemIdPrefix" : 	"option",
	"targetDomSelector" : 		"#menuTarget_4"
}



const options = new Rotator(optionsList,optionsOptions);

// -----------------------------------------------------------------
// OptionsCoordinatesFormat
// -----------------------------------------------------------------
let optionsCoordinatesFormatList = [
	{	
		label:"DDD.xxxxxx",
		rotatorType:"BOOLEAN",
		rotatorIcon:"fas fa-cog",
		rotatorValue:function(value) {
			// Getter only of the selected value
			return this.label === app.options.coordinatesFormat;
		}
	},
	{	
		label:"DDD° MM.xxxx'",
		rotatorType:"BOOLEAN",
		rotatorIcon:"fas fa-cog",
		rotatorValue:function(value) {
			// Getter only of the selected value
			return this.label === app.options.coordinatesFormat;
		}
	},
	{	
		label:"DDD° MM' SS\"",
		rotatorType:"BOOLEAN",
		rotatorIcon:"fas fa-cog",
		rotatorValue:function(value) {
			// Getter only of the selected value
			return this.label === app.options.coordinatesFormat;
		}
	}
];

const optionsCoordinatesFormatOptions = {
	"selectedItemIdPrefix" : 		"optionsCoordinatesFormatOptions",
	"targetDomSelector" : 			"#menuTarget_4",
	"initialSelectionIndex" : function() {
		let initialSelectionIndex = 0;
		optionsCoordinatesFormatList.forEach((option,index) => {
			if (option.label === app.options.coordinatesFormat) initialSelectionIndex = index;
		});
		return initialSelectionIndex;
	},
}



const optionsCoordinatesFormat = new Rotator(optionsCoordinatesFormatList,optionsCoordinatesFormatOptions);

// -----------------------------------------------------------------
// OptionsUnitsFormat
// -----------------------------------------------------------------
let optionsUnitsList = [
	{	
		label:"Métriques",
		rotatorType:"BOOLEAN",
		rotatorIcon:"fas fa-cog",
		rotatorValue:function(value) {
			// Getter only of the selected value
			return this.label === app.options.units;
		}
	},
	{	
		label:"Nautiques",
		rotatorType:"BOOLEAN",
		rotatorIcon:"fas fa-cog",
		rotatorValue:function(value) {
			// Getter only of the selected value
			return this.label === app.options.units;
		}
	}
];

const optionsUnitsOptions = {
	"selectedItemIdPrefix" : 		"optionsUnitsOptions",
	"targetDomSelector" : 			"#menuTarget_4",
	"initialSelectionIndex" : function() {
		let initialSelectionIndex = 0;
		optionsUnitsList.forEach((option,index) => {
			if (option.label === app.options.units) initialSelectionIndex = index;
		});
		return initialSelectionIndex;
	},
}



const optionsUnits = new Rotator(optionsUnitsList,optionsUnitsOptions);

// -----------------------------------------------------------------
// OptionsProfile
// -----------------------------------------------------------------
let optionsProfileList = [
	{	
		label:"driving-car",
		rotatorType:"BOOLEAN",
		rotatorIcon:"fas fa-cog",
		rotatorValue:function(value) {
			// Getter only of the selected value
			return this.label === app.options.itineraryProfile;
		},
		rotatorInfos: "(Voiture normale)"
	},
	{	
		label:"driving-hgv",
		rotatorType:"BOOLEAN",
		rotatorIcon:"fas fa-cog",
		rotatorValue:function(value) {
			// Getter only of the selected value
			return this.label === app.options.itineraryProfile;
		},
		rotatorInfos: "(Véhicule > 3.5 tonnes)"
	},
	{	
		label:"cycling-regular",
		rotatorType:"BOOLEAN",
		rotatorIcon:"fas fa-cog",
		rotatorValue:function(value) {
			// Getter only of the selected value
			return this.label === app.options.itineraryProfile;
		},
		rotatorInfos:"(Routes + importantes interdites)"
	},
	{	
		label:"cycling-road",
		rotatorType:"BOOLEAN",
		rotatorIcon:"fas fa-cog",
		rotatorValue:function(value) {
			// Getter only of the selected value
			return this.label === app.options.itineraryProfile;
		},
		rotatorInfos:"(Pas revêtu = pousser, mais routes + importantes autorisées)"
	},
	{	
		label:"cycling-mountain",
		rotatorType:"BOOLEAN",
		rotatorIcon:"fas fa-cog",
		rotatorValue:function(value) {
			// Getter only of the selected value
			return this.label === app.options.itineraryProfile;
		},
		rotatorInfos:"(On roule partout, routes + importantes interdites)"
	},
	{	
		label:"cycling-electric",
		rotatorType:"BOOLEAN",
		rotatorIcon:"fas fa-cog",
		rotatorValue:function(value) {
			// Getter only of the selected value
			return this.label === app.options.itineraryProfile;
		},
		rotatorInfos:"(Vitesse non affectée par le dénivellé, routes + importantes interdites)"
	},
	{	
		label:"foot-walking",
		rotatorType:"BOOLEAN",
		rotatorIcon:"fas fa-cog",
		rotatorValue:function(value) {
			// Getter only of the selected value
			return this.label === app.options.itineraryProfile;
		}
	},
	{	
		label:"foot-hiking",
		rotatorType:"BOOLEAN",
		rotatorIcon:"fas fa-cog",
		rotatorValue:function(value) {
			// Getter only of the selected value
			return this.label === app.options.itineraryProfile;
		},
		rotatorInfos:"(Randonnée, y compris haute montagne semble-t-il)"
	},
	{	
		label:"wheelchair",
		rotatorType:"BOOLEAN",
		rotatorIcon:"fas fa-cog",
		rotatorValue:function(value) {
			// Getter only of the selected value
			return this.label === app.options.itineraryProfile;
		}
	}
];

const optionsProfileOptions = {
	"selectedItemIdPrefix" : 		"optionsProfileOptions",
	"targetDomSelector" : 			"#menuTarget_4",
	"initialSelectionIndex" : function() {
		let initialSelectionIndex = 0;
		optionsProfileList.forEach((option,index) => {
			if (option.label === app.options.itineraryProfile) initialSelectionIndex = index;
		});
		return initialSelectionIndex;
	},
}



const optionsProfile = new Rotator(optionsProfileList,optionsProfileOptions);

// -----------------------------------------------------------------
// InfosOptions
// -----------------------------------------------------------------
let infosOptionsList = [
	{	
		label:"Enregistrer la trace actuelle",
		rotatorType:"MENU"
	}
];

const infosOptionsOptions = {
	"selectedItemIdPrefix" : 		"infosOption",
	"targetDomSelector" : 			"#infosOptions"
}



// -----------------------------------------------------------------
// Initialisation
// -----------------------------------------------------------------
window.onload = function() {
	// Hide tracing leds ---------------------------------------
	$("#tracing_green").hide();
	$("#tracing_orange").hide();
	$("#tracing_red").hide();
	// Generate HTML -------------------------------------------
	menu.generateHtml();
	options.generateHtml();
	waypoints.generateHtml();
	tracks.generateHtml();
	mapBackgrounds.generateHtml();
	layers.generateHtml();
	// Display sofkeys -----------------------------------------
	displaySoftKeysLabels();
	// Map initialisation --------------------------------------
	app.myMap = L.map(
		app.mapId, 
		{
			center:			app.mapCenter,
			zoom:			app.zoomLevel,
			zoomControl: 	false
		}
	);
	// Background layer added ----------------------------------
	mapBackgrounds.refreshMap();
	layers.refreshMap();
	waypoints.refreshMap();
	tracks.refreshMap();
	gps.setAndDisplayCurrentPosition();
	gps.refreshCurrentPosition();
	// We add the scale ----------------------------------------
	L.control.scale({
		metric:true,
		imperial:false,
		position:'bottomleft'		
	}).addTo(app.myMap);
	// Start on map display ------------------------------------
	$("#map").show();
	$("#menu").hide();
	$("#root").hide();
	console.log("INIT done");
}


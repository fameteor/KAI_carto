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
	zoomLevel :					13,
	mapCenter:					[47,0], 	// [46.589187,15.0133661],
	// GPS ------------------------------------------------------
	gpsWatchHandler:			null,
	gpsLockHandler:				null,		// To lock GPS resource when focus is off
	// Current poistion -----------------------------------------
	currentPosition :			new Waypoint({
		coords :				null,
		markerIcon : 			redIcon,
		label:					"Position actuelle",
		markerIsDisplayedOnTheMap:true
	}),
	// Current track --------------------------------------------
	currentTrack : 				new Track({}),
	
	
	
	onFocus : function() {
		
	},
	options : {
		mapIsCenteredOnGpsPosition: true,
		waypointsNameAreDisplayed: 	false,
		gpsPostProcessingisOn: 		true,
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
	}
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
			return "1 position/s moyennées toutes les 5s";
		}
	},
	{	
		label:"Format des coordonnées",
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
	// Background layer added
	mapBackgrounds.refreshMap();
	waypoints.refreshMap();
	tracks.refreshMap();
	gps.setAndDisplayCurrentPosition();
	gps.refreshCurrentPosition();
	// Start on map display ------------------------------------
	$("#map").show();
	$("#menu").hide();
	$("#root").hide();
	console.log("INIT done");
}


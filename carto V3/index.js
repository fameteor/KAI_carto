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
	mapCenter:					[47,0], 		// [46.589187,15.0133661],
	// GPS ------------------------------------------------------
	gpsTraceIsOn:				false,
	// Current poistion -----------------------------------------
	currentPosition :			new Waypoint({
		coords :				null,
		markerIcon : 			redIcon,
		label:					"Position actuelle",
		markerIsDisplayedOnTheMap:true
	}),
	
	
	
	onFocus : function() {
		
	},
	options : {
		mapIsCenteredOnGpsPosition: true,
		waypointsNameAreDisplayed: 	false,
		gpsPostProcessingisOn: 		true,
		coordinatesFormat:			"DDD° MM.xxxx'",
		units:						"Nautiques"
	}
}


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
			}
			else {
				// Getter
				return app.currentPosition.markerIsDisplayedOnTheMap;
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
	}
];

const optionsOptions = {
	"selectedItemIdPrefix" : 	"option",
	"targetDomSelector" : 			"#menuTarget_4"
}



const options = new Rotator(optionsList,optionsOptions);

// -----------------------------------------------------------------
let infosOptionsList = [
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

const infosOptionsOptions = {
	"selectedItemIdPrefix" : 		"infosOption",
	"targetDomSelector" : 			"#infosOptions"
}



const infosOptions = new Rotator(infosOptionsList,infosOptionsOptions);

// -----------------------------------------------------------------
let infosOptionsCoordinatesFormatList = [
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

const infosOptionsCoordinatesFormatOptions = {
	"selectedItemIdPrefix" : 		"infosOptionsCoordinatesFormatOptions",
	"targetDomSelector" : 			"#infosOptions",
	"initialSelectionIndex" : function() {
		let initialSelectionIndex = 0;
		infosOptionsCoordinatesFormatList.forEach((option,index) => {
			if (option.label === app.options.coordinatesFormat) initialSelectionIndex = index;
		});
		return initialSelectionIndex;
	},
}



const infosOptionsCoordinatesFormat = new Rotator(infosOptionsCoordinatesFormatList,infosOptionsCoordinatesFormatOptions);

// -----------------------------------------------------------------
let infosOptionsUnitsList = [
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

const infosOptionsUnitsOptions = {
	"selectedItemIdPrefix" : 		"infosOptionsUnitsOptions",
	"targetDomSelector" : 			"#infosOptions",
	"initialSelectionIndex" : function() {
		let initialSelectionIndex = 0;
		infosOptionsUnitsList.forEach((option,index) => {
			if (option.label === app.options.units) initialSelectionIndex = index;
		});
		return initialSelectionIndex;
	},
}



const infosOptionsUnits = new Rotator(infosOptionsUnitsList,infosOptionsUnitsOptions);



// -----------------------------------------------------------------
let menuItems = [
	{
		label:"Infos",
		statePrefix:"INFOS_GPS",
		onSelected : function() {
			// We force to "info" view
			state.infosOptions = false;
			state.infosOptionsValue = "",
			$("#infosOptions").hide();
			$("#infos").show();
		}
	},
	{
		label:"Points",
		statePrefix:"WAYPOINTS",
		onSelected : function() {
			// We force to "waypoint" view
			state.waypointsOptions = false;
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
// Initialisation
// -----------------------------------------------------------------
let init = function() {
	
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


// -----------------------------------------------------------------
// waypoints_initialList
// -----------------------------------------------------------------
let waypoints_initialList = [
	{
		coords :						[47,0],
		altitude :						null,
		timestamp :						0,
		label :							"essai",
		markerIsDisplayedOnTheMap : 	false
	},
	{
		coords :						[46.589187,15.0133661],
		altitude :						null,
		timestamp :						0,
		label :							"Dravograd",
		markerIsDisplayedOnTheMap : 	true
	}
];

// -----------------------------------------------------------------
// ICONS
// -----------------------------------------------------------------
const redIcon = new L.Icon({
	iconUrl: 'icons/marker-icon-red.png',
	shadowUrl: 'icons/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

const blueIcon = new L.Icon({
	iconUrl: 'icons/marker-icon-blue.png',
	shadowUrl: 'icons/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

// -----------------------------------------------------------------
// Waypoint CLASS
// -----------------------------------------------------------------
const Waypoint = function(initial) {
	// Properties --------------------------------------------------
	this.coords = 						initial.coords ||	[47,0];
	this.altitude = 					initial.altitude || null;
	this.timestamp = 					initial.timestamp || (new Date().getTime());
	this.label = 						initial.label || 	null;
	this.markerIsDisplayedOnTheMap = 	initial.markerIsDisplayedOnTheMap || false;
	this.markerIcon = 					initial.markerIcon || blueIcon;
	// Should be private -------------------------------------------
	this.myMapMarker = 					null;		// Leaflet current position marker handler
	this.isTarget = 					false;
	// For Rotator usage only --------------------------------------
	this.rotatorType = 					initial.rotatorType || "BOOLEAN";
	this.rotatorIcon = 					initial.rotatorIcon ||"fas fa-map-marker";
	this.rotatorValue = 				initial.rotatorValue || function(value) {
		if (value != undefined) {
			// Setter
			this.markerIsDisplayedOnTheMap = value;
		}
		else {
			// Getter
			return this.markerIsDisplayedOnTheMap;
		}
	};
	this.rotatorInfos = 				initial.rotatorInfos || function() {
		let target = "";
		if (this.isTarget) target = '<i class="fas fa-bullseye green"></i>';
		return target + " ( lat : " + format_coords[app.options.coordinatesFormat](this.coords[0]) + ", lon :" + format_coords[app.options.coordinatesFormat](this.coords[1]) + " )";
	};
}

// Refresh the marker on the map -----------------------------------
Waypoint.prototype.refreshMap = function() {
	if (this.markerIsDisplayedOnTheMap) {
		// Remove marker if exists
		if (this.myMapMarker) app.myMap.removeLayer(this.myMapMarker);
		// Add currentPosition marker
		this.myMapMarker = L.marker(
			this.coords,
			{icon:this.markerIcon}
		).addTo(app.myMap);
		// Display optionnally markers names -------------------
		if (app.options.waypointsNameAreDisplayed) {
			this.myMapMarker.bindTooltip(
				this.label,
				{direction: "center"}
			).openTooltip();
		}
	}
	else {
		// Remove marker if exists
		if (this.myMapMarker) app.myMap.removeLayer(this.myMapMarker);
		this.myMapMarker = null;
	}
}

// -----------------------------------------------------------------
// Waypoints ROTATOR
// -----------------------------------------------------------------
const waypointsOptions = {
	"selectedItemIdPrefix" : 		"waypoint",
	"targetDomSelector" : 			"#menuTarget_1",
	"itemsNumbered":				"reverse"
	/*
	"initialSelectionIndex" : function() {
		let initialSelectionIndex = 0;
		infosOptionsUnitsList.forEach((option,index) => {
			if (option.label === app.options.units) initialSelectionIndex = index;
		});
		return initialSelectionIndex;
	},
	*/
	
}

// Waypoints conversion in objects
waypoints_initialList = waypoints_initialList.map(function(waypoint) {
	return new Waypoint(waypoint);
});

const waypoints = new Rotator(waypoints_initialList,waypointsOptions);

waypoints.refreshMap = function() {
	this.list.forEach(function(waypoint) {
		waypoint.refreshMap();
	});
}

waypoints.target = function(targetWaypoint) {
	if (targetWaypoint != undefined) {
		// Setter :
		this.list.forEach(function(waypoint){
			if (waypoint === targetWaypoint) 	waypoint.isTarget = true;
			else 								waypoint.isTarget = false;
		});
	}
	else {
		// Getter
		const value = this.list.find(waypoint => {
			return waypoint.isTarget;
		});
		return value;
	}
}

// -----------------------------------------------------------------
// waypoints_options ROTATOR
// -----------------------------------------------------------------
let waypoints_options_list = [
	{	
		label:"Aller vers",
		rotatorType:"MENU",
		state:"goto"
	},
	{	
		label:"Renommer",
		rotatorType:"MENU",
		state:"rename"
	}
];

const waypoints_options_options = {
	"selectedItemIdPrefix" : 		"waypoints_options",
	"targetDomSelector" : 			"#menuTarget_1"
}



const waypoints_options = new Rotator(waypoints_options_list,waypoints_options_options);
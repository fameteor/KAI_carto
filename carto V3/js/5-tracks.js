// =================================================================
// TRACKS
// =================================================================

let tracks_initialList = [
	{label:"Essai",coords:[],color:'black',markerIsDisplayedOnTheMap:true},
	{label:"Drau radweg Autriche",coords:drauRadweg,color:'red',markerIsDisplayedOnTheMap:true},
	{label:"Drav radweg Slovénie",coords:drauSlovenia,color:'orange',markerIsDisplayedOnTheMap:true},
	{label:"Mur radweg Slovénie",coords:murCroatia,color:'blue',markerIsDisplayedOnTheMap:true},
	{label:"Mur radweg Autriche",coords:mur,color:'green',markerIsDisplayedOnTheMap:true},
	{label:"Enregistrement actuel",coords:[],color:'purple',markerIsDisplayedOnTheMap:true}
];

// -----------------------------------------------------------------
// Track CLASS
// -----------------------------------------------------------------
const Track = function(initial) {
	// Properties --------------------------------------------------
	this.coords = 						initial.coords ||	[];
	/* future use
	this.altitudes = 					initial.altitude || [];
	this.timestamps = 					initial.timestamp || [];
	*/
	this.label = 						initial.label || 	null;
	this.color = 						initial.color || 'red';
	this.trackIsDisplayedOnTheMap = 	initial.markerIsDisplayedOnTheMap || true;
	// Should be private -------------------------------------------
	this.myMapTrack = 					null;		// Leaflet current position marker handler
	// For Rotator usage only --------------------------------------
	this.rotatorType = 					initial.rotatorType || "BOOLEAN";
	this.rotatorIcon = 					initial.rotatorIcon || 'fas fa-feather ' + this.color;
	this.rotatorValue = 				initial.rotatorValue || function(value) {
		if (value != undefined) {
			// Setter
			this.trackIsDisplayedOnTheMap = value;
		}
		else {
			// Getter
			return this.trackIsDisplayedOnTheMap;
		}
	};
	this.rotatorInfos = 				initial.rotatorInfos || function() {
		return this.coords.length + " point" + (this.coords.length != 0 ? "s" : "");
	};
}

// Refresh the track on the map -----------------------------------
Track.prototype.refreshMap = function() {
	if (this.trackIsDisplayedOnTheMap) {
		// Remove marker if exists
		if (this.myMapTrack) app.myMap.removeLayer(this.myMapTrack);
		// Add currentPosition marker
		this.myMapTrack = L.polyline(
			this.coords,{
			color:this.color}
		).addTo(app.myMap);
	}
	else {
		// Remove marker if exists
		if (this.myMapTrack) app.myMap.removeLayer(this.myMapTrack);
		this.myMapTrack = null;
	}
}

// -----------------------------------------------------------------
// Tracks ROTATOR
// -----------------------------------------------------------------
const tracksOptions = {
	"selectedItemIdPrefix" : 		"track",
	"targetDomSelector" : 			"#menuTarget_2",
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
tracks_initialList = tracks_initialList.map(function(track) {
	return new Track(track);
});

const tracks = new Rotator(tracks_initialList,tracksOptions);

tracks.refreshMap = function() {
	this.list.forEach(function(track) {
		track.refreshMap();
	});
}
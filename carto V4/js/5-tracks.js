// =================================================================
// TRACKS
// =================================================================

let tracks_initialList = [
	{label:"Drau radweg Autriche",coords:drauRadweg,color:'red',trackIsDisplayedOnTheMap:true},
	{label:"Drav radweg Slovénie",coords:drauSlovenia,color:'orange',trackIsDisplayedOnTheMap:true},
	{label:"Mur radweg Slovénie",coords:murCroatia,color:'blue',trackIsDisplayedOnTheMap:true},
	{label:"Mur radweg Autriche",coords:mur,color:'green',trackIsDisplayedOnTheMap:true}
];

// -----------------------------------------------------------------
// Track CLASS
// -----------------------------------------------------------------
const Track = function(initial) {
	// Properties --------------------------------------------------
	this.coords = 						initial.coords ||	[];
	this.altitudes = 					initial.altitude || [];
	this.timestamps = 					initial.timestamp || [];
	this.label = 						initial.label || 	null;
	this.color = 						initial.color || 'red';
	this.trackIsDisplayedOnTheMap = 	initial.trackIsDisplayedOnTheMap || true;
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

// writeToDisk ------------------------------------------------------
Track.prototype.writeToSD = function() {
	if (navigator.getDeviceStorage) {
		var sdcard = navigator.getDeviceStorage("sdcard");
		var file   = new Blob([JSON.stringify(this,["coords","altitudes","timestamps","label"])], {type: "text/plain"});
		var request = sdcard.addNamed(file, "carto/" + this.timestamps[0] + ".trk");

		request.onsuccess = function () {
		  var name = this.result;
		  toastr.info('Fichier "' + name + '" ajouté sur la carte SD.');
		}

		// An error typically occur if a file with the same name already exist
		request.onerror = function () {
		  toastr.warning('Impossible d\'écrire sur la carte SD.')
		  console.warn(this);
		}
	}
	else console.log("Ecriture non supportée sur PC.");					
};

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

// -----------------------------------------------------------------
// tracks_actions ROTATOR
// -----------------------------------------------------------------
let tracks_actions_list = [
	{	
		label:"Renommer",
		rotatorType:"MENU",
		value:"rename"
	},
	{	
		label:"Supprimer",
		rotatorType:"MENU",
		value:"delete"
	},
	{	
		label:"Changer la couleur",
		rotatorType:"MENU",
		value:"changeColor"
	},
];

const tracks_actions_options = {
	"selectedItemIdPrefix" : 		"tracks_actions",
	"targetDomSelector" : 			"#menuTarget_2"
}



const tracks_actions = new Rotator(tracks_actions_list,tracks_actions_options);
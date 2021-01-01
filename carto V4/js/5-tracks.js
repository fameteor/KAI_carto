// =================================================================
// TRACKS
// =================================================================

let tracks_initialList = [
/*
	{label:"Drau radweg Autriche",coords:drauRadweg,color:'red',trackIsDisplayedOnTheMap:true,type:"ITINERARY",rotatorIcon:'fas fa-bicycle'},
	{label:"Drau radweg Slovenie",coords:drauSlovenia,color:'orange',trackIsDisplayedOnTheMap:true,type:"ITINERARY",rotatorIcon:'fas fa-bicycle'},
	{label:"Mur radweg Autriche",coords:mur,color:'green',trackIsDisplayedOnTheMap:true,type:"ITINERARY",rotatorIcon:'fas fa-bicycle'},
	{label:"Mur radweg Slovenie",coords:murCroatia,color:'blue',trackIsDisplayedOnTheMap:true,type:"ITINERARY",rotatorIcon:'fas fa-bicycle'},
	*/
];


// =================================================================
// drawChart
// =================================================================
function drawChart(data) {
	let template = `
	<h1 id="trackInfoTitle"></h1>
	<div class="table">
		<div class="tr">
			<div class="td">
				<div class="info">Début de la trace</div>
			</div>
			<div class="td">
				<div class="info"><b><span id="startDate">12/12/2020 12:12:12</span></b></div>
			</div>
		</div>
		<div class="tr">
			<div class="td">
				<div class="info">Fin de la trace</div>
			</div>
			<div class="td">
				<div class="info"><b><span id="stopDate">12/12/2020 12:12:12</span></b></div>
			</div>
		</div>
	</div>
	<div class="table">
		<div class="tr">
			<div class="td">
				<div class="info">Distance totale</div>
				<div class="info"><b><span id="totalLength">54.2 km</span></b></div>
			</div>
			<div class="td">
				<div class="info">Dénivelé <i class="fas fa-angle-double-up"></i> / <i class="fas fa-angle-double-down"></i></div>
				<div class="info"><b>+<span id="upMeters">+ 120 m</span> m / <span id="downMeters">- 240 m</span> m</b></div>
			</div>
		</div>
	</div>
	<div id="chart"></div>`;
	document.getElementById("menuTarget_2").innerHTML = template;
	// We set the title
	document.getElementById("trackInfoTitle").innerHTML = tracks.currentItem().label;
	// We set the starting/stopping date
	document.getElementById("startDate").innerHTML = format_dateString(new Date(tracks.currentItem().timestamps[0]));
	document.getElementById("stopDate").innerHTML = format_dateString(new Date(tracks.currentItem().timestamps[tracks.currentItem().timestamps.length - 1]));
	// We set the total length
	document.getElementById("totalLength").innerHTML = tracks.currentItem().segmentsCumulatedLength[tracks.currentItem().segmentsCumulatedLength.length - 1].toFixed(1) + " km";
	// Ascend, descend calculation
	let positiveSum = 0;
	let negativeSum = 0;
	tracks.currentItem().dbAltitudes.forEach(function(current,index, dbAltitudes) {
		if (index != 0) {
			// Ascend
			if (current > dbAltitudes[index - 1]) {
				positiveSum += current - dbAltitudes[index - 1];
			}
			// Descend
			else if (current < dbAltitudes[index - 1]) {
				negativeSum += - (dbAltitudes[index - 1] - current);
			}
		}
	});
	document.getElementById("upMeters").innerHTML = positiveSum;
	document.getElementById("downMeters").innerHTML = negativeSum;

	let opts = {
		title: null,
		id: "profileChart",
		class: "profileChart",
		cursor:{
			x:false,
			y:false
		},
		width: 710,
		height: 200,
		legend : {
			show:false
		},
		series: [
			{
				
			},
			{
				// initial toggled state (optional)
				show: true,
				// in-legend display
				label: "Altitude",
				scale: "altitude",
				// series style
				stroke: "blue",
				width: 4,
			},
			{
				// initial toggled state (optional)
				show: true,
				// in-legend display
				label: "Altitude",
				scale: "altitude",
				// series style
				stroke: "red",
				//dash:[10,10],
				width: 2,
			},
			{
				// initial toggled state (optional)
				show: true,
				// in-legend display
				label: "Speed",
				scale: "speed",
				// series style
				stroke: "green",
				width: 2,
			},
		],
		scales: {
			"x": {
				time:false
			}
		},
		axes: [
			{
				values: (self, ticks) => ticks.map(rawValue => rawValue + "km"),
			},
			{
				scale: "altitude",
				values: (self, ticks) => ticks.map(rawValue => rawValue + "m"),
				auto: true,
				stroke: 'blue'
				// range: [0, 100],
			},
			{
				scale: "speed",
				side:	1,
				values: (self, ticks) => ticks.map(rawValue => rawValue + "km/h"),
				auto: true,
				stroke: 'green'
				// range: [0, 100],
			}
		],
	};
	let uplot = new uPlot(opts, data, document.getElementById("chart"));
}

// -----------------------------------------------------------------
// Track CLASS
// -----------------------------------------------------------------
const Track = function(initial) {
	// Properties --------------------------------------------------
	this.type = 						initial.type ||	"RECORD"; // ITINERARY or RECORD
	this.coords = 						initial.coords ||	[];
	this.altitudes = 					initial.altitudes || [];
	this.timestamps = 					initial.timestamps || [];
	
	this.rawPositions = 				initial.rawPositions ||	[];
	
	this.segmentsLength = 				initial.segmentsLength || [];
	this.segmentsBearing = 				initial.segmentsBearing || [];
	this.segmentsCumulatedLength = 		initial.segmentsCumulatedLength || [];
	this.segmentsDuration = 			initial.segmentsDuration || [];
	this.segmentsSpeed = 				initial.segmentsSpeed || [];
	this.dbAltitudes = 					initial.dbAltitudes || [];
	
	this.label = 						initial.label || 	null;
	this.color = 						initial.color || '#FF0000';
	this.trackIsDisplayedOnTheMap = 	initial.trackIsDisplayedOnTheMap || true;
	// Should be private -------------------------------------------
	this.myMapTrack = 					null;		// Leaflet current position marker handler
	// For Rotator usage only --------------------------------------
	this.rotatorType = 					initial.rotatorType || "BOOLEAN";
	
	if (this.type === "RECORD")			this.rotatorIcon = initial.rotatorIcon || 'fas fa-feather';
	else if (this.type === "ITINERARY")	this.rotatorIcon = initial.rotatorIcon || 'fas fa-project-diagram';
		else							this.rotatorIcon = initial.rotatorIcon || 'fas fa-arrows-alt';
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
		let infos = this.coords.length + " point" + (this.coords.length > 1 ? "s " : " ");
		if (this.rawPositions && this.rawPositions.length > 0) infos += "(" + this.rawPositions.length + " points bruts)";
		return infos;
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
		// WE build the name from the label, replacing unallowed caracters
		let fileName = this.label.trim().replace(/[^A-Za-z0-9]/g, '_') + '.trk';
		let sdcard = navigator.getDeviceStorage("sdcard");
		let file   = new Blob(
			[
				JSON.stringify(
					this,
					[
						"type",
						"coords",
						"altitudes",
						"timestamps",
						"rawPositions",
						"label",
						"color",
						"segmentsLength",
						"segmentsBearing",
						"segmentsCumulatedLength",
						"segmentsDuration",
						"segmentsSpeed",
						"dbAltitudes",
						"rotatorIcon",
						// For raw data 
						"altitude",
						"accuracy",
						"altitudeAccuracy",
						"heading",
						"speed",
						"timestamp"
					]
				)
			], 
			{type: "text/plain"}
		);
		let request = sdcard.addNamed(file, "carto/" + fileName);

		request.onsuccess = function () {
		  const name = this.result;
		  toastr.info('Fichier "' + name + '" ajouté sur la carte SD.');
		}

		// An error typically occur if a file with the same name already exist
		request.onerror = function () {
			if (this.error && this.error.name === "NoModificationAllowedError")	  toastr.warning('Ecriture sur la carte SD impossible : ce fichier existe déjà.');
			else {
				toastr.warning('Ecriture sur la carte SD impossible.');
				console.warn(this);
			}
		}
	}
	else console.log("Ecriture non supportée sur cet appareil.");					
};

// calculateSegmentsCumulatedLength -------------------------------------
Track.prototype.calculateSegmentsCumulatedLength = function() {
	if (this.segmentsLength.length === 0) {
		let that = this;
		this.coords.forEach(function(coord,index){
			if (index === 0) {
				that.segmentsLength.push(0);
				that.segmentsCumulatedLength.push(0);
			}
			else {
				that.segmentsLength.push(gps.distance(that.coords[index], that.coords[index - 1]) / 1000); // In km
				that.segmentsCumulatedLength.push(that.segmentsCumulatedLength[index - 1] + that.segmentsLength[index]); // In km
			}
		});
	}
};

// getProfile ------------------------------------------------------
Track.prototype.getDbAltitudes = function() {
	// If not yet available, calculate the segmentsCumulatedLength
	this.calculateSegmentsCumulatedLength();
	let that = this;
	// If the dbAltitudes has not been found yet -------------------
	if (this.dbAltitudes.length != this.coords.length) {
		// We reverse lat/long for adaptation to API
		let reverseCoords = this.coords.map(function(coord){return [coord[1],coord[0]]});
		// We split the array in array of 2000 points max (to suit the API limitations)
		let splittedArray = [];
		while(reverseCoords.length) {
			splittedArray.push(reverseCoords.splice(0,2000));
		}
		let checksum = 0;
		let checkTotal = 0;
		let dbAltitudes = new Array(this.coords.length);
		// We get the dbAltitudes for each array -------------------
		splittedArray.forEach(function(coords,index) {
			let httpRequest = new XMLHttpRequest();
			httpRequest.open('POST', 'https://api.openrouteservice.org/elevation/line');
			httpRequest.setRequestHeader('Accept', 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8');
			httpRequest.setRequestHeader('Content-Type', 'application/json');
			httpRequest.setRequestHeader('Authorization', keys.openRouteService);

			httpRequest.onreadystatechange = function () {
				if (httpRequest.readyState === XMLHttpRequest.DONE) {
					if (httpRequest.status === 200) {
						const data = JSON.parse(httpRequest.responseText);
						let altitudesResult = data.geometry.coordinates.map(function(point) {return point[2]});
						// We add the result
						dbAltitudes.splice(2000 * index, altitudesResult.length, ...altitudesResult);
						checksum += index + 1;
						checkTotal += altitudesResult.length;
						// UNIQUEMENT pour le dernier et si DONNEES COMPLETES !!
						if (	(checksum === splittedArray.length * (splittedArray.length + 1) / 2) && 
								(checkTotal === that.coords.length)) {
							that.dbAltitudes = dbAltitudes;
							// We draw the map
							let resultData = [];
							// We build the cumulated length for the x axe
							resultData.push(that.segmentsCumulatedLength);
							resultData.push(that.dbAltitudes);
							resultData.push(that.altitudes);
							resultData.push(that.segmentsSpeed);
							console.log("resultData ------------------------");
							console.log(resultData);
							drawChart(resultData);
						}						
					} else {
						console.log('Il y a eu un problème avec la requête : ' + httpRequest.status);
						console.log(httpRequest.responseText);
					}
				}
			};
			const body = JSON.stringify({
				"format_in":	"polyline",
				"dataset":		"srtm",			// Elevation dataset to use
				"geometry":		coords
			});
			httpRequest.send(body);
			
		});
	}
	else {
		// We draw the map
		let resultData = [];
		// We build the cumulated length for the x axe
		resultData.push(that.segmentsCumulatedLength);
		resultData.push(that.dbAltitudes);
		resultData.push(that.altitudes);
		resultData.push(that.segmentsSpeed);
		console.log("resultData ------------------------");
		console.log(resultData);
		drawChart(resultData);
	}
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
// tracks_initialList.push(new Track(casa));
tracks_initialList.push(new Track(mur_1));
tracks_initialList.push(new Track(mur_2));
tracks_initialList.push(new Track(mur_3));
tracks_initialList.push(new Track(mur_4));
tracks_initialList.push(new Track(mur_5));
tracks_initialList.push(new Track(mur_6));
tracks_initialList.push(new Track(mur_7));
tracks_initialList.push(new Track(mur_8));

tracks_initialList.push(new Track(drau_1));
tracks_initialList.push(new Track(drau_2));
tracks_initialList.push(new Track(drau_3));
tracks_initialList.push(new Track(drau_4));
tracks_initialList.push(new Track(drau_5));
tracks_initialList.push(new Track(drau_6));
tracks_initialList.push(new Track(drau_7));

// -----------------------------------------------------------------
// tracks ROTATOR
// -----------------------------------------------------------------
const tracks = new Rotator(tracks_initialList,tracksOptions);

tracks.refreshMap = function() {
	this.list.forEach(function(track) {
		track.refreshMap();
	});
}

tracks.addAndDisplay = function(track) {
	this.list.unshift(track);
	this.currentIndex = 0;
	this.generateHtml();
	this.refreshMap();
}

// -----------------------------------------------------------------
// tracks_actions ROTATOR
// -----------------------------------------------------------------
let tracks_actions_list = [
	{	
		label:"Infos",
		rotatorType:"MENU",
		value:"infos"
	},
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
		label:"Enregistrer sur la carte SD",
		rotatorType:"MENU",
		value:"writeToSD"
	},
	{	
		label:"Changer la couleur",
		rotatorType:"MENU",
		value:"changeColor"
	},
	{	
		label:"Changer l'icône",
		rotatorType:"MENU",
		value:"changeIcon"
	},
	{	
		label:"Positionner la carte au début de cette trace",
		rotatorType:"MENU",
		value:"positionMapAtStart"
	},
	{	
		label:"Positionner la carte à la fin de cette trace",
		rotatorType:"MENU",
		value:"positionMapAtEnd"
	}
];

const tracks_actions_options = {
	"selectedItemIdPrefix" : 		"tracks_actions",
	"targetDomSelector" : 			"#menuTarget_2"
}



const tracks_actions = new Rotator(tracks_actions_list,tracks_actions_options);

// -----------------------------------------------------------------
// colors TABLE ROTATOR
// -----------------------------------------------------------------

let tracks_colorsList = [
	// Rouges
	{value:'#FF0000'},
	// Oranges
	{value:'#FF6C00'},
	// Jaunes
	{value:'#FFFF00'},
	// Verts
	{value:'#808000'},
	{value:'#008000'},
	{value:'#00FF00'},
	// Bleus
	{value:'#000080'},
	{value:'#0000FF'},
	{value:'#00FFFF'},
	// Divers
	{value:'#800000'},
	{value:'#6600cc'},
	{value:'#008080'},
	// Violets
	{value:'#800080'},
	{value:'#FF00FF'},
	{value:'#ff99cc'},
	// Noir -> Blanc
	{value:'#000000'},
	{value:'#A0A0A0'},
	{value:'#FFFFFF'}
];

let tracks_colorsOptions = {
	"selectedItemIdPrefix" : 		"colors",
	"targetDomSelector" : 			"#menuTarget_2",
	"initialSelectionIndex" : function() {
		let initialSelectionIndex = 0;
		tracks_colorsList.forEach((option,index) => {
			if (option.value === tracks.currentItem().color) initialSelectionIndex = index;
		});
		return initialSelectionIndex;
	},
	"cellHtmlContent": function(element,index,selectedItemIdPrefix) {
		return '<div id="' 
			+ selectedItemIdPrefix + index 
			+ '" class="tableRotator" style="background-color:' 
			+ element.value 
			+ ';"></div>';
	}
};

let tracks_colorsRotator = new TableRotator(tracks_colorsList,tracks_colorsOptions);

// -----------------------------------------------------------------
// icons TABLE ROTATOR
// -----------------------------------------------------------------

let tracks_iconsList = [
	{value:'fas fa-feather'},
	{value:'fas fa-project-diagram'},
	{value:'fas fa-arrows-alt'},
	{value:'fas fa-bicycle'},
	{value:'fas fa-car'},
];

let tracks_iconsOptions = {
	"selectedItemIdPrefix" : 		"icons",
	"targetDomSelector" : 			"#menuTarget_2",
	"initialSelectionIndex" : function() {
		let initialSelectionIndex = 0;
		tracks_iconsList.forEach((option,index) => {
			if (option.value === tracks.currentItem().rotatorIcon) initialSelectionIndex = index;
		});
		return initialSelectionIndex;
	},
	"cellHtmlContent": function(element,index,selectedItemIdPrefix) {
		return '<div id="' 
			+ selectedItemIdPrefix + index 
			+ '" class="tableRotator iconsRotator"><i class="iconsRotator ' + element.value + '"></i></div>';
	}
};

let tracks_iconsRotator = new TableRotator(tracks_iconsList,tracks_iconsOptions);
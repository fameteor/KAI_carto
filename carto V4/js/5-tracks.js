// =================================================================
// TRACKS
// =================================================================

let tracks_initialList = [];
/*
	{label:"Drau radweg SHORT Autriche",coords:drauRadwegShort,color:'lightblue',trackIsDisplayedOnTheMap:true},
	{label:"Drau radweg Autriche",coords:drauRadweg,color:'red',trackIsDisplayedOnTheMap:true},
	{label:"Drav radweg Slovénie",coords:drauSlovenia,color:'orange',trackIsDisplayedOnTheMap:true},
	{label:"Mur radweg Slovénie",coords:murCroatia,color:'blue',trackIsDisplayedOnTheMap:true},
	{label:"Mur radweg Autriche",coords:mur,color:'green',trackIsDisplayedOnTheMap:true}
];
*/

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
		width: 230,
		height: 158,
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
				width: 2,
			},
			{
				// initial toggled state (optional)
				show: true,
				// in-legend display
				label: "Altitude",
				scale: "altitude",
				// series style
				stroke: "red",
				dash:[10,10],
				width: 1,
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
	this.coords = 						initial.coords ||	[];
	this.altitudes = 					initial.altitudes || [];
	this.timestamps = 					initial.timestamps || [];
	
	this.segmentsLength = 				initial.segmentsLength || [];
	this.segmentsCumulatedLength = 		initial.segmentsCumulatedLength || [];
	this.segmentsDuration = 			initial.segmentsDuration || [];
	this.segmentsSpeed = 				initial.segmentsSpeed || [];
	this.dbAltitudes = 					initial.dbAltitudes || [];
	
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
		// WE build the name from the label, replacing unallowed caracters
		let fileName = this.label.trim().replace(/[^A-Za-z0-9]/g, '_') + '.trk';
		let sdcard = navigator.getDeviceStorage("sdcard");
		let file   = new Blob(
			[
				JSON.stringify(
					this,
					[
						"coords",
						"altitudes",
						"timestamps",
						"label",
						"color",
						"segmentsLength",
						"segmentsCumulatedLength",
						"segmentsDuration",
						"segmentsSpeed",
						"dbAltitudes"
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

// analyseSegments ------------------------------------------------------
Track.prototype.analyseSegments = function() {
	if (this.segmentsLength.length === 0) {
		let that = this;
		this.coords.forEach(function(coord,index){
			if (index === 0) {
				that.segmentsLength.push(0);
				that.segmentsCumulatedLength.push(0);
				that.segmentsDuration.push(null);
				that.segmentsSpeed.push(null);
			}
			else {
				that.segmentsLength.push(gps.distance(that.coords[index], that.coords[index - 1]) / 1000); // In km
				that.segmentsCumulatedLength.push(that.segmentsCumulatedLength[index - 1] + that.segmentsLength[index]); // In km
				that.segmentsDuration.push((that.timestamps[index] - that.timestamps[index - 1]) / 1000); // In s
				that.segmentsSpeed.push((that.segmentsLength[index] / that.segmentsDuration[index]) * 3600);
			}
		});
	}
};

// getProfile ------------------------------------------------------
Track.prototype.getDbAltitudes = function() {
	this.analyseSegments();
	let that = this;

	if (this.dbAltitudes.length === 0) {
		let reverseCoords = this.coords.map(function(coord){return [coord[1],coord[0]]});
		let httpRequest = new XMLHttpRequest();
		httpRequest.open('POST', 'https://api.openrouteservice.org/elevation/line');
		httpRequest.setRequestHeader('Accept', 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8');
		httpRequest.setRequestHeader('Content-Type', 'application/json');
		httpRequest.setRequestHeader('Authorization', keys.openRouteService);

		httpRequest.onreadystatechange = function () {
			if (httpRequest.readyState === XMLHttpRequest.DONE) {
				if (httpRequest.status === 200) {
					const data = JSON.parse(httpRequest.responseText);
					console.log("httpRequest.response --------------");
					console.log(data);
					that.dbAltitudes = data.geometry.coordinates.map(function(point) {return point[2]});
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
				} else {
					console.log('Il y a eu un problème avec la requête : ' + httpRequest.status);
					console.log(httpRequest.responseText);
				}
			}
		};
		const body = JSON.stringify({
			"format_in":	"polyline",
			"dataset":		"srtm",			// Elevation dataset to use
			"geometry":		reverseCoords
		});
		httpRequest.send(body);
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
tracks_initialList.push(new Track(casa));

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
	}
];

const tracks_actions_options = {
	"selectedItemIdPrefix" : 		"tracks_actions",
	"targetDomSelector" : 			"#menuTarget_2"
}



const tracks_actions = new Rotator(tracks_actions_list,tracks_actions_options);
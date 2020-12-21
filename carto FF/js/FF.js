let FF = {
	"displayCurrentTrackRaw": function() {
		let coords = tracks.currentItem().rawPositions.map(function(position) {
			return position.coords;
		});
		tracks.list.unshift(new Track({label:"Raw current track",coords:coords,color:'#0000FF',rotatorIcon:'fas fa-project-diagram'}));
		tracks.currentIndex += 1;
		tracks.refreshMap();
	},
	"analyseCurrentTrackRaw": function() {
		let currentIndex = 0;
		let marker = null;
		// We display the HTML template
		let html = `
			<button id="minus">-</button><span id="currentRawPosition"></span> / `+ tracks.currentItem().rawPositions.length  + `<button  id="plus">+</button>
			<table>
				<tr>
					<td>timestamp</td>
					<td id="timestamp"></td>
				</tr>
				<tr>
					<td>coords</td>
					<td id="coords"></td>
				</tr>
				<tr>
					<td>altitude</td>
					<td id="rawAltitude"></td>
				</tr>
				<tr>
					<td>accuracy</td>
					<td id="accuracy"></td>
				</tr>
				<tr>
					<td>altitudeAccuracy</td>
					<td id="altitudeAccuracy"></td>
				</tr>
				<tr>
					<td>heading</td>
					<td id="heading"></td>
				</tr>
				<tr>
					<td>speed</td>
					<td id="speed"></td>
				</tr>
			</table>
		`;
		document.getElementById("analyser").innerHTML = html;
		// We display the current point infos
		let displayCurrentIndexInfos = function() {
			let data = tracks.currentItem().rawPositions[currentIndex];
			document.getElementById("currentRawPosition").innerHTML = currentIndex;
			document.getElementById("timestamp").innerHTML = data.timestamp;
			document.getElementById("coords").innerHTML = data.coords;
			document.getElementById("rawAltitude").innerHTML = data.altitude + " m";
			document.getElementById("accuracy").innerHTML = data.accuracy;
			document.getElementById("altitudeAccuracy").innerHTML = data.altitudeAccuracy;
			document.getElementById("heading").innerHTML = data.heading + " °";
			document.getElementById("speed").innerHTML = (data.speed * 3.6 ) + " km/h";
			// Display marker
			// Remove marker
			if (marker) app.myMap.removeLayer(marker);
			// Add currentPosition marker
			marker = L.marker(
				data.coords,
				{icon:waypoints_icons["blueIcon"]}
			).addTo(app.myMap);
		};
		displayCurrentIndexInfos();
		// We manage the buttons
		document.getElementById("minus").addEventListener("click",function(event) {
			currentIndex -= 1;
			displayCurrentIndexInfos();
		});
		document.getElementById("plus").addEventListener("click",function(event) {
			currentIndex += 1;
			displayCurrentIndexInfos();
		});
	},
	
	"filterAccuracyLess50": function(position,newTrackCoords) {
		if (position.accuracy < 50) {
			counter += 1;
			latAccu += position.coords[0];
			longAccu += position.coords[1];
			tsAccu	+= position.timestamp;
			if (counter === 10) {
				counter = 0;
				newTrackCoords.push([latAccu/10,longAccu/10]);
				latAccu = 0;
				longAccu = 0;
				tsAccu	= 0;
			}
		}
	}
	
}


// -----------------------------------------------------------------
// search OBJECT
// -----------------------------------------------------------------

search = {
	// -------------------------------------------------------------
	// Last value of the input field
	"value" : "",
	
	// -------------------------------------------------------------
	"resultRotator" : {},
	
	// -------------------------------------------------------------
	"formOptions_list": [
		{	
			label:"Voir la liste des dernières requêtes",
			rotatorType:"MENU",
			value:"seeLastRequests"
		},
		{	
			label:"Voir les résultats de recherche déjà utilisés",
			rotatorType:"MENU",
			value:"usedSearchResults"
		},
		{	
			label:"Effacer les informations de recherche",
			rotatorType:"MENU",
			value:"deleteRequestsLogs"
		}
	],
	
	// -------------------------------------------------------------
	"resultActions_list": [
		{	
			label:"Positionner la carte à cet endroit",
			rotatorType:"MENU",
			value:"positionMap"
		},
		{	
			label:"Enregistrer comme point",
			rotatorType:"MENU",
			value:"saveAsWaypoint"
		},
		{	
			label:"Itinéraire à partir de ce point",
			rotatorType:"MENU",
			value:"itineraryFromThisPoint"
		},
		{	
			label:"Itinéraire vers ce point",
			rotatorType:"MENU",
			value:"itineraryToThisPoint"
		}
	],

	// -------------------------------------------------------------
	"displayInput": function() {
		let html = '<input type="text" id="searchInput" value="' + this.value + '"></input>';
		$("#menuTarget_7").html(html);
		// We change to SEARCH_form state
		state.search_state = "form";
		displaySoftKeysLabels();
	},
	"focusOnInput": function() {
		// To set focus on the input and select the input value
		let input = $('#searchInput');
		var strLength = input.val().length;
		input[0].setSelectionRange(0, strLength);
		input.focus();
	},
	"generateAndDisplayResultRotator": function(text) {
		let that = this;
		let request = new XMLHttpRequest();
		request.open('GET', 'https://api.openrouteservice.org/geocode/search?api_key=' + keys.openRouteService + '&text=' + text);
		request.setRequestHeader('Accept', 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8');

		request.onreadystatechange = function () {
			if (request.readyState === XMLHttpRequest.DONE) {
				if (request.status === 200) {
					const data = JSON.parse(request.responseText);
					console.log(data);
					let resultRotatorList = [];
					if (data.features && data.features.length > 0) {
						// We extract the relevant data ------------
						resultRotatorList = data.features.map(function(feature) {
							return {
								label : 	feature.properties && (feature.properties.name + " - " + feature.properties.region + " (" + feature.properties.country +")"),
								name:		feature.properties && feature.properties.name,
								region:		feature.properties && feature.properties.region,
								country:	feature.properties && feature.properties.country,
								coords: [
									feature.geometry && 
									feature.geometry.coordinates &&
									feature.geometry.coordinates[1],
									feature.geometry && 
									feature.geometry.coordinates &&
									feature.geometry.coordinates[0],
								],
								type: 		"MENU"
							}
						});
						console.log(resultRotatorList);
						// resultRotator --------------
						const resultRotatorOptions = {
							"selectedItemIdPrefix" : 		"resultRotator",
							"targetDomSelector" : 			"#menuTarget_7",
							"itemsNumbered":				"reverse"
						}

						that.resultRotator = new Rotator(resultRotatorList,resultRotatorOptions);
						that.resultRotator.generateHtml();
						state.search_state = "result";
						displaySoftKeysLabels();
					}
					else {
						toastr.info("Aucun résultat trouvé.");
						// We go back to the form state
						search.displayInput();
						search.focusOnInput();
					}
				} else {
					console.log('Requête impossible.');
				}
			}
		};
		
		request.send();
	},
	"displayItinerary": function(coords1,coords2,label) {
		let that = this;
		let request = new XMLHttpRequest();
		request.open('GET', 'https://api.openrouteservice.org/v2/directions/' + app.options.itineraryProfile + '?api_key=' + keys.openRouteService + '&start=' + coords1[1] + ',' + coords1[0] + '&end=' + coords2[1] + ',' + coords2[0]);
		request.setRequestHeader('Accept', 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8');

		request.onreadystatechange = function () {
			if (request.readyState === XMLHttpRequest.DONE) {
				if (request.status === 200) {
					const data = JSON.parse(request.responseText);
					console.log(data);
					let coordsList = data.features[0].geometry.coordinates;
					// data.features[0].properties.summary.distance and .duration
					coordsList.forEach(function(coord) {coord.reverse();});
					console.log(coordsList);
					let itinerary = new Track({
						coords:coordsList,
						label: label,
						color:'green'
					});
					// We add the itinerary to the tracks and display it
					tracks.addAndDisplay(itinerary);
					
				} else {
					console.log('Requête impossible.');
				}
			}
		};
		
		request.send();
	}
	
	
}

// -----------------------------------------------------------------
search.resultActionsRotator = new Rotator(
	search.resultActions_list,
	{
		"selectedItemIdPrefix" : 		"search_resultActions",
		"targetDomSelector" : 			"#menuTarget_7"
	}
);

// -----------------------------------------------------------------
search.formOptionsRotator = new Rotator(
	search.formOptions_list,
	{
		"selectedItemIdPrefix" : 		"search_formOptions",
		"targetDomSelector" : 			"#menuTarget_7"
	}
);
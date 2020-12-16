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
		console.log("search for : " + text);
		let request = new XMLHttpRequest();
		request.open('GET', 'https://api.openrouteservice.org/geocode/autocomplete?api_key=' + keys.openRouteService + '&text=' + text);
		request.setRequestHeader('Accept', 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8');

		request.onreadystatechange = function () {
			if (request.readyState === XMLHttpRequest.DONE) {
				if (request.status === 200) {
					const data = JSON.parse(request.responseText);
					console.log(data);
					let resultRotatorList = [];
					if (data.features) {
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
				} else {
					console.log('Il y a eu un problème avec la requête : ' + request.status);
					console.log(request.responseText);
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
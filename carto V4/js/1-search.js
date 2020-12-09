// Global variable -------------------------------------------------
let searchAutocomplete = {};

search = {
	"autocomplete": function(text) {
		console.log("search for : " + text);
		let request = new XMLHttpRequest();
		request.open('GET', 'https://api.openrouteservice.org/geocode/autocomplete?api_key=' + keys.openRouteService + '&text=' + text);
		request.setRequestHeader('Accept', 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8');

		request.onreadystatechange = function () {
			if (request.readyState === XMLHttpRequest.DONE) {
				if (request.status === 200) {
					const data = JSON.parse(request.responseText);
					console.log(data);
					let searchAutocompleteList = [];
					if (data.features) {
						// We extract the relevant data ------------
						searchAutocompleteList = data.features.map(function(feature) {
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
						console.log(searchAutocompleteList);
						// searchAutocomplete ROTATOR --------------
						const searchAutocompleteOptions = {
							"selectedItemIdPrefix" : 		"autocomplete",
							"targetDomSelector" : 			"#searchResult",
							"itemsNumbered":				"reverse"
						}

						searchAutocomplete = new Rotator(searchAutocompleteList,searchAutocompleteOptions);
						searchAutocomplete.generateHtml();
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
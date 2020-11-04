/* A faire
	
- ajouter dans la liste des lieux "ICI : lat, lng" en appelant le GPS
- ajouter un affichage des tabs existants, de type  ooo0oo
- optimiser les CSS
- optimiser le code
- faire différents mode d'affichage : 
	icones sympas, 
	texte, 
	courbes sur la période (température, pression, humidité, vent)
	comparaison des lieux (température, pluie)
- Afficher "aujourd'hui" et "demain" au lieu de la date
- faire l'icone
- gérer les erreurs réseau et autre

*/

// Parameters ------------------------------------------------------
const places = [
	{"label":"au Perrier",	"location":"46.8192286,-1.995014"},
	{"label":"à Nantes",	"location":"47.2383171,-1.6302673"},
	{"label":"à Dournazac",	"location":"45.6330841,0.8911268"},
	{"label":"à Orléans",	"location":"47.8735097,1.8419973"},
	{"label":"à Paris",		"location":"48.8589101,2.3119547"}
];

// Code ------------------------------------------------------------
const monthsLabels = [
	"unused",
	"janvier",
	"février",
	"mars",
	"avril",
	"mai",
	"juin",
	"juillet",
	"août",
	"septembre",
	"octobre",
	"novembre",
	"décembre"
]
const daysLabels = [
	"Dimanche",
	"Lundi",
	"Mardi",
	"Mercredi",
	"Jeudi",
	"Vendredi",
	"Samedi"
]

// Global Variables ------------------------------------------------
let datesStructure = [{"day":null,"month":null,"year":null,"timesStructure":[{"hour":null,"forecast":null}]}];
let placeIndex = 0;
let timeIndex = 0;
let meteoData = null;

// Functions -------------------------------------------------------
let init = function() {
	displayPlace();
	displayDateLabel();
	getMeteoData(places[placeIndex].location);
}

let displayPlace = function() {
	document.getElementById("placeLabel").innerHTML = places[placeIndex].label;
}

let displayDateLabel = function() {
	if (datesStructure[timeIndex]) {
		const date = new Date(datesStructure[timeIndex].year,datesStructure[timeIndex].month - 1,datesStructure[timeIndex].day);
		const dateLabel = 	datesStructure[timeIndex].day 
							+ " " 
							+ monthsLabels[datesStructure[timeIndex].month]
							+ " " 
							+ datesStructure[timeIndex].year
		document.getElementById("dateLabel").innerHTML = daysLabels[date.getDay()] + " " + dateLabel;
	}
}

let displayForecast = function() {
	const timesStructure = datesStructure[timeIndex] && datesStructure[timeIndex].timesStructure;
	if (timesStructure) {
		let innerHtml = '';
		timesStructure.forEach(function(timeStructure) {
			// If data is not empty
			if (timeStructure.forecast.pression["niveau_de_la_mer"] != 0) {
				let innerHtmlFragment = `<div class="row">
					<div class="cell">{{hour}}h</div>
					<div class="cell"><img src="icons/{{cloudIcon}}" style="height:70%;width:70%;"/></div>
					<div class="cellData t{{temperatureClass}}">{{temperature}}</div>
					<div class="cell">{{humidity}}</div>
					<div class="cell">{{rain}}</div>
					<div class="cell">{{pressure}}</div>
					<div class="cell"><span class="{{windClass}}">{{wind}}</span>/<small><span class="{{windMaxClass}}">{{windMax}}</span></small></div>
				  </div>`
				innerHtmlFragment = innerHtmlFragment.replace('{{hour}}',timeStructure.hour);
				// We format the forecast data
				const temperature = Math.round((timeStructure.forecast.temperature["2m"]) - 273.16);
				const humidity = Math.round(timeStructure.forecast.humidite["2m"]);
				const rain = timeStructure.forecast.pluie;
				const pressure = Math.round(timeStructure.forecast.pression["niveau_de_la_mer"]/100);
				const wind = Math.round(timeStructure.forecast.vent_moyen["10m"]);
				const windMax = Math.round(timeStructure.forecast.vent_rafales["10m"]);
				
				let cloudIcon ='';
				if (timeStructure.forecast.nebulosite.totale < 25) {
					if (timeStructure.forecast.pluie === 0)					cloudIcon = 'sun.png';
						else if (timeStructure.forecast.pluie < 3)			cloudIcon = 'sunPartialSmallRain.png';
							else if (timeStructure.forecast.pluie < 6)		cloudIcon = 'sunPartialMiddleRain.png';
								else										cloudIcon = 'sunPartialBigRain.png';
				}
				
				else if (timeStructure.forecast.nebulosite.totale < 76)	{
						if (timeStructure.forecast.pluie === 0)				cloudIcon = 'sunPartial.png';
						else if (timeStructure.forecast.pluie < 3)			cloudIcon = 'sunPartialSmallRain.png';
							else if (timeStructure.forecast.pluie < 6)		cloudIcon = 'sunPartialMiddleRain.png';
								else										cloudIcon = 'sunPartialBigRain.png';
					}
					else if (timeStructure.forecast.pluie === 0)			cloudIcon = 'cloud.png';
						else if (timeStructure.forecast.pluie < 3)			cloudIcon = 'smallRain.png';
							else if (timeStructure.forecast.pluie < 6)		cloudIcon = 'middleRain.png';
								else										cloudIcon = 'bigRain.png';
				
				let windClass ='';
				let windMaxClass ='';
				if(wind < 50) 		windClass = 'wGreen';
				else if (wind < 90)	windClass = 'wOrange';
					else			windClass = 'wRed';
				if(windMax < 50) 		windMaxClass = 'wGreen';
				else if (windMax < 90)	windMaxClass = 'wOrange';
					else				windMaxClass = 'wRed';
				
				innerHtmlFragment = innerHtmlFragment.replace('{{cloudIcon}}',cloudIcon);		
				innerHtmlFragment = innerHtmlFragment.replace('{{temperature}}',temperature);
				innerHtmlFragment = innerHtmlFragment.replace('{{temperatureClass}}',temperature);
				innerHtmlFragment = innerHtmlFragment.replace('{{humidity}}',humidity);
				innerHtmlFragment = innerHtmlFragment.replace('{{rain}}',rain);
				innerHtmlFragment = innerHtmlFragment.replace('{{pressure}}',pressure);
				innerHtmlFragment = innerHtmlFragment.replace('{{wind}}',wind);
				innerHtmlFragment = innerHtmlFragment.replace('{{windClass}}',windClass);
				innerHtmlFragment = innerHtmlFragment.replace('{{windMax}}',windMax);
				innerHtmlFragment = innerHtmlFragment.replace('{{windMaxClass}}',windMaxClass);
				innerHtml += innerHtmlFragment;
			}
		});
		let resultTable = document.getElementById("resultTable");
		resultTable.innerHTML  = innerHtml;
		
		  
		/*
		document.getElementById("temperature").innerHTML = Math.round(((forecast.temperature && forecast.temperature["2m"]) - 273.16) * 10)/10 + " °C";
		document.getElementById("pressure").innerHTML = Math.round((forecast.pression && forecast.pression["niveau_de_la_mer"])/100) + " Hpa";
		document.getElementById("humidity").innerHTML = forecast.humidite && forecast.humidite["2m"] + " %";
		document.getElementById("rain").innerHTML = forecast.pluie + " mm/3h";
		document.getElementById("meanWind").innerHTML = forecast.vent_moyen && forecast.vent_moyen["10m"] + " km/h";
		document.getElementById("peakWind").innerHTML = forecast.vent_rafales && forecast.vent_rafales["10m"] + " km/h";
		document.getElementById("windDirection").innerHTML = ((forecast.vent_direction && forecast.vent_direction["10m"]) % 360) + "°";
		document.getElementById("snow").innerHTML = forecast.risque_neige;
		*/
	}
}

document.addEventListener("keydown", event => {
	switch(event.key) {
		case "SoftLeft":
		// For emulation on Firefox PC 
		case "PageDown":
			event.preventDefault();
			if (placeIndex != 0) 	placeIndex -= 1;
			else 					placeIndex = places.length -1;
			displayPlace();
			getMeteoData(places[placeIndex].location);
			break;
		case "SoftRight":
		// For emulation on Firefox PC 
		case "PageUp":
			event.preventDefault();
			if (placeIndex != (places.length -1)) 	placeIndex += 1;
			else									placeIndex = 0;
			displayPlace();
			getMeteoData(places[placeIndex].location);
			break;
		case "ArrowLeft":
			event.preventDefault();
			if(timeIndex != 0) {
				timeIndex -= 1;
				displayDateLabel();
				displayForecast();
			}
			break;
		case "ArrowRight":
			event.preventDefault();
			if(timeIndex != (datesStructure.length -1)) {
				timeIndex += 1;
				displayDateLabel();
				displayForecast();
			}
			break;
		// To scroll down
		case "ArrowDown":
			event.preventDefault();
			window.scrollTo(0,document.body.scrollHeight);
			break;
		// To scroll up
		case "ArrowUp":
			event.preventDefault();
			window.scrollTo(0,0);
			break;
			
	}
});

let getMeteoData = function(location) {
	const authenticationKey = "BR8AFwV7UHIALQA3UyUCK1U9AjddKwUiUy8LaAhjB3oBZgRnB2ZVNl42Ui9UewU1Ai8Hbwg3AjMAagRmDnxeIgVkAG0Fb1A1AG4AZVNjAilVeQJ/XWMFIlMvC20IYwdlAXwEYQdkVTFeL1IwVHoFNAIuB3gINgI/AGIEYA5jXjUFYgBhBWJQMwBwAH1TZgJnVWQCNF02BTtTNws4CG0HNwEzBGgHZVU+Xi9SMFRgBTICMAdvCDQCOwBlBHwOfF5EBRUAeQUmUHAAOgAkU34CY1U4AjY=";
	const code = "d356050ba7e6a29484df0fa77a4be574";
	const url = "https://www.infoclimat.fr/public-api/gfs/json?_ll=" 
				+ encodeURIComponent(location) 
				+ "&_auth=" + encodeURIComponent(authenticationKey) 
				+ "&_c=" + encodeURIComponent(code);
	// HTTP request creation
	let httpRequest = new XMLHttpRequest();
	httpRequest.onreadystatechange = function() {
		if (httpRequest.readyState === XMLHttpRequest.DONE) {
			if (httpRequest.status === 200) {
				const response = JSON.parse(httpRequest.responseText);
				// We filter the properties corresponding at the forecast datesStructure
				datesStructure  = [];
				Object.keys(response).forEach(function(key) {
					if (/^\d\d\d\d-\d\d-\d\d \d\d\:\d\d\:\d\d/.test(key)) {
						// We change the key label
						const year = key.substr(0,4);
						const month = key.substr(5,2);
						const day = key.substr(8,2);
						const hour = key.substr(11,2);
						let timesStructure = {"hour":hour,"forecast":response[key]};
						// We check if that date already exists in the datesStructure
						let thisDateExists = false;
						let thisDateIndex = null;
						datesStructure.forEach(function(date, index) {
							if (	date.day === day 
									&& date.month === month 
									&& date.year === year) {
								thisDateExists = true;
								thisDateIndex = index;
							}
						});
						if (thisDateExists) {
							datesStructure[thisDateIndex].timesStructure.push(timesStructure);
						}
						else {
							// We add the date and push the forecast for that time
							let date = {"day":day,"month":month,"year":year,"timesStructure":[]};
							date.timesStructure.push(timesStructure);
							datesStructure.push(date);
						}
					}
				});
				displayDateLabel();
				displayForecast();
			} else {
				console.log('Il y a eu un problème avec la requête : ' + httpRequest.status);
				console.log(httpRequest.responseText);
			}
		}
	};
	httpRequest.open('GET', url, true);
	httpRequest.setRequestHeader('Accept', 'application/json');
	httpRequest.send();

}
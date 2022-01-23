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
	{"label":"ici",	"location":"46.5891712,15.0046327"},
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

let isPageOneDisplayed = true;

// -----------------------------------------------------------------
// Toastr
// -----------------------------------------------------------------
const toastr = {
	info : function (text) {
		$("#toastrMsg").html('<center><i class="fas fa-info-circle"></i><br/>' + text + '</center>');
		$("#toastr").attr("class","visible");
		setTimeout(function(){ $("#toastr").attr("class","hidden"); }, 2000);
	},
	warning : function (text) {
		$("#toastrMsg").html('<center><i class="fas fa-exclamation-circle"></i><br/>' + text + '</center>');
		$("#toastr").attr("class","visible");
		setTimeout(function(){ $("#toastr").attr("class","hidden"); }, 2000);
	},
	question : function(text) {
		state.push("QUESTION");
		$("#toastr").attr("class","visible");
		$("#toastrMsg").html('<center><i class="fas fa-question-circle"></i><br/>' + text + '</center>');
	},
	hide: function() {
		$("#toastr").attr("class","hidden");
		state.pop();
	}
}

let displayPage = function() {
	var page1 = document.getElementById("resultTable1");
	var page2 = document.getElementById("resultTable2");
	if (isPageOneDisplayed) {
		page1.style.display = "block";
		page2.style.display = "none";
	}
	else {
		page2.style.display = "block";
		page1.style.display = "none";
	}
}

// Global Variables ------------------------------------------------
let datesStructure = [{"day":null,"month":null,"year":null,"timesStructure":[{"hour":null,"forecast":null}]}];
let placeIndex = 0;
let timeIndex = 0;
let meteoData = null;
let appHasFocus = true;

// Functions -------------------------------------------------------
let init = function() {
	displayPage();
	displayPlace();
	displayDateLabel();
	if (navigator.onLine) {
		getMeteoData(places[placeIndex].location);
	}
	else toastr.warning("Données non raffraîchies : pas d'Internet disponible.")
	// App visibility check ----------------------------------------
	document.addEventListener("visibilitychange", function () {
		if (document.hidden) {
			appHasFocus = false;
		} 
		else {
			appHasFocus = true;
			if (navigator.onLine) {
				getMeteoData(places[placeIndex].location);
			}
			else toastr.warning("Données non raffraîchies : pas d'Internet disponible.")
		} 
	});
}

let displayPlace = function() {
	document.getElementById("placeLabel").innerHTML = places[placeIndex].label;
}

let displayDateLabel = function() {
	if (datesStructure[timeIndex]) {
		const date = new Date(datesStructure[timeIndex].year,datesStructure[timeIndex].month - 1,datesStructure[timeIndex].day);
		const dateLabel = 	datesStructure[timeIndex].day 
							+ " " 
							+ monthsLabels[parseInt(datesStructure[timeIndex].month)]
							+ " " 
							+ datesStructure[timeIndex].year
		document.getElementById("dateLabel").innerHTML = daysLabels[date.getDay()] + " " + dateLabel;
	}
}

let displayForecast = function() {
	const timesStructure = datesStructure[timeIndex] && datesStructure[timeIndex].timesStructure;
	if (timesStructure) {
		let innerHtml = '';
		let innerHtml2 = '';
		timesStructure.forEach(function(timeStructure) {
			// console.log(timeStructure.forecast)
			// If data is not empty
			if (timeStructure.forecast.pression["niveau_de_la_mer"] != 0) {
				let innerHtmlFragment = `<div class="row">
					<div class="cell">{{hour}}h</div>
					<div class="cell"><img src="icons/{{cloudIcon}}" style="height:70%;width:70%;"/></div>
					<div class="cellData t{{temperatureClass}}">{{temperature}}<small> °C</small></div>
					<div class="cell" style="text-align:right;">{{rain}}<small> mm</small></div>
					<div class="cell"><span class="{{windClass}}">{{wind}}</span>/<small><span class="{{windMaxClass}}">{{windMax}}</span> km/h</small></div>
				  </div>`
				innerHtmlFragment = innerHtmlFragment.replace('{{hour}}',timeStructure.hour);
				// We format the forecast data
				const temperature = Math.round((timeStructure.forecast.temperature["2m"]) - 273.16);
				const rain = timeStructure.forecast.pluie;
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
				innerHtmlFragment = innerHtmlFragment.replace('{{rain}}',rain);
				innerHtmlFragment = innerHtmlFragment.replace('{{wind}}',wind);
				innerHtmlFragment = innerHtmlFragment.replace('{{windClass}}',windClass);
				innerHtmlFragment = innerHtmlFragment.replace('{{windMax}}',windMax);
				innerHtmlFragment = innerHtmlFragment.replace('{{windMaxClass}}',windMaxClass);
				innerHtml += innerHtmlFragment;
				// --------------------------------------------------
				let innerHtmlFragment2 = `<div class="row">
					<div class="cell">{{hour}}h</div>
					<div class="cell">{{humidity}}<small> %</small></div>
					<div class="cell">{{pressure}}<small> hPa</small></div>
					<div class="cell">{{nebulosite}}</div>
				  </div>`
				innerHtmlFragment2 = innerHtmlFragment2.replace('{{hour}}',timeStructure.hour);
				// We format the forecast data
				const humidity = Math.round(timeStructure.forecast.humidite["2m"]);
				const pressure = Math.round(timeStructure.forecast.pression["niveau_de_la_mer"]/100);
				const nebulosite = timeStructure.forecast.nebulosite.basse + "<small>,</small>" + timeStructure.forecast.nebulosite.moyenne + "<small>,</small>" + timeStructure.forecast.nebulosite.haute + "<small>%</small>";
					
				innerHtmlFragment2 = innerHtmlFragment2.replace('{{humidity}}',humidity);
				innerHtmlFragment2 = innerHtmlFragment2.replace('{{pressure}}',pressure);
				innerHtmlFragment2 = innerHtmlFragment2.replace('{{nebulosite}}',nebulosite);
				innerHtml2 += innerHtmlFragment2;
			}
		});
		let resultTable1 = document.getElementById("resultTable1");
		resultTable1.innerHTML  = innerHtml;
		let resultTable2 = document.getElementById("resultTable2");
		resultTable2.innerHTML  = innerHtml2;
		
		  
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

// -----------------------------------------------------------------
// Keyboard management
// -----------------------------------------------------------------
const minDeltaBetweenKeys = 200; // In ms
let lastKeyTs = new Date().getTime();

document.addEventListener("keydown", event => {
	console.log(event.key);
	const keyTs = new Date().getTime();
	// Anti bounce filtering
	if ((keyTs - lastKeyTs) > minDeltaBetweenKeys) {
		lastKeyTs = keyTs;
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
			case "ArrowUp":
			case "ArrowDown":
				event.preventDefault();
				isPageOneDisplayed = !isPageOneDisplayed;
				displayPage();
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
	}
	else {
		console.log("Anti-bounce : invalid key");
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
				toastr.info("Données raffraîchies");
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
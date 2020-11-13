document.addEventListener("keydown", event => {
	console.log(event.key);
	
	if (event.key === "SoftLeft") {
		if (navigator.getDeviceStorage) {
			var sdcard = navigator.getDeviceStorage("sdcard");
			var file   = new Blob(["This is a text file."], {type: "text/plain"});

			var request = sdcard.addNamed(file, "carto/my-file2.txt");

			request.onsuccess = function () {
			  var name = this.result;
			  console.log('File "' + name + '" successfully wrote on the sdcard storage area');
			}

			// An error typically occur if a file with the same name already exist
			request.onerror = function () {
			  console.warn('Unable to write the file: ')
			  console.warn(this);
			}
		}
		else console.log("Ecriture non supportée sur PC.");
	}
	
});


// Functions -------------------------------------------------------
let init = function() {
	// Map instance initialisation ---------------------------------
	myMap = L.map(
		'myMap', 
		{
			center:[46.8087531,-2.0362527],
			zoom:10,
			zoomControl: false
		}
	);
	console.log("ok")
	// We add the background ---------------------------------------
	leafletBackgroundLayer = L.tileLayer(
		"/carteIgn/{z}/{x}/{y}.png", 
		{
			attribution:  '',
			maxZoom: 	19,
			minZoom:	2,
			id: 		'ignMap'
		}
	).addTo(myMap);
}



// -----------------------------------------------------------------
// File CLASS
// -----------------------------------------------------------------
const File = function(initial) {
	// Properties --------------------------------------------------
	this.label = 						initial.label ||	"Fichier inconnu";
	this.name = 						initial.name ||	"";
	this.completePathName = 			initial.completePathName || "";
	this.fileExtension = 				initial.fileExtension || "";
	this.lastModifiedDate = 			initial.lastModifiedDate || "";
	// For Rotator usage only --------------------------------------
	this.rotatorType = 					initial.rotatorType || "SELECT";
	this.rotatorIcon =					(this.fileExtension === "wpt") ? "fas fa-map-marker" : "fas fa-feather";
	this.rotatorInfos =					function() {
		return "(Enregistré le " + format_dateString(this.lastModifiedDate) + ")";
	};
}

// readFromSD ------------------------------------------------------
File.prototype.readFromSD = function() {
	const that = this;
	if (navigator.getDeviceStorage) {
		const sdcard = navigator.getDeviceStorage("sdcard");
		const request = sdcard.get(this.completePathName);

		request.onsuccess = function () {
			const file = this.result;
			console.log("Get the file: " + file.name);
			read = new FileReader();
			read.readAsText(file);
			
			// ??????????????????????????
			// Read error management ?
			// ??????????????????????????
			
			read.onloadend = function(){
				let fileContentObject = JSON.parse(read.result);
				console.log(fileContentObject);
				console.log(that.fileExtension)
				switch (that.fileExtension) {
					case "wpt":
						let newWaypoint = new Waypoint(fileContentObject);
						console.log(newWaypoint);
						waypoints.list.unshift(newWaypoint);
						// We select the new waypoint
						waypoints.currentIndex = 0;
						waypoints.generateHtml();
						waypoints.refreshMap();
						toastr.info("Point ajouté depuis la carte SD.")
						break;
					case "trk":
						const newTrack = new Track(fileContentObject);
						tracks.list.unshift(newTrack);
						// We select the new track
						tracks.currentIndex = 0;
						tracks.generateHtml();
						tracks.refreshMap();
						toastr.info("Trace ajoutée depuis la carte SD.")
						break;
				}
			}
		}

		request.onerror = function () {
			toastr.warning('Lecture sur la carte SD impossible.');
			console.warn(this);
		}
	}
	else console.log("Lecture non supportée sur cet appareil.");
};

// -----------------------------------------------------------------
// files ROTATOR
// -----------------------------------------------------------------
const filesOptions = {
	"selectedItemIdPrefix" : 	"file",
	"targetDomSelector" : 		"#menuTarget_5",
	"itemsNumbered":			"reverse"
}

const files = new Rotator([],filesOptions);

// We add the getAndDisplayFilesFromSD method ----------------------
files.getAndDisplayFilesFromSD = function() {
	if (navigator.getDeviceStorage) {
		const sdcard = navigator.getDeviceStorage("sdcard");
		let cursor = sdcard.enumerate("carto");
		const that = this;
		that.list = [];
		cursor.onsuccess = function (e) {
			// We recurse the files list until cursor.result empty
			if(cursor.result) {
				const fileInfos = cursor.result;
				const completePathName = fileInfos.name;
				const splittedPath = fileInfos.name.split("/");
				const name = splittedPath.pop();
				const fileExtension = name.split(".").pop();
				const lastModifiedDate = fileInfos.lastModifiedDate;
				const currentFile = new File({
					label : 			name,
					name : 				name,
					completePathName : 	completePathName,
					fileExtension : 	fileExtension,
					lastModifiedDate : 	lastModifiedDate,
				});
				that.list.push(currentFile);
				this.continue();
			}
			// We set the index to 0 and displays the list
			else {
				that.currentIndex = 0;
				that.generateHtml();
			}
		}

		cursor.onerror = function () { 
			console.log("No file found: " + this.error); 
		}
	}
	else console.log("Accès aux fichiers non supporté sur PC.");	
}

// We add the removeCurrentFileFromSdAndDisplay method ----------------------
files.removeCurrentFileFromSdAndDisplay = function(indexToRemove) {
	if (navigator.getDeviceStorage) {
		const that = this;
		const sdcard = navigator.getDeviceStorage("sdcard");
		var request = sdcard.delete(that.currentItem().completePathName);

		request.onsuccess = function () {
			toastr.info("Fichier " + that.currentItem().label + " supprimé.");
			// Delete the file in the list
			const indexToDeleted = that.currentIndex;
			that.list.splice(indexToDeleted, 1);
			// Activate the previous one
			let newSelectedIndex = (indexToDeleted != 0) ? (indexToDeleted - 1) : 0;
			that.currentIndex = newSelectedIndex;
			// We diplay the list
			state.files_actions = false;
			that.generateHtml();			
		}

		request.onerror = function () {
			toastr.warning("Impossible de supprimer ce fichier : " + (this.error && this.error.name));
		}
	}
	else console.log("Accès aux fichiers non supporté sur PC.");	
}

// -----------------------------------------------------------------
// files_actions ROTATOR
// -----------------------------------------------------------------
let files_actions_list = [
	{	
		label:"Charger dans la cartographie",
		rotatorType:"MENU",
		value:"loadFromSD"
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
	}
];

const files_actions_options = {
	"selectedItemIdPrefix" : 		"files_actions",
	"targetDomSelector" : 			"#menuTarget_5"
}

const files_actions = new Rotator(files_actions_list,files_actions_options);
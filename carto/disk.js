// =================================================================
// 							 DISK.JS
// =================================================================


// -----------------------------------------------------------------
// writeSelectedTrackToDisk
// -----------------------------------------------------------------
function writeSelectedTrackToDisk() {
	if (navigator.getDeviceStorage) {
		var sdcard = navigator.getDeviceStorage("sdcard");
		const file   = new Blob([JSON.stringify(tracks.currentItem())], {type: "text/plain"});
		let request = sdcard.addNamed(file, "currentTrack.jpg");
		// Success
		request.onsuccess = function () {
			var name = this.result;
			toastr.info('Fichier "' + name + '" enregistré');
		}
		// Error
		request.onerror = function () {
			toastr.info('Ecriture impossible : ');
			console.log(this);
		}
	}
	else toastr.info("Ecriture non supportée sur PC.");
}
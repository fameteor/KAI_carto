// =================================================================
// 							 DISK.JS
// =================================================================


// -----------------------------------------------------------------
// writeSelectedTrackToDisk
// -----------------------------------------------------------------
function writeSelectedTrackToDisk() {
	if (navigator.getDeviceStorage) {
		const pics = navigator.getDeviceStorage('pictures');
		const file   = new Blob([JSON.stringify(tracks.currentItem())], {type: "text/plain"});
		let request = pics.addNamed(file, "currentTrack.jpg");
		// Success
		request.onsuccess = function () {
			var name = this.result;
			toastr.info('Fichier "' + name + '" enregistré');
		}
		// Error
		request.onerror = function () {
			toastr.info('Ecriture impossible : ' + JSON.stringify(this.error));
			console.log(this.error);
		}
	}
	else toastr.info("Ecriture non supportée sur PC.");
}
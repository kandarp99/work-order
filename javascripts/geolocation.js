var getGeoLocation = function(inputToUpdate, viewToUpdate) {
	var locationInfo = function(position) {
		var latitude = position.coords.latitude;
		var longitude = position.coords.longitude;
		var altitude = position.coords.altitude;

		var dataToReturn = "lat = " + latitude + ", long = " + longitude + ", alt = " + altitude;
		
		viewToUpdate.innerHTML = dataToReturn;
		inputToUpdate.value = dataToReturn;

		viewToUpdate.style.borderColor = 'gray';
		viewToUpdate.style.borderWidth = '1px';
	}
	
	var locationInfoError = function(error) {
		var errorMessage = ['', 'Permission Denied', 'Position Unavailable', 'Timeout'];
		var dataToReturn = 'Error getting location info: ' + errorMessage[error.code];

		viewToUpdate.innerHTML = dataToReturn;
		inputToUpdate.value = dataToReturn;

		viewToUpdate.style.borderColor = 'gray';
		viewToUpdate.style.borderWidth = '1px';
	}
	
	viewToUpdate.innerHTML = 'Fetching location, please wait...';
	navigator.geolocation.getCurrentPosition(locationInfo, locationInfoError);
}
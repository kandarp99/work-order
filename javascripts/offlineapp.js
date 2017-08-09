var notificationRed = 'rgb(205, 0, 0)';
var notificationGreen = 'rgb(15, 150, 65)';

var parseForm = function(workorder) {
	var values = {};
	var data = $('#' + workorder).serializeArray();

	var mapValues = function(index, field) {
		values[field.name] = field.value;
	}

	$(data).each(mapValues);
	
	return values;
}

var saveLocally = function(data) {
	var workOrderCount = parseInt(localStorage.workOrderCount) + 1 || 1;
  
	localStorage['workorder' + workOrderCount] = data;
	localStorage.workOrderCount = workOrderCount;
}

var sendLocalStorageToServer = function() {
	for(key in localStorage) {
		if(key.indexOf("workorder") > -1) {
			checkConnected(new XMLHttpRequest(), localStorage.getItem(key));
			localStorage.removeItem(key);
			localStorage.workOrderCount--;
		}
	}
}

var checkConnected = function(xhr, values) {
	var handler = function() {
		if(xhr.readyState === 4) {
			if(xhr.status === 200) {
				sendLocalStorageToServer();
				fadeOutNotification('Work Order Successfully Sent to Server', notificationGreen, 5000);
			}
			else {
				saveLocally(values);
				fadeOutNotification('No Connection -- Work Order Stored Locally', notificationRed, 5000);
			}
		}
	}
	
	xhr.onreadystatechange = handler;
	xhr.open("POST", "http://localhost:8080", true);
	xhr.send(values);
}

var getCurrentDate = function() {
	var date = new Date();
	date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

	document.getElementById('theDate').style.borderColor = 'gray';
	document.getElementById('theDate').style.borderWidth = '1px';

	return date.toJSON().slice(0, 10);
}

var refreshForm = function(geoLocationFunction, fillDateFunction) {
	fillDateFunction(document.getElementById('theDate'));
	geoLocationFunction(document.getElementById('theLocation'), document.getElementById('locationview'));
	
	document.getElementById('theDescription').value = '';
	document.getElementById('theDescription').focus();
	document.getElementById('minor').checked = true;
}

var fadeOutNotification = function(msg, color, time) {
	changeNotification(msg, color);
	setTimeout(emptyNotification, time);
}

var clearNotification = function(caller) {
	caller.style.borderColor = 'gray';
	caller.style.borderWidth = '1px';
	emptyNotification();
}

var emptyNotification = function() {
	document.getElementById('notification').innerHTML = '&nbsp';
}

var changeNotification = function(msg, color) {
	document.getElementById('notification').style.color = color
	document.getElementById('notification').innerHTML = msg;
}

var validate = function() {
	var isValid = true;
	var elements = ['firstname', 'lastname', 'theDate', 'theDescription'];

	for(var i = 0; i < elements.length; i++) {
		if(document.getElementById(elements[i]).value.length < 1) {
			document.getElementById(elements[i]).style.borderColor = notificationRed;
			document.getElementById(elements[i]).style.borderWidth = '2px';
			changeNotification('Please provide values for the highlighted field(s).', notificationRed);
			isValid = false;
		}
	}

	if(document.getElementById('locationview').innerHTML == 'Fetching location, please wait...') {
		document.getElementById('locationview').style.borderColor = notificationRed;
		document.getElementById('locationview').style.borderWidth = '2px';
		changeNotification('Please provide values for the highlighted fields(s).', notificationRed);
		isValid = false;
	}

	return isValid;
}

var controller = function(formId, callback) {
	if(validate()) {
		var formValues = parseForm(formId);
		checkConnected(new XMLHttpRequest(), JSON.stringify(formValues));
		refreshForm(getGeoLocation, getCurrentDate);
		return true;
	}

	return false;
}

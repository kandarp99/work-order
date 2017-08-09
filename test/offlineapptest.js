describe('offlineapp', function() {
	it('canary is passing', function() {
		expect(true).to.be.eql(true);
	});

	var originalCheckConnected = checkConnected;
	var originalChangeNotification = changeNotification;
	
	beforeEach(function() {
		checkConnected = originalCheckConnected;
		changeNotification = originalChangeNotification;
		localStorage.clear();
	});

	it('saveLocally saves into local storage', function() {
		var data = {
			name: "Joe",
			urgency: "severe"
		};

		saveLocally(JSON.stringify(data));

		parsedStorage = JSON.parse(localStorage.getItem("workorder1"));
		expect(parsedStorage.name).to.be.eql("Joe");
		expect(parsedStorage.urgency).to.be.eql("severe");

	});
	
	it('work order count increments after saveLocally', function() {
		var data = {
			name: "Bill",
		};

		saveLocally(data);
		expect(1).to.be.eql(parseInt(localStorage.workOrderCount));		
		saveLocally(data);
		expect(2).to.be.eql(parseInt(localStorage.workOrderCount));
	});


	it('sendLocalStorageToServer calls checkConnected and removes localStorage entries', function() {
		var data = {
			name: "Joe",
			urgency: "severe"
		};

		var data = {
			name: "Joe",
			urgency: "severe"
		};

		var checkConnectedCalled = false;

		saveLocally(JSON.stringify(data));
		saveLocally(JSON.stringify(data));

		checkConnected = function(test) {
			checkConnectedCalled = true;
		}

		sendLocalStorageToServer();

		expect(checkConnectedCalled).to.be.eql(true);
		expect(localStorage['workorder1']).to.be.eql(undefined);
		expect(localStorage['workorder2']).to.be.eql(undefined);
		expect(parseInt(localStorage.workOrderCount)).to.be.eql(0);
	});
	
	it('form values reset on submission', function() {
		var fixture = '<input id="firstname" type="text">' + 
					  '<input id="lastname" type="text">' +
					  '<input id="theDescription" type="text">' +
					  '<input id="minor" type="radio">' +
					  '<input id="theDate" type="text">' +
					  '<input id="theLocation" type="text">' +
					  '<input id="locationview" type="text">';

		document.body.insertAdjacentHTML('afterbegin',  fixture);
		
   		document.getElementById('firstname').value = "Bill";
		document.getElementById('lastname').value = "Smith";
		document.getElementById('theDescription').value = "Work Order Here";
		document.getElementById('minor').checked = false;
		document.getElementById('theDate').value = false;
		document.getElementById('theLocation').value = false;
		document.getElementById('locationview').value = false;
		
		var geoLocationMock = function(locationField, locationView) {
			locationField.value = true;
			locationView.value = true;
		}
		
		var fillDateMock = function() {
			document.getElementById('theDate').value = true;
		}

		refreshForm(geoLocationMock, fillDateMock);

		expect(firstname.value).to.be.eql('Bill');	
		expect(lastname.value).to.be.eql('Smith');
		expect(theDescription.value).to.be.eql('');
		expect(minor.checked).to.be.eql(true);
		expect(theDate.value).to.not.equal(false);
		expect(theLocation.value).to.not.equal(false);
		expect(locationview.value).to.not.equal(false);

	});
	
	it('notification changes based on parameters', function() {
		var DOM = '<label id="notification">';
		document.body.insertAdjacentHTML('afterbegin',  DOM);
		document.getElementById('notification').style.color = "red";
		document.getElementById('notification').innerHTML = "Problem";
		
		changeNotification("No Issues", "blue");
		expect(document.getElementById('notification').style.color).to.be.eql("blue");
		expect(document.getElementById('notification').innerHTML).to.be.eql("No Issues");
		
	});
	
	it('test empty field caught by validation', function() {
		var fixture = '<input id="firstname" type="text">' + 
					  '<input id="lastname" type="text">' +
					  '<input id="theDescription" type="text">' +
					  '<input id="theDate" type="text">' +
					  '<label id="locationview"></label>';
		
		document.body.insertAdjacentHTML('afterbegin',  fixture);
		
		document.getElementById('firstname').value = "";
		document.getElementById('lastname').value = "Something";
		document.getElementById('theDate').value = "Not Empty";
		document.getElementById('theDescription').value = "this";
		
		expect(validate()).to.be.eql(false);

		document.getElementById('firstname').value = "Bill";

		expect(validate()).to.be.eql(true);

		document.getElementById('lastname').value = "";

		expect(validate()).to.be.eql(false);

		document.getElementById('lastname').value = "wefj";
		document.getElementById('theDate').value = "";

		expect(validate()).to.be.eql(false);

		document.getElementById('theDate').value = "waef";
		document.getElementById('theDescription').value = "";

		expect(validate()).to.be.eql(false);

		document.getElementById('locationview').innerHTML = 'Fetching location, please wait...';

		expect(validate()).to.be.eql(false);
	});

	it('validate will update borders for invalid fields', function() {
		var fixture = '<input id="firstname" type="text">' + 
					  '<input id="lastname" type="text">' +
					  '<input id="theDescription" type="text">' +
					  '<input id="theDate" type="text">' +
					  '<label id="locationview"></label>';
		
		document.body.insertAdjacentHTML('afterbegin',  fixture);
		
		document.getElementById('firstname').value = "";
		document.getElementById('lastname').value = "";
		document.getElementById('theDate').value = "";
		document.getElementById('theDescription').value = "";
		document.getElementById('locationview').innerHTML = 'Fetching location, please wait...';

		document.getElementById('firstname').style.borderColor = "awef";
		document.getElementById('firstname').style.borderWidth = "awef";
		document.getElementById('lastname').style.borderColor = "awef";
		document.getElementById('lastname').style.borderWidth = "awef";
		document.getElementById('theDate').style.borderColor = "awef";
		document.getElementById('theDate').style.borderWidth = "awef";
		document.getElementById('theDescription').style.borderColor = "awef";
		document.getElementById('theDescription').style.borderWidth = "awef";

		validate();
		
		expect(document.getElementById('firstname').style.borderColor).to.be.eql(notificationRed);
		expect(document.getElementById('firstname').style.borderWidth).to.be.eql('2px');

		expect(document.getElementById('lastname').style.borderColor).to.be.eql(notificationRed);
		expect(document.getElementById('lastname').style.borderWidth).to.be.eql('2px');

		expect(document.getElementById('theDate').style.borderColor).to.be.eql(notificationRed);
		expect(document.getElementById('theDate').style.borderWidth).to.be.eql('2px');

		expect(document.getElementById('theDescription').style.borderColor).to.be.eql(notificationRed);
		expect(document.getElementById('theDescription').style.borderWidth).to.be.eql('2px');

		expect(document.getElementById('locationview').style.borderColor).to.be.eql(notificationRed);
		expect(document.getElementById('locationview').style.borderWidth).to.be.eql('2px');
	});

	it('emptyNotification changes notification text to &nbsp;', function() {
		var fixture = '<label id="notification" type="text">';

		document.body.insertAdjacentHTML('afterbegin', fixture);

		document.getElementById('notification').innerHTML = 'test';

		emptyNotification();

		expect(document.getElementById('notification').innerHTML).to.be.eql('&nbsp;');

	});

	it('clearNotification resets border color of caller and calls emptyNotification', function() {
		var emptyNotificationCalled = false;

		var fixture = '<input id="firstname" type="text">';

		document.body.insertAdjacentHTML('afterbegin', fixture);

		document.getElementById('firstname').style.borderColor = 'red';

		emptyNotification = function() {
			emptyNotificationCalled = true;
		}

		clearNotification(document.getElementById('firstname'));

		expect(document.getElementById('firstname').style.borderColor).to.be.eql('gray');
		expect(emptyNotificationCalled).to.be.eql(true);
	});

	it('getCurrentDate fills current date into datefield and resets border', function() {
		var fixture = '<input id="theDate" type="text">';

		document.body.insertAdjacentHTML('afterbegin', fixture);

		document.getElementById('theDate').style.borderColor = 'red';
		document.getElementById('theDate').style.borderWidth = '2px';
		document.getElementById('theDate').value = getCurrentDate();

		var date = new Date();
		date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

		var expected = date.toJSON().slice(0, 10);

		expect(document.getElementById('theDate').value).to.be.eql(expected);
		expect(document.getElementById('theDate').style.borderColor).to.be.eql('gray');
		expect(document.getElementById('theDate').style.borderWidth).to.be.eql('1px');
	});

	it('form values mapped to form field' , function() {
		
		var fixture = '<form id="workorder" method="post">' + 
					  '<input id="firstname" name="firstname" type="text" value="Bill">' +
					  '<input id="lastname" name="lastname" type="text" value="Smith">' +
					  '</form>';
		
		document.body.insertAdjacentHTML('beforebegin',  fixture);		

		var retval = parseForm('workorder');

		expect(retval["firstname"]).to.be.eql('Bill');
		expect(retval["lastname"]).to.be.eql('Smith');
		
	});
	
	it('test geolocation', function() {
		var fixture = '<label id="view1" value="FAKE1">' + '<input id="input1" type="text" value="FAKE2">';
		document.body.insertAdjacentHTML('afterbegin',  fixture);
		
		var position = {
			coords: {
				latitude: 1,
				longitude: 2,
				altitude: 3
			}
		}
		
		var locationInfo = function() {
		}
		
		var locationInfoError = function() {
		}
		
		var error = {
			code: 57
		}
		
		window.navigator.geolocation = {
			getCurrentPosition: function(locationInfo) {
				locationInfo(position);
			}
		}

		var view = document.getElementById("view1");

		view.style.borderColor = 'red';
		view.style.borderWidth = '2px';

		var input = document.getElementById("input1");

		getGeoLocation(document.getElementById("input1"), document.getElementById("view1"));

		var expectedOutput = "lat = " + position.coords.latitude + ", long = " + position.coords.longitude + ", alt = " + position.coords.altitude;
		
		expect(view.innerHTML).to.be.eql(expectedOutput);
		expect(input.value).to.be.eql(expectedOutput);
		expect(view.style.borderColor).to.be.eql('gray');
		expect(view.style.borderWidth).to.be.eql('1px');		
	});
	
	it('test geolocation error', function() {
		var fixture = '<label id="view1" value="FAKE1">' + '<input id="input1" type="text" value="FAKE2">';
		document.body.insertAdjacentHTML('afterbegin',  fixture);
		
		var error = {
			code: 1
		}
		
		var locationInfoError = function() {
		}
		var fakeFunc = function() {
		}
		
		var error = {
			code: 1
		}
		
		window.navigator.geolocation = {
			getCurrentPosition: function(fakeFunc, locationInfoError) {
				locationInfoError(error);
			}
		}

		var view = document.getElementById("view1");

		view.style.borderColor = 'red';
		view.style.borderWidth = '2px';

		var input = document.getElementById("input1");
		
		getGeoLocation(document.getElementById("input1"), document.getElementById("view1"));
		
		var expectedOutput = 'Error getting location info: Permission Denied';
		
		expect(view.innerHTML).to.be.eql(expectedOutput);
		expect(input.value).to.be.eql(expectedOutput);
		expect(view.style.borderColor).to.be.eql('gray');
		expect(view.style.borderWidth).to.be.eql('1px');			
	});

	it('controller validates and calls appropriate functions', function() {
		var validateCalled = false;
		var parseFormArgument = '';
		var checkConnectedValue = '';
		var refreshFormGeoFunc;
		var refreshFormDateFunc;
		var theRequest;

		validate = function() {
			validateCalled = true;
			return true;
		}

		parseForm = function(id) {
			parseFormArgument = id;
			return id;
		}

		checkConnected = function(request, values, func1, func2) {
			theRequest = request;
			checkConnectedValue = values;
		}

		refreshForm = function(geoFunc, dateFunc) {
			refreshFormGeoFunc = geoFunc;
			refreshFormDateFunc = dateFunc;
		}

		controller('test');

		expect(validateCalled).to.be.eql(true);
		expect(parseFormArgument).to.be.eql('test');
		expect(checkConnectedValue).to.be.eql('"test"');
		expect(refreshFormGeoFunc).to.be.eql(getGeoLocation);
		expect(refreshFormDateFunc).to.be.eql(getCurrentDate);
		expect(typeof(theRequest)).to.be.eql(typeof(new XMLHttpRequest()));
	});

	it('controller returns false if validation returns false', function() {
		validate = function() {
			return false;
		}

		expect(controller('test')).to.be.eql(false);
	});

	it('controller returns true if validation returns true', function() {
		validate = function() {
			return true;
		}

		expect(controller('test')).to.be.eql(true);
	});	

	it('checkConnected sets onreadystatechange and makes AJAX call', function() {
		var valuesSent;
		var openMethod;
		var openAddress;
		var openBool;

		var mockAJAX = {
			onreadystatechange: undefined,
			open: function(method, address, bool) {
				openMethod = method;
				openAddress = address;
				openBool = bool;
			},
			send: function(values) {
				valuesSent = values;
			}
		}

		checkConnected(mockAJAX, 'test');

		expect(openMethod).to.be.eql("POST");
		expect(openAddress).to.be.eql("http://localhost:8080");
		expect(openBool).to.be.eql(true);
		expect(valuesSent).to.be.eql('test');
		expect(mockAJAX.onreadystatechange).to.not.eql(undefined);
	});

	it('checkConnected calls senddLocalStorageToServer on success', function() {
		var sendLocalStorageToServerCalled = false;
		var changeNotificationMsg;
		var changeNotificationColor;

		var mockAJAX = {
			readyState: 4,
			status: 200,
			onreadystatechange: undefined,
			open: function(method, address, bool) {
				openMethod = method;
				openAddress = address;
				openBool = bool;
			},
			send: function(values) {
				valuesSent = values;
			}
		}

		sendLocalStorageToServer = function() {
			sendLocalStorageToServerCalled = true;
		}

		changeNotification = function(msg, color) {
			changeNotificationMsg = msg;
			changeNotificationColor = color;
		}

		checkConnected(mockAJAX, 'test');

		mockAJAX.onreadystatechange();

		expect(sendLocalStorageToServerCalled).to.be.eql(true);
		expect(changeNotificationMsg).to.be.eql("Work Order Successfully Sent to Server");
		expect(changeNotificationColor).to.be.eql(notificationGreen);
	});


	it('checkConnected calls saveLocally on failed connection', function() {
		var saveLocallyCalled = false;
		var changeNotificationMsg;
		var changeNotificationColor;

		var mockAJAX = {
			readyState: 4,
			status: 0,
			onreadystatechange: undefined,
			open: function(method, address, bool) {
				openMethod = method;
				openAddress = address;
				openBool = bool;
			},
			send: function(values) {
				valuesSent = values;
			}
		}

		saveLocally = function(values) {
			saveLocallyCalled = true;
		}

		changeNotification = function(msg, color) {
			changeNotificationMsg = msg;
			changeNotificationColor = color;
		}

		checkConnected(mockAJAX, 'test');

		mockAJAX.onreadystatechange();

		expect(saveLocallyCalled).to.be.eql(true);
		expect(changeNotificationMsg).to.be.eql("No Connection -- Work Order Stored Locally");
		expect(changeNotificationColor).to.be.eql(notificationRed);
	});

	it('fadeOutNotification updates message then calls a setTimeout with function after specified time', function() {
		var functionCalled;
		var timeGiven;

		var expectedFunction = function() {
			changeNotification('&nbsp', 'white')
		}

		setTimeout = function(func, time) {
			functionCalled = func;
			timeGiven = time;
		}

		var fixture = '<label id="notification" type="text">';

		document.body.insertAdjacentHTML('afterbegin', fixture);

		fadeOutNotification('test', 'red', 10);

		expect(document.getElementById('notification').style.color).to.be.eql('red');
		expect(document.getElementById('notification').innerHTML).to.be.eql('test');
		expect(functionCalled).to.be.eql(emptyNotification);
		expect(timeGiven).to.be.eql(10);
	});





















});
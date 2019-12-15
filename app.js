const refreshButton = document.querySelector('.refresh');
const closeButton1 = document.querySelector('.close1');
const closeButton2 = document.querySelector('.close2');
const closeButton3 = document.querySelector('.close3');


const refreshClickStream = rxjs.fromEvent(refreshButton, 'click');
const close1ClickStream = rxjs.fromEvent(closeButton1, 'click');
const close2ClickStream = rxjs.fromEvent(closeButton2, 'click');
const close3ClickStream = rxjs.fromEvent(closeButton3, 'click');


const requestOnRefreshStream = refreshClickStream
	.pipe(
		rxjs.operators.map(function(e){
			console.log(e);
			var randomOffset = Math.floor(Math.random()*200);
			return 'https://api.github.com/users?since=' + randomOffset;
		})
	);

const startupRequestStream  = rxjs.of('https://api.github.com/users');

var requestStream = rxjs.merge(
	requestOnRefreshStream, startupRequestStream
);


const responseStream  = requestStream
	.pipe(
		rxjs.operators.flatMap(function(requestUrl) {
			return rxjs.from($.getJSON(requestUrl));
		})
	);


const suggestion1Stream = responseStream
	.pipe(
		rxjs.operators.map(function(listUsers) {
			console.log(listUsers);
			// get one random user from the list
			return listUsers[Math.floor(Math.random()*listUsers.length)];
		}),
		rxjs.operators.merge(
			refreshClickStream
				.pipe(
					rxjs.operators.map(function(){ return null; })
				)
		)
	)

const suggestion2Stream = responseStream
	.pipe(
	rxjs.operators.map(function(listUsers) {
		console.log(listUsers);
		// get one random user from the list
		return listUsers[Math.floor(Math.random()*listUsers.length)];
	})
)

const suggestion3Stream = responseStream
	.pipe(
	rxjs.operators.map(function(listUsers) {
		console.log(listUsers);
		// get one random user from the list
		return listUsers[Math.floor(Math.random()*listUsers.length)];
	})
)


//responseStream.subscribe(function(response) {
//	// do something with the response
//	console.log(response);
//});

// Rendering ---------------------------------------------------
function renderSuggestion(suggestedUser, selector) {
	var suggestionEl = document.querySelector(selector);
	if (suggestedUser === null) {
		suggestionEl.style.visibility = 'hidden';
	} else {
		suggestionEl.style.visibility = 'visible';
		var usernameEl = suggestionEl.querySelector('.username');
		usernameEl.href = suggestedUser.html_url;
		usernameEl.textContent = suggestedUser.login;
		var imgEl = suggestionEl.querySelector('img');
		imgEl.src = "";
		imgEl.src = suggestedUser.avatar_url;
	}
}

suggestion1Stream.subscribe(function(suggestion) {
	// render the 1st suggestion to the DOM
	renderSuggestion(suggestion, '.suggestion1');
});

suggestion2Stream.subscribe(function(suggestion) {
	// render the 2nd suggestion to the DOM
	renderSuggestion(suggestion, '.suggestion2');
});

suggestion3Stream.subscribe(function(suggestion) {
	// render the 3rd suggestion to the DOM
	renderSuggestion(suggestion, '.suggestion3');
});
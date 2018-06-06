var type, redirect, clientid, scope, state;

function contButton() {
	var list = $(".ui-content").find("input").filter(":checked");
	
	if (list.length > 0) {
		var newScopes = "";
		
		for (var i = 0; i < list.length; i++) {
			newScopes += list[i].closest(".grid").id + " ";
		}
		
		console.log(newScopes);
		
		location = 	"https://login.eveonline.com/oauth/authorize"+
					"?response_type="+type+
					"&redirect_uri="+redirect+
					"&client_id="+clientid+
					"&scope="+newScopes+
					"&state="+state;
	}
	else {
		alert("You need to select at least one scope to continue.");
	}
}

$(document).ready(function() {
	// Load server status into header
	//serverStatus();
	
	// If there's a search, someone's trying to actually call the page properly
	if (location.search) {
		// Make sure all parameters are proper. Collect all expected params in vars to check them.
		/*
		https://login.eveonline.com/oauth/authorize
		?response_type=token
		&redirect_uri=test.com
		&client_id=d39d34e683aa48c2b535b099c3dc404a
		&scope=esi-corporations.read_corporation_membership.v1 esi-characters.read_corporation_roles.v1 esi-corporations.track_members.v1 esi-corporations.read_titles.v1 esi-corporations.read_fw_stats.v1
		&state=membertracker
		*/
		type = parseSearch("response_type");
		redirect = parseSearch("redirect_uri");
		clientid = parseSearch("client_id");
		scope = parseSearch("scope");
		state = parseSearch("state");
		
		// If all vars exist, the page has been called properly.
		if (type && redirect && clientid && scope && state) {
			var scopes = scope.split(" ");
			
			for (var i = 0; i < scopes.length; i++) {
				var esi = scopes[i];
				var elem = $("div[id=\""+esi+"\"]");
				
				elem.show();
			}
			
			var charscope = $("#char-scopes").find(".grid").filter(":visible");
			if (charscope.length == 0)
				$("#char-scopes").hide();
			
			var corpscope = $("#corp-scopes").find(".grid").filter(":visible");
			if (corpscope.length == 0)
				$("#corp-scopes").hide();
			
			var alliscope = $("#alli-scopes").find(".grid").filter(":visible");
			if (alliscope.length == 0)
				$("#alli-scopes").hide();
		}
		// If one is false, it doesn't exist, and we need to verbalise it.
		else {
			var missing = "";
			if (!type)
				missing += "'response_type' needs to be set in the URL. This is used by CCP to know what kind of token to return to you. Can be 'token' or 'code'. 'code' will give a you a token that you must verify futher with CCP, but will give you access to a 'refresh token', while 'token' gives you a code that works right away, but is only good for 30 minutes.\n\n";
			if (!redirect)
				missing += "'redirect_uri' is not set. How is CCP supposed to know who to send the token back to??\n\n";
			if (!clientid)
				missing += "'client_id' was not found. This is how CCP knows what app is requesting access.\n\n";
			if (!scope)
				missing += "'scope' is kind of neccassary... I mean that's the whole point of this page...\n\n";
			if (!state)
				missing += "'state' is highly recommended for auth requests. It lets you make sure no one has tampered with your request. As such, I'm making it required for use with this website, since it opens up possibilities for interception.\n\n";
			
			console.log(missing);
			// Load 'missing' onto the page somewhere so that people can yell at other devs.
		}
		
	}
	
	// Otherwise, show instructions page
	else {
		$("#selection-page").hide();
		$("#help-page").show();
	}
});

// Fire XHR request for server data
function serverStatus() {
	var fetch = new XMLHttpRequest();
	fetch.onload = serverStatusLoad;
	fetch.onerror = serverStatusError;
	fetch.open('get', "https://esi.evetech.net/latest/status/?datasource=tranquility", true);
	fetch.send();
}

// Catch server data response
function serverStatusLoad() {
	var data = JSON.parse(this.responseText);
	var isOn = data.players > 0;
	$('#server-status').text("Server is " + (isOn ? "online" : "offline") + " --- Players online: " + data.players);
}

// Catch server data errors
function serverStatusError(err) {
	$('#server-status').text("Error loading server status");
}

function parseSearch(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Search variable "%s" not found', variable);
	return false;
}

function parseHash(variable) {
    var query = window.location.hash.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Hash variable %s not found', variable);
	return false;
}


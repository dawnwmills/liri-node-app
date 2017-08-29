
	var twitter = require("twitter");
	var spotify = require ("node-spotify-api");	
	var fs = require("fs"); 
	var request = require("request");
	var keys = require("./keys.js");
	
	var liriArgv = process.argv[2];


// Arguments for the app
	switch(liriArgv) {
		case "my-tweets": getTweets(); break;
		case "spotify-this-song": spotifyThis(); break;
		case "movie-this": movieThis(); break;
		case "do-what-it-says": whatItsay(); break;


	};




// Tweeter Function =================================================================================================

	function getTweets() {
		var client = new twitter({
			consumer_key: keys.twitterKeys.consumer_key,
			consumer_secret: keys.twitterKeys.consumer_secret,
			access_token_key: keys.twitterKeys.access_token_key,
			access_token_secret: keys.twitterKeys.access_token_secret, 
		});



		var userName = process.argv[3];
		if(!userName){
			userName = "dawnymills17";
		}
		params = {screen_name: userName};
		client.get("statuses/user_timeline/", params, function(error, data, response){
			if (!error) {
				for(var i = 0; i < data.length; i++) {
					
					var twitterResults = 
					"@" + data[i].user.screen_name + ": " + 
					data[i].text + "\n" + 
					data[i].created_at + "\n" + 
					"------------------------------ " + i + " ------------------------------" + "\n";
					console.log(twitterResults);
					log(twitterResults); 
				}
			}  else {
				console.log("Error :"+ error);
				return;
			}
		});
	}




// Spotify function =================================================================================================

	function spotifyThis(songName) {
		var songName = process.argv[3];
		if(!songName){
			songName = "what's my age again?";
		}
		params = songName;
		spotify.search({ type: "track", query: params }, function(err, data) {
			if(!err){
				


				var songInfo = data.tracks.items;
				for (var i = 0; i < 5; i++) {
					if (songInfo[i] != undefined) {
						
						var spotifyResult =
						"Artist: " + songInfo[i].artists[0].name + "\n" +
						"Song: " + songInfo[i].name + "\n" +
						"Album the song is from: " + songInfo[i].album.name + "\n" +
						"Preview Url: " + songInfo[i].preview_url + "\n" + 
						"------------------------------ " + i + " ------------------------------" + "\n";
						console.log(spotifyResult);
						log(spotifyResult); 
					}
				}
			}	else {
				console.log("Error :"+ err);
				return;
			}
		});
	};



	
// Movie function =================================================================================================

	function movieThis(){
		var movie = process.argv[3];
		if(!movie){
			movie = "mr nobody";
		}
		params = movie
		request("http://www.omdbapi.com/?t=" + params + "&y=&plot=short&r=json&tomatoes=true", function (error, response, body) {
			if (!error && response.statusCode == 200) {
				



				var movieObject = JSON.parse(body);
				

				var movieResults =
				
				"Movie Title: " + movieObject.Title+"\n"+
				"Year: " + movieObject.Year+"\n"+
				"Imdb Rating: " + movieObject.imdbRating+"\n"+
				"Rotten Tomatoes Rating: " + movieObject.tomatoRating+"\n"+
				"Rotten Tomatoes URL: " + movieObject.tomatoURL + "\n" + 
				"Country: " + movieObject.Country+"\n"+
				"Language: " + movieObject.Language+"\n"+
				"Plot: " + movieObject.Plot+"\n"+
				"Actors: " + movieObject.Actors+"\n"+
				
				
				console.log(movieResults);
				log(movieResults); 
			} else {
				console.log("Error :"+ error);
				return;
			}
		});
	};
	


	


	

// whatItsay function =================================================================================================
	function whatItsay() {
		fs.readFile("random.txt", "utf8", function(error, data){
			if (!error) {
				whatItsayResults = data.split(",");
				spotifyThis(whatItsayResults[0], whatItsayResults[1]);
			} else {
				console.log("Error occurred" + error);
			}
		});
	};
	


	function log(logResults) {
	  fs.appendFile("log.txt", logResults, (error) => {
	    if(error) {
	      throw error;
	    }
	  });
	}

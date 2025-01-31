require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

app.get("/", (req, res, next) => res.render("index.hbs"))


app.get("/artist-search", (req, res, next) => {
    let myArtist = req.query.artist
    spotifyApi
    .searchArtists(myArtist)
    .then(data => {
      console.log('The received data from the API: ', data.body.artists.items[0].images);
      let myArtistsArray = data.body.artists.items
      res.render("artists-search-results", {myArtistsArray})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
    })


 app.get("/albums/:artistId", (req, res, next) => {
    console.log(req.params)
    let myArtistId = req.params.artistId
    spotifyApi.getArtistAlbums(myArtistId)
    .then (
        function(data) {
          console.log('Artist albums', data.body.items);
          let myAlbumsArray = data.body.items
          res.render("albums", {myAlbumsArray})
        },
        function(err) {
          console.error(err);
        }
      );
 });


 app.get("/tracks/:albumId", (req, res, next) => {
    console.log(req.params)
    let myAlbumId = req.params.albumId
    spotifyApi.getAlbumTracks(myAlbumId)
  .then(function(data) {
    console.log(data.body);
    let myTracksArray = data.body.items
    res.render("tracks", {myTracksArray})
  }, function(err) {
    console.log('Something went wrong!', err);
  });
  
 });
 
  
'use strict'

var express = require('express');
var ArtistController = require('../controllers/artist');
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/artists' });

var api = express.Router();

api.get('/getArtist/:id', md_auth.ensureAuth, ArtistController.getArtist);
api.post('/saveArtist', md_auth.ensureAuth, ArtistController.saveArtist);
api.get('/getArtists/:page?', md_auth.ensureAuth, ArtistController.getArtists);
api.put('/updateArtist/:id', md_auth.ensureAuth, ArtistController.updateArtist);
api.delete('/deleteArtist/:id', md_auth.ensureAuth, ArtistController.deleteArtist);

api.post('/upload-image-artist/:id',  [md_auth.ensureAuth, md_upload], ArtistController.uploadImage);
api.get('/get-image-artist/:imageFile', ArtistController.getImageFile);

module.exports = api;
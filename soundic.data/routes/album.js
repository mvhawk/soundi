'use strict'

var express = require('express');
var AlbumController = require('../controllers/album');
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/albums' });

var api = express.Router();

api.get('/getAlbum/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.post('/saveAlbum', md_auth.ensureAuth, AlbumController.saveAlbum);
api.get('/getAlbums/:artist?', md_auth.ensureAuth, AlbumController.getAlbums);
api.put('/updateAlbum/:id', md_auth.ensureAuth, AlbumController.updateAlbum);
api.delete('/deleteAlbum/:id', md_auth.ensureAuth, AlbumController.deleteAlbum);

api.post('/upload-image-album/:id',  [md_auth.ensureAuth, md_upload], AlbumController.uploadImage);
api.get('/get-image-album/:imageFile', AlbumController.getImageFile);

module.exports = api;
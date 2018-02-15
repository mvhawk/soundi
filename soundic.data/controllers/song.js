'use strict'
var bcrypt = require('bcrypt-nodejs');
var Song = require('../models/song');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(req, res){
    var songId = req.params.id;
    
    Song.findById(songId).populate({ path: 'album'}).exec((err, song) => {
        if(err){
            res.status(500).send({ message: "Error en la petición"});
        }else{
            if(!song){
                res.status(400).send({ message: "No existe la canción"});
            }else{
                res.status(200).send({ song });
            }
        } 
    })
}

function saveSong(req, res){
    var song = new Song();
    var params = req.body;
    
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;
    
    song.save((err, songStored) => {
        if(err){
            res.status(500).send({ message: "Error al guardar la canción"});
        }else{
            if(!songStored){
                res.status(400).send({ message: "La canción no ha sido guardada"});
            }else{
                res.status(200).send({ song: songStored});
            }
        } 
    });
}

function getSongs(req, res){
    var albumId = req.params.album;
    
    if(!albumId){
        var find = Song.find({}).sort('number');
    }else{
        var find = Song.find({album: albumId}).sort('number');
    }
    
    find.populate({
        path: 'album',
        populate: {
            path: 'artist',
            model: 'Artist'
        }
    }).exec(function (err, songs) {
        if(err){
            res.status(500).send({ message: "Error en la petición"});
        }else{
            if(!songs){
                res.status(400).send({ message: "No existen canciones"});
            }else{
                res.status(200).send({ songs });
            }
        } 
    });
}

function updateSong(req, res){
    var songId = req.params.id;
    var update = req.body;
    
    Song.findByIdAndUpdate(songId, update, (err, songUpdated) => {
        if(err){
            res.status(500).send({ message: "Error en la petición"});
        }else{
            if(!songUpdated){
                res.status(404).send({ message: "No se pudo actualizar la canción"});
            }else{
                res.status(200).send({ song: songUpdated });
            }
        } 
    })
}

function deleteSong(req, res){
    var songId = req.params.id;
    
    Song.findByIdAndRemove(songId, (err, songRemoved) => {
        if(err){
            res.status(500).send({ message: 'Error al eliminar la canción' });
        }else{
            if(!songRemoved){
                res.status(404).send({ message: 'No se pudo eliminar la canción' });
            }else{
                res.status(200).send({ album: songRemoved });
            }
        }
    });
}

function uploadFile(req, res){
    var songId = req.params.id;
    var file_name = 'No subido...';
    
    if(req.files){
        
        var file_path = req.files.file.path;
        var file_name = file_path.split('\\').pop().split('/').pop();
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        
        if(file_ext == 'mp3' || file_ext == 'ogg'){
            Song.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdated) => {
                if(err){
                    res.status(500).send({ message: 'Error al actualizar la canción' });
                }else{
                    if(!songUpdated){
                        res.status(404).send({ message: 'No se pudo actualizar la canción' });
                    }else{
                        res.status(200).send({ song: songUpdated });
                    }
                }
            });
        }else{
            res.status(200).send({ message: 'Extensión del fichero de audio no valida...' });
        }
    }else{
        res.status(200).send({ message: 'No has subido ningun fichero de audio...' });
    }
}

function getSongFile(req, res){
    var imageFile = req.params.songFile;
    var path_file ='./uploads/songs/' + imageFile;
    fs.exists(path_file, function(exists){
       if(exists) {
            res.sendFile(path.resolve(path_file));
       }else{
            res.status(200).send({ message: 'No existe el fichero de audio...' });
       }
    });
}

module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile
}
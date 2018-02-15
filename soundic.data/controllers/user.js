'use strict'
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');

function pruebas(req, res){
    res.status(200).send({
        message: 'Probando controlador de user del api en node y express'
    })
}

function saveUser(req, res){
    var user = new User();
    var params = req.body;
    console.log(params);
    
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLER_USER';
    user.image = 'null';
    
    if(params.password){
        bcrypt.hash(params.password, null, null, function(err, hash){
            user.password = hash;
            console.log(user.password);

            if(user.name != null && user.surname != null && user.email != null){
                console.log("save");
                user.save((err, userStored) =>{
                    if(err){
                        res.status(500).send({ message: 'Error al guardar usuario' });
                    }else{
                        if(!userStored){
                            res.status(404).send({ message: 'No se ha podido guardar el usuario' });    
                        }else{
                            res.status(200).send({ user: userStored });    
                        }
                    }
                })
            }else{
                res.status(200).send({ message: 'Debe llenar todos los campos' });
            }
        })
    }else{
        res.status(200).send({ message: 'Ingrese contraseña' });
    }
}

function loginUser(req, res){
    var params = req.body;
    var email = params.email.toLowerCase();
    var password = params.password;
    
    User.findOne({email: email}, (err, user) => {
        if(err){
            res.status(500).send({ message: 'Error en la petición' });
        }else{
            if(!user){
                res.status(404).send({ message: 'El usuario no existe' });
            }else{
                bcrypt.compare(password, user.password, function(err, check){
                    if(check){
                        if(params.gethash){
                            res.status(200).send({ 
                                token: jwt.createToken(user)
                            });
                        }else{
                            res.status(200).send({ user });
                        }
                    }else{
                        res.status(404).send({ message: 'No puede loguaerse' });
                    }
                });
            }
        }
    });
}

function updateUser(req, res){
    var userId = req.params.id;
    var update = req.body;
    
    if(userId != req.user.sub){
        return res.status(500).send({ message: 'Sin permiso para la acción' });
    }
    
    User.findByIdAndUpdate(userId, update, (err, userUpdate) => {
        if(err){
            res.status(500).send({ message: 'Error al actualizar el usuario' });
        }else{
            if(!userUpdate){
                res.status(404).send({ message: 'No se pudo actualizar el usuario' });
            }else{
                res.status(200).send({ user: userUpdate });
            }
        }
    });
}

function uploadImage(req, res){
    var userId = req.params.id;
    var file_name = 'No subido...';
    
    if(req.files){

        var file_path = req.files.image.path;
        var file_name = file_path.split('\\').pop().split('/').pop();
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
            User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdate) => {
                if(err){
                    res.status(500).send({ message: 'Error al actualizar el usuario' });
                }else{
                    if(!userUpdate){
                        res.status(404).send({ message: 'No se pudo actualizar el usuario' });
                    }else{
                        res.status(200).send({ image: file_name, user: userUpdate });
                    }
                }
            });
        }else{
            res.status(200).send({ message: 'Extensión de la imagen no valida...' });
        }
    }else{
        res.status(200).send({ message: 'No has subido ninguna imagen...' });
    }
}

function getImageFile(req, res){
    var imageFile = req.params.imageFile;
    var path_file ='./uploads/users/' + imageFile;
    console.log(path_file);
    fs.exists(path_file, function(exists){
       if(exists) {
            res.sendFile(path.resolve(path_file));
       }else{
            res.status(200).send({ message: 'No existe la imagen...' });
       }
    });
}

module.exports = {
    pruebas, saveUser, loginUser, updateUser, uploadImage, getImageFile
}
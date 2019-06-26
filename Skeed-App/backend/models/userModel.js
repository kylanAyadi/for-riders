/**
 * File name : userMondel.js
 Location : backend/models/userModel.js
 Author : Dracarys
 Date : 24/05/2019
 */
 
/**
 * import du module mongoose
 */
const mongoose = require('mongoose');

/**
 * création du schéma user, les champs sont :
 * 1 username obligatoire entre 3 et 15 caractères,
 * 1 email obligatoire
 * l'age du user obligatoire,
 * le sexe  du user obligatoire
 * 1 password obligatoire 
 */

var userSchema = new mongoose.Schema({

    username: { type: String, required: true, minlength : 3, maxlength : 15, unique: true },
    email: { type: String, match : /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/ , required: true, unique: true},
    age : {type : Number, required : true, min : 1, max : 99},
    sex : {type : String, required : true},
    password: { type: String, required: true,  minlength : 4},
    avatar : {type : String}
})

/**
 * création de la collection 
 */
var User = mongoose.model('User', userSchema);

/**
 * exportation du module
 */
module.exports = User;
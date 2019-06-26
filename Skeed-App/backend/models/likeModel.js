/**
 * File name : likeModel.js
 Location : backend/models/likeModel.js
 Author : Dracarys
 Date : 05/06/2019
 */
 
/**
 * import du module mongoose
 */
const mongoose = require('mongoose');

/**
 * création du schéma like, les champs sont :
 * 1 nom de spot,
 * le nom de l'utilisateur qui a like
 * ou son nom si il a unlike
 */

var likeSchema = new mongoose.Schema({

    spotTitle: { type: String, required: true},
    username_like: { type: String, required: true},
    username_unlike: { type: String, required: true},
})

/**
 * création de la collection 
 */
var Likes = mongoose.model('Likes', likeSchema);

/**
 * exportation du module
 */
module.exports = Likes;
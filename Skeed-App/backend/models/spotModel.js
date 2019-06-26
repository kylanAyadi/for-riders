/**
 * File name : spotModel.js
 Location : backend/models/spotModel.js
 Author : Dracarys
 Date : 31/05/2019
 */
 
/**
 * import du module mongoose
 */
const mongoose = require('mongoose');

/**
 * création du schéma spot, les champs sont :
 * 1 username,
 * les coordonnées de position
 * 1 titre
 * 1 description
 */

var spotSchema = new mongoose.Schema({

    username: { type: String, required: true},
    spotLocation: { type: String, required: true, unique: true},
    title : {type : String, required : true, minlength : 2},
    description: { type: String, required: true,  minlength : 4},
    level : {type : Number}
})

/**
 * création de la collection 
 */
var Spot = mongoose.model('Spot', spotSchema);

/**
 * exportation du module
 */
module.exports = Spot;
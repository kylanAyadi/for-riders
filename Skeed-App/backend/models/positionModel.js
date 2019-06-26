/**
 * File name : positionModel.js
 Location : backend/models/positionModel.js
 Author : Dracarys
 Date : 04/06/2019
 */
 
/**
 * import du module mongoose
 */
const mongoose = require('mongoose');

/**
 * création du schéma position, les champs sont :
 * 1 username,
 * les coordonnées de position
 */

var positionSchema = new mongoose.Schema({

    username: { type: String, required: true, unique : true},
    spotLocation: { type: String, required: true},
})

/**
 * création de la collection 
 */
var Position = mongoose.model('Position', positionSchema);

/**
 * exportation du module
 */
module.exports = Position;
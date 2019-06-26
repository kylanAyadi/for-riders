/**
 *Fichier : server.js
 *Localisation : Skeed-App/backend
 *Author : Dracarys
 *Date : 24/05/2019
*/

/** 
 * Titre : Création de constante
 * Description : Chaque module installé est affecté à une variable, qui peut être utilisé ensuite
*/
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const url = 'mongodb://localhost:27042/skeed';
const nconf = require('nconf');
nconf.file('./config.json');
hostname = nconf.get('database:hostname');
port = nconf.get('database:port');
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const Skeed = express.Router();
const nodemailer = require('nodemailer');
const fs = require('fs');
const multer = require('multer')
const generator = require('generate-password');

/**
 * Description : Ces variables permettent de recupérer les models nécéssaire à l'insertion de données dans la base de donné "skeed"
 */
let User = require('./models/userModel');
let Spot = require('./models/spotModel');
let Position = require('./models/positionModel');
let Likes = require('./models/likeModel');

/**
 * Titre : Utlisation de module par Express
 * Description : 
 */
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('avatars'));
process.env.SECRET_KEY = 'secret';

const upload = multer({dest : 'avatars/'})

/**
 * Titre : Connexion base de donnée
 * Description : Etablissement de la connexion entre Express et Mongodb via mongoose.
 * Cette connexion est effectué automatiquement lorsque le server Express est lancé
 */
mongoose.connect(url,{useNewUrlParser : true});
const connection = mongoose.connection;

connection.once('open', function(){
   console.log("MongoDb database connection established successfully");
})

/**
 * Titre : Etablissement des routes
 * Description : Chaque fonction est une route de connexion entre React-native et Express.
 * Ces routes déterminent des actions à effectuer de PUT, POST, GET ou DELETE dans la base de donnée.
 */
Skeed.route('/register').post(function(req, res) {
    let user = new User(req.body);
    user.password = bcrypt.hashSync(user.password, 10);
    user.save()
        .then(user => {
            res.status(200).json({ msg : 'user added successfully'})
        })
        .catch(error => {
            res.status(400).json({ msg : 'user not added'})
        })
})
Skeed.route('/login').post(function(req, res) {
    User.findOne({username : req.body.username}, function(err, user){
        if(!user){
            res.status(400).json({ msg : 'Login not exist'});
        }else{
            if(bcrypt.compareSync(req.body.password, user.password)){
                const payload = {
                    id : user.id,
                    username : user.username,
                    email : user.email,
                    age : user.age,
                    sex : user.sex
                }
                let token = jwt.sign(payload, process.env.SECRET_KEY,{
                    expiresIn: 1440
                })
                res.status(200).send(token);
            }else{
                res.status(400).json({ msg : 'Password is incorrect.'})
            }
        }
    })
})
Skeed.route('/users').get(function(req, res) {
    User.find(function(err, user){
        if(!user){
            res.status(400).json({ msg : 'User not find'});
        }else{
           res.status(200).json(user);
        }
    })
})
Skeed.route('/user/:username').get(function(req, res) {
    User.findOne({username : req.params.username}, function(err, user){
        if(!user){
            res.status(400).json({ msg : 'User not find'});
        }else{
           res.status(200).json(user);
        }
    })
})
Skeed.route('/forgot').post(function(req, res) {
    console.log(req.body);
    User.findOne({email : req.body.email}, function(err, user){
        if(!user){
            res.status(400).json({ msg : 'Email does not exist'});
        }
        else{
            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false, 
                auth: {
                    user: 'maureen.bergstrom@ethereal.email',
                    pass: 'kbu2GfBMrQsPjKBAUm'
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            var newPassword = generator.generate({
                length: 6,
                numbers: true
            });
            user.password = bcrypt.hashSync(newPassword, 10);
            user.save();

            const output = 
            `This is your new password: ${newPassword}. For security matter, please do not forget to update it. Have a good ride with Skeed!`;

            // send mail with defined transport object
            let mailOptions = {
                from: '"Skeed" <maureen.bergstrom@ethereal.email>', // sender address
                to: user.email, // list of receivers
                subject: "SkeedApp - recovery password", // Subject line
                html: output // body
            };
        
            transporter.sendMail(mailOptions, (error, info) => {
                if(error) {
                    return console.log(error);
                }
                console.log("Message sent: %s", info.messageId);
                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        
                // Preview only available when sending through an Ethereal account
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            })
            res.status(200).json(user);
        }        
    })
})

Skeed.route('/updateUser/:username').put(upload.single('avatar'),function (req, res) {
    User.findOne({username : req.params.username}, function(err, profile){
        if(!profile){
            res.status(404).send('data is not found');
            return;
        } 
        else {
            profile.username = req.body.username;
            profile.email = req.body.email;
            profile.age = req.body.age;
            profile.sex = req.body.sex;
            if(profile.password != req.body.password){
                profile.password = bcrypt.hashSync(req.body.password, 10);
            }
            if(req.file != undefined){
                if(profile.avatar != '' && profile.avatar != req.file.filename){
                    fs.unlinkSync('avatars/'+profile.avatar)
                }
                profile.avatar = req.file.filename
            }else{
                if(profile.avatar != req.body.avatar){
                    profile.avatar = req.body.avatar;
                }
            }
            
            profile.save().then(profile => {
                const payload = {
                    id : profile.id,
                    username : req.body.username,
                    email : req.body.email,
                    age : req.body.age,
                    sex : req.body.sex 
                }
                let token = jwt.sign(payload, process.env.SECRET_KEY,{
                    expiresIn: 1440
                })
                res.status(200).send(token);
            })
        }
    })
})
Skeed.route('/deleteUser/:id').delete(function(req, res){
    User.findByIdAndDelete({_id: req.params.id}).exec(function(err){
        if(err){
            res.status(404).send('data is not found');
        }else{
            res.status(200).json({'user': 'deleted successfully'});
        }
    });
})
Skeed.route('/addSpot').post(function(req, res) {
    let spot = new Spot(req.body);
    spot.save()
        .then(spot => {
            res.status(200).json({ msg : 'spot added successfully'})
        })
        .catch(error => {
            res.status(400).json({ msg : 'spot not added'})
        })
})
Skeed.route('/sharePosition').post(function(req, res) {
    let position = new Position(req.body);
    position.save()
        .then(spot => {
            res.status(200).json({ msg : 'position added successfully'})
        })
        .catch(error => {
            res.status(400).json({ msg : 'position not added'})
        })
})
Skeed.route('/markers').get(function(req, res) {
    Spot.find(function(err, user){
        if(!user){
            res.status(400).json({ msg : 'Spot not find'});
        }else{
           res.status(200).json(user);
        }
    })
})
Skeed.route('/usersMarkers/:username').get(function(req, res) {
    Position.find({username : {$ne : req.params.username}},function(err, user){
        if(!user){
            res.status(400).json({ msg : 'User not find'});
        }else{
           res.status(200).json(user);
        }
    })
})
Skeed.route('/likeSpot').post(function(req, res) {
    let like = new Likes(req.body);
    like.save()
        .then(like => {
            res.status(200).json({ msg : 'like added successfully'})
        })
        .catch(error => {
            res.status(400).json({ msg : 'like not added'})
        })
})
Skeed.route('/unLikeSpot').post(function(req, res) {
    let like = new Likes(req.body);
    like.save()
        .then(like => {
            res.status(200).json({ msg : 'unlike added successfully'})
        })
        .catch(error => {
            res.status(400).json({ msg : 'unlike not added'})
        })
})
Skeed.route('/usersLike/:username/:title').get(function(req, res) {
    Likes.findOne({username_like : req.params.username, spotTitle : req.params.title}, function(err, user){
        if(!user){
            res.status(400).json({ msg : 'User not find'});
        }else{
           res.status(200).json(user);
        }
    })
}) 
Skeed.route('/usersUnLike/:username/:title').get(function(req, res) {
    Likes.findOne({username_unlike : req.params.username, spotTitle : req.params.title}, function(err, user){
        if(!user){
            res.status(400).json({ msg : 'User not find'});
        }else{
           res.status(200).json(user);
        }
    })
}) 
Skeed.route('/deleteLike/:id').delete(function(req, res){
    Likes.findByIdAndDelete({_id: req.params.id}).exec(function(err){
        if(err){
            res.status(404).send('data is not found');
        }else{
            res.status(200).json({'likes': 'deleted successfully'});
        }
    });
})
Skeed.route('/thumbsup/:title').get(function(req, res) {
    Likes.find({spotTitle : req.params.title, username_unlike : 'none'},function(err, user){
        if(!user){
            res.status(400).json({ msg : 'Spot not find'});
        }else{
           res.status(200).json(user);
        }
    })
})
Skeed.route('/thumbsdown/:title').get(function(req, res) {
    Likes.find({spotTitle : req.params.title, username_like : 'none'},function(err, user){
        if(!user){
            res.status(400).json({ msg : 'Spot not find'});
        }else{
           res.status(200).json(user);
        }
    })
})

/**
 * Titre : Affection de la route à une variable qui est : Skeed
 */
app.use('/skeedApp', Skeed);
/**
 * Titre : Lancement du server Express avec message d'établissement de connexion
 */
app.listen(port, hostname, () => {
    console.log('Server is running on http://'+hostname+':'+ port)
});

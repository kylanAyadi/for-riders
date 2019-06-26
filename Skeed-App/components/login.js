/*
File name : login.js
Localisation: Skeed-App/components/login.js,
Fonction : Compoment to allow the user to login 
Author : Dracarys
Date : 24/05/2019
*/

import React from 'react';
import { Facebook } from 'expo';
import{ StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage, Image, ScrollView } from 'react-native';
import { API_URL } from '../config/configfront';
const jwt = require("jwt-decode");
const skeed_id = "309784356615176";


//Class : Login -> permet à l'utilisateur de se connecter avec son compte 
export default class Login extends React.Component { 

    //Bar de navigation avec Login comme titre
    static navigationOptions ={
        title:'Login'
    }

    constructor(props){
        super (props);
        this.state={
            users : []
        }
        
        /**
         *  Title : Variable
         *  Description: Initialisation des variables à vide : user_name, user_password
         */
       
        this.user_name = "";
        this.user_password = "";
    }
    componentDidMount(){
        fetch(`${API_URL}/skeedApp/users`, {
            method: 'GET',
            mode : 'cors',
            credentials : 'same-origin',
            headers: {
                'Content-type': 'application/json',
            }
        })
        .then((response)=> {
                //console.log(JSON.parse(response._bodyInit))
                this.setState({users : JSON.parse(response._bodyInit)})
        })
        .catch((err)=>{
            console.log(err)
            alert("Error : Network request failed!")
        }) 
    }

    /**
     * Description: Initialisation de la variable this.user_name avec la variable username
     */

    _TextInputUser(username){
        this.user_name = username;
    } 

     /**
      * Description: Initialisation de la variable this.user_password avec la variable password
      */

    _TextInputPassword(password){
        this.user_password = password;
    }

    /**
     * Description: Gestion des champs récupérés et envoi des données vers le backend 
     */

    login(){
   
        /**
         * Description : Initialisation de l'objet user avec les variables user_name, user_password
         */
        const user ={
            username : this.user_name,
            password : this.user_password
        }

        /**
         * Title: Condition IF
         * Description : Vérification si les champs sont vides
         * si condition vrai alors on entre dans le if et déclenchement d'une alert "must not be empty".
         * si condition fausse appel de la fonction fetch
         */
        if(this.user_name === '' || this.user_password === ''){
            alert("Username or Password must not to be empty")
        }else{
            
           /**
            * Title: fonction fetch 
            * Description : Envoi de l'objet "usert" via une URL dans le backend
            * Si la réponse est positive , création d'une session 
            * Sinon  en cas d'erreur 404 :lancement alert "network request failed"
            * Sinon  en cas d'erreur 400 : lancement alert "Incorrect username or password"
            */
            fetch(`${API_URL}/skeedApp/login`, {
                method: 'POST',
                mode : 'cors',
                credentials : 'same-origin',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(user)
            })
            .then((res)=> {
                if(res.status === 200){
                    AsyncStorage.multiSet([['id',jwt(res._bodyInit).id],['username',jwt(res._bodyInit).username],['email', jwt(res._bodyInit).email],['age', JSON.stringify(jwt(res._bodyInit).age)],['sex', jwt(res._bodyInit).sex]]);
                    alert("Welcome in your SkeedApp "+jwt(res._bodyInit).username)
                    this.props.navigation.navigate("HomeIn");
                }
                else{
                    alert("Incorrect username or password")
                }
            })
            .catch((err)=>{
                console.log(err)
                alert("not login because : Network request failed")
            })
        }
    }

     /**
      * Description : Récupération du token et appel API pour récupération des champs USER
      */    
    callGraph = async token => {
        const response = await fetch(
          `https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,about,picture`
        );
        // const responseJSON = JSON.stringify(await response.json());
        // console.log('response', responseJSON);
            const userInfo = await response.json();
            AsyncStorage.multiSet([['id',userInfo.id],['username',userInfo.name],['email', userInfo.email],['age','18'],['sex','NS']]);

            const user = {
                username : userInfo.name,
                email : userInfo.email,
                age : 18,
                sex : 'NS',
                password : '0000',
                avatar : userInfo.picture.data.url
              }
            var boolConf = false;
            this.state.users.forEach((currentUser) =>{
                if(currentUser.username === userInfo.name){
                    boolConf = true;
                }
            })
            if(boolConf===false){
                fetch(`${API_URL}/skeedApp/register`,{
                method : 'POST',
                mode : 'cors',
                credentials : 'same-origin',
                headers :{
                    'Content-Type': 'application/json'},
                    body :JSON.stringify(user)})
                .then((res) => {
                    console.log(res)
                }).catch((err) => {
                console.log("error: ",err)
                })
            }
      };

    /**
     * Description : demande permission de connexion via facebook
     * Une fois l'autorisation obtenue l'appel API est lancé pour récupération des données
     */  
    facebook_auth = async() => {
        try{
        const {
            type,
            token,
          } = await Facebook.logInWithReadPermissionsAsync(skeed_id, {
            permissions: ['public_profile', 'email'],
          });
      
          if (type === 'success') {
            this.callGraph(token);
            alert("Welcome in your SkeedApp")
            this.props.navigation.navigate("HomeIn");
          }else {
            type === 'cancel'
            alert("login not ok")
          }
        }
        catch ({message}) {
            alert ('Facebook Login Error: ${message}');
        }
        };

    



    /**
     * Title : Rendu visuel
     * Description : Vue composée d'une barre de navigation , d'un logo, de boutons et de champs de saisi
     * En en-tête : logo Skeed
     * Boutton : connexion FB pas effectif
     * Champs de saisi pour nom et mot de passe
     * Boutton "submit" : pour s'inscrir
     * Link "forget password?" : pour régénérer un nouveau mdp en cas d'oublli n'est pas effectif
     */
    render() {
        return (
            <ScrollView>
            <View style={styles.maincontainer}>
                <View style={styles.entete}>
                    <Image
                        source={require('../assets/SkeedLogo.png')}
                        style={{width : 50, height : 50}}
                        />
                    <Text style={styles.titleLogo}>skeed</Text>
                </View>
                <TouchableOpacity onPress={() => this.facebook_auth()}>
                    <Text style ={styles.fb}>CONNECT WITH FACEBOOK</Text>
                </TouchableOpacity>
                <Text style={styles.Textor}>or</Text>
                <View style={styles.container}>
                    <TextInput style={styles.textinput} placeholder='Username' onChangeText={(username) => this._TextInputUser(username)}/>
                    <TextInput style={styles.textinput} placeholder='Password' secureTextEntry={true} onChangeText={(password) => this._TextInputPassword(password)}/>
                </View>
                    <TouchableOpacity onPress={() => this.login()}>
                        <Text style={styles.btnText}>Login</Text>
                    </TouchableOpacity>
                <View style={styles.container}>
                   <Text style={styles.TextStyle} onPress={()=>this.props.navigation.navigate("ForgotPassword")}>Forgot Password ?</Text>
                </View>
            </View>
            </ScrollView>
        );
    }  
}
/**
 * Title : Style CSS
 * Definition : Mise en place des styles
 */
const styles = StyleSheet.create({
    maincontainer:{
        justifyContent :'center',
        alignItems: 'center'
    },
    container:{
        justifyContent :'center',
        alignItems: 'center'
    },
    entete :{
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'center',
        marginBottom : '9%'
    },
    titleLogo:{
        fontSize : 70,
        fontFamily : 'Cutefont',
        position : 'relative',
        bottom : '2%',
        
    },

    fb:{
        color:'#ffffff',
        fontSize:17,
        backgroundColor:'#4267b2',
        width: 300,
        borderColor: '#5d5185',
        borderRadius: 2,
        paddingTop : '2%',
        overflow: 'hidden',
        fontFamily : 'RobotoBold',
        textAlign :'center',
        height: 35,
        marginBottom: '4%'
    },
    Textor:{
        fontSize:35,
        fontFamily : 'RobotoBold',
        marginBottom:'4%'
    },
    textinput: { 
        alignSelf: 'stretch',
        padding: 20,
        marginBottom:'3%',
        width: 300,
        fontSize:18,
        borderWidth: 0.5,
        borderRadius: 2,
        borderColor: '#c62339'
    },
    btnText: {
        color:'#ffffff',     
        fontSize:25,
        fontFamily : 'RobotoBold',
        width : 250,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: '#5d5185',
        backgroundColor:'#c62339',
        overflow: 'hidden',
        textAlign :'center',
        marginBottom:'35%'
    },
    TextStyle: {
        color: '#E91E63',
        textDecorationLine: 'underline'
      }
  })
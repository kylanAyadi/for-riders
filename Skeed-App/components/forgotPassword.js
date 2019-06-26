/**
 * FILE REGISTER
 * Localisation: skeedApp/codac-pff/components/forgotPassword.js
 * Function: Component to allow the user to recover your password.
 * Author: Dracarys.
 * Date: 06/06/2019.  
 */

/**
 * Import pour ramener les fichiers et les modules utilisés dans "forgotPassword.js".
 */
import React from 'react';
import{ StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage, Image, ScrollView } from 'react-native';
import { API_URL } from '../config/configfront';

export default class ForgotPassword extends React.Component { 

    //Bar de navigation avec Recover your password comme titre
    static navigationOptions ={
        title:'Recover your password'
    }

    constructor(props){
        super (props);
        
        /**
         *  Title : Variable
         *  Description: Initialisation des variables à vide : user.email
         */
       
        this.user_email = "";
    }

    _TextInputUser(email){
        this.user_email = email;
    }

    recover(){
        /**
         * Title : Objet user
         * Description : Initialisation de l'objet user avec les variables user_email
         */
        const user ={
            email : this.user_email
        }

    /**
     * Title: Condition IF
     * Description : Vérification si les champs sont vides
     * si condition vraie alors on entre dans le if et déclenchement d'une alert "must not be empty".
     * si condition fausse appel de la fonction fetch
     */
    if(this.user_email === ''){
        alert("Email must not to be empty")
    }else{
        
        /**
        * Title: fonction fetch 
        * Description : Envoi de l'objet "user" via une URL dans le backend
        * Si la réponse est positive, on envoie un mail à l'user avec son nouveau mot de passe 
        * Sinon  en cas d'erreur 404 :lancement alert "network request failed"
        * Sinon  en cas d'erreur 400 : lancement alert "Recovery email not sent"
        */
        fetch(`${API_URL}/skeedApp/forgot`, {
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
                this.props.navigation.navigate("Login");
                alert("Recovery email sent");
            }
            else{
                alert("Email not found")
            }
        })
        .catch((err)=>{
            console.log(err)
            alert("Recovery email not sent")
        })
    }
    }


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
            <View style={styles.container}>
                <TextInput style={styles.textinput} placeholder='Your email' onChangeText={(email) => this._TextInputUser(email)}/>
            </View>
                <TouchableOpacity onPress={() => this.recover()}>
                    <Text style={styles.btnText}>Resend password</Text>
                </TouchableOpacity>
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
    bottom : '0%',
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
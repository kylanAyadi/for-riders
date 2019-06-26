/**
 * FILE REGISTER
 * Localisation: skeedApp/codac-pff/components/register.js
 * Function: Component to allow the user to register.
 * Author: Dracarys.
 * Date: 24/05/2019.  
 */

/**
 * Import pour ramenner les fichiers et les modules utilisés dans "register.js".
 */
import React from 'react'
import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity, Image, ScrollView } from 'react-native';
import { API_URL } from '../config/configfront';
import SelectInput from 'react-native-select-input-ios';

/**
 * Class qui va permettre à l'utilisateur de créer un compte.
 */
export default class Register extends React.Component {

  /**
   * Barre de navigation qui permet de faire un retour en arrière et d'afficher le titre de la page.
   */
  static navigationOptions = {
    title : 'Register'
  }

  constructor(props) {
    super(props);

    /**
     * Initialisation des différentes variables.
     */
    this.state={
      sex : 'male'
    }
    
      this.usernameText = '';
      this.emailText = '';
      this.ageText = '';
      this.passwordText = '';
      this.password_confirmText = '';
  }

  /**
   * Description: Initialisation de la valeur de l'input "sex" à value. 
   */
  onSubmitEditingSmall1(value) {
  this.setState({sex:value})
  }

  /**
   * Description: Défini les options possible dans l'input "sex".
   */
  getPickerOptions() {
    return [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
    ]
  }

  /**
   * Description: Initialisation de la valeur de l'input "Username" à username.
   */
  _textInputUsername(username){
    this.usernameText = username;
  }

  /**
   * Description: Initialisation de la valeur de l'input "Email" à email.
   */
  _textInputEmail(email){
          this.emailText = email;
  } 

  /**
   * Description: Initialisation de la valeur de l'input "âge" à âge.
   */
  _textInputAge(age){
    this.ageText = age;
  }

  /**
   * Description: Initialisation de la valeur de l'input "Password" à password.
   */
  _textInputPassword(password){
    this.passwordText = password;
  }

  /**
   * Description: Initialisation de la valeur de l'input "Password Confirm" à password confirm.
   */
  _textInputPassword_confirm(password_confirm){
    this.password_confirmText = password_confirm;
  }

  /**
   * Description: Fonction render qui applique la view. Logo en entête, fomulaire d'inscription, bouton submit.
   */
    render() {
        return (
          <ScrollView>
            <KeyboardAvoidingView behavior='padding' style={styles.wrapper}>
              <View style={styles.container}>
                <View style={styles.entete}>
                      <Image
                          source={require('../assets/SkeedLogo.png')}
                          style={{width : 50, height : 50}}
                      />
                      <Text style={styles.titleLogo}>skeed</Text>
                </View>
                <TextInput
                  style ={styles.textInput} placeholder = 'Username'
                  onChangeText = {(username) => this._textInputUsername(username)}
                  textContentType = 'username'

                />
                <TextInput
                  keyboardType = 'email-address'
                  style ={styles.textInput} placeholder = 'Email'
                  onChangeText = {(email) => this._textInputEmail(email)}
                  textContentType = 'emailAddress'
                />
                <View style={{flexDirection : 'row'}}>
                  <TextInput
                    style ={[styles.textInput, styles.ageText]}
                    keyboardType = 'numeric'
                    placeholder = 'Age'
                    onChangeText = {(age) => this._textInputAge(age)}
                  />
                  <View style={styles.picker}>          
                  <SelectInput
                    value={this.state.sex}
                    mode={'dropdown'}
                    options={this.getPickerOptions()}
                    onCancelEditing={() => console.log('onCancel')}
                    onSubmitEditing={this.onSubmitEditingSmall1.bind(this)}
                    style={[styles.selectInput, styles.selectInputSmall]}
                    labelStyle={styles.selectInputInner}
                    />
                  </View>
                </View>
                <TextInput
                  style ={styles.textInput} placeholder = 'Password'
                  onChangeText = {(password) => this._textInputPassword(password)}
                  secureTextEntry = {true}
                  textContentType = 'password'
                />    
                <TextInput
                  style ={styles.textInput} placeholder = 'Password Confirmation'
                  onChangeText = {(password_confirm) => this._textInputPassword_confirm(password_confirm)}
                  secureTextEntry = {true}
                  textContentType = 'password'
                />

                <TouchableOpacity
                      style={styles.btn}
                      onPress ={() => this.register()}>
                      <Text style = {styles.btntext}>submit</Text>
                </TouchableOpacity>
              </View> 
            </KeyboardAvoidingView>
          </ScrollView>
 
        );
      }

      /**
       * Fonction register pour envoyer les informations du formulaire vers le back.
       */
      register = () => {

        /**
         * Objet user, définition de ses variables.
         */
        const user = {
          username : this.usernameText,
          email : this.emailText,
          age : this.ageText,
          sex : this.state.sex,
          password : this.passwordText,
          avatar : ''
        }

        /**
         * Condition afin d'afficher un message d'erreur si l'utilisateur ne rentre rien dans les champs.
         */
        if(this.usernameText === '' || this.emailText === '' || this.ageText === '' || this.state.sex === '' || this.passwordText === ''){
        alert("You have to write something in every fields.")
         }

         /**
          * Condition afin d'afficher un message d'erreur si le mot de passe et la confirmation de mot de passe sont différents.
          */
        else if(this.passwordText !== this.password_confirmText){
            alert("Password and Password confirmation is not same.");
            this.passwordText = '';
            this.password_confirmText = '';}
        /**
         * Envoi des données vers le back. Avec quelques conditions, la première afin d'envoyer un message de succès en cas de réussite.
         * Une autre qui fait apparaitre une alerte si jamais l'enregistrement n'a pas fonctionné si jamais les informations rentrée dans les champs ne sont pas valides.
         * La dernière condition en cas de fetch qui n'aurait pas fonctionné.
         */
        else{
          fetch(`${API_URL}/skeedApp/register`,{
            method : 'POST',
            mode : 'cors',
            credentials : 'same-origin',
            headers :{
              'Content-Type': 'application/json'},
              body :JSON.stringify(user)})
          .then((res) => {
            if(res.status === 200){
              this.props.navigation.navigate("Login");
            }else{
              alert("You are not registered")
            }
          }).catch((err) => {
            console.log("error: ",err)
            alert("register is not ok because : Network request failed")
          })
      }

    }
}

/**
 * Mise en page de la vue.
 */
const styles = StyleSheet.create({
    wrapper : {
      flex :1,
    },
    container :{
      flex:1,
      alignItems :'center',
      justifyContent :'center',
      paddingLeft : 40, 
      paddingRight : 40,
    },  
    entete :{
      flexDirection : 'row',
      alignItems : 'center',
      justifyContent : 'center',
      marginBottom : '5%',
      marginTop : '4%'

  },
  titleLogo:{
      fontSize : 70,
      fontFamily : 'Cutefont',
      position : 'relative',
  },
    textInput : {
      fontSize: 20,
      borderWidth : 2,
      borderColor : '#c62339',
      alignSelf : 'stretch',
      padding: 16,
      marginBottom: 20,
    },
    picker : {
      borderWidth : 2,
      borderColor : '#c62339',
      alignSelf : 'stretch',
      padding: 16,
      marginBottom: 20,
      width : '46%',
    },
    ageText:{
      marginRight : '5%',
      width : '46%',
    },
    btn : {
      alignSelf : 'stretch',
      backgroundColor: '#c62339',
      borderWidth : 2,
      borderColor : '#5d5185',
      borderRadius : 10,
      justifyContent :'center',
      padding: 20,
      alignItems: 'center',
    },
    btntext : {
      color : 'white',
      fontSize : 20,
      fontFamily : 'RobotoBold'
    }
});

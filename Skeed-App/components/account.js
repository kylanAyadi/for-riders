 /**
 * File name : account.js
 Location : components/account.js
 Author : Dracarys
 Date : 27/05/2019
 */

import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, Platform, AsyncStorage, ScrollView, ActivityIndicator,  TextInput} from 'react-native';
import { Icon } from 'expo';
import {ConfirmDialog} from 'react-native-simple-dialogs';
import { API_URL } from '../config/configfront';
import SelectInput from 'react-native-select-input-ios';
import {ImagePicker, Permissions} from 'expo';
const jwt = require("jwt-decode");

/**
 * Class Account qui permet à l'utilisateur de modifier ses informations personnel de compte 
 */

export default class Account extends React.Component {
    
    /**
     * Entête avec titre de la page de navigation 
     */

    static navigationOptions = {
        title: "Modify Account",
    };

    /**
     * Initialisation des variables
     */
    constructor(props){
        super(props);
        this.state={
            userInfo : null,
            isLoading : true,
            dialogVisible : true,
            avatar : null,
            username : null,
            email : null,
            age : null,
            sex : null,
            password : null,
            field : '',
        }
        this.username = '';
        this.email = '';
        this.age = '';
        this.password = '';
        this.password_confirm = '';
    }
        
    
    /** 
     * Récupération de l'username de l'utilisateur connecté + récupération de ses infos dans la base de donnée
    */
    componentDidMount(){
        AsyncStorage.getItem("username", (err, res) =>  {
            if(res){
                fetch(`${API_URL}/skeedApp/user/`+res, {
                    method: 'GET',
                    mode : 'cors',
                    credentials : 'same-origin',
                    headers: {
                        'Content-type': 'application/json',
                    }
                })
                .then((response)=> {
                        this.setState({
                            userInfo : JSON.parse(response._bodyInit)
                        });
                        this.setVariables();
                })
                .catch((err)=>{
                    console.log(err)
                    alert("Error : Network request failed!")
                }) 
            }
          });
    }
    /**
     * Description: permet d'assigner aux variables du constructor leur valeur correspondante de l'utilisateur lors du chargement de la vue 
     */
    setVariables(){
        this.setState({
            avatar : this.state.userInfo.avatar,
            username : this.state.userInfo.username,
            email : this.state.userInfo.email,
            age : this.state.userInfo.age,
            sex : this.state.userInfo.sex,
            password : this.state.userInfo.password,
            isLoading : false
        })
    }
    /**
   * Description: Initialisation de la valeur de l'input "sex" à value. 
   */
    onSubmitEditingSmall1(value) {
        this.setState({sex : value})
    }
  
    /**
     * Description: Défini les options possible dans l'input "sex".
     */
    getPickerOptions() {
      return [
        { value: 'NS', label: 'NS' },
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
      ]
    }
    /**
   * Description: Initialisation de la valeur de l'input "Username" à username.
   */
    _textInputUsername(username){
        this.username = username;
    }

    /**
     * Description: Initialisation de la valeur de l'input "Email" à email.
     */
    _textInputEmail(email){
            this.email = email;
    } 

    /**
     * Description: Initialisation de la valeur de l'input "âge" à âge.
     */
    _textInputAge(age){
        this.age = age;
    }

    /**
   * Description: Initialisation de la valeur de l'input "Password" à password.
   */
  _textInputPassword(password){
    this.password = password;
  }

  /**
   * Description: Initialisation de la valeur de l'input "Password Confirm" à password confirm.
   */
  _textInputPassword_confirm(password_confirm){
    this.password_confirm = password_confirm;
  }
  /**
   * Description: askpermissionAsync est une fonction qui permet de demander à l'utilisateur l'autorisation d'accéder à son appareil photo intégré ou bien d'accéder à son dossier photo sur son téléphone 
   */
  askPermissionsAsync = async () => {
    await Permissions.askAsync(Permissions.CAMERA);
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    
    };
    /**
     * Description: handleChoosePhoto est une fonction qui permet à l'utilisateur d'accéder à son dossier photo en lui demandant l'autorisation, pour choisir une photo et stock celle ci dans la variable avatar
     */
    handleChoosePhoto = async () =>{
        await this.askPermissionsAsync();
        let option = await ImagePicker.launchImageLibraryAsync({
            allowsEditing : true,
            aspect : [4,3],
            base64 : false
        });
        if(!option.cancelled){
            this.setState({avatar : option, dialogVisible : true, field : ''})
        }
        else{
            this.setState({dialogVisible : true, field : ''})
        }
    }
    /**
     * Description: handleTakePhoto est une fonction qui permet à l'utilisateur d'accéder à son appareil photo integré en lui demandant l'autorisation, pour prendre une photo et stock celle ci dans la variable avatar
     */ 
    handleTakePhoto = async () =>{
        await this.askPermissionsAsync();
        let option = await ImagePicker.launchCameraAsync({
            allowsEditing : true,
            aspect : [4,3],
            base64 : false
        });
        if(!option.cancelled){
            this.setState({avatar : option, dialogVisible : true, field : ''})
        }
        else{
            this.setState({dialogVisible : true, field : ''})
        }
    }
    /**
     * Description: modifyField est une fonction qui permet en fonction du choix de l'utilisateur du champs qu'il veut modifier, d'avoir une boite de dialogue qui s'ouvre correspondant à son choix.
     * Ensuite il peut faire sa modification dans la boite de dialogue et il a le choix de confirmer sa modification ou bien de l'annuler.
     */
    modifyField(field){
        if(field === "username"){
            return(
            <ConfirmDialog
                title = "Username"
                visible={this.state.dialogVisible}
                onTouchOutSide={() => this.setState({dialogVisible : false})}
                positiveButton={{
                    title: "Confirm",
                    onPress : () => this.setState({username : this.username, dialogVisible : true, field : ''})
                }}
                negativeButton={{
                    title: "Cancel",
                    onPress : () => this.setState({dialogVisible : true, field : ''})
                }}
            >
                <View>
                    <TextInput
                      style ={styles.textInput} placeholder = {this.state.username}
                      onChangeText = {(username) => this._textInputUsername(username)}
                      textContentType = 'username'
                    />
                </View>
            </ConfirmDialog>
            )
        }else if(field === "email"){
            return(
                <ConfirmDialog
                    title = "Email"
                    visible={this.state.dialogVisible}
                    onTouchOutSide={() => this.setState({dialogVisible : false})}
                    positiveButton={{
                        title: "Confirm",
                        onPress : () => this.setState({email : this.email, dialogVisible : true, field : ''})
                    }}
                    negativeButton={{
                        title: "Cancel",
                        onPress : () => this.setState({dialogVisible : true, field : ''})
                    }}
                >
                    <View>
                        <TextInput
                        keyboardType = 'email-address'
                        style ={styles.textInput} placeholder = {this.state.email}
                        onChangeText = {(email) => this._textInputEmail(email)}
                        textContentType = 'emailAddress'
                        />
                    </View>
                </ConfirmDialog>
                )
        }else if(field === "age"){
            return(
                <ConfirmDialog
                    title = "Age"
                    visible={this.state.dialogVisible}

                    onTouchOutSide={() => this.setState({dialogVisible : false})}
                    positiveButton={{
                        title: "Confirm",
                        onPress : () => this.setState({age : this.age, dialogVisible : true, field : ''})
                    }}
                    negativeButton={{
                        title: "Cancel",
                        onPress : () => this.setState({dialogVisible : true, field : ''})
                    }}
                >
                    <View>
                        <TextInput
                        style ={[styles.textInput, styles.ageText]}
                        keyboardType = 'numeric'
                        placeholder = {"'"+this.state.age+"'"}
                        onChangeText = {(age) => this._textInputAge(age)}
                        />
                    </View>
                </ConfirmDialog>
                )
        }else if(field === "password"){
            return(
                <ConfirmDialog
                    title = "Password"
                    visible={this.state.dialogVisible}
                    onTouchOutSide={() => this.setState({dialogVisible : false})}
                    positiveButton={{
                        title: "Confirm",
                        onPress : () => {
                            if(this.password.length <4){
                                alert("Password must to be have minimun 4 characters")
                            }else if(this.password === this.password_confirm && this.password !== ''){
                                this.setState({password : this.password, dialogVisible : true, field : ''})
                            }else{
                                alert("Password and confirm password are not same!");
                            }
                        }
                    }}
                    negativeButton={{
                        title: "Cancel",
                        onPress : () => this.setState({dialogVisible : true, field : ''})
                    }}
                >
                    <View>
                        <View>
                            <Text>Password :</Text>
                            <TextInput
                            style ={styles.textInput} placeholder = '**********'
                            onChangeText = {(password) => this._textInputPassword(password)}
                            secureTextEntry = {true}
                            textContentType = 'password'
                            /> 
                        </View>
                        <View>
                            <Text>Password confirmation :</Text>
                            <TextInput
                            style ={styles.textInput} placeholder = '**********'
                            onChangeText = {(password_confirm) => this._textInputPassword_confirm(password_confirm)}
                            secureTextEntry = {true}
                            textContentType = 'password'
                            />
                        </View>
                    </View>
                </ConfirmDialog>
                )
        }else if(field === "avatar"){
            return(
                <ConfirmDialog
                    title = "Avatar"
                    visible={this.state.dialogVisible}
                    onTouchOutSide={() => this.setState({dialogVisible : false})}
                    positiveButton={{
                        title: "Cancel",
                        onPress : () => this.setState({dialogVisible : true, field : ''})
                    }}
                >
                    <View>
                        <View style={styles.buttonViewContainer}>
                            <TouchableOpacity onPress={() => this.handleChoosePhoto()}>
                                <Text style={styles.btnText}>Choose a photo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.handleTakePhoto()}>
                                <Text style={styles.btnText}>Take a photo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({avatar : '', dialogVisible : true, field : ''})}>
                                <Text style={styles.btnText}>Delete photo</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ConfirmDialog>
                )
        }

    }
    /**
     * _displayLoading est une fonction qui permet d'afficher sur la vue un cercle de chargement de donnée
     */
    _displayLoading(){
        if(this.state.isLoading){
            return (
                <View style ={styles.loading_container}>
                    <ActivityIndicator size='large' />
                </View>
            )
        }
    }
    /**
     * _onSubmitted est une fonction qui permet à l'utilisateur de valider ses choix de modication, et de faire les remplacements dans la base de donnée
     */
    _onSubmitted(){
        /**
         * Objet formData pour envoie de fichier, définition de ses variables.
         */
        const formData = new FormData();
        if(this.state.avatar.uri !== undefined){
            const filename = this.state.avatar.uri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename);
            let type = match ? `image/${match[1]}`:`image`;
            
            formData.append('avatar',{
                name : filename,
                type: type,
                uri : Platform.OS === "android" ? this.state.avatar.uri : this.state.avatar.uri.replace("file://","")
            });
        }else{
            formData.append('avatar', this.state.avatar);
        }
            formData.append('username', this.state.username);
            formData.append('email', this.state.email);
            formData.append('age', this.state.age);
            formData.append('sex', this.state.sex);
            formData.append('password', this.state.password);
        

          AsyncStorage.getItem("username", (err, res) =>  {
            if(res){
                fetch(`${API_URL}/skeedApp/updateUser/`+res,{
                    method : 'PUT',
                    mode : 'cors',
                    credentials : 'same-origin',
                    headers :{
                    'Content-Type': 'multipart/form-data'},
                    body : formData})
                .then((res) => {
                    if(res.status === 200){
                        AsyncStorage.multiSet([['id',jwt(res._bodyInit).id],['username',jwt(res._bodyInit).username],['email', jwt(res._bodyInit).email],['age', JSON.stringify(jwt(res._bodyInit).age)],['sex', jwt(res._bodyInit).sex]]);
                        alert("Your account is correctly modify")
                        this.props.navigation.navigate("HomeIn");
                    }else{
                    alert("Your account is not updated !")
                    }
                }).catch((err) => {
                    console.log("error: ",err)
                    alert("update is not ok because : Network request failed")
                })
            }
        })
    }
    /**
     * render permet l'affichage de la vue à l'utilisateur avec les champs modifiable et un bouton update
     */
    render(){
        const {avatar, username, email, age, sex} = this.state;
        if(this.state.isLoading){
            return(
                <ScrollView>
                    {this._displayLoading()}
                </ScrollView>
            );
        }else{
            return(
                <ScrollView>
                    <View style={styles.infoContainer}>
                        <View style={styles.entete}>
                            <Image
                                source={require('../assets/SkeedLogo.png')}
                                style={{width : 50, height : 50}}
                                />
                            <Text style={styles.titleLogo}>skeed</Text>
                        </View>
                        <TouchableOpacity
                            onPress = {() => this.setState({field : "avatar"})}
                        >
                            <Image
                                source={avatar !== '' ? avatar.uri !== undefined ? {uri : avatar.uri}: avatar.substr(0,4)==='http'? {url : avatar}:{uri : `${API_URL}/`+avatar} : sex === 'male' ? {url : 'https://store.playstation.com/store/api/chihiro/00_09_000/container/CA/en/999/UP3493-CUSA07861_00-AV00000000000123/1556681796000/image?w=240&h=240&bg_color=000000&opacity=100&_version=00_09_000'} : {url : 'https://previews.123rf.com/images/iconicbestiary/iconicbestiary1708/iconicbestiary170800013/83858464-teen-kid-girl-standing-and-holding-skateboard.jpg'}}
                                style={styles.avatar}
                                PlaceholderContent={<ActivityIndicator />}
                             />
                        </TouchableOpacity>
                        <View style={styles.indicationContainer}>
                            <Text style={styles.indicationText}>Click to change</Text>
                        </View>
                        <View style={styles.fieldInfo}>
                            <Text style={styles.span}>Username : </Text>
                            <TouchableOpacity
                                onPress = {() => this.setState({field : "username"})}
                            >
                                <Text style={styles.text}>{username.substr(0,16)}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.fieldInfo,{alignSelf : 'stretch'}]}>
                            <Text style={styles.span}>Email : </Text>
                            <TouchableOpacity
                                onPress = {() => this.setState({field : "email"})}
                            >
                                <Text style={styles.text}>{email}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.fieldInfo}>
                            <Text style={styles.span}>Age : </Text>
                            <TouchableOpacity
                                onPress = {() => this.setState({field : "age"})}
                            >
                                <Text style={styles.text}>{age}</Text>
                            </TouchableOpacity>
                        </View>
                        {sex === 'NS' ?
                            <View style={styles.sexContainer}>
                                <Text style={styles.span}>Sex : </Text>
                                {Platform.OS === 'ios' ? 
                                <SelectInput
                                value={this.state.sex}
                                mode={'dropdown'}
                                options={this.getPickerOptions()}
                                onCancelEditing={() => console.log('onCancel')}
                                onSubmitEditing={this.onSubmitEditingSmall1.bind(this)}
                                style={[styles.selectInput, styles.selectInputSmall]}
                                labelStyle={styles.selectInputInner}
                                />
                            : <View style={styles.picker}>
                                <SelectInput
                                value={this.state.sex}
                                mode={'dropdown'}
                                options={this.getPickerOptions()}
                                onCancelEditing={() => console.log('onCancel')}
                                onSubmitEditing={this.onSubmitEditingSmall1.bind(this)}
                                style={[styles.selectInput, styles.selectInputSmall]}
                                labelStyle={styles.selectInputInner}
                                />
                                </View>}
                            </View>
                        :sex === 'male' ?
                        <View style={styles.sexContainer}>
                            <Text style={styles.span}>Sex : </Text> 
                            <Icon.Ionicons 
                            name={Platform.OS === 'ios' ? 'ios-male' : 'md-male'}
                            size={30}
                            style={{color : 'blue', marginRight : '3%'}}
                            />
                            {Platform.OS === 'ios' ? 
                                <SelectInput
                                value={this.state.sex}
                                mode={'dropdown'}
                                options={this.getPickerOptions()}
                                onCancelEditing={() => console.log('onCancel')}
                                onSubmitEditing={this.onSubmitEditingSmall1.bind(this)}
                                style={[styles.selectInput, styles.selectInputSmall]}
                                labelStyle={styles.selectInputInner}
                                />
                            : <View style={styles.picker}>
                                <SelectInput
                                value={this.state.sex}
                                mode={'dropdown'}
                                options={this.getPickerOptions()}
                                onCancelEditing={() => console.log('onCancel')}
                                onSubmitEditing={this.onSubmitEditingSmall1.bind(this)}
                                style={[styles.selectInput, styles.selectInputSmall]}
                                labelStyle={styles.selectInputInner}
                                />
                                </View>}
                        </View>
                        :<View style={styles.sexContainer}>
                            <Text style={styles.span}>Sex : </Text> 
                            <Icon.Ionicons 
                            name={Platform.OS === 'ios' ? 'ios-female' : 'md-female'}
                            size={30}
                            style={{color : 'pink', marginRight : '3%'}}
                            />
                            {Platform.OS === 'ios' ? 
                                <SelectInput
                                value={this.state.sex}
                                mode={'dropdown'}
                                options={this.getPickerOptions()}
                                onCancelEditing={() => console.log('onCancel')}
                                onSubmitEditing={this.onSubmitEditingSmall1.bind(this)}
                                style={[styles.selectInput, styles.selectInputSmall]}
                                labelStyle={styles.selectInputInner}
                                />
                            : <View style={styles.picker}>
                                <SelectInput
                                value={this.state.sex}
                                mode={'dropdown'}
                                options={this.getPickerOptions()}
                                onCancelEditing={() => console.log('onCancel')}
                                onSubmitEditing={this.onSubmitEditingSmall1.bind(this)}
                                style={[styles.selectInput, styles.selectInputSmall]}
                                labelStyle={styles.selectInputInner}
                                />
                            </View>}
                        </View>}
                        <View style={[styles.fieldInfo, {marginBottom : '5%'}]}>
                            <Text style={styles.span}>Password : </Text>
                            <TouchableOpacity
                                onPress = {() => this.setState({field : "password"})}
                                style={{position : 'relative', top : '2%'}}
                                >
                                <Text style={styles.text}>**********</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            {this.state.field !== '' ? this.modifyField(this.state.field) : <View></View>}
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={() => this._onSubmitted()}>
                                <Text style={styles.btnText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            );
        }
    }
}

const styles = StyleSheet.create({
    loading_container: {
      position : 'absolute',
      left: 0,
      right: 0,
      top: 250,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    infoContainer:{
        alignItems : 'center',
        justifyContent : 'center',
    },
    entete :{
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'center',
    },
    titleLogo:{
        fontSize : 70,
        fontFamily : 'Cutefont',
        position : 'relative',
        bottom : '1%',
        
    },
    sexContainer:{
        flexDirection : 'row',
        // marginBottom : '5%',
        alignItems : 'center',
    },
    fieldInfo:{
        flexDirection : 'row',
        alignItems : 'center'
    },
    text:{
        fontSize : 20,
        fontStyle : 'italic'
    },
    span:{
        fontWeight : 'bold',
        fontSize : 30,
        fontFamily : 'RobotoBold'
    },
    avatar:{
        width : 200,
        height : 200,
        borderRadius : 200/2,
        borderColor : '#c62339',
        borderWidth : 2
    },
    buttonContainer:{
        //flexDirection : 'row',
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
        marginBottom:'3%'
    },
    buttonViewContainer:{
        alignItems : 'center',
        justifyContent : 'center'
    },
    textInput : {
        fontSize: 20,
        borderWidth : 2,
        borderColor : '#c62339',
        alignSelf : 'stretch',
        padding: 16,
        marginBottom: 20,
        backgroundColor : 'white'
    },
    indicationContainer:{

    },
    indicationText:{

    },
    picker : {
        alignSelf : 'stretch',
        width : '27%',
    },
})
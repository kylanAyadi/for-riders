/**
 * File name : profile.js
 Location : components/profile.js
 Author : Dracarys
 Date : 27/05/2019
 */
 
import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, Platform, AsyncStorage, ScrollView, ActivityIndicator} from 'react-native';
import { Icon } from 'expo';
import {ConfirmDialog} from 'react-native-simple-dialogs';
import { API_URL } from '../config/configfront';

/**
 * Class Profile  affiche le profil de l'utilisateur
 */
export default class Profile extends React.Component {
    
    /**
     * Entête avec titre de la page de navigation 
     */

    static navigationOptions = {
        title: "Profile",
    };

    /**
     * Initialisation des variables
     */
    state={
            userInfo : null,
            logout : false,
            unsub : false,
            dialogVisible : true,
            isLoading : true
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
                        //console.log(response)
                        this.setState({userInfo : JSON.parse(response._bodyInit), isLoading: false})
                })
                .catch((err)=>{
                    console.log(err)
                    alert("Error : Network request failed!")
                }) 
            }
          });
    }
    /**
     * Description: Supprime le token pour déconnecter l'utilisateur puis redirection sur Homepage
     */
    logOut(){
        return(
        <ConfirmDialog
            title = "Log Out"
            message = "Do you want to disconnect?"
            visible={this.state.dialogVisible}
            onTouchOutSide={() => this.setState({dialogVisible : false})}
            positiveButton={{
                title: "Yes",
                onPress : () => {
                    AsyncStorage.multiRemove(['id','username', 'email','age','sex']);
                    this.setState({username: null});
                    this.props.navigation.navigate("Home");
                }
            }}
            negativeButton={{
                title: "No",
                onPress : () => this.setState({dialogVisible : true, logout : false})
            }}
        />
        )
    }
    /**
     * Description: Supprime le token ainsi que le compte de l'utilisateur, puis redirection sur la Homepage 
     */
    unsubscribe(){
        return(
        <ConfirmDialog
            title = "Unsubscribe"
            message = "Do you want to unsubscribe?"
            visible={this.state.dialogVisible}
            onTouchOutSide={() => this.setState({dialogVisible : false})}
            positiveButton={{
                title: "Yes",
                onPress : () => {
                    AsyncStorage.getItem("id",(err, res) => {
                        if(res){
                            fetch(`${API_URL}/skeedApp/deleteUser/`+res, {
                                method: 'DELETE',
                                mode : 'cors',
                                credentials : 'same-origin',
                                headers: {
                                    'Content-type': 'application/json',
                                }
                            })
                            .then((response)=> {
                                console.log(response)
                                alert("Your account is correctly deleted!")
                            })
                            .catch((err)=>{
                                console.log(err)
                                alert("Error : Network request failed!")
                            }) 
                        }
                    })
                    AsyncStorage.multiRemove(['id','username', 'email','age','sex']);
                    this.setState({username: null});
                    this.props.navigation.navigate("Home");
                }
            }}
            negativeButton={{
                title: "No",
                onPress : () => this.setState({dialogVisible : true, unsub : false})
            }}
        />
        )
    }
    /**
     * Description: Affiche un icone de chargement quand la page se charge
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

    render(){
        const {userInfo} = this.state;
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
                        <View>
                            <Image
                                source={userInfo.avatar !== '' ? userInfo.avatar.substr(0,4)==='http'? {url : userInfo.avatar}:{uri : `${API_URL}/`+userInfo.avatar}: userInfo.sex === 'male' ? {url : 'https://store.playstation.com/store/api/chihiro/00_09_000/container/CA/en/999/UP3493-CUSA07861_00-AV00000000000123/1556681796000/image?w=240&h=240&bg_color=000000&opacity=100&_version=00_09_000'} : {url : 'https://previews.123rf.com/images/iconicbestiary/iconicbestiary1708/iconicbestiary170800013/83858464-teen-kid-girl-standing-and-holding-skateboard.jpg'}}
                                style={styles.avatar}
                            />
                        </View>
                        <View style={styles.fieldInfo}>
                            <Text style={styles.span}>Username : </Text>
                            <Text style={styles.text}>{userInfo.username.substr(0,16)}</Text>
                        </View>
                        <View style={[styles.fieldInfo,{alignSelf : 'stretch'}]}>
                            <Text style={styles.span}>Email : </Text>
                            <Text style={styles.text}>{userInfo.email}</Text>
                        </View>
                        <View style={styles.fieldInfo}>
                            <Text style={styles.span}>Age : </Text>
                            <Text style={styles.text}>{userInfo.age}</Text>
                        </View>
                        <View>
                            {userInfo.sex === 'NS' ?
                            <View style={styles.sexContainer}>
                                <Text style={styles.span}>Sex : </Text> 
                                <Text style={[styles.text,{position : 'relative', top : '5%'}]}>NS</Text>
                            </View>
                            : userInfo.sex === 'male' ?
                            <View style={styles.sexContainer}>
                                <Text style={styles.span}>Sex : </Text> 
                                <Icon.Ionicons 
                                name={Platform.OS === 'ios' ? 'ios-male' : 'md-male'}
                                size={30}
                                style={{color : 'blue', marginRight : '3%'}}
                                />
                                <Icon.Ionicons 
                                name={Platform.OS === 'ios' ? 'ios-man' : 'md-man'}
                                size={30}
                                style={{color : '#c62339'}}
                                />
                            </View>
                            :<View style={styles.sexContainer}>
                                <Text style={styles.span}>Sex : </Text> 
                                <Icon.Ionicons 
                                name={Platform.OS === 'ios' ? 'ios-female' : 'md-female'}
                                size={30}
                                style={{color : 'pink', marginRight : '3%'}}
                                />
                                <Icon.Ionicons 
                                name={Platform.OS === 'ios' ? 'ios-woman' : 'md-woman'}
                                size={30}
                                style={{color : '#c62339'}}
                                />
                            </View>}
                        </View>
                        <View>
                            {this.state.logout ? this.logOut() : <View></View>}
                            {this.state.unsub ? this.unsubscribe() : <View></View>}
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate("Account")}>
                                <Text style={styles.btnText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({logout : true})}>
                                <Text style={styles.btnText}>Log out</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({unsub : true})}>
                                <Text style={styles.btnText}>Unsubscribe</Text>
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
        marginBottom : '5%'
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
    fieldInfo:{
        flexDirection : 'row',
        alignItems : 'center'
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
})
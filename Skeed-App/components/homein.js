/**
 * File name : homein.js
 Location : components/homein.js
 Author : Dracarys
 Date : 24/05/2019
 */
 
import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, Platform, AsyncStorage, TextInput} from 'react-native';
import { Icon, Location} from 'expo';
import {ConfirmDialog} from 'react-native-simple-dialogs';
import { API_URL } from '../config/configfront';
import Geolocation from './geolocation';

/**
 * Class HomeIn est la page d'accueil affichée à l'utilisateur  connecté
 */
export default class HomeIn extends React.Component {
    
    /**
     * Pas de barre de navigation 
     */

    static navigationOptions = {
        header: null,
    };

    /**
     * Description: Initialisation des variables
     */
    constructor(props){
        super(props);
        this.state={
            username : null,
            logout : false,
            spot : false,
            share : false,
            dialogVisible : true,
            locationSpot : null,
            star : 0,
            markerList : [],
        };
        this.title = '';
        this.description = '';
    }

    /**
     * Description: Récupération de l'username de l'utilisateur connecté
     */
    componentDidMount(){
        AsyncStorage.getItem("username", (err, res) =>  {
            if(res){
              this.setState({username: res});   
            }
          });
        fetch(`${API_URL}/skeedApp/markers`, {
        method: 'GET',
        mode : 'cors',
        credentials : 'same-origin',
        headers: {
            'Content-type': 'application/json',
        }
        })
        .then((response)=> {
                //console.log(JSON.parse(response._bodyInit))
                this.setState({markerList : JSON.parse(response._bodyInit)})
        })
        .catch((err)=>{
            console.log(err)
        }) 
    }
    /**
     * Description: Affectation du texte saisi dans le champs title à la variable this.title
     */
    _textInputTitle(title){
        this.title = title
    }
    /**
     * Description: Affectation du texte saisi dans le champs description à la variable this.description
     */
    _textInputDescription(description){
        this.description = description
    }
    /**
     * Description: Récupération de la position de géolocalisation de l'utilisateur au moment de l'appuie sur le bouton Add Spot
     */
    saveLocation = async () =>{
        let location = await Location.getCurrentPositionAsync({});
        this.setState({locationSpot : JSON.stringify(location)});
    }
    /**
     * Description: addSpot est une fonction qui permet à l'utilisateur de marquer sa position comme étant un spot que d'autre utilisateur verront sur leur map avec un titre, une description et un niveau de difficulté
     */
    addSpot(){
        this.saveLocation();
        return(
            <ConfirmDialog
                title = "Spot"
                visible={this.state.dialogVisible}
                onTouchOutSide={() => this.setState({dialogVisible : false})}
                positiveButton={{
                    title: "Confirm",
                    onPress : () => {
                        let roundLocation = JSON.parse(this.state.locationSpot);
                        roundLocation.coords.altitude = parseFloat(roundLocation.coords.altitude.toFixed(0));
                        roundLocation.coords.latitude = parseFloat(roundLocation.coords.latitude.toFixed(3));
                        roundLocation.coords.longitude = parseFloat(roundLocation.coords.longitude.toFixed(3));
                        roundLocation.timestamp = parseFloat((roundLocation.timestamp/1000000000).toFixed(0));
                        
                        const spotLocation = {
                            username : this.state.username,
                            spotLocation : JSON.stringify(roundLocation),
                            title : this.title,
                            description : this.description,
                            level : this.state.star
                        }
                        
                        fetch(`${API_URL}/skeedApp/addSpot`,{
                            method : 'POST',
                            mode : 'cors',
                            credentials : 'same-origin',
                            headers :{
                            'Content-Type': 'application/json'},
                            body :JSON.stringify(spotLocation)})
                        .then((res) => {
                            if(res.status === 200){
                                this.setState({dialogVisible : true, spot : false, star : 0})
                                //alert("spot added")
                            }else{
                                alert("A spot already exist at this localisation!")
                            }
                        }).catch((err) => {
                            console.log("error: ",err)
                            alert("Add spot is not ok because : Network request failed")
                        })
                    }
                }}
                negativeButton={{
                    title: "Cancel",
                    onPress : () => this.setState({dialogVisible : true, spot : false, star : 0})
                }}
            >
                <View>
                    <TextInput
                      style ={styles.textInput} placeholder = 'title'
                      onChangeText = {(title) => this._textInputTitle(title)}
                      textContentType = 'name'
                    />
                    <TextInput
                      style ={styles.textInput} placeholder = 'description'
                      onChangeText = {(description) => this._textInputDescription(description)}
                      textContentType = 'addressCity'
                    />
                    <View style={styles.starContainer}>
                        <TouchableOpacity onPress={() => this.setState({star : 0})}>
                         <Text style={styles.textLevel}>Level : </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.starBtn} onPress={() => this.setState({star : 1})}>
                            {this.state.star !== 0 ? 
                            <Icon.Ionicons 
                            name={Platform.OS === 'ios' ? 'ios-star' : 'md-star'}
                            size={30}
                            style={{color : 'gold'}}
                            />
                            :<Icon.Ionicons 
                                name={Platform.OS === 'ios' ? 'ios-star-outline' : 'md-star-outline'}
                                size={30}
                                style={{color : 'black'}}
                            />}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.starBtn} onPress={() => this.setState({star : 2})}>
                            {this.state.star >= 2 ? 
                            <Icon.Ionicons 
                            name={Platform.OS === 'ios' ? 'ios-star' : 'md-star'}
                            size={30}
                            style={{color : 'gold'}}
                            />
                            :<Icon.Ionicons 
                                name={Platform.OS === 'ios' ? 'ios-star-outline' : 'md-star-outline'}
                                size={30}
                                style={{color : 'black'}}
                            />}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.starBtn} onPress={() => this.setState({star : 3})}>
                            {this.state.star >= 3 ? 
                            <Icon.Ionicons 
                            name={Platform.OS === 'ios' ? 'ios-star' : 'md-star'}
                            size={30}
                            style={{color : 'gold'}}
                            />
                            :<Icon.Ionicons 
                                name={Platform.OS === 'ios' ? 'ios-star-outline' : 'md-star-outline'}
                                size={30}
                                style={{color : 'black'}}
                            />}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.starBtn} onPress={() => this.setState({star : 4})}>
                            {this.state.star >= 4 ? 
                            <Icon.Ionicons 
                            name={Platform.OS === 'ios' ? 'ios-star' : 'md-star'}
                            size={30}
                            style={{color : 'gold'}}
                            />
                            :<Icon.Ionicons 
                                name={Platform.OS === 'ios' ? 'ios-star-outline' : 'md-star-outline'}
                                size={30}
                                style={{color : 'black'}}
                            />}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.starBtn} onPress={() => this.setState({star : 5})}>
                            {this.state.star === 5 ? 
                            <Icon.Ionicons 
                            name={Platform.OS === 'ios' ? 'ios-star' : 'md-star'}
                            size={30}
                            style={{color : 'gold'}}
                            />
                            :<Icon.Ionicons 
                                name={Platform.OS === 'ios' ? 'ios-star-outline' : 'md-star-outline'}
                                size={30}
                                style={{color : 'black'}}
                            />}
                        </TouchableOpacity> 
                    </View>
                </View>
            </ConfirmDialog>
            )
    }
    /**
     * sharePosition est une fonction qui permet à l'utilisateur de partager sa position aux autres utilisateur qui la verront sur leur map avec le nom. La position ne peut être partager que si on est à proximité d'un spot marqué
     */
    sharePosition(){
        this.saveLocation();
        return(
            <ConfirmDialog
                title = "Share"
                message = "Do you want to share your position?"
                visible={this.state.dialogVisible}
                onTouchOutSide={() => this.setState({dialogVisible : false})}
                positiveButton={{
                    title: "Yes",
                    onPress : () => {
                        let bool = false;
                        var positionActual = JSON.parse(this.state.locationSpot);
                        const longitude = positionActual.coords.longitude.toFixed(3);
                        const latitude = positionActual.coords.latitude.toFixed(4);

                        this.state.markerList.forEach((currentMarker)=>{
                            const object = JSON.parse(currentMarker.spotLocation);
                            console.log(object);

                            if((longitude >= object.coords.longitude - 0.001) || (longitude <= object.longitude + 0.001) &&(latitude >= object.latitude - 0.0002) || (latitude <= object.latitude + 0.0002)){
                                bool = true;
                            }
                        })

                        if(bool){
                            const user={
                                username : this.state.username,
                                spotLocation : this.state.locationSpot
                            }
                            fetch(`${API_URL}/skeedApp/sharePosition`,{
                                method : 'POST',
                                mode : 'cors',
                                credentials : 'same-origin',
                                headers :{
                                'Content-Type': 'application/json'},
                                body :JSON.stringify(user)})
                            .then((res) => {
                                if(res.status === 200){
                                    this.setState({dialogVisible : true, share : false})
                                    //alert("spot added")
                                }else{
                                    alert("Your position is already share !")
                                }
                            }).catch((err) => {
                                console.log("error: ",err)
                                alert("Share is not ok because : Network request failed")
                            })
                            bool = false;
                        }else{
                            alert("You are too far from a spot ");
                        }
                        this.setState({dialogVisible : true, share : false})
                    }
                }}
                negativeButton={{
                    title: "No",
                    onPress : () => this.setState({dialogVisible : true, share : false})
                }}
            />
            )
    }

    /**
     * Description: Fonction logOut qui permet à l'utilisatuer de se déconnecter en supprimant le token géréné puis est redirigé vers la Homepage
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
     * Lorsqu'on est loggué, on est dirigé sur cette page qui contient :
     * 1 map qui indique la position du user
     * 1 bouton qui ajoute la position du spot repéré
     * 1 bouton qui partage la position du user
     * 1 bouton qui redirige vers la page profil du user
     * 1 icon qui permet de se deconnecter
     */

    render(){
        return(
            <View style={styles.main_container}>
                <View style={styles.entete}>
                    <Image
                        source={require('../assets/SkeedLogo.png')}
                        style={{width : 70, height : 70}}
                    />
                    <Text style={styles.titleLogo}>skeed</Text>
                    <TouchableOpacity style={styles.logoutBtn} onPress={() => this.setState({logout : true})}>
                        <Icon.Ionicons 
                            name={Platform.OS === 'ios' ? 'ios-walk' : 'md-walk'}
                            size={30}
                            style={{color : '#c62339'}}
                        />
                    </TouchableOpacity>
                </View>
                <View>
                    {this.state.logout ? this.logOut() : <View></View>}
                    {this.state.spot ? this.addSpot() : <View></View>}
                    {this.state.share ? this.sharePosition() : <View></View>}
                </View>
                <View style={styles.WelcomeContainer}>
                    <Text style={styles.textWelcome}>{this.state.username}</Text>
                </View>
                <View style={styles.imageContainer}>
                    <Geolocation style={styles.map} showSpot={this.showSpot} getShow={this.getShow}/>
                    {/* <Image
                        source={require('../assets/fake_map.jpg')}
                        style={{width: 500, height: 300}}
                        /> */}
                </View>
                
                <View style={styles.homeButton}>
                    <TouchableOpacity style={styles.btn} onPress={()=>this.setState({spot : true})}>
                        <Text style={styles.textbtn}>Add spot</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.homeButton}>
                    <TouchableOpacity style={styles.btn} onPress={()=>this.setState({share : true})}>
                        <Text style={styles.textbtn}>Share position</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.homeButton}>
                    <TouchableOpacity style={styles.btn} onPress={()=>this.props.navigation.navigate("Profile")}>
                        <Text style={styles.textbtn}>My profile</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
/**
 * Mise en forme de la vue
 */
const styles = StyleSheet.create({
    main_container : {
        flex : 1,
        marginTop : '8%'
    },
    titleLogo:{
        fontSize : 70,
        fontFamily : 'Cutefont',
        position : 'relative',
        bottom : '0%'
    },
    entete :{
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'center',
    },
    logoutBtn:{
        position : 'relative',
        left : '60%'
    },
    imageContainer:{
        justifyContent : 'center',
        height : '40%',
        marginBottom : '5%',
        marginTop: '10%'
        
    },
    homeButton:{
        justifyContent :'center',
        alignItems : 'center',
        paddingLeft : '15%',
        paddingRight : '15%',
        marginBottom : '3%'
    },
    btn :{
        alignSelf : 'stretch',
        backgroundColor: '#c62339',
        borderWidth : 2,
        borderRadius: 10,
        borderColor : '#5d5185',
        justifyContent :'center',
        padding: 5,
        alignItems: 'center'
    },
    textbtn :{
        color : 'white',
        fontSize : 20,
        fontFamily : 'RobotoBold',
        padding: 5,
        justifyContent: 'center'
    },
    map:{
        flex:1
    },
    WelcomeContainer:{
        alignItems : 'center',
        justifyContent : 'center',
        alignSelf : 'stretch',
    },
    textWelcome:{
        fontSize : 30,
        fontFamily : 'RobotoBold'
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
    starContainer : {
        flexDirection : 'row',
        alignItems : 'center'
    },
    starBtn:{
        marginRight : '7%'
    },
    textLevel:{
        fontFamily : 'RobotoBold',
    }
})
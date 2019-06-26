import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, AsyncStorage, Platform, FlatList, ScrollView } from 'react-native';
import {Overlay} from 'react-native-elements';
import { Constants, MapView, Location, Permissions, Icon } from 'expo';
import { API_URL } from '../config/configfront';

import GeolocationRow from '../components/geolocationRow';
import UsersSpotRow from '../components/usersSpotRow';

/**
 * Class geolocation permet d'afficher la map et ses markers
 */
export default class Geolocation extends Component {
  state = {
    mapRegion: null,
    hasLocationPermissions: false,
    locationrmp: null,
    
    locationResult: null,
    markerList : [],
    userList : [],
    spotTitle : null, spotDescription : null, spotLevel : null,
    dialogVisible : true, 
    show : false,
    thumbs_up : 0,
    thumbs_down : 0,
    usersSpot : [],
    thumbsUpNumber : 0,
    thumbsDownNumber : 0
  };

  componentDidMount() {
    this._getLocationAsync();
    AsyncStorage.getItem("username", (err, res) =>  {
      if(res){
        fetch(`${API_URL}/skeedApp/usersMarkers/`+res, {
          method: 'GET',
          mode : 'cors',
          credentials : 'same-origin',
          headers: {
              'Content-type': 'application/json',
          }
        })
        .then((response)=> {
                //console.log(JSON.parse(response._bodyInit))
                this.setState({userList : JSON.parse(response._bodyInit)})
        })
        .catch((err)=>{
            console.log(err)
            alert("Error : Network request failed!")
        })
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
        alert("Error : Network request failed!")
    })  
  }

  _handleMapRegionChange = mapRegion => {
    //console.log(mapRegion);
    this.setState({ mapRegion });
  };

  _getLocationAsync = async () => {
   let { status } = await Permissions.askAsync(Permissions.LOCATION);
   if (status !== 'granted') {
     this.setState({
       locationResult: 'Permission to access location was denied',
     });
   } else {
     this.setState({ hasLocationPermissions: true });
   }

   let location = await Location.getCurrentPositionAsync({});
   this.setState({ locationResult: JSON.stringify(location) });
   
   
   // Center the map on the location we just fetched.
    this.setState({mapRegion: { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }});
  };

  markers(){
    return this.state.markerList.map((currentMarker, i) => {
        return <GeolocationRow currentMarker={currentMarker} getShow={this.getShow.bind(this)} key={i}/>
    })
  }
  usersMarkers(){
    return this.state.userList.map((currentUser, i) => {
      return <MapView.Marker
              coordinate={JSON.parse(currentUser.spotLocation).coords}
              title={currentUser.username}
              key={i}
              pinColor={'blue'}
            />
    })
  }
  getLikeNumber(title){
    fetch(`${API_URL}/skeedApp/thumbsup/`+title, {
      method: 'GET',
      mode : 'cors',
      credentials : 'same-origin',
      headers: {
          'Content-type': 'application/json',
      }
    })
    .then((response)=> {
            let number = JSON.parse(response._bodyInit).length
            this.setState({thumbsUpNumber : number})
    })
    .catch((err)=>{
        console.log(err)
    }) 
    fetch(`${API_URL}/skeedApp/thumbsdown/`+title, {
      method: 'GET',
      mode : 'cors',
      credentials : 'same-origin',
      headers: {
          'Content-type': 'application/json',
      }
    })
    .then((response)=> {
          let number = JSON.parse(response._bodyInit).length
          this.setState({thumbsDownNumber : number})
    })
    .catch((err)=>{
        console.log(err)
    })
  }
  likeSpot(){
    AsyncStorage.getItem("username",(err, res)=>{
      if(res){
        const like={
          spotTitle : this.state.spotTitle,
          username_like : res,
          username_unlike : 'none'
        }
        fetch(`${API_URL}/skeedApp/usersLike/`+res+'/'+this.state.spotTitle, {
          method: 'GET',
          mode : 'cors',
          credentials : 'same-origin',
          headers: {
              'Content-type': 'application/json',
          }
        })
        .then((response)=> {
            if(response.status === 200){
              if(this.state.thumbs_up === 1){
                alert("You have already like this spot")
              }else{
                let objt = JSON.parse(response._bodyInit)
                fetch(`${API_URL}/skeedApp/deleteLike/`+objt._id, {
                  method: 'DELETE',
                  mode : 'cors',
                  credentials : 'same-origin',
                  headers: {
                      'Content-type': 'application/json',
                  }
                })
                .then((response)=> {
                  console.log("like delete response",response)
                  this.getLikeNumber(this.state.spotTitle);
                })
              }
            }
            else{
              fetch(`${API_URL}/skeedApp/usersUnLike/`+res+'/'+this.state.spotTitle, {
                method: 'GET',
                mode : 'cors',
                credentials : 'same-origin',
                headers: {
                    'Content-type': 'application/json',
                }
              })
              .then((response)=> {
                  if(response.status === 200){
                    let objt = JSON.parse(response._bodyInit)
                    fetch(`${API_URL}/skeedApp/deleteLike/`+objt._id, {
                      method: 'DELETE',
                      mode : 'cors',
                      credentials : 'same-origin',
                      headers: {
                          'Content-type': 'application/json',
                      }
                    })
                    .then((response)=> {
                      if(response.status === 200){
                        fetch(`${API_URL}/skeedApp/likeSpot`,{
                          method : 'POST',
                          mode : 'cors',
                          credentials : 'same-origin',
                          headers :{
                          'Content-Type': 'application/json'},
                          body :JSON.stringify(like)})
                        .then((res) => {
                          if(res.status === 200){
                            this.getLikeNumber(this.state.spotTitle);
                              alert("Like ok")
                          }else{
                              alert("No like")
                          }
                        }).catch((err) => {
                            console.log("error: ",err)
                            alert("Like spot is not ok because : Network request failed")
                        })
                      }
                    })
                  }
                  else{
                    fetch(`${API_URL}/skeedApp/likeSpot`,{
                      method : 'POST',
                      mode : 'cors',
                      credentials : 'same-origin',
                      headers :{
                      'Content-Type': 'application/json'},
                      body :JSON.stringify(like)})
                    .then((res) => {
                      if(res.status === 200){
                        this.getLikeNumber(this.state.spotTitle);
                          alert("Like ok")
                      }else{
                          alert("No like")
                      }
                    }).catch((err) => {
                        console.log("error: ",err)
                        alert("Like spot is not ok because : Network request failed")
                    })
                  }
                })
            }

        })
        .catch((err)=>{
            console.log(err)
            alert("Error : Network request failed!")
        })
          
      }
    })
  }
  unLikeSpot(){
    AsyncStorage.getItem("username",(err, res)=>{
      if(res){
        const unlike={
          spotTitle : this.state.spotTitle,
          username_like : 'none',
          username_unlike : res
        }
        fetch(`${API_URL}/skeedApp/usersUnLike/`+res+'/'+this.state.spotTitle, {
          method: 'GET',
          mode : 'cors',
          credentials : 'same-origin',
          headers: {
              'Content-type': 'application/json',
          }
        })
        .then((response)=> {
            if(response.status === 200){
              if(this.state.thumbs_down === 1){
                alert("You have already unlike this spot")
              }else{
                let objt = JSON.parse(response._bodyInit)
                fetch(`${API_URL}/skeedApp/deleteLike/`+objt._id, {
                  method: 'DELETE',
                  mode : 'cors',
                  credentials : 'same-origin',
                  headers: {
                      'Content-type': 'application/json',
                  }
                })
                .then((response)=> {
                  console.log("unlike response ",response)
                  this.getLikeNumber(this.state.spotTitle);
                })
              }
            }
            else{
              fetch(`${API_URL}/skeedApp/usersLike/`+res+'/'+this.state.spotTitle, {
                method: 'GET',
                mode : 'cors',
                credentials : 'same-origin',
                headers: {
                    'Content-type': 'application/json',
                }
              })
              .then((response)=> {
                  if(response.status === 200){
                    let objt = JSON.parse(response._bodyInit)
                    fetch(`${API_URL}/skeedApp/deleteLike/`+objt._id, {
                      method: 'DELETE',
                      mode : 'cors',
                      credentials : 'same-origin',
                      headers: {
                          'Content-type': 'application/json',
                      }
                    })
                    .then((response)=> {
                      if(response.status === 200){
                        fetch(`${API_URL}/skeedApp/unLikeSpot`,{
                          method : 'POST',
                          mode : 'cors',
                          credentials : 'same-origin',
                          headers :{
                          'Content-Type': 'application/json'},
                          body :JSON.stringify(unlike)})
                        .then((res) => {
                          if(res.status === 200){
                            this.getLikeNumber(this.state.spotTitle);
                              alert("unLike ok")
                          }else{
                              alert("No unLlike")
                          }
                        }).catch((err) => {
                            console.log("error: ",err)
                            alert("unLike spot is not ok because : Network request failed")
                        })
                      }
                    })
                  }
                  else{
                    fetch(`${API_URL}/skeedApp/unLikeSpot`,{
                        method : 'POST',
                        mode : 'cors',
                        credentials : 'same-origin',
                        headers :{
                        'Content-Type': 'application/json'},
                        body :JSON.stringify(unlike)})
                    .then((res) => {
                        if(res.status === 200){
                          this.getLikeNumber(this.state.spotTitle);
                            alert("unLike ok")
                        }else{
                            alert("No unLlike")
                        }
                    }).catch((err) => {
                        console.log("error: ",err)
                        alert("unLike spot is not ok because : Network request failed")
                    })
                  }
                })
            }
          })
        }
    })
  }
  getShow(spot, bool){
    this.setState({
      spotTitle : spot.title,
      spotDescription : spot.description,
      spotLevel : spot.level,
      show : bool
    })
    this.getLikeNumber(spot.title);
  }
  thumbsUp(){
    if(this.state.thumbs_up === 1){
      this.setState({thumbs_up : 0, thumbs_down : 0})
      this.likeSpot();
    }else{
      this.setState({thumbs_up : 1, thumbs_down : 0})
      this.likeSpot();
    }
  }
  thumbsDown(){
    if(this.state.thumbs_down === 1){
      this.setState({thumbs_down : 0, thumbs_up : 0})
      this.unLikeSpot();
    }else{
      this.setState({thumbs_down : 1, thumbs_up : 0})
      this.unLikeSpot();
    }
  }
  spotLevel(){
    if(this.state.spotLevel === 1){
      return <Icon.Ionicons name={Platform.OS === 'ios' ? 'ios-star' : 'md-star'} size={30} style={{color : 'gold'}}/>
    }else if(this.state.spotLevel === 2){
      return <View style={styles.OverlayInfoStar}><Icon.Ionicons name={Platform.OS === 'ios' ? 'ios-star' : 'md-star'} size={30} style={{color : 'gold'}}/>
      <Icon.Ionicons name={Platform.OS === 'ios' ? 'ios-star' : 'md-star'} size={30} style={{color : 'gold'}}/></View>
    }else if(this.state.spotLevel === 3){
      return <View style={styles.OverlayInfoStar}><Icon.Ionicons name={Platform.OS === 'ios' ? 'ios-star' : 'md-star'} size={30} style={{color : 'gold'}}/>
      <Icon.Ionicons name={Platform.OS === 'ios' ? 'ios-star' : 'md-star'} size={30} style={{color : 'gold'}}/>
      <Icon.Ionicons name={Platform.OS === 'ios' ? 'ios-star' : 'md-star'} size={30} style={{color : 'gold'}}/></View>
    }else if(this.state.spotLevel === 4){
      return <View style={styles.OverlayInfoStar}><Icon.Ionicons name={Platform.OS === 'ios' ? 'ios-star' : 'md-star'} size={30} style={{color : 'gold'}}/>
      <Icon.Ionicons name={Platform.OS === 'ios' ? 'ios-star' : 'md-star'} size={30} style={{color : 'gold'}}/>
      <Icon.Ionicons name={Platform.OS === 'ios' ? 'ios-star' : 'md-star'} size={30} style={{color : 'gold'}}/>
      <Icon.Ionicons name={Platform.OS === 'ios' ? 'ios-star' : 'md-star'} size={30} style={{color : 'gold'}}/></View>
    }else if(this.state.spotLevel === 5){
      return <View style={styles.OverlayInfoStar}><Icon.Ionicons name={Platform.OS === 'ios' ? 'ios-star' : 'md-star'} size={30} style={{color : 'gold'}}/>
      <Icon.Ionicons name={Platform.OS === 'ios' ? 'ios-star' : 'md-star'} size={30} style={{color : 'gold'}}/>
      <Icon.Ionicons name={Platform.OS === 'ios' ? 'ios-star' : 'md-star'} size={30} style={{color : 'gold'}}/>
      <Icon.Ionicons name={Platform.OS === 'ios' ? 'ios-star' : 'md-star'} size={30} style={{color : 'gold'}}/>
      <Icon.Ionicons name={Platform.OS === 'ios' ? 'ios-star' : 'md-star'} size={30} style={{color : 'gold'}}/></View>
    }
  }
  showSpot(){
    return(
          <Overlay
            isVisible={this.state.show}
            onBackdropPress={() => this.setState({ show: false })}
          >
            <View style={{alignItems : 'center', justifyContent : 'center'}}>
              <View style={styles.OverlayTitleContainer}>
                <Text style={styles.OverlayTitle}>Spot</Text>
                <Text style={styles.OverlayTitleSpot}>{this.state.spotTitle}</Text>
              </View>
              <View style={styles.OverlayInfoContainer}>
                <View style={styles.OverlayInfo}>
                  <Icon.Ionicons 
                    name={Platform.OS === 'ios' ? 'ios-list' : 'md-list'}
                    size={30}
                    style={{color : 'black', marginRight : '6%'}}
                  />
                  <Text style={styles.OverlayInfoText}>{this.state.spotDescription}</Text>
                </View>
                <View style={styles.OverlayInfo}>
                  <Icon.Ionicons 
                    name={Platform.OS === 'ios' ? 'ios-flame' : 'md-flame'}
                    size={30}
                    style={{color : 'orange', marginRight : '6%'}}
                  />
                  {this.spotLevel()}
                </View>
              </View>
                  <Text style={styles.textThumbs}>Do you like this spot?</Text>
              <View style={styles.thumbsContainer}>
                <TouchableOpacity style={styles.thumbsBtn} onPress={() => this.thumbsUp()}>
                    {this.state.thumbs_up === 0 ? 
                    <Icon.Ionicons 
                    name={Platform.OS === 'ios' ? 'ios-thumbs-up' : 'md-thumbs-up'}
                    size={50}
                    style={{color : 'black'}}
                    />
                    :<Icon.Ionicons 
                        name={Platform.OS === 'ios' ? 'ios-thumbs-up' : 'md-thumbs-up'}
                        size={50}
                        style={{color : 'blue'}}
                    />}
                    <View>
                      <Text>( {this.state.thumbsUpNumber} )</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.thumbsBtn} onPress={() => this.thumbsDown()}>
                    {this.state.thumbs_down === 0 ? 
                    <Icon.Ionicons 
                    name={Platform.OS === 'ios' ? 'ios-thumbs-down' : 'md-thumbs-down'}
                    size={50}
                    style={{color : 'black'}}
                    />
                    :<Icon.Ionicons 
                        name={Platform.OS === 'ios' ? 'ios-thumbs-down' : 'md-thumbs-down'}
                        size={50}
                        style={{color : 'red'}}
                    />}
                    <View>
                      <Text>( {this.state.thumbsDownNumber} )</Text>
                    </View>
                </TouchableOpacity>
              </View>
              <View style={styles.flatlistContainer}>
                <Text>Skeeder on the spot :</Text>
                  <View>
                    {/* <FlatList
                        data={this.state.usersSpot}
                        keyExtractor={(item)=>item.id.toString()}
                        renderItem={({item})=><UsersSpotRow user={item}/>}
                    /> */}
                  </View>
              </View>
              </View>
            </Overlay>
        )
}
  render() {
    return (
      <View style={styles.container}>
        
        {
          this.state.locationResult === null ?
          <Text>Finding your current location...</Text> :
          this.state.hasLocationPermissions === false ?
            <Text>Location permissions are not granted.</Text> :
            this.state.mapRegion === null ?
            <Text>Map region doesn't exist.</Text> :
          
            <MapView
              style={{ alignSelf: 'stretch', height: '135%' }}
              region={this.state.mapRegion}
              onRegionChange={this._handleMapRegionChange}
            >
               <MapView.Marker
          
                coordinate={JSON.parse(this.state.locationResult).coords}
                title="My Marker"
                description="My position marker"
                
                />
              {/* <MapView.Marker
              coordinate={{longitude : 2.364, latitude : 48.8153}}
              title="distance"
              description="Some description"
              pinColor={'blue'}
              
              /> */}
              {this.markers()}
              {this.usersMarkers()}
              
            </MapView>

          
        }
        {this.state.show ? this.showSpot() : <View></View>}
        
      </View>
        
    );
  }
}

const styles = StyleSheet.create({
  container: {
  
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    //backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
  thumbsContainer : {
    flexDirection : 'row',
    alignItems : 'center',
    justifyContent : 'center',
    marginBottom : '7%'
  },
  thumbsBtn:{
      marginRight : '15%',
      marginLeft : '15%'
  },
  textThumbs:{
      fontFamily : 'RobotoBold'
  },
  OverlayTitle:{
    fontFamily : 'Cutefont',
    color : '#c62339',
    fontWeight : 'bold',
    fontSize : 40,
  },
  OverlayTitleSpot:{
    color : '#c62339',
    fontFamily : 'RobotoBold',
    fontSize : 25
  },
  OverlayTitleContainer:{
    marginBottom : '10%',
    alignItems : 'center',
    justifyContent : 'center'
  },
  OverlayInfoContainer:{
    marginBottom : '10%',
    alignItems : 'flex-start'
  },
  OverlayInfo:{
    flexDirection : 'row',
    alignItems : 'center',
    justifyContent : 'center'
  },
  OverlayInfoText:{
    fontFamily : 'RobotoThin',
    fontSize : 14
  },
  OverlayInfoStar:{
    flexDirection : 'row',
  },
  flatlistContainer:{
    alignSelf : 'stretch'
  }
});
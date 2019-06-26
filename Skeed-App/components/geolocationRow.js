import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, AsyncStorage } from 'react-native';
import { Constants, MapView, Location, Permissions } from 'expo';

export default class GeolocationRow extends Component {

    render(){
        const {getShow, currentMarker}=this.props;
        return (
            <MapView.Marker
                coordinate={JSON.parse(currentMarker.spotLocation).coords}
                title={currentMarker.title}
                description={currentMarker.description + " , Level => "+currentMarker.level}
                onPress={()=> {
                  getShow(currentMarker, true);
                }}
              >
                <Image
                  source={require('../assets/marker.png')}
                  style={{width : 30, height : 38, marginBottom : 35}}
                />
              </MapView.Marker>
        )
    }
}
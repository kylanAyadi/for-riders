import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, AsyncStorage, ActivityIndicator} from 'react-native';

export default class UsersSpotRow extends React.Component {
 
    render() {
        const {user} = this.props;
        return (
        <View style={styles.main_container}>
            
        </View>
        )
      }
    }
    
    const styles = StyleSheet.create({
    
      main_container: {
        flexDirection: 'row',
        backgroundColor : 'white',
        marginBottom : 10,
      }
    })    
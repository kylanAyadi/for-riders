/**
 *Fichier : Homepage.js
 *Localisation : Skeed-App/components/homepage
 *Author : Dracarys
 *Date : 24/05/2019
*/

/**
 *Titre : Import
 *Description : import des fichiers component pour la navigation
 * + import des modules nécéssaires de réact
*/
import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Slideshow from 'react-native-slideshow';

/**
 * Class Homepage est la page d'accueil affichée à l'utilisateur non connecté
 */
export default class Homepage extends React.Component {
    static navigationOptions = {
        header: null,
      };
      /**
       * Initialisation des différentes variables dans le constructor.
       */
      constructor(props){
          super(props);
          this.state={
              position : 1,
              height : 300,
              interval : null,
              dataSource : [{
                  url : 'http://a54.idata.over-blog.com/300x199/6/01/48/17/cotentin-web-15/cotentin-web-16/cotentin-web-17/cotentin-web-18/cotentin-web-19/cotentin-web-20/cotentin-web-21/cotentin-22/23/skate.jpg'
              }, {
                url : 'https://lvdneng.rosselcdn.net/sites/default/files/dpistyles_v2/ena_16_9_extra_big/2017/04/20/node_150772/27756344/public/2017/04/20/B9711775631Z.1_20170420103710_000%2BG6A8TL5S3.2-0.jpg?itok=3moAKUHE'
              }, {
                url : 'https://www.ouest-france.fr/sites/default/files/styles/image-640x360/public/2018/10/25/au-skate-park-la-jeunesse-fait-bonne-figure.jpg?itok=CZlvbYSz'
              }, {
                url : 'https://image.redbull.com/rbcom/052/2017-11-10/63815b7a-37bc-480e-b018-b66578477454/0012/0/0/8/2832/4256/800/1/alex-hallford-front-smith.jpg'
              },],
          };
      }
      /**
       * ComponentWillMount and ComponentWillUnmount permettent la gestion des défilements d'image automatiquement
       */
      componentWillMount() {
        this.setState({
          interval: setInterval(() => {
            this.setState({
              position: this.state.position === this.state.dataSource.length-1 ? 0 : this.state.position + 1
            });
          }, 2000)
        });
      }  
      componentWillUnmount() {
        clearInterval(this.state.interval);
      }
    /**
     * Fonction render qui applique la view Homepage, avec Logo en entête, Image défilante, bouton login et bouton register.
     */
    render(){
        return(
            <View style={styles.main_container}>
                <View style={styles.entete}>
                    <Image
                        source={require('../assets/SkeedLogo.png')}
                        style={{width : 90, height : 90}}
                    />
                    <Text style={styles.titleLogo}>skeed</Text>
                </View>
                <View style={styles.imageContainer}>
                    {/*Dans slideshow.js : mise en commentaire de certaine view(arrow right,arrow left and position image line.237) */}
                    <Slideshow
                        dataSource={this.state.dataSource}
                        position={this.state.position}
                        onPositionChanged={position => this.setState({ position })}
                        height={this.state.height}
                        />
                </View>
                {/* <View style={styles.homeButton}>
                    <TouchableOpacity style={styles.btn} onPress={()=>this.props.navigation.navigate("Documentation")}>
                        <Text style={styles.textbtn}>DOCS</Text>
                    </TouchableOpacity>
                </View> */}
                <View style={styles.homeButton}>
                    <TouchableOpacity style={styles.btn} onPress={()=>{this.props.navigation.navigate("Register")}}>
                        <Text style={styles.textbtn}>Register</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.homeButton}>
                    <TouchableOpacity style={styles.btn} onPress={()=>this.props.navigation.navigate("Login")}>
                        <Text style={styles.textbtn}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

/**
 * Mise en page de la vue.
 */
const styles = StyleSheet.create({
    main_container : {
        flex : 1,
        marginTop : '5%'
    },
    titleLogo:{
        fontSize : 120,
        fontFamily : 'Cutefont',
        position : 'relative',
        top : 0
    },
    entete :{
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'center',
        marginBottom : '0%'
    },
    imageContainer:{
        justifyContent : 'center',
        alignItems : 'center',
        height : 280,
        marginBottom : '0%',
        position : 'relative',
        top: '2%'
    },
    homeButton:{
        justifyContent :'center',
        alignItems : 'center',
        
        position: 'relative',
        paddingLeft : '15%',
        paddingRight : '15%',
        top : '8%',
        marginBottom : '4%'
    },
    btn :{
        alignSelf : 'stretch',
        backgroundColor: '#c62339',
        borderWidth : 2,
        borderRadius: 10,
        borderColor : '#5d5185',
        justifyContent :'center',
        padding: 10,
        alignItems: 'center'
    },
    textbtn :{
        color : 'white',
        fontSize : 18,
        fontFamily : 'RobotoBold',
        padding: 10,
        justifyContent: 'center'
    }
})
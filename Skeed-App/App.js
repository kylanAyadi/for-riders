/**
 * File name : App.js
 Location : App.js
 Author : Dracarys
 Date : 24/05/2019
 */

 /**
  * import du module de navigation
  */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import Navigation from './navigation/Navigation';

export default class App extends React.Component {
  /**
   * initialisation de variables :
   * isLoadingComplete correspond aux éléments de la page qui doivent être chargés
   * isfontLoaded : utilisation de fonts personnalisés
   */
  state = {
    isLoadingComplete: false,
    isfontLoaded: false,
  };

  /**
   * AppLoading : module d'expo qui se passe avant le chargement des éléments de la page, lorsque celui est chargé on passe au else qui affiche les components de la page
   */
  
  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          <Navigation />
        </View>
      );
    }
  }

/**
 * tous les éléments de fonts personnalisés pour notre appli 
 */
_loadResourcesAsync = async () => {
  return Promise.all([
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Icon.Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free
      // to remove this if you are not using it in your app
      //'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      'Cutefont': require('./assets/fonts/CuteFont-Regular.ttf'),
      'RobotoThin': require('./assets/fonts/RobotoMono-Thin.ttf'),
      'RobotoBold': require('./assets/fonts/Roboto_Mono/RobotoMono-Bold.ttf'),
      'RobotoBoldItalic': require('./assets/fonts/Roboto_Mono/RobotoMono-BoldItalic.ttf'),
      'RobotoItalic': require('./assets/fonts/Roboto_Mono/RobotoMono-Italic.ttf'),
      'RobotoLight': require('./assets/fonts/Roboto_Mono/RobotoMono-Light.ttf'),
      'RobotoLightItalic': require('./assets/fonts/Roboto_Mono/RobotoMono-LightItalic.ttf'),
      'RobotoMedium': require('./assets/fonts/Roboto_Mono/RobotoMono-Medium.ttf'),
      'RobotoMediumItalic': require('./assets/fonts/Roboto_Mono/RobotoMono-MediumItalic.ttf'),
      'RobotoRegular': require('./assets/fonts/Roboto_Mono/RobotoMono-Regular.ttf'),
      'RobotoThinItalic': require('./assets/fonts/Roboto_Mono/RobotoMono-ThinItalic.ttf')
    }),
  ]);
};
_handleLoadingError = error => {
  // In this case, you might want to report the error to your error
  // reporting service, for example Sentry
  console.warn(error);
};

_handleFinishLoading = () => {
  this.setState({ isLoadingComplete: true });
};

}

/**
 * Mise en forme de la vue
 */
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});

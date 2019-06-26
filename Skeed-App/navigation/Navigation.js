/**
 *Fichier : Navigation.js
 *Localisation : Skeed-App/navigation
 *Author : Dracarys
 *Date : 24/05/2019
*/

/**
 *Titre : Import
 *Description : import des fichiers component pour la navigation
 * + import des modules nécéssaires de réact
*/
import { createStackNavigator, createAppContainer, createSwitchNavigator} from 'react-navigation';
import Homepage from '../components/homepage';
import Login from '../components/login';
import Register from '../components/register'; 
import HomeIn from '../components/homein';
import Profile from '../components/profile';
import Account from '../components/account';
import Documentation from '../components/documentation';
import ForgotPassword from '../components/forgotPassword';

/**
 *Titre : Création des stacks de navigation
 *Description : La stack de navigation HomeStack est composé :
 *  - du component Homepage(vue principale)
 *  - du component Login
 *  - du component Register
 * l'appuie sur le bouton login est redirigé vers Login et le bouton register vers Register
*/
const HomeStack = createStackNavigator({
    Home : {
        screen : Homepage
    },
    Login:{
        screen : Login
    },
    Register : {
        screen : Register 
    },
    Documentation:{
        screen : Documentation
    },
    ForgotPassword : {
        screen : ForgotPassword
    }
})
/**
 *Description : La stack de navigation HomeInStack est composé du component HomeIn.
 *Cette route est accessible après connexion de l'utilisateur via le component Login
*/
const HomeInStack = createStackNavigator({
    HomeIn : {
        screen : HomeIn
    },
    Profile : {
        screen : Profile
    },
    Account : {
        screen : Account
    }
})


export default createAppContainer(createSwitchNavigator({HomeStack, HomeInStack}))
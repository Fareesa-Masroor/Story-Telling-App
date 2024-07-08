import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import StackNavigator from "./StackNavigator";
import Profile from "../screens/Profile";
import LogOutScreen from '../screens/LogOut'
import firebase from 'firebase'

const Drawer = createDrawerNavigator();

 export default class DrawerNavigator extends React.Component{
   constructor(){
     super()
     this.state={
       light_theme:{}
     }

   }
   
  async fetchUser() {
    let theme;
    await firebase
      .database()
      .ref('/users/' + firebase.auth().currentUser.uid)
      .on('value', function (snapshot) {
        theme = snapshot.val().current_theme;
      });
    this.setState({
      light_theme: theme === 'light',
    });
  }
   render(){
  return(
    <Drawer.Navigator drawerContentOptions={{
      activeTintColor: '#e91e63'
    }}>
      <Drawer.Screen name="Home" component={StackNavigator} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="LogOut" component={LogOutScreen} />
    </Drawer.Navigator>
  )
}
 }

 

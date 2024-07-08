import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigator from "../navigation/DrawerNavigator";
import firebase from 'firebase'

 



export default class DashboardScreen extends React.Component{
  componentDidMount(){
    this.fetchUser()
  }

 async fetchUser(){
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
  return (
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
  );
}}
